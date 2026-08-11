import cron from "node-cron";
import { db } from "../db.js";
import { resend } from "../integrations/resend.js";
import { unsubscribeUrl } from "../lib/unsubscribe.js";
import {
  abandonedCheckoutEmail,
  welcomeEmail,
  postPurchaseEmail,
  winbackEmail,
} from "../emails/templates.js";

// All thresholds in minutes since the flow's anchor time (cart started,
// subscribed, order placed, or last order date for winback).
const ABANDONED_STEPS = [60, 24 * 60, 72 * 60]; // 1h, 24h, 72h
const WELCOME_STEPS = [0, 3 * 24 * 60, 7 * 24 * 60]; // immediate, 3d, 7d
// Post-purchase Email 1 is written for "order shipped," but the site has
// no real shipping-status event yet — 3 days approximates the "processed
// within 3 days" promise elsewhere on the site until real tracking exists.
const POST_PURCHASE_STEPS = [3 * 24 * 60, 15 * 24 * 60, 60 * 24 * 60]; // 3d, 15d, 60d
const WINBACK_STEPS = [90 * 24 * 60, 97 * 24 * 60]; // 90d, 97d

// Exposed so the admin "what stage is this email on" view can compute the
// same next-due-step math as the sweep itself, without duplicating or
// drifting from these numbers.
export const FLOW_STEPS = {
  abandoned_checkout: ABANDONED_STEPS,
  welcome: WELCOME_STEPS,
  post_purchase: POST_PURCHASE_STEPS,
  winback: WINBACK_STEPS,
};

function isSuppressed(email) {
  return Boolean(
    db.prepare(`SELECT 1 FROM email_suppressions WHERE email = ?`).get(email.toLowerCase())
  );
}

function hasSent(flow, step, email, referenceId) {
  return Boolean(
    db
      .prepare(
        `SELECT 1 FROM automation_sends WHERE flow = ? AND step = ? AND email = ? AND reference_id = ?`
      )
      .get(flow, step, email, referenceId)
  );
}

function markSent(flow, step, email, referenceId) {
  db.prepare(
    `INSERT INTO automation_sends (flow, step, email, reference_id) VALUES (?, ?, ?, ?)
     ON CONFLICT(flow, step, email, reference_id) DO NOTHING`
  ).run(flow, step, email, referenceId);
}

function minutesSince(isoDate) {
  return (Date.now() - new Date(isoDate + "Z").getTime()) / 60000;
}

// Sends whichever is the next unsent, due step for one entity (a checkout
// session, subscriber, order, etc). Steps must be sent in order — this
// only ever sends one step per sweep per entity, the next due one.
async function processEntity({ flow, email, referenceId, anchorAt, steps, buildEmail }) {
  if (isSuppressed(email)) return false;

  const elapsed = minutesSince(anchorAt);
  for (let i = 0; i < steps.length; i++) {
    const step = i + 1;
    if (elapsed < steps[i]) break; // not due yet, and steps are ordered
    if (hasSent(flow, step, email, referenceId)) continue;

    const { subject, html } = buildEmail(step);
    try {
      await resend.sendEmail({ to: email, subject, html, unsubscribeUrl: unsubscribeUrl(email) });
      markSent(flow, step, email, referenceId);
      return true;
    } catch (err) {
      console.error(`${flow} step ${step} failed for ${email}:`, err.message);
      return false;
    }
  }
  return false;
}

async function sweepAbandonedCheckout() {
  const rows = db
    .prepare(`SELECT * FROM checkout_sessions WHERE status = 'started'`)
    .all();

  let sent = 0;
  for (const row of rows) {
    const cart = JSON.parse(row.cart_json);
    const didSend = await processEntity({
      flow: "abandoned_checkout",
      email: row.email,
      referenceId: String(row.id),
      anchorAt: row.created_at,
      steps: ABANDONED_STEPS,
      buildEmail: (step) => abandonedCheckoutEmail(step, row.email, { scent: cart[0]?.scent }),
    });
    if (didSend) sent++;
  }
  return sent;
}

async function sweepWelcome() {
  // Anyone who subscribed but never started a checkout — if they later
  // start one, they naturally stop being eligible here (they're being
  // handled by the abandoned-checkout flow instead).
  const rows = db
    .prepare(
      `SELECT s.* FROM subscribers s
       WHERE NOT EXISTS (SELECT 1 FROM checkout_sessions c WHERE c.email = s.email)`
    )
    .all();

  let sent = 0;
  for (const row of rows) {
    const didSend = await processEntity({
      flow: "welcome",
      email: row.email,
      referenceId: String(row.id),
      anchorAt: row.created_at,
      steps: WELCOME_STEPS,
      buildEmail: (step) => welcomeEmail(step, row.email),
    });
    if (didSend) sent++;
  }
  return sent;
}

async function sweepPostPurchase() {
  // Cap at the winback threshold — an order that's already old enough for
  // winback eligibility shouldn't also be mid-way through a stale
  // post-purchase sequence at the same time (e.g. a historical order from
  // before this system existed).
  const rows = db
    .prepare(`SELECT * FROM orders WHERE created_at > datetime('now', ?)`)
    .all(`-${WINBACK_STEPS[0]} minutes`);

  let sent = 0;
  for (const row of rows) {
    const didSend = await processEntity({
      flow: "post_purchase",
      email: row.email,
      referenceId: String(row.id),
      anchorAt: row.created_at,
      steps: POST_PURCHASE_STEPS,
      buildEmail: (step) => postPurchaseEmail(step, row.email),
    });
    if (didSend) sent++;
  }
  return sent;
}

async function sweepWinback() {
  // Most recent order per email, where that most recent order is old
  // enough to be eligible — reference_id is that order's id, so if they
  // order again later and go lapsed a second time, it's a fresh cycle.
  const rows = db
    .prepare(
      `SELECT id, email, created_at FROM (
         SELECT id, email, created_at,
                ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) AS rn
         FROM orders
       ) WHERE rn = 1`
    )
    .all();

  let sent = 0;
  for (const row of rows) {
    const didSend = await processEntity({
      flow: "winback",
      email: row.email,
      referenceId: String(row.id),
      anchorAt: row.created_at,
      steps: WINBACK_STEPS,
      buildEmail: (step) => winbackEmail(step, row.email),
    });
    if (didSend) sent++;
  }
  return sent;
}

function recordRun(sentCount) {
  db.prepare(
    `INSERT INTO automation_runs (id, last_run_at, last_sent_count)
     VALUES (1, datetime('now'), ?)
     ON CONFLICT(id) DO UPDATE SET last_run_at = excluded.last_run_at, last_sent_count = excluded.last_sent_count`
  ).run(sentCount);
}

async function runSweep() {
  let sent = 0;
  sent += await sweepAbandonedCheckout();
  sent += await sweepWelcome();
  sent += await sweepPostPurchase();
  sent += await sweepWinback();
  recordRun(sent);
}

export function startAutomationJob() {
  // Every 15 minutes.
  cron.schedule("*/15 * * * *", runSweep);
  console.log("Email automation sweep scheduled (runs every 15 min).");
}

export { runSweep };
