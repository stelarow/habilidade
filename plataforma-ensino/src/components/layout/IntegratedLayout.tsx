'use client'

import React, { useState } from 'react'
import { QueryProvider } from '@/lib/providers/QueryProvider'
import { IntegrationProvider, useSidebarState } from '@/components/providers/IntegrationProvider'
import { SidebarNavigation } from '@/components/ui/sidebar-navigation'
import { EnhancedHeader } from '@/components/ui/enhanced-header'
import { useIntegratedSidebar, useIntegratedHeader } from '@/lib/hooks/useIntegratedComponents'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'

/**
 * Main integrated layout component that orchestrates all UI components with real-time data
 */
interface IntegratedLayoutProps {
  children: React.ReactNode
  courseId: string
  lessonId?: string
  className?: string
}

function IntegratedLayoutContent({ children, courseId, lessonId, className }: IntegratedLayoutProps) {
  const { isCollapsed, setCollapsed, toggle } = useSidebarState()
  
  // Integrated data hooks
  const {
    courseStructure,
    courseProgress,
    isLoading: sidebarLoading,
    error: sidebarError,
    onLessonSelect
  } = useIntegratedSidebar(courseId)

  const {
    breadcrumbs,
    progressData,
    userProfile,
    notifications,
    unreadCount,
    theme
  } = useIntegratedHeader(courseId, lessonId)

  // Handle sidebar lesson selection
  const handleLessonSelect = (lessonId: string) => {
    onLessonSelect(lessonId)
    
    // On mobile, collapse sidebar after selection
    if (window.innerWidth < 768) {
      setCollapsed(true)
    }
  }

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    toggle()
  }

  if (sidebarError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Erro ao carregar o curso
          </h2>
          <p className="text-muted-foreground mb-4">
            Não foi possível carregar os dados do curso. Tente recarregar a página.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex h-screen bg-background", className)}>
      {/* Sidebar Navigation */}
      <ErrorBoundary fallback={() => <div className="w-16 bg-background-overlay border-r" />}>
        <SidebarNavigation
          courseStructure={courseStructure}
          currentLesson={lessonId || ''}
          progress={courseProgress}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleSidebarToggle}
          onLessonSelect={handleLessonSelect}
          className="transition-all duration-300 ease-in-out"
        />
      </ErrorBoundary>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Header */}
        <ErrorBoundary fallback={() => <div className="h-16 bg-background border-b" />}>
          <EnhancedHeader
            breadcrumbs={breadcrumbs}
            globalProgress={progressData?.percentage || 0}
            user={userProfile}
            notifications={unreadCount}
            onSidebarToggle={handleSidebarToggle}
            onProfileClick={() => {
              // Handle profile click
              console.log('Profile clicked')
            }}
            onSettingsClick={() => {
              // Handle settings click
              console.log('Settings clicked')
            }}
            onThemeToggle={() => {
              // Theme change is handled by the IntegrationProvider
              const currentTheme = document.documentElement.className.includes('theme-violet-light') ? 'violet-dark' : 'violet-light'
              document.documentElement.className = `theme-${currentTheme}`
            }}
            isDarkMode={theme === 'violet-dark'}
            className="border-b border-border"
          />
        </ErrorBoundary>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-background">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </div>
  )
}

/**
 * Full integrated layout with all providers
 */
export function IntegratedLayout(props: IntegratedLayoutProps) {
  return (
    <QueryProvider>
      <IntegrationProvider>
        <IntegratedLayoutContent {...props} />
        <Toaster 
          position="top-right"
          theme="dark"
          expand={true}
          richColors={true}
        />
      </IntegrationProvider>
    </QueryProvider>
  )
}

/**
 * Simplified layout for pages that don't need full course integration
 */
interface SimpleLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  className?: string
}

export function SimpleIntegratedLayout({ children, showSidebar = false, className }: SimpleLayoutProps) {
  return (
    <QueryProvider>
      <IntegrationProvider>
        <div className={cn("min-h-screen bg-background", className)}>
          <div className="flex">
            {showSidebar && (
              <div className="w-16 bg-background-overlay border-r">
                {/* Minimal sidebar for non-course pages */}
              </div>
            )}
            
            <div className="flex-1">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </div>
          </div>
        </div>
        
        <Toaster 
          position="top-right"
          theme="dark"
          expand={true}
          richColors={true}
        />
      </IntegrationProvider>
    </QueryProvider>
  )
}

/**
 * Course-specific layout that pre-loads course data
 */
interface CourseLayoutProps {
  children: React.ReactNode
  courseId: string
  lessonId?: string
}

export function CourseLayout({ children, courseId, lessonId }: CourseLayoutProps) {
  return (
    <IntegratedLayout courseId={courseId} lessonId={lessonId}>
      {children}
    </IntegratedLayout>
  )
}

/**
 * Loading skeleton for the integrated layout
 */
export function IntegratedLayoutSkeleton() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Skeleton */}
      <div className="w-80 bg-background-overlay border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="h-8 bg-muted rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-4">
          <div className="h-20 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="h-16 bg-background border-b border-border">
          <div className="flex items-center justify-between h-full px-6">
            <div className="h-6 w-64 bg-muted rounded animate-pulse" />
            <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            <div className="h-12 bg-muted rounded animate-pulse" />
            <div className="h-96 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-muted rounded animate-pulse" />
              <div className="h-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntegratedLayout