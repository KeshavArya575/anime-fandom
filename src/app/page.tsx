// app/page.tsx
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link'; // Make sure this import is present

type Character = {
  id: number;
  name: string;
};

export default async function HomePage() {
  const { data: characters, error } = await supabase
    .from('characters')
    .select('id, name');

  if (error) return <p>Could not fetch characters.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
        Anime Fandom Characters
      </h1>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {characters.map((character: Character) => (
          // The <Link> component MUST be the parent element for the link to work.
          <Link 
            key={character.id} // The key should be on the outermost element in a map.
            href={`/character/${character.id}`} // Correctly formats the URL, e.g., /character/1
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
          >
            <div className="min-w-0 flex-1">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">{character.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}