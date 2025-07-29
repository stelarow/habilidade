# Integration Examples - Blog Backend API

## React/Vite Integration (Main Site)

### 1. Custom Hook for Blog Data

```typescript
// hooks/useBlogAPI.ts
import { useState, useEffect, useCallback } from 'react'

interface BlogAPIConfig {
  baseUrl?: string
  defaultLimit?: number
}

interface UseBlogPostsOptions {
  page?: number
  limit?: number
  category?: string
  search?: string
  sort?: 'newest' | 'oldest' | 'popular' | 'title'
  autoFetch?: boolean
}

interface UseBlogPostsReturn {
  posts: BlogPost[]
  pagination: Pagination | null
  categories: BlogCategory[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  fetchMore: () => Promise<void>
}

const DEFAULT_CONFIG: BlogAPIConfig = {
  baseUrl: 'https://plataforma.escolahabilidade.com/api/blog',
  defaultLimit: 10
}

export function useBlogPosts(options: UseBlogPostsOptions = {}): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    page = 1,
    limit = DEFAULT_CONFIG.defaultLimit!,
    category,
    search,
    sort = 'newest',
    autoFetch = true
  } = options

  const fetchPosts = useCallback(async (appendMode = false) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: appendMode ? String(pagination?.current_page || 1) : String(page),
        limit: String(limit),
        sort
      })

      if (category) params.set('category', category)
      if (search) params.set('search', search)

      const response = await fetch(`${DEFAULT_CONFIG.baseUrl}/posts?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After')
          throw new Error(`Rate limited. Try again in ${retryAfter} seconds.`)
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (appendMode) {
        setPosts(prev => [...prev, ...data.posts])
      } else {
        setPosts(data.posts)
        setCategories(data.meta.categories)
      }
      
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts')
      console.error('Blog API Error:', err)
    } finally {
      setLoading(false)
    }
  }, [page, limit, category, search, sort, pagination?.current_page])

  const fetchMore = useCallback(async () => {
    if (pagination?.has_next && !loading) {
      await fetchPosts(true)
    }
  }, [pagination?.has_next, loading, fetchPosts])

  const refetch = useCallback(() => fetchPosts(false), [fetchPosts])

  useEffect(() => {
    if (autoFetch) {
      fetchPosts(false)
    }
  }, [fetchPosts, autoFetch])

  return {
    posts,
    pagination,
    categories,
    loading,
    error,
    refetch,
    fetchMore
  }
}

