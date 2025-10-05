// app/page.tsx
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import FeaturedCard from '@/components/FeatureCard';
import { UserGroupIcon, FilmIcon, PencilIcon } from '@heroicons/react/24/outline';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper function to get top characters/series from AniList
async function getTrendingFromAniList(type: 'CHARACTER' | 'ANIME', perPage: number = 5) {
  const query = `
    query {
      Page(page: 1, perPage: ${perPage}) {
        ${type === 'CHARACTER' ? 'characters(sort: FAVOURITES_DESC)' : 'media(sort: POPULARITY_DESC, type: ANIME)'} {
          id
          name { full }
          title { romaji }
        }
      }
    }
  `;
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 }
  });
  if (!response.ok) return [];
  const json = await response.json();
  return type === 'CHARACTER' ? json.data.Page.characters : json.data.Page.media;
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // --- FETCH ALL LIVE DATA IN PARALLEL ---
  const [
    characterCountRes,
    seriesCountRes,
    featuredCharacterDataRes,
    featuredSeriesDataRes,
    trendingCharacters,
    popularSeries
  ] = await Promise.all([
    supabase.from('characters').select('*', { count: 'exact', head: true }),
    supabase.from('series').select('*', { count: 'exact', head: true }),
    supabase.from('characters').select('*').order('created_at', { ascending: false }).limit(1).single(),
    supabase.from('series').select('*').order('created_at', { ascending: false }).limit(1).single(),
    getTrendingFromAniList('CHARACTER'),
    getTrendingFromAniList('ANIME')
  ]);
  
  const characterCount = characterCountRes.count;
  const seriesCount = seriesCountRes.count;
  const featuredCharacterData = featuredCharacterDataRes.data;
  const featuredSeriesData = featuredSeriesDataRes.data;

  // ... (rest of your component logic and JSX remains the same)
  
  const featuredCharacter = {
    category: 'Recently Added Character',
    title: featuredCharacterData?.name || 'Not available',
    description: featuredCharacterData?.description || 'No description available.',
    stats: [
      { label: 'Class', value: featuredCharacterData?.info?.Class || 'N/A' },
      { label: 'Origin', value: featuredCharacterData?.info?.Origin || 'N/A' },
    ],
    href: `/character/${featuredCharacterData?.id}`,
  };

  const featuredSeries = {
    category: 'Recently Added Series',
    title: featuredSeriesData?.name || 'Not available',
    description: featuredSeriesData?.description || 'No description available.',
    stats: [
      { label: 'Format', value: 'Anime' },
      { label: 'AniList ID', value: featuredSeriesData?.anilist_id || 'N/A' },
    ],
    href: `/series/${featuredSeriesData?.anilist_id}`,
  };

  return (
    <div className="space-y-16">
      {/* === HERO SECTION (with live stats) === */}
      <section className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to AnimeFandom
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
          Your ultimate companion for anime, manga, and gaming fandoms.
        </p>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard icon={<UserGroupIcon className="h-6 w-6 text-gray-500" />} label="Characters" value={characterCount?.toLocaleString() || '0'} />
          <StatCard icon={<FilmIcon className="h-6 w-6 text-gray-500" />} label="Series" value={seriesCount?.toLocaleString() || '0'} />
          <StatCard icon={<PencilIcon className="h-6 w-6 text-gray-500" />} label="Users" value="-" />
        </div>
      </section>

      {/* === FEATURED CONTENT SECTION (live) === */}
      <section>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FeaturedCard {...featuredCharacter} />
          <FeaturedCard {...featuredSeries} />
        </div>
      </section>

      {/* === QUICK ACCESS LISTS (live from AniList) === */}
      <section className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Trending Characters</h3>
          <ul className="mt-4 space-y-2">
            {trendingCharacters.map((char: any) => (
              <li key={char.id}>
                <Link href={`/character/${char.id}`} className="block rounded-md p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800">
                  {char.name.full}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Popular Series</h3>
          <ul className="mt-4 space-y-2">
            {popularSeries.map((series: any) => (
              <li key={series.id}>
                <Link href={`/series/${series.id}`} className="block rounded-md p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800">
                  {series.title.romaji}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}