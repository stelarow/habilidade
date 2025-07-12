'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { GradientButton, Starfield, Loading } from '@/components/ui'
import { 
  User, 
  Envelope, 
  Calendar,
  ArrowLeft,
  Camera,
  FloppyDisk,
  Pencil
} from 'phosphor-react'

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'student' | 'instructor' | 'admin'
  created_at: string
  updated_at: string
  last_login?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: ''
  })
  const supabase = createClient()

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!authUser) {
        router.push('/auth/login')
        return
      }

      // Buscar perfil completo do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }

      // Se não existe perfil, criar um básico
      if (!profileData) {
        const newProfile = {
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
          role: 'student' as const
        }

        const { data: insertedProfile, error: insertError } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single()

        if (insertError) throw insertError
        
        setUser(insertedProfile)
        setFormData({
          full_name: insertedProfile.full_name
        })
      } else {
        setUser(profileData)
        setFormData({
          full_name: profileData.full_name
        })
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }, [router, supabase])

  // Carregar perfil após definir a função
  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Atualizar estado local
      setUser(prev => prev ? {
        ...prev,
        full_name: formData.full_name,
        updated_at: new Date().toISOString()
      } : null)

      setIsEditing(false)
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'student': return 'Estudante'
      case 'instructor': return 'Instrutor'
      case 'admin': return 'Administrador'
      default: return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'text-blue-400 bg-blue-400/20'
      case 'instructor': return 'text-green-400 bg-green-400/20'
      case 'admin': return 'text-purple-400 bg-purple-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Erro ao carregar perfil</h3>
          <p className="text-white/60 mb-4">{error}</p>
          <GradientButton onClick={fetchUserProfile}>
            Tentar novamente
          </GradientButton>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <Starfield count={30} className="opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Meu Perfil
              </h1>
              <p className="text-gray-400 mt-2">
                Gerencie suas informações pessoais
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      full_name: user.full_name
                    })
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <GradientButton onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loading size="sm" text="Salvando..." className="justify-center" />
                  ) : (
                    <>
                      <FloppyDisk className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  )}
                </GradientButton>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
                <span>Editar</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto relative">
                    {user.avatar_url ? (
                      <Image 
                        src={user.avatar_url} 
                        alt={user.full_name}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-primary" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white mb-1">{user.full_name}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                  {getRoleText(user.role)}
                </span>
              </div>

              {/* User Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Envelope className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Membro desde</p>
                    <p className="text-white">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {user.last_login && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Último acesso</p>
                      <p className="text-white">
                        {new Date(user.last_login).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <GradientButton onClick={handleLogout} className="w-full">
                  Sair da Conta
                </GradientButton>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Informações Pessoais
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-white bg-zinc-800/30 px-4 py-3 rounded-md">{user.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <p className="text-gray-400 bg-zinc-800/30 px-4 py-3 rounded-md">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}