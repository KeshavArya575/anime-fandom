// components/FollowButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function FollowButton({ seriesId, userId }: { seriesId: number; userId: string | null }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkFollowing() {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('user_library')
        .select()
        .eq('user_id', userId)
        .eq('series_id', seriesId)
        .maybeSingle();

      setIsFollowing(!!data);
      setIsLoading(false);
    }
    checkFollowing();
  }, [userId, seriesId]);

  const handleFollow = async () => {
    if (!userId) return router.push('/login');

    if (isFollowing) {
      await supabase.from('user_library').delete().match({ user_id: userId, series_id: seriesId });
      setIsFollowing(false);
    } else {
      await supabase.from('user_library').insert({ user_id: userId, series_id: seriesId });
      setIsFollowing(true);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}