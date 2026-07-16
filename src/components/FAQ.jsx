import { useState } from "react";
import { faqs } from "../data/product";
import faqLifestyle from "../assets/sections/faq-lifestyle.jpg";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <img
          src={faqLifestyle}
          alt="Soya Haven Sweet Orange and Bergamot Vanilla room sprays in a wooden tray"
          className="aspect-[4/5] w-full rounded object-cover"
        />

        <div>
          <h2 className="font-display text-4xl text-ink">Frequently Asked Questions</h2>

          <div className="mt-6 divide-y divide-ink/10 border-t border-ink/10">
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={item.q}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between py-4 text-left text-sm text-ink"
                  >
                    {item.q}
                    <span className={`ml-4 shrink-0 ${isOpen ? "text-sage-deep" : "text-ink-soft"}`}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pb-4 text-sm text-ink-soft">
                      <p>{item.a}</p>
                      {item.bullets && (
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          {item.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                      {item.outro && <p className="mt-2">{item.outro}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
