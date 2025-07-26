'use client'

import { useState } from 'react'
import { User } from '@/types'
import { UserProfile } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/client'
import { 
  CogIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BellIcon,
  EnvelopeIcon,
  PhotoIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface Setting {
  id: string
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'json'
  description: string
  category: string
  is_public: boolean
  updated_at: string
}

interface AdminSettingsProps {
  settings: Setting[]
  currentUser: User | UserProfile | null
}

export function AdminSettings({ settings: initialSettings, currentUser }: AdminSettingsProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(false)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const supabase = createClient()

  const categories = [
    { key: 'general', label: 'Geral', icon: CogIcon },
    { key: 'site', label: 'Site', icon: GlobeAltIcon },
    { key: 'security', label: 'Segurança', icon: ShieldCheckIcon },
    { key: 'notifications', label: 'Notificações', icon: BellIcon },
    { key: 'email', label: 'Email', icon: EnvelopeIcon },
    { key: 'media', label: 'Mídia', icon: PhotoIcon },
    { key: 'content', label: 'Conteúdo', icon: DocumentTextIcon }
  ]

  const groupedSettings = categories.reduce((acc, category) => {
    acc[category.key] = settings.filter(setting => setting.category === category.key)
    return acc
  }, {} as Record<string, Setting[]>)

  const handleSave = async (settingId: string, newValue: string) => {
    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          value: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', settingId)

      if (error) throw error

      setSettings(settings.map(setting => 
        setting.id === settingId 
          ? { ...setting, value: newValue, updated_at: new Date().toISOString() }
          : setting
      ))
      
      setEditingKey(null)
      setEditValue('')
    } catch (error) {
      logError('Error updating setting:', error)
      alert('Erro ao salvar configuração')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (setting: Setting) => {
    setEditingKey(setting.key)
    setEditValue(setting.value)
  }

  const handleCancel = () => {
    setEditingKey(null)
    setEditValue('')
  }

  const renderValue = (setting: Setting) => {
    if (editingKey === setting.key) {
      switch (setting.type) {
        case 'boolean':
          return (
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          )
        case 'number':
          return (
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          )
        case 'json':
          return (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          )
        default:
          return (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          )
      }
    }

    // Display value
    switch (setting.type) {
      case 'boolean':
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${
            setting.value === 'true' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {setting.value === 'true' ? 'Sim' : 'Não'}
          </span>
        )
      case 'json':
        return (
          <pre className="text-xs text-gray-300 bg-gray-700 p-2 rounded overflow-x-auto">
            {JSON.stringify(JSON.parse(setting.value || '{}'), null, 2)}
          </pre>
        )
      default:
        return <span className="text-gray-300">{setting.value}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações do Sistema</h1>
        <p className="text-gray-400">Gerencie as configurações da plataforma</p>
      </div>

      {/* Settings by Category */}
      <div className="space-y-6">
        {categories.map(category => {
          const categorySettings = groupedSettings[category.key]
          if (!categorySettings || categorySettings.length === 0) return null

          return (
            <div key={category.key} className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <category.icon className="h-6 w-6 text-purple-400" />
                  <h2 className="text-xl font-semibold text-white">{category.label}</h2>
                </div>

                <div className="space-y-4">
                  {categorySettings.map(setting => (
                    <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-white font-medium">{setting.key}</h3>
                          {setting.is_public && (
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                              Público
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{setting.description}</p>
                        <div className="flex items-center space-x-4">
                          {renderValue(setting)}
                          {editingKey === setting.key ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSave(setting.id, editValue)}
                                disabled={loading}
                                className="text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
                              >
                                <CheckIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEdit(setting)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              Editar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* System Info */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Informações do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Versão da Plataforma</p>
            <p className="text-white font-medium">1.0.0</p>
          </div>
          <div>
            <p className="text-gray-400">Última Atualização</p>
            <p className="text-white font-medium">
              {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Total de Configurações</p>
            <p className="text-white font-medium">{settings.length}</p>
          </div>
          <div>
            <p className="text-gray-400">Configurações Públicas</p>
            <p className="text-white font-medium">
              {settings.filter(s => s.is_public).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}