import { useState } from "react";
import { testimonials } from "../data/product";

const perPage = 8;

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const maxPage = Math.ceil(testimonials.length / perPage) - 1;
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="border-y border-ink/10 bg-cream-dark/40 py-16">
      <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
        <p className="text-xs tracking-[0.2em] text-gold uppercase">What Our Customers Say</p>

        <div className="relative mt-10 flex items-center gap-4">
          {maxPage > 0 && (
            <button
              aria-label="Previous testimonials"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="hidden shrink-0 text-sage-deep disabled:opacity-30 md:block"
            >
              ‹
            </button>
          )}

          <div className="flex flex-1 flex-wrap justify-center gap-8">
            {visible.map((t) => (
              <div key={t.quote} className="flex w-full max-w-xs flex-col items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/20 text-terracotta">
                  ✓
                </span>
                <span className="tracking-widest text-gold">★★★★★</span>
                <p className="text-sm text-ink">"{t.quote}"</p>
                <p className="text-xs text-ink-soft">— {t.name}</p>
              </div>
            ))}
          </div>

          {maxPage > 0 && (
            <button
              aria-label="Next testimonials"
              disabled={page === maxPage}
              onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
              className="hidden shrink-0 text-sage-deep disabled:opacity-30 md:block"
            >
              ›
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
