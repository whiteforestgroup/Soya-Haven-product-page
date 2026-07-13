import { useState } from "react";
import { testimonials } from "../data/product";

const perPage = 4;

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const maxPage = Math.ceil(testimonials.length / perPage) - 1;
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="border-y border-ink/10 bg-cream-dark/40 py-16">
      <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
        <p className="text-xs tracking-[0.2em] text-tan uppercase">Loved by Thousands</p>

        <div className="relative mt-10 flex items-center gap-4">
          <button
            aria-label="Previous testimonials"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="hidden shrink-0 text-ink-soft disabled:opacity-30 md:block"
          >
            ‹
          </button>

          <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {visible.map((t) => (
              <div key={t.name} className="flex flex-col items-center gap-3">
                <span className="tracking-widest text-tan">★★★★★</span>
                <p className="text-sm text-ink">"{t.quote}"</p>
                <p className="text-xs text-ink-soft">— {t.name}</p>
              </div>
            ))}
          </div>

          <button
            aria-label="Next testimonials"
            disabled={page === maxPage}
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
            className="hidden shrink-0 text-ink-soft disabled:opacity-30 md:block"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
