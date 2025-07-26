'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Loading } from '@/components/ui'

// Lazy load the EnrollmentsManagement component
const EnrollmentsManagement = dynamic(() => import('./EnrollmentsManagement').then(mod => ({ default: mod.EnrollmentsManagement })), {
  loading: () => (
    <div className="min-h-screen bg-background p-6">
      <div className="animate-pulse space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-10 bg-muted rounded w-32"></div>
        </div>
        
        {/* Search and filters */}
        <div className="flex gap-4">
          <div className="flex-1 h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded w-32"></div>
        </div>
        
        {/* Table header */}
        <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 rounded-t-lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded"></div>
          ))}
        </div>
        
        {/* Table rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b border-border/50">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="h-4 bg-muted rounded"></div>
            ))}
          </div>
        ))}
        
        <div className="text-center py-8">
          <Loading />
          <p className="text-sm text-muted-foreground mt-2">Carregando gerenciamento de matrículas...</p>
        </div>
      </div>
    </div>
  ),
  ssr: false, // Admin components often have complex client-side logic
})

interface EnrollmentWithPopulated {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  completed_at?: string
  access_until?: string
  status: 'active' | 'completed' | 'cancelled' | 'expired'
  progress_percentage: number
  created_at: string
  updated_at: string
  user: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
  }
  course: {
    id: string
    title: string
    thumbnail_url?: string
  }
}

interface EnrollmentsManagementLazyProps {
  enrollments: EnrollmentWithPopulated[]
  currentUser: any
}

const EnrollmentsManagementLazy: React.FC<EnrollmentsManagementLazyProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background p-6">
        <div className="animate-pulse space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
          
          {/* Search and filters */}
          <div className="flex gap-4">
            <div className="flex-1 h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
          
          {/* Table header */}
          <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 rounded-t-lg">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded"></div>
            ))}
          </div>
          
          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b border-border/50">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          ))}
          
          <div className="text-center py-8">
            <Loading />
            <p className="text-sm text-muted-foreground mt-2">Carregando gerenciamento de matrículas...</p>
          </div>
        </div>
      </div>
    }>
      <EnrollmentsManagement {...props} />
    </Suspense>
  )
}

export default EnrollmentsManagementLazy