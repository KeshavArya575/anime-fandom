// app/series/[id]/page.tsx
import Image from 'next/image';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import FollowButton from '@/components/FollowButton';
import CharacterCard from '@/components/CharacterCard';
import { notFound } from 'next/navigation';

const query = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title { romaji }
      description(asHtml: false)
      bannerImage
      characters {
        edges {
          node {
            id
            name { full }
            image { large }
          }
        }
      }
    }
  }
`;

async function getSeriesData(id: number) {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query: query, variables: { id: id } }),
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    console.error("AniList API Error:", await response.text());
    throw new Error('Failed to fetch data from AniList');
  }

  const json = await response.json();
  // ✅ This line is crucial. It returns the fetched data from the function.
  return json.data.Media;
}

export async function generateStaticParams() {
  const seriesIds = [405, 10632, 16397, 20791];
  return seriesIds.map((id) => ({
    id: id.toString(),
  }));
}

export default async function SeriesPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  const series = await getSeriesData(parseInt(params.id));
  
  if (!series) {
    notFound();
  }

  const description = series.description.replace(/<br\s*\/?>/g, '');

  return (
    <div className="space-y-8">
      <section className="relative -m-8 mb-8 h-64 w-auto">
        <Image 
          src={series.bannerImage}
          alt={`Banner for ${series.title.romaji}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">{series.title.romaji}</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600 line-clamp-2">{description}</p>
        </div>
        <div className="absolute bottom-8 right-8">
          <FollowButton seriesId={series.id} userId={session?.user?.id || null} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900">Characters</h2>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {series.characters.edges.map(({ node: char }: any) => (
            <CharacterCard
              key={char.id}
              name={char.name.full}
              series={series.title.romaji}
              imageUrl={char.image.large}
              href={`/character/${char.id}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}