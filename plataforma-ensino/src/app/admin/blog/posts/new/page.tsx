'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PostEditor } from '@/components/admin/blog/PostEditor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Mock data - In production, this would come from server components fetching from Supabase
const mockCategories = [
  { id: '1', name: 'Tecnologia', color_theme: '#d400ff' },
  { id: '2', name: 'Design', color_theme: '#00c4ff' },
  { id: '3', name: 'Marketing', color_theme: '#a000ff' },
  { id: '4', name: 'Educação', color_theme: '#ff6600' },
  { id: '5', name: 'Desenvolvimento', color_theme: '#00ff88' }
]

const mockCourses = [
  { id: '1', name: 'Design Gráfico Completo', slug: 'design-grafico-completo' },
  { id: '2', name: 'Desenvolvimento Web', slug: 'desenvolvimento-web' },
  { id: '3', name: 'Marketing Digital', slug: 'marketing-digital' },
  { id: '4', name: 'UX/UI Design', slug: 'ux-ui-design' }
]

export default function NewPostPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: any) => {
    setIsSaving(true)
    
    try {
      // TODO: Implement actual save functionality with Supabase
      console.log('Saving post:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to posts list or show success message
      router.push('/admin/blog/posts')
      
    } catch (error) {
      console.error('Error saving post:', error)
      // TODO: Show error message to user
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blog">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Novo Post</h1>
            <p className="text-muted-foreground">
              Crie um novo post para o blog da Escola Habilidade
            </p>
          </div>
        </div>
      </div>

      {/* Editor Card */}
      <Card>
        <CardHeader>
          <CardTitle>Editor de Post</CardTitle>
          <CardDescription>
            Preencha as informações abaixo para criar seu post. Use o editor rico para formatar o conteúdo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostEditor
            categories={mockCategories}
            courses={mockCourses}
            onSave={handleSave}
          />
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Dicas Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">📝 Conteúdo</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use títulos (H2, H3) para organizar o conteúdo</li>
                <li>• Adicione imagens para ilustrar os pontos principais</li>
                <li>• Mantenha parágrafos curtos e objetivos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎯 SEO</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Título entre 50-60 caracteres</li>
                <li>• Meta description entre 150-160 caracteres</li>
                <li>• Use palavras-chave naturalmente no texto</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}