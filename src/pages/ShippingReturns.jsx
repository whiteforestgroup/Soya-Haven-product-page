import StaticPage from "../components/StaticPage";

export default function ShippingReturns() {
  return (
    <StaticPage title="Shipping & Returns">
      <h2 className="font-display text-xl text-ink">Processing Time</h2>
      <p>Room Spray orders are processed within 3 days before shipping.</p>

      <h2 className="font-display text-xl text-ink">Shipping</h2>
      <p>
        Standard shipping is $6.95 for a single bottle. Any order of 2 or more
        bottles ships free. Tracking information is provided once your order
        ships.
      </p>

      <h2 className="font-display text-xl text-ink">Returns &amp; Exchanges</h2>
      <p>
        Due to the nature of our handmade products, we do not accept returns
        or exchanges unless an item arrives damaged or the wrong item was
        received.
      </p>
      <p>
        If your order arrives damaged, please contact us within 7 days of
        delivery with photos so we can assist you.
      </p>
    </StaticPage>
  );
}
