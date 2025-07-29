'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Eye, 
  ExternalLink, 
  User, 
  Calendar,
  Tag,
  MessageCircle,
  Star,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostData {
  id?: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  seoTitle?: string
  seoDescription?: string
  keywords?: string
  ctaEnabled: boolean
  ctaCourse?: string
  ctaText?: string
  ctaButtonText?: string
  categoryId: string
  status: 'draft' | 'published' | 'scheduled'
  publishAt?: Date
  allowComments: boolean
  featured: boolean
  tags?: string
}

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

interface Course {
  id: string
  title: string
  slug: string
  description: string
}

interface PostPreviewProps {
  post: PostData
  category?: Category
  course?: Course
  author?: {
    name: string
    avatar?: string
  }
  onClose?: () => void
  showResponsivePreview?: boolean
}

export function PostPreview({
  post,
  category,
  course,
  author = { name: 'Autor do Post' },
  onClose,
  showResponsivePreview = true
}: PostPreviewProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const formatContent = (content: string) => {
    // Simular formatação básica de Markdown/HTML
    return content
      .split('\n\n')
      .map((paragraph, index) => (
        <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
          {paragraph}
        </p>
      ))
  }

  const parseKeywords = (keywords?: string) => {
    if (!keywords) return []
    return keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
  }

  const parseTags = (tags?: string) => {
    if (!tags) return []
    return tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Publicado</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-500">Agendado</Badge>
      default:
        return <Badge variant="secondary">Rascunho</Badge>
    }
  }

  const estimateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length
    const readTime = Math.ceil(words / 200) // 200 palavras por minuto
    return readTime
  }

  const PreviewContent = () => (
    <div className="space-y-6">
      {/* Header do Post */}
      <div className="space-y-4">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{author.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {post.status === 'scheduled' && post.publishAt 
                ? format(post.publishAt, "PPP", { locale: ptBR })
                : format(new Date(), "PPP", { locale: ptBR })
              }
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{estimateReadTime(post.content)} min de leitura</span>
          </div>
        </div>

        {/* Categoria e Status */}
        <div className="flex items-center gap-3">
          {category && (
            <Badge 
              variant="outline" 
              style={{ borderColor: category.color, color: category.color }}
            >
              {category.name}
            </Badge>
          )}
          {getStatusBadge(post.status)}
          {post.featured && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
              <Star className="h-3 w-3 mr-1" />
              Destaque
            </Badge>
          )}
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          {post.title}
        </h1>

        {/* Resumo */}
        {post.excerpt && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {parseTags(post.tags).length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {parseTags(post.tags).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Imagem Destacada */}
      {post.featuredImage && (
        <div className="space-y-2">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg border"
          />
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="prose prose-gray max-w-none">
        {formatContent(post.content)}
      </div>

      {/* Call-to-Action */}
      {post.ctaEnabled && post.ctaCourse && course && (
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {post.ctaText || `Quer aprender mais sobre ${course.title}?`}
                </h3>
                <p className="text-muted-foreground">
                  {course.description || `Confira nosso curso completo sobre ${course.title} e domine este assunto.`}
                </p>
              </div>
              
              <Button className="w-full sm:w-auto">
                <ExternalLink className="h-4 w-4 mr-2" />
                {post.ctaButtonText || 'Saiba Mais'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comentários Info */}
      {post.allowComments && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-4">
          <MessageCircle className="h-4 w-4" />
          <span>Comentários habilitados para este post</span>
        </div>
      )}

      {/* SEO Preview */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Preview SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-blue-600 text-lg">
              {post.seoTitle || post.title}
            </h4>
            <p className="text-green-600 text-sm">
              https://escolahabilidade.com.br/blog/{post.slug}
            </p>
            <p className="text-gray-600 text-sm">
              {post.seoDescription || post.excerpt || post.content.substring(0, 160) + '...'}
            </p>
          </div>
          
          {parseKeywords(post.keywords).length > 0 && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Palavras-chave: </span>
              {parseKeywords(post.keywords).join(', ')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Dialog onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Preview do Post</DialogTitle>
              <DialogDescription>
                Visualize como o post aparecerá no site principal
              </DialogDescription>
            </div>
            
            {showResponsivePreview && (
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className="text-xs"
                >
                  Desktop
                </Button>
                <Button
                  variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('tablet')}
                  className="text-xs"
                >
                  Tablet
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className="text-xs"
                >
                  Mobile
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Container com responsividade simulada */}
        <div className="flex justify-center">
          <div 
            className={cn(
              "w-full transition-all duration-300 bg-background border rounded-lg",
              previewMode === 'mobile' && "max-w-sm",
              previewMode === 'tablet' && "max-w-2xl", 
              previewMode === 'desktop' && "max-w-4xl"
            )}
          >
            <div className="p-6">
              <PreviewContent />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Componente para preview inline (sem modal)
export function InlinePostPreview({
  post,
  category,
  course,
  author,
  className
}: PostPreviewProps & { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <PostPreview 
        post={post}
        category={category}
        course={course}
        author={author}
        showResponsivePreview={false}
      />
    </div>
  )
}