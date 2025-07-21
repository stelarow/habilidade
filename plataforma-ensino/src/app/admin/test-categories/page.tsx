import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export default async function TestCategoriesPage() {
  const { user: currentUser, profile } = await requireAdmin()
  console.log(`[TEST-CATEGORIES] Access authorized for admin: ${profile.email}`)

  const supabase = createClient()

  // Test 1: Get current user from auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  // Test 2: List categories
  const { data: categories, error: listError } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Test 3: Try to update a category (if any exist)
  let updateTest = null
  if (categories && categories.length > 0) {
    const testCategory = categories[0]
    const { data: updateData, error: updateError } = await supabase
      .from('categories')
      .update({ 
        description: `Test update at ${new Date().toISOString()}` 
      })
      .eq('id', testCategory.id)
      .select()

    updateTest = { updateData, updateError }
  }

  // Test 4: Check user role from users table
  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('id', user?.id || '')
    .single()

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold text-white">Categories Test Page</h1>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-medium text-white mb-4">Auth Test</h2>
        <pre className="text-sm text-gray-300 overflow-auto">
          {JSON.stringify({ 
            authenticated: !!user, 
            userId: user?.id,
            email: user?.email,
            authError: authError?.message 
          }, null, 2)}
        </pre>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-medium text-white mb-4">User Profile Test</h2>
        <pre className="text-sm text-gray-300 overflow-auto">
          {JSON.stringify({ 
            userProfile,
            profileError: profileError?.message 
          }, null, 2)}
        </pre>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-medium text-white mb-4">List Categories Test</h2>
        <pre className="text-sm text-gray-300 overflow-auto">
          {JSON.stringify({ 
            count: categories?.length || 0,
            listError: listError?.message,
            categories: categories?.slice(0, 2)
          }, null, 2)}
        </pre>
      </div>

      {updateTest && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-4">Update Test</h2>
          <pre className="text-sm text-gray-300 overflow-auto">
            {JSON.stringify({ 
              success: !!updateTest.updateData,
              error: updateTest.updateError?.message,
              errorCode: updateTest.updateError?.code,
              errorDetails: updateTest.updateError?.details,
              data: updateTest.updateData
            }, null, 2)}
          </pre>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-medium text-white mb-4">Environment Check</h2>
        <pre className="text-sm text-gray-300 overflow-auto">
          {JSON.stringify({ 
            hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            nodeEnv: process.env.NODE_ENV
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}