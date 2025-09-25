import { NextResponse } from "next/server";
import { getCountries } from "@/lib/dataService";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || undefined;
    const continent = url.searchParams.get("continent") || undefined;
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const sort = url.searchParams.get("sort") || "name";

    const result = await getCountries({ search, continent, page, limit, sort });
    return NextResponse.json(result);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
