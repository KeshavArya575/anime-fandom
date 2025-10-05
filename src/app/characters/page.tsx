// app/characters/page.tsx
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  
} from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';
import CharacterGrid from '@/components/CharacterGrid'; // Our new client component

export default async function CharactersPage() {
  // Fetch all characters, sorted alphabetically
  const { data: characters, error } = await supabase
    .from('characters')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return <p className="p-8">Error fetching characters: {error.message}</p>;
  }

  // Use the first 5 characters for the featured carousel
  const featuredCharacters = characters?.slice(10, 15) || [];

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Characters</h1>
        <p className="mt-2 text-lg text-gray-600">Browse the full character database.</p>
      </section>

      {/* Featured Characters Carousel */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured</h2>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {featuredCharacters.map((char) => (
              <CarouselItem key={char.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Link href={`/character/${char.id}`} className="group">
                    <Card className="overflow-hidden">
                      <CardContent className="relative flex aspect-video items-center justify-center p-6">
                        <Image
                          src={char.imageUrl || '/artoria-banner.jpg'}
                          alt={char.name}
                          fill
                          className="object-cover brightness-50 transition-all group-hover:brightness-75"
                        />
                        <h3 className="relative z-10 text-2xl font-bold text-white">
                          {char.name}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
        </Carousel>
      </section>

      {/* All Characters Grid (Interactive) */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900">All Characters</h2>
        <div className="mt-4">
          <CharacterGrid characters={characters || []} />
        </div>
      </section>
    </div>
  );
}