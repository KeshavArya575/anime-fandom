// app/api/import-series/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GraphQL query to get the top 20 most popular ANIME series
const query = `
  query {
    Page(page: 2, perPage: 200) {
      media(type: ANIME, sort: POPULARITY_DESC) {
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
  }
`;

export async function POST(request: Request) {
  try {
    console.log('[Series Importer] Starting import from AniList...');
    
    // 1. Fetch the list of popular series from AniList
    const apiResponse = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const jsonData = await apiResponse.json();
    const seriesFromApi = jsonData.data.Page.media;

    if (!seriesFromApi || seriesFromApi.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch series from AniList.' }, { status: 500 });
    }
    console.log(`[Series Importer] Found ${seriesFromApi.length} series to import.`);

    // 2. Format the data to match your Supabase 'series' table schema
    const seriesToUpsert = seriesFromApi.map((series: any) => ({
      anilist_id: series.id, // The unique ID from AniList
      name: series.title.romaji,
      description: series.description?.replace(/<br\s*\/?>/g, ' ') || 'No description available.',
      imageUrl: series.coverImage.large,
    }));

    // 3. Perform a bulk 'upsert' into your Supabase table
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // .upsert() will insert new series and update existing ones if the anilist_id matches.
    const { error } = await supabaseAdmin.from('series').upsert(seriesToUpsert, {
      onConflict: 'anilist_id'
    });

    if (error) {
      throw error;
    }

    const summary = `Import complete. Successfully saved ${seriesToUpsert.length} series.`;
    console.log(`[Series Importer] ${summary}`);
    return NextResponse.json({ success: true, message: summary });

  } catch (err: any) {
    console.error('[Series Importer Error]', err);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}