import StaticPage from "../components/StaticPage";

export default function TermsOfService() {
  return (
    <StaticPage title="Terms & Conditions">
      <p className="text-xs text-ink-soft">Effective Date: July 20, 2026</p>

      <p>
        Welcome to Soya Haven Co. By purchasing our products, you agree to the
        following terms.
      </p>

      <h2 className="font-display text-xl text-ink">Orders</h2>
      <p>
        All products are handmade and may have slight variations in color,
        design, or appearance. These differences make each item unique.
      </p>

      <h2 className="font-display text-xl text-ink">Shipping</h2>
      <p>
        Orders are processed within our stated processing time. Shipping times
        may vary depending on the carrier and destination.
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

      <h2 className="font-display text-xl text-ink">Product Use</h2>
      <p>
        Our products are intended for their designated purpose only. Please
        follow all included safety instructions. Soya Haven Co. is not
        responsible for misuse of our products.
      </p>

      <h2 className="font-display text-xl text-ink">Allergies</h2>
      <p>
        Our products may contain fragrance oils, essential oils, or other
        ingredients that could cause sensitivities. Customers are responsible
        for reviewing product descriptions before purchasing.
      </p>

      <h2 className="font-display text-xl text-ink">Intellectual Property</h2>
      <p>
        All product names, photos, logos, designs, and content created by
        Soya Haven Co. are the property of Soya Haven Co. and may not be
        copied or used without written permission.
      </p>

      <h2 className="font-display text-xl text-ink">Changes</h2>
      <p>
        We reserve the right to update these Terms &amp; Conditions at any
        time without prior notice.
      </p>
    </StaticPage>
  );
}
