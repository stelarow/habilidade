# ARQUITETURA T�CNICA - SISTEMA DE BLOG P�BLICO INTEGRADO

## Vis�o Geral da Arquitetura

Este documento define a arquitetura t�cnica para implementa��o do sistema de blog p�blico integrado entre o site principal (React/Vite) e a plataforma de ensino (Next.js/Supabase), conforme especificado no `SPEC.md`.

### Stack Tecnol�gico

**Site Principal (Frontend Blog)**
- React 19 + Vite 7
- Tailwind CSS 4
- React Router v6
- Axios para requisi��es HTTP
- React Query para cache e gerenciamento de estado server

**Plataforma de Ensino (Backend Blog)**
- Next.js 14.2.x App Router
- TypeScript
- Supabase (PostgreSQL + Storage)
- Shadcn/ui com tema violet
- Zod para valida��o
- Next.js API Routes

---

## 1. ESTRUTURA DE DIRET�RIOS

### Site Principal - Estrutura do Blog
```
src/
   components/
      blog/                    # Componentes espec�ficos do blog
         BlogCard.jsx         # Card de artigo para listagens
         BlogHeader.jsx       # Header espec�fico do blog
         BlogCTA.jsx          # Call-to-action contextual
         BlogNavigation.jsx   # Navega��o e breadcrumbs
         ShareButtons.jsx     # Bot�es de compartilhamento
         CategoryFilter.jsx   # Filtro por categorias
      shared/
          SEOHead.jsx          # Meta tags din�micas
          WhatsAppFloat.jsx    # Bot�o flutuante WhatsApp
   pages/
      blog/                    # P�ginas do blog
         BlogIndex.jsx        # Listagem principal (/blog)
         BlogPost.jsx         # Artigo individual (/blog/[slug])
         BlogCategory.jsx     # Artigos por categoria
   hooks/
      useBlogAPI.js           # Hook para comunica��o com API
      useBlogCache.js         # Gerenciamento de cache local
      useSEO.js               # Hook para meta tags din�micas
   services/
      blogAPI.js              # Servi�os de API do blog
      analyticsService.js     # Integra��o Google Analytics
   utils/
       blogHelpers.js          # Utilit�rios espec�ficos do blog
       seoUtils.js             # Utilit�rios SEO
```

### Plataforma de Ensino - Estrutura do Blog Admin
```
src/
   app/
      api/blog/               # API Routes p�blicas
         posts/
            route.ts        # GET /api/blog/posts
            [slug]/
                route.ts    # GET /api/blog/posts/[slug]
         categories/
            route.ts        # GET /api/blog/categories
         sitemap/
             route.ts        # GET /api/blog/sitemap
      admin/blog/             # Interface administrativa
          page.tsx            # Dashboard do blog
          posts/
             page.tsx        # Listagem de posts
             new/
                page.tsx    # Criar post
             [id]/
                 page.tsx    # Visualizar post
                 edit/
                     page.tsx # Editar post
          categories/
              page.tsx        # Gerenciar categorias
   components/
      admin/blog/             # Componentes admin do blog
         PostEditor.tsx      # Editor rich text/markdown
         SEOForm.tsx         # Formul�rio SEO
         PostPreview.tsx     # Preview do post
         MediaUploader.tsx   # Upload de imagens
         PublishControls.tsx # Controles de publica��o
      ui/
          [shadcn-components] # Componentes Shadcn/ui violet theme
   lib/
      blog/
         blogService.ts      # Servi�os do blog
         seoService.ts       # Servi�os SEO
         cacheService.ts     # Gerenciamento de cache
      supabase/
          blog-queries.ts     # Queries espec�ficas do blog
          blog-mutations.ts   # Mutations do blog
   types/
      blog.ts                 # Tipos TypeScript do blog
   utils/
       blogValidation.ts       # Schemas Zod
       slugGenerator.ts        # Gera��o de slugs
```

---

## 2. MODELAGEM DE DADOS SUPABASE

### Tabelas do Blog

