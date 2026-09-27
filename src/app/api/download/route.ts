import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { dataDirectory, dataFileNames } from "@/data/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const filename = new URL(request.url).searchParams.get("file");
  if (!filename || !dataFileNames.includes(filename)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const file = await readFile(path.join(dataDirectory, filename));
    const contentType = filename.endsWith(".xlsx")
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : "text/csv; charset=utf-8";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }
}