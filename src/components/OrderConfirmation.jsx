import logo from "../assets/logo.png";

export default function OrderConfirmation() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <img src={logo} alt="Soya Haven Co. Aromatherapy" className="h-20 w-auto" />
      <h1 className="font-display mt-6 text-4xl text-ink">Thank you for your order!</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
        Your order is confirmed and being handcrafted with care. You'll get an email
        confirmation shortly, and another once it ships.
      </p>
      <a
        href="/"
        className="mt-8 rounded bg-sage-deep px-8 py-4 text-sm font-medium tracking-widest text-cream uppercase transition hover:bg-sage-deep-dark"
      >
        Back to Soya Haven Co.
      </a>
    </section>
  );
}
