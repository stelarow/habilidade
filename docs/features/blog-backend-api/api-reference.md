# API Reference - Blog Backend API

## Base URL e Autenticação

### URLs de Base
- **Produção**: `https://plataforma.escolahabilidade.com/api/blog`
- **Desenvolvimento**: `http://localhost:3000/api/blog`

### Autenticação
Todos os endpoints são **públicos** e não requerem autenticação. Apenas conteúdo publicado é acessível.

### Headers Recomendados
```http
Content-Type: application/json
Accept: application/json
```

## Rate Limiting

### Limites
- **60 requests por minuto** por endereço IP
- Janela deslizante de 60 segundos
- Reset automático a cada minuto

### Headers de Response
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1706453400
Retry-After: 30
```

### Exemplo de Rate Limit Exceeded
```http
HTTP/1.1 429 Too Many Requests
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests, please try again later",
  "code": 429,
  "timestamp": "2025-01-29T10:30:00.000Z",
  "retry_after": 30
}
```

## Endpoints

### 1. GET /api/blog/posts

Lista posts do blog com paginação e filtros avançados.

#### Parâmetros de Query

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| `page` | integer | Não | 1 | Número da página (min: 1) |
| `limit` | integer | Não | 10 | Posts por página (min: 1, max: 50) |
| `category` | string | Não | - | Slug da categoria para filtro |
| `search` | string | Não | - | Busca em título, excerpt e conteúdo |
| `sort` | enum | Não | newest | Ordenação: `newest`, `oldest`, `popular`, `title` |

#### Exemplo de Request
```bash
curl -X GET \
  "https://plataforma.escolahabilidade.com/api/blog/posts?page=1&limit=5&category=design&sort=popular" \
  -H "Content-Type: application/json"
```

#### Exemplo de Response (200 OK)
```json
{
  "posts": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Como Aprender Design Gráfico em 2025",
      "slug": "como-aprender-design-grafico-2025",
      "excerpt": "Descubra as melhores práticas e ferramentas modernas para iniciar sua jornada no design gráfico...",
      "content": "# Como Aprender Design Gráfico em 2025\n\nO design gráfico continua sendo uma das áreas mais demandadas...",
      "status": "published",
      "featured_image": "https://projeto.supabase.co/storage/v1/object/public/blog-media/uploads/1706453400-abc123.jpg",
      "seo_title": "Como Aprender Design Gráfico em 2025 - Guia Completo",
      "seo_description": "Guia completo para iniciantes em design gráfico com as melhores práticas, ferramentas e recursos atualizados para 2025.",
      "author_id": "123e4567-e89b-12d3-a456-426614174000",
      "category_id": "789e0123-e89b-12d3-a456-426614174000",
      "view_count": 347,
      "created_at": "2025-01-20T10:00:00.000Z",
      "updated_at": "2025-01-28T15:30:00.000Z",
      "published_at": "2025-01-22T09:00:00.000Z",
      "author": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "full_name": "João Silva",
        "avatar_url": "https://projeto.supabase.co/storage/v1/object/public/avatars/joao-silva.jpg"
      },
      "category": {
        "id": "789e0123-e89b-12d3-a456-426614174000",
        "name": "Design",
        "slug": "design",
        "color_theme": "#00c4ff"
      },
      "course_cta": {
        "course_id": "456e7890-e89b-12d3-a456-426614174000",
        "course_name": "Design Gráfico Profissional",
        "course_slug": "design-grafico-profissional"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 7,
    "total_posts": 35,
    "per_page": 5,
    "has_next": true,
    "has_prev": false
  },
  "meta": {
    "total_published": 35,
    "categories": [
      {
        "id": "789e0123-e89b-12d3-a456-426614174000",
        "name": "Design",
        "slug": "design",
        "description": "Dicas e tendências de design",
        "color_theme": "#00c4ff",
        "post_count": 12
      },
      {
        "id": "234e5678-e89b-12d3-a456-426614174000",
        "name": "Tecnologia",
        "slug": "tecnologia", 
        "description": "Artigos sobre tecnologia e inovação",
        "color_theme": "#d400ff",
        "post_count": 18
      }
    ]
  }
}
```

#### Cache Headers
```http
Cache-Control: s-maxage=300, stale-while-revalidate=600
CDN-Cache-Control: max-age=300
```

#### Possíveis Erros
```json
// 400 - Parâmetros inválidos
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid query parameters provided",
  "code": 400,
  "timestamp": "2025-01-29T10:30:00.000Z",
  "request_id": "abc123def"
}

