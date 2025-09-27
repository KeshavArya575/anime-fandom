// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Search for characters and series in parallel
    const [charactersResponse, seriesResponse] = await Promise.all([
      supabase.from('characters').select('id, name, profileUrl').ilike('name', `%${query}%`).limit(5),
      supabase.from('series').select('id, name, imageUrl').ilike('name', `%${query}%`).limit(3)
    ]);

    const { data: characters, error: charactersError } = charactersResponse;
    const { data: series, error: seriesError } = seriesResponse;

    if (charactersError || seriesError) {
      console.error('Supabase search error:', charactersError || seriesError);
      throw new Error('Failed to fetch search results.');
    }

    return NextResponse.json({ characters, series });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}