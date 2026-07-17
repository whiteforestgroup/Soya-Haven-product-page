import StaticPage from "../components/StaticPage";
import { business } from "../data/business";

export default function TermsOfService() {
  return (
    <StaticPage title="Terms of Service" draft>
      <p className="text-xs italic">
        [Draft note: standard small-business starting template, not legal
        advice — have it reviewed before publishing.]
      </p>

      <h2 className="font-display text-xl text-ink">Orders & Payment</h2>
      <p>
        By placing an order, you agree to provide accurate purchase and account
        information. All payments are processed securely through Stripe. We
        reserve the right to cancel or refuse any order.
      </p>

      <h2 className="font-display text-xl text-ink">Product Descriptions</h2>
      <p>
        We do our best to describe our products, ingredients, and scents
        accurately. Colors and scent descriptions may vary slightly from what
        you experience, as these are handmade, small-batch products.
      </p>

      <h2 className="font-display text-xl text-ink">Use of This Site</h2>
      <p>
        You agree to use this site only for lawful purposes. All content on
        this site — including text, images, and the Soya Haven Co. name and
        logo — is our property and may not be used without permission.
      </p>

      <h2 className="font-display text-xl text-ink">Limitation of Liability</h2>
      <p>
        Our products are intended for use as directed. We are not liable for
        misuse, allergic reactions, or damage resulting from failure to follow
        usage instructions. See our product labels and FAQ for safe-use
        guidance, including around pets and on delicate fabrics.
      </p>

      <h2 className="font-display text-xl text-ink">Changes to These Terms</h2>
      <p>We may update these terms from time to time. Continued use of the site means you accept the current version.</p>

      <h2 className="font-display text-xl text-ink">Governing Law</h2>
      <p>These terms are governed by the laws of the Commonwealth of Virginia, USA.</p>

      <h2 className="font-display text-xl text-ink">Contact</h2>
      <p>
        Questions about these terms? Reach us
        {business.contactEmail ? ` at ${business.contactEmail}` : " — contact details coming soon"}.
      </p>

      <p className="text-xs text-ink-soft">Last updated: [add date when published]</p>
    </StaticPage>
  );
}