// 503 - Erro de banco de dados
{
  "error": "DATABASE_ERROR",
  "message": "Unable to connect to database",
  "code": 503,
  "timestamp": "2025-01-29T10:30:00.000Z",
  "request_id": "abc123def"
}
```

### 2. GET /api/blog/posts/[slug]

Retorna um post específico pelo slug, incluindo posts relacionados e navegação.

#### Parâmetros de Path

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `slug` | string | Sim | Slug único do post (formato: `como-aprender-design`) |

#### Exemplo de Request
```bash
curl -X GET \
  "https://plataforma.escolahabilidade.com/api/blog/posts/como-aprender-design-grafico-2025" \
  -H "Content-Type: application/json"
```

#### Exemplo de Response (200 OK)
```json
{
  "post": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Como Aprender Design Gráfico em 2025",
    "slug": "como-aprender-design-grafico-2025",
    "excerpt": "Descubra as melhores práticas e ferramentas modernas...",
    "content": "# Como Aprender Design Gráfico em 2025\n\nO design gráfico continua sendo uma das áreas mais demandadas no mercado atual. Com o avanço das tecnologias digitais e a crescente importância da presença online, profissionais de design têm oportunidades sem precedentes...\n\n## Ferramentas Essenciais\n\n### Adobe Creative Suite\n- **Photoshop**: Para edição de imagens e manipulação fotográfica\n- **Illustrator**: Para criação de vetores e logotipos\n- **InDesign**: Para diagramação e layouts complexos\n\n### Alternativas Gratuitas\n- **GIMP**: Alternative ao Photoshop\n- **Inkscape**: Para design vetorial\n- **Canva**: Para designs rápidos e templates\n\n## Princípios Fundamentais\n\n1. **Hierarquia Visual**: Organize elementos por ordem de importância\n2. **Contraste**: Use diferenças para destacar informações\n3. **Alinhamento**: Mantenha consistência e organização\n4. **Repetição**: Crie padrões visuais coesos\n5. **Proximidade**: Agrupe elementos relacionados\n\n## Construindo um Portfólio\n\n### Projetos Essenciais\n- Identidade visual completa\n- Material gráfico impresso\n- Design digital (web/mobile)\n- Ilustrações originais\n- Projetos de branding\n\n### Plataformas Recomendadas\n- Behance\n- Dribbble\n- Portfolio pessoal\n- Instagram\n\n## Mercado de Trabalho\n\nO mercado de design gráfico oferece diversas oportunidades:\n\n- **Agências de Publicidade**: Ambiente dinâmico e projetos variados\n- **Freelancing**: Flexibilidade e variedade de clientes\n- **In-house**: Especialização em uma marca específica\n- **Design Digital**: Foco em UI/UX e produtos digitais\n\n## Conclusão\n\nAprender design gráfico em 2025 requer dedicação, prática constante e atualização contínua. Com as ferramentas certas e uma abordagem estruturada, é possível desenvolver habilidades sólidas e construir uma carreira bem-sucedida na área.",
    "status": "published",
    "featured_image": "https://projeto.supabase.co/storage/v1/object/public/blog-media/uploads/1706453400-abc123.jpg",
    "seo_title": "Como Aprender Design Gráfico em 2025 - Guia Completo",
    "seo_description": "Guia completo para iniciantes em design gráfico com as melhores práticas, ferramentas e recursos atualizados para 2025.",
    "author_id": "123e4567-e89b-12d3-a456-426614174000",
    "category_id": "789e0123-e89b-12d3-a456-426614174000",
    "view_count": 348,
    "created_at": "2025-01-20T10:00:00.000Z",
    "updated_at": "2025-01-28T15:30:00.000Z",
    "published_at": "2025-01-22T09:00:00.000Z",
    "author": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "full_name": "João Silva",
      "avatar_url": "https://projeto.supabase.co/storage/v1/object/public/avatars/joao-silva.jpg"
    },
    "category": {
      "id": "789e0123-e89b-12d3-a456-426614174000",
      "name": "Design",
      "slug": "design",
      "color_theme": "#00c4ff"
    },
    "course_cta": {
      "course_id": "456e7890-e89b-12d3-a456-426614174000",
      "course_name": "Design Gráfico Profissional",
      "course_slug": "design-grafico-profissional"
    }
  },
  "meta": {
    "related_posts": [
      {
        "id": "661e9511-e29b-41d4-a716-446655440001",
        "title": "Tendências de Design para 2025",
        "slug": "tendencias-design-2025",
        "excerpt": "Descubra as principais tendências visuais que marcarão o ano de 2025...",
        "featured_image": "https://projeto.supabase.co/storage/v1/object/public/blog-media/uploads/1706453500-def456.jpg",
        "published_at": "2025-01-25T10:00:00.000Z",
        "view_count": 203,
        "author": {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "full_name": "João Silva",
          "avatar_url": "https://projeto.supabase.co/storage/v1/object/public/avatars/joao-silva.jpg"
        },
        "category": {
          "id": "789e0123-e89b-12d3-a456-426614174000",
          "name": "Design",
          "slug": "design",
          "color_theme": "#00c4ff"
        }
      },
      {
        "id": "772ea622-e29b-41d4-a716-446655440002",
        "title": "Ferramentas Gratuitas para Designers",
        "slug": "ferramentas-gratuitas-designers",
        "excerpt": "Uma lista completa de ferramentas gratuitas para designers iniciantes...",
        "featured_image": "https://projeto.supabase.co/storage/v1/object/public/blog-media/uploads/1706453600-ghi789.jpg",
        "published_at": "2025-01-18T14:00:00.000Z",
        "view_count": 156,
        "author": {
          "id": "234e5678-e89b-12d3-a456-426614174001",
          "full_name": "Maria Santos",
          "avatar_url": "https://projeto.supabase.co/storage/v1/object/public/avatars/maria-santos.jpg"
        },
        "category": {
          "id": "789e0123-e89b-12d3-a456-426614174000",
          "name": "Design",
          "slug": "design",
          "color_theme": "#00c4ff"
        }
      }
    ],
    "next_post": {
      "id": "883eb733-e29b-41d4-a716-446655440003",
      "title": "UI/UX Design: Diferenças e Aplicações",
      "slug": "ui-ux-design-diferencas-aplicacoes",
      "excerpt": "Entenda as principais diferenças entre UI e UX Design e como aplicar cada conceito...",
      "featured_image": "https://projeto.supabase.co/storage/v1/object/public/blog-media/uploads/1706453700-jkl012.jpg",
      "published_at": "2025-01-26T09:00:00.000Z",
      "view_count": 89
    },
    "prev_post": {
      "id": "994ec844-e29b-41d4-a716-446655440004",
      "title": "História do Design Gráfico",
      "slug": "historia-design-grafico",
      "excerpt": "Uma jornada através da evolução do design gráfico desde suas origens...",
      "featured_image": "https://projeto.supabase.co/storage/v1/object/public/blog-media/uploads/1706453300-mno345.jpg",
      "published_at": "2025-01-19T16:00:00.000Z",
      "view_count": 134
    }
  }
}
```

#### Funcionalidades Especiais
- **View Count**: Incrementado automaticamente a cada visualização (assíncrono)
- **Related Posts**: Até 3 posts da mesma categoria, ordenados por data
- **Navigation**: Posts cronologicamente adjacentes para navegação

#### Cache Headers
```http
Cache-Control: s-maxage=3600, stale-while-revalidate=7200
CDN-Cache-Control: max-age=3600
```

#### Possíveis Erros
```json
// 404 - Post não encontrado
{
  "error": "POST_NOT_FOUND",
  "message": "Blog post with slug \"post-inexistente\" not found",
  "code": 404,
  "timestamp": "2025-01-29T10:30:00.000Z",
  "request_id": "abc123def"
}

