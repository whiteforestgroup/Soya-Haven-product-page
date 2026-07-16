// Meta Pixel wiring. Everything here safely no-ops until VITE_META_PIXEL_ID
// is set (see .env.example) — no pixel script is even loaded without it, so
// there's nothing to configure or remove before you have a real pixel ID.

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

export function initMetaPixel() {
  if (!PIXEL_ID || typeof window === "undefined" || window.fbq) return;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}

// eventId lets a matching server-side Conversions API call (see
// server/src/integrations/meta.js) dedupe against this browser event
// instead of Meta counting it twice.
export function trackPixelEvent(eventName, data = {}, eventId) {
  if (!PIXEL_ID || typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", eventName, data, eventId ? { eventID: eventId } : undefined);
}
