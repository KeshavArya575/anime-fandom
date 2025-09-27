// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import UniversalSearch from './UniversalSearch';
import { UserCircleIcon } from '@heroicons/react/24/solid';

function AfLogoIcon() {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-white text-xs font-bold text-black">
      AF
    </div>
  );
}

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    // This listener is the key to a reactive UI
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      // When a user signs in or out, refresh the page to update server components
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        router.refresh();
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener will handle the UI update
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <Link href="/" className="flex items-center gap-x-2">
        <div className="flex items-center justify-center rounded-md bg-gray-900 p-2">
          <AfLogoIcon />
        </div>
        <span className="text-lg font-bold text-gray-900">AnimeFandom</span>
      </Link>
      
      <UniversalSearch />

      <div className="flex items-center gap-x-4">
        {user ? (
          // If user is logged in, show their email and a profile link
          <>
            <span className="text-sm text-gray-600">{user.email}</span>
            <Link href="/profile" className="flex items-center gap-x-2 rounded-full p-1 hover:bg-gray-100">
              <UserCircleIcon className="h-8 w-8 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">Profile</span>
            </Link>
            <button onClick={handleSignOut} className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              Sign Out
            </button>
          </>
        ) : (
          // If user is logged out, show Login button
          <Link href="/login" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}