"use client";
import { useState } from "react";

export default function FlagImage({ src, alt }: { src: string | null; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-40 bg-gray-100 rounded-t-xl overflow-hidden">
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      )}

      {!error ? (
        <img
          src={src || ""}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true);
            setLoaded(true);
          }}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
          🚩 Flag not available
        </div>
      )}
    </div>
  );
}
