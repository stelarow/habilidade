import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Eye, Heart, MessageCircle, User, Share2, Twitter, Facebook, Linkedin, WhatsApp, Copy, Check } from 'lucide-react';

// Mock post data
const mockPost = {
  id: 1,
  title: 'As 10 Tendências de Design Gráfico para 2024',
  excerpt: 'Descubra as principais tendências que estão moldando o design gráfico em 2024 e como aplicá-las em seus projetos.',
  content: `
    <h2>Introdução</h2>
    <p>O design gráfico está em constante evolução, e 2024 trouxe tendências fascinantes que estão redefinindo a forma como criamos e comunicamos visualmente. Neste artigo, vamos explorar as 10 principais tendências que estão moldando o cenário atual.</p>
    
    <h2>1. Minimalismo Expressivo</h2>
    <p>O minimalismo continua forte, mas agora com um toque mais expressivo e emocional. Designers estão combinando espaços em branco com elementos ousados que transmitem personalidade e impacto visual.</p>
    
    <h2>2. Cores Vibrantes e Gradientes</h2>
    <p>Paletas de cores ousadas e gradientes dinâmicos estão dominando o cenário. Cores saturadas e contrastes altos criam designs que se destacam na multidão digital.</p>
    
    <h2>3. Tipografia Experimental</h2>
    <p>Fontes personalizadas e tipografia experimental estão ganhando espaço. Designers estão explorando novas formas de comunicar através da tipografia, criando experiências únicas.</p>
    
    <h2>4. Ilustrações 3D e Renderizações</h2>
    <p>O uso de elementos 3D e renderizações realistas está crescendo. Essas técnicas adicionam profundidade e modernidade aos projetos.</p>
    
    <h2>5. Design Sustentável</h2>
    <p>A consciência ambiental está influenciando o design gráfico. Materiais eco-friendly e processos sustentáveis estão se tornando prioridade.</p>
    
    <h2>Conclusão</h2>
    <p>Essas tendências mostram como o design gráfico está evoluindo para ser mais inclusivo, sustentável e tecnologicamente avançado. O importante é adaptar essas tendências ao contexto de cada projeto.</p>
  `,
  category: 'Design Gráfico',
  author: {
    name: 'Mariana Silva',
    avatar: '/placeholder-avatar.jpg',
    bio: 'Designer gráfica e educadora, especialista em metodologias ativas de aprendizagem.'
  },
  publishedAt: '2024-01-15',
  readingTime: 8,
  views: 1247,
  likes: 89,
  comments: 23,
  image: '/placeholder-blog.jpg',
  tags: ['design', 'tendências', 'cores', 'tipografia']
};

const relatedPosts = [
  {
    id: 2,
    title: 'UX/UI Design: Princípios Fundamentais para Iniciantes',
    excerpt: 'Aprenda os princípios básicos de UX/UI Design e como aplicá-los em seus projetos.',
    category: 'Design Gráfico',
    readingTime: 11,
    image: '/placeholder-blog.jpg'
  },
  {
    id: 3,
    title: 'Como Criar uma Identidade Visual Marcante',
    excerpt: 'Passo a passo para desenvolver uma identidade visual que se destaca no mercado.',
    category: 'Design Gráfico',
    readingTime: 9,
    image: '/placeholder-blog.jpg'
  },
  {
    id: 4,
    title: 'Ferramentas Essenciais para Designers em 2024',
    excerpt: 'Conheça as principais ferramentas que todo designer deve dominar atualmente.',
    category: 'Design Gráfico',
    readingTime: 6,
    image: '/placeholder-blog.jpg'
  }
];

export default function TestBlogPost() {
  const [readingProgress, setReadingProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const article = document.getElementById('article-content');
      if (!article) return;

      const { top, height } = article.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const start = -top;
      const end = height - windowHeight;
      const progress = Math.min(Math.max(start / end, 0), 1);
      
      setReadingProgress(progress * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(mockPost.title);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar ao Blog</span>
            </button>
            
            <div className="flex items-center gap-4">
              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 bg-zinc-800 hover:bg-blue-600 rounded-lg transition-colors"
                  title="Compartilhar no Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 bg-zinc-800 hover:bg-blue-700 rounded-lg transition-colors"
                  title="Compartilhar no Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 bg-zinc-800 hover:bg-blue-800 rounded-lg transition-colors"
                  title="Compartilhar no LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-zinc-800 hover:bg-purple-600 rounded-lg transition-colors"
                  title="Copiar link"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            {/* Breadcrumb */}
            <nav className="text-sm text-zinc-400 mb-6">
              <span>Blog</span>
              <span className="mx-2">›</span>
              <span>{mockPost.category}</span>
              <span className="mx-2">›</span>
              <span className="text-zinc-300">Artigo</span>
            </nav>

            {/* Category Badge */}
            <span className="inline-block px-4 py-2 bg-purple-600/20 text-purple-400 text-sm font-medium rounded-full mb-6">
              {mockPost.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-6 leading-tight">
              {mockPost.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
              {mockPost.excerpt}
            </p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Por {mockPost.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(mockPost.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{mockPost.readingTime} min de leitura</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{formatViews(mockPost.views)} visualizações</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center mb-12">
              <span className="text-zinc-400">Imagem em Destaque</span>
            </div>
          </header>

          {/* Article Content */}
          <article 
            id="article-content"
            className="prose prose-invert prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: mockPost.content }}
          />

          {/* Article Footer */}
          <footer className="border-t border-zinc-800 pt-8 mb-12">
            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-zinc-50 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {mockPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    liked 
                      ? 'bg-red-600 text-white' 
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  <span>{mockPost.likes + (liked ? 1 : 0)}</span>
                </button>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg">
                  <MessageCircle className="w-4 h-4" />
                  <span>{mockPost.comments} comentários</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-sm">Compartilhar:</span>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="p-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors"
                  title="Compartilhar no WhatsApp"
                >
                  <WhatsApp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Author Info */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 mb-12">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-zinc-50 mb-1">
                    {mockPost.author.name}
                  </h4>
                  <p className="text-zinc-400 text-sm mb-3">
                    {mockPost.author.bio}
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs rounded-full">
                      Coordenadora de Design
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </footer>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-lg p-8 mb-12 text-center">
            <h3 className="text-2xl font-bold text-zinc-50 mb-4">
              Quer aprender mais sobre Design Gráfico?
            </h3>
            <p className="text-zinc-400 mb-6">
              Explore nosso curso completo e desenvolva suas habilidades profissionais com projetos práticos.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all">
              Ver Curso de Design Gráfico
            </button>
          </div>

          {/* Related Posts */}
          <section>
            <h3 className="text-2xl font-bold text-zinc-50 mb-8">Artigos Relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all group cursor-pointer"
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                    <span className="text-zinc-400 text-sm">Imagem</span>
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-purple-600/20 text-purple-400 text-xs font-medium rounded mb-2">
                      {post.category}
                    </span>
                    <h4 className="text-lg font-semibold text-zinc-50 mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime}min
                      </span>
                      <span>Leia mais →</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}