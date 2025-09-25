import axios from "axios";
import connectMongo from "@/lib/mongo";
import Country from "@/models/Country";
import Fuse from "fuse.js";

const USE_DB = process.env.USE_DB === "true";

function normalize(c: any) {
    return {
        id: c.id?.toString() || c.id || c.cca3,
        name: c.name_common || c.name?.common || c.name,
        officialName: c.officialName || c.name?.official || null,
        cca3: c.cca3,
        capital: Array.isArray(c.capital) ? c.capital[0] : c.capital || null,
        region: c.region || null,
        subregion: c.subregion || null,
        flag: c.flag || c.flags?.png || c.flags?.svg || null,
        population: typeof c.population === "number" ? c.population : 0,
        currencies:
            Array.isArray(c.currencies_list) && c.currencies_list.length > 0
                ? c.currencies_list.join(", ")
                : c.currencies
                    ? Object.values(c.currencies)
                        ?.map((cur: any) => cur.name || cur)
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
    const { search, continent, page = 1, limit = 20, sort = "name" } = params;

    if (USE_DB) {
        console.log('inside use db')
        await connectMongo();
        const filter: any = {};
        if (continent) filter.region = continent;

        const docs = await Country.find(filter).lean();

        let results = docs;
        if (search) {
            const fuse = new Fuse(docs, { keys: ["name_common", "name.official"], threshold: 0.2 });
            results = fuse.search(search)?.map(r => r.item);
        }

        results.sort((a: any, b: any) => {
            const getVal = (x: any) =>
                sort === "capital"
                    ? Array.isArray(x.capital) ? x.capital[0] : x.capital || ""
                    : sort === "currencies"
                        ? x.currencies_list?.[0] || ""
                        : x.name_common || "";
            return getVal(a).localeCompare(getVal(b));
        });

        const total = results.length;
        const totalPages = Math.ceil(total / limit);
        const paginated = results.slice((page - 1) * limit, page * limit);

        return { data: paginated?.map(normalize), meta: { page, limit, total, totalPages } };
    } else {
        const res = await axios.get(
            "https://restcountries.com/v3.1/all?fields=name,cca3,flags,capital,region,subregion,currencies,population"
        );
        let results = res.data?.map(normalize);

        if (continent) results = results.filter((c:any) => c.region === continent);
        if (search) {
            const fuse = new Fuse(results, { keys: ["name"], threshold: 0.2 });
            results = fuse.search(search)?.map((r) => r.item);
        }

        results.sort((a:any, b:any) => a[sort as keyof typeof a]?.localeCompare(b[sort as keyof typeof b]));

        const total = results.length;
        const totalPages = Math.ceil(total / limit);
        const paginated = results.slice((page - 1) * limit, page * limit);

        return { data: paginated, meta: { page, limit, total, totalPages } };
    }
}

export async function getCountryByCode(cca3: string) {
    if (USE_DB) {
        await connectMongo();
        const doc = await Country.findOne({ cca3 }).lean();
        return doc ? normalize(doc) : null;
    } else {
        const res = await axios.get(
            `https://restcountries.com/v3.1/alpha/${encodeURIComponent(
                cca3
            )}?fields=name,cca3,flags,capital,region,subregion,currencies,population`
        );

        return normalize(res.data);
    }
}

export async function getSuggestions(params: { q: string; continent?: string; page?: number; limit?: number }) {
    const { q, continent, page = 1, limit = 10 } = params;

    if (USE_DB) {
        await connectMongo();
        const filter: any = {};
        if (continent) filter.region = continent;

        const baseDocs = await Country.find(filter, { name_common: 1, cca3: 1 }).limit(500).lean();
        const safeDocs = baseDocs.filter((doc: any) => doc.name_common);

        const fuse = new Fuse(safeDocs, { keys: ["name_common"], threshold: 0.4 });
        const results = fuse.search(q)?.map((r) => r.item);

        const total = results.length;
        const totalPages = Math.ceil(total / limit);
        const paginated = results.slice((page - 1) * limit, page * limit);

        return {
            data: paginated?.map((c: any) => ({
                id: c._id.toString(),
                name: c.name_common,
                cca3: c.cca3,
            })),
            meta: { page, limit, total, totalPages },
        };
    } else {
        const res = await axios.get("https://restcountries.com/v3.1/all?fields=name,cca3,region");
        const apiData = res.data?.map((c: any) => ({
            id: c.cca3,
            name: c.name?.common,
            cca3: c.cca3,
            region: c.region,
        }));

        const fuse = new Fuse(apiData, { keys: ["name"], threshold: 0.4 });
        let results = fuse.search(q)?.map((r) => r.item);

        if (continent) results = results.filter((c:any) => c.region === continent);

        const total = results.length;
        const totalPages = Math.ceil(total / limit);
        const paginated = results.slice((page - 1) * limit, page * limit);

        return { data: paginated, meta: { page, limit, total, totalPages } };
    }
}

