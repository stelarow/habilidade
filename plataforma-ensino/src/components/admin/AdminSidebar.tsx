'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  UserGroupIcon, 
  BookOpenIcon, 
  ChartBarIcon,
  CogIcon,
  AcademicCapIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  DocumentDuplicateIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Usuários', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Cursos', href: '/admin/courses', icon: BookOpenIcon },
  { name: 'Categorias', href: '/admin/categories', icon: TagIcon },
  { name: 'Matrículas', href: '/admin/enrollments', icon: AcademicCapIcon },
  { name: 'Avaliações', href: '/admin/reviews', icon: ChatBubbleLeftRightIcon },
  { name: 'Certificados', href: '/admin/certificates', icon: DocumentDuplicateIcon },
  { name: 'Relatórios', href: '/admin/reports', icon: ChartBarIcon },
  { name: 'Configurações', href: '/admin/settings', icon: CogIcon },
]

export function AdminSidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href
    
    return (
      <Link
        href={item.href}
        className={`
          group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
          ${isActive 
            ? 'bg-purple-600 text-white' 
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }
        `}
      >
        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
        {item.name}
        {item.badge && (
          <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          type="button"
          className="fixed top-4 left-4 z-50 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-700 px-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-white">
                Admin
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>

          {/* User info */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                <UserGroupIcon className="h-4 w-4 text-gray-300" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-gray-400">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}