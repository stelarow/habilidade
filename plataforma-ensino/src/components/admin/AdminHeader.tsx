'use client'

import { Fragment, useState, useEffect, useRef } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { BellIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { createClient } from '../../../lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  type: 'user' | 'course' | 'category'
  title: string
  subtitle?: string
  url: string
}

export function AdminHeader() {
  const supabase = createClient()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results: SearchResult[] = []

      // Search users
      const { data: users } = await supabase
        .from('users')
        .select('id, full_name, email, role')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(5)

      users?.forEach(user => {
        results.push({
          id: user.id,
          type: 'user',
          title: user.full_name,
          subtitle: user.email,
          url: `/admin/users`
        })
      })

      // Search courses
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title, short_description, slug')
        .or(`title.ilike.%${query}%,short_description.ilike.%${query}%`)
        .limit(5)

      courses?.forEach(course => {
        results.push({
          id: course.id,
          type: 'course',
          title: course.title,
          subtitle: course.short_description,
          url: `/admin/courses`
        })
      })

      // Search categories
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name, description')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5)

      categories?.forEach(category => {
        results.push({
          id: category.id,
          type: 'category',
          title: category.name,
          subtitle: category.description,
          url: `/admin/categories`
        })
      })

      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      performSearch(searchTerm)
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setShowResults(true)
  }

  const handleSearchResultClick = (result: SearchResult) => {
    router.push(result.url)
    setShowResults(false)
    setSearchTerm('')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return '👤'
      case 'course':
        return '📚'
      case 'category':
        return '📁'
      default:
        return '📄'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'user':
        return 'Usuário'
      case 'course':
        return 'Curso'
      case 'category':
        return 'Categoria'
      default:
        return 'Item'
    }
  }

  return (
    <header className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-start">
          <div className="w-full max-w-lg lg:max-w-xs relative" ref={searchRef}>
            <label htmlFor="search" className="sr-only">
              Pesquisar
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowResults(true)}
                className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-gray-600 focus:text-white focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Pesquisar usuários, cursos, categorias..."
                type="search"
              />
            </div>

            {/* Search Results Dropdown */}
            {showResults && (searchTerm.trim() || searchResults.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-400">
                    <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    Pesquisando...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{getTypeIcon(result.type)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-white truncate">
                                {result.title}
                              </p>
                              <span className="text-xs text-gray-400 ml-2">
                                {getTypeLabel(result.type)}
                              </span>
                            </div>
                            {result.subtitle && (
                              <p className="text-xs text-gray-400 truncate">
                                {result.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchTerm.trim() && (
                  <div className="p-4 text-center text-gray-400">
                    <p>Nenhum resultado encontrado</p>
                    <p className="text-xs mt-1">Tente usar termos diferentes</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            type="button"
            className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span className="sr-only">Ver notificações</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-400"></span>
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="sr-only">Abrir menu do usuário</span>
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/admin/profile"
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700`}
                    >
                      Seu perfil
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/admin/settings"
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700`}
                    >
                      Configurações
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleSignOut}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                    >
                      Sair
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  )
}