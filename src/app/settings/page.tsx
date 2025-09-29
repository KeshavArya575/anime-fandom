// app/settings/page.tsx
import { redirect } from 'next/navigation';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { revalidatePath } from 'next/cache';

export default async function SettingsPage() {
  const cookieStore = await cookies(); // ✅ Added 'await'
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

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', session.user.id)
    .single();

  async function updateUsername(formData: FormData) {
    'use server';
    const newUsername = formData.get('username') as string;
    const cookieStore = await cookies(); // ✅ Added 'await'
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
          set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }); },
          remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }); },
        },
      }
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('profiles').update({ username: newUsername }).eq('id', user.id);
    
    revalidatePath('/settings');
    revalidatePath('/');
  }

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your account settings and profile information.
        </p>
      </section>

      <section className="max-w-xl">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <form action={updateUsername}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={session.user.email!} disabled className="mt-2" />
                <p className="mt-2 text-xs text-muted-foreground">You cannot change your email address.</p>
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" defaultValue={profile?.username || ''} className="mt-2" />
              </div>
            </div>
            <div className="mt-6 border-t pt-6 text-right">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}