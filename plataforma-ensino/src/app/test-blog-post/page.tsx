'use client';

import React from 'react';
import { BlogCard } from '@/components/blog-test/BlogCard';
import { ShareButtons } from '@/components/blog-test/ShareButtons';
import { ReadingProgress } from '@/components/blog-test/ReadingProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  mockPosts, 
  mockCourses,
  getRelatedPosts,
  type BlogPost 
} from '@/lib/blog-mockdata';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  User,
  ChevronRight
} from 'lucide-react';

export default function TestBlogPostPage() {
  // Using the first post as example
  const currentPost = mockPosts[0];
  const relatedPosts = getRelatedPosts(currentPost);
  const suggestedCourse = mockCourses.find(course => 
    course.name.toLowerCase().includes('design')
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress */}
      <ReadingProgress />

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container-custom px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="gap-2 hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao blog
            </Button>

            <div className="flex items-center gap-4">
              <ShareButtons variant="minimal" />
              <Button variant="outline" size="sm" className="gradient-button">
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom px-6 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <span>Blog</span>
            <ChevronRight className="w-4 h-4" />
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ backgroundColor: currentPost.category.color + '20', color: currentPost.category.color }}
            >
              {currentPost.category.name}
            </Badge>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground truncate">{currentPost.title}</span>
          </nav>

          {/* Article Header */}
          <article className="space-y-8">
            <header className="space-y-6">
              <div className="space-y-4">
                <Badge 
                  className="text-sm font-medium"
                  style={{ backgroundColor: currentPost.category.color }}
                >
                  {currentPost.category.name}
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text leading-tight">
                  {currentPost.title}
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                  {currentPost.excerpt}
                </p>
              </div>

              {/* Article Meta */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-card/30 backdrop-blur-sm rounded-lg border border-border/30">
                <div className="flex items-center gap-4">
                  <img
                    src={currentPost.author.avatar}
                    alt={currentPost.author.name}
                    className="w-12 h-12 rounded-full border-2 border-primary/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{currentPost.author.name}</span>
                      <span className="text-sm text-muted-foreground">"</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(currentPost.publishedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentPost.author.bio}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{currentPost.readingTime} min de leitura</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(currentPost.views)} visualizações</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{formatNumber(currentPost.likes)} curtidas</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={currentPost.image}
                alt={currentPost.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentPost.content }}
              />
              
              {/* Extended Content for Demo */}
              <div className="space-y-6 mt-8">
                <h2 className="text-2xl font-bold gradient-text">Aplicando as Tendências na Prática</h2>
                
                <p className="text-muted-foreground leading-relaxed">
                  Agora que exploramos as principais tendências de design gráfico para 2024, é hora de entender 
                  como aplicá-las de forma efetiva em seus projetos. Cada tendência tem seu contexto ideal e 
                  sua aplicação adequada.
                </p>

                <h3 className="text-xl font-semibold">1. Implementando Tipografia Experimental</h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  A tipografia experimental requer cuidado especial para manter a legibilidade. Comece com 
                  projetos onde a mensagem é simples e direta, como cartazes ou capas de livros. Use fontes 
                  experimentais apenas para títulos, mantendo o corpo do texto com fontes legíveis.
                </p>

                <blockquote className="border-l-4 border-primary pl-6 py-4 bg-card/30 rounded-r-lg">
                  <p className="text-lg font-medium italic text-foreground">
                    "O design não é apenas como algo parece ou como se sente. Design é como funciona."
                  </p>
                  <cite className="text-sm text-muted-foreground">- Steve Jobs</cite>
                </blockquote>

                <h3 className="text-xl font-semibold">2. Trabalhando com Cores Vibrantes</h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  Cores vibrantes podem transformar completamente a percepção de uma marca. No entanto, 
                  é essencial encontrar o equilíbrio certo. Use cores vibrantes como acentos, não como 
                  base principal do design.
                </p>

                <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                  <h4 className="font-semibold mb-3">Dica Prática:</h4>
                  <p className="text-sm text-muted-foreground">
                    Teste suas combinações de cores em diferentes dispositivos e condições de iluminação. 
                    O que parece vibrante na tela pode não ter o mesmo impacto quando impresso.
                  </p>
                </div>

                <h3 className="text-xl font-semibold">3. Design Sustentável em Ação</h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  O design sustentável vai além da escolha de materiais. Inclui decisões sobre durabilidade, 
                  reutilização e impacto ambiental. Considere criar designs atemporais que não precisem 
                  ser substituídos frequentemente.
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-border/30">
              <span className="text-sm font-medium text-muted-foreground mr-2">Tags:</span>
              {currentPost.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs hover:bg-primary/10 cursor-pointer">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Share Section */}
            <div className="pt-6 border-t border-border/30">
              <ShareButtons 
                url={`https://escolahabilidade.com.br/blog/${currentPost.slug}`}
                title={currentPost.title}
                description={currentPost.excerpt}
              />
            </div>

            {/* Call to Action */}
            {suggestedCourse && (
              <Card className="bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 border-border/50">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <img
                      src={suggestedCourse.image}
                      alt={suggestedCourse.name}
                      className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold mb-2">
                        Quer se aprofundar mais em Design Gráfico?
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {suggestedCourse.description}
                      </p>
                      <div className="flex items-center justify-center md:justify-start gap-4">
                        <Button className="gradient-button">
                          Conhecer o Curso
                        </Button>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-semibold text-primary">
                            R$ {suggestedCourse.price}
                          </span>
                          <span className="mx-1">"</span>
                          <span>{suggestedCourse.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl font-bold">Artigos Relacionados</h2>
                <Badge variant="secondary">{relatedPosts.length}</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <BlogCard key={post.id} post={post} variant="default" />
                ))}
              </div>
            </section>
          )}

          {/* Author Bio */}
          <Card className="mt-16 bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <img
                  src={currentPost.author.avatar}
                  alt={currentPost.author.name}
                  className="w-24 h-24 rounded-full border-4 border-primary/20 flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Sobre {currentPost.author.name}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {currentPost.author.bio}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    {Object.entries(currentPost.author.socialLinks).map(([platform, handle]) => (
                      <Button
                        key={platform}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs hover:scale-105 transition-all"
                      >
                        {platform === 'twitter' && '5O'}
                        {platform === 'linkedin' && 'in'}
                        {platform === 'instagram' && 'ig'}
                        <span className="ml-1">{handle}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Floating Share */}
      <ShareButtons variant="floating" />

      {/* Debug Info */}
      <div className="fixed bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg p-3 text-xs font-mono text-muted-foreground">
        <div>Página de Teste: Blog Post</div>
        <div>Post: {currentPost.title.substring(0, 20)}...</div>
        <div>Autor: {currentPost.author.name}</div>
        <div>Categoria: {currentPost.category.name}</div>
      </div>
    </div>
  );
}