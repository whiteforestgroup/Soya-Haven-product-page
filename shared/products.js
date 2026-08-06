// Single source of truth for scents, sizes, and pricing.
// Imported by both the frontend (src/data/product.js) and the backend
// (server checkout route) so prices can never drift out of sync — and so
// the server always computes prices itself rather than trusting the client.

const standardPrices = { "4oz": 14.79, "8oz": 24.0 };

const bergamotPrices = { "4oz": 19.79, "8oz": 28.0 };

export const scents = [
  { name: "Lemongrass", prices: standardPrices },
  { name: "Eucalyptus Peppermint", prices: standardPrices },
  { name: "Peppermint", prices: standardPrices },
  { name: "Sweet Orange", prices: standardPrices },
  { name: "Bergamot Vanilla", prices: bergamotPrices },
  { name: "Frankincense", prices: standardPrices },
  { name: "Rosemary", prices: standardPrices },
  { name: "Tea Tree", prices: standardPrices },
  { name: "Lavandin", prices: standardPrices },
  { name: "Lavender Vanilla", prices: standardPrices },
  { name: "Rosemary Mint", prices: standardPrices },
  { name: "Sweet Orange + Bergamot", prices: bergamotPrices },
  { name: "Eucalyptus", prices: standardPrices },
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

// Flat-rate shipping — a fixed $6.95 for a single bottle, free on any
// order of 2+ bottles. Deliberately not using Stripe's address-based
// shipping calculator; totalQuantity is the sum of all line item
// quantities in the cart, not the number of distinct scents.
export const SINGLE_BOTTLE_SHIPPING = 6.95;

export function shippingFor(totalQuantity) {
  return totalQuantity >= 2 ? 0 : SINGLE_BOTTLE_SHIPPING;
}

// Flat 7% sales tax, applied to product subtotal only (not shipping).
export const SALES_TAX_RATE = 0.07;

export function taxFor(subtotal) {
  return Math.round(subtotal * SALES_TAX_RATE * 100) / 100;
}
