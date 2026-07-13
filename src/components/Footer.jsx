export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream py-10 text-center">
      <p className="font-display text-lg tracking-[0.2em] text-ink uppercase">
        Soya Haven Co.
      </p>
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
