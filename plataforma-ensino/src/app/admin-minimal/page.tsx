// MINIMAL ADMIN PAGE - ZERO COMPONENTS TO ISOLATE headers.split ERROR
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function MinimalAdminPage() {
  console.log('[MINIMAL-ADMIN] 1. Starting minimal admin page')
  
  const supabase = createClient()
  console.log('[MINIMAL-ADMIN] 2. Supabase client created')

  console.log('[MINIMAL-ADMIN] 3. Making SINGLE simple query...')
  
  try {
    // SIMPLEST POSSIBLE QUERY
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    console.log('[MINIMAL-ADMIN] 4. Query completed successfully')
    console.log('[MINIMAL-ADMIN] 5. Result:', { data: data?.length, error })

    return (
      <div style={{ padding: '20px', background: 'black', color: 'white', minHeight: '100vh' }}>
        <h1>🔬 MINIMAL ADMIN TEST</h1>
        
        {error ? (
          <div style={{ background: 'red', padding: '20px', margin: '20px 0' }}>
            <h2>❌ ERROR FOUND</h2>
            <p>{error.message}</p>
          </div>
        ) : (
          <div style={{ background: 'green', padding: '20px', margin: '20px 0' }}>
            <h2>✅ SUCCESS - NO HEADERS.SPLIT ERROR</h2>
            <p>Basic Supabase query worked. Users found: {data?.length || 0}</p>
          </div>
        )}

        <div style={{ background: 'gray', padding: '20px', margin: '20px 0' }}>
          <h2>🧪 TEST DETAILS</h2>
          <ul>
            <li>✅ No AdminHeader component</li>
            <li>✅ No AdminSidebar component</li>
            <li>✅ No AdminDashboard component</li>
            <li>✅ No external imports except Supabase</li>
            <li>✅ Pure HTML - no UI components</li>
            <li>✅ Single simple query only</li>
          </ul>
        </div>
      </div>
    )

  } catch (err: any) {
    console.error('[MINIMAL-ADMIN] ERROR during execution:', err)
    
    return (
      <div style={{ padding: '20px', background: 'black', color: 'white', minHeight: '100vh' }}>
        <h1>🔬 MINIMAL ADMIN TEST</h1>
        
        <div style={{ background: 'red', padding: '20px', margin: '20px 0' }}>
          <h2>❌ ERROR FOUND IN MINIMAL TEST</h2>
          <p>{err.message}</p>
          <p><strong>This means the problem is in createClient() or Supabase configuration itself!</strong></p>
        </div>
      </div>
    )
  }
}