// 400 - Slug inválido
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid slug parameter provided",
  "code": 400,
  "timestamp": "2025-01-29T10:30:00.000Z",
  "request_id": "abc123def"
}
```

### 3. GET /api/blog/categories

Lista todas as categorias de blog com contagem de posts.

#### Exemplo de Request
```bash
curl -X GET \
  "https://plataforma.escolahabilidade.com/api/blog/categories" \
  -H "Content-Type: application/json"
```

#### Exemplo de Response (200 OK)
```json
{
  "categories": [
    {
      "id": "234e5678-e89b-12d3-a456-426614174000",
      "name": "Carreira",
      "slug": "carreira",
      "description": "Desenvolvimento profissional e carreira",
      "color_theme": "#ff6600",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z",
      "post_count": 8
    },
    {
      "id": "789e0123-e89b-12d3-a456-426614174000",
      "name": "Design",
      "slug": "design",
      "description": "Dicas e tendências de design",
      "color_theme": "#00c4ff",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z",
      "post_count": 12
    },
    {
      "id": "345e6789-e89b-12d3-a456-426614174000",
      "name": "Educação",
      "slug": "educacao",
      "description": "Conteúdo educacional e metodologias",
      "color_theme": "#a000ff",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z",
      "post_count": 6
    },
    {
      "id": "456e7890-e89b-12d3-a456-426614174000",
      "name": "Mercado",
      "slug": "mercado",
      "description": "Análises e tendências de mercado",
      "color_theme": "#00ff88",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z",
      "post_count": 4
    },
    {
      "id": "567e8901-e89b-12d3-a456-426614174000",
      "name": "Tecnologia",
      "slug": "tecnologia",
      "description": "Artigos sobre tecnologia e inovação",
      "color_theme": "#d400ff",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z",
      "post_count": 18
    }
  ],
  "meta": {
    "total_categories": 5,
    "total_posts": 48
  }
}
```

#### Características
- **Ordenação**: Alfabética por nome da categoria
- **Post Count**: Apenas posts publicados são contabilizados
- **Cores**: Cada categoria tem uma cor tema configurável

#### Cache Headers
```http
Cache-Control: s-maxage=1800, stale-while-revalidate=3600
CDN-Cache-Control: max-age=1800
```

### 4. GET /api/blog/sitemap

Gera um sitemap XML para SEO com todos os posts publicados.

#### Exemplo de Request
```bash
curl -X GET \
  "https://plataforma.escolahabilidade.com/api/blog/sitemap" \
  -H "Accept: application/xml"
