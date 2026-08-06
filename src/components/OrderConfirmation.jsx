import logo from "../assets/logo.png";
import { business } from "../data/business";

export default function OrderConfirmation() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <img src={logo} alt="Soya Haven Co. Aromatherapy" className="h-20 w-auto" />
      <h1 className="font-display mt-6 text-4xl text-ink">Thank you for your order!</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
        Your order is confirmed and being handcrafted with care. You'll get an email
        confirmation shortly, and another once it ships.
      </p>
      <p className="mt-2 text-xs text-ink-soft/70">
        Don't see it in a few minutes? Check your spam or promotions folder, just in case.
      </p>
      <a
        href="/"
        className="mt-8 rounded bg-sage-deep px-8 py-4 text-sm font-medium tracking-widest text-cream uppercase transition hover:bg-sage-deep-dark"
      >
        Back to Soya Haven Co.
      </a>

      {business.etsyUrl && (
        <div className="mt-10 border-t border-ink/10 pt-8">
          <p className="font-display text-2xl text-ink">Want to shop more?</p>
          <p className="mt-2 text-[15px] text-ink-soft">
            Browse the rest of our handmade collection on Etsy.
          </p>
          <a
            href={business.etsyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded border-2 border-terracotta px-8 py-4 text-sm font-medium tracking-widest text-terracotta uppercase transition hover:bg-terracotta hover:text-cream"
          >
            Shop on Etsy
          </a>
        </div>
      )}
    </section>
  );
}
