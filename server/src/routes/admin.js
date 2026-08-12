import express from "express";
import { db } from "../db.js";
import { klaviyo } from "../integrations/klaviyo.js";
import { resend } from "../integrations/resend.js";
import { meta } from "../integrations/meta.js";
import { FLOW_STEPS } from "../jobs/automations.js";

export const adminRouter = express.Router();

function requireAdmin(req, res, next) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    return res.status(503).json({
      error: "Admin dashboard isn't set up yet. Set ADMIN_TOKEN in server/.env.",
    });
  }
  const header = req.get("authorization") || "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (provided !== token) {
    return res.status(401).json({ error: "Invalid admin token." });
  }
  next();
}

adminRouter.get("/admin/orders", requireAdmin, (req, res) => {
  const sessions = db
    .prepare(
      `SELECT id, email, cart_json, total_amount, status, created_at, completed_at
       FROM checkout_sessions ORDER BY created_at DESC LIMIT 200`
    )
    .all()
    .map((row) => ({ ...row, cart: JSON.parse(row.cart_json) }));

  const counts = db
    .prepare(`SELECT status, COUNT(*) as count FROM checkout_sessions GROUP BY status`)
    .all();

  const subscriberCount = db.prepare(`SELECT COUNT(*) as count FROM subscribers`).get().count;

  res.json({ sessions, counts, subscriberCount });
});

adminRouter.get("/admin/page-views", requireAdmin, (req, res) => {
  const total = db.prepare(`SELECT COUNT(*) as count FROM page_views`).get().count;

  const last7Days = db
    .prepare(
      `SELECT COUNT(*) as count FROM page_views WHERE created_at >= datetime('now', '-7 days')`
    )
    .get().count;

  const byDay = db
    .prepare(
      `SELECT date(created_at) as day, COUNT(*) as count
       FROM page_views
       WHERE created_at >= datetime('now', '-30 days')
       GROUP BY day
       ORDER BY day DESC`
    )
    .all();

  res.json({ total, last7Days, byDay });
});

// Case-study-oriented view: unique visitors, traffic source breakdown, the
// visit -> cart -> purchase funnel with rates, and revenue. Separate from
// /admin/page-views (which is just a raw view counter) since this is meant
// to answer "how did the ad campaign actually perform," not "is the site
// getting traffic."
adminRouter.get("/admin/marketing-stats", requireAdmin, (req, res) => {
  const uniqueVisitors = db
    .prepare(`SELECT COUNT(DISTINCT visitor_id) as count FROM page_views WHERE visitor_id IS NOT NULL`)
    .get().count;

  const homepageViews = db
    .prepare(`SELECT COUNT(*) as count FROM page_views WHERE path = '/'`)
    .get().count;

  const trafficSources = db
    .prepare(
      `SELECT COALESCE(NULLIF(utm_source, ''), 'direct / organic') as source,
              COUNT(*) as views,
              COUNT(DISTINCT visitor_id) as visitors
       FROM page_views
       GROUP BY source
       ORDER BY views DESC`
    )
    .all();

  const cartsStarted = db.prepare(`SELECT COUNT(*) as count FROM checkout_sessions`).get().count;
  const purchases = db.prepare(`SELECT COUNT(*) as count FROM orders`).get().count;

  const revenueRow = db.prepare(`SELECT COALESCE(SUM(total_amount), 0) as total FROM orders`).get();
  const revenue = revenueRow.total;
  const aov = purchases > 0 ? revenue / purchases : 0;

  const rate = (num, denom) => (denom > 0 ? (num / denom) * 100 : 0);

  res.json({
    uniqueVisitors,
    homepageViews,
    trafficSources,
    funnel: {
      visitors: uniqueVisitors,
      cartsStarted,
      purchases,
      visitorToCartRate: rate(cartsStarted, uniqueVisitors),
      cartToPurchaseRate: rate(purchases, cartsStarted),
      overallConversionRate: rate(purchases, uniqueVisitors),
    },
    revenue,
    aov,
  });
});

