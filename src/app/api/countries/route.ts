import { getCountries } from "@/lib/dataService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || undefined;
    const continent = url.searchParams.get("continent") || undefined;
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const sort = url.searchParams.get("sort") || "name_common";

    const result = await getCountries({ search, continent, page, limit, sort });
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Countries API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
