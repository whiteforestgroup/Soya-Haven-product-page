import { useState } from "react";
import { subscribeEmail } from "../lib/api";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Enter a valid email.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      await subscribeEmail({ email, source: "footer" });
      setStatus("done");
      setMessage("You're on the list!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <p className="text-sm text-ink">Join our list for new scents and self-care tips.</p>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded border border-ink/20 bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:border-sage-deep focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded bg-sage-deep px-4 py-2 text-xs font-medium tracking-widest text-cream uppercase transition hover:bg-sage-deep-dark disabled:opacity-60"
        >
          {status === "loading" ? "…" : "Join"}
        </button>
      </form>
      {message && (
        <p className={`mt-2 text-xs ${status === "error" ? "text-red-700" : "text-sage-deep"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
