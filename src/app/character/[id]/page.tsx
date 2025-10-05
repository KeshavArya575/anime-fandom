// app/character/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This is the GraphQL query to get a character's details from AniList
const query = `
  query ($id: Int) {
    Character(id: $id) {
      id
      name { full, native }
      image { large }
      description(asHtml: false)
      gender
      age
      dateOfBirth { year, month, day }
      bloodType
      media(sort: POPULARITY_DESC) {
        edges {
          node {
            id
            title { romaji }
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
    body: JSON.stringify({ query, variables: { id } }),
    next: { revalidate: 3600 }
  });
  if (!response.ok) throw new Error('Failed to fetch data from AniList');
  const json = await response.json();
  return json.data.Character;
}

// This tells Next.js which character pages to build ahead of time
export async function generateStaticParams() {
  const characterIds = [2533, 498, 499, 2069]; // Artoria, Shirou, Rin, Gilgamesh
  return characterIds.map((id) => ({
    id: id.toString(),
  }));
}

export default async function CharacterPage({ params }: { params: { id: string } }) {
  const character = await getCharacterData(parseInt(params.id));
  if (!character) notFound();

  const primarySeries = character.media.edges.find((e: any) => e.node.type === 'ANIME')?.node;
  const descriptionHtml = character.description
    ?.replace(/~!|!~/g, '')
    .replace(/\n{2,}/g, '</p><p class="mt-4">') || 'No description available.';

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* === Hero Section === */}
      <div className="relative h-60 w-full overflow-hidden rounded-xl">
        <Image src={character.image.large} alt={`${character.name.full} banner`} fill className="object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 flex items-end gap-x-4 p-6">
          <div className="relative h-28 w-28 overflow-hidden rounded-lg border-2 border-white">
            <Image src={character.image.large} alt={`${character.name.full} profile`} fill className="object-cover" />
          </div>
          <div className="pb-1">
            <h1 className="text-3xl font-bold text-white">{character.name.full}</h1>
            {primarySeries && <p className="text-sm text-gray-200">{primarySeries.title.romaji}</p>}
          </div>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-x-2">
            <Button variant="secondary">Add to List</Button>
            <Button>Follow</Button>
        </div>
      </div>
      
      {/* === TABS & CONTENT SECTION === */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="media">Media Appearances</TabsTrigger>
        </TabsList>

        {/* --- Overview Tab Content --- */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Left Column: Basic Information */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader><CardTitle>Character Information</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                    {character.name.native && <div className="flex justify-between"><span className="font-medium text-muted-foreground">Japanese</span><span className="font-medium text-foreground">{character.name.native}</span></div>}
                    {character.age && <div className="flex justify-between"><span className="font-medium text-muted-foreground">Age</span><span className="font-medium text-foreground">{character.age}</span></div>}
                    {character.gender && <div className="flex justify-between"><span className="font-medium text-muted-foreground">Gender</span><span className="font-medium text-foreground">{character.gender}</span></div>}
                    {character.bloodType && <div className="flex justify-between"><span className="font-medium text-muted-foreground">Blood Type</span><span className="font-medium text-foreground">{character.bloodType}</span></div>}
                    {character.dateOfBirth.month && <div className="flex justify-between text-right"><span className="font-medium text-muted-foreground">Birthday</span><span className="font-medium text-foreground">{`${character.dateOfBirth.month}/${character.dateOfBirth.day}/${character.dateOfBirth.year || ''}`}</span></div>}
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column: Description / Lore */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader><CardTitle>Background</CardTitle></CardHeader>
                <CardContent className="prose prose-sm max-w-none text-foreground">
                  <p dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- Media Appearances Tab Content --- */}
        <TabsContent value="media" className="mt-6">
          <Card>
             <CardHeader><CardTitle>Appears In</CardTitle></CardHeader>
             <CardContent>
              <ul className="space-y-2">
                {character.media.edges.map(({ node: media }: any) => (
                  <li key={media.id}>
                    <Link href={`/series/${media.id}`} className="block rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                      <span className="font-medium">{media.title.romaji}</span> <span className="text-xs">({media.type})</span>
                    </Link>
                  </li>
                ))}
              </ul>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}