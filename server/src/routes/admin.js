import express from "express";
import { db } from "../db.js";
import { klaviyo } from "../integrations/klaviyo.js";
import { resend } from "../integrations/resend.js";
import { meta } from "../integrations/meta.js";

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

adminRouter.get("/admin/automation-sends", requireAdmin, (req, res) => {
  const sends = db
    .prepare(`SELECT flow, step, email, sent_at FROM automation_sends ORDER BY sent_at DESC LIMIT 100`)
    .all();
  res.json({ sends });
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
