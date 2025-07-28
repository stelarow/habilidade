/**
 * 🔍 ADMIN ROLE DEBUGGING PAGE
 * 
 * This diagnostic page helps debug role synchronization issues.
 * Only accessible to admin users.
 */

import { verifySessionWithRole } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function AdminDebugPage() {
  // Require admin access
  const { user, profile } = await verifySessionWithRole('admin')

  // Get Supabase client
  const supabase = createClient()

  // Get fresh data from both tables
  const { data: publicUser } = await supabase
    .from('users')
    .select('id, email, full_name, role, updated_at')
    .eq('id', user.id)
    .single()

  const { data: authUser } = await supabase.auth.getUser()

  // Get cookie information
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()
  const authCookies = allCookies.filter((cookie: any) => 
    cookie.name.includes('supabase') || cookie.name.includes('sb-')
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-purple-400 mb-4">🔍 Admin Role Debug Information</h1>
          <p className="text-gray-300">Current time: {new Date().toISOString()}</p>
        </div>

        {/* Session Information */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-blue-400 mb-4">📋 Session Information</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>User ID: <span className="text-green-400">{user.id}</span></div>
            <div>Email: <span className="text-green-400">{user.email}</span></div>
            <div>Session Role: <span className="text-green-400">{profile.role}</span></div>
            <div>Session Updated: <span className="text-green-400">{profile.updated_at}</span></div>
          </div>
        </div>

        {/* Public Users Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">🗃️ Public Users Table</h2>
          {publicUser ? (
            <div className="space-y-2 font-mono text-sm">
              <div>ID: <span className="text-green-400">{publicUser.id}</span></div>
              <div>Email: <span className="text-green-400">{publicUser.email}</span></div>
              <div>Full Name: <span className="text-green-400">{publicUser.full_name}</span></div>
              <div>Role: <span className="text-green-400">{publicUser.role}</span></div>
              <div>Updated At: <span className="text-green-400">{publicUser.updated_at}</span></div>
            </div>
          ) : (
            <div className="text-red-400">❌ No user found in public.users table</div>
          )}
        </div>

        {/* Auth Users Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">🔐 Auth Users Metadata</h2>
          {authUser.user ? (
            <div className="space-y-2">
              <div className="font-mono text-sm">
                <div>ID: <span className="text-green-400">{authUser.user.id}</span></div>
                <div>Email: <span className="text-green-400">{authUser.user.email}</span></div>
                <div>Created At: <span className="text-green-400">{authUser.user.created_at}</span></div>
                <div>Updated At: <span className="text-green-400">{authUser.user.updated_at}</span></div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-bold text-yellow-300 mb-2">Raw User Metadata:</h3>
                <pre className="bg-gray-900 p-4 rounded text-xs overflow-x-auto">
                  {JSON.stringify(authUser.user.user_metadata, null, 2)}
                </pre>
              </div>
              
              <div className="mt-4">
                <h3 className="font-bold text-yellow-300 mb-2">App Metadata:</h3>
                <pre className="bg-gray-900 p-4 rounded text-xs overflow-x-auto">
                  {JSON.stringify(authUser.user.app_metadata, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-red-400">❌ No user found in auth.users</div>
          )}
        </div>

        {/* Cookie Information */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-purple-400 mb-4">🍪 Cookie Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-purple-300 mb-2">Auth Cookies ({authCookies.length}):</h3>
              {authCookies.length > 0 ? (
                <div className="space-y-2">
                  {authCookies.map((cookie, index) => (
                    <div key={index} className="bg-gray-900 p-3 rounded">
                      <div className="font-mono text-xs">
                        <div><span className="text-blue-300">Name:</span> {cookie.name}</div>
                        <div><span className="text-blue-300">Value Length:</span> {cookie.value.length} chars</div>
                        <div><span className="text-blue-300">Preview:</span> {cookie.value.substring(0, 100)}...</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-red-400">❌ No auth cookies found</div>
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-purple-300 mb-2">All Cookies ({allCookies.length}):</h3>
              <div className="font-mono text-xs space-y-1">
                {allCookies.map((cookie, index) => (
                  <div key={index}>
                    <span className="text-gray-400">{index + 1}.</span> {cookie.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">💡 Recommendations</h2>
          <div className="space-y-2 text-gray-300">
            <p>• If the role in public.users differs from session role, log out and log back in</p>
            <p>• Check if auth cookies are present and recent</p>
            <p>• Verify that the database trigger is working correctly</p>
            <p>• Clear all browser cookies if issues persist</p>
          </div>
        </div>
      </div>
    </div>
  )
}