// Single post hook
export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPostSummary[]>([])
  const [navigation, setNavigation] = useState<{
    next?: BlogPostSummary
    prev?: BlogPostSummary
  }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = useCallback(async () => {
    if (!slug) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${DEFAULT_CONFIG.baseUrl}/posts/${slug}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Post not found')
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setPost(data.post)
      setRelatedPosts(data.meta.related_posts)
      setNavigation({
        next: data.meta.next_post,
        prev: data.meta.prev_post
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch post')
      console.error('Blog API Error:', err)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  return {
    post,
    relatedPosts,
    navigation,
    loading,
    error,
    refetch: fetchPost
  }
}
```

### 2. Blog Listing Component

```tsx
// components/blog/BlogListing.tsx
import React, { useState } from 'react'
import { useBlogPosts } from '../../hooks/useBlogAPI'
import { BlogCard } from './BlogCard'
import { BlogFilter } from './BlogFilter'
import { Pagination } from './Pagination'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorMessage } from '../ui/ErrorMessage'

interface BlogListingProps {
  initialCategory?: string
  showFilters?: boolean
  showPagination?: boolean
  postsPerPage?: number
}

export function BlogListing({
  initialCategory,
  showFilters = true,
  showPagination = true,
  postsPerPage = 12
}: BlogListingProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'popular' | 'title'>('newest')

  const {
    posts,
    pagination,
    categories,
    loading,
    error,
    refetch
  } = useBlogPosts({
    page: currentPage,
    limit: postsPerPage,
    category: selectedCategory,
    search: searchQuery,
    sort: sortOrder
  })

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1) // Reset to first page
  }

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
    setCurrentPage(1) // Reset to first page
  }

  const handleSortChange = (sort: typeof sortOrder) => {
    setSortOrder(sort)
    setCurrentPage(1) // Reset to first page
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={refetch}
        className="my-8"
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      {showFilters && (
        <BlogFilter
          categories={categories}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          loading={loading}
        />
      )}

      {/* Results Info */}
      {pagination && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {posts.length} of {pagination.total_posts} posts
            {selectedCategory && (
              <span className="ml-1">
                in <strong>{categories.find(c => c.slug === selectedCategory)?.name}</strong>
              </span>
            )}
          </span>
          <span>
            Page {pagination.current_page} of {pagination.total_pages}
          </span>
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <BlogCard 
              key={post.id} 
              post={post}
              showCategory={!selectedCategory}
              showAuthor={true}
              showExcerpt={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          {searchQuery || selectedCategory ? (
            <div>
              <p className="text-lg mb-2">No posts found</p>
              <p className="text-sm">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <p className="text-lg">No blog posts available</p>
          )}
        </div>
      )}

      {/* Pagination */}
      {showPagination && pagination && pagination.total_pages > 1 && (
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          hasNext={pagination.has_next}
          hasPrev={pagination.has_prev}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  )
}
```

### 3. Blog Card Component

```tsx
// components/blog/BlogCard.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Eye, User, Calendar, Tag } from 'lucide-react'

interface BlogCardProps {
  post: BlogPost
  showCategory?: boolean
  showAuthor?: boolean
  showExcerpt?: boolean
  showViewCount?: boolean
  className?: string
}

export function BlogCard({
  post,
  showCategory = true,
  showAuthor = true,
  showExcerpt = true,
  showViewCount = true,
  className = ''
}: BlogCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.published_at!), {
    addSuffix: true,
    locale: ptBR
  })

  return (
    <article className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* Featured Image */}
      {post.featured_image && (
        <Link to={`/blog/${post.slug}`} className="block">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        {/* Category Badge */}
        {showCategory && post.category && (
          <Link 
            to={`/blog?category=${post.category.slug}`}
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mb-3 hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: `${post.category.color_theme}20`,
              color: post.category.color_theme
            }}
          >
            <Tag className="w-3 h-3 mr-1" />
            {post.category.name}
          </Link>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          <Link 
            to={`/blog/${post.slug}`}
            className="hover:text-primary-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {showExcerpt && post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {/* Author */}
            {showAuthor && post.author && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{post.author.full_name}</span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <time dateTime={post.published_at}>
                {timeAgo}
              </time>
            </div>
          </div>

          {/* View Count */}
          {showViewCount && (
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{post.view_count.toLocaleString('pt-BR')}</span>
            </div>
          )}
        </div>

        {/* Course CTA */}
        {post.course_cta && (
          <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
            <p className="text-sm text-gray-700 mb-2">
              Quer aprender mais sobre este assunto?
            </p>
            <Link
              to={`/courses/${post.course_cta.course_slug}`}
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Confira o curso: {post.course_cta.course_name}
              <span className="ml-1">→</span>
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}
```

### 4. Single Post Component

```tsx
// components/blog/BlogPost.tsx
import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useBlogPost } from '../../hooks/useBlogAPI'
import { BlogCard } from './BlogCard'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorMessage } from '../ui/ErrorMessage'
import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Eye, User, Calendar, Tag, ArrowLeft, 
  ArrowRight, Share2, Facebook, Twitter, WhatsApp 
} from 'lucide-react'

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  
  const {
    post,
    relatedPosts,
    navigation,
    loading,
    error,
    refetch
  } = useBlogPost(slug!)

  // Update page metadata
  useEffect(() => {
    if (post) {
      document.title = post.seo_title || `${post.title} - Escola Habilidade`
      
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', post.seo_description || post.excerpt || '')
      }
    }
  }, [post])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        onRetry={refetch}
        className="my-8"
      />
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
        <p className="text-gray-600 mb-6">
          O post que você está procurando não existe ou foi removido.
        </p>
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Blog
        </button>
      </div>
    )
  }

  const shareUrl = window.location.href
  const shareText = `${post.title} - Escola Habilidade`

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back to Blog */}
      <nav className="mb-8">
        <Link
          to="/blog"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Blog
        </Link>
      </nav>

      {/* Post Header */}
      <header className="mb-8">
        {/* Category */}
        {post.category && (
          <Link
            to={`/blog?category=${post.category.slug}`}
            className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full mb-4 hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: `${post.category.color_theme}20`,
              color: post.category.color_theme
            }}
          >
            <Tag className="w-3 h-3 mr-1" />
            {post.category.name}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center justify-between text-gray-600 mb-6">
          <div className="flex items-center space-x-6">
            {/* Author */}
            {post.author && (
              <div className="flex items-center">
                {post.author.avatar_url && (
                  <img
                    src={post.author.avatar_url}
                    alt={post.author.full_name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <User className="w-4 h-4 mr-1" />
                <span>{post.author.full_name}</span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <time dateTime={post.published_at}>
                {format(new Date(post.published_at!), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </time>
            </div>

            {/* View Count */}
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{post.view_count.toLocaleString('pt-BR')} visualizações</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 mr-2">Compartilhar:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Compartilhar no Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
              title="Compartilhar no Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
              title="Compartilhar no WhatsApp"
            >
              <WhatsApp className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}
      </header>

      {/* Post Content */}
      <div 
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Course CTA */}
      {post.course_cta && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mb-12 border border-primary-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Quer se aprofundar neste assunto?
          </h3>
          <p className="text-gray-700 mb-4">
            Continue seu aprendizado com nosso curso especializado sobre este tema.
          </p>
          <Link
            to={`/courses/${post.course_cta.course_slug}`}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Conhecer o curso: {post.course_cta.course_name}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Navigation */}
      {(navigation.prev || navigation.next) && (
        <nav className="flex justify-between items-center py-8 border-t border-gray-200 mb-12">
          {navigation.prev ? (
            <Link
              to={`/blog/${navigation.prev.slug}`}
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <div>
                <p className="text-sm text-gray-500">Post anterior</p>
                <p className="font-medium line-clamp-1">{navigation.prev.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {navigation.next && (
            <Link
              to={`/blog/${navigation.next.slug}`}
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors text-right group"
            >
              <div>
                <p className="text-sm text-gray-500">Próximo post</p>
                <p className="font-medium line-clamp-1">{navigation.next.title}</p>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </nav>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Posts Relacionados
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map(relatedPost => (
              <BlogCard
                key={relatedPost.id}
                post={relatedPost}
                showCategory={false}
                showExcerpt={true}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
```

### 5. Blog Search Component

```tsx
// components/blog/BlogSearch.tsx
import React, { useState, useEffect } from 'react'
import { useBlogPosts } from '../../hooks/useBlogAPI'
import { BlogCard } from './BlogCard'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { Search, X } from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'

interface BlogSearchProps {
  initialQuery?: string
  onQueryChange?: (query: string) => void
}

export function BlogSearch({ initialQuery = '', onQueryChange }: BlogSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 300) // 300ms delay

  const {
    posts,
    pagination,
    loading,
    error
  } = useBlogPosts({
    search: debouncedQuery,
    limit: 20,
    autoFetch: !!debouncedQuery
  })

  useEffect(() => {
    onQueryChange?.(debouncedQuery)
  }, [debouncedQuery, onQueryChange])

  const handleClearSearch = () => {
    setQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar posts do blog..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-lg"
        />
        {query && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {debouncedQuery && (
        <div>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Erro na busca: {error}
            </div>
          ) : (
            <>
              {/* Results Info */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {posts.length > 0 
                    ? `${pagination?.total_posts || posts.length} resultado${(pagination?.total_posts || posts.length) !== 1 ? 's' : ''} para "${debouncedQuery}"`
                    : `Nenhum resultado encontrado para "${debouncedQuery}"`
                  }
                </h2>
                {posts.length > 0 && pagination && pagination.total_pages > 1 && (
                  <p className="text-gray-600 mt-1">
                    Mostrando {posts.length} de {pagination.total_posts} posts
                  </p>
                )}
              </div>

              {/* Results Grid */}
              {posts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map(post => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      showCategory={true}
                      showAuthor={true}
                      showExcerpt={true}
                    />
                  ))}
                </div>
              ) : debouncedQuery && (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Nenhum post encontrado</h3>
                  <p className="text-sm">
                    Tente usar palavras-chave diferentes ou remover alguns filtros
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Search Suggestions */}
      {!debouncedQuery && (
        <div className="text-center py-12 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Buscar no Blog</h3>
          <p className="text-sm mb-4">
            Digite palavras-chave para encontrar posts sobre assuntos específicos
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['design', 'tecnologia', 'carreira', 'educação'].map(suggestion => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

## Next.js Integration (Alternative Implementation)

### 1. API Client Service

```typescript
// lib/blogAPI.ts
class BlogAPIService {
  private baseUrl: string
  
  constructor(baseUrl = 'https://plataforma.escolahabilidade.com/api/blog') {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers
      },
      ...options
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: `HTTP ${response.status}` 
      }))
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  async getPosts(params: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sort?: string
  } = {}): Promise<BlogListResponse> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value))
      }
    })

    return this.request(`/posts?${searchParams}`)
  }

  async getPost(slug: string): Promise<BlogPostResponse> {
    return this.request(`/posts/${slug}`)
  }

  async getCategories(): Promise<BlogCategoriesResponse> {
    return this.request('/categories')
  }

  async getSitemap(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/sitemap`)
    return response.text()
  }
}

export const blogAPI = new BlogAPIService()
```

### 2. Server-Side Rendering (SSR)

```tsx
// pages/blog/index.tsx (Next.js Pages Router)
import { GetServerSideProps } from 'next'
import { blogAPI } from '../../lib/blogAPI'
import { BlogListing } from '../../components/blog/BlogListing'

interface BlogPageProps {
  initialPosts: BlogListResponse
  initialCategories: BlogCategory[]
}

export default function BlogPage({ initialPosts, initialCategories }: BlogPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog</h1>
      <BlogListing 
        initialData={initialPosts}
        categories={initialCategories}
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const [postsData, categoriesData] = await Promise.all([
      blogAPI.getPosts({
        page: Number(query.page) || 1,
        category: query.category as string,
        search: query.search as string,
        sort: query.sort as string
      }),
      blogAPI.getCategories()
    ])

    return {
      props: {
        initialPosts: postsData,
        initialCategories: categoriesData.categories
      }
    }
  } catch (error) {
    console.error('Failed to fetch blog data:', error)
    
    return {
      props: {
        initialPosts: { posts: [], pagination: null, meta: { total_published: 0, categories: [] } },
        initialCategories: []
      }
    }
  }
}
```

### 3. Static Site Generation (SSG)

```tsx
// pages/blog/[slug].tsx (Next.js Pages Router)
import { GetStaticProps, GetStaticPaths } from 'next'
import { blogAPI } from '../../lib/blogAPI'
import { BlogPost } from '../../components/blog/BlogPost'

interface BlogPostPageProps {
  post: BlogPost | null
  relatedPosts: BlogPostSummary[]
  navigation: {
    next?: BlogPostSummary
    prev?: BlogPostSummary
  }
}

export default function BlogPostPage({ post, relatedPosts, navigation }: BlogPostPageProps) {
  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <BlogPost 
      post={post}
      relatedPosts={relatedPosts}
      navigation={navigation}
    />
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Get most recent posts for static generation
    const { posts } = await blogAPI.getPosts({ limit: 50 })
    
    const paths = posts.map(post => ({
      params: { slug: post.slug }
    }))

    return {
      paths,
      fallback: 'blocking' // Enable ISR for new posts
    }
  } catch (error) {
    console.error('Failed to fetch blog paths:', error)
    return {
      paths: [],
      fallback: 'blocking'
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string
    const data = await blogAPI.getPost(slug)

    return {
      props: {
        post: data.post,
        relatedPosts: data.meta.related_posts,
        navigation: {
          next: data.meta.next_post,
          prev: data.meta.prev_post
        }
      },
      revalidate: 3600 // Revalidate every hour
    }
  } catch (error) {
    console.error(`Failed to fetch post ${params?.slug}:`, error)
    
    return {
      props: {
        post: null,
        relatedPosts: [],
        navigation: {}
      },
      revalidate: 60 // Retry more frequently for failed requests
    }
  }
}
```

## Error Handling Patterns

### 1. Retry Logic

```typescript
// utils/apiUtils.ts
interface RetryOptions {
  maxRetries?: number
  delay?: number
  backoff?: number
}

export async function withRetry<T>(
  fn: () => Promise<T>, 
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, delay = 1000, backoff = 2 } = options
  
  let lastError: Error
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry client errors (4xx)
      if (error instanceof Error && error.message.includes('4')) {
        throw error
      }
      
      if (attempt < maxRetries - 1) {
        const waitTime = delay * Math.pow(backoff, attempt)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }
  
  throw lastError!
}

// Usage
const posts = await withRetry(() => blogAPI.getPosts({ page: 1 }), {
  maxRetries: 3,
  delay: 1000
})
```

### 2. Circuit Breaker Pattern

```typescript
// utils/circuitBreaker.ts
class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'

  constructor(
    private threshold = 5,
    private timeout = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN'
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failures = 0
    this.state = 'CLOSED'
  }

  private onFailure() {
    this.failures++
    this.lastFailureTime = Date.now()
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN'
    }
  }
}

const blogAPICircuitBreaker = new CircuitBreaker()

// Usage
const posts = await blogAPICircuitBreaker.execute(() => 
  blogAPI.getPosts({ page: 1 })
)
```

### 3. Graceful Degradation

```tsx
// components/blog/BlogWithFallback.tsx
import React from 'react'
import { useBlogPosts } from '../../hooks/useBlogAPI'
import { BlogCard } from './BlogCard'
import { ErrorBoundary } from '../ui/ErrorBoundary'

const FALLBACK_POSTS = [
  {
    id: 'fallback-1',
    title: 'Bem-vindo ao Blog da Escola Habilidade',
    slug: 'bem-vindo',
    excerpt: 'Explore nossos conteúdos educacionais e dicas de carreira.',
    published_at: new Date().toISOString(),
    view_count: 0,
    author: { id: '1', full_name: 'Equipe Habilidade' },
    category: { id: '1', name: 'Geral', slug: 'geral', color_theme: '#d400ff' }
  }
]

function BlogListingWithFallback() {
  const { posts, loading, error } = useBlogPosts()

  // Show fallback content if API fails
  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Não foi possível carregar os posts mais recentes. 
            Mostrando conteúdo em cache.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FALLBACK_POSTS.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    )
  }

  // Normal operation
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}

export function BlogWithFallback() {
  return (
    <ErrorBoundary fallback={<BlogOfflineMessage />}>
      <BlogListingWithFallback />
    </ErrorBoundary>
  )
}

function BlogOfflineMessage() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Conteúdo Temporariamente Indisponível
      </h2>
      <p className="text-gray-600 mb-6">
        Estamos com problemas técnicos. Tente novamente em alguns minutos.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Tentar Novamente
      </button>
    </div>
  )
}
```

## Performance Optimization

### 1. React Query Integration

```typescript
// hooks/useBlogQuery.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { blogAPI } from '../lib/blogAPI'

export function useBlogPostsQuery(params: any) {
  return useQuery({
    queryKey: ['blog-posts', params],
    queryFn: () => blogAPI.getPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      // Don't retry 4xx errors
      if (error instanceof Error && error.message.includes('4')) {
        return false
      }
      return failureCount < 3
    }
  })
}

export function useBlogPostQuery(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blogAPI.getPost(slug),
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: !!slug
  })
}

export function useInfiniteBlogPosts(params: any) {
  return useInfiniteQuery({
    queryKey: ['blog-posts-infinite', params],
    queryFn: ({ pageParam = 1 }) => 
      blogAPI.getPosts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => 
      lastPage.pagination.has_next 
        ? lastPage.pagination.current_page + 1 
        : undefined,
    staleTime: 5 * 60 * 1000
  })
}
```

### 2. Image Optimization

```tsx
// components/ui/OptimizedImage.tsx
import React, { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}

export function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false 
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Generate srcSet for different screen sizes
  const generateSrcSet = (originalSrc: string) => {
    const baseUrl = originalSrc.split('?')[0]
    return [
      `${baseUrl}?w=400&q=75 400w`,
      `${baseUrl}?w=800&q=75 800w`,
      `${baseUrl}?w=1200&q=75 1200w`
    ].join(', ')
  }

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  )
}
```

Este conjunto de exemplos de integração fornece uma base sólida para implementar o Blog Backend API em aplicações React/Vite e Next.js, com foco em performance, tratamento de erros e experiência do usuário.