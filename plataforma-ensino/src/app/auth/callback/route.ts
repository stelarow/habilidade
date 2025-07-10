import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  
  console.log('Auth callback:', { code: !!code, type, origin });

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(`${origin}/auth/login?error=callback_error`, {
        status: 302,
      });
    }
  }

  // For recovery flow, redirect to update password page
  if (type === 'recovery') {
    console.log('Recovery flow - redirecting to update-password');
    return NextResponse.redirect(`${origin}/auth/update-password`, {
      status: 302,
    });
  }

  // For email verification, redirect to dashboard
  console.log('Email verification - redirecting to dashboard');
  return NextResponse.redirect(`${origin}/dashboard`, {
    status: 302,
  });
} 