import cron from "node-cron";
import { db } from "../db.js";
import { klaviyo } from "../integrations/klaviyo.js";

const THRESHOLD_MINUTES = Number(process.env.ABANDONED_CART_THRESHOLD_MINUTES || 60);

// Klaviyo's own flow builder can trigger off the "Started Checkout" event
// (sent immediately in routes/checkout.js) with its own time-delay + "has
// this profile also done Placed Order?" branch — so this job isn't
// strictly required for Klaviyo flows to work. It exists so:
//   1. Abandoned carts are visible in your own database before/without Klaviyo.
//   2. You get an explicit "Abandoned Checkout" event as a convenience,
//      distinct from "Started Checkout", if you'd rather trigger on that.
async function runAbandonedCartSweep() {
  const stale = db
    .prepare(
      `SELECT * FROM checkout_sessions
       WHERE status = 'started'
       AND created_at <= datetime('now', ?)`
    )
    .all(`-${THRESHOLD_MINUTES} minutes`);

  for (const row of stale) {
    try {
      await klaviyo.trackEvent(row.email, "Abandoned Checkout", {
        value: row.total_amount,
        items: JSON.parse(row.cart_json),
      });
    } catch (err) {
      console.error(`Klaviyo abandoned-cart event failed for ${row.email}:`, err.message);
    }
    db.prepare(`UPDATE checkout_sessions SET status = 'abandoned' WHERE id = ?`).run(row.id);
  }

  if (stale.length > 0) {
    console.log(`Abandoned-cart sweep: processed ${stale.length} stale checkout(s).`);
  }
}

export function startAbandonedCartJob() {
  // Every 15 minutes.
  cron.schedule("*/15 * * * *", runAbandonedCartSweep);
  console.log(
    `Abandoned-cart job scheduled (threshold: ${THRESHOLD_MINUTES} min, runs every 15 min).`
  );
}

export { runAbandonedCartSweep };
