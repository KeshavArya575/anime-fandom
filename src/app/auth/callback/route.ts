// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // ✅ --- THE FINAL, HARDCODED FIX --- ✅
  // We are now ignoring all other parameters and forcing the redirect
  // to the user's profile page every single time.
  const redirectUrl = new URL('/profile', requestUrl.origin);
  return NextResponse.redirect(redirectUrl);
  // --- END OF FIX ---
}