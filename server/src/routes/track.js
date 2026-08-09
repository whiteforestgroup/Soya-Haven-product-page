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
