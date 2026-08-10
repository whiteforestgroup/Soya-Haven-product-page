export default function OurStory() {
  return (
    <section id="our-story" className="border-y border-ink/10 bg-cream-dark/40">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <p className="text-xs tracking-[0.2em] text-gold uppercase">Meet the makers</p>
        <h2 className="font-display mt-2 text-3xl text-ink md:text-4xl">
          A mother-daughter business, rooted in the Rappahannock.
        </h2>

        <div className="mt-8 space-y-5 text-left text-ink-soft md:text-center">
          <p>
            Soya Haven Co. was born from a love of simple living, clean ingredients, and the
            quiet beauty of Rappahannock. We create thoughtfully crafted soy wax tarts and room
            and linen sprays designed to elevate everyday spaces with warmth, calm, and
            intention.
          </p>
          <p>
            Our wax tarts are made with pure soy wax for a clean, long-lasting melt, while our
            room and linen sprays are blended with carefully selected essential oils to deliver
            refined, natural fragrance. Every product is made in small batches to ensure premium
            quality, consistency, and care in every detail.
          </p>
          <p>
            At Soya Haven Co., authenticity is at the heart of everything we do, from the
            ingredients we choose to the place we proudly call home. We believe luxury should
            feel honest, comforting, and effortlessly beautiful, creating a haven you can return
            to again and again.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-ink/10 pt-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-terracotta font-display text-lg text-terracotta">
            V&amp;M
          </span>
          <p className="font-medium text-ink">V &amp; Momo, Owners</p>
          <p className="max-w-md text-sm text-ink-soft">
            A mother and daughter, dedicated to creating clean, cozy home fragrances. Thank you
            for being part of our journey. 💜
          </p>
        </div>
      </div>
    </section>
  );
}
