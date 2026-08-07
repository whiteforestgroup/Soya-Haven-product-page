// Meta Conversions API (server-side pixel events). This is the reliable
// counterpart to the browser-side Meta Pixel — browser-only tracking now
// misses a large share of events (iOS tracking prevention, ad blockers),
// so sending the same events from the server closes that gap.
//
// No-ops until META_PIXEL_ID and META_ACCESS_TOKEN are set.
// Get both from Meta Events Manager > your pixel > Settings > Conversions API.
// https://developers.facebook.com/docs/marketing-api/conversions-api

import crypto from "node:crypto";

const META_PIXEL_ID = process.env.META_PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const GRAPH_API_VERSION = "v21.0";

function isConfigured() {
  return Boolean(META_PIXEL_ID && META_ACCESS_TOKEN);
}

function sha256(value) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

// eventId lets you send the same event from the browser pixel AND this
// server-side call without Meta double-counting it (event deduplication).
export async function sendEvent({
  eventName,
  eventId,
  email,
  clientIp,
  userAgent,
  sourceUrl,
  customData = {},
}) {
  if (!isConfigured()) {
    console.log(`[meta:stub] would send "${eventName}" event`, { email, customData });
    return null;
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: sourceUrl,
        action_source: "website",
        user_data: {
          em: email ? [sha256(email)] : undefined,
          client_ip_address: clientIp,
          client_user_agent: userAgent,
        },
        custom_data: customData,
      },
    ],
  };

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Meta Conversions API error ${res.status}: ${text}`);
  }
  return res.json();
}

export const meta = { isConfigured, sendEvent };
