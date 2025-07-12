import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from './src/lib/supabase/middleware'
export async function middleware(request: NextRequest) {
  // 🔥 CRITICAL: Unconditional middleware execution log
  console.log('🔥🔥🔥 MIDDLEWARE IS EXECUTING FOR:', request.nextUrl.pathname, '🔥🔥🔥')
  
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substr(2, 9)
  
  console.log(`[MIDDLEWARE-${requestId}] ==================== START ====================`)
  console.log(`[MIDDLEWARE-${requestId}] Request Details:`, {
    pathname: request.nextUrl.pathname,
    method: request.method,
    userAgent: request.headers.get('user-agent')?.substring(0, 100) + '...',
    timestamp: new Date().toISOString()
  })
  
  // Log ALL cookies for debugging
  const allCookies = request.cookies.getAll()
  console.log(`[MIDDLEWARE-${requestId}] All Cookies (${allCookies.length}):`, 
    allCookies.map(c => ({ name: c.name, hasValue: !!c.value, valueLength: c.value?.length || 0 }))
  )
  
  // Log specific Supabase cookies
  const supabaseCookies = allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-'))
  console.log(`[MIDDLEWARE-${requestId}] Supabase Cookies (${supabaseCookies.length}):`, supabaseCookies)
  
  try {
    const response = await updateSession(request)
    const duration = Date.now() - startTime
    console.log(`[MIDDLEWARE-${requestId}] UpdateSession completed in ${duration}ms for: ${request.nextUrl.pathname}`)
    console.log(`[MIDDLEWARE-${requestId}] ==================== END (SUCCESS) ====================`)
    return response
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[MIDDLEWARE-${requestId}] UpdateSession failed after ${duration}ms for ${request.nextUrl.pathname}:`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // If it's a headers-related error, return a clean response
    if (error instanceof Error && error.message.includes('headers.split')) {
      console.log(`[MIDDLEWARE-${requestId}] Headers error detected, returning clean response`)
      console.log(`[MIDDLEWARE-${requestId}] ==================== END (HEADERS ERROR) ====================`)
      return NextResponse.next()
    }
    
    console.log(`[MIDDLEWARE-${requestId}] ==================== END (ERROR) ====================`)
    throw error
  }
}
export const config = {
  matcher: [
    // 🔥 CRITICAL: Simplified matcher focusing on admin routes
    '/admin/:path*',
    '/auth/:path*'
  ],
}