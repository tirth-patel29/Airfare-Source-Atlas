import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, CheckCircle2, Globe2, Plane, Search } from "lucide-react";
import { SourceExplorer } from "@/components/SourceExplorer";
import { getAllSources } from "@/data/server";

const sections = [
  { href: "/airlines", label: "Airlines", sourceType: "Airline", icon: Plane },
  { href: "/otas", label: "OTAs", sourceType: "OTA", icon: Search },
  { href: "/metasearch", label: "Metasearch", sourceType: "Metasearch", icon: Globe2 },
];

export default async function Home() {
  await connection();

  let sources;
  try {
    sources = await getAllSources();
  } catch (error) {
    console.error("Unable to load the airfare source registry.", error);
    return (
      <div className="page-container py-16">
        <section className="card p-8" role="alert">
          <h1 className="text-xl font-semibold">Registry unavailable</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            The source registry could not be loaded from /data/SIH26056_airfare_source_registry.csv.
          </p>
        </section>
      </div>
    );
  }

  const indiaRelevant = sources.filter(
    (source) => source.india_relevant.toLowerCase() === "yes"
  ).length;
  const verified = sources.filter(
    (source) => source.status.toLowerCase() === "verified"
  ).length;
  const countries = new Set(
    sources
      .map((source) => source.country)
      .filter((country) => country && country !== "Unknown")
  ).size;

  return (
    <div className="page-container py-8 sm:py-12">
      <section className="animate-fade-in border-b border-[var(--color-border)] pb-8 sm:pb-10">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
              SIH26056 · India airfare price index
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Airfare Source Atlas
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-[var(--color-text-secondary)]">
              A living registry of the airlines, booking platforms, and fare
              discovery services behind India&apos;s airfare landscape.
            </p>
          </div>
          <Link
            href="/sources"
            className="inline-flex h-11 w-fit items-center gap-2 rounded-full bg-[#1d1d1f] px-5 text-sm font-medium text-white no-underline transition-colors hover:bg-[#333]"
          >
            Explore all sources <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 divide-x divide-y divide-[var(--color-border)] border-y border-[var(--color-border)] sm:grid-cols-4 sm:divide-y-0">
          <div className="py-5 pr-4 sm:pr-6">
            <p className="kpi-number">{sources.length}</p>
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">Registry entries</p>
          </div>
          <div className="py-5 pl-4 sm:px-6">
            <p className="kpi-number">{indiaRelevant}</p>
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">India relevant</p>
          </div>
          <div className="py-5 pr-4 sm:px-6">
            <p className="kpi-number">{countries}</p>
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">Countries listed</p>
          </div>
          <div className="py-5 pl-4 sm:pl-6">
            <p className="kpi-number">{verified}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-verified)]" />
              Verified sources
            </p>
          </div>
        </div>
      </section>

      <section className="py-7 sm:py-9" aria-label="Source categories">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Browse by source type</h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Jump into a focused part of the registry.
            </p>
          </div>
          <Link
            href="/downloads"
            className="text-sm font-medium text-[var(--color-accent)] no-underline hover:underline"
          >
            Download data
          </Link>
        </div>
        <div className="grid grid-cols-1 border-y border-[var(--color-border)] sm:grid-cols-3">
          {sections.map(({ href, label, sourceType, icon: Icon }) => {
            const count = sources.filter(
              (source) => source.source_type.toLowerCase() === sourceType.toLowerCase()
            ).length;
            return (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-4 border-b border-[var(--color-border)] py-4 text-inherit no-underline transition-colors hover:bg-white/70 sm:border-b-0 sm:px-4 sm:first:pl-0 sm:last:pr-0 sm:not(:last-child):border-r"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{label}</span>
                  <span className="mt-0.5 block text-xs text-[var(--color-text-secondary)]">
                    {count} {count === 1 ? "source" : "sources"}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-[var(--color-text-tertiary)] transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] pt-7 sm:pt-9">
        <SourceExplorer
          sources={sources}
          title="Source registry"
          subtitle="Search, filter, and inspect the complete dataset."
          showTypeFilter
        />
      </section>
    </div>
  );
}
