import { ingredientValues } from "../data/product";
import ingredientA from "../assets/sections/ingredient-a.jpg";
import ingredientB from "../assets/sections/ingredient-b.jpg";

export default function Ingredients() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h2 className="font-display text-center text-4xl text-ink">
        Made with ingredients you can feel good about.
      </h2>

      <div className="mt-10 grid grid-cols-1 items-center gap-10 md:grid-cols-3">
        <img
          src={ingredientA}
          alt="Close up of the Soya Haven label showing naturally inspired ingredients"
          className="aspect-square w-full rounded object-cover"
        />

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

        <img
          src={ingredientB}
          alt="Hand holding a freshly filled Soya Haven room spray bottle"
          className="aspect-square w-full rounded object-cover"
        />
      </div>
    </section>
  );
}
