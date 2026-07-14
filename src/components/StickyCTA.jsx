import { useEffect, useState } from "react";

export default function StickyCTA({ summary, scrollTargetRef }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = scrollTargetRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [scrollTargetRef]);

  if (!summary) return null;

  const handleClick = () => {
    scrollTargetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-cream/95 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
        <img
          src={summary.image}
          alt={summary.scent}
          className="h-12 w-12 shrink-0 rounded object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">
            Natural Room Spray — {summary.scent}
          </p>
          <p className="text-xs text-ink-soft">
            {summary.itemCount === 2 ? "2 bottles" : "1 bottle"} · $
            {summary.totalPrice.toFixed(2)}
            {summary.itemCount === 2 && (
              <span className="ml-1 text-sage-deep">Free Shipping</span>
            )}
          </p>
        </div>
        <button
          onClick={handleClick}
          className="shrink-0 rounded bg-sage-deep px-4 py-3 text-xs font-medium tracking-widest text-cream uppercase transition hover:bg-sage-deep-dark md:px-6"
        >
          {summary.itemCount === 2 ? "Add 2 to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
