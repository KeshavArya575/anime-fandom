// app/characters/page.tsx
import { supabase } from '@/lib/supabaseClient';
import CharacterCard from '@/components/CharacterCard';

// Define a type for our grouped data structure for clarity
type GroupedCharacters = {
  [seriesName: string]: any[];
};

export default async function CharactersPage() {
  // 1. Fetch all characters AND their related series info in one query.
  // The 'series(name)' part tells Supabase to also get the 'name' from the linked 'series' table.
  const { data: characters, error } = await supabase
    .from('characters')
    .select('*, series(name)')
    .order('name', { ascending: true });

  if (error) {
    return <p className="p-8">Error fetching characters: {error.message}</p>;
  }

  // 2. Group the characters by their series name.
  const groupedCharacters = (characters || []).reduce((acc: GroupedCharacters, char) => {
    const seriesName = char.series?.name || 'Uncategorized';
    if (!acc[seriesName]) {
      acc[seriesName] = [];
    }
    acc[seriesName].push(char);
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">All Characters</h1>
        <p className="mt-2 text-lg text-gray-600">
          Browse all characters, grouped by their series.
        </p>
      </section>

      {/* 3. Render each group of characters */}
      <div className="space-y-10">
        {Object.entries(groupedCharacters).map(([seriesName, chars]) => (
          <section key={seriesName}>
            <h2 className="border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900">
              {seriesName}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {chars.map((char) => (
                <CharacterCard
                  key={char.id}
                  name={char.name}
                  series={seriesName}
                  imageUrl={char.profile_url || '/artoria-profile.png'}
                  href={`/character/${char.id}`}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}