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
