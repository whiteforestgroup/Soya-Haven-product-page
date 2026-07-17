import StaticPage from "../components/StaticPage";
import { business } from "../data/business";

export default function PrivacyPolicy() {
  return (
    <StaticPage title="Privacy Policy" draft>
      <p className="text-xs italic">
        [Draft note: this is a standard small-business starting template, not
        legal advice. Have it reviewed before publishing, especially if you'll
        have customers in the EU/UK (GDPR) or California (CCPA).]
      </p>

      <h2 className="font-display text-xl text-ink">Information We Collect</h2>
      <p>
        When you place an order or sign up for our email list, we collect
        information such as your name, email address, shipping address, and
        payment details. Payment information is processed securely by Stripe and
        is never stored on our servers.
      </p>
      <p>
        We also use cookies and similar technologies (including the Meta Pixel)
        to understand how visitors use our site and to show relevant ads on
        Meta platforms (Facebook/Instagram).
      </p>

      <h2 className="font-display text-xl text-ink">How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Process and fulfill your orders</li>
        <li>Send order confirmations and shipping updates</li>
        <li>Send marketing emails, if you've subscribed (you can unsubscribe anytime)</li>
        <li>Improve our site and understand what customers are interested in</li>
        <li>Show relevant ads and measure their performance</li>
      </ul>

      <h2 className="font-display text-xl text-ink">Sharing Your Information</h2>
      <p>We share information with the third parties that help us run our business:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>Stripe</strong> — payment processing</li>
        <li><strong>Klaviyo</strong> — email marketing, if you've subscribed</li>
        <li><strong>Meta</strong> — advertising and ad performance measurement</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2 className="font-display text-xl text-ink">Your Choices</h2>
      <p>
        You can unsubscribe from marketing emails at any time using the link in
        any email we send. To request a copy of your data or ask us to delete
        it, contact us{business.contactEmail ? ` at ${business.contactEmail}` : ""}.
      </p>

      <h2 className="font-display text-xl text-ink">Contact</h2>
      <p>
        Questions about this policy? Reach us
        {business.contactEmail ? ` at ${business.contactEmail}` : " — contact details coming soon"}.
      </p>

      <p className="text-xs text-ink-soft">Last updated: [add date when published]</p>
    </StaticPage>
  );
}
