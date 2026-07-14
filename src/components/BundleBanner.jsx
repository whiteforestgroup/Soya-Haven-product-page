import bundleLifestyle from "../assets/sections/bundle-lifestyle.jpg";

export default function BundleBanner() {
  return (
    <section className="bg-espresso text-cream">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-6">
        <div>
          <h2 className="font-display text-4xl">Better Together</h2>
          <p className="mt-2 text-cream/70">
            Mix, match, and save on shipping.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded border border-cream/20 px-4 py-4">
              <p className="text-sm tracking-wide uppercase">1 Bottle</p>
              <p className="mt-2 text-xs text-cream/60">Standard shipping</p>
              <p className="mt-2 font-medium">$18.00+</p>
            </div>
            <div className="relative rounded bg-sage-deep px-4 py-4 text-cream">
              <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-cream" />
              <p className="text-sm tracking-wide uppercase">Any 2 Bottles</p>
              <p className="mt-2 text-xs text-cream/70">Free shipping</p>
              <p className="mt-2 font-medium">Most Popular</p>
            </div>
          </div>
        </div>

        <img
          src={bundleLifestyle}
          alt="Three Soya Haven room sprays and the brand card in a wooden tray"
          className="aspect-[4/3] w-full rounded object-cover"
        />
      </div>
    </section>
  );
}
