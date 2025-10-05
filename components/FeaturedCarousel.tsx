// components/FeaturedCarousel.tsx
'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedCarousel({ items, type }: { items: any[]; type: 'character' | 'series' }) {
  return (
    <Carousel opts={{ align: 'start', loop: true }} className="w-full">
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/4">
            <div className="p-1">
              <Link href={`/${type}/${type === 'series' ? item.anilist_id : item.id}`} className="group">
                <Card className="overflow-hidden">
                  <CardContent className="relative flex aspect-video items-center justify-center p-0">
                    <Image
                      src={item.imageUrl || '/artoria-banner.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover brightness-50 transition-all duration-300 group-hover:brightness-75 group-hover:scale-105"
                    />
                    <h3 className="relative z-10 p-4 text-center text-xl font-bold text-white">
                      {item.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-12" />
      <CarouselNext className="mr-12" />
    </Carousel>
  );
}