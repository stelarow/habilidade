import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminAuthWrapper } from '@/components/admin/AdminAuthWrapper'
import { headers } from 'next/headers'

// Force dynamic rendering for all admin pages to prevent SSR/static generation conflicts
export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const layoutId = Math.random().toString(36).substr(2, 9)
  console.log(`[ADMIN_LAYOUT-${layoutId}] ========== ADMIN LAYOUT RENDERING ==========`)
  
  // Check headers set by middleware
  const headersList = headers()
  const userHeaders = {
    'x-user-id': headersList.get('x-user-id'),
    'x-user-role': headersList.get('x-user-role'), 
    'x-user-email': headersList.get('x-user-email'),
    'x-user-name': headersList.get('x-user-name')
  }
  
  console.log(`[ADMIN_LAYOUT-${layoutId}] Headers from middleware:`, userHeaders)
  console.log(`[ADMIN_LAYOUT-${layoutId}] Header validation:`, {
    hasUserId: !!userHeaders['x-user-id'],
    hasUserRole: !!userHeaders['x-user-role'],
    userRole: userHeaders['x-user-role'],
    isAdminRole: userHeaders['x-user-role'] === 'admin',
    hasUserEmail: !!userHeaders['x-user-email']
  })

  console.log(`[ADMIN_LAYOUT-${layoutId}] Rendering AdminAuthWrapper...`)

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