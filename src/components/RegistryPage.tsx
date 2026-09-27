import { SourceExplorer } from "@/components/SourceExplorer";
import { getAllSources } from "@/data/server";
import { connection } from "next/server";

interface RegistryPageProps {
  title: string;
  description: string;
  sourceType?: string;
}

export async function RegistryPage({
  title,
  description,
  sourceType,
}: RegistryPageProps) {
  await connection();
  let allSources;
  try {
    allSources = await getAllSources();
  } catch (error) {
    console.error("Unable to load the airfare source registry.", error);
    return (
      <div className="page-container py-16">
        <section className="card p-8" role="alert">
          <h1 className="text-xl font-semibold">Registry unavailable</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            The source registry could not be read from the workspace data
            folder.
          </p>
        </section>
      </div>
    );
  }

  const sources = sourceType
    ? allSources.filter(
        (source) => source.source_type.toLowerCase() === sourceType.toLowerCase()
      )
    : allSources;

  return (
    <div className="page-container py-8 sm:py-10">
      <SourceExplorer
        sources={sources}
        title={title}
        subtitle={description}
        defaultType={sourceType ?? "All"}
        showTypeFilter={!sourceType}
      />
    </div>
  );
}