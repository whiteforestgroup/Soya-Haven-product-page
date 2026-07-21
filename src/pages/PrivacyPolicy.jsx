import StaticPage from "../components/StaticPage";

export default function PrivacyPolicy() {
  return (
    <StaticPage title="Privacy Policy">
      <p className="text-xs text-ink-soft">Effective Date: July 20, 2026</p>

      <p>
        At Soya Haven Co., your privacy matters to us. We only collect the
        information needed to process your orders and provide excellent
        customer service.
      </p>

      <h2 className="font-display text-xl text-ink">Information We Collect</h2>
      <p>When you place an order, we may collect:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Your name</li>
        <li>Shipping and billing address</li>
        <li>Email address</li>
        <li>Phone number (if provided)</li>
        <li>Order details</li>
      </ul>
      <p>
        Payment information is processed securely through our payment
        providers. We do not store your credit card information.
      </p>

      <h2 className="font-display text-xl text-ink">How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Process and ship your order</li>
        <li>Communicate about your purchase</li>
        <li>Respond to customer service inquiries</li>
        <li>Improve our products and services</li>
      </ul>

      <h2 className="font-display text-xl text-ink">Information Sharing</h2>
      <p>
        We do not sell, rent, or trade your personal information. We only
        share information with trusted service providers when necessary to
        fulfill your order (such as shipping carriers and payment processors).
      </p>

      <h2 className="font-display text-xl text-ink">Marketing</h2>
      <p>
        If you choose to subscribe to our emails, you may receive updates,
        promotions, and new product announcements. You can unsubscribe at any
        time.
      </p>

      <h2 className="font-display text-xl text-ink">Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact
        us through our Etsy shop or by email.
      </p>
    </StaticPage>
  );
}
