// app/search/page.tsx
import { supabase } from '@/lib/supabaseClient';
import CharacterCard from '@/components/CharacterCard';
import SeriesCard from '@/components/SeriesCard';

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const query = searchParams?.q || '';

  if (!query) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Search the Database</h1>
        <p className="mt-2 text-gray-600">Please enter a term in the search bar above.</p>
      </div>
    );
  }

  // Search for characters and series in parallel
  const [charactersResponse, seriesResponse] = await Promise.all([
    supabase.from('characters').select('*').ilike('name', `%${query}%`),
    supabase.from('series').select('*').ilike('name', `%${query}%`)
  ]);

  const { data: characters } = charactersResponse;
  const { data: series } = seriesResponse;

  const hasResults = (characters && characters.length > 0) || (series && series.length > 0);

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Search Results for "{query}"
        </h1>
      </section>

      {!hasResults ? (
        <p className="mt-4 text-gray-500">No results found for your query.</p>
      ) : (
        <>
          {/* Characters Section */}
          {characters && characters.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900">Characters</h2>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {characters.map((char) => (
                  <CharacterCard
                    key={char.id}
                    name={char.name}
                    series="Fate Series" // Fallback
                    imageUrl={char.profile_url || '/artoria-profile.png'}
                    href={`/character/${char.id}`}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Series Section */}
          {series && series.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900">Series</h2>
              <div className="mt-6 space-y-4">
                {series.map((s) => (
                  <SeriesCard key={s.id} series={s} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}