/**
 * Admin Cache Management Interface
 * Task 5 - FEATURE_004_CACHE_API
 * Interface administrativa para monitorar e gerenciar o sistema de cache
 */

import React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

// Components
import CacheManagementPanel from '@/components/admin/blog/CacheManagementPanel'

// Utils
import { createServerComponentClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Gestão de Cache - Admin | Escola Habilidade',
  description: 'Interface administrativa para monitoramento e gestão do sistema de cache do blog',
}

export default async function CachePage() {
  // Create Supabase client
  const supabase = createServerComponentClient({ cookies })

  // Check authentication
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    redirect('/auth/login?redirect=/admin/blog/cache')
  }

  // Check admin role
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profileError || !profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Cache</h1>
        <p className="text-muted-foreground">
          Monitore e gerencie o sistema de cache do blog para otimizar performance
        </p>
      </div>

      {/* Cache Management Panel */}
      <CacheManagementPanel />
    </div>
  )
}