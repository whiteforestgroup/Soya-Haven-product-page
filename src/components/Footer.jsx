import logo from "../assets/logo.png";
import NewsletterSignup from "./NewsletterSignup";
import { business } from "../data/business";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream py-10 text-center">
      <img src={logo} alt="Soya Haven Co. Aromatherapy" className="mx-auto h-16 w-auto" />

      <div className="mt-6">
        <NewsletterSignup />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs tracking-wide text-ink-soft uppercase">
        <a href="/?page=shipping-returns" className="hover:text-ink">
          Shipping &amp; Returns
        </a>
        <a href="/?page=privacy-policy" className="hover:text-ink">
          Privacy Policy
        </a>
        <a href="/?page=terms" className="hover:text-ink">
          Terms
        </a>
        {business.contactEmail ? (
          <a href={`mailto:${business.contactEmail}`} className="hover:text-ink">
            Contact
          </a>
        ) : (
          <span className="opacity-50">Contact</span>
        )}
        {business.instagramUrl ? (
          <a
            href={business.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            Instagram
          </a>
        ) : (
          <span className="opacity-50">Instagram</span>
        )}
      </div>

      <p className="mt-6 text-[11px] text-ink-soft">
        © {new Date().getFullYear()} Soya Haven Co. All rights reserved.
      </p>
    </footer>
  );
}