```sql
-- Categorias do blog
CREATE TABLE blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7), -- Cor hexadecimal para UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts do blog
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  excerpt TEXT, -- Resumo para listagens
  content TEXT NOT NULL, -- Conte�do principal
  featured_image_url TEXT,
  featured_image_alt VARCHAR(200),
  
  -- SEO fields
  seo_title VARCHAR(200),
  seo_description VARCHAR(300),
  seo_keywords TEXT[],
  
  -- Open Graph / Social Media
  og_image_url TEXT,
  og_description VARCHAR(300),
  
  -- Metadata
  author_id UUID REFERENCES auth.users(id),
  category_id UUID REFERENCES blog_categories(id),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  
  -- CTA fields
  cta_course_id UUID REFERENCES courses(id), -- Refer�ncia ao curso para CTA
  cta_title VARCHAR(100),
  cta_description TEXT,
  cta_button_text VARCHAR(50),
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER, -- Calculado automaticamente
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags do blog (many-to-many com posts)
CREATE TABLE blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relacionamento posts-tags
CREATE TABLE blog_posts_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Analytics do blog
CREATE TABLE blog_post_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- �ndices para performance
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_post_views_post_id ON blog_post_views(post_id);
CREATE INDEX idx_blog_post_views_created_at ON blog_post_views(created_at);
```

### Row Level Security (RLS)

```sql
-- Habilitar RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_views ENABLE ROW LEVEL SECURITY;

-- Pol�ticas para leitura p�blica (API)
CREATE POLICY "Public can read published categories" ON blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Public can read tags" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Public can read post-tag relationships" ON blog_posts_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM blog_posts 
      WHERE id = post_id 
      AND status = 'published' 
      AND published_at <= NOW()
    )
  );

-- Pol�ticas para admins
CREATE POLICY "Admins can do everything with blog content" ON blog_categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do everything with blog posts" ON blog_posts
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do everything with tags" ON blog_tags
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Analytics podem ser inseridas por qualquer um
CREATE POLICY "Anyone can insert view analytics" ON blog_post_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read analytics" ON blog_post_views
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 3. API ROUTES (NEXT.JS)

### Estrutura dos Endpoints

#### `/api/blog/posts` - Listagem de Posts
```typescript
// src/app/api/blog/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  category: z.string().optional(),
  search: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, category, search } = querySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      category: searchParams.get('category'),
      search: searchParams.get('search')
    });

    const supabase = createClient();
    
    let query = supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image_url,
        featured_image_alt,
        published_at,
        reading_time_minutes,
        view_count,
        blog_categories!inner(name, slug, color),
        author:auth.users!blog_posts_author_id_fkey(
          raw_user_meta_data->>'full_name'
        )
      `)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (category) {
      query = query.eq('blog_categories.slug', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const offset = (page - 1) * limit;
    const { data: posts, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: count,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': process.env.MAIN_SITE_URL || '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
```

#### `/api/blog/posts/[slug]` - Post Individual
```typescript
// src/app/api/blog/posts/[slug]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createClient();
    
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories(name, slug, color),
        author:auth.users!blog_posts_author_id_fkey(
          raw_user_meta_data->>'full_name'
        ),
        cta_course:courses(title, slug, description, image_url)
      `)
      .eq('slug', params.slug)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .single();

    if (error || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Incrementar view count
    await supabase.rpc('increment_post_views', { post_id: post.id });

    return NextResponse.json({ post }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'Access-Control-Allow-Origin': process.env.MAIN_SITE_URL || '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
```

---

## 4. COMPONENTES UI COM SHADCN/UI (TEMA VIOLET)

### Configura��o do Tema Violet

#### `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))', // Violet theme
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
```

#### `src/app/globals.css` (Tema Violet)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    --primary: 262.1 83.3% 57.8%; /* Violet primary */
    --primary-foreground: 210 20% 98%;
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 262.1 83.3% 57.8%; /* Violet ring */
    --radius: 0.5rem;
  }

  .dark {
    --background: 224 71.4% 4.1%;
    --foreground: 210 20% 98%;
    --card: 224 71.4% 4.1%;
    --card-foreground: 210 20% 98%;
    --popover: 224 71.4% 4.1%;
    --popover-foreground: 210 20% 98%;
    --primary: 263.4 70% 50.4%; /* Violet primary dark */
    --primary-foreground: 210 20% 98%;
    --secondary: 215 27.9% 16.9%;
    --secondary-foreground: 210 20% 98%;
    --muted: 215 27.9% 16.9%;
    --muted-foreground: 217.9 10.6% 64.9%;
    --accent: 215 27.9% 16.9%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    --border: 215 27.9% 16.9%;
    --input: 215 27.9% 16.9%;
    --ring: 263.4 70% 50.4%; /* Violet ring dark */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Componentes Shadcn/ui a Utilizar

#### Para o Admin do Blog
```bash
# Comandos para instalar componentes necess�rios
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
npx shadcn-ui@latest add label
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add skeleton
```

#### Componente Editor de Post
```typescript
// src/components/admin/blog/PostEditor.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogPostSchema } from '@/utils/blogValidation';

