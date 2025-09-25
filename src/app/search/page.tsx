"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CountryCard from "@/components/CountryCard";

type Country = {
    id: string;
    name_common: string;
    capital: string[];
    flag: string | null;
    region: string | null;
    currencies_list: string[];
    cca3: string;
    population: number;
};


export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [countries, setCountries] = useState<Country[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const res = await fetch(`/api/countries?${searchParams.toString()}`);
        const data = await res.json();
        setCountries(data.data);
        setMeta(data.meta);
        setLoading(false)
    };

    useEffect(() => {
        fetchData();
    }, [searchParams]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", e.target.value);
        router.push(`/search?${params.toString()}`);
    };
    return (
        <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white shadow-md rounded-lg p-4">
                <SearchBar compact mode="search" />

                <select
                    className="border border-gray-300 rounded-md px-4 py-2 ml-0 md:ml-4 mt-3 md:mt-0 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                    onChange={handleSortChange}
                    defaultValue={searchParams.get("sort") || "name"}
                >
                    <option value="name">Sort by Name</option>
                    <option value="capital">Sort by Capital</option>
                    <option value="currencies">Sort by Currency</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {countries?.map((c) => (
                        <CountryCard
                            key={c.id}
                            country={{
                                id: c.id,
                                name: c.name_common,
                                cca3: c.cca3,
                                capital: Array.isArray(c.capital) ? c.capital[0] : c.capital || "N/A",
                                region: c.region,
                                flag: c.flag,
                                population: c.population,
                                currencies: c.currencies_list?.join(", ") || "N/A",
                            }}
                            searchParams={searchParams}
                        />
                    ))}
                </div>
            )}

            {meta && (
                <div className="flex justify-center items-center mt-8 gap-4">
                    <button
                        className="px-5 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                        disabled={meta.page === 1}
                        onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set("page", (meta.page - 1).toString());
                            router.push(`/search?${params.toString()}`);
                        }}
                    >
                        ⬅ Prev
                    </button>

                    <span className="text-gray-700 font-medium">
                        Page {meta.page} of {meta.totalPages}
                    </span>

                    <button
                        className="px-5 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                        disabled={meta.page >= meta.totalPages}
                        onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set("page", (meta.page + 1).toString());
                            router.push(`/search?${params.toString()}`);
                        }}
                    >
                        Next ➡
                    </button>
                </div>
            )}
        </div>
    );
}
