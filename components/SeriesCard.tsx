// components/SeriesCard.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function SeriesCard({ series }: { series: any }) {
  // Check for the AniList title format first, then fall back to the Supabase format.
  const title = series.title?.romaji || series.name;
  
  // Safely get the description and provide a fallback.
  const description = series.description?.replace(/<br\s*\/?>/g, ' ') || 'No description available.';

  // ✅ FIX: Changed to series.imageUrl (camelCase) to match the Supabase client's conversion.
  const imageUrl = series.coverImage?.large || series.imageUrl;

  // Use the anilist_id if it exists, otherwise use the regular id.
  const href = `/series/${series.anilist_id || series.id}`;

  return (
    <Link href={href} className="group block">
      <div className="flex items-center gap-x-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 ease-in-out group-hover:shadow-lg">
        <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={imageUrl || '/fsn-series.jpg'} // Use the determined image URL or a final fallback
            alt={`Cover image for ${title}`}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-3">{description}</p>
        </div>
      </div>
    </Link>
  );
}