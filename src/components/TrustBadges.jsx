import { trustBadges } from "../data/product";

export default function TrustBadges() {
  return (
    <div className="border-y border-ink/10 bg-cream">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center sm:grid-cols-3 md:grid-cols-5 md:px-6">
        {trustBadges.map((badge) => (
          <div key={badge} className="flex flex-col items-center gap-2">
            <span className="h-8 w-8 rounded-full border border-tan" />
            <p className="text-[11px] tracking-wide text-ink-soft uppercase">
              {badge}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
