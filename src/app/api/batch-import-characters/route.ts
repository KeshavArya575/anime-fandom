// app/api/batch-import-characters/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const seriesCharactersQuery = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title { romaji }
      characters {
        nodes {
          id
          name { full }
          description(asHtml: false)
          image { large }
          age
          gender
          bloodType
        }
      }
    }
  }
`;

async function getCharactersFromAniList(seriesId: number) {
  // ... (this function remains the same as before)
}

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // ✅ Make sure to select the local 'id' from your series table
    const { data: seriesInDb, error: seriesError } = await supabaseAdmin
      .from('series')
      .select('id, name, anilist_id');

    if (seriesError) throw seriesError;
    console.log(`[Batch Importer] Found ${seriesInDb.length} series in the database to process.`);

    const characterMap = new Map();

    for (const series of seriesInDb) {
      console.log(`-- Fetching characters for ${series.name}...`);
      const charactersFromApi = await getCharactersFromAniList(series.anilist_id);
      
      if (!Array.isArray(charactersFromApi)) {
        console.log(`-- -> No characters found for ${series.name}. Skipping.`);
        continue;
      }

      const formattedCharacters = charactersFromApi.map((char: any) => {
        const description = char.description?.replace(/~!|!~/g, '').replace(/\n/g, ' ') || 'No description available.';
        return {
          id: char.id,
          name: char.name.full,
          description: description,
          info: { Age: char.age, Gender: char.gender, BloodType: char.bloodType },
          imageUrl: char.image.large,
          profileUrl: char.image.large,
          series_id: series.id, // ✅ FIX: Add the series ID from the Supabase series table
        };
      });

      for (const char of formattedCharacters) {
        characterMap.set(char.id, char);
      }
      
      console.log(`-- -> Found ${formattedCharacters.length} characters.`);
    }

    const allCharactersToInsert = Array.from(characterMap.values());

    if (allCharactersToInsert.length > 0) {
      console.log(`[Batch Importer] Saving ${allCharactersToInsert.length} total UNIQUE characters to Supabase...`);
      const { error: insertError } = await supabaseAdmin
        .from('characters')
        .upsert(allCharactersToInsert, { onConflict: 'id' });

      if (insertError) throw insertError;
    }

    const summary = `Import complete. Processed ${seriesInDb.length} series and saved/updated ${allCharactersToInsert.length} characters.`;
    return NextResponse.json({ success: true, message: summary });

  } catch (err: any) {
    console.error('[Batch Importer Error]', err);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}