```

#### Exemplo de Response (200 OK)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.escolahabilidade.com.br/blog</loc>
    <lastmod>2025-01-29T10:30:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.escolahabilidade.com.br/blog/como-aprender-design-grafico-2025</loc>
    <lastmod>2025-01-28T15:30:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.escolahabilidade.com.br/blog/tendencias-design-2025</loc>
    <lastmod>2025-01-25T10:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.escolahabilidade.com.br/blog/ferramentas-gratuitas-designers</loc>
    <lastmod>2025-01-18T14:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

#### Características
- **Base URL**: Configurável via `NEXT_PUBLIC_SITE_URL`
- **Last Modified**: Usa `updated_at` ou `published_at` (o mais recente)
- **Encoding**: UTF-8 com caracteres especiais escapados
- **Only Published**: Apenas posts com status `published`

#### Cache Headers
```http
Cache-Control: s-maxage=3600, stale-while-revalidate=7200
Content-Type: application/xml; charset=utf-8
```

## OPTIONS Requests (CORS)

Todos os endpoints suportam requests OPTIONS para CORS preflight.

#### Exemplo de Request
```bash
curl -X OPTIONS \
  "https://plataforma.escolahabilidade.com/api/blog/posts" \
  -H "Origin: https://www.escolahabilidade.com.br" \
  -H "Access-Control-Request-Method: GET"
