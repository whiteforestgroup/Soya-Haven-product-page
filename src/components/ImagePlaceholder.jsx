export default function ImagePlaceholder({ label, className = "" }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-cream-dark ${className}`}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-terracotta) 0, var(--color-terracotta) 1px, transparent 1px, transparent 14px)",
        }}
      />
      <span className="relative z-10 rounded bg-cream/80 px-3 py-1 text-center text-[11px] tracking-widest text-ink-soft uppercase">
        {label}
      </span>
    </div>
  );
}
