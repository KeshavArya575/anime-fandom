// components/SeriesCard.tsx
import Image from 'next/image';
import Link from 'next/link';

type Series = {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  anilist_id: number | null;
};

export default function SeriesCard({ series }: { series: Series }) {
  const description = series.description || 'No description available.';

  return (
    <Link href={`/series/${series.anilist_id || series.id}`} className="group block">
      <div className="flex items-center gap-x-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 ease-in-out group-hover:shadow-lg">
        <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={series.image_url || '/fsn-series.jpg'}
            alt={`Cover image for ${series.name}`}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{series.name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-3">{description}</p>
        </div>
      </div>
    </Link>
  );
}