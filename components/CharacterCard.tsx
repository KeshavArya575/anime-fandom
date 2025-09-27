import Image from "next/image";
import Link from "next/link";

type CharacterCardProps = {
  name: string;
  series: string;
  imageUrl?: string; // Optional so we handle missing images
  href: string;
};

export default function CharacterCard({
  name,
  series,
  imageUrl,
  href,
}: CharacterCardProps) {
  // Ensure imageUrl is valid
  const validImageUrl =
    imageUrl && imageUrl.length > 0
      ? imageUrl.startsWith("/")
        ? imageUrl
        : `/${imageUrl}`
      : "/default-card.jpg"; // fallback image in public/

  return (
    <Link href={href} className="group block">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out group-hover:shadow-lg">
        {/* The parent div is 'relative' and has a defined aspect ratio */}
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={validImageUrl}
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
