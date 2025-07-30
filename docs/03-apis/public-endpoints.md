# 🔌 ENDPOINTS PÚBLICOS - ESCOLA HABILIDADE

## 📋 VISÃO GERAL

Endpoints públicos disponíveis para integração entre o marketing site (React/Vite) e a plataforma de ensino (Next.js), além de funcionalidades públicas como blog e catálogo de cursos.

**Base URL**: `https://plataformahabilidade.netlify.app/api`

---

## 📝 BLOG ENDPOINTS

### GET `/api/blog/posts`
Lista posts do blog publicados com paginação e filtros.

#### Parâmetros de Query
```typescript
interface BlogPostsQuery {
  page?: number          // Página atual (default: 1)
  limit?: number         // Posts por página (default: 10, max: 50)
  category?: string      // Filtrar por slug da categoria
  search?: string        // Busca no título e excerpt
  author?: string        // Filtrar por autor (slug)
  tag?: string          // Filtrar por tag
}
```

#### Exemplo de Request
```bash
GET /api/blog/posts?page=1&limit=10&category=programacao&search=react

# Headers
Accept: application/json
```

#### Resposta de Sucesso (200)
```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "Como aprender React em 2025",
      "slug": "como-aprender-react-2025",
      "excerpt": "Um guia completo para iniciantes...",
      "content": "Conteúdo completo do post...",
      "featured_image_url": "https://cdn.supabase.co/...",
      "featured_image_alt": "Imagem sobre React",
      "seo_title": "Como aprender React - Guia 2025",
      "seo_description": "Aprenda React do zero com este guia...",
      "published_at": "2025-07-30T10:00:00Z",
      "reading_time_minutes": 8,
      "view_count": 1250,
      "category": {
        "name": "Programação",
        "slug": "programacao",
        "color": "#3b82f6"
      },
      "author": {
        "full_name": "João Silva",
        "avatar_url": "https://cdn.supabase.co/..."
      },
      "tags": [
        {"name": "React", "slug": "react"},
        {"name": "JavaScript", "slug": "javascript"}
      ],
      "cta_course": {
        "id": "uuid",
        "title": "Curso Completo de React",
        "slug": "curso-react-completo",
        "image_url": "https://cdn.supabase.co/..."
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 15,
    "totalPosts": 150,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "limit": 10
  },
  "filters": {
    "category": "programacao",
    "search": "react"
  }
}
```

---

### GET `/api/blog/posts/[slug]`
Obtém um post específico pelo slug.

#### Parâmetros
- `slug` (string): Slug único do post

#### Exemplo de Request
```bash
GET /api/blog/posts/como-aprender-react-2025

# Headers
Accept: application/json
```

#### Resposta de Sucesso (200)
```json
{
  "post": {
    "id": "uuid",
    "title": "Como aprender React em 2025",
    "slug": "como-aprender-react-2025",
    "excerpt": "Um guia completo para iniciantes...",
    "content": "# Como aprender React\n\nReact é uma biblioteca...",
    "featured_image_url": "https://cdn.supabase.co/...",
    "featured_image_alt": "Imagem sobre React",
    
    // SEO fields
    "seo_title": "Como aprender React - Guia 2025",
    "seo_description": "Aprenda React do zero...",
    "seo_keywords": ["react", "javascript", "frontend"],
    "og_image_url": "https://cdn.supabase.co/...",
    "og_description": "Guia completo de React...",
    
    // Metadata
    "published_at": "2025-07-30T10:00:00Z",
    "updated_at": "2025-07-30T15:30:00Z",
    "reading_time_minutes": 8,
    "view_count": 1251, // Incrementado automaticamente
    
    // Relations
    "category": {
      "name": "Programação",
      "slug": "programacao",
      "color": "#3b82f6",
      "description": "Artigos sobre desenvolvimento..."
    },
    "author": {
      "full_name": "João Silva",
      "avatar_url": "https://cdn.supabase.co/...",
      "bio": "Desenvolvedor Full Stack..."
    },
    "tags": [
      {"name": "React", "slug": "react"},
      {"name": "JavaScript", "slug": "javascript"},
      {"name": "Frontend", "slug": "frontend"}
    ],
    
    // CTA contextual
    "cta_course": {
      "id": "uuid",
      "title": "Curso Completo de React",
      "slug": "curso-react-completo",
      "description": "Aprenda React na prática...",
      "image_url": "https://cdn.supabase.co/...",
      "price": 197.00,
      "discount_price": 97.00
    },
    "cta_title": "Quer dominar React na prática?",
    "cta_description": "Nosso curso completo te ensina...",
    "cta_button_text": "Quero me inscrever"
  },
  "related_posts": [
    {
      "id": "uuid",
      "title": "JavaScript ES6+ Essentials",
      "slug": "javascript-es6-essentials",
      "excerpt": "Recursos modernos do JavaScript...",
      "featured_image_url": "https://cdn.supabase.co/...",
      "published_at": "2025-07-25T10:00:00Z",
      "reading_time_minutes": 6,
      "category": {"name": "Programação", "slug": "programacao"}
    }
  ]
}
```

