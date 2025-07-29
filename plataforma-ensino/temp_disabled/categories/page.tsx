'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { HexColorPicker } from 'react-colorful'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pagination } from '@/components/ui/pagination'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Validation schema
const categorySchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(50, 'Nome deve ter no máximo 50 caracteres'),
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().max(200, 'Descrição deve ter no máximo 200 caracteres').optional(),
  color_theme: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um código hexadecimal válido')
})

type CategoryFormData = z.infer<typeof categorySchema>

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color_theme: string
  postCount: number
  created_at: string
  updated_at: string
}

// Mock data - In production, this would come from Supabase
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Tecnologia',
    slug: 'tecnologia',
    description: 'Artigos sobre tecnologia e inovação',
    color_theme: '#d400ff',
    postCount: 15,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Design',
    slug: 'design',
    description: 'Dicas e tendências de design',
    color_theme: '#00c4ff',
    postCount: 12,
    created_at: '2024-01-16T11:00:00Z',
    updated_at: '2024-01-16T11:00:00Z'
  },
  {
    id: '3',
    name: 'Educação',
    slug: 'educacao',
    description: 'Conteúdo educacional e metodologias',
    color_theme: '#a000ff',
    postCount: 8,
    created_at: '2024-01-17T12:00:00Z',
    updated_at: '2024-01-17T12:00:00Z'
  },
  {
    id: '4',
    name: 'Carreira',
    slug: 'carreira',
    description: 'Desenvolvimento profissional e carreira',
    color_theme: '#ff6600',
    postCount: 6,
    created_at: '2024-01-18T13:00:00Z',
    updated_at: '2024-01-18T13:00:00Z'
  },
  {
    id: '5',
    name: 'Mercado',
    slug: 'mercado',
    description: 'Análises e tendências de mercado',
    color_theme: '#00ff88',
    postCount: 4,
    created_at: '2024-01-19T14:00:00Z',
    updated_at: '2024-01-19T14:00:00Z'
  }
]

