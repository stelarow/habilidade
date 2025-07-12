import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminAuthWrapper } from '@/components/admin/AdminAuthWrapper'
import { requireAdmin } from '@/lib/auth/session'

// Force dynamic rendering for all admin pages to prevent SSR/static generation conflicts
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const layoutId = Math.random().toString(36).substr(2, 9)
  console.log(`[ADMIN_LAYOUT-${layoutId}] ========== ADMIN LAYOUT RENDERING ==========`)
  
  // Direct session verification - no dependency on headers
  console.log(`[ADMIN_LAYOUT-${layoutId}] Verifying admin session directly...`)
  const session = await requireAdmin()
  
  console.log(`[ADMIN_LAYOUT-${layoutId}] ✅ Session verified:`, {
    userId: session.user.id,
    userEmail: session.profile.email,
    userRole: session.profile.role,
    userName: session.profile.full_name
  })

  console.log(`[ADMIN_LAYOUT-${layoutId}] Rendering admin interface...`)

  return (
    <AdminAuthWrapper>
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
    </AdminAuthWrapper>
  )
}