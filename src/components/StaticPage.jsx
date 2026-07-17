export default function StaticPage({ title, draft = false, children }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      {draft && (
        <div className="mb-8 rounded border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-ink">
          <strong>Draft — not yet reviewed.</strong> This is placeholder policy text
          for launch planning. Replace with your actual reviewed policy before
          this page goes live.
        </div>
      )}
      <h1 className="font-display text-4xl text-ink">{title}</h1>
      <div className="prose-legal mt-6 space-y-4 text-sm leading-relaxed text-ink-soft">
        {children}
      </div>
      <a href="/" className="mt-10 inline-block text-sm text-sage-deep hover:underline">
        ← Back to Soya Haven Co.
      </a>
    </section>
  );
}
