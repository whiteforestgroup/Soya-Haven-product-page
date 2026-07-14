import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream py-10 text-center">
      <img src={logo} alt="Soya Haven Co. Aromatherapy" className="mx-auto h-16 w-auto" />
      <div className="mt-4 flex justify-center gap-6 text-xs tracking-wide text-ink-soft uppercase">
        <a href="#" className="hover:text-ink">Shipping &amp; Returns</a>
        <a href="#" className="hover:text-ink">Contact</a>
        <a href="#" className="hover:text-ink">Instagram</a>
      </div>
      <p className="mt-6 text-[11px] text-ink-soft">
        © {new Date().getFullYear()} Soya Haven Co. All rights reserved.
      </p>
    </footer>
  );
}
