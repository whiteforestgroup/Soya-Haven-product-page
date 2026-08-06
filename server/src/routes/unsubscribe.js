import express from "express";
import { db } from "../db.js";
import { verifyToken } from "../lib/unsubscribe.js";

export const unsubscribeRouter = express.Router();

unsubscribeRouter.get("/unsubscribe", (req, res) => {
  const { email, token } = req.query;

  if (!verifyToken(email, token)) {
    return res.status(400).send("This unsubscribe link isn't valid.");
  }

  db.prepare(
    `INSERT INTO email_suppressions (email) VALUES (?)
     ON CONFLICT(email) DO NOTHING`
  ).run(String(email).toLowerCase());

  res.set("Content-Type", "text/html").send(`<!doctype html>
<html>
  <body style="font-family: Georgia, serif; background:#F6F1E7; padding: 48px 16px; text-align:center; color:#2A241D;">
    <h1 style="font-size: 22px;">You're unsubscribed</h1>
    <p>${email} won't receive any more automated emails from Soya Haven Co.</p>
  </body>
</html>`);
});
