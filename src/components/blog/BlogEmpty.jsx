import React from 'react';
import { MagnifyingGlass, FileText, Funnel, House } from 'phosphor-react';
import { Link } from 'react-router-dom';

const BlogEmpty = ({ hasFilters, onClearFilters }) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        {/* Empty State Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-zinc-700/30 rounded-full flex items-center justify-center">
            {hasFilters ? (
              <Funnel size={48} className="text-zinc-500" />
            ) : (
              <FileText size={48} className="text-zinc-500" />
            )}
          </div>
          <div className="text-4xl mb-2">
            {hasFilters ? '=' : '=Ý'}
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">
            {hasFilters ? 'Nenhum artigo encontrado' : 'Ainda não temos artigos'}
          </h1>
          
          <p className="text-zinc-400 text-lg leading-relaxed">
            {hasFilters 
              ? 'Não encontramos artigos que correspondam aos seus filtros. Tente ajustar sua busca ou remover alguns filtros.'
              : 'Estamos trabalhando para trazer conteúdo incrível para você. Em breve teremos artigos sobre tecnologia, educação e carreira.'
            }
          </p>
        </div>

        {/* Action Buttons */}
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
            Voltar ao Início
          </Link>
        </div>

        {/* Suggestions */}
        {hasFilters && (
          <div className="mt-8 pt-6 border-t border-zinc-700">
            <p className="text-sm text-zinc-500 mb-4">Sugestões:</p>
            <ul className="text-sm text-zinc-400 space-y-2">
              <li>" Tente termos de busca mais gerais</li>
              <li>" Verifique se não há erros de digitação</li>
              <li>" Experimente categorias diferentes</li>
              <li>" Remova filtros para ver todos os artigos</li>
            </ul>
          </div>
        )}

        {/* Coming Soon */}
        {!hasFilters && (
          <div className="mt-8 pt-6 border-t border-zinc-700">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
              <p className="text-sm text-purple-300 font-medium mb-2">
                <¯ Em breve
              </p>
              <p className="text-xs text-zinc-400">
                Artigos sobre programação, design, marketing digital e muito mais!
              </p>
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="mt-8">
          <p className="text-xs text-zinc-500">
            Tem alguma sugestão de artigo? Entre em contato pelo{' '}
            <a 
              href="https://wa.me/5548988559491"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogEmpty;