// app/series/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import SeriesList from '@/components/SeriesList';
import PaginationControls from '@/components/PaginationControls';

const ITEMS_PER_PAGE = 10;

export default async function SeriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // ✅ Use the direct-creation method for the Supabase client
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Fetch a "page" of series AND the total count
  const { data: series, error, count } = await supabase
    .from('series')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  if (error) {
    return <p className="p-8">Error fetching series: {error.message}</p>;
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">All Series</h1>
        <p className="mt-2 text-lg text-gray-600">
          Browse all series from the database.
        </p>
      </section>
      
      <SeriesList allSeries={series || []} />

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/series"
      />
    </div>
  );
}