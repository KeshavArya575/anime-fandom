// app/page.tsx
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import FeaturedCard from '@/components/FeatureCard'; // ✅ FIX: Corrected component name from 'FeatureCard'
import { UserGroupIcon, FilmIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  // Mock data for the UI with corrected AniList IDs
  const featuredCharacter = {
    category: 'Featured Character',
    title: 'Artoria Pendragon',
    description: 'The legendary King of Knights who pulled the sword from the stone. A noble and determined ruler who sacrificed everything for her kingdom and people.',
    stats: [
      { label: 'Class', value: 'Saber' },
      { label: 'Origin', value: 'Arthurian Legend' },
      { label: 'Alignment', value: 'Lawful Good' },
    ],
    href: '/character/497', // ✅ FIX: Corrected AniList ID for Artoria
  };

  const featuredSeries = {
    category: 'Featured Series',
    title: 'Fate/stay night',
    description: 'A Japanese adult visual novel developed by Type-Moon and originally released for Windows on January 30, 2004.',
    stats: [
      { label: 'Format', value: 'Visual Novel & Anime' },
      { label: 'Characters', value: '61+' },
    ],
    href: '/series/356', // ✅ FIX: Corrected AniList ID for the anime
  };

  // ✅ FIX: Updated data structure to include IDs for dynamic links
  const trendingCharacters = [
    { id: 176754, name: 'Frieren' },
    { id: 2514, name: 'Gilgamesh' },
    { id: 80, name: 'Light Yagami' },
    { id: 40882, name: 'Eren Yeager' },
  ];

  const popularSeries = [
    { id: 10087, name: 'Fate/Zero' },
    { id: 1535, name: 'Death Note' },
    { id: 16498, name: 'Attack on Titan' },
    { id: 356, name: 'Fate/stay night' },
  ];

  return (
    <div className="space-y-16">
      {/* === HERO SECTION === */}
      <section className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to AnimeFandom
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
          Your ultimate companion for anime, manga, and gaming fandoms. Built by fans, for fans.
        </p>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard icon={<UserGroupIcon className="h-6 w-6 text-gray-500" />} label="Characters" value="100+" />
          <StatCard icon={<FilmIcon className="h-6 w-6 text-gray-500" />} label="Series" value="-" />
          <StatCard icon={<PencilIcon className="h-6 w-6 text-gray-500" />} label="Users" value="-" />
        </div>
      </section>

      {/* === FEATURED CONTENT SECTION === */}
      <section>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FeaturedCard {...featuredCharacter} />
          <FeaturedCard {...featuredSeries} />
        </div>
      </section>

      {/* === QUICK ACCESS LISTS === */}
      <section className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Trending Characters</h3>
          <ul className="mt-4 space-y-2">
            {/* ✅ FIX: Mapping over objects and creating dynamic links */}
            {trendingCharacters.map(char => (
              <li key={char.id}>
                <Link href={`/character/${char.id}`} className="block rounded-md p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800">
                  {char.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Popular Series</h3>
          <ul className="mt-4 space-y-2">
            {/* ✅ FIX: Mapping over objects and creating dynamic links */}
            {popularSeries.map(series => (
              <li key={series.id}>
                <Link href={`/series/${series.id}`} className="block rounded-md p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800">
                  {series.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}