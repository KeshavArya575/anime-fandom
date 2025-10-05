// components/UniversalSearch.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import the router
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function UniversalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ characters: any[], series: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    // ... (the debouncing and fetching logic remains the same)
  }, [query]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // When the user presses Enter and the query is not empty...
    if (e.key === 'Enter' && query) {
      // ...navigate to the search results page.
      router.push(`/search?q=${query}`);
      setQuery(''); // Clear the search bar
    }
  };

  return (
    <div className="relative w-1/3">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearchSubmit} // Add the keydown event handler
        placeholder="Search characters, series..."
        className="block w-full rounded-md border-0 bg-gray-100 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
      />

      {/* --- Search Results Dropdown (remains the same) --- */}
    </div>
  );
}