'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PencilIcon, 
  EyeIcon, 
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

// Mock data - In production, this would come from server components fetching from Supabase
const mockPosts = [
  {
    id: '1',
    title: 'Como Começar no Design Gráfico: Guia Completo para Iniciantes',
    slug: 'como-comecar-design-grafico-guia-completo',
    status: 'published',
    category: 'Design',
    author: 'Alessandro Ferreira',
    views: 1847,
    published_at: '2024-01-25T10:00:00Z',
    updated_at: '2024-01-25T10:00:00Z',
    featured_image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    excerpt: 'Descubra os fundamentos do design gráfico e como dar os primeiros passos nesta carreira promissora.'
  },
  {
    id: '2',
    title: 'Tendências de UX/UI Design para 2024',
    slug: 'tendencias-ux-ui-design-2024',
    status: 'published',
    category: 'Tecnologia',
    author: 'Alessandro Ferreira',
    views: 1543,
    published_at: '2024-01-24T14:30:00Z',
    updated_at: '2024-01-24T14:30:00Z',
    featured_image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400',
    excerpt: 'Conheça as principais tendências que irão dominar o design de interfaces em 2024.'
  },
  {
    id: '3',
    title: 'Marketing Digital para Pequenas Empresas',
    slug: 'marketing-digital-pequenas-empresas',
    status: 'draft',
    category: 'Marketing',
    author: 'Alessandro Ferreira',
    views: 0,
    published_at: null,
    updated_at: '2024-01-23T09:15:00Z',
    featured_image: null,
    excerpt: 'Estratégias práticas e acessíveis de marketing digital para impulsionar pequenos negócios.'
  },
  {
    id: '4',
    title: 'Desenvolvimento Web com React: Do Básico ao Avançado',
    slug: 'desenvolvimento-web-react-basico-avancado',
    status: 'published',
    category: 'Tecnologia',
    author: 'Alessandro Ferreira',
    views: 1156,
    published_at: '2024-01-22T16:45:00Z',
    updated_at: '2024-01-22T16:45:00Z',
    featured_image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400',
    excerpt: 'Um guia completo para dominar o React.js e construir aplicações web modernas.'
  },
  {
    id: '5',
    title: 'Fotografia para Redes Sociais: Técnicas e Dicas',
    slug: 'fotografia-redes-sociais-tecnicas-dicas',
    status: 'archived',
    category: 'Design',
    author: 'Alessandro Ferreira',
    views: 987,
    published_at: '2024-01-20T11:20:00Z',
    updated_at: '2024-01-20T11:20:00Z',
    featured_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    excerpt: 'Aprenda técnicas profissionais de fotografia adaptadas para o mundo digital.'
  }
]

const getStatusBadge = (status: string) => {
  const variants = {
    published: { variant: 'default' as const, color: 'bg-green-100 text-green-800', icon: '✅', label: 'Publicado' },
    draft: { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800', icon: '📝', label: 'Rascunho' },
    archived: { variant: 'outline' as const, color: 'bg-gray-100 text-gray-600', icon: '📦', label: 'Arquivado' }
  }
  
  const config = variants[status as keyof typeof variants] || variants.draft
  
  return (
    <Badge variant={config.variant} className={config.color}>
      {config.icon} {config.label}
    </Badge>
  )
}

export default function PostsListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  // Filter posts based on search and filters
  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getPostsByStatus = (status: string) => {
    return mockPosts.filter(post => post.status === status).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blog">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Posts do Blog</h1>
            <p className="text-muted-foreground">
              Gerencie todos os posts do seu blog
            </p>
          </div>
        </div>
        <Link href="/admin/blog/posts/new">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Post
          </Button>
        </Link>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Todos ({mockPosts.length})
          </TabsTrigger>
          <TabsTrigger value="published">
            Publicados ({getPostsByStatus('published')})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Rascunhos ({getPostsByStatus('draft')})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Arquivados ({getPostsByStatus('archived')})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos Status</SelectItem>
                      <SelectItem value="published">Publicados</SelectItem>
                      <SelectItem value="draft">Rascunhos</SelectItem>
                      <SelectItem value="archived">Arquivados</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Nenhum post encontrado.</p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Featured Image */}
                      {post.featured_image && (
                        <div className="flex-shrink-0">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg truncate mb-1">
                              {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{post.category}</span>
                              <span>•</span>
                              <span>{post.author}</span>
                              <span>•</span>
                              <span>{post.views.toLocaleString()} visualizações</span>
                              <span>•</span>
                              <span>
                                {post.published_at 
                                  ? new Date(post.published_at).toLocaleDateString('pt-BR')
                                  : `Editado em ${new Date(post.updated_at).toLocaleDateString('pt-BR')}`
                                }
                              </span>
                            </div>
                          </div>
                          
                          {/* Status & Actions */}
                          <div className="flex items-center gap-3 ml-4">
                            {getStatusBadge(post.status)}
                            
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Other tab contents can be added here */}
        <TabsContent value="published">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Filtro por posts publicados será implementado aqui.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="draft">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Filtro por rascunhos será implementado aqui.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="archived">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Filtro por posts arquivados será implementado aqui.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}