import { requireAdmin } from '@/lib/auth/session'

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic'

export default async function DemoComponentsPage() {
  await requireAdmin()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Blog Demo Components</h1>
      <p className="text-muted-foreground mt-2">
        Demo components page temporarily disabled due to encoding issues.
      </p>
    </div>
  )
}
