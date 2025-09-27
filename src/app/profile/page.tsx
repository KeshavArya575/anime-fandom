// app/profile/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SeriesCard from '@/components/SeriesCard';

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });

  // 1. Get the user's session
  const { data: { session } } = await supabase.auth.getSession();

  // 2. If no user is logged in, redirect to the login page
  if (!session) {
    redirect('/login');
  }

  // 3. Fetch the user's profile and followed series from the database
  const [profileResponse, libraryResponse] = await Promise.all([
    supabase.from('profiles').select('username').eq('id', session.user.id).single(),
    supabase.from('user_library').select('series(*)').eq('user_id', session.user.id)
  ]);
  
  const { data: profile } = profileResponse;
  const { data: libraryItems } = libraryResponse;
  
  // Extract just the series data from the library items
  const followedSeries = libraryItems?.map(item => item.series) || [];

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Welcome, {profile?.username || 'User'}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          This is your personal library. Here are the series you're currently following.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900">Your Followed Series</h2>
        {followedSeries.length > 0 ? (
          <div className="mt-6 space-y-4">
            {followedSeries.map((series: any) => (
              <SeriesCard
                key={series.id}
                title={series.name}
                description={series.description}
                imageUrl={series.image_url || '/fsn-series.jpg'}
                href={`/series/${series.anilist_id}`}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">You haven't followed any series yet.</p>
        )}
      </section>
    </div>
  );
}