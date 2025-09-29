// components/MicroFeed.tsx
import { UserCircleIcon, RssIcon, StarIcon } from '@heroicons/react/24/solid';

// Mock data for the feed. Later, this could come from your database.
const feedItems = [
  {
    icon: <UserCircleIcon className="h-5 w-5 text-gray-400" />,
    text: "Keshav followed Artoria Pendragon.",
    time: "5m ago",
  },
  {
    icon: <RssIcon className="h-5 w-5 text-gray-400" />,
    text: "A new page 'Lancelot' was created.",
    time: "1h ago",
  },
  {
    icon: <StarIcon className="h-5 w-5 text-gray-400" />,
    text: "Fate/Zero was added to the library.",
    time: "3h ago",
  },
];

export default function MicroFeed() {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900">Recent Activity</h3>
      <ul className="mt-4 space-y-4">
        {feedItems.map((item, index) => (
          <li key={index} className="flex items-start gap-x-3">
            <div className="flex-shrink-0">{item.icon}</div>
            <div>
              <p className="text-sm text-gray-700">{item.text}</p>
              <p className="text-xs text-gray-500">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}