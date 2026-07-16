import express from "express";
import { db } from "../db.js";
import { klaviyo } from "../integrations/klaviyo.js";

export const subscribeRouter = express.Router();

// For a newsletter/popup signup — separate from checkout, this is how you
// capture emails from visitors who never start a purchase at all.
subscribeRouter.post("/subscribe", async (req, res) => {
  const { email, source } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email is required." });
  }

  db.prepare(
    `INSERT INTO subscribers (email, source) VALUES (?, ?)
     ON CONFLICT(email) DO NOTHING`
  ).run(email, source || "unknown");

  try {
    await klaviyo.subscribeProfile(email, { listId: process.env.KLAVIYO_LIST_ID });
    await klaviyo.trackEvent(email, "Newsletter Signup", { source: source || "unknown" });
  } catch (err) {
    console.error("Klaviyo subscribe failed:", err.message);
    // Still return success to the user — their email is saved locally
    // even if Klaviyo is temporarily unreachable.
  }

  res.json({ ok: true });
});
