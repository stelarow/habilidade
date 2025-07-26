// MINIMAL ADMIN PAGE - ZERO COMPONENTS TO ISOLATE headers.split ERROR
import { createClient } from '@/lib/supabase/server'
import { logDebug, logError } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

export default async function MinimalAdminPage() {
  logDebug('Starting minimal admin page', { component: 'MinimalAdminPage' })
  
  const supabase = createClient()
  logDebug('Supabase client created', { component: 'MinimalAdminPage' })

  logDebug('Making SINGLE simple query...', { component: 'MinimalAdminPage' })
  
  try {
    // SIMPLEST POSSIBLE QUERY
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    logDebug('Query completed successfully', { component: 'MinimalAdminPage' })
    logDebug('Query result', { component: 'MinimalAdminPage', dataLength: data?.length, hasError: !!error })

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
    logError('Error during execution', err, { component: 'MinimalAdminPage' })
    
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