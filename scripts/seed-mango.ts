import mongoose from "mongoose";
import axios from "axios";
import Country from "../src/models/Country";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/country_explorer";
const FIELDS = "name,flags,capital,region,subregion,cca2,cca3,population,currencies,latlng";

async function main() {
  await mongoose.connect(MONGO_URI);

  const { data } = await axios.get(`https://restcountries.com/v3.1/all?fields=${FIELDS}`);
  if (!Array.isArray(data)) throw new Error("Unexpected API response");

  for (const c of data) {
   const doc = {
  name: c.name || {},
  name_common: c.name?.common || "",   // 👈 important
  cca2: c.cca2 || null,
  cca3: c.cca3 || null,
  capital: Array.isArray(c.capital) ? c.capital : [],
  region: c.region || null,
  subregion: c.subregion || null,
  flag: c.flags?.png || c.flags?.svg || null,
  population: c.population || 0,
  currencies: c.currencies || null,
  currencies_list: c.currencies
    ? Object.values(c.currencies).map((v: any) => v.name)
    : [],
  latlng: c.latlng || [],
};


    if (doc.cca3) {
      await Country.updateOne({ cca3: doc.cca3 }, { $set: doc }, { upsert: true });
    }
  }

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
