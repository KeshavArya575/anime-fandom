// components/FollowButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr'; // ✅ New import
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function FollowButton({ seriesId, userId }: { seriesId: number; userId: string | null }) {
  // ✅ Create the client using the new method
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function can remain the same
    async function checkFollowing() {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      const { data } = await supabase
        .from('user_library')
        .select('id')
        .eq('user_id', userId)
        .eq('series_id', seriesId)
        .maybeSingle();

      setIsFollowing(!!data);
      setIsLoading(false);
    }
    checkFollowing();
  }, [userId, seriesId, supabase]);

  const handleFollow = async () => {
    if (!userId) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    if (isFollowing) {
      await supabase.from('user_library').delete().match({ user_id: userId, series_id: seriesId });
      setIsFollowing(false);
      toast.error('Removed from your library.');
    } else {
      await supabase.from('user_library').insert({ user_id: userId, series_id: seriesId });
      setIsFollowing(true);
      toast.success('Added to your library!');
    }
    setIsLoading(false);
  };

  return (
    <Button variant="outline" onClick={handleFollow} disabled={isLoading}>
      {isLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}