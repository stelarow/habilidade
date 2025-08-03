import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/supabase/blog';

async function getPost(slug: string) {
  try {
    const post = await getBlogPostBySlug(slug);
    return post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    // Fallback to mock data if Supabase fails
    const mockModule = await import('@/services/blogMockData');
    const posts = mockModule.mockPosts || mockModule.default?.posts || [];
    
    const post = posts.find((p: any) => p.slug === slug);
    
    if (!post) return null;
    
    return {
      ...post,
      id: post.id.toString(),
      publishedAt: post.publishedAt || new Date().toISOString(),
      author: {
        ...post.author,
        avatar_url: post.author.avatar
      }
    };
  }
}

async function getAllPosts() {
  try {
    const posts = await getBlogPosts(100); // Get first 100 posts for static generation
    return posts;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    // Fallback to mock data
    const mockModule = await import('@/services/blogMockData');
    const posts = mockModule.mockPosts || mockModule.default?.posts || [];
    
    return posts.map((post: any) => ({
      ...post,
      id: post.id.toString(),
      publishedAt: post.publishedAt || new Date().toISOString()
    }));
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post não encontrado - Blog Escola Habilidade',
    };
  }
  
  return {
    title: `${post.title} - Blog Escola Habilidade`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: post.imageUrl ? [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    alternates: {
      canonical: `https://escolahabilidade.com.br/blog/${post.slug}`
    },
    keywords: post.tags.join(', '),
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  // Schema.org structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Escola Habilidade',
      logo: {
        '@type': 'ImageObject',
        url: 'https://escolahabilidade.com.br/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://escolahabilidade.com.br/blog/${post.slug}`,
    },
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className="min-h-screen bg-zinc-950">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-zinc-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-zinc-600">/</li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li className="text-zinc-600">/</li>
              <li>
                <Link 
                  href={`/blog/categoria/${post.category.slug}`} 
                  className="hover:text-white transition-colors"
                  style={{ color: post.category.color }}
                >
                  {post.category.name}
                </Link>
              </li>
            </ol>
          </nav>
          
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <img 
                src={post.author.avatar_url || post.author.avatar} 
                alt={post.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-white font-medium">{post.author.name}</p>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </time>
                  <span>•</span>
                  <span>{post.readingTime} min de leitura</span>
                  <span>•</span>
                  <span>{post.views} visualizações</span>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag}`}
                  className="px-3 py-1 text-sm bg-zinc-800 text-zinc-300 rounded-full hover:bg-zinc-700 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </header>
          
          {/* Featured Image */}
          {post.imageUrl && (
            <div className="mb-12 rounded-xl overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}
          
          {/* Content */}
          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Share buttons */}
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">Compartilhe este artigo</h3>
            <div className="flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://escolahabilidade.com.br/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://escolahabilidade.com.br/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://escolahabilidade.com.br/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}