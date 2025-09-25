import { getCountryByCode } from "@/lib/dataService";
import Link from "next/link";

type Props = {
  params: { cca3: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function CountryDetails({ params, searchParams }: Props) {
  const country = await getCountryByCode(params.cca3);

  if (!country ) {
    return <div className="p-6 text-center text-red-500">❌ Country not found</div>;
  }
  // preserve query params for back button
  const query = new URLSearchParams(
    Object.entries(searchParams).reduce((acc, [key, val]) => {
      if (typeof val === "string") acc[key] = val;
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex flex-col items-center">
      {/* Back button */}
      <Link
        href={`/search${query ? `?${query}` : ""}`}
        className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition"
      >
        ⬅ Back to Search
      </Link>

      {/* Country card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl w-full">
        <div className="bg-gray-100 flex justify-center items-center h-48">
          <img
            src={country.flag || ""}
            alt={country.name}
            className="h-full w-full object-fill"
          />
        </div>

        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">{country.name}</h1>
          {country.officialName && (
            <p className="text-gray-500 text-lg mt-1">{country.officialName}</p>
          )}
        </div>

        {/* Info grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500">🏙 Capital</h3>
            <p className="text-lg font-medium text-gray-800">
              {country.capital || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500">🌍 Region</h3>
            <p className="text-lg font-medium text-gray-800">
              {country.region} {country.subregion && `– ${country.subregion}`}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500">👥 Population</h3>
            <p className="text-lg font-medium text-gray-800">
              {country.population?.toLocaleString() || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500">💰 Currencies</h3>
            <p className="text-lg font-medium text-gray-800">
              {country.currencies || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
