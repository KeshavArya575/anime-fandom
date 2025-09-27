// app/series/page.tsx
import { supabase } from '@/lib/supabaseClient';
import SeriesList from '@/components/SeriesList';

export default async function SeriePage() {
  // Fetch all series from the database, sorted alphabetically
  const { data: series, error } = await supabase
    .from('series')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return <p className="p-8">Error fetching series: {error.message}</p>;
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">All Series</h1>
        <p className="mt-2 text-lg text-gray-600">
          Browse all series stored in the database.
        </p>
      </section>

      {/* Render the client component and pass the fetched data to it */}
      <SeriesList allSeries={series || []} />
    </div>
  );
}