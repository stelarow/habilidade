import { type NextRequest } from 'next/server'
import { updateSession } from './src/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // SINGLE point of authentication - updateSession handles ALL auth logic
  // This eliminates multiple Supabase client instances and prevents 
  // the "t.headers.split is not a function" error
  
  console.log(`[MIDDLEWARE] Processing request: ${request.nextUrl.pathname}`)
  
  try {
    // updateSession now handles:
    // - User authentication
    // - Admin role checking  
    // - Protected route redirects
    // - Auth route redirects
    // - All redirects and session management
    const response = await updateSession(request)
    console.log(`[MIDDLEWARE] UpdateSession completed for: ${request.nextUrl.pathname}`)
    return response
  } catch (error) {
    console.error(`[MIDDLEWARE] UpdateSession failed for ${request.nextUrl.pathname}:`, error)
    throw error
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}