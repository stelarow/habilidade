'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  status: 'draft' | 'published' | 'archived'
  author_name: string
  category_name: string
  category_color: string
  view_count: number
  created_at: string
  updated_at: string
  published_at?: string
}

// Mock data - In production, this would come from server components fetching from Supabase
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Como Começar no Design Gráfico em 2024',
    slug: 'como-comecar-design-grafico-2024',
    excerpt: 'Um guia completo para iniciantes no mundo do design gráfico, com dicas práticas e ferramentas essenciais.',
    status: 'published',
    author_name: 'João Silva',
    category_name: 'Design',
    category_color: '#00c4ff',
    view_count: 1847,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
    published_at: '2024-01-18T09:00:00Z'
  },
  {
    id: '2',
    title: 'Tendências de UX/UI para 2024',
    slug: 'tendencias-ux-ui-2024',
    excerpt: 'Explore as principais tendências em experiência do usuário e design de interface para este ano.',
    status: 'published',
    author_name: 'Maria Santos',
    category_name: 'Tecnologia',
    category_color: '#d400ff',
    view_count: 1543,
    created_at: '2024-01-10T11:00:00Z',
    updated_at: '2024-01-22T16:45:00Z',
    published_at: '2024-01-12T08:30:00Z'
  },
  {
    id: '3',
    title: 'Marketing Digital para Pequenas Empresas',
    slug: 'marketing-digital-pequenas-empresas',
    excerpt: 'Estratégias eficazes de marketing digital que funcionam mesmo com orçamento limitado.',
    status: 'draft',
    author_name: 'Carlos Oliveira',
    category_name: 'Marketing',
    category_color: '#ff6600',
    view_count: 0,
    created_at: '2024-01-25T13:00:00Z',
    updated_at: '2024-01-28T10:15:00Z'
  },
  {
    id: '4',
    title: 'Desenvolvimento Web com React: Guia Avançado',
    slug: 'desenvolvimento-web-react-guia-avancado',
    excerpt: 'Técnicas avançadas e melhores práticas para desenvolvimento de aplicações React modernas.',
    status: 'published',
    author_name: 'Ana Costa',
    category_name: 'Tecnologia',
    category_color: '#d400ff',
    view_count: 1156,
    created_at: '2024-01-08T15:00:00Z',
    updated_at: '2024-01-19T12:20:00Z',
    published_at: '2024-01-10T07:00:00Z'
  },
  {
    id: '5',
    title: 'Fotografia para Redes Sociais: Dicas Profissionais',
    slug: 'fotografia-redes-sociais-dicas-profissionais',
    excerpt: 'Como criar fotos que engajam e convertem nas principais redes sociais.',
    status: 'archived',
    author_name: 'Pedro Lima',
    category_name: 'Design',
    category_color: '#00c4ff',
    view_count: 987,
    created_at: '2024-01-05T09:00:00Z',
    updated_at: '2024-01-26T14:00:00Z',
    published_at: '2024-01-07T10:00:00Z'
  }
]

const statusColors = {
  draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  published: 'bg-green-100 text-green-800 border-green-200',
  archived: 'bg-gray-100 text-gray-800 border-gray-200'
}

const statusLabels = {
  draft: '=Ý Rascunho',
  published: ' Publicado',
  archived: '=æ Arquivado'
}

