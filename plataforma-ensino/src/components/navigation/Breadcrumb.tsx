'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CaretRight, House, ArrowLeft } from 'phosphor-react'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showBackButton?: boolean
  backLabel?: string
  className?: string
}

export default function Breadcrumb({
  items,
  showBackButton = false,
  backLabel = 'Voltar',
  className = ''
}: BreadcrumbProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <nav className={`flex items-center gap-4 ${className}`} aria-label="Breadcrumb">
      {/* Back Button */}
      {showBackButton && (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{backLabel}</span>
        </button>
      )}

      {/* Breadcrumb Items */}
      <ol className="flex items-center gap-2 overflow-x-auto">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2 min-w-0">
            {index > 0 && (
              <CaretRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
            )}
            
            {item.current ? (
              <span 
                className="text-white font-medium truncate"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="text-gray-400 hover:text-white transition-colors truncate"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500 truncate">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Utility function to create common breadcrumb patterns
export const createCourseBreadcrumb = (
  courseTitle: string,
  courseSlug: string,
  lessonTitle?: string
): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      label: 'Meus Cursos',
      href: '/courses'
    },
    {
      label: courseTitle,
      href: `/course/${courseSlug}`,
      current: !lessonTitle
    }
  ]

  if (lessonTitle) {
    items.push({
      label: lessonTitle,
      current: true
    })
  }

  return items
}

export const createDashboardBreadcrumb = (
  pageName: string,
  pageHref?: string
): BreadcrumbItem[] => {
  return [
    {
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      label: pageName,
      href: pageHref,
      current: !pageHref
    }
  ]
}

export const createAdminBreadcrumb = (
  sections: Array<{ label: string; href?: string }>
): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      label: 'Admin',
      href: '/admin'
    }
  ]

  sections.forEach((section, index) => {
    items.push({
      label: section.label,
      href: section.href,
      current: index === sections.length - 1 && !section.href
    })
  })

  return items
}