import ImagePlaceholder from "./ImagePlaceholder";
import { ingredientValues } from "../data/product";

export default function Ingredients() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h2 className="font-display text-center text-4xl text-ink">
        Made with ingredients you can feel good about.
      </h2>

      <div className="mt-10 grid grid-cols-1 items-center gap-10 md:grid-cols-3">
        <ImagePlaceholder label="Ingredient Image A" className="aspect-square w-full" />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 md:grid-cols-1">
          {ingredientValues.map((item, i) => (
            <div key={item.title} className="flex flex-col items-center gap-2 text-center">
              <span
                className={`h-9 w-9 rounded-full border ${
                  i % 2 === 0 ? "border-terracotta" : "border-sage"
                }`}
              />
              <p className="font-medium text-ink">{item.title}</p>
              <p className="text-sm text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>

        <ImagePlaceholder label="Ingredient Image B" className="aspect-square w-full" />
      </div>
    </section>
  );
}
