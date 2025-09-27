// app/api/import/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This is the GraphQL query to get a series and all its characters
const aniListQuery = `
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

// This function fetches the data from AniList
async function getCharactersFromAniList(seriesId: number) {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      query: aniListQuery,
      variables: { id: seriesId },
    }),
  });
  const json = await response.json();
  return json.data.Media.characters.nodes;
}

export async function POST(request: Request) {
  try {
    const FATE_STAY_NIGHT_ID = 16498;
    console.log(`[AniList Importer] Starting import for series ID: ${FATE_STAY_NIGHT_ID}`);
    
    // 1. Fetch all characters for the series from AniList
    const characters = await getCharactersFromAniList(FATE_STAY_NIGHT_ID);

    if (!characters || characters.length === 0) {
      return NextResponse.json({ error: 'No characters found on AniList for this series.' }, { status: 404 });
    }
    console.log(`[AniList Importer] Found ${characters.length} characters to import.`);
    
    // 2. Format the data to match your Supabase 'characters' table schema
    const charactersToInsert = characters.map((char: any) => {
      // Clean up the description text
      const description = char.description?.replace(/~!|!~/g, '').replace(/\n/g, ' ') || 'No description available.';
      
      return {
        // We can use the AniList ID as the primary ID in our table
        // Make sure your 'id' column in Supabase is NOT set to auto-increment if you do this
        // Or create a new column for the anilist_id
        id: char.id, 
        name: char.name.full,
        description: description,
        info: {
          Age: char.age,
          Gender: char.gender,
          BloodType: char.bloodType,
        },
        imageUrl: char.image.large,
        profileUrl: char.image.large,
        // You would need another API call or a mapping to get series_id if needed
      };
    });

    // 3. Perform a bulk insert into your Supabase table
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
    
    // The .upsert() command will insert new characters and update existing ones if the ID matches.
    const { error } = await supabaseAdmin.from('characters').upsert(charactersToInsert);

    if (error) {
      console.error('[Supabase Error]', error);
      return NextResponse.json({ error: `Failed to save characters. Error: ${error.message}` }, { status: 500 });
    }

    const summary = `Import complete. Successfully saved ${charactersToInsert.length} characters.`;
    console.log(`[AniList Importer] ${summary}`);
    return NextResponse.json({ success: true, message: summary });

  } catch (err: any) {
    console.error('[Importer Error]', err);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}