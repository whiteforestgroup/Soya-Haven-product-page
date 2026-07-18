import { useState, useEffect } from "react";
import { scents, sizes, heroDifferentiators, priceFor } from "../data/product";
import { createCheckout } from "../lib/api";
import { trackPixelEvent } from "../lib/analytics";
import lemongrassSunflower from "../assets/hero/lemongrass-sunflower.jpg";
import peppermintDiagonal from "../assets/hero/peppermint-diagonal.jpg";
import lemongrassSweetOrangePair from "../assets/hero/lemongrass-sweetorange-pair.jpg";
import bundleVideo from "../assets/video/bundle-tray.mp4";
import bundlePoster from "../assets/video/bundle-tray-poster.jpg";

const galleryItems = [
  { type: "image", src: lemongrassSunflower, alt: "Soya Haven Lemongrass room spray with sunflower and greenery" },
  { type: "image", src: peppermintDiagonal, alt: "Soya Haven Eucalyptus Peppermint room spray on a bed" },
  { type: "image", src: lemongrassSweetOrangePair, alt: "Soya Haven Lemongrass and Sweet Orange room sprays side by side" },
  { type: "video", src: bundleVideo, poster: bundlePoster, alt: "Soya Haven room sprays on a wooden tray" },
];

export default function Hero({ onSummaryChange }) {
  const [activeScent, setActiveScent] = useState(scents[0].name);
  const [activeSize, setActiveSize] = useState(
    sizes.find((s) => s.popular)?.id ?? sizes[0].id
  );
  const [activeImage, setActiveImage] = useState(0);
  const [bundleOn, setBundleOn] = useState(true);
  const [secondScent, setSecondScent] = useState(scents[1].name);
  const [email, setEmail] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState("idle"); // idle | loading | error | pending-setup
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const unitPrice = priceFor(activeScent, activeSize);
  const itemCount = bundleOn ? 2 : 1;
  const totalPrice = bundleOn
    ? unitPrice + priceFor(secondScent, activeSize)
    : unitPrice;

  async function handleAddToCart() {
    if (!email || !email.includes("@")) {
      setCheckoutStatus("error");
      setCheckoutMessage("Enter a valid email to continue.");
      return;
    }

    setCheckoutStatus("loading");
    setCheckoutMessage("");

    const items = [{ scent: activeScent, size: activeSize, quantity: 1 }];
    if (bundleOn) items.push({ scent: secondScent, size: activeSize, quantity: 1 });

    const eventId = crypto.randomUUID();
    trackPixelEvent("InitiateCheckout", { value: totalPrice, currency: "USD" }, eventId);

    try {
      const data = await createCheckout({ email, items, eventId });
      window.location.href = data.url;
    } catch (err) {
      if (err.code === "stripe_not_configured") {
        // Stripe isn't connected yet — the cart/email is still saved
        // server-side, so this isn't a failure from the shopper's view.
        setCheckoutStatus("pending-setup");
        setCheckoutMessage(
          "Thanks! We're finishing checkout setup — we'll email you the moment it's ready."
        );
        return;
      }
      setCheckoutStatus("error");
      setCheckoutMessage(err.message);
    }
  }

  useEffect(() => {
    const item = galleryItems[activeImage];
    onSummaryChange?.({
      image: item.type === "video" ? item.poster : item.src,
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
          {galleryItems[activeImage].type === "video" ? (
            <video
              key={galleryItems[activeImage].src}
              className="aspect-[4/5] w-full object-cover"
              poster={galleryItems[activeImage].poster}
              autoPlay
              muted
              loop
              playsInline
              controls
            >
              <source src={galleryItems[activeImage].src} type="video/mp4" />
            </video>
          ) : (
            <img
              src={galleryItems[activeImage].src}
              alt={galleryItems[activeImage].alt}
              className="aspect-[4/5] w-full object-cover"
            />
          )}
        </div>
        <div className="mt-3 flex gap-2">
          {galleryItems.map((item, i) => (
            <button
              key={item.src}
              onClick={() => setActiveImage(i)}
              aria-label={item.type === "video" ? "Play product video" : item.alt}
              className={`relative aspect-square w-full max-w-20 overflow-hidden rounded border transition ${
                activeImage === i ? "border-ink" : "border-transparent"
              }`}
            >
              <img
                src={item.type === "video" ? item.poster : item.src}
                alt={item.alt}
                className="h-full w-full object-cover"
              />
              {item.type === "video" && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/20">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream/90">
                    <span className="ml-0.5 h-0 w-0 border-y-4 border-l-6 border-y-transparent border-l-ink" />
                  </span>
                </span>
              )}
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
          that turns any room into your happy place in seconds.
        </p>

        <div className="mt-4 inline-flex w-fit items-center rounded-full border-2 border-terracotta px-4 py-2 text-sm font-bold tracking-wide text-terracotta uppercase">
          No Flames, Plugs, or Electricity Required
        </div>

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
                key={scent.name}
                onClick={() => setActiveScent(scent.name)}
                className={`rounded border px-4 py-2 text-sm transition ${
                  activeScent === scent.name
                    ? "border-sage-deep bg-sage-deep text-cream"
                    : "border-ink/20 text-ink hover:border-ink/50"
                }`}
              >
                {scent.name}
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
                <p className="mt-2 font-medium">${priceFor(activeScent, size.id).toFixed(2)}</p>
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
                    key={scent.name}
                    onClick={() => setSecondScent(scent.name)}
                    className={`rounded border px-3 py-1.5 text-xs transition ${
                      secondScent === scent.name
                        ? "border-terracotta bg-terracotta text-cream"
                        : "border-ink/20 text-ink hover:border-ink/50"
                    }`}
                  >
                    {scent.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-3xl font-medium text-ink">${totalPrice.toFixed(2)}</p>
            {bundleOn && (
              <p className="text-xs text-sage-deep">2 bottles · free shipping included</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="mt-4">
          <label htmlFor="checkout-email" className="text-xs font-medium tracking-widest text-ink uppercase">
            Your Email
          </label>
          <input
            id="checkout-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded border border-ink/20 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:border-sage-deep focus:ring-0 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={checkoutStatus === "loading"}
          className="mt-3 w-full rounded bg-sage-deep py-4 text-sm font-medium tracking-widest text-cream uppercase transition hover:bg-sage-deep-dark disabled:opacity-60"
        >
          {checkoutStatus === "loading"
            ? "Please wait…"
            : bundleOn
              ? "Add 2 to Cart"
              : "Add to Cart"}
        </button>
        {checkoutMessage ? (
          <p
            className={`mt-2 text-center text-xs ${
              checkoutStatus === "error" ? "text-red-700" : "text-sage-deep"
            }`}
          >
            {checkoutMessage}
          </p>
        ) : (
          <p className="mt-2 text-center text-[11px] text-ink-soft">
            {bundleOn
              ? "🎁 Free shipping applied on your 2-bottle bundle"
              : "Add a 2nd bottle above for free shipping"}
          </p>
        )}
      </div>
    </section>
  );
}
