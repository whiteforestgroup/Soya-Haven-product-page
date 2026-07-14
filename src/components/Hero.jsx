import { useState, useEffect } from "react";
import { scents, sizes, heroDifferentiators } from "../data/product";
import lemongrassSunflower from "../assets/hero/lemongrass-sunflower.jpg";
import pinaColadaHand from "../assets/hero/pina-colada-hand.jpg";
import peppermintDiagonal from "../assets/hero/peppermint-diagonal.jpg";
import lemongrassSweetOrangePair from "../assets/hero/lemongrass-sweetorange-pair.jpg";

const galleryImages = [
  { src: lemongrassSunflower, alt: "Soya Haven Lemongrass room spray with sunflower and greenery" },
  { src: pinaColadaHand, alt: "Hand holding Soya Haven Pina Colada fragrance spray" },
  { src: peppermintDiagonal, alt: "Soya Haven Peppermint room spray on a bed" },
  { src: lemongrassSweetOrangePair, alt: "Soya Haven Lemongrass and Sweet Orange room sprays side by side" },
];

export default function Hero({ onSummaryChange }) {
  const [activeScent, setActiveScent] = useState(scents[0]);
  const [activeSize, setActiveSize] = useState(
    sizes.find((s) => s.popular)?.id ?? sizes[0].id
  );
  const [activeImage, setActiveImage] = useState(0);
  const [bundleOn, setBundleOn] = useState(true);
  const [secondScent, setSecondScent] = useState(scents[1]);

  const selectedSize = sizes.find((s) => s.id === activeSize);
  const itemCount = bundleOn ? 2 : 1;
  const totalPrice = selectedSize.price * itemCount;

  useEffect(() => {
    onSummaryChange?.({
      image: galleryImages[activeImage].src,
      scent: activeScent,
      totalPrice,
      itemCount,
    });
  }, [activeImage, activeScent, totalPrice, itemCount]);

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 md:grid-cols-2 md:gap-12 md:px-6 md:py-16">
      {/* Gallery */}
      <div>
        <div className="relative overflow-hidden rounded">
          <img
            src={galleryImages[activeImage].src}
            alt={galleryImages[activeImage].alt}
            className="aspect-[4/5] w-full object-cover"
          />
          <button
            aria-label="Play product video"
            className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream/90 shadow"
          >
            <span className="ml-0.5 h-0 w-0 border-y-6 border-l-9 border-y-transparent border-l-ink" />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          {galleryImages.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setActiveImage(i)}
              className={`aspect-square w-full max-w-20 overflow-hidden rounded border transition ${
                activeImage === i ? "border-ink" : "border-transparent"
              }`}
            >
              <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Buy box */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          <span className="tracking-widest text-gold">★★★★★</span>
          <span>4.9/5 from 250+ happy customers</span>
        </div>

        <h2 className="font-display mt-3 text-5xl leading-tight text-ink">
          Natural Room Spray
        </h2>
        <p className="mt-1 text-lg text-ink-soft">Handcrafted Home Fragrance</p>

        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
          A handcrafted room spray made with naturally inspired ingredients
          that turns any room into your happy place in seconds — no flames,
          plugs, or electricity required.
        </p>

        <div className="mt-5 flex gap-6">
          {heroDifferentiators.map((d, i) => (
            <div key={d.title} className="flex items-center gap-2 text-xs text-ink-soft uppercase">
              <span
                className={`h-4 w-4 rounded-full border ${
                  i % 2 === 0 ? "border-terracotta" : "border-sage"
                }`}
              />
              {d.title}
            </div>
          ))}
        </div>

        {/* Scent selector */}
        <div className="mt-8">
          <p className="text-xs font-medium tracking-widest text-ink uppercase">
            1. Choose Your Scent
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {scents.map((scent) => (
              <button
                key={scent}
                onClick={() => setActiveScent(scent)}
                className={`rounded border px-4 py-2 text-sm transition ${
                  activeScent === scent
                    ? "border-sage-deep bg-sage-deep text-cream"
                    : "border-ink/20 text-ink hover:border-ink/50"
                }`}
              >
                {scent}
              </button>
            ))}
          </div>
        </div>

        {/* Size selector */}
        <div className="mt-6">
          <p className="text-xs font-medium tracking-widest text-ink uppercase">
            2. Choose Your Size
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setActiveSize(size.id)}
                className={`relative rounded border px-4 py-4 text-left transition ${
                  activeSize === size.id
                    ? "border-sage-deep bg-sage-deep/10"
                    : "border-ink/20 hover:border-ink/50"
                }`}
              >
                {size.popular && (
                  <span className="absolute top-2 right-2 rounded-full bg-terracotta/25 px-2 py-0.5 text-[10px] tracking-wide uppercase">
                    Most Popular
                  </span>
                )}
                <p className="font-medium">{size.label}</p>
                <p className="mt-1 text-xs text-ink-soft">{size.note}</p>
                <p className="mt-2 font-medium">${size.price.toFixed(2)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Bundle upsell — defaults on to nudge the 2-bottle purchase */}
        <div className="mt-6">
          <p className="text-xs font-medium tracking-widest text-ink uppercase">
            3. Add A 2nd Bottle{" "}
            <span className="text-sage-deep">(Free Shipping)</span>
          </p>
          <button
            type="button"
            onClick={() => setBundleOn((v) => !v)}
            className={`mt-3 flex w-full items-start gap-3 rounded border px-4 py-4 text-left transition ${
              bundleOn ? "border-sage-deep bg-sage-deep/10" : "border-ink/20 hover:border-ink/40"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                bundleOn ? "border-sage-deep bg-sage-deep text-cream" : "border-ink/30 text-transparent"
              }`}
            >
              ✓
            </span>
            <span>
              <span className="flex flex-wrap items-center gap-2 font-medium text-ink">
                Add a 2nd Bottle
                <span className="rounded-full bg-terracotta/20 px-2 py-0.5 text-[10px] tracking-wide text-terracotta uppercase">
                  Free Shipping
                </span>
              </span>
              <span className="mt-1 block text-xs text-ink-soft">
                One for you, one to gift — most customers add a second scent.
              </span>
            </span>
          </button>

          {bundleOn && (
            <div className="mt-3 pl-1">
              <p className="text-xs font-medium tracking-widest text-ink uppercase">
                2nd Bottle Scent
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {scents.map((scent) => (
                  <button
                    key={scent}
                    onClick={() => setSecondScent(scent)}
                    className={`rounded border px-3 py-1.5 text-xs transition ${
                      secondScent === scent
                        ? "border-terracotta bg-terracotta text-cream"
                        : "border-ink/20 text-ink hover:border-ink/50"
                    }`}
                  >
                    {scent}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-3xl font-medium text-ink">${totalPrice.toFixed(2)}</p>
            {bundleOn && (
              <p className="text-xs text-sage-deep">2 bottles · free shipping included</p>
            )}
          </div>
        </div>

        <button className="mt-3 w-full rounded bg-sage-deep py-4 text-sm font-medium tracking-widest text-cream uppercase transition hover:bg-sage-deep-dark">
          {bundleOn ? "Add 2 to Cart" : "Add to Cart"}
        </button>
        <p className="mt-2 text-center text-[11px] text-ink-soft">
          {bundleOn
            ? "🎁 Free shipping applied on your 2-bottle bundle"
            : "Add a 2nd bottle above for free shipping"}
        </p>
      </div>
    </section>
  );
}
