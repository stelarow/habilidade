import { createClient } from '../../../../lib/supabase/server'
import { getCurrentUser, requirePermission } from '@/lib/auth/permissions'
import { AdminSettings } from '@/components/admin/AdminSettings'

export default async function SettingsPage() {
  const supabase = createClient()
  const currentUser = await getCurrentUser()
  
  requirePermission(currentUser, 'admin.settings.manage')

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

  return <AdminSettings settings={settings || []} currentUser={currentUser} />
}