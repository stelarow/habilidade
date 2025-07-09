'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import { LogoH } from '@/components/ui'
import { 
  User, 
  SignOut, 
  BookOpen, 
  House, 
  Trophy, 
  Gear,
  Bell,
  List,
  X,
  CaretDown
} from 'phosphor-react'

interface PlatformHeaderProps {
  user?: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
  }
  className?: string
}

export default function PlatformHeader({ user, className = '' }: PlatformHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [notifications, setNotifications] = useState(0)
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: House
    },
    {
      name: 'Cursos',
      href: '/courses',
      icon: BookOpen
    },
    {
      name: 'Conquistas',
      href: '/achievements',
      icon: Trophy
    }
  ]

  const userMenuItems = [
    {
      name: 'Perfil',
      href: '/profile',
      icon: User
    },
    {
      name: 'Configurações',
      href: '/settings',
      icon: Gear
    },
    {
      name: 'Sair',
      onClick: handleSignOut,
      icon: SignOut,
      danger: true
    }
  ]

  return (
    <header className={`bg-black/50 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <LogoH className="h-8" />
            <span className="font-bold text-xl gradient-text bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Habilidade
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary/50 to-secondary/50 rounded-full flex items-center justify-center">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                        priority
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  
                  <CaretDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-gray-800 rounded-lg shadow-lg py-2">
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="text-sm font-medium text-white">{user.full_name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    
                    {userMenuItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={item.onClick || (() => router.push(item.href!))}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 transition-colors ${
                          item.danger ? 'text-red-400 hover:text-red-300' : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg text-white transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <List className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-800 py-4" ref={mobileMenuRef}>
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            
            {user && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-medium text-white">{user.full_name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                
                {userMenuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setShowMobileMenu(false)
                      if (item.onClick) {
                        item.onClick()
                      } else {
                        router.push(item.href!)
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-white/5 transition-colors rounded-lg ${
                      item.danger ? 'text-red-400 hover:text-red-300' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}