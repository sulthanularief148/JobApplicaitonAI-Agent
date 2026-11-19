// Auth callback route — Supabase redirects here after magic link click.
// It exchanges the temporary code for a real user session, then sends
// the user to the dashboard.

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, send them back to login
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
