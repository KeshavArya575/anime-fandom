// components/CharacterCard.tsx
import Image from 'next/image';
import Link from 'next/link';

type CharacterCardProps = {
  name: string;
  series: string;
  imageUrl: string;
  href: string;
};

export default function CharacterCard({ name, series, imageUrl, href }: CharacterCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out group-hover:shadow-lg">
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={imageUrl}
            alt={`Image of ${name}`}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">{series}</p>
        </div>
      </div>
    </Link>
  );
}