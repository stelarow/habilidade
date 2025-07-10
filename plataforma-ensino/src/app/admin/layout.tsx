import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('[ADMIN_LAYOUT] Starting admin layout')
  
  try {
    console.log('[ADMIN_LAYOUT] Creating Supabase client')
    const supabase = createClient()
    
    console.log('[ADMIN_LAYOUT] Getting user')
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('[ADMIN_LAYOUT] No user found, redirecting to login')
      redirect('/auth/login')
    }

    console.log(`[ADMIN_LAYOUT] User found: ${user.id}, checking admin role`)
    // Check if user has admin role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    console.log('[ADMIN_LAYOUT] Profile retrieved:', profile)
    if (!profile || profile.role !== 'admin') {
      console.log('[ADMIN_LAYOUT] User is not admin, redirecting to dashboard')
      redirect('/dashboard')
    }
    
    console.log('[ADMIN_LAYOUT] Admin access granted, rendering layout')
  } catch (error) {
    console.error('[ADMIN_LAYOUT] Error in admin layout:', error)
    throw error
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}