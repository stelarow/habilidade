'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface BlogAdminLayoutProps {
  children: React.ReactNode
}

// Sidebar navigation items
const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin/blog',
    icon: '📊',
    description: 'Métricas e visão geral'
  },
  {
    title: 'Posts',
    href: '/admin/blog/posts',
    icon: '📝',
    description: 'Gerenciar posts do blog',
    children: [
      { title: 'Todos os Posts', href: '/admin/blog/posts' },
      { title: 'Novo Post', href: '/admin/blog/posts/new' },
      { title: 'Rascunhos', href: '/admin/blog/posts?status=draft' },
      { title: 'Publicados', href: '/admin/blog/posts?status=published' },
      { title: 'Arquivados', href: '/admin/blog/posts?status=archived' }
    ]
  },
  {
    title: 'Categorias',
    href: '/admin/blog/categories',
    icon: '📁',
    description: 'Gerenciar categorias'
  },
  {
    title: 'Alertas',
    href: '/admin/blog/alerts',
    icon: '🔔',
    description: 'Configurar alertas automáticos'
  },
  {
    title: 'Configurações',
    href: '/admin/blog/settings',
    icon: '⚙️',
    description: 'SEO e configurações gerais'
  }
]

function BlogAdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  
  return (
    <div className={`pb-12 ${className}`}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Blog Admin
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <div key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.title}
                    {item.title === 'Posts' && (
                      <Badge variant="secondary" className="ml-auto">
                        12
                      </Badge>
                    )}
                  </Button>
                </Link>
                {item.children && pathname.startsWith('/admin/blog/posts') && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href}>
                        <Button
                          variant={pathname === child.href ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start font-normal"
                        >
                          {child.title}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BlogAdminHeader() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  
  const getPageTitle = () => {
    if (pathname === '/admin/blog') return 'Dashboard do Blog'
    if (pathname.startsWith('/admin/blog/posts/new')) return 'Novo Post'
    if (pathname.startsWith('/admin/blog/posts') && pathname.includes('/edit')) return 'Editar Post'
    if (pathname.startsWith('/admin/blog/posts')) return 'Posts'
    if (pathname.startsWith('/admin/blog/categories')) return 'Categorias'
    if (pathname.startsWith('/admin/blog/alerts')) return 'Alertas'
    if (pathname.startsWith('/admin/blog/settings')) return 'Configurações'
    return 'Blog Admin'
  }

  const getQuickActions = () => {
    const actions = []
    
    if (!pathname.includes('/posts/new')) {
      actions.push(
        <Link key="new-post" href="/admin/blog/posts/new">
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            ✏️ Novo Post
          </Button>
        </Link>
      )
    }
    
    if (pathname.startsWith('/admin/blog/posts') && !pathname.includes('/new')) {
      actions.push(
        <Link key="categories" href="/admin/blog/categories">
          <Button variant="outline" size="sm">
            📁 Categorias
          </Button>
        </Link>
      )
    }
    
    return actions
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <span className="sr-only">Abrir menu</span>
                ☰
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <BlogAdminSidebar />
            </SheetContent>
          </Sheet>
          <div className="hidden md:flex items-center">
            <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
          </div>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="flex items-center space-x-2 md:hidden">
              <h1 className="text-sm font-medium">{getPageTitle()}</h1>
            </div>
            {/* Search bar for posts pages */}
            {pathname.startsWith('/admin/blog/posts') && (
              <div className="hidden md:flex items-center space-x-2 max-w-sm">
                <Input
                  placeholder="Buscar posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8"
                />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {getQuickActions()}
          </div>
        </div>
      </div>
    </header>
  )
}

function BlogBreadcrumbs() {
  const pathname = usePathname()
  
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = [
      { title: 'Admin', href: '/admin' },
      { title: 'Blog', href: '/admin/blog' }
    ]
    
    if (segments.length > 2) {
      if (segments[2] === 'posts') {
        breadcrumbs.push({ title: 'Posts', href: '/admin/blog/posts' })
        
        if (segments[3] === 'new') {
          breadcrumbs.push({ title: 'Novo Post', href: '/admin/blog/posts/new' })
        } else if (segments[3] && segments[4] === 'edit') {
          breadcrumbs.push({ title: 'Editar Post', href: pathname })
        }
      } else if (segments[2] === 'categories') {
        breadcrumbs.push({ title: 'Categorias', href: '/admin/blog/categories' })
      } else if (segments[2] === 'alerts') {
        breadcrumbs.push({ title: 'Alertas', href: '/admin/blog/alerts' })
      } else if (segments[2] === 'settings') {
        breadcrumbs.push({ title: 'Configurações', href: '/admin/blog/settings' })
      }
    }
    
    return breadcrumbs
  }
  
  const breadcrumbs = getBreadcrumbs()
  
  return (
    <div className="border-b bg-muted/40 px-6 py-3">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            
            return (
              <div key={crumb.href} className="flex items-center">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </div>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export default function BlogAdminLayout({ children }: BlogAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <BlogAdminHeader />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex h-[calc(100vh-3.5rem)] w-64 flex-col border-r bg-muted/40">
          <BlogAdminSidebar className="flex-1" />
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          <BlogBreadcrumbs />
          
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
