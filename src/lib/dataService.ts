import axios from "axios";
import connectMongo from "@/lib/mongo";
import Country from "@/models/Country";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const USE_DB = process.env.USE_DB === "true";

function normalize(c: any) {
  return {
    id: c._id?.toString() || c.id || c.cca3,
    name: c.name_common || c.name?.common || c.name,
    officialName: c.officialName || c.name?.official || null,
    cca3: c.cca3,
    capital: Array.isArray(c.capital)
      ? c.capital[0]
      : c.capital || null,
    region: c.region || null,
    subregion: c.subregion || null,
    flag: c.flag || c.flags?.png || c.flags?.svg || null,
    population:
      typeof c.population === "number"
        ? c.population
        : Number(c.population) || 0,
    currencies:
      Array.isArray(c.currencies_list) && c.currencies_list.length > 0
        ? c.currencies_list.join(", ")
        : c.currencies
        ? Object.values(c.currencies)
            .map((cur: any) => cur.name || cur)
            .join(", ")
        : null,
  };
}


export async function getCountries(params: {
  search?: string;
  continent?: string;
  page?: number;
  limit?: number;
  sort?: string;
}) {
  if (USE_DB) {
    // ✅ Query Mongo directly
    await connectMongo();

    const { search, continent, page = 1, limit = 20, sort = "name_common" } = params;
    const filter: any = {};
    if (continent) filter.region = continent;
    if (search) filter.name_common = { $regex: search, $options: "i" };

    const total = await Country.countDocuments(filter);
    const countries = await Country.find(filter)
      .sort({ [sort]: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return {
      data: countries.map(normalize),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } else {
    // 🌍 External API
    const res = await axios.get(
      "https://restcountries.com/v3.1/all?fields=name,cca3,flags,capital,region,subregion,currencies,population"
    );
    return {
      data: res.data.map(normalize),
      meta: null,
    };
  }
}
export async function getCountryByCode(cca3: string) {
  if (USE_DB) {
    await connectMongo();
    const doc = await Country.findOne({ cca3 }).lean();

    // 👇 Debug log
    console.log(">>> Raw single country from Mongo:", JSON.stringify(doc, null, 2));

    if (!doc) return null;

    const normalized = normalize(doc);

    console.log(">>> Normalized single country:", normalized);

    return normalized;
  } else {
    const res = await axios.get(
      `https://restcountries.com/v3.1/alpha/${encodeURIComponent(
        cca3
      )}?fields=name,cca3,flags,capital,region,subregion,currencies,population`
    );

    const raw = res.data[0];

    console.log(">>> Raw single country from API:", raw);

    const normalized = normalize(raw);

    console.log(">>> Normalized single country (API):", normalized);

    return normalized;
  }
}
