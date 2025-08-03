import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate every hour

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readingTime: number;
  imageUrl?: string;
  tags: string[];
}

async function getCategories(): Promise<Category[]> {
  const mockModule = await import('@/services/blogMockData');
  return mockModule.mockCategories || [];
}

async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const mockModule = await import('@/services/blogMockData');
  const posts = mockModule.mockPosts || [];
  
  return posts
    .filter((post: any) => post.category.slug === categorySlug)
    .map((post: any) => ({
      ...post,
      id: post.id.toString(),
      publishedAt: post.publishedAt || new Date().toISOString()
    }));
}

async function getCategory(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(cat => cat.slug === slug) || null;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  
  return categories.map((category) => ({
    categoria: category.slug,
  }));
}

export async function generateMetadata({ params }: { params: { categoria: string } }): Promise<Metadata> {
  const category = await getCategory(params.categoria);
  
  if (!category) {
    return {
      title: 'Categoria não encontrada - Blog Escola Habilidade',
    };
  }
  
  return {
    title: `${category.name} - Blog Escola Habilidade`,
    description: category.description,
    openGraph: {
      title: `${category.name} - Blog Escola Habilidade`,
      description: category.description,
      type: 'website',
      url: `https://escolahabilidade.com.br/blog/categoria/${category.slug}`,
    },
    alternates: {
      canonical: `https://escolahabilidade.com.br/blog/categoria/${category.slug}`
    }
  };
}

export default async function CategoryPage({ params }: { params: { categoria: string } }) {
  const category = await getCategory(params.categoria);
  
  if (!category) {
    notFound();
  }
  
  const posts = await getPostsByCategory(params.categoria);
  
  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <header className="mb-12">
          <nav className="mb-6">
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
              <li className="text-white">{category.name}</li>
            </ol>
          </nav>
          
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ backgroundColor: category.color }}
            >
              {category.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {category.name}
              </h1>
              <p className="text-lg text-zinc-400 mt-2">
                {category.description}
              </p>
            </div>
          </div>
          
          <p className="text-zinc-300">
            {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'} encontrados
          </p>
        </header>
        
        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  {post.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
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
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-lg">
              Nenhum artigo encontrado nesta categoria.
            </p>
            <Link 
              href="/blog" 
              className="inline-block mt-4 text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Voltar para o blog
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}