```

#### Exemplo de Response (200 OK)
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://www.escolahabilidade.com.br
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

## Códigos de Status HTTP

### 2xx Success
- `200 OK`: Request processado com sucesso
- `200 OK` (OPTIONS): CORS preflight bem-sucedido

### 4xx Client Errors
- `400 Bad Request`: Parâmetros de query inválidos
- `404 Not Found`: Post/recurso não encontrado
- `429 Too Many Requests`: Rate limit excedido

### 5xx Server Errors
- `500 Internal Server Error`: Erro interno do servidor
- `503 Service Unavailable`: Banco de dados indisponível

## Esquemas de Dados

### BlogPost
```typescript
{
  id: string                    // UUID do post
  title: string                 // Título do post
  slug: string                  // Slug único para URL
  excerpt: string               // Resumo/descrição breve
  content: string               // Conteúdo completo (Markdown)
  status: 'published'           // Status (apenas published na API)
  featured_image?: string       // URL da imagem destacada
  seo_title?: string           // Título otimizado para SEO
  seo_description?: string     // Descrição otimizada para SEO
  author_id: string            // UUID do autor
  category_id: string          // UUID da categoria
  view_count: number           // Número de visualizações
  created_at: string           // ISO timestamp de criação
  updated_at: string           // ISO timestamp de atualização
  published_at: string         // ISO timestamp de publicação
  
  // Relacionamentos
  author?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  category?: {
    id: string
    name: string
    slug: string
    color_theme: string
  }
  course_cta?: {
    course_id: string
    course_name: string
    course_slug: string
  }
}
```

### BlogCategory
```typescript
{
  id: string                    // UUID da categoria
  name: string                  // Nome da categoria
  slug: string                  // Slug único para URL
  description?: string          // Descrição da categoria
  color_theme: string          // Cor tema (hex: #ff0000)
  created_at: string           // ISO timestamp de criação
  updated_at: string           // ISO timestamp de atualização
  post_count?: number          // Número de posts (apenas published)
}
```

### Pagination
```typescript
{
  current_page: number         // Página atual
  total_pages: number          // Total de páginas
  total_posts: number          // Total de posts
  per_page: number             // Posts por página
  has_next: boolean            // Tem próxima página
  has_prev: boolean            // Tem página anterior
}
```

### APIError
```typescript
{
  error: string                // Código do erro (VALIDATION_ERROR, etc.)
  message: string              // Mensagem legível
  code: number                 // Código HTTP
  timestamp: string            // ISO timestamp do erro
  request_id?: string          // ID único da request
}
```

## Exemplos de Integração

### JavaScript/Fetch API
```javascript
class BlogAPI {
  constructor(baseUrl = 'https://plataforma.escolahabilidade.com/api/blog') {
    this.baseUrl = baseUrl
  }
  
  async getPosts(options = {}) {
    const params = new URLSearchParams({
      page: options.page || 1,
      limit: options.limit || 10,
      ...(options.category && { category: options.category }),
      ...(options.search && { search: options.search }),
      ...(options.sort && { sort: options.sort })
    })
    
    const response = await fetch(`${this.baseUrl}/posts?${params}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch posts')
    }
    
    return await response.json()
  }
  
  async getPost(slug) {
    const response = await fetch(`${this.baseUrl}/posts/${slug}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Post not found')
      }
      throw new Error('Failed to fetch post')
    }
    
