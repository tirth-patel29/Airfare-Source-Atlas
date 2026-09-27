import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { connection } from "next/server";
import { getFileDescription } from "@/data";
import { getDataFiles } from "@/data/server";

export default async function DownloadsPage() {
  await connection();
  let files;
  try {
    files = await getDataFiles();
  } catch (error) {
    console.error("Unable to read airfare dataset files.", error);
    return (
      <div className="page-container py-12">
        <section className="card p-8" role="alert">
          <h1 className="text-xl font-semibold">Downloads unavailable</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            The source files could not be read from the workspace data folder.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="page-container py-8 sm:py-10">
      <header className="mb-7 border-b border-[var(--color-border)] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
          SIH26056 · Source data
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Downloads</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Original CSV and Excel files from the workspace dataset.
        </p>
      </header>

      <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {files.map((file) => {
          const Icon = file.format === "XLSX" ? FileSpreadsheet : FileText;
          return (
            <div
              key={file.name}
              className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h2 className="break-all text-sm font-medium">{file.name}</h2>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                    {getFileDescription(file.name)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                    {file.format} · {file.sizeFormatted}
                  </p>
                </div>
              </div>
              <a
                href={`/data/${encodeURIComponent(file.name)}`}
                download={file.name}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[var(--color-border)] px-4 text-sm font-medium text-[var(--color-text-primary)] no-underline transition-colors hover:bg-white sm:self-center"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}