// app/api/import-series-by-name/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This GraphQL query searches for a single series by name
const query = `
  query ($search: String) {
    Media(search: $search, type: ANIME) {
      id
      title {
        romaji
      }
      description(asHtml: false)
      coverImage {
        large
      }
    }
  }
`;

export async function POST(request: Request) {
  try {
    const { seriesName } = await request.json();
    if (!seriesName) {
      return NextResponse.json({ error: 'Series name is required' }, { status: 400 });
    }

    console.log(`[Targeted Importer] Searching for: ${seriesName}`);
    
    // 1. Fetch the specific series from AniList
    const apiResponse = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        query: query,
        variables: { search: seriesName },
      }),
    });
    const jsonData = await apiResponse.json();
    const series = jsonData.data.Media;

    if (!series) {
      return NextResponse.json({ error: `Could not find "${seriesName}" on AniList.` }, { status: 404 });
    }

    // 2. Format the data for Supabase
    const seriesToUpsert = {
      anilist_id: series.id,
      name: series.title.romaji,
      description: series.description?.replace(/<br\s*\/?>/g, ' ') || 'No description available.',
      imageUrl: series.coverImage.large,
    };

    // 3. Perform a bulk 'upsert' into your Supabase table
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin.from('series').upsert(seriesToUpsert, {
      onConflict: 'anilist_id'
    });

    if (error) throw error;

    const summary = `Successfully imported ${series.title.romaji}.`;
    console.log(`[Targeted Importer] ${summary}`);
    return NextResponse.json({ success: true, message: summary });

  } catch (err: any) {
    console.error('[Targeted Importer Error]', err);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}