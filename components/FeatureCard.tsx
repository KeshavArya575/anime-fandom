// components/FeaturedCard.tsx
import Link from 'next/link';

type Stat = {
  label: string;
  value: string;
};

type FeaturedCardProps = {
  category: string;
  title: string;
  description: string;
  stats: Stat[];
  href: string;
};

export default function FeaturedCard({ category, title, description, stats, href }: FeaturedCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-indigo-600">{category}</p>
      <h3 className="mt-2 text-2xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600 line-clamp-3">{description}</p>
      <div className="mt-4 border-t border-gray-200 pt-4">
        <dl className="space-y-2">
          {stats.map((stat) => (
            <div key={stat.label} className="flex justify-between text-sm">
              <dt className="text-gray-500">{stat.label}</dt>
              <dd className="font-medium text-gray-800">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-4">
        <Link href={href} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
          Learn more &rarr;
        </Link>
      </div>
    </div>
  );
}