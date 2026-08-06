import { createHmac, timingSafeEqual } from "node:crypto";

// Signs the unsubscribe link so nobody can unsubscribe an email address
// that isn't theirs just by guessing the URL — the token proves it came
// from an email we actually sent to that address.
function secret() {
  const s = process.env.UNSUB_SECRET;
  if (!s) {
    console.warn(
      "UNSUB_SECRET is not set — using an insecure dev fallback. Set a real value before sending real emails."
    );
    return "dev-only-insecure-fallback";
  }
  return s;
}

function sign(email) {
  return createHmac("sha256", secret()).update(email.toLowerCase()).digest("hex").slice(0, 32);
}

export function unsubscribeUrl(email) {
  const base = process.env.BACKEND_URL || "http://localhost:4000";
  const token = sign(email);
  return `${base}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

export function verifyToken(email, token) {
  if (!email || !token) return false;
  const expected = sign(email);
  const a = Buffer.from(expected);
  const b = Buffer.from(String(token));
  return a.length === b.length && timingSafeEqual(a, b);
}
