# Blog API Documentation

This document describes the blog API endpoints implemented in the learning platform to provide blog data to the main website.

## Overview

The Blog API provides RESTful endpoints for accessing published blog content with features like pagination, filtering, caching, and CORS support specifically configured for the main site integration.

## Base URL

```
https://plataforma.escolahabilidade.com/api/blog
```

During development:
```
http://localhost:3000/api/blog
```

## Authentication

All blog API endpoints are public and do not require authentication. Only published content is accessible through these endpoints.

## Common Response Format

### Success Response
```json
{
  "data": "...",
  "meta": {
    "...": "..."
  }
}
```

### Error Response
```json
{
  "error": "ERROR_CODE",
  "message": "Human readable error message",
  "code": 400,
  "timestamp": "2025-01-28T10:00:00.000Z",
  "request_id": "abc123def"
}
```

## Endpoints

### 1. List Blog Posts

```
GET /api/blog/posts
```

Retrieve a paginated list of published blog posts with optional filtering.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (min: 1) |
| `limit` | integer | 10 | Posts per page (min: 1, max: 50) |
| `category` | string | - | Filter by category slug |
| `search` | string | - | Search in title, excerpt, and content |
| `sort` | string | newest | Sort order: `newest`, `oldest`, `popular`, `title` |

#### Example Request

```bash
curl "https://plataforma.escolahabilidade.com/api/blog/posts?page=1&limit=5&category=tecnologia&sort=popular"
```

#### Example Response

```json
{
  "posts": [
    {
      "id": "uuid-here",
      "title": "Como Aprender Design Gráfico",
      "slug": "como-aprender-design-grafico",
      "excerpt": "Descubra as melhores práticas para iniciar sua jornada no design gráfico...",
      "content": "...",
      "status": "published",
      "featured_image": "https://...",
      "seo_title": "Como Aprender Design Gráfico - Guia Completo",
      "seo_description": "...",
      "author_id": "uuid-here",
      "category_id": "uuid-here",
      "view_count": 150,
      "created_at": "2025-01-20T10:00:00.000Z",
      "updated_at": "2025-01-25T15:30:00.000Z",
      "published_at": "2025-01-22T09:00:00.000Z",
      "author": {
        "id": "uuid-here",
        "full_name": "João Silva",
        "avatar_url": "https://..."
      },
      "category": {
        "id": "uuid-here",
        "name": "Design",
        "slug": "design",
        "color_theme": "#00c4ff"
      },
      "course_cta": {
        "course_id": "uuid-here",
        "course_name": "Design Gráfico Profissional",
        "course_slug": "design-grafico-profissional"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_posts": 25,
    "per_page": 5,
    "has_next": true,
    "has_prev": false
  },
  "meta": {
    "total_published": 25,
    "categories": [
      {
        "id": "uuid-here",
        "name": "Design",
        "slug": "design",
        "description": "Dicas e tendências de design",
        "color_theme": "#00c4ff",
        "post_count": 8
      }
    ]
  }
}
```

#### Cache Headers
- `Cache-Control: s-maxage=300, stale-while-revalidate=600`
- `CDN-Cache-Control: max-age=300`

### 2. Get Single Blog Post

```
GET /api/blog/posts/{slug}
```

Retrieve a specific blog post by its slug, including related posts.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Unique slug identifier for the post |

#### Example Request

```bash
curl "https://plataforma.escolahabilidade.com/api/blog/posts/como-aprender-design-grafico"
```

#### Example Response

```json
{
  "post": {
    "id": "uuid-here",
    "title": "Como Aprender Design Gráfico",
    "slug": "como-aprender-design-grafico",
    "excerpt": "Descubra as melhores práticas...",
    "content": "# Como Aprender Design Gráfico\n\nO design gráfico é uma área...",
    "status": "published",
    "featured_image": "https://...",
    "seo_title": "Como Aprender Design Gráfico - Guia Completo",
    "seo_description": "...",
    "author_id": "uuid-here",
    "category_id": "uuid-here",
    "view_count": 151,
    "created_at": "2025-01-20T10:00:00.000Z",
    "updated_at": "2025-01-25T15:30:00.000Z",
    "published_at": "2025-01-22T09:00:00.000Z",
    "author": {
      "id": "uuid-here",
      "full_name": "João Silva",
      "avatar_url": "https://..."
    },
    "category": {
      "id": "uuid-here",
      "name": "Design",
      "slug": "design",
      "color_theme": "#00c4ff"
    },
    "course_cta": {
      "course_id": "uuid-here",
      "course_name": "Design Gráfico Profissional",
      "course_slug": "design-grafico-profissional"
    }
  },
  "meta": {
    "related_posts": [
      {
        "id": "uuid-here",
        "title": "Tendências de Design 2025",
        "slug": "tendencias-design-2025",
        "excerpt": "...",
        "featured_image": "https://...",
        "published_at": "2025-01-25T10:00:00.000Z",
        "view_count": 89,
        "author": { "..." },
        "category": { "..." }
      }
    ],
    "next_post": {
      "id": "uuid-here",
      "title": "Próximo Post",
      "slug": "proximo-post",
      "excerpt": "...",
      "featured_image": "https://...",
      "published_at": "2025-01-26T10:00:00.000Z"
    },
    "prev_post": {
      "id": "uuid-here",
      "title": "Post Anterior",
      "slug": "post-anterior",
      "excerpt": "...",
      "featured_image": "https://...",
      "published_at": "2025-01-21T10:00:00.000Z"
    }
  }
}
```

