import mongoose,{ Schema } from "mongoose";

const CountrySchema = new Schema(
  {
    name: { common: String, official: String },
    name_common: { type: String, index: true },
    cca2: String,
    cca3: { type: String, unique: true },
    capital: [String],
    region: String,
    subregion: String,
    flag: String,
    population: Number,
    currencies: Schema.Types.Mixed,
    currencies_list: [String],
    latlng: [Number],
  },
  { collection: "countries" }   // 👈 force correct collection
);

export default mongoose.models.Country ||
  mongoose.model("Country", CountrySchema);
