import React from 'react';
import { ArrowRight, Newspaper, Star } from 'phosphor-react';
import { usePosts } from '../hooks/useBlogAPI';
import BlogCard from './blog/BlogCard';
import Loading from './Loading';
import Section from './Section';

const LatestBlogSection = () => {
  // Buscar os últimos 3 artigos do blog
  const { data, isLoading, error } = usePosts(1, 3);

  if (isLoading) {
    return (
      <Section className="bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="h-8 bg-zinc-700/50 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-zinc-700/30 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <Loading />
        </div>
      </Section>
    );
  }

  if (error || !data?.posts?.length) {
    return null; // Não exibir a seção se não há posts
  }

  const posts = data.posts;

  return (
    <Section className="bg-zinc-900/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-purple-400/20 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-blue-400/20 rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 border border-pink-400/20 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl">
              <Newspaper size={24} className="text-purple-400" />
            </div>
            <Star size={20} className="text-yellow-400 animate-pulse" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
            Últimas{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Novidades
            </span>
          </h2>
          
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Fique por dentro das últimas tendências em tecnologia, dicas de carreira e novidades do mercado digital
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 md:gap-8 mb-10">
          {/* Featured Article (First post) */}
          {posts[0] && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-300 mb-6 flex items-center gap-2">
                <Star size={20} className="text-yellow-400" />
                Artigo em Destaque
              </h3>
              <div className="max-w-4xl mx-auto">
                <BlogCard post={posts[0]} variant="featured" />
              </div>
            </div>
          )}

          {/* Other Articles */}
          {posts.length > 1 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-6 flex items-center gap-2">
                <Newspaper size={20} className="text-purple-400" />
                Mais Artigos
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {posts.slice(1).map((post, index) => (
                  <BlogCard 
                    key={post.slug} 
                    post={post} 
                    variant="compact"
                    index={index + 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl border border-purple-500/20 backdrop-blur-sm hover:from-purple-600/30 hover:to-blue-600/30 hover:border-purple-500/40 transition-all duration-300 group">
            <a 
              href="/blog" 
              className="flex items-center gap-3 text-lg font-semibold text-zinc-100 group-hover:text-purple-300 transition-colors"
            >
              Ver Todos os Artigos
              <ArrowRight 
                size={20} 
                className="group-hover:translate-x-1 transition-transform duration-300" 
              />
            </a>
          </div>
          
          <p className="text-sm text-zinc-500 mt-4">
            Explore nossa biblioteca completa de artigos sobre tecnologia e carreira
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-center items-center gap-8 mt-12 pt-8 border-t border-zinc-700/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">50+</div>
            <div className="text-sm text-zinc-500">Artigos</div>
          </div>
          <div className="w-px h-8 bg-zinc-700/50"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">5</div>
            <div className="text-sm text-zinc-500">Categorias</div>
          </div>
          <div className="w-px h-8 bg-zinc-700/50"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">Semanal</div>
            <div className="text-sm text-zinc-500">Atualizações</div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default LatestBlogSection;