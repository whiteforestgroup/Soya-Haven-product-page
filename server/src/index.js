import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkoutRouter } from "./routes/checkout.js";
import { webhookRouter } from "./routes/webhook.js";
import { subscribeRouter } from "./routes/subscribe.js";
import { adminRouter } from "./routes/admin.js";
import { startAbandonedCartJob } from "./jobs/abandonedCart.js";
import "./db.js"; // ensures tables exist on boot

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

// Admin dashboard — a plain static HTML/JS page, not part of the React app.
// Protected by ADMIN_TOKEN checked in routes/admin.js, not by obscurity.
app.use(express.static(path.join(__dirname, "..", "public")));

// Stripe webhook needs the raw request body (not JSON-parsed) to verify
// the signature, so this is mounted with express.raw() before the global
// JSON body parser below.
app.use("/api/webhook/stripe", express.raw({ type: "application/json" }));
app.use("/api", webhookRouter);

app.use(express.json());
app.use("/api", checkoutRouter);
app.use("/api", subscribeRouter);
app.use("/api", adminRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Catch-all error handler — must be last, and must take 4 args for Express
// to treat it as an error handler. Without this, any unhandled error
// (a malformed request body, Stripe rejecting a request, etc.) falls
// through to Express's default HTML error page, which includes a full
// stack trace and internal file paths in the response body. That's both
// a poor experience for a real shopper and a real information leak.
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed request body." });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Soya Haven server listening on http://localhost:${port}`);
  startAbandonedCartJob();
});