function CategoryForm({ 
  category, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: {
  category?: Category
  onSubmit: (data: CategoryFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}) {
  const [previewColor, setPreviewColor] = useState(category?.color_theme || '#d400ff')
  
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      color_theme: category?.color_theme || '#d400ff'
    }
  })

  // Auto-generate slug from name
  const watchName = form.watch('name')
  useEffect(() => {
    if (watchName && !category) {
      const slug = watchName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      form.setValue('slug', slug)
    }
  }, [watchName, form, category])

  // Update form color when preview changes
  useEffect(() => {
    form.setValue('color_theme', previewColor)
  }, [previewColor, form])

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      await onSubmit(data)
      form.reset()
      setPreviewColor('#d400ff')
    } catch (error) {
      console.error('Error submitting category:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Categoria</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Tecnologia" 
                      {...field}
                      maxLength={50}
                    />
                  </FormControl>
                  <div className="text-sm text-muted-foreground">
                    {field.value?.length || 0}/50 caracteres
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: tecnologia" 
                      {...field}
                    />
                  </FormControl>
                  <div className="text-sm text-muted-foreground">
                    URL: /blog/categoria/{field.value || 'slug'}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Breve descrição da categoria..."
                      {...field}
                      maxLength={200}
                      rows={3}
                    />
                  </FormControl>
                  <div className="text-sm text-muted-foreground">
                    {field.value?.length || 0}/200 caracteres
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cor da Categoria</Label>
              <div className="p-4 border rounded-lg">
                <HexColorPicker 
                  color={previewColor} 
                  onChange={setPreviewColor}
                  style={{ width: '100%', height: '150px' }}
                />
                <div className="mt-3 text-center">
                  <Input
                    value={previewColor}
                    onChange={(e) => setPreviewColor(e.target.value)}
                    className="w-24 mx-auto text-center"
                    placeholder="#d400ff"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preview da Categoria</Label>
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: previewColor }}
                  />
                  <Badge 
                    variant="secondary" 
                    style={{ 
                      backgroundColor: `${previewColor}20`,
                      color: previewColor,
                      borderColor: previewColor
                    }}
                  >
                    {form.watch('name') || 'Nome da Categoria'}
                  </Badge>
                </div>
                {form.watch('description') && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {form.watch('description')}
                  </p>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="color_theme"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : category ? 'Atualizar' : 'Criar'} Categoria
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'postCount' | 'created_at'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter and sort categories
  const filteredCategories = categories
    .filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = sortBy === 'name' ? a.name : sortBy === 'postCount' ? a.postCount : new Date(a.created_at).getTime()
      const bValue = sortBy === 'name' ? b.name : sortBy === 'postCount' ? b.postCount : new Date(b.created_at).getTime()
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      
      return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    })

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleCreateCategory = async (data: CategoryFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newCategory: Category = {
        id: Date.now().toString(),
        ...data,
        postCount: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setCategories([...categories, newCategory])
      setIsFormOpen(false)
    } catch (error) {
      console.error('Error creating category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCategory = async (data: CategoryFormData) => {
    if (!editingCategory) return
    
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedCategories = categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, ...data, updated_at: new Date().toISOString() }
          : cat
      )
      
      setCategories(updatedCategories)
      setEditingCategory(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error('Error updating category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    
    if (category && category.postCount > 0) {
      alert(`Não é possível excluir a categoria "${category.name}" pois ela possui ${category.postCount} posts associados.`)
      return
    }
    
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategories(categories.filter(c => c.id !== categoryId))
    }
  }

  const handleBulkDelete = async () => {
    const categoriesToDelete = categories.filter(c => selectedCategories.has(c.id))
    const categoriesWithPosts = categoriesToDelete.filter(c => c.postCount > 0)
    
    if (categoriesWithPosts.length > 0) {
      alert(`Não é possível excluir ${categoriesWithPosts.length} categoria(s) pois possuem posts associados.`)
      return
    }
    
    if (confirm(`Tem certeza que deseja excluir ${selectedCategories.size} categoria(s)?`)) {
      setCategories(categories.filter(c => !selectedCategories.has(c.id)))
      setSelectedCategories(new Set())
    }
  }

  const toggleCategorySelection = (categoryId: string) => {
    const newSelection = new Set(selectedCategories)
    if (newSelection.has(categoryId)) {
      newSelection.delete(categoryId)
    } else {
      newSelection.add(categoryId)
    }
    setSelectedCategories(newSelection)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias do Blog</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias para organizar seus posts
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingCategory(null)
                setIsFormOpen(true)
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
               Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory 
                  ? 'Faça as alterações necessárias na categoria.'
                  : 'Crie uma nova categoria para organizar seus posts.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <CategoryForm
              category={editingCategory || undefined}
              onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingCategory(null)
              }}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
            <span className="text-2xl"><�</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Categorizados</CardTitle>
            <span className="text-2xl">📄</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((total, cat) => total + cat.postCount, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categoria Mais Popular</CardTitle>
            <span className="text-2xl">📈</span>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {categories.reduce((max, cat) => cat.postCount > max.postCount ? cat : max, categories[0])?.name || 'N/A'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Posts</CardTitle>
            <span className="text-2xl">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(categories.reduce((total, cat) => total + cat.postCount, 0) / categories.length) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filtros e Busca</CardTitle>
            {selectedCategories.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedCategories.size} selecionada(s)
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  Excluir Selecionadas
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome ou slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="name">Nome</option>
                <option value="postCount">Nº Posts</option>
                <option value="created_at">Data Criação</option>
              </select>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
          <CardDescription>
            Gerencie suas categorias e veja quantos posts cada uma possui
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paginatedCategories.length === 0 ? (
            <Alert>
              <AlertDescription>
                Nenhuma categoria encontrada. {searchTerm ? 'Tente ajustar os filtros.' : 'Crie sua primeira categoria!'}
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
                        checked={selectedCategories.size === paginatedCategories.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories(new Set(paginatedCategories.map(c => c.id)))
                          } else {
                            setSelectedCategories(new Set())
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Cor</TableHead>
                    <TableHead>Posts</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedCategories.has(category.id)}
                          onChange={() => toggleCategorySelection(category.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: category.color_theme }}
                          />
                          <div>
                            <div className="font-medium">{category.name}</div>
                            {category.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {category.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="px-2 py-1 bg-muted rounded text-sm">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          style={{ 
                            backgroundColor: `${category.color_theme}20`,
                            color: category.color_theme,
                            borderColor: category.color_theme
                          }}
                        >
                          {category.color_theme}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={category.postCount > 0 ? "default" : "secondary"}
                        >
                          {category.postCount} post{category.postCount !== 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(category.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category)
                              setIsFormOpen(true)
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={category.postCount > 0}
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
                <div className="flex items-center justify-center mt-6">
                  <Pagination>
                    {/* Pagination implementation would go here */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <span className="flex items-center px-3 text-sm">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Próxima
                      </Button>
                    </div>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}