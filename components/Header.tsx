// components/Header.tsx
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// You can create a simple placeholder for the 'AF' logo icon
function AfLogoIcon() {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-white text-xs font-bold text-black">
      AF
    </div>
  );
}

export default function Header() {
  return (
    // Main header container with padding and a bottom border
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-x-2">
        <div className="flex items-center justify-center rounded-md bg-gray-900 p-2">
          {/* Using a simple div as a placeholder for the actual logo icon */}
          <AfLogoIcon />
        </div>
        <span className="text-lg font-bold text-gray-900">AnimeFandom</span>
      </Link>
      
      {/* Search Bar */}
      <div className="relative w-1/3">
        {/* The Magnifying Glass icon, positioned inside the input */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        {/* The input field with padding on the left to make room for the icon */}
        <input
          type="text"
          placeholder="Search characters, series, games..."
          className="block w-full rounded-md border-0 bg-gray-100 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        />
      </div>

    </header>
  );
}