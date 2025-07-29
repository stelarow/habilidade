import React from 'react';
import { MagnifyingGlass, FileText, Funnel, House } from 'phosphor-react';
import { Link } from 'react-router-dom';

const BlogEmpty = ({ hasFilters, onClearFilters }) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-zinc-700/30 rounded-full flex items-center justify-center">
            {hasFilters ? (
              <Funnel size={48} className="text-zinc-500" />
            ) : (
              <FileText size={48} className="text-zinc-500" />
            )}
          </div>
          <div className="text-4xl mb-2">
            {hasFilters ? '🔍' : '📝'}
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">
            {hasFilters ? 'Nenhum artigo encontrado' : 'Ainda não temos artigos'}
          </h1>
          
          <p className="text-zinc-400 text-lg leading-relaxed">
            {hasFilters 
              ? 'Tente ajustar os filtros para encontrar o conteúdo que você está procurando.'
              : 'Estamos trabalhando em novos conteúdos incríveis para você. Fique ligado\!'
            }
          </p>
        </div>

        <div className="space-y-4">
          {hasFilters && onClearFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors w-full justify-center"
            >
              <MagnifyingGlass size={20} />
              Limpar Filtros
            </button>
          )}
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg font-medium transition-colors w-full justify-center"
          >
            <House size={20} />
            Ver Cursos
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-700">
          <p className="text-sm text-zinc-500">
            Que tal conhecer nossos{' '}
            <Link 
              to="/" 
              className="text-purple-400 hover:text-purple-300 underline"
            >
              cursos disponíveis
            </Link>
            {' '}enquanto aguarda novos artigos?
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogEmpty;
EOF < /dev/null
