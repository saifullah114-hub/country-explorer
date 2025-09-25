import { NextResponse } from "next/server";
import { getSuggestions } from "@/lib/dataService";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const continent = url.searchParams.get("continent") || undefined;
    const page = parseInt(url.searchParams.get("page") || "1", 10);

    if (!q) {
      return NextResponse.json({ data: [], meta: { page, limit: 10, total: 0, totalPages: 0 } });
    }

    const result = await getSuggestions({ q, continent, page, limit: 10 });
    return NextResponse.json(result);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
