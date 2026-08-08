import express from "express";
import { db } from "../db.js";

export const trackRouter = express.Router();

// Fired once per page load from the frontend — a simple own-data view
// counter, separate from Meta Pixel/CAPI (which already track this too,
// but aren't something you can casually glance at without opening Ads
// Manager).
trackRouter.post("/track-view", (req, res) => {
  const rawPath = typeof req.body?.path === "string" ? req.body.path : "/";
  const path = rawPath.slice(0, 200) || "/";
  db.prepare(`INSERT INTO page_views (path) VALUES (?)`).run(path);
  res.status(204).end();
});
