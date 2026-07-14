import { whyUs } from "../data/product";

export default function WhyUs() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-center md:px-6">
      <p className="text-xs tracking-[0.2em] text-gold uppercase">Why Soya Haven?</p>
      <h2 className="font-display mt-2 text-4xl text-ink">
        The little things make the biggest difference.
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-5">
        {whyUs.map((item, i) => (
          <div key={item.title} className="flex flex-col items-center gap-3">
            <span
              className={`h-10 w-10 rounded-full border ${
                i % 2 === 0 ? "border-terracotta" : "border-sage"
              }`}
            />
            <p className="font-medium text-ink">{item.title}</p>
            <p className="text-sm text-ink-soft">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
