// components/SeriesList.tsx
'use client';

import { useState } from 'react';
import SeriesCard from './SeriesCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// This type should match what your database/API provides
type Series = {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  anilist_id: number | null;
};

export default function SeriesList({ allSeries }: { allSeries: Series[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSeries = allSeries.filter((series) =>
    series.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a series..."
          className="block w-full max-w-lg rounded-md border-0 bg-white py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        />
      </div>

      {/* Grid of Series Cards */}
      <div className="space-y-4">
        {filteredSeries.map((series) => (
          // ✅ FIX: Pass the entire 'series' object as a single prop
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>
    </div>
  );
}