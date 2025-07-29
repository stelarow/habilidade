'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { HexColorPicker } from 'react-colorful'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'

// Validation schema
const postSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(60, 'Título deve ter no máximo 60 caracteres'),
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  content: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
  excerpt: z.string().max(160, 'Resumo deve ter no máximo 160 caracteres').optional(),
  featured_image: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
  category_id: z.string().uuid('Categoria é obrigatória'),
  seo_title: z.string().max(60, 'Título SEO deve ter no máximo 60 caracteres').optional(),
  seo_description: z.string().max(160, 'Meta description deve ter no máximo 160 caracteres').optional(),
  keywords: z.string().optional(),
  og_title: z.string().max(60, 'Título Open Graph deve ter no máximo 60 caracteres').optional(),
  og_description: z.string().max(160, 'Descrição Open Graph deve ter no máximo 160 caracteres').optional(),
  og_image: z.string().url('URL da imagem Open Graph inválida').optional().or(z.literal('')),
  cta_type: z.enum(['none', 'course', 'contact', 'newsletter']).default('none'),
  cta_course_id: z.string().uuid().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  published_at: z.string().optional(),
  tags: z.string().optional(),
  comments_enabled: z.boolean().default(true)
})

type PostFormData = z.infer<typeof postSchema>

interface PostEditorProps {
  initialData?: Partial<PostFormData>
  categories?: Array<{ id: string; name: string; color_theme: string }>
  courses?: Array<{ id: string; name: string; slug: string }>
  onSave?: (data: PostFormData) => Promise<void>
  onPreview?: (data: PostFormData) => void
  isLoading?: boolean
}

