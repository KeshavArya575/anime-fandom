// app/profile/page.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SeriesCard from '@/components/SeriesCard';

// This is a new GraphQL query that can fetch MULTIPLE series by their IDs
const query = `
  query ($ids: [Int]) {
    Page(page: 1, perPage: 50) {
      media(id_in: $ids, type: ANIME) {
        id
        title {
          romaji
        }
        description(asHtml: false)
        coverImage {
          large
          color
        }
      }
    }
  }
`;

// This new function takes an array of IDs and fetches their data from AniList
async function getLibrarySeriesData(ids: number[]) {
  if (ids.length === 0) return [];
  
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      query: query,
      variables: { ids: ids },
    }),
    next: { revalidate: 3600 } // Revalidate once per hour
  });

  if (!response.ok) {
    throw new Error('Failed to fetch series data from AniList');
  }

  const json = await response.json();
  return json.data.Page.media;
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  // 1. Get the LIST of followed series IDs from your Supabase library
  const { data: libraryItems } = await supabase
    .from('user_library')
    .select('series_id')
    .eq('user_id', session.user.id);
  
  const followedSeriesIds = libraryItems?.map(item => item.series_id) || [];

  // 2. Fetch the full series DETAILS for those IDs from AniList
  const followedSeries = await getLibrarySeriesData(followedSeriesIds);

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Welcome, {profile?.username || 'User'}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          This is your personal library. Here are the series you're currently following.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900">Your Followed Series</h2>
        {followedSeries.length > 0 ? (
          <div className="mt-6 space-y-4">
            {/* 3. Display the data fetched from AniList */}
            {followedSeries.map((series: any) => (
              series && <SeriesCard key={series.id} series={series} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">You haven't followed any series yet.</p>
        )}
      </section>
    </div>
  );
}