"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page-container py-16">
      <section className="card p-8" role="alert">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          The atlas could not finish loading this page.
        </p>
        <button
          onClick={() => reset()}
          className="mt-5 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#333]"
        >
          Try again
        </button>
      </section>
    </div>
  );
}