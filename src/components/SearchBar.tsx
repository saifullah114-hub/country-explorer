"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";

const continents = ["Africa", "Americas", "Asia", "Europe", "Oceania", "Antarctic"];

type Country = {
    _id: string;
    name_common: string;
    cca3: string;
};


export default function SearchBar({
    compact = false,
    mode = "home",
}: {
    compact?: boolean;
    mode?: "home" | "search";
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("search") || "");
    const [continent, setContinent] = useState(searchParams.get("continent") || "");
    const [suggestions, setSuggestions] = useState<Country[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef<HTMLUListElement | null>(null);
    const fetchSuggestions = async (query: string, continent: string, page = 1) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        const params = new URLSearchParams();
        params.set("q", query);
        if (continent) params.set("continent", continent);
        params.set("page", page.toString());

        const res = await fetch(`/api/countries/suggestions?${params.toString()}`);
        const data = await res.json();
        if (page === 1) {
            setSuggestions(data.data);
        } else {
            setSuggestions((prev) => [...prev, ...data.data]);
        }

        setHasMore(data.meta.page < data.meta.totalPages);
    };


    // Debounce input fetch
    const debouncedFetch = useRef(
        debounce((q: string, cont: string) => {
            setPage(1);
            fetchSuggestions(q, cont, 1);
        }, 400)
    ).current;

    useEffect(() => {
        if (query) {
            setPage(1);        
            setHasMore(false); 
            debouncedFetch(query, continent);
        } else {
            setSuggestions([]);
            setShowDropdown(false);
        }
    }, [query, continent]);


    useEffect(() => {
        const el = dropdownRef.current;
        if (!el) return;

        const handleScroll = () => {
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5 && hasMore) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchSuggestions(query, continent, nextPage);
            }
        };

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [page, hasMore, query, continent]);

    const handleSelectSuggestion = (country: Country) => {
        setQuery(country.name_common);
        setShowDropdown(false);

        const params = new URLSearchParams();
        params.set("search", country.name_common);
        if (continent) params.set("continent", continent);

        router.push(`/search?${params.toString()}`);
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && mode === "home") {
            const params = new URLSearchParams();
            if (query) params.set("search", query);
            if (continent) params.set("continent", continent);
            router.push(`/search?${params.toString()}`);
        }
    };
    const handleContinentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newContinent = e.target.value;
        setContinent(newContinent);

        setQuery("");       
        setPage(1);         
        setHasMore(false);  
        setSuggestions([]); 

        const params = new URLSearchParams();
        if (newContinent) params.set("continent", newContinent);

        router.push(`/search?${params.toString()}`);
    };

    return (
        <div
            className={`relative flex gap-3 ${compact
                ? "p-2 w-full"
                : "p-6 w-full max-w-2xl bg-white rounded-xl shadow-lg"
                } text-gray-900`}
        >
            <div className="flex-1 relative">
                <input
                    type="text"
                    placeholder="Search countries..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-500"
                    value={query}
                    onChange={(e) => {
                        const value = e.target.value;
                        setQuery(value);

                        if (value.trim()) {
                            setShowDropdown(true);
                        } else {
                            setShowDropdown(false);

                            // 👇 if cleared, reset URL to show all countries
                            const params = new URLSearchParams();
                            if (continent) params.set("continent", continent);
                            router.push(`/search?${params.toString()}`);
                        }
                    }}
                    onFocus={() => query && setShowDropdown(true)}  // open only when focused + has query
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // close after blur
                    onKeyDown={handleKeyDown}
                />


                {showDropdown && suggestions?.length > 0 && (
                    <ul
                        ref={dropdownRef}
                        className="absolute z-20 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-60 overflow-auto shadow-lg text-gray-900"
                    >
                        {suggestions.map((s) => (
                            <li
                                key={s._id || s.cca3}
                                className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                                onClick={() => handleSelectSuggestion(s)}
                            >
                                {s.name_common}
                            </li>

                        ))}
                        {hasMore && (
                            <li className="px-3 py-2 text-center text-sm text-gray-500">
                                Scroll for more...
                            </li>
                        )}
                    </ul>
                )}
            </div>

            <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={continent}
                onChange={handleContinentChange}
            >
                <option value="">All Continents</option>
                {continents.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
            </select>
        </div>
    );
}
