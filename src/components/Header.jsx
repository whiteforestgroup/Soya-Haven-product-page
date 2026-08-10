import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="relative border-b border-ink/10 bg-cream py-4 text-center">
      <img
        src={logo}
        alt="Soya Haven Co. Aromatherapy"
        className="mx-auto h-24 w-auto"
      />
      <nav className="mt-1 flex justify-center gap-10 text-[11px] tracking-[0.14em] text-ink-soft uppercase sm:absolute sm:top-1/2 sm:right-6 sm:mt-0 sm:-translate-y-1/2 sm:justify-end">
        <a href="#our-story" className="transition-colors hover:text-terracotta">
          Our Story
        </a>
        <a href="#faq" className="transition-colors hover:text-terracotta">
          FAQ
        </a>
      </nav>
    </header>
  );
}
