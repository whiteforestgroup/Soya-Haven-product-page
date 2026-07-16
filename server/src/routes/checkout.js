import express from "express";
import Stripe from "stripe";
import { randomUUID } from "node:crypto";
import { db } from "../db.js";
import { priceFor } from "../../../shared/products.js";
import { klaviyo } from "../integrations/klaviyo.js";
import { meta } from "../integrations/meta.js";

export const checkoutRouter = express.Router();

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// items: [{ scent: "Lemongrass", size: "8oz", quantity: 1 }, ...]
// Prices are always looked up server-side from shared/products.js —
// never trust a price sent from the browser.
checkoutRouter.post("/checkout", async (req, res) => {
  const { email, items, eventId: clientEventId } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email is required." });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "At least one item is required." });
  }

  let lineItems;
  try {
    lineItems = items.map((item) => {
      const unitPrice = priceFor(item.scent, item.size);
      return {
        scent: item.scent,
        size: item.size,
        quantity: item.quantity || 1,
        unitPrice,
      };
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const totalAmount = lineItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const cartJson = JSON.stringify(lineItems);
  // Reuse the browser pixel's event ID when provided, so the client-side
  // InitiateCheckout event and this server-side one dedupe as a single
  // event in Meta instead of being counted twice.
  const eventId = clientEventId || randomUUID();

  const insert = db.prepare(`
    INSERT INTO checkout_sessions (email, cart_json, total_amount, status)
    VALUES (?, ?, ?, 'started')
  `);
  const { lastInsertRowid: checkoutSessionId } = insert.run(email, cartJson, totalAmount);

  // Fire-and-forget marketing signals — this is what makes abandoned-cart
  // emails possible: we now have the email + cart even if Stripe is never
  // reached or the customer leaves mid-payment.
  klaviyo.subscribeProfile(email, { listId: process.env.KLAVIYO_LIST_ID }).catch((err) =>
    console.error("Klaviyo subscribeProfile failed:", err.message)
  );
  klaviyo
    .trackEvent(email, "Started Checkout", {
      value: totalAmount,
      items: lineItems,
    })
    .catch((err) => console.error("Klaviyo trackEvent failed:", err.message));
  meta
    .sendEvent({
      eventName: "InitiateCheckout",
      eventId,
      email,
      clientIp: req.ip,
      userAgent: req.get("user-agent"),
      customData: { value: totalAmount, currency: "USD" },
    })
    .catch((err) => console.error("Meta CAPI failed:", err.message));

  const stripe = getStripe();
  if (!stripe) {
    // Stripe isn't configured yet — respond clearly instead of crashing,
    // so the rest of the flow (cart tracking, Klaviyo, Meta) is still
    // testable before you've added real Stripe keys.
    return res.status(503).json({
      error:
        "Stripe is not configured yet. Set STRIPE_SECRET_KEY in server/.env to enable real checkout.",
      code: "stripe_not_configured",
      checkoutSessionId,
      totalAmount,
    });
  }

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: lineItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.unitPrice * 100),
          product_data: { name: `Natural Room Spray — ${item.scent} (${item.size})` },
        },
      })),
      metadata: { checkoutSessionId: String(checkoutSessionId), eventId },
      // Root path with a query param, not a separate route — this is a
      // single-page app with no client-side router, so a dedicated path
      // like /order-confirmed would 404 on most static hosts unless SPA
      // rewrites are configured. The root always resolves.
      success_url: `${frontendUrl}/?order=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/`,
    });
  } catch (err) {
    // Never leak Stripe's raw error (or a stack trace) to the shopper —
    // log it for us to debug, show them something calm and actionable.
    console.error("Stripe session creation failed:", err.message);
    return res.status(502).json({
      error: "We couldn't start checkout right now. Please try again in a moment.",
      code: "checkout_unavailable",
    });
  }

  db.prepare(`UPDATE checkout_sessions SET stripe_session_id = ? WHERE id = ?`).run(
    session.id,
    checkoutSessionId
  );

  res.json({ url: session.url });
});
