// Single source of truth for scents, sizes, and pricing.
// Imported by both the frontend (src/data/product.js) and the backend
// (server checkout route) so prices can never drift out of sync — and so
// the server always computes prices itself rather than trusting the client.

const standardPrices = { "4oz": 14.79, "8oz": 24.0 };

export const scents = [
  { name: "Lemongrass", prices: standardPrices },
  { name: "Eucalyptus Peppermint", prices: standardPrices },
  { name: "Sweet Orange", prices: standardPrices },
  { name: "Bergamot Vanilla", prices: { "4oz": 19.79, "8oz": 28.0 } },
  { name: "Frankincense", prices: standardPrices },
  { name: "Rosemary", prices: standardPrices },
];

export const sizes = [
  { id: "4oz", label: "4 oz", note: "Perfect for trying a new scent." },
  { id: "8oz", label: "8 oz", note: "Our best value for everyday use.", popular: true },
];

export function priceFor(scentName, sizeId) {
  const scent = scents.find((s) => s.name === scentName);
  if (!scent) throw new Error(`Unknown scent: ${scentName}`);
  const price = scent.prices[sizeId];
  if (price == null) throw new Error(`Unknown size "${sizeId}" for scent "${scentName}"`);
  return price;
}