    return await response.json()
  }
  
  async getCategories() {
    const response = await fetch(`${this.baseUrl}/categories`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    
    return await response.json()
  }
}

// Uso
const blogAPI = new BlogAPI()

try {
  const { posts, pagination, meta } = await blogAPI.getPosts({
    page: 1,
    limit: 10,
    category: 'design',
    sort: 'popular'
  })
  
  console.log(`Showing ${posts.length} of ${pagination.total_posts} posts`)
  posts.forEach(post => {
    console.log(`${post.title} (${post.view_count} views)`)
  })
} catch (error) {
  console.error('Error:', error.message)
}
```

### React Hook
```javascript
import { useState, useEffect } from 'react'

function useBlogPosts(options = {}) {
  const [posts, setPosts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams({
          page: options.page || 1,
          limit: options.limit || 10,
          ...(options.category && { category: options.category }),
          ...(options.search && { search: options.search }),
          ...(options.sort && { sort: options.sort })
        })
        
        const response = await fetch(
          `https://plataforma.escolahabilidade.com/api/blog/posts?${params}`
        )
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const data = await response.json()
        setPosts(data.posts)
        setPagination(data.pagination)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [options.page, options.category, options.search, options.sort])
  
  return { posts, pagination, loading, error }
}

// Uso no componente
function BlogList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  
  const { posts, pagination, loading, error } = useBlogPosts({
    page: currentPage,
    category: selectedCategory,
    limit: 12
  })
  
  if (loading) return <div>Carregando posts...</div>
  if (error) return <div>Erro: {error}</div>
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <span>{post.category.name}</span>
          <span>{post.view_count} visualizações</span>
        </article>
      ))}
      
      {pagination && (
        <div>
          <button 
            disabled={!pagination.has_prev}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Anterior
          </button>
          
          <span>Página {pagination.current_page} de {pagination.total_pages}</span>
          
          <button 
            disabled={!pagination.has_next}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}
```

### Error Handling
```javascript
class BlogAPIError extends Error {
  constructor(message, code, requestId) {
    super(message)
    this.name = 'BlogAPIError'
    this.code = code
    this.requestId = requestId
  }
}

async function fetchWithErrorHandling(url) {
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new BlogAPIError(
        errorData.message || 'Unknown error',
        errorData.code || response.status,
        errorData.request_id
      )
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof BlogAPIError) {
      // Handle specific API errors
      switch (error.code) {
        case 404:
          console.log('Resource not found')
          break
        case 429:
          console.log('Rate limited, retrying in 30s')
          await new Promise(resolve => setTimeout(resolve, 30000))
          return fetchWithErrorHandling(url) // Retry
        case 503:
          console.log('Service unavailable')
          break
        default:
          console.error('API Error:', error.message)
      }
    } else {
      // Handle network errors
      console.error('Network Error:', error.message)
    }
    throw error
  }
}
```

## Testing

### Manual Testing
```bash
# Test basic posts endpoint
curl "https://plataforma.escolahabilidade.com/api/blog/posts"

# Test with filters
curl "https://plataforma.escolahabilidade.com/api/blog/posts?category=design&page=1&limit=5"

# Test single post
curl "https://plataforma.escolahabilidade.com/api/blog/posts/como-aprender-design-grafico-2025"

# Test categories
curl "https://plataforma.escolahabilidade.com/api/blog/categories"

# Test sitemap
curl "https://plataforma.escolahabilidade.com/api/blog/sitemap"

# Test CORS
curl -H "Origin: https://www.escolahabilidade.com.br" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS "https://plataforma.escolahabilidade.com/api/blog/posts"

# Test rate limiting (requires rapid requests)
for i in {1..65}; do
  curl "https://plataforma.escolahabilidade.com/api/blog/posts" &
done
```

Esta documentação de API fornece todas as informações necessárias para integrar e utilizar efetivamente o Blog Backend API da Escola Habilidade.