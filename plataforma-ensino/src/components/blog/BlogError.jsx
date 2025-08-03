import React from 'react';
import { WarningCircle, ArrowCounterClockwise, House } from 'phosphor-react';
import { Link } from 'react-router-dom';

const BlogError = ({ error, onRetry }) => {
  // Determine error type and customize message
  const getErrorInfo = () => {
    const errorMessage = error?.message || 'Erro desconhecido';
    
    if (errorMessage.includes('indisponivel') || errorMessage.includes('ECONNREFUSED')) {
      return {
        title: 'Servidor Temporariamente Indisponível',
        description: 'Nosso servidor está passando por manutenção. Tente novamente em alguns minutos.',
        icon: '™',
        showRetry: true,
      };
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('rede')) {
      return {
        title: 'Problema de Conexão',
        description: 'Verifique sua conexão com a internet e tente novamente.',
        icon: '<',
        showRetry: true,
      };
    }
    
    if (errorMessage.includes('404') || errorMessage.includes('nao encontrado')) {
      return {
        title: 'Conteúdo Não Encontrado',
        description: 'Os artigos que você está procurando não foram encontrados.',
        icon: '=Ä',
        showRetry: false,
      };
    }
    
    return {
      title: 'Erro Inesperado',
      description: 'Algo deu errado ao carregar os artigos. Tente novamente.',
      icon: ' ',
      showRetry: true,
    };
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
            <WarningCircle size={48} className="text-red-400" />
          </div>
          <div className="text-4xl mb-2">{errorInfo.icon}</div>
        </div>

        {/* Error Content */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">
            {errorInfo.title}
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-2">
            {errorInfo.description}
          </p>
          
          {/* Technical error details (in development) */}
          {process.env.NODE_ENV === 'development' && error?.message && (
            <details className="mt-4 text-left">
              <summary className="text-sm text-zinc-500 cursor-pointer hover:text-zinc-400">
                Detalhes técnicos
              </summary>
              <div className="mt-2 p-3 bg-zinc-800 rounded-lg text-xs text-zinc-400 font-mono">
                {error.message}
              </div>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {errorInfo.showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors w-full justify-center"
            >
              <ArrowCounterClockwise size={20} />
              Tentar Novamente
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

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-zinc-700">
          <p className="text-sm text-zinc-500">
            Se o problema persistir, entre em contato conosco através do{' '}
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

export default BlogError;