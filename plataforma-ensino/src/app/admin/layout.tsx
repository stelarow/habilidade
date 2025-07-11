import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

// Force dynamic rendering for all admin pages to prevent SSR/static generation conflicts
export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Authentication is handled by middleware
  // No need for authentication checks here since middleware already:
  // 1. Verifies user is authenticated
  // 2. Checks admin role
  // 3. Redirects appropriately
  
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