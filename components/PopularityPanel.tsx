// components/PopularityPanel.tsx
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';

// A small, reusable component for the list items
function PopularityItem({ href, imageUrl, name, subtitle }: any) {
  return (
    <Link href={href} className="flex items-center gap-x-3 rounded-md p-2 hover:bg-gray-50">
      <div className="relative h-10 w-10 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </Link>
  );
}

// The main component is async so it can fetch data
export default async function PopularityPanel() {
   const supabase = createClientComponentClient();

  // Fetch the top 5 characters and series in parallel
  const [charactersRes, seriesRes] = await Promise.all([
    supabase.from('characters').select('*').limit(5),
    supabase.from('series').select('*').limit(3)
  ]);

  const { data: characters } = charactersRes;
  const { data: series } = seriesRes;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Popularity Panel</h3>
      
      {/* Popular Characters Section */}
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">Popular Characters</p>
        <div className="mt-2 space-y-1">
          {characters?.map(char => (
            <PopularityItem
              key={`char-${char.id}`}
              href={`/character/${char.id}`}
              imageUrl={char.profile_url || '/artoria-profile.png'}
              name={char.name}
              subtitle="Character"
            />
          ))}
        </div>
      </div>

      {/* Popular Series Section */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-500">Popular Series</p>
        <div className="mt-2 space-y-1">
          {series?.map(s => (
            <PopularityItem
              key={`series-${s.id}`}
              href={`/series/${s.anilist_id}`}
              imageUrl={s.image_url || '/fsn-series.jpg'}
              name={s.name}
              subtitle="Series"
            />
          ))}
        </div>
      </div>
    </div>
  );
}