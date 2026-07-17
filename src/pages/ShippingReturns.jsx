import StaticPage from "../components/StaticPage";
import { business } from "../data/business";

export default function ShippingReturns() {
  return (
    <StaticPage title="Shipping & Returns" draft>
      <h2 className="font-display text-xl text-ink">Processing Time</h2>
      <p>Orders are typically processed within 1–3 business days before shipping.</p>

      <h2 className="font-display text-xl text-ink">Shipping</h2>
      <p>
        Standard Shipping: 3–7 business days. Tracking information is provided once
        your order ships.
      </p>
      <p>
        Need your order sooner? Contact us before ordering
        {business.contactEmail ? ` at ${business.contactEmail}` : ""} and we'll do our
        best to accommodate rush requests whenever possible.
      </p>

      <h2 className="font-display text-xl text-ink">Returns & Exchanges</h2>
      <p>
        Because our room and linen sprays are handmade and consumable, we're unable to
        accept returns or exchanges once an order has shipped, except in the case of
        items that arrive damaged or defective.
      </p>
      <p>
        If your order arrives damaged, please contact us within 7 days of delivery
        with photos of the damage, and we'll make it right with a replacement or
        refund.
      </p>

      <p className="text-xs italic">
        [Draft note: return window and policy specifics above are a suggested
        starting point for a handmade cosmetic/fragrance goods business — confirm
        these terms before publishing.]
      </p>
    </StaticPage>
  );
}