#### Resposta de Erro (404)
```json
{
  "error": "Post not found",
  "code": "POST_NOT_FOUND"
}
```

---

### GET `/api/blog/categories`
Lista todas as categorias do blog.

#### Resposta de Sucesso (200)
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Programação",
      "slug": "programacao",
      "description": "Artigos sobre desenvolvimento de software",
      "color": "#3b82f6",
      "post_count": 25,
      "created_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": "uuid", 
      "name": "Design",
      "slug": "design",
      "description": "UX/UI e design gráfico",
      "color": "#8b5cf6",
      "post_count": 18,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

## 🎓 COURSE ENDPOINTS

### GET `/api/courses`
Lista cursos públicos disponíveis para visualização no marketing site.

#### Parâmetros de Query
```typescript
interface CoursesQuery {
  category?: string      // Filtrar por categoria
  level?: string        // Filtrar por nível (beginner, intermediate, advanced)
  featured?: boolean    // Apenas cursos em destaque
  limit?: number        // Máximo de cursos (default: 20)
}
```

#### Exemplo de Request
```bash
GET /api/courses?category=programacao&featured=true&limit=6
```

#### Resposta de Sucesso (200)
```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "Curso Completo de React",
      "slug": "curso-react-completo",
      "description": "Aprenda React do zero ao avançado",
      "short_description": "React para iniciantes e intermediários",
      "image_url": "https://cdn.supabase.co/...",
      "level": "intermediate",
      "duration_hours": 40,
      "price": 197.00,
      "discount_price": 97.00,
      "is_featured": true,
      "student_count": 1520,
      "rating": 4.8,
      "rating_count": 340,
      "category": {
        "name": "Programação",
        "slug": "programacao"
      },
      "instructor": {
        "name": "João Silva",
        "avatar_url": "https://cdn.supabase.co/...",
        "experience_years": 8
      },
      "topics": [
        "Fundamentos do React",
        "Hooks e Context API", 
        "Roteamento com React Router",
        "Gerenciamento de Estado",
        "Testes em React"
      ],
      "requirements": [
        "Conhecimento básico de JavaScript",
        "HTML e CSS intermediário"
      ]
    }
  ]
}
```

---

### GET `/api/courses/[slug]`
Detalhes completos de um curso específico.

#### Resposta de Sucesso (200)
```json
{
  "course": {
    "id": "uuid",
    "title": "Curso Completo de React",
    "slug": "curso-react-completo",
    "description": "Descrição completa do curso...",
    "short_description": "React do zero ao avançado",
    "image_url": "https://cdn.supabase.co/...",
    "trailer_url": "https://vimeo.com/...",
    
    // Pricing
    "price": 197.00,
    "discount_price": 97.00,
    "currency": "BRL",
    
    // Course info
    "level": "intermediate",
    "duration_hours": 40,
    "lesson_count": 35,
    "exercise_count": 12,
    "certificate": true,
    "language": "pt-BR",
    
    // Stats
    "student_count": 1520,
    "rating": 4.8,
    "rating_count": 340,
    "completion_rate": 87,
    
    // Content
    "curriculum": [
      {
        "module_title": "Fundamentos",
        "lessons": [
          {
            "title": "Introdução ao React",
            "duration_minutes": 15,
            "type": "video",
            "is_free": true
          },
          {
            "title": "Configurando o ambiente",
            "duration_minutes": 20,
            "type": "video",
            "is_free": false
          },
          {
            "title": "Exercício: Primeiro componente",
            "duration_minutes": 30,
            "type": "exercise",
            "is_free": false
          }
        ]
      }
    ],
    
    // Relations
    "category": {
      "name": "Programação",
      "slug": "programacao"
    },
    "instructor": {
      "name": "João Silva",
      "bio": "Desenvolvedor Full Stack...",
      "avatar_url": "https://cdn.supabase.co/...",
      "experience_years": 8,
      "student_count": 5420,
      "course_count": 3
    },
    
    // Learning outcomes
    "learning_outcomes": [
      "Criar aplicações React completas",
      "Dominar hooks e context API",
      "Implementar roteamento",
      "Gerenciar estado global",
      "Escrever testes unitários"
    ],
    
    // Prerequisites
    "requirements": [
      "JavaScript ES6+",
      "HTML5 e CSS3",
      "Git básico"
    ],
    
    // Resources
    "resources": [
      "40 horas de vídeo",
      "12 exercícios práticos",
      "Código fonte completo",
      "Certificado de conclusão",
      "Suporte por 1 ano"
    ]
  },
  "related_courses": [
    {
      "id": "uuid",
      "title": "JavaScript Avançado",
      "slug": "javascript-avancado",
      "image_url": "https://cdn.supabase.co/...",
      "price": 147.00,
      "rating": 4.7
    }
  ]
}
```

---

## 📊 ANALYTICS ENDPOINTS

### POST `/api/analytics/page-view`
Registra visualização de página para analytics.

#### Request Body
```json
{
  "page": "/blog/como-aprender-react-2025",
  "referrer": "https://google.com",
  "user_agent": "Mozilla/5.0...",
  "utm_source": "google",
  "utm_medium": "organic",
  "utm_campaign": "blog-seo"
}
```

