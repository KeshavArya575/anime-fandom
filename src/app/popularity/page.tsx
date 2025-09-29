// app/popularity/page.tsx
import Image from 'next/image';
import Link from 'next/link';

const query = `
  query {
    Page(page: 1, perPage: 25) {
      media(sort: SCORE_DESC, type: ANIME) {
        id
        title {
          romaji
        }
        coverImage {
          large
        }
        averageScore
      }
    }
  }
`;

async function getRankedAnime() {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query }),
    next: { revalidate: 86400 } // Revalidate once per day
  });
  if (!response.ok) return [];
  const json = await response.json();
  return json.data.Page.media;
}

export default async function PopularityIndexPage() {
  const rankedAnime = await getRankedAnime();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Popularity Index</h1>
        <p className="mt-2 text-lg text-gray-600">Top 25 anime series, ranked by user score.</p>
      </section>
      <section className="rounded-xl border bg-white shadow-sm">
        <ul className="divide-y divide-gray-200">
          {rankedAnime.map((anime: any, index: number) => (
            <li key={anime.id}>
              <Link href={`/series/${anime.id}`} className="group flex items-center gap-x-4 p-4 hover:bg-gray-50">
                <span className="text-xl font-bold text-gray-400">#{index + 1}</span>
                <div className="relative h-20 w-14 flex-shrink-0 overflow-hidden rounded">
                  <Image src={anime.coverImage.large} alt={anime.title.romaji} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-indigo-600">{anime.title.romaji}</p>
                </div>
                <div className="flex items-center gap-x-1">
                  <span className="font-bold text-gray-800">{anime.averageScore}</span>
                  <span className="text-xs text-gray-500">/ 100</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}