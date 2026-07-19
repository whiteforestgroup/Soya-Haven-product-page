import bundleVideoMp4 from "../assets/video/bundle-tray.mp4";
import bundleVideoWebm from "../assets/video/bundle-tray.webm";
import bundlePoster from "../assets/video/bundle-tray-poster.jpg";

export default function BundleBanner() {
  return (
    <section className="relative overflow-hidden text-cream">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        poster={bundlePoster}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src={bundleVideoMp4} type="video/mp4" />
        <source src={bundleVideoWebm} type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/70 to-espresso/30" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="max-w-sm">
          <h2 className="font-display text-4xl">Better Together</h2>
          <p className="mt-2 text-cream/70">
            One for you, one to gift — mix, match, and save on shipping.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded border border-cream/20 px-4 py-4">
              <p className="text-sm tracking-wide uppercase">1 Bottle</p>
              <p className="mt-2 text-xs text-cream/60">Standard shipping</p>
              <p className="mt-2 font-medium">$14.79+</p>
            </div>
            <div className="relative rounded bg-sage-deep px-4 py-4 text-cream">
              <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-cream" />
              <p className="text-sm tracking-wide uppercase">Any 2 Bottles</p>
              <p className="mt-2 text-xs text-cream/70">Free shipping</p>
              <p className="mt-2 font-medium">Most Popular</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
