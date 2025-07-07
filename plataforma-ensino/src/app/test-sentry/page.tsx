'use client';

import * as Sentry from '@sentry/nextjs';

export default function TestSentryPage() {
  const testClientError = () => {
    throw new Error('Teste de erro no cliente - Sentry funcionando!');
  };

  const testSentryCapture = () => {
    Sentry.captureException(new Error('Teste manual do Sentry'));
    alert('Erro enviado para o Sentry!');
  };

  const testServerError = async () => {
    try {
      await fetch('/api/test-error');
    } catch (error) {
      console.error('Erro do servidor:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Teste do Sentry
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={testClientError}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Testar Erro do Cliente
          </button>
          
          <button
            onClick={testSentryCapture}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Testar Capture Manual
          </button>
          
          <button
            onClick={testServerError}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Testar Erro do Servidor
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p>Use estes botões para testar se o Sentry está funcionando corretamente.</p>
        </div>
      </div>
    </div>
  );
}