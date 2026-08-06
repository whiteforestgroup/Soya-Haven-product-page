// Resend integration for the automated email flows (abandoned checkout,
// welcome, post-purchase, winback). No-ops safely until RESEND_API_KEY is
// set — same pattern as integrations/klaviyo.js.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_API_BASE = "https://api.resend.com";

function isConfigured() {
  return Boolean(RESEND_API_KEY);
}

export async function sendEmail({ to, subject, html }) {
  const from = process.env.EMAIL_FROM || "Soya Haven Co. <hello@soyahaven.com>";

  if (!isConfigured()) {
    console.log(`[resend:stub] would send "${subject}" to ${to}`);
    return null;
  }

  const res = await fetch(`${RESEND_API_BASE}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Resend API error ${res.status}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

export const resend = { isConfigured, sendEmail };
