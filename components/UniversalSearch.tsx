// components/UniversalSearch.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function UniversalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ characters: any[], series: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 1) {
        setIsLoading(true);
        fetch(`/api/search?query=${query}`)
          .then(res => res.json())
          .then(data => {
            setResults(data);
            setIsLoading(false);
          });
      } else {
        setResults(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-xs">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="block w-full rounded-md border-0 bg-gray-100 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
      />

      {/* --- Search Results Dropdown (Text-Only) --- */}
      {query.length > 1 && (
        <div className="absolute z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {isLoading && <p className="px-4 py-2 text-sm text-gray-500">Searching...</p>}
            {results && !isLoading && (
              <>
                {results.series.length > 0 && (
                  <div>
                    <p className="px-4 pt-2 pb-1 text-xs font-bold uppercase text-gray-400">Series</p>
                    {results.series.map(item => (
                      <Link key={`series-${item.id}`} href={`/series/${item.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
                {results.characters.length > 0 && (
                  <div>
                    <p className="px-4 pt-2 pb-1 text-xs font-bold uppercase text-gray-400">Characters</p>
                    {results.characters.map(item => (
                       <Link key={`char-${item.id}`} href={`/character/${item.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
                {results.characters.length === 0 && results.series.length === 0 && (
                    <p className="px-4 py-2 text-sm text-gray-500">No results found.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}