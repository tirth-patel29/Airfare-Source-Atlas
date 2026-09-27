import { NextResponse } from "next/server";
import { dataFileNames } from "@/data/server";

export async function GET(request: Request) {
  const filename = new URL(request.url).searchParams.get("file");
  if (!filename || !dataFileNames.includes(filename)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return NextResponse.redirect(
    new URL(`/data/${encodeURIComponent(filename)}`, request.url)
  );
}