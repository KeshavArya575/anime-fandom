// components/Footer.tsx
import Link from 'next/link';

function AfLogoIcon() {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-white text-xs font-bold text-black">
      AF
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-x-2">
              <div className="flex items-center justify-center rounded-md bg-gray-900 p-2">
                <AfLogoIcon />
              </div>
              <span className="text-lg font-bold text-gray-900">AnimeFandom</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Your ultimate companion for anime, manga, and gaming fandoms.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Navigation</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li><Link href="/characters" className="text-sm text-gray-600 hover:text-gray-900">Characters</Link></li>
              <li><Link href="/series" className="text-sm text-gray-600 hover:text-gray-900">Series</Link></li>
              <li><Link href="/popularity" className="text-sm text-gray-600 hover:text-gray-900">Popularity</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Legal</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Claim</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} AnimeFandom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}