// components/SeriesCard.tsx
import Image from 'next/image';
import Link from 'next/link';

type SeriesCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
};

export default function SeriesCard({ title, description, imageUrl, href }: SeriesCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="flex items-center gap-x-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 ease-in-out group-hover:shadow-lg">
        {/* Image container */}
        <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={imageUrl}
            alt={`Image for ${title}`}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        {/* Content area */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-3">{description}</p>
        </div>
      </div>
    </Link>
  );
}