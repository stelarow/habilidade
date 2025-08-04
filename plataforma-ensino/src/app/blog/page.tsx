import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - Escola Habilidade',
  description: 'Artigos e tutoriais sobre tecnologia, programação, design e arquitetura',
  openGraph: {
    title: 'Blog - Escola Habilidade',
    description: 'Artigos e tutoriais sobre tecnologia, programação, design e arquitetura',
    type: 'website',
    url: 'https://escolahabilidade.com.br/blog',
    images: [
      {
        url: '/images/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog Escola Habilidade'
      }
    ]
  },
  alternates: {
    canonical: 'https://escolahabilidade.com.br/blog'
  }
};

export const revalidate = 3600; // Revalidate every hour

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: {
    name: string;
    slug: string;
    color: string;
  };
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readingTime: number;
  imageUrl?: string;
  tags: string[];
}

import { getBlogPosts } from '@/lib/supabase/blog';

async function getPosts() {
  try {
    const posts = await getBlogPosts(50); // Get first 50 posts
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Fallback to mock data if Supabase fails
    const mockModule = await import('@/services/blogMockData');
    const posts = mockModule.mockPosts || mockModule.default?.posts || [];
    
    return posts.map((post: any) => ({
      ...post,
      id: post.id.toString(),
      publishedAt: post.publishedAt || new Date().toISOString()
    }));
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl">
            Explore nossos artigos sobre tecnologia, programação, design e arquitetura. 
            Aprenda com tutoriais práticos e fique por dentro das últimas tendências.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                {post.imageUrl && (
                  <div className="aspect-video overflow-hidden bg-zinc-800">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/666666?text=Escola+Habilidade';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span 
                      className="px-3 py-1 text-xs font-medium rounded-full"
                      style={{ 
                        backgroundColor: `${post.category.color}20`,
                        color: post.category.color 
                      }}
                    >
                      {post.category.name}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {post.readingTime} min de leitura
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-3">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-sm">
                      <p className="text-zinc-300">{post.author.name}</p>
                      <time className="text-zinc-500">
                        {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                      </time>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}