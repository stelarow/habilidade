import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { AdminSettings } from '@/components/admin/AdminSettings'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const { user: _currentUser, profile } = await requireAdmin()

  const supabase = createClient()

  // Get system settings
  const { data: settings, error } = await supabase
    .from('system_settings')
    .select('*')
    .order('key')

  if (error) {
    console.error('Error fetching settings:', error)
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Erro ao carregar configurações</p>
      </div>
    )
  }

  return <AdminSettings settings={settings || []} currentUser={profile} />
}