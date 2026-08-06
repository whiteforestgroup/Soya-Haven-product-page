import express from "express";
import Stripe from "stripe";
import { db } from "../db.js";
import { klaviyo } from "../integrations/klaviyo.js";
import { meta } from "../integrations/meta.js";
import { resend } from "../integrations/resend.js";
import { orderConfirmationEmail } from "../emails/templates.js";
import { unsubscribeUrl } from "../lib/unsubscribe.js";

export const webhookRouter = express.Router();

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Mounted with express.raw() in index.js — Stripe's signature check needs
// the exact raw request body, not JSON-parsed.
webhookRouter.post("/webhook/stripe", async (req, res) => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.warn("Stripe webhook received but STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET not set — ignoring.");
    return res.status(503).send("Stripe not configured");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const row = db
      .prepare(`SELECT * FROM checkout_sessions WHERE stripe_session_id = ?`)
      .get(session.id);

    if (row && row.status !== "completed") {
      db.prepare(
        `UPDATE checkout_sessions SET status = 'completed', completed_at = datetime('now') WHERE id = ?`
      ).run(row.id);

      db.prepare(`
        INSERT INTO orders (checkout_session_id, stripe_payment_intent_id, email, cart_json, total_amount)
        VALUES (?, ?, ?, ?, ?)
      `).run(row.id, session.payment_intent, row.email, row.cart_json, row.total_amount);

      const eventId = session.metadata?.eventId;
      klaviyo
        .trackEvent(row.email, "Placed Order", {
          value: row.total_amount,
          items: JSON.parse(row.cart_json),
        })
        .catch((err) => console.error("Klaviyo trackEvent failed:", err.message));
      meta
        .sendEvent({
          eventName: "Purchase",
          eventId,
          email: row.email,
          customData: { value: row.total_amount, currency: "USD" },
        })
        .catch((err) => console.error("Meta CAPI failed:", err.message));

      // Immediate receipt — separate from the (intentionally delayed)
      // Post-Purchase automation flow. Always sent regardless of marketing
      // opt-out status, since this is transactional, not marketing.
      const { subject, html } = orderConfirmationEmail(row.email, {
        items: JSON.parse(row.cart_json),
        totalAmount: row.total_amount,
      });
      resend
        .sendEmail({ to: row.email, subject, html, unsubscribeUrl: unsubscribeUrl(row.email) })
        .catch((err) => console.error("Order confirmation email failed:", err.message));
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    db.prepare(
      `UPDATE checkout_sessions SET status = 'expired' WHERE stripe_session_id = ? AND status != 'completed'`
    ).run(session.id);
  }

  res.json({ received: true });
});