export default function PostEditor({
  initialData,
  categories = [],
  courses = [],
  onSave,
  onPreview,
  isLoading = false
}: PostEditorProps) {
  const [previewData, setPreviewData] = useState<PostFormData | null>(null)
  const [keywordTags, setKeywordTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
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
      cta_type: 'none',
      cta_course_id: '',
      status: 'draft',
      published_at: '',
      tags: '',
      comments_enabled: true,
      ...initialData
    }
  })

  // Rich Text Editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.content || '',
    onUpdate: ({ editor }) => {
      form.setValue('content', editor.getHTML())
    }
  })

  // Auto-generate slug from title
  const watchTitle = form.watch('title')
  useEffect(() => {
    if (watchTitle && !initialData?.slug) {
      const slug = watchTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      form.setValue('slug', slug)
    }
  }, [watchTitle, form, initialData?.slug])

  // Real-time preview
  useEffect(() => {
    const subscription = form.watch((data) => {
      setPreviewData(data as PostFormData)
      onPreview?.(data as PostFormData)
    })
    return () => subscription.unsubscribe()
  }, [form, onPreview])

  // Keyword tags management
  const addKeywordTag = () => {
    if (tagInput.trim() && !keywordTags.includes(tagInput.trim())) {
      const newTags = [...keywordTags, tagInput.trim()]
      setKeywordTags(newTags)
      form.setValue('keywords', newTags.join(', '))
      setTagInput('')
    }
  }

  const removeKeywordTag = (tagToRemove: string) => {
    const newTags = keywordTags.filter(tag => tag !== tagToRemove)
    setKeywordTags(newTags)
    form.setValue('keywords', newTags.join(', '))
  }

  const handleSubmit = async (data: PostFormData) => {
    try {
      await onSave?.(data)
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Editor Section */}
      <div className="flex-1 lg:w-2/3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Conteúdo</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="cta">Call-to-Action</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Post</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite o título do post..." 
                          {...field}
                          maxLength={60}
                        />
                      </FormControl>
                      <div className="text-sm text-muted-foreground">
                        {field.value?.length || 0}/60 caracteres
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
                        <Input placeholder="slug-do-post" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resumo</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Breve resumo do post..."
                          {...field}
                          maxLength={160}
                          rows={3}
                        />
                      </FormControl>
                      <div className="text-sm text-muted-foreground">
                        {field.value?.length || 0}/160 caracteres
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Conteúdo do Post</Label>
                  <div className="border rounded-md p-4 min-h-[300px]">
                    <EditorContent editor={editor} className="prose max-w-none" />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="featured_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem Destacada (URL)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://exemplo.com/imagem.jpg" 
                          {...field}
                          type="url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: category.color_theme }}
                                />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-4">
                <FormField
                  control={form.control}
                  name="seo_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título SEO</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Título otimizado para SEO..." 
                          {...field}
                          maxLength={60}
                        />
                      </FormControl>
                      <div className="text-sm text-muted-foreground">
                        {field.value?.length || 0}/60 caracteres
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seo_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descrição que aparecerá nos resultados do Google..."
                          {...field}
                          maxLength={160}
                          rows={3}
                        />
                      </FormControl>
                      <div className="text-sm text-muted-foreground">
                        {field.value?.length || 0}/160 caracteres
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Palavras-chave</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite uma palavra-chave..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeywordTag())}
                    />
                    <Button type="button" onClick={addKeywordTag}>
                      Adicionar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywordTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeKeywordTag(tag)}
                          className="ml-2 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Open Graph</h3>
                  
                  <FormField
                    control={form.control}
                    name="og_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título Open Graph</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Título para redes sociais..." 
                            {...field}
                            maxLength={60}
                          />
                        </FormControl>
                        <div className="text-sm text-muted-foreground">
                          {field.value?.length || 0}/60 caracteres
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="og_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição Open Graph</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descrição para redes sociais..."
                            {...field}
                            maxLength={160}
                            rows={3}
                          />
                        </FormControl>
                        <div className="text-sm text-muted-foreground">
                          {field.value?.length || 0}/160 caracteres
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="og_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagem Open Graph (URL)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://exemplo.com/og-image.jpg" 
                            {...field}
                            type="url"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Google Preview */}
                {previewData && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Preview Google</h4>
                    <div className="space-y-1">
                      <div className="text-blue-600 text-lg">
                        {previewData.seo_title || previewData.title}
                      </div>
                      <div className="text-green-600 text-sm">
                        https://escolahabilidade.com.br/blog/{previewData.slug}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {previewData.seo_description || previewData.excerpt}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* CTA Tab */}
              <TabsContent value="cta" className="space-y-4">
                <FormField
                  control={form.control}
                  name="cta_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Call-to-Action</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de CTA" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhum</SelectItem>
                          <SelectItem value="course">Promover Curso</SelectItem>
                          <SelectItem value="contact">Contato</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('cta_type') === 'course' && (
                  <FormField
                    control={form.control}
                    name="cta_course_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Curso para Promover</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um curso" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* CTA Preview */}
                {form.watch('cta_type') !== 'none' && (
                  <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <h4 className="font-semibold mb-2">Preview do CTA</h4>
                    <div className="p-4 bg-white rounded border">
                      {form.watch('cta_type') === 'course' && (
                        <div className="text-center">
                          <h3 className="text-xl font-bold mb-2">Aprenda Mais!</h3>
                          <p className="text-gray-600 mb-4">
                            Quer se aprofundar neste assunto? Conheça nosso curso completo.
                          </p>
                          <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                            Ver Curso
                          </Button>
                        </div>
                      )}
                      {form.watch('cta_type') === 'contact' && (
                        <div className="text-center">
                          <h3 className="text-xl font-bold mb-2">Fale Conosco</h3>
                          <p className="text-gray-600 mb-4">
                            Tem dúvidas? Nossa equipe está pronta para ajudar!
                          </p>
                          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                            Entrar em Contato
                          </Button>
                        </div>
                      )}
                      {form.watch('cta_type') === 'newsletter' && (
                        <div className="text-center">
                          <h3 className="text-xl font-bold mb-2">Receba Novidades</h3>
                          <p className="text-gray-600 mb-4">
                            Assine nossa newsletter e receba conteúdo exclusivo!
                          </p>
                          <Button className="bg-gradient-to-r from-green-600 to-teal-600">
                            Assinar Newsletter
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status do Post</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                          <SelectItem value="archived">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="published_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Publicação</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags do Post</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="tag1, tag2, tag3..." 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comments_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Permitir Comentários
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Os usuários poderão comentar neste post
                        </div>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="w-4 h-4"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Post'}
              </Button>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Limpar
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Preview Section */}
      <div className="lg:w-1/3">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Preview do Post</CardTitle>
            <CardDescription>Visualização em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            {previewData ? (
              <div className="space-y-4">
                {previewData.featured_image && (
                  <img 
                    src={previewData.featured_image} 
                    alt="Featured" 
                    className="w-full h-32 object-cover rounded"
                  />
                )}
                <div>
                  <h2 className="text-xl font-bold mb-2">{previewData.title}</h2>
                  {previewData.excerpt && (
                    <p className="text-muted-foreground text-sm">{previewData.excerpt}</p>
                  )}
                </div>
                {previewData.category_id && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {categories.find(c => c.id === previewData.category_id)?.name}
                    </Badge>
                  </div>
                )}
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewData.content || '' }}
                />
              </div>
            ) : (
              <p className="text-muted-foreground">
                Comece a digitar para ver o preview...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