#### Resposta de Sucesso (200)
```json
{
  "success": true,
  "id": "view-uuid"
}
```

---

### POST `/api/analytics/event`
Registra evento personalizado para analytics.

#### Request Body
```json
{
  "event": "cta_click",
  "properties": {
    "post_slug": "como-aprender-react-2025",
    "course_id": "uuid",
    "position": "inline",
    "text": "Quero me inscrever"
  }
}
```

---

## 📧 CONTACT ENDPOINTS

### POST `/api/contact/general`
Formulário de contato geral do marketing site.

#### Request Body
```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "phone": "+5548999999999",
  "subject": "Dúvidas sobre cursos",
  "message": "Gostaria de saber mais sobre...",
  "source": "marketing_site",
  "utm_source": "google",
  "utm_medium": "cpc"
}
```

#### Resposta de Sucesso (200)
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso",
  "id": "contact-uuid"
}
```

---

### POST `/api/contact/course-interest`
Manifestação de interesse em curso específico.

#### Request Body
```json
{
  "name": "João Santos",
  "email": "joao@email.com", 
  "phone": "+5548888888888",
  "course_slug": "curso-react-completo",
  "message": "Quando será a próxima turma?",
  "preferred_contact": "whatsapp"
}
```

---

## 🔍 SEARCH ENDPOINTS

### GET `/api/search`
Busca global no conteúdo público.

#### Parâmetros de Query
```typescript
interface SearchQuery {
  q: string              // Termo de busca (obrigatório)
  type?: string          // 'posts' | 'courses' | 'all'
  limit?: number         // Resultados por tipo (default: 10)
}
```

#### Exemplo
```bash
GET /api/search?q=react&type=all&limit=5
```

#### Resposta de Sucesso (200)
```json
{
  "query": "react",
  "results": {
    "posts": [
      {
        "id": "uuid",
        "title": "Como aprender React em 2025",
        "slug": "como-aprender-react-2025",
        "excerpt": "Um guia completo...",
        "type": "post",
        "relevance": 0.95
      }
    ],
    "courses": [
      {
        "id": "uuid", 
        "title": "Curso Completo de React",
        "slug": "curso-react-completo",
        "description": "React do zero ao avançado",
        "type": "course",
        "relevance": 0.92
      }
    ]
  },
  "total_results": 15
}
```

---

## 🗂️ SITEMAP & SEO

### GET `/api/sitemap.xml`
Sitemap XML para SEO.

#### Resposta (200)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://stelarow.github.io/habilidade/</loc>
    <lastmod>2025-07-30</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://stelarow.github.io/habilidade/blog/como-aprender-react-2025</loc>
    <lastmod>2025-07-30</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

### GET `/api/robots.txt`
Arquivo robots.txt para crawlers.

#### Resposta (200)
```txt
User-agent: *
Allow: /

# Sitemaps
Sitemap: https://plataformahabilidade.netlify.app/api/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/admin/
Disallow: /dashboard/
```

---

## 📝 RSS FEED

### GET `/api/feed.xml`
RSS feed do blog.

#### Resposta (200)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog - Escola Habilidade</title>
    <description>Artigos sobre programação, design e tecnologia</description>
    <link>https://stelarow.github.io/habilidade/blog</link>
    <lastBuildDate>Wed, 30 Jul 2025 10:00:00 GMT</lastBuildDate>
    
    <item>
      <title>Como aprender React em 2025</title>
      <description>Um guia completo para iniciantes...</description>
      <link>https://stelarow.github.io/habilidade/blog/como-aprender-react-2025</link>
      <pubDate>Wed, 30 Jul 2025 10:00:00 GMT</pubDate>
      <guid>https://stelarow.github.io/habilidade/blog/como-aprender-react-2025</guid>
    </item>
  </channel>
</rss>
```

---

## 🔒 RATE LIMITING

Todos os endpoints públicos têm rate limiting aplicado:

### Limites por IP
- **Geral**: 100 requests/minuto
- **Search**: 20 requests/minuto  
- **Contact**: 5 requests/minuto
- **Analytics**: 1000 requests/minuto

### Headers de Rate Limit
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1690723200
```

### Response de Rate Limit (429)
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "reset_at": "2025-07-30T10:05:00Z"
}
```

---

## 🐛 ERROR HANDLING

### Códigos de Erro Padrão
- **400**: Bad Request - Parâmetros inválidos
- **401**: Unauthorized - Requer autenticação 
- **403**: Forbidden - Sem permissão
- **404**: Not Found - Recurso não encontrado
- **429**: Too Many Requests - Rate limit
- **500**: Internal Server Error - Erro do servidor

### Formato de Erro Padrão
```json
{
  "error": "Resource not found",
  "code": "RESOURCE_NOT_FOUND", 
  "message": "The requested blog post does not exist",
  "timestamp": "2025-07-30T10:00:00Z",
  "path": "/api/blog/posts/non-existent-post"
}
```

---

*Documentação atualizada em: 30/07/2025*