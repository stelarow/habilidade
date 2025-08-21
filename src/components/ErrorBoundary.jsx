import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Capture DOM-related errors that often occur with React 19 + Suspense
    const isDOMError = error.message && (
      error.message.includes('removeChild') ||
      error.message.includes('insertBefore') ||
      error.message.includes('appendChild') ||
      error.message.includes('clearSuspenseBoundary') ||
      error.message.includes('Node') ||
      error.message.includes('not a child of this node')
    );

    if (isDOMError) {
      console.warn('[ErrorBoundary] DOM Error caught and silently handled:', error.message);
      // For DOM errors, don't show error UI - just continue silently
      return { hasError: false };
    }

    // For other errors, show the error UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para monitoramento
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Aqui você pode enviar o erro para um serviço de monitoramento
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // UI de fallback customizada
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo, this.handleReset);
      }

      // UI de fallback padrão
      return (
        <div className="min-h-screen bg-gradient-radial from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Algo deu errado
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para corrigir o problema.
              </p>
              
              {/* Mostrar detalhes do erro apenas em desenvolvimento */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
                  <h3 className="text-red-400 font-semibold mb-2">Detalhes do erro (apenas em desenvolvimento):</h3>
                  <pre className="text-red-300 text-sm overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="text-red-300 text-xs mt-2 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-500 text-blue-400 font-semibold rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  onError: PropTypes.func,
};

ErrorBoundary.defaultProps = {
  fallback: null,
  onError: null,
};

export default ErrorBoundary; 