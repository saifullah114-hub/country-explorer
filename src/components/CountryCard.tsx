import { useRouter } from "next/navigation";
import FlagImage from "./FlagImage";

export default function CountryCard({ country, searchParams }: any) {
  const router = useRouter();

  return (
    <div
      className="bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer border border-gray-100"
      onClick={() => router.push(`/country/${country.cca3}?${searchParams.toString()}`)}
    >
      <FlagImage src={country.flag} alt={country.name} />
      <div className="p-4">
        <h2 className="font-semibold text-lg text-gray-800">{country.name}</h2>
        <p className="text-sm text-gray-600">🌆 {country.capital || "N/A"}</p>
        <p className="text-sm text-gray-600">🌍 {country.region}</p>
        <p className="text-sm text-gray-600">💰 {country.currencies}</p>
        <p className="text-sm text-gray-600">👥 {country.population.toLocaleString()}</p>
      </div>
    </div>
  );
}
