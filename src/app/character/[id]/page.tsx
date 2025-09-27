// app/character/[id]/page.tsx
import Image from 'next/image';
import { notFound } from 'next/navigation';

// This is the GraphQL query to get a character's details from AniList
const query = `
  query ($id: Int) {
    Character(id: $id) {
      id
      name {
        full
        native
      }
      image {
        large
      }
      description(asHtml: false)
      gender
      age
      dateOfBirth {
        year
        month
        day
      }
      bloodType
      media {
        edges {
          node {
            id
            title {
              romaji
            }
            type
          }
        }
      }
    }
  }
`;

// This function fetches the data from AniList
async function getCharacterData(id: number) {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      query: query,
      variables: { id: id },
    }),
    next: { revalidate: 3600 } // Revalidate once per hour
  });

  if (!response.ok) {
    console.error("AniList API Error:", await response.text());
    throw new Error('Failed to fetch data from AniList');
  }

  const json = await response.json();
  return json.data.Character;
}

// This tells Next.js which character pages to build ahead of time.
// We'll use the AniList IDs for the main Fate/stay night cast.
export async function generateStaticParams() {
  const characterIds = [497, 496, 498, 2514]; // Artoria, Shirou, Rin, Gilgamesh
  return characterIds.map((id) => ({
    id: id.toString(),
  }));
}

function AttributeTag({ label }: { label: string | null }) {
  if (!label) return null;
  return <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">{label}</span>;
}

export default async function CharacterPage({ params }: { params: { id: string } }) {
  const character = await getCharacterData(parseInt(params.id));

  if (!character) {
    notFound();
  }

  // Find the primary series the character appears in
  const primarySeries = character.media.edges.find((e: any) => e.node.type === 'ANIME')?.node;
  // Clean up the description text
  const description = character.description?.replace(/~!|!~/g, '').replace(/\n/g, ' ');

  return (
    <div className="mx-auto max-w-7xl">
      {/* === Hero Section === */}
      <div className="relative h-60 w-full overflow-hidden rounded-xl">
        <Image 
          src={character.image.large} 
          alt={`${character.name.full} banner`} 
          fill 
          className="object-cover object-top" 
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-0 left-0 flex items-end gap-x-4 p-6">
          <div className="relative h-28 w-28 overflow-hidden rounded-lg border-2 border-white">
            <Image 
              src={character.image.large} 
              alt={`${character.name.full} profile`} 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="pb-1">
            <h1 className="text-3xl font-bold text-white">{character.name.full}</h1>
            {primarySeries && <p className="text-sm text-gray-200">{primarySeries.title.romaji}</p>}
          </div>
        </div>
      </div>
      
      {/* ... (Actions & Tabs Section remains the same) ... */}

      {/* === Character Info Section (Now using AniList data) === */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Character Information</h2>
        <div className="mt-4 grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-x-6">
          <div className="space-y-2 text-sm">
            {character.name.native && <div className="flex justify-between"><span className="font-medium text-gray-500">Japanese Name</span><span className="text-gray-800">{character.name.native}</span></div>}
            {character.age && <div className="flex justify-between"><span className="font-medium text-gray-500">Age</span><span className="text-gray-800">{character.age}</span></div>}
            {character.gender && <div className="flex justify-between"><span className="font-medium text-gray-500">Gender</span><span className="text-gray-800">{character.gender}</span></div>}
            {character.bloodType && <div className="flex justify-between"><span className="font-medium text-gray-500">Blood Type</span><span className="text-gray-800">{character.bloodType}</span></div>}
            {character.dateOfBirth.month && <div className="flex justify-between"><span className="font-medium text-gray-500">Birthday</span><span className="text-gray-800">{`Month: ${character.dateOfBirth.month}, Day: ${character.dateOfBirth.day}`}</span></div>}
          </div>
          <div className="md:col-span-2">
            {/* The attributes section can be used for other data or removed */}
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-800">{description || 'No description available.'}</p>
        </div>
      </div>
    </div>
  );
}