// Wipes traffic/order data so stats reflect only real activity going
// forward — meant for clearing out development/test data once before
// real ad traffic starts, not a routine action. Leaves automation_sends
// and email_suppressions untouched: the first is just harmless dedup
// bookkeeping, the second is real consent state that must never be reset
// (deleting it would mean re-emailing someone who unsubscribed).
adminRouter.post("/admin/reset-stats", requireAdmin, (req, res) => {
  const counts = {
    page_views: db.prepare(`SELECT COUNT(*) as c FROM page_views`).get().c,
    checkout_sessions: db.prepare(`SELECT COUNT(*) as c FROM checkout_sessions`).get().c,
    orders: db.prepare(`SELECT COUNT(*) as c FROM orders`).get().c,
    subscribers: db.prepare(`SELECT COUNT(*) as c FROM subscribers`).get().c,
  };

  const reset = db.transaction(() => {
    db.prepare(`DELETE FROM page_views`).run();
    db.prepare(`DELETE FROM orders`).run();
    db.prepare(`DELETE FROM checkout_sessions`).run();
    db.prepare(`DELETE FROM subscribers`).run();
  });
  reset();

  res.json({ ok: true, deleted: counts });
});

adminRouter.get("/admin/automation-sends", requireAdmin, (req, res) => {
  const sends = db
    .prepare(`SELECT flow, step, email, sent_at FROM automation_sends ORDER BY sent_at DESC LIMIT 100`)
    .all();
  res.json({ sends });
});

// Which scents/photos get clicked, and how often add-to-cart gets hit —
// grouped counts per event type, most-clicked label first.
adminRouter.get("/admin/interaction-stats", requireAdmin, (req, res) => {
  const rows = db
    .prepare(
      `SELECT event_type, label, COUNT(*) as count
       FROM interaction_events
       GROUP BY event_type, label
       ORDER BY event_type, count DESC`
    )
    .all();

  const grouped = {};
  for (const row of rows) {
    if (!grouped[row.event_type]) grouped[row.event_type] = [];
    grouped[row.event_type].push({ label: row.label, count: row.count });
  }

  res.json({ events: grouped });
});

// "Is the 15-minute email sweep actually running" — a direct, checkable
// answer instead of inferring it from whether one customer's inbox looks
// right. The job overwrites this single row every time it runs.
adminRouter.get("/admin/automation-health", requireAdmin, (req, res) => {
  const row = db.prepare(`SELECT last_run_at, last_sent_count FROM automation_runs WHERE id = 1`).get();
  if (!row) {
    return res.json({ lastRunAt: null, lastSentCount: null, minutesAgo: null });
  }
  const minutesAgo = Math.round((Date.now() - new Date(row.last_run_at + "Z").getTime()) / 60000);
  res.json({ lastRunAt: row.last_run_at, lastSentCount: row.last_sent_count, minutesAgo });
});

// Which automation flow (if any) an email is currently sitting in, and how
// far through it they are — mirrors the eligibility rules the sweep itself
// uses in jobs/automations.js, simplified to "most recent order" per email
// rather than every order, since this is a per-customer summary view.
function currentFlowFor(email) {
  const startedCheckout = db
    .prepare(
      `SELECT id, created_at FROM checkout_sessions WHERE email = ? AND status = 'started'
       ORDER BY created_at DESC LIMIT 1`
    )
    .get(email);
  if (startedCheckout) {
    return { flow: "abandoned_checkout", anchorAt: startedCheckout.created_at, referenceId: String(startedCheckout.id) };
  }

  const latestOrder = db
    .prepare(`SELECT id, created_at FROM orders WHERE email = ? ORDER BY created_at DESC LIMIT 1`)
    .get(email);
  if (latestOrder) {
    const elapsedMinutes = (Date.now() - new Date(latestOrder.created_at + "Z").getTime()) / 60000;
    if (elapsedMinutes <= FLOW_STEPS.winback[0]) {
      return { flow: "post_purchase", anchorAt: latestOrder.created_at, referenceId: String(latestOrder.id) };
    }
    return { flow: "winback", anchorAt: latestOrder.created_at, referenceId: String(latestOrder.id) };
  }

  const everStartedCheckout = db.prepare(`SELECT 1 FROM checkout_sessions WHERE email = ? LIMIT 1`).get(email);
  if (!everStartedCheckout) {
    const subscriber = db.prepare(`SELECT id, created_at FROM subscribers WHERE email = ?`).get(email);
    if (subscriber) {
      return { flow: "welcome", anchorAt: subscriber.created_at, referenceId: String(subscriber.id) };
    }
  }

  return null;
}

