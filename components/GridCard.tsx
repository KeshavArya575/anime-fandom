// components/SeriesTile.tsx
import Image from 'next/image';
import Link from 'next/link';

type Series = {
  id: number;
  title: {
    romaji: string;
  };
  coverImage: {
    large: string;
  };
};

export default function SeriesTile({ series }: { series: Series }) {
  return (
    <Link href={`/series/${series.id}`} className="group relative block">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl">
        <Image
          src={series.coverImage.large}
          alt={series.title.romaji}
          fill
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="font-bold text-white shadow-black text-shadow">
          {series.title.romaji}
        </h3>
      </div>
    </Link>
  );
}