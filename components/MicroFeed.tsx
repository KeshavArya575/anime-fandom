// components/MicroFeed.tsx
import { RssIcon } from '@heroicons/react/24/solid';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// A simple helper function to format time
function timeAgo(date: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}

export default async function MicroFeed() {
  const cookieStore = await cookies(); // ✅ We 'await' the cookies here

  // ✅ We create the client directly inside the async component
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Fetch the 5 most recent activity logs
  const { data: activities } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900">Recent Activity</h3>
      <ul className="mt-4 space-y-4">
        {(activities || []).map((item) => (
          <li key={item.id} className="flex items-start gap-x-3">
            <div className="flex-shrink-0 pt-1">
              <RssIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-700">{item.description}</p>
              <p className="text-xs text-gray-500">{timeAgo(item.created_at)}</p>
            </div>
          </li>
        ))}
        {(!activities || activities.length === 0) && (
            <p className="text-sm text-gray-500">No recent activity.</p>
        )}
      </ul>
    </div>
  );
}