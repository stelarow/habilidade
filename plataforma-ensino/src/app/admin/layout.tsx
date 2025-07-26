import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { requireAdmin } from '@/lib/auth/session'
import { AdminSessionProvider } from '@/components/admin/AdminSessionProvider'
import { AdminErrorBoundary } from '@/components/error/AdminErrorBoundary'

// Force dynamic rendering for all admin pages to prevent SSR/static generation conflicts
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAdmin()

  return (
    <AdminSessionProvider session={session}>
      <AdminErrorBoundary>
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
      </AdminErrorBoundary>
    </AdminSessionProvider>
  )
}