'use client'

import { createContext, useContext } from 'react'
import type { User } from '@supabase/supabase-js'

interface AdminProfile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'instructor' | 'student'
  created_at: string
  updated_at: string
  last_login?: string
}

interface AdminSession {
  user: User
  profile: AdminProfile
}

interface AdminSessionContextType {
  session: AdminSession
}

const AdminSessionContext = createContext<AdminSessionContextType | null>(null)

export function AdminSessionProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: AdminSession
}) {
  return (
    <AdminSessionContext.Provider value={{ session }}>
      {children}
    </AdminSessionContext.Provider>
  )
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext)
  if (!context) {
    throw new Error('useAdminSession must be used within AdminSessionProvider')
  }
  return context.session
}