function computeStage({ flow, anchorAt, referenceId }, email) {
  const steps = FLOW_STEPS[flow];
  const elapsedMinutes = (Date.now() - new Date(anchorAt + "Z").getTime()) / 60000;
  const sentSteps = db
    .prepare(`SELECT step FROM automation_sends WHERE flow = ? AND email = ? AND reference_id = ?`)
    .all(flow, email, referenceId)
    .map((r) => r.step);
  const stepsSent = sentSteps.length ? Math.max(...sentSteps) : 0;

  if (stepsSent >= steps.length) {
    return { flow, stepsSent, totalSteps: steps.length, status: "complete" };
  }

  const nextThreshold = steps[stepsSent]; // 0-based index == next step to send
  const minutesUntilDue = Math.round(nextThreshold - elapsedMinutes);
  return {
    flow,
    stepsSent,
    totalSteps: steps.length,
    nextStep: stepsSent + 1,
    status: minutesUntilDue <= 0 ? "due" : "waiting",
    minutesUntilDue: Math.max(0, minutesUntilDue),
  };
}

// One row per email we've ever heard from (subscribed, started a checkout,
// or ordered) — unsubscribed status, which automation they're currently in
// and how far along, and their total order count. Answers "what email is
// this person on" and "have they bought before" without cross-referencing
// four separate tables by hand.
adminRouter.get("/admin/customers", requireAdmin, (req, res) => {
  const emails = db
    .prepare(
      `SELECT email FROM subscribers
       UNION
       SELECT email FROM checkout_sessions
       UNION
       SELECT email FROM orders`
    )
    .all()
    .map((r) => r.email);

  const customers = emails.map((email) => {
    const unsubscribed = Boolean(
      db.prepare(`SELECT 1 FROM email_suppressions WHERE email = ?`).get(email.toLowerCase())
    );
    const orderCount = db.prepare(`SELECT COUNT(*) as c FROM orders WHERE email = ?`).get(email).c;

    let stage = null;
    if (!unsubscribed) {
      const current = currentFlowFor(email);
      if (current) stage = computeStage(current, email);
    }

    return { email, unsubscribed, orderCount, stage };
  });

  customers.sort((a, b) => {
    if (Boolean(a.stage) !== Boolean(b.stage)) return a.stage ? -1 : 1;
    if (b.orderCount !== a.orderCount) return b.orderCount - a.orderCount;
    return a.email.localeCompare(b.email);
  });

  res.json({ customers });
});

// Cheap presence check for every integration — no API calls, just "is the
// key actually set on this running server right now."
adminRouter.get("/admin/integration-status", requireAdmin, (req, res) => {
  res.json({
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    stripeWebhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    klaviyo: klaviyo.isConfigured(),
    resend: resend.isConfigured(),
    meta: meta.isConfigured(),
  });
});

// Actually attempts a real send to Meta right now and returns the exact
// result or error — the definitive answer instead of guessing from logs.
adminRouter.post("/admin/test-meta", requireAdmin, async (req, res) => {
  if (!meta.isConfigured()) {
    return res.json({ ok: false, reason: "not_configured", message: "META_PIXEL_ID / META_ACCESS_TOKEN not set." });
  }
  try {
    const result = await meta.sendEvent({
      eventName: "InitiateCheckout",
      eventId: `admin-test-${Date.now()}`,
      email: "test@soyahaven.com",
      sourceUrl: process.env.FRONTEND_URL || "https://soyahaven.com",
      customData: { value: 1, currency: "USD" },
    });
    res.json({ ok: true, result });
  } catch (err) {
    res.json({ ok: false, reason: "send_failed", message: err.message });
  }
});
