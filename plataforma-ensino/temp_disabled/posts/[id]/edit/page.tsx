'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PostEditor from '@/components/admin/blog/PostEditor'
import PublishControls from '@/components/admin/blog/PublishControls'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

// Mock data for categories and courses
const mockCategories = [
  { id: '1', name: 'Tecnologia', color_theme: '#d400ff' },
  { id: '2', name: 'Design', color_theme: '#00c4ff' },
  { id: '3', name: 'Educação', color_theme: '#a000ff' },
  { id: '4', name: 'Carreira', color_theme: '#ff6600' },
  { id: '5', name: 'Mercado', color_theme: '#00ff88' }
]

const mockCourses = [
  { id: '1', name: 'Design Gráfico Completo', slug: 'design-grafico-completo' },
  { id: '2', name: 'Desenvolvimento Web', slug: 'desenvolvimento-web' },
  { id: '3', name: 'Marketing Digital', slug: 'marketing-digital' },
  { id: '4', name: 'UX/UI Design', slug: 'ux-ui-design' }
]

// Mock post data
const getMockPost = (id: string) => ({
  id,
  title: 'Como Começar no Design Gráfico em 2024',
  slug: 'como-comecar-design-grafico-2024',
  content: '<p>Este é um exemplo de conteúdo de post em HTML. Aqui você pode escrever o conteúdo completo do seu post com formatação rica.</p><p>Você pode incluir <strong>texto em negrito</strong>, <em>texto em itálico</em>, e muito mais.</p>',
  excerpt: 'Um guia completo para iniciantes no mundo do design gráfico, com dicas práticas e ferramentas essenciais.',
  featured_image: 'https://example.com/image.jpg',
  category_id: '2',
  seo_title: 'Design Gráfico 2024: Guia Completo para Iniciantes',
  seo_description: 'Aprenda design gráfico do zero com nosso guia completo. Ferramentas, técnicas e dicas profissionais para começar sua carreira.',
  keywords: 'design gráfico, iniciantes, tutorial, ferramentas',
  og_title: 'Design Gráfico para Iniciantes - Guia 2024',
  og_description: 'Descubra como começar no design gráfico com nosso guia completo e atualizado.',
  og_image: 'https://example.com/og-image.jpg',
  cta_type: 'course' as const,
  cta_course_id: '1',
  status: 'published' as const,
  published_at: '2024-01-18T09:00:00Z',
  tags: 'design, gráfico, tutorial, iniciantes',
  comments_enabled: true,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-20T14:30:00Z'
})

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingPost, setIsLoadingPost] = useState(true)
  const [postData, setPostData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load post data
  useEffect(() => {
    const loadPost = async () => {
      setIsLoadingPost(true)
      try {
        // Simulate API call to load post
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // In production, this would fetch from Supabase
        const post = getMockPost(postId)
        setPostData(post)
      } catch (error) {
        console.error('Error loading post:', error)
        setError('Erro ao carregar o post. Tente novamente.')
      } finally {
        setIsLoadingPost(false)
      }
    }

    if (postId) {
      loadPost()
    }
  }, [postId])

  // Warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleSave = async (data: any) => {
    setIsSaving(true)
    try {
      // Simulate API call to save post
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Saving post:', data)
      setPostData({ ...postData, ...data, updated_at: new Date().toISOString() })
      setHasUnsavedChanges(false)
      
      // Show success message
      // In production, you might want to use a toast notification
      alert('Post salvo com sucesso!')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Erro ao salvar o post. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async (data: any) => {
    setIsLoading(true)
    try {
      // Simulate API call to publish post
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Publishing post:', data)
      setPostData({ 
        ...postData, 
        ...data, 
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      setHasUnsavedChanges(false)
      
      alert('Post publicado com sucesso!')
    } catch (error) {
      console.error('Error publishing post:', error)
      alert('Erro ao publicar o post. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSchedule = async (data: any, publishDate: Date) => {
    setIsLoading(true)
    try {
      // Simulate API call to schedule post
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Scheduling post:', data, 'for:', publishDate)
      setPostData({ 
        ...postData, 
        ...data, 
        status: 'published',
        published_at: publishDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      setHasUnsavedChanges(false)
      
      alert(`Post agendado para ${publishDate.toLocaleString('pt-BR')}!`)
    } catch (error) {
      console.error('Error scheduling post:', error)
      alert('Erro ao agendar o post. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleArchive = async (data: any) => {
    if (window.confirm('Tem certeza que deseja arquivar este post?')) {
      setIsLoading(true)
      try {
        // Simulate API call to archive post
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('Archiving post:', data)
        setPostData({ 
          ...postData, 
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        
        alert('Post arquivado com sucesso!')
      } catch (error) {
        console.error('Error archiving post:', error)
        alert('Erro ao arquivar o post. Tente novamente.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePreview = (data: any) => {
    console.log('Preview post:', data)
    // In production, this could open a preview window or navigate to a preview page
    window.open(`/blog/${data.slug}?preview=true`, '_blank')
  }

  const handleDataChange = () => {
    setHasUnsavedChanges(true)
  }

  if (isLoadingPost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-muted rounded animate-pulse w-64" />
            <div className="h-4 bg-muted rounded animate-pulse w-48 mt-2" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-10 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                  <div className="h-32 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-10 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Erro ao Carregar Post</h1>
            <p className="text-muted-foreground">
              Não foi possível carregar o post solicitado
            </p>
          </div>
        </div>
        <Alert>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/blog/posts')}>
            Voltar para Posts
          </Button>
        </div>
      </div>
    )
  }

  if (!postData) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Post</h1>
          <p className="text-muted-foreground">
            {postData.title}
          </p>
        </div>
        <div className="flex gap-2">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-sm text-yellow-600">
              <span>Ï</span>
              <span>Alterações não salvas</span>
            </div>
          )}
          <Button variant="outline" onClick={() => router.push('/admin/blog/posts')}>
            Voltar para Posts
          </Button>
        </div>
      </div>

      {/* Auto-save indicator */}
      {isSaving && (
        <Alert>
          <AlertDescription>
            =¾ Salvando alterações automaticamente...
          </AlertDescription>
        </Alert>
      )}

      {/* Editor Layout */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Editor - 3/4 width */}
        <div className="lg:col-span-3">
          <PostEditor
            initialData={postData}
            categories={mockCategories}
            courses={mockCourses}
            onSave={handleSave}
            onPreview={handlePreview}
            isLoading={isSaving}
          />
        </div>

        {/* Publish Controls Sidebar - 1/4 width */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <PublishControls
              postData={postData}
              onSave={handleSave}
              onPublish={handlePublish}
              onSchedule={handleSchedule}
              onArchive={handleArchive}
              onPreview={handlePreview}
              isLoading={isLoading}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>
    </div>
  )
}