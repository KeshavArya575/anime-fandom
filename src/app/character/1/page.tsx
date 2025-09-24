// app/character/[id]/page.tsx
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient'; // Assuming you have this
import LoreCard, { CiteSourcesButton } from '@/components/LoreCard'; // Import the new components

// A simple tag component for this page
function AttributeTag({ label }: { label: string }) {
  return <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">{label}</span>;
}

export default async function CharacterPage({ params }: { params: { id: string } }) {
  // For now, let's use mock data to build the UI.
  const character = {
    name: 'Artoria Pendragon',
    series: 'Fate/Stay Night',
    rank: 3,
    imageUrl: '/artoria-banner.jpg', // Ensure this image is in your `public` folder
    profileUrl: '/artoria-profile.jpg', // Ensure this image is in your `public` folder
    description: 'The legendary King of Knights who pulled the sword from the stone. A noble and determined ruler who sacrificed everything for her kingdom and people. Known for her unwavering sense of justice and honor.',
    attributes: ['Noble', 'Leader', 'Heroic', 'Determined'],
    info: { Age: 'Unknown (appears ~15)', Height: '154cm', Class: 'Saber', Origin: 'Arthurian Legend' }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* === Hero Section === */}
      <div className="relative h-60 w-full overflow-hidden rounded-xl">
        <Image src={character.imageUrl} alt={`${character.name} banner`} layout="fill" objectFit="cover" className="object-center" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-0 left-0 flex items-end gap-x-4 p-6">
          <div className="relative h-28 w-28 overflow-hidden rounded-lg border-2 border-white">
            <Image src={character.profileUrl} alt={`${character.name} profile`} layout="fill" objectFit="cover" />
          </div>
          <div className="pb-1">
            <h1 className="text-3xl font-bold text-white">{character.name}</h1>
            <p className="text-sm text-gray-200">{character.series} • Rank #{character.rank}</p>
          </div>
        </div>
      </div>

      {/* === Actions & Tabs Section === */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600">
            Follow (12.5K)
          </button>
          <button className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Add to List
          </button>
        </div>
        <div className="text-sm font-medium text-gray-500">
          <div className="flex gap-x-8 border-b border-gray-200">
            <a href="#" className="border-b-2 border-blue-500 py-2 text-blue-600">Overview</a>
            <a href="#" className="border-b-2 border-transparent py-2 hover:border-gray-300 hover:text-gray-700">Stats</a>
            <a href="#" className="border-b-2 border-transparent py-2 hover:border-gray-300 hover:text-gray-700">Trivia</a>
            <a href="#" className="border-b-2 border-transparent py-2 hover:border-gray-300 hover:text-gray-700">Media</a>
          </div>
        </div>
      </div>
      
      {/* === Character Info Section === */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Character Information</h2>
        <div className="mt-4 grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-x-6">
          <div className="space-y-2 text-sm">
            {Object.entries(character.info).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium text-gray-500">{key}</span>
                <span className="text-gray-800">{value}</span>
              </div>
            ))}
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Attributes</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {character.attributes.map(attr => <AttributeTag key={attr} label={attr} />)}
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="mt-2 text-sm text-gray-800 leading-relaxed">{character.description}</p>
        </div>
      </div>

      {/* === LORE & HISTORY SECTION (NEW) === */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Lore & History</h2>
          <button className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Spoiler-safe mode
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <LoreCard title="Early Life" wordCount={342} updatedText="2 days ago">
            <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
              <p>Born in 6th century Britain, Artoria Pendragon was raised as the son of King Uther Pendragon, though her true gender was hidden from the kingdom...</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Raised in secrecy by Sir Ector</li>
                <li>Trained by Merlin in combat and statecraft</li>
              </ul>
              <p className="text-xs text-gray-500">Sources: Fate/stay night Visual Novel, Type-Moon Character Material</p>
              <CiteSourcesButton />
            </div>
          </LoreCard>
          <LoreCard title="Adventures & Campaigns" wordCount={521} updatedText="1 week ago">
             <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
              <p>As King Arthur, Artoria led numerous campaigns to unite and defend Britain against Saxon invaders and internal threats...</p>
            </div>
          </LoreCard>
          <LoreCard title="Aftermath & Legacy" wordCount={156} updatedText="1 week ago">
            <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
              <p>Even in death, Artoria's legend continued to grow. Her story became the foundation for countless tales of chivalry, honor, and sacrifice...</p>
              <blockquote className="border-l-4 border-gray-200 bg-gray-50 p-4 italic text-gray-600">
                "I will continue to believe in the path I chose. Someone has to become king, someone has to bear the burden."
                <span className="mt-2 block not-italic font-semibold text-gray-700">— Artoria Pendragon</span>
              </blockquote>
            </div>
          </LoreCard>
          <LoreCard title="Trivia & Fun Facts" wordCount={89} updatedText="6 hours ago">
            <div className="text-sm text-gray-800 leading-relaxed">
              <ul className="list-disc space-y-2 pl-5">
                <li>Artoria's appetite is legendary even among Servants, often surprising her Masters.</li>
                <li>She has a particular fondness for modern hamburgers and considers them "royal food".</li>
              </ul>
            </div>
          </LoreCard>
        </div>
      </div>

    </div>
  );
}