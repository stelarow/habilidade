import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getRedirectUrlForCurrentUserServer } from '@/lib/auth/redirect-helpers-server';
import { logDebug, logError } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  
  logDebug('[AUTH_CALLBACK] Processing callback:', { code: !!code, type, origin });

  if (code) {
    try {
      logDebug('[AUTH_CALLBACK] Getting cookie store');
      const cookieStore = cookies();
      
      logDebug('[AUTH_CALLBACK] Creating Supabase client for auth callback');
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              logDebug('[AUTH_CALLBACK] getAll() called');
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              logDebug(`[AUTH_CALLBACK] setAll() called with ${cookiesToSet?.length || 0} cookies`);
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                );
              } catch (error) {
                logError('[AUTH_CALLBACK] Error in setAll:', error);
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
              }
            },
          },
        }
      );
      
      logDebug('[AUTH_CALLBACK] Supabase client created, exchanging code for session');

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        logError('[AUTH_CALLBACK] Error exchanging code for session:', error);
        return NextResponse.redirect(`${origin}/auth/login?error=callback_error`, {
          status: 302,
        });
      }
      
      logDebug('[AUTH_CALLBACK] Session exchange successful');
    } catch (error) {
      logError('[AUTH_CALLBACK] Error in auth callback:', error);
      return NextResponse.redirect(`${origin}/auth/login?error=callback_error`, {
        status: 302,
      });
    }
  }

  // For recovery flow, redirect to update password page
  if (type === 'recovery') {
    logDebug('Recovery flow - redirecting to update-password');
    return NextResponse.redirect(`${origin}/auth/update-password`, {
      status: 302,
    });
  }

  // For email verification, redirect based on user role
  logDebug('[AUTH_CALLBACK] Email verification - determining redirect based on user role');
  
  try {
    const redirectPath = await getRedirectUrlForCurrentUserServer();
    logDebug(`[AUTH_CALLBACK] 🎯 Redirecting to: ${redirectPath}`);
    
    return NextResponse.redirect(`${origin}${redirectPath}`, {
      status: 302,
    });
  } catch (error) {
    logError('[AUTH_CALLBACK] Error determining redirect URL:', error);
    // Fallback to dashboard
    logDebug('[AUTH_CALLBACK] Falling back to dashboard redirect');
    return NextResponse.redirect(`${origin}/dashboard`, {
      status: 302,
    });
  }
} 