// Klaviyo integration. Every function below no-ops (logs and returns) until
// KLAVIYO_API_KEY is set in the environment — safe to call from anywhere in
// the app before you've connected a real Klaviyo account.
//
// Docs for reference once you're ready to go live:
// https://developers.klaviyo.com/en/reference/api_overview

const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
const KLAVIYO_API_BASE = "https://a.klaviyo.com/api";
const KLAVIYO_REVISION = "2024-10-15";

function isConfigured() {
  return Boolean(KLAVIYO_API_KEY);
}

async function klaviyoRequest(path, body) {
  const res = await fetch(`${KLAVIYO_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      "Content-Type": "application/json",
      revision: KLAVIYO_REVISION,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Klaviyo API error ${res.status}: ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

// Adds/updates a profile and subscribes it to your default list.
// Call this on newsletter signup AND on checkout-started (so abandoned-cart
// emails have someone to go to).
export async function subscribeProfile(email, { listId } = {}) {
  if (!isConfigured()) {
    console.log(`[klaviyo:stub] would subscribe ${email} to list ${listId || "(default)"}`);
    return null;
  }
  return klaviyoRequest("/profile-subscription-bulk-create-jobs/", {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: {
        profiles: {
          data: [{ type: "profile", attributes: { email } }],
        },
      },
      relationships: listId
        ? { list: { data: { type: "list", id: listId } } }
        : undefined,
    },
  });
}

// Tracks a custom event against a profile — e.g. "Started Checkout",
// "Placed Order". Klaviyo flows (welcome series, abandoned cart) trigger
// off these metric names.
export async function trackEvent(email, metricName, properties = {}) {
  if (!isConfigured()) {
    console.log(`[klaviyo:stub] would track "${metricName}" for ${email}`, properties);
    return null;
  }
  return klaviyoRequest("/events/", {
    data: {
      type: "event",
      attributes: {
        properties,
        metric: { data: { type: "metric", attributes: { name: metricName } } },
        profile: { data: { type: "profile", attributes: { email } } },
      },
    },
  });
}

export const klaviyo = { isConfigured, subscribeProfile, trackEvent };
