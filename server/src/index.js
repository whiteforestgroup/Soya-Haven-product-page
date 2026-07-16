import "dotenv/config";
import express from "express";
import cors from "cors";
import { checkoutRouter } from "./routes/checkout.js";
import { webhookRouter } from "./routes/webhook.js";
import { subscribeRouter } from "./routes/subscribe.js";
import { startAbandonedCartJob } from "./jobs/abandonedCart.js";
import "./db.js"; // ensures tables exist on boot

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

// Stripe webhook needs the raw request body (not JSON-parsed) to verify
// the signature, so this is mounted with express.raw() before the global
// JSON body parser below.
app.use("/api/webhook/stripe", express.raw({ type: "application/json" }));
app.use("/api", webhookRouter);

app.use(express.json());
app.use("/api", checkoutRouter);
app.use("/api", subscribeRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Soya Haven server listening on http://localhost:${port}`);
  startAbandonedCartJob();
});
