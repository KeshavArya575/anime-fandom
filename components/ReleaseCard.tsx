// components/ReleaseCard.tsx
import Image from 'next/image';

type ReleaseCardProps = {
  title: string;
  type: 'Game Event' | 'Anime' | 'Physical Release' | string;
  date: string;
  imageUrl: string;
  spoilerLevel: 'Major' | 'Minor' | 'Spoiler-Free' | string;
};

export default function ReleaseCard({ title, type, date, imageUrl, spoilerLevel }: ReleaseCardProps) {
  const spoilerColors = {
    'Major': 'bg-red-100 text-red-700',
    'Minor': 'bg-yellow-100 text-yellow-700',
    'Spoiler-Free': 'bg-green-100 text-green-700',
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="relative h-28 w-full">
        <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500">{type}</p>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className="mt-2 flex items-center justify-between text-xs">
          <p className={spoilerColors[spoilerLevel] + " rounded px-1.5 py-0.5 font-medium"}>
            {spoilerLevel}
          </p>
          <p className="text-gray-500">{date}</p>
        </div>
      </div>
    </div>
  );
}