'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PostEditor from '@/components/admin/blog/PostEditor'
import PublishControls from '@/components/admin/blog/PublishControls'

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

export default function NewPostPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [postData, setPostData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category_id: '',
    seo_title: '',
    seo_description: '',
    keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    cta_type: 'none' as const,
    cta_course_id: '',
    status: 'draft' as const,
    published_at: '',
    tags: '',
    comments_enabled: true
  })

  const handleSave = async (data: any) => {
    setIsSaving(true)
    try {
      // Simulate API call to save post
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Saving post:', data)
      setPostData(data)
      
      // In production, this would save to Supabase and get the post ID
      const newPostId = Date.now().toString()
      
      // Redirect to edit page after saving
      router.push(`/admin/blog/posts/${newPostId}/edit`)
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
      
      // In production, this would save and publish to Supabase
      alert('Post publicado com sucesso!')
      router.push('/admin/blog/posts')
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
      
      // In production, this would save and schedule to Supabase
      alert(`Post agendado para ${publishDate.toLocaleString('pt-BR')}!`)
      router.push('/admin/blog/posts')
    } catch (error) {
      console.error('Error scheduling post:', error)
      alert('Erro ao agendar o post. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = (data: any) => {
    console.log('Preview post:', data)
    // In production, this could open a preview window or navigate to a preview page
    alert('Funcionalidade de preview será implementada em breve!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Post</h1>
          <p className="text-muted-foreground">
            Crie um novo post para o seu blog
          </p>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Editor - 3/4 width */}
        <div className="lg:col-span-3">
          <PostEditor
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