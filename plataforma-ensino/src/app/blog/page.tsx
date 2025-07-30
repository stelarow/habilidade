'use client';

import React from 'react';
import BlogErrorBoundary from '@/components/blog/BlogErrorBoundary';

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <BlogErrorBoundary fallbackType="generic">
        <section className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog Escola Habilidade
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conteúdo especializado em educação profissional, desenvolvimento de carreira 
            e tendências do mercado de trabalho.
          </p>
        </section>
      </BlogErrorBoundary>

      {/* Featured Posts */}
      <BlogErrorBoundary fallbackType="list">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Artigos em Destaque
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Sample featured posts - would be replaced with dynamic content */}
            {[1, 2, 3].map((i) => (
              <BlogErrorBoundary key={i} fallbackType="post">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100"></div>
                  <div className="p-6">
                    <span className="text-sm text-purple-600 font-medium">Carreira</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-3">
                      Como se destacar no mercado de trabalho
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Estratégias essenciais para profissionais que querem se destacar...
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>5 min de leitura</span>
                      <span>15 de janeiro, 2024</span>
                    </div>
                  </div>
                </div>
              </BlogErrorBoundary>
            ))}
          </div>
        </section>
      </BlogErrorBoundary>

      {/* Recent Posts */}
      <BlogErrorBoundary fallbackType="list">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Artigos Recentes
          </h2>
          
          <div className="space-y-6">
            {/* Sample recent posts - would be replaced with dynamic content */}
            {[1, 2, 3, 4, 5].map((i) => (
              <BlogErrorBoundary key={i} fallbackType="post">
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-purple-600 font-medium">Educação</span>
                        <span className="text-gray-400">"</span>
                        <span className="text-sm text-gray-500">8 min de leitura</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Tendências em educação profissional para 2024
                      </h3>
                      <p className="text-gray-600 mb-3">
                        O que esperar do futuro da educação e capacitação profissional...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">12 de janeiro, 2024</span>
                        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                          Ler mais →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </BlogErrorBoundary>
            ))}
          </div>
        </section>
      </BlogErrorBoundary>

      {/* Categories */}
      <BlogErrorBoundary fallbackType="category">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Explore por Categoria
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Carreira', count: 35, color: 'bg-blue-500' },
              { name: 'Educação', count: 28, color: 'bg-green-500' },
              { name: 'Tecnologia', count: 22, color: 'bg-purple-500' },
              { name: 'Desenvolvimento', count: 18, color: 'bg-orange-500' },
              { name: 'Negócios', count: 17, color: 'bg-red-500' },
              { name: 'Mercado', count: 14, color: 'bg-indigo-500' }
            ].map((category) => (
              <BlogErrorBoundary key={category.name} fallbackType="category">
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className={`w-12 h-12 ${category.color} rounded-lg mb-4 flex items-center justify-center`}>
                    <span className="text-white font-semibold">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {category.count} artigos especializados
                  </p>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Ver artigos →
                  </button>
                </div>
              </BlogErrorBoundary>
            ))}
          </div>
        </section>
      </BlogErrorBoundary>

      {/* Newsletter CTA */}
      <BlogErrorBoundary fallbackType="generic">
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Não perca nenhum conteúdo
          </h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Receba os melhores artigos sobre educação profissional e desenvolvimento 
            de carreira direto no seu email.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Seu melhor email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Assinar
            </button>
          </div>
        </section>
      </BlogErrorBoundary>
    </div>
  );
}