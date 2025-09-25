import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Country from "@/models/Country";
import Fuse from "fuse.js";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const continent = searchParams.get("continent") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const sort = searchParams.get("sort") || "name_common";

    await connectMongo();

    const filter: any = {};
    if (continent) filter.region = continent;

    // Grab a large set of docs first (Fuse.js works in memory)
    const baseDocs = await Country.find(filter).lean();

    let docs = baseDocs;

    // 🔍 If search term, use Fuse.js fuzzy matching (like suggestions)
    if (search) {
      const fuse = new Fuse(baseDocs, {
        keys: ["name_common", "name.official"], // fuzzy on both
        threshold: 0.4, // smaller = stricter
      });
      docs = fuse.search(search).map((r) => r.item);
    }

    // Sorting
    docs.sort((a: any, b: any) => {
      const valA =
        sort === "currencies"
          ? (a.currencies_list?.[0] || "")
          : sort === "capital"
          ? (Array.isArray(a.capital) ? a.capital[0] : a.capital || "")
          : a.name_common || "";
      const valB =
        sort === "currencies"
          ? (b.currencies_list?.[0] || "")
          : sort === "capital"
          ? (Array.isArray(b.capital) ? b.capital[0] : b.capital || "")
          : b.name_common || "";
      return valA.localeCompare(valB);
    });

    const total = docs.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = docs.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data: paginated.map((c: any) => ({
        id: c._id.toString(),
        name_common: c.name_common,
        officialName: c.name?.official,
        cca3: c.cca3,
        capital: Array.isArray(c.capital) ? c.capital[0] : c.capital,
        region: c.region,
        subregion: c.subregion,
        flag: c.flag,
        population: c.population,
        currencies:
          c.currencies_list?.join(", ") ||
          (c.currencies
            ? Object.values(c.currencies).map((cur: any) => cur.name).join(", ")
            : null),
      })),
      meta: { page, limit, total, totalPages },
    });
  } catch (err: any) {
    console.error("Countries API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
