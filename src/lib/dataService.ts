import connectMongo from "./mongo";
import Country from "@/models/Country";
import Fuse from "fuse.js";

export async function getCountries({ search, continent, page=1, limit=20, sort="name" }: any) {
  await connectMongo();

  const filter: any = {};
  if (continent) filter.region = continent;

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ name_common: regex }, { capital: regex }];
  }

  const skip = (page - 1) * limit;
  const sortBy =
    sort === "capital"
      ? { capital: 1 }
      : sort === "currencies"
      ? { currencies_list: 1 }
      : { name_common: 1 };

  const [data, total] = await Promise.all([
    Country.find(filter)
      .select("name name_common cca3 capital flag region currencies_list population")
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    Country.countDocuments(filter),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getCountryByCca3(cca3: string) {
  await connectMongo();
  return Country.findOne({ cca3 }).lean();
}

export async function getSuggestions({ q, continent, page=1, limit=10 }: any) {
  await connectMongo();


  const filter: any = {};
  if (continent) filter.region = continent;
  if (q) filter.name_common = { $regex: q, $options: "i" };


  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    Country.find(filter).select("name_common cca3").skip(skip).limit(limit).lean(),
    Country.countDocuments(filter),
  ]);


  return {
    data: docs,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}



