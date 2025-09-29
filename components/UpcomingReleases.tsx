// components/UpcomingReleases.tsx
import Image from 'next/image';
import Link from 'next/link';

const query = `
  query {
    Page(page: 1, perPage: 5) {
      media(sort: POPULARITY_DESC, type: ANIME, status: NOT_YET_RELEASED) {
        id
        title {
          romaji
        }
        coverImage {
          large
        }
        startDate {
          month
          day
          year
        }
      }
    }
  }
`;

async function getUpcomingReleases() {
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

export default async function UpcomingReleases() {
  const releases = await getUpcomingReleases();

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900">Upcoming Releases</h3>
      <ul className="mt-4 space-y-4">
        {releases.map((release: any) => (
          <li key={release.id}>
            <Link href={`/series/${release.id}`} className="group flex items-center gap-x-3">
              <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-md">
                <Image src={release.coverImage.large} alt={release.title.romaji} fill className="object-cover" />
              </div>
              <div>
                <p className="font-medium text-gray-800 group-hover:text-indigo-600">{release.title.romaji}</p>
                <p className="text-xs text-gray-500">
                  {new Date(release.startDate.year, release.startDate.month - 1, release.startDate.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}