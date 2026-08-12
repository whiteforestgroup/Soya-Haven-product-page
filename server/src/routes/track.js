import express from "express";
import { db } from "../db.js";

export const trackRouter = express.Router();

function clip(value, max) {
  return typeof value === "string" ? value.slice(0, max) : null;
}

// Fired once per page load from the frontend — a simple own-data view
// counter, separate from Meta Pixel/CAPI (which already track this too,
// but aren't something you can casually glance at without opening Ads
// Manager). Also captures UTM params + referrer for source attribution,
// and a client-generated visitor ID for unique-visitor counting.
trackRouter.post("/track-view", (req, res) => {
  const body = req.body || {};
  const path = clip(body.path, 200) || "/";

  db.prepare(
    `INSERT INTO page_views (path, visitor_id, utm_source, utm_medium, utm_campaign, referrer)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    path,
    clip(body.visitorId, 100),
    clip(body.utmSource, 100),
    clip(body.utmMedium, 100),
    clip(body.utmCampaign, 100),
    clip(body.referrer, 500)
  );

  res.status(204).end();
});

// Deliberately narrow allowlist — this isn't a general "track anything"
// pipeline, just the specific on-page actions worth answering business
// questions about (what scent gets clicked, are people looking at photos,
// are people hitting add-to-cart).
const ALLOWED_EVENT_TYPES = new Set(["scent_click", "photo_click", "add_to_cart_click"]);

trackRouter.post("/track-event", (req, res) => {
  const body = req.body || {};
  const eventType = clip(body.eventType, 50);
  const label = clip(body.label, 200);

  if (!ALLOWED_EVENT_TYPES.has(eventType) || !label) {
    return res.status(400).json({ error: "Invalid event." });
  }

  db.prepare(
    `INSERT INTO interaction_events (event_type, label, visitor_id, path) VALUES (?, ?, ?, ?)`
  ).run(eventType, label, clip(body.visitorId, 100), clip(body.path, 200));

  res.status(204).end();
});