interface PostEditorProps {
  post?: BlogPost;
  categories: BlogCategory[];
  courses: Course[];
  onSave: (data: BlogPostFormData) => Promise<void>;
  onPublish: (data: BlogPostFormData) => Promise<void>;
}

export function PostEditor({ post, categories, courses, onSave, onPublish }: PostEditorProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      categoryId: post?.category_id || '',
      seoTitle: post?.seo_title || '',
      seoDescription: post?.seo_description || '',
      ctaCourseId: post?.cta_course_id || '',
      ctaTitle: post?.cta_title || '',
      ctaDescription: post?.cta_description || '',
      status: post?.status || 'draft'
    }
  });

  const handleSave = async (data: BlogPostFormData) => {
    setIsSaving(true);
    try {
      await onSave(data);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async (data: BlogPostFormData) => {
    setIsPublishing(true);
    try {
      await onPublish({ ...data, status: 'published' });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">
          {post ? 'Editar Post' : 'Novo Post'}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={form.handleSubmit(handleSave)}
            disabled={isSaving || isPublishing}
          >
            {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>
          <Button
            onClick={form.handleSubmit(handlePublish)}
            disabled={isSaving || isPublishing}
            className="bg-primary hover:bg-primary/90"
          >
            {isPublishing ? 'Publicando...' : 'Publicar'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Conte�do</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="cta">Call-to-Action</TabsTrigger>
          <TabsTrigger value="settings">Configura��es</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conte�do Principal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">T�tulo</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  placeholder="T�tulo do post"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  {...form.register('slug')}
                  placeholder="url-amigavel-do-post"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  {...form.register('excerpt')}
                  placeholder="Breve descri��o para aparecer nas listagens"
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="content">Conte�do</Label>
                <Textarea
                  id="content"
                  {...form.register('content')}
                  placeholder="Conte�do completo do post (Markdown suportado)"
                  className="mt-1 min-h-[400px]"
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={form.watch('categoryId')}
                  onValueChange={(value) => form.setValue('categoryId', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Otimiza��o SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">T�tulo SEO</Label>
                <Input
                  id="seoTitle"
                  {...form.register('seoTitle')}
                  placeholder="T�tulo otimizado para motores de busca"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  M�ximo 60 caracteres recomendado
                </p>
              </div>

              <div>
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  {...form.register('seoDescription')}
                  placeholder="Descri��o que aparecer� nos resultados de busca"
                  className="mt-1 min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  M�ximo 160 caracteres recomendado
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call-to-Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ctaCourse">Curso Relacionado</Label>
                <Select
                  value={form.watch('ctaCourseId')}
                  onValueChange={(value) => form.setValue('ctaCourseId', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione um curso (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum curso espec�fico</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ctaTitle">T�tulo do CTA</Label>
                <Input
                  id="ctaTitle"
                  {...form.register('ctaTitle')}
                  placeholder="Quer aprender mais sobre este assunto?"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="ctaDescription">Descri��o do CTA</Label>
                <Textarea
                  id="ctaDescription"
                  {...form.register('ctaDescription')}
                  placeholder="Descri��o motivacional para convers�o"
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configura��es</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={form.watch('status') === 'published'}
                  onCheckedChange={(checked) => 
                    form.setValue('status', checked ? 'published' : 'draft')
                  }
                />
                <Label htmlFor="published">Publicado</Label>
              </div>

              {post && (
                <div className="pt-4">
                  <Separator className="mb-4" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Criado em:</Label>
                      <p>{new Date(post.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">�ltima atualiza��o:</Label>
                      <p>{new Date(post.updated_at).toLocaleString('pt-BR')}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Visualiza��es:</Label>
                      <p>{post.view_count}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Tempo de leitura:</Label>
                      <p>{post.reading_time_minutes} minutos</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 5. GERENCIAMENTO DE ESTADO

### Frontend (Site Principal)

#### React Query para Cache e Estado Server
```javascript
// src/hooks/useBlogAPI.js
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { blogAPI } from '../services/blogAPI';

export const useBlogPosts = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: ['blog-posts', filters],
    queryFn: ({ pageParam = 1 }) => 
      blogAPI.getPosts({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => 
      lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useBlogPost = (slug) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blogAPI.getPost(slug),
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 2 * 60 * 60 * 1000, // 2 horas
    enabled: !!slug,
  });
};

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: blogAPI.getCategories,
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 24 * 60 * 60 * 1000, // 24 horas
  });
};
```

### Backend (Plataforma)

#### Zustand para Estado da Interface Admin
```typescript
// src/lib/stores/blogStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BlogState {
  posts: BlogPost[];
  categories: BlogCategory[];
  currentPost: BlogPost | null;
  filters: BlogFilters;
  isLoading: boolean;
  error: string | null;
}

interface BlogActions {
  setPosts: (posts: BlogPost[]) => void;
  setCategories: (categories: BlogCategory[]) => void;
  setCurrentPost: (post: BlogPost | null) => void;
  updatePost: (postId: string, updates: Partial<BlogPost>) => void;
  deletePost: (postId: string) => void;
  setFilters: (filters: Partial<BlogFilters>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBlogStore = create<BlogState & BlogActions>()(
  devtools(
    (set, get) => ({
      // State
      posts: [],
      categories: [],
      currentPost: null,
      filters: {
        status: 'all',
        category: null,
        search: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
      },
      isLoading: false,
      error: null,

      // Actions
      setPosts: (posts) => set({ posts }),
      setCategories: (categories) => set({ categories }),
      setCurrentPost: (post) => set({ currentPost: post }),
      
      updatePost: (postId, updates) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, ...updates } : post
          ),
        })),
      
      deletePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
        })),
      
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'blog-store',
    }
  )
);
```

---

## 6. FLUXO DE DADOS

### Arquitetura de Integra��o

```
                         HTTP API                         
   Site Principal    �              � Plataforma Ensino   
   (React + Vite)       CORS/JSON      (Next.js + API)    
                                                          
                                                  
           �                                       �
                                                          
   React Query                            Supabase        
   Cache Local                          PostgreSQL        
                                                          
```

### Fluxo de Leitura (Site Principal � API)

1. **Componente Blog** solicita dados via React Query
2. **React Query** verifica cache local primeiro
3. Se n�o houver cache, faz requisi��o HTTP para API
4. **Next.js API Route** recebe requisi��o
5. **Supabase Client** executa query no PostgreSQL
6. **RLS Policies** filtram apenas conte�do publicado
7. **Response** retorna com headers de cache
8. **React Query** armazena no cache e retorna dados
9. **Componente** renderiza com dados

### Fluxo de Escrita (Admin � Banco)

1. **Admin Interface** (Shadcn/ui) coleta dados do formul�rio
2. **Zod Schema** valida dados antes do envio
3. **Form Handler** processa e envia para API interna
4. **Next.js API Route** recebe dados autenticados
5. **Supabase Client** executa insert/update
6. **Database Triggers** calculam reading_time, geram slug
7. **RLS Policies** verificam permiss�es de admin
8. **Response** confirma opera��o
9. **Zustand Store** atualiza estado local
10. **Cache Invalidation** limpa cache relacionado

---

## 7. AUTENTICA��O E SEGURAN�A

### Middleware de Prote��o
```typescript
// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Verificar autentica��o para rotas admin
  if (req.nextUrl.pathname.startsWith('/admin/blog')) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Verificar se � admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Rate limiting para API p�blica
  if (req.nextUrl.pathname.startsWith('/api/blog')) {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    
    // Implementar rate limiting baseado em IP
    // (usar Redis ou similar em produ��o)
    const rateLimitKey = `rate_limit:${ip}`;
    // ... l�gica de rate limiting
  }

  return res;
}

export const config = {
  matcher: ['/admin/blog/:path*', '/api/blog/:path*'],
};
```

### Valida��o com Zod
```typescript
// src/utils/blogValidation.ts
import { z } from 'zod';

export const blogPostSchema = z.object({
  title: z.string().min(1, 'T�tulo � obrigat�rio').max(200, 'T�tulo muito longo'),
  slug: z.string().min(1, 'Slug � obrigat�rio').max(200, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras min�sculas, n�meros e h�fens'),
  excerpt: z.string().max(500, 'Resumo muito longo').optional(),
  content: z.string().min(1, 'Conte�do � obrigat�rio'),
  categoryId: z.string().uuid('Categoria inv�lida'),
  seoTitle: z.string().max(200, 'T�tulo SEO muito longo').optional(),
  seoDescription: z.string().max(300, 'Meta description muito longa').optional(),
  seoKeywords: z.array(z.string()).max(10, 'M�ximo 10 palavras-chave').optional(),
  ctaCourseId: z.string().uuid().optional(),
  ctaTitle: z.string().max(100, 'T�tulo CTA muito longo').optional(),
  ctaDescription: z.string().max(300, 'Descri��o CTA muito longa').optional(),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']),
  scheduledFor: z.date().optional(),
  featuredImageUrl: z.string().url('URL de imagem inv�lida').optional(),
  featuredImageAlt: z.string().max(200, 'Alt text muito longo').optional(),
});

export const blogCategorySchema = z.object({
  name: z.string().min(1, 'Nome � obrigat�rio').max(100, 'Nome muito longo'),
  slug: z.string().min(1, 'Slug � obrigat�rio').max(100, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras min�sculas, n�meros e h�fens'),
  description: z.string().max(500, 'Descri��o muito longa').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um hexadecimal v�lido').optional(),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;
export type BlogCategoryFormData = z.infer<typeof blogCategorySchema>;
```

---

## 8. INSTRU��ES MCP SHADCN/UI COM TEMA VIOLET

### Configura��o Inicial

Para utilizar o MCP Shadcn/ui com o tema violet na implementa��o:

1. **Inicializa��o do Shadcn/ui**:
```bash
# No diret�rio da plataforma de ensino
cd plataforma-ensino
npx shadcn-ui@latest init
# Quando perguntado sobre o tema, selecionar: "violet"
# Configurar com TypeScript: Yes
# Tailwind CSS: Yes
# CSS variables: Yes
# Path aliases: Yes (@/*)
```

2. **Instala��o de Componentes via MCP**:
```bash
# Use o MCP Shadcn atrav�s do Claude Code para instalar componentes
# Execute estes comandos na plataforma de ensino:
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
npx shadcn-ui@latest add label
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add skeleton
```

3. **Verifica��o da Configura��o do Tema**:
```typescript
// Verificar se o components.json est� configurado corretamente
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "violet", // Importante: tema violet
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

4. **Customiza��o do Tema Violet**:
```css
/* src/app/globals.css - Vari�veis CSS do tema violet */
:root {
  --primary: 262.1 83.3% 57.8%; /* Violet */
  --primary-foreground: 210 20% 98%;
  --ring: 262.1 83.3% 57.8%; /* Violet ring */
}

.dark {
  --primary: 263.4 70% 50.4%; /* Violet dark */
  --ring: 263.4 70% 50.4%; /* Violet ring dark */
}
```

### Uso nos Componentes do Blog

#### 1. PostEditor com Tema Violet
```tsx
// src/components/admin/blog/PostEditor.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Os componentes automaticamente usar�o as cores violet definidas
<Button className="bg-primary hover:bg-primary/90">
  Publicar Post
</Button>

<Card className="border-primary/20">
  <CardHeader>
    <CardTitle className="text-primary">
      Editor de Post
    </CardTitle>
  </CardHeader>
</Card>
```

#### 2. Dashboard com M�tricas Violet
```tsx
// src/components/admin/blog/BlogDashboard.tsx
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

<Badge variant="outline" className="text-primary border-primary">
  Sistema Online
</Badge>

<Progress 
  value={85} 
  className="[&>div]:bg-primary" // Override para cor violet
/>
```

#### 3. Formul�rios com Valida��o Violet
```tsx
// src/components/admin/blog/CategoryForm.tsx
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Focus ring ser� violet automaticamente
<Input 
  className="focus:ring-primary focus:border-primary"
  placeholder="Nome da categoria"
/>

<Select>
  <SelectTrigger className="focus:ring-primary">
    <SelectValue placeholder="Selecione..." />
  </SelectTrigger>
</Select>
```

### Personaliza��o Avan�ada do Tema

#### 1. Cores Customizadas para Blog
```css
/* src/app/globals.css - Extens�es para o blog */
@layer base {
  :root {
    /* Blog specific colors */
    --blog-accent: 280 100% 70%;
    --blog-muted: 262 30% 95%;
    --blog-border: 262 20% 90%;
  }
  
  .dark {
    --blog-accent: 280 60% 60%;
    --blog-muted: 262 15% 15%;
    --blog-border: 262 20% 20%;
  }
}

/* Classes utilit�rias para o blog */
.blog-gradient {
  @apply bg-gradient-to-r from-primary via-blog-accent to-primary;
}

.blog-card {
  @apply border-blog-border bg-card hover:border-primary/50 transition-colors;
}
```

#### 2. Componentes Customizados
```tsx
// src/components/ui/blog-button.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BlogButtonProps extends React.ComponentProps<typeof Button> {
  variant?: 'default' | 'cta' | 'outline';
}

export function BlogButton({ className, variant = 'default', ...props }: BlogButtonProps) {
  return (
    <Button
      className={cn(
        'transition-all duration-200',
        variant === 'cta' && 'blog-gradient text-white shadow-lg hover:shadow-xl hover:scale-105',
        variant === 'outline' && 'border-primary text-primary hover:bg-primary/10',
        className
      )}
      {...props}
    />
  );
}
```

### Integra��o com o Design System Existente

#### 1. Cores da Escola Habilidade
```css
/* Mapeamento das cores existentes para o tema violet */
:root {
  /* Cores originais da Escola Habilidade */
  --habilidade-primary: #d400ff; /* Roxo principal */
  --habilidade-secondary: #00c4ff; /* Azul secund�rio */
  --habilidade-accent: #a000ff; /* Roxo accent */
  
  /* Mapeamento para Shadcn Violet */
  --primary: 288 100% 50%; /* Equivale ao #d400ff */
  --secondary: 195 100% 50%; /* Para elementos secund�rios */
  --accent: 270 100% 50%; /* Para destaques */
}
```

#### 2. Componente de Transi��o
```tsx
// src/components/ui/habilidade-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HabilidadeCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass';
}

export function HabilidadeCard({ children, className, variant = 'default' }: HabilidadeCardProps) {
  return (
    <Card className={cn(
      'transition-all duration-300',
      variant === 'gradient' && 'blog-gradient text-white border-none',
      variant === 'glass' && 'bg-background/80 backdrop-blur-sm border-primary/20',
      'hover:shadow-lg hover:shadow-primary/20',
      className
    )}>
      {children}
    </Card>
  );
}
```

### Comandos de Instala��o Espec�ficos

#### Para o Sistema de Blog Completo
```bash
# 1. Instalar todos os componentes necess�rios
npx shadcn-ui@latest add button input textarea card badge select dialog dropdown-menu form label switch tabs toast alert progress calendar popover separator sheet skeleton

# 2. Instalar componentes adicionais para funcionalidades avan�adas
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add command
npx shadcn-ui@latest add context-menu
npx shadcn-ui@latest add hover-card
npx shadcn-ui@latest add menubar
npx shadcn-ui@latest add navigation-menu
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add table
npx shadcn-ui@latest add toggle
npx shadcn-ui@latest add tooltip
```

### Valida��o da Configura��o

#### Script de Teste
```tsx
// src/components/test/ThemeTest.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function ThemeTest() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Teste do Tema Violet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Componentes B�sicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button>Bot�o Padr�o</Button>
            <Button variant="outline">Bot�o Outline</Button>
            <Button variant="secondary">Bot�o Secund�rio</Button>
            <Badge>Badge Padr�o</Badge>
            <Badge variant="outline">Badge Outline</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Progresso e Estados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={75} />
            <Badge className="bg-primary">Status Ativo</Badge>
            <div className="p-4 border border-primary/20 rounded-lg">
              <p className="text-primary">Texto em cor prim�ria</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

Este documento de arquitetura fornece uma base s�lida para implementa��o do sistema de blog integrado, mantendo as melhores pr�ticas de Next.js, Supabase, Tailwind CSS e Shadcn/ui com tema violet, al�m de instru��es detalhadas para utiliza��o do MCP Shadcn/ui.