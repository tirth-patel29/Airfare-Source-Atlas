import { Database, Globe2, ShieldCheck } from "lucide-react";

const principles = [
  {
    icon: Database,
    title: "Dataset-led",
    text: "Registry entries and overview counts are read from the SIH26056 source registry file.",
  },
  {
    icon: Globe2,
    title: "Source categories",
    text: "The registry records airlines, online travel agencies, metasearch, travel technology, and GDS sources.",
  },
  {
    icon: ShieldCheck,
    title: "Verification context",
    text: "Verification status, date, source, and access-method fields are shown as recorded in the dataset.",
  },
];

export default function AboutPage() {
  return (
    <div className="page-container py-8 sm:py-10">
      <header className="max-w-2xl border-b border-[var(--color-border)] pb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
          SIH26056
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">About the Atlas</h1>
        <p className="mt-3 text-base leading-7 text-[var(--color-text-secondary)]">
          The Airfare Source Atlas organizes the source registry supporting the
          India airfare price index initiative. It provides searchable access
          to source records and direct downloads of the underlying datasets.
        </p>
      </header>

      <section className="mt-2 divide-y divide-[var(--color-border)] border-b border-[var(--color-border)]">
        {principles.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4 py-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)]">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                {text}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}