// app/page.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import SpotlightSection from '@/components/SpotlightSection';
import SeriesCard from '@/components/SeriesCard';

// Helper to fetch data from AniList
async function getAniListData(type: 'CHARACTER' | 'ANIME', perPage: number = 5) {
  const query = `
    query {
      Page(page: 1, perPage: ${perPage}) {
        ${type === 'CHARACTER' ? 'characters(sort: FAVOURITES_DESC) { id, name { full }, image { large } }' : 'media(sort: POPULARITY_DESC, type: ANIME) { id, title { romaji }, description(asHtml: false), coverImage { large } }'}
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
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const [
    featuredSeriesDataRes,
    trendingCharacters,
    popularSeries
  ] = await Promise.all([
    supabase.from('series').select('*').order('created_at', { ascending: false }).limit(1).single(),
    getAniListData('CHARACTER', 4),
    getAniListData('ANIME', 6)
  ]);
  
  const featuredSeriesData = featuredSeriesDataRes.data;

  const featuredSeries = {
    category: 'Recently Added Series',
    title: featuredSeriesData?.name || 'Not available',
    description: featuredSeriesData?.description || 'No description available.',
    href: `/series/${featuredSeriesData?.anilist_id}`,
  };

  return (
    <div className="space-y-16">
      {/* === HERO SECTION === */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
          Discover. Follow. Discuss.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
          Your definitive companion for the world of anime.
        </p>
      </section>

      {/* === SPOTLIGHT SECTION === */}
      <SpotlightSection featuredSeries={featuredSeries} trendingCharacters={trendingCharacters} />

      {/* === MORE TO EXPLORE SECTION === */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">More to Explore</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularSeries.map((series: any) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
      </section>
    </div>
  );
}