export default function PostsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts)
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'title' | 'created_at' | 'view_count' | 'updated_at'>('updated_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [showBulkDialog, setShowBulkDialog] = useState(false)
  const [bulkAction, setBulkAction] = useState<'publish' | 'draft' | 'archive' | 'delete'>('publish')
  const [isLoading, setIsLoading] = useState(false)
  const itemsPerPage = 20

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.author_name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || post.category_name === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case 'title':
          aValue = a.title
          bValue = b.title
          break
        case 'view_count':
          aValue = a.view_count
          bValue = b.view_count
          break
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        case 'updated_at':
        default:
          aValue = new Date(a.updated_at).getTime()
          bValue = new Date(b.updated_at).getTime()
          break
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      
      return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    })

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Get unique categories for filter
  const categories = Array.from(new Set(posts.map(post => post.category_name)))

  const handleBulkAction = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedPosts = posts.map(post => {
        if (selectedPosts.has(post.id)) {
          switch (bulkAction) {
            case 'publish':
              return { ...post, status: 'published' as const, published_at: new Date().toISOString() }
            case 'draft':
              return { ...post, status: 'draft' as const }
            case 'archive':
              return { ...post, status: 'archived' as const }
            case 'delete':
              return null
          }
        }
        return post
      }).filter(Boolean) as BlogPost[]
      
      setPosts(updatedPosts)
      setSelectedPosts(new Set())
      setShowBulkDialog(false)
    } catch (error) {
      console.error('Error performing bulk action:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) {
      setPosts(posts.filter(post => post.id !== postId))
    }
  }

  const togglePostSelection = (postId: string) => {
    const newSelection = new Set(selectedPosts)
    if (newSelection.has(postId)) {
      newSelection.delete(postId)
    } else {
      newSelection.add(postId)
    }
    setSelectedPosts(newSelection)
  }

  const getStatusCounts = () => {
    return {
      all: posts.length,
      published: posts.filter(p => p.status === 'published').length,
      draft: posts.filter(p => p.status === 'draft').length,
      archived: posts.filter(p => p.status === 'archived').length
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts do Blog</h1>
          <p className="text-muted-foreground">
            Gerencie todos os posts do seu blog
          </p>
        </div>
        <Link href="/admin/blog/posts/new">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
             Novo Post
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className={statusFilter === 'all' ? 'ring-2 ring-purple-500' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Posts</CardTitle>
            <span className="text-2xl">=Ý</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.all}</div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-auto p-0 text-xs text-muted-foreground"
              onClick={() => setStatusFilter('all')}
            >
              Ver todos
            </Button>
          </CardContent>
        </Card>

        <Card className={statusFilter === 'published' ? 'ring-2 ring-green-500' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <span className="text-2xl"></span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.published}</div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-auto p-0 text-xs text-muted-foreground"
              onClick={() => setStatusFilter('published')}
            >
              Ver publicados
            </Button>
          </CardContent>
        </Card>

        <Card className={statusFilter === 'draft' ? 'ring-2 ring-yellow-500' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <span className="text-2xl">=Ý</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.draft}</div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-auto p-0 text-xs text-muted-foreground"
              onClick={() => setStatusFilter('draft')}
            >
              Ver rascunhos
            </Button>
          </CardContent>
        </Card>

        <Card className={statusFilter === 'archived' ? 'ring-2 ring-gray-500' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivados</CardTitle>
            <span className="text-2xl">=æ</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.archived}</div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-auto p-0 text-xs text-muted-foreground"
              onClick={() => setStatusFilter('archived')}
            >
              Ver arquivados
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filtros e Busca</CardTitle>
            {selectedPosts.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedPosts.size} selecionado(s)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkDialog(true)}
                >
                  Ações em Lote
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Título, conteúdo ou autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="draft">Rascunhos</SelectItem>
                  <SelectItem value="archived">Arquivados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ordenar por</label>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated_at">Última Atualização</SelectItem>
                    <SelectItem value="created_at">Data de Criação</SelectItem>
                    <SelectItem value="title">Título</SelectItem>
                    <SelectItem value="view_count">Visualizações</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '‘' : '“'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Posts</CardTitle>
          <CardDescription>
            {filteredPosts.length} post(s) encontrado(s)
            {statusFilter !== 'all' && ` " Filtrado por: ${statusLabels[statusFilter as keyof typeof statusLabels]}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paginatedPosts.length === 0 ? (
            <Alert>
              <AlertDescription>
                Nenhum post encontrado. {searchTerm ? 'Tente ajustar os filtros.' : 'Crie seu primeiro post!'}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedPosts.size === paginatedPosts.length && paginatedPosts.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPosts(new Set(paginatedPosts.map(p => p.id)))
                          } else {
                            setSelectedPosts(new Set())
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Visualizações</TableHead>
                    <TableHead>Atualizado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedPosts.has(post.id)}
                          onChange={() => togglePostSelection(post.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Link href={`/admin/blog/posts/${post.id}/edit`}>
                            <div className="font-medium hover:text-purple-600 cursor-pointer">
                              {post.title}
                            </div>
                          </Link>
                          {post.excerpt && (
                            <div className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                              {post.excerpt}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            /{post.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[post.status]}>
                          {statusLabels[post.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          style={{ 
                            backgroundColor: `${post.category_color}20`,
                            color: post.category_color,
                            borderColor: post.category_color
                          }}
                        >
                          {post.category_name}
                        </Badge>
                      </TableCell>
                      <TableCell>{post.author_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>=A</span>
                          <span>{post.view_count.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(post.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(post.updated_at), 'HH:mm', { locale: ptBR })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Link href={`/admin/blog/posts/${post.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-6 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="text-muted-foreground">...</span>
                        <Button
                          variant={currentPage === totalPages ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ações em Lote</DialogTitle>
            <DialogDescription>
              Escolha uma ação para aplicar aos {selectedPosts.size} posts selecionados.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ação</label>
              <Select value={bulkAction} onValueChange={(value: any) => setBulkAction(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publish"> Publicar</SelectItem>
                  <SelectItem value="draft">=Ý Mover para Rascunho</SelectItem>
                  <SelectItem value="archive">=æ Arquivar</SelectItem>
                  <SelectItem value="delete">=Ñ Excluir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bulkAction === 'delete' && (
              <Alert>
                <AlertDescription>
                    Atenção: A exclusão é permanente e não pode ser desfeita.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleBulkAction}
              disabled={isLoading}
              variant={bulkAction === 'delete' ? 'destructive' : 'default'}
            >
              {isLoading ? 'Processando...' : `Aplicar a ${selectedPosts.size} post(s)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}