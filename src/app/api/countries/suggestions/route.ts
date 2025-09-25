import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongo";
import Country from "@/models/Country";
import Fuse from "fuse.js";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const continent = searchParams.get("continent") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 10;

    await connectMongo();

    if (!q) {
      return NextResponse.json({
        data: [],
        meta: { page, limit, total: 0, totalPages: 0 },
      });
    }

    const filter: any = {};
    if (continent) {
      filter.region = continent;
    }


    const baseDocs = await Country.find(filter, { name_common: 1, cca3: 1 })
      .limit(500) 
      .lean();

    const safeDocs = baseDocs.filter((doc: any) => doc.name_common);

    const fuse = new Fuse(safeDocs, {
      keys: ["name_common"],
      threshold: 0.5, 
    });

    const results = fuse.search(q).map((r) => r.item);

    
    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = results.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data: paginated.map((c: any) => ({
        id: c._id.toString(),
        name_common: c.name_common,
        cca3: c.cca3,
      })),
      meta: { page, limit, total, totalPages },
    });
  } catch (err: any) {
    console.error("Suggestions API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
