const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function createCheckout({ email, items, eventId }) {
  const res = await fetch(`${API_URL}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, items, eventId }),
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.error || "Something went wrong starting checkout.");
    error.code = data.code;
    throw error;
  }
  return data;
}

const VISITOR_ID_KEY = "shVisitorId";

// A random ID kept in localStorage so repeat visits from the same browser
// can be counted as one "unique visitor" instead of inflating raw page
// view counts — not a substitute for real analytics, just enough for
// distinguishing "500 page views" from "80 actual people."
function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return undefined; // localStorage unavailable (private browsing, etc.)
  }
}

export function trackPageView(path) {
  const params = new URLSearchParams(window.location.search);

  // Fire-and-forget — a page view failing to log should never affect the
  // shopper's experience. Server responds 204 (no body) on success.
  fetch(`${API_URL}/api/track-view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path,
      visitorId: getVisitorId(),
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      referrer: document.referrer || undefined,
    }),
  }).catch(() => {});
}

// Fire-and-forget click tracking for the specific on-page actions worth
// knowing about — which scent, which photo, whether add-to-cart got hit.
// Server validates eventType against an allowlist, so an unrecognized
// value here just gets rejected rather than polluting the data.
export function trackEvent(eventType, label) {
  fetch(`${API_URL}/api/track-event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType,
      label,
      visitorId: getVisitorId(),
      path: window.location.pathname,
    }),
  }).catch(() => {});
}

export async function subscribeEmail({ email, source }) {
  const res = await fetch(`${API_URL}/api/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong subscribing.");
  }
  return data;
}