#### Special Features
- **View Count**: Automatically incremented on each request (fire-and-forget)
- **Related Posts**: Up to 3 posts from the same category
- **Navigation**: Next and previous posts chronologically

#### Cache Headers
- `Cache-Control: s-maxage=3600, stale-while-revalidate=7200`
- `CDN-Cache-Control: max-age=3600`

### 3. List Blog Categories

```
GET /api/blog/categories
```

Retrieve all blog categories with post counts.

#### Example Request

```bash
curl "https://plataforma.escolahabilidade.com/api/blog/categories"
```

#### Example Response

```json
{
  "categories": [
    {
      "id": "uuid-here",
      "name": "Design",
      "slug": "design",
      "description": "Dicas e tendências de design",
      "color_theme": "#00c4ff",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z",
      "post_count": 8
    },
    {
      "id": "uuid-here",
      "name": "Tecnologia",
      "slug": "tecnologia",
      "description": "Artigos sobre tecnologia e inovação",
      "color_theme": "#d400ff",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z",
      "post_count": 12
    }
  ],
  "meta": {
    "total_categories": 5,
    "total_posts": 25
  }
}
```

#### Cache Headers
- `Cache-Control: s-maxage=1800, stale-while-revalidate=3600`
- `CDN-Cache-Control: max-age=1800`

### 4. Blog Sitemap

```
GET /api/blog/sitemap
```

Generate an XML sitemap for blog posts (SEO).

#### Example Request

```bash
curl "https://plataforma.escolahabilidade.com/api/blog/sitemap"
```

#### Example Response

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.escolahabilidade.com.br/blog</loc>
    <lastmod>2025-01-28T10:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.escolahabilidade.com.br/blog/como-aprender-design-grafico</loc>
    <lastmod>2025-01-25T15:30:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

#### Cache Headers
- `Cache-Control: s-maxage=3600, stale-while-revalidate=7200`
- `Content-Type: application/xml; charset=utf-8`

## Security & Performance

### CORS Configuration

The API is configured to accept requests only from:
- `https://www.escolahabilidade.com.br`
- `https://escolahabilidade.com.br`
- `http://localhost:5173` (development only)
- `http://127.0.0.1:5173` (development only)

### Rate Limiting

- **Limit**: 60 requests per minute per IP address
- **Headers**: Rate limit information is returned in response headers
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining in current window
  - `X-RateLimit-Reset`: Timestamp when the rate limit resets
  - `Retry-After`: Seconds to wait before retrying (when rate limited)

### Security Headers

All responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'`

### Caching Strategy

- **Posts List**: 5 minutes cache, 10 minutes stale-while-revalidate
- **Single Post**: 1 hour cache, 2 hours stale-while-revalidate
- **Categories**: 30 minutes cache, 1 hour stale-while-revalidate
- **Sitemap**: 1 hour cache, 2 hours stale-while-revalidate

## Error Codes

| Code | Error | Description |
|------|-------|-------------|
| 400 | VALIDATION_ERROR | Invalid query parameters |
| 404 | POST_NOT_FOUND | Blog post not found or not published |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests |
| 500 | INTERNAL_SERVER_ERROR | Server error |
| 503 | DATABASE_ERROR | Database connection issues |

## Testing

### Test Interface

A test interface is available at `/test-blog-api` during development to test all endpoints with various parameters.

### Performance Monitoring

The API includes built-in performance monitoring:
- Response time tracking
- Cache hit rate monitoring
- Query count optimization
- Automatic alerts for responses > 200ms

Access performance reports via the performance monitoring functions in `src/lib/blog/performance.ts`.

## Database Setup

### Required Tables

Run the SQL schema in `/database/blog-schema.sql` to create the necessary tables:
- `blog_categories`
- `blog_posts`
- `blog_course_ctas`

### Recommended Indexes

The schema includes optimized indexes for:
- Published post queries
- Category filtering
- Full-text search (Portuguese)
- Slug-based lookups

### Sample Data

The schema includes sample categories. To add blog posts, use the admin interface at `/admin/blog`.

## Integration Example

### JavaScript/React Usage

```javascript
// Fetch blog posts
const fetchBlogPosts = async (page = 1, category = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '10'
  })
  
  if (category) {
    params.set('category', category)
  }
  
  try {
    const response = await fetch(
      `https://plataforma.escolahabilidade.com/api/blog/posts?${params}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    throw error
  }
}

// Fetch single post
const fetchBlogPost = async (slug) => {
  try {
    const response = await fetch(
      `https://plataforma.escolahabilidade.com/api/blog/posts/${slug}`
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Post not found')
      }
      throw new Error(`HTTP ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch blog post:', error)
    throw error
  }
}
```

## Support

For issues or questions about the Blog API:
1. Check the test interface at `/test-blog-api`
2. Review server logs for error details
3. Verify database schema is properly set up
4. Check that the required environment variables are configured

The API includes comprehensive logging with request IDs for easier debugging.