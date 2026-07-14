import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="border-b border-ink/10 bg-cream py-4 text-center">
      <img
        src={logo}
        alt="Soya Haven Co. Aromatherapy"
        className="mx-auto h-24 w-auto"
      />
    </header>
  );
}
