'use client'

import React, { useState } from 'react'
import { SecureVideoPlayer } from '@/components/ui/SecureVideoPlayer'
import { type SecureVideoConfig } from '@/lib/video-security'

export default function TestSecurePlayerPage() {
  const [violations, setViolations] = useState<string[]>([])
  const [currentTest, setCurrentTest] = useState<'basic' | 'watermark' | 'protection'>('basic')

  // Configuração de teste - normalmente viria do banco de dados
  const testConfig: SecureVideoConfig = {
    videoId: 'test-video-1',
    userId: 'test-user-123',
    courseId: 'course-programacao',
    maxConcurrentViews: 2,
    allowDownload: false,
    allowScreenCapture: false,
    watermarkText: 'Escola Habilidade',
    expiresIn: 3600 // 1 hora
  }

  const handleViolation = (type: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setViolations(prev => [...prev, `${timestamp}: ${type}`])
  }

  const clearViolations = () => {
    setViolations([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🔒 Secure Video Player Test
          </h1>
          <p className="text-gray-300">
            Teste de segurança avançada do video player da Escola Habilidade
          </p>
        </div>

        {/* Test Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 rounded-lg p-1">
            {[
              { id: 'basic', label: '🎥 Player Básico' },
              { id: 'watermark', label: '💧 Com Watermark' },
              { id: 'protection', label: '🛡️ Proteção Total' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setCurrentTest(mode.id as any)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentTest === mode.id
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Video Player */}
          <div className="xl:col-span-3">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Video Player Seguro
              </h2>
              
              {currentTest === 'basic' && (
                <SecureVideoPlayer
                  config={testConfig}
                  onViolation={handleViolation}
                  enableWatermark={false}
                  enableScreenCaptureDetection={false}
                  enableRightClickProtection={false}
                  enableDevToolsDetection={false}
                  className="aspect-video"
                />
              )}

              {currentTest === 'watermark' && (
                <SecureVideoPlayer
                  config={testConfig}
                  onViolation={handleViolation}
                  enableWatermark={true}
                  enableScreenCaptureDetection={false}
                  enableRightClickProtection={false}
                  enableDevToolsDetection={false}
                  className="aspect-video"
                />
              )}

              {currentTest === 'protection' && (
                <SecureVideoPlayer
                  config={testConfig}
                  onViolation={handleViolation}
                  enableWatermark={true}
                  enableScreenCaptureDetection={true}
                  enableRightClickProtection={true}
                  enableDevToolsDetection={true}
                  className="aspect-video"
                />
              )}

              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-white font-medium mb-2">Configurações de Segurança Ativas:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className={`${currentTest === 'basic' ? 'text-gray-500' : 'text-green-400'}`}>
                    {currentTest === 'basic' ? '❌' : '✅'} Watermark Dinâmico
                  </div>
                  <div className={`${['basic', 'watermark'].includes(currentTest) ? 'text-gray-500' : 'text-green-400'}`}>
                    {['basic', 'watermark'].includes(currentTest) ? '❌' : '✅'} Proteção Clique Direito
                  </div>
                  <div className={`${['basic', 'watermark'].includes(currentTest) ? 'text-gray-500' : 'text-green-400'}`}>
                    {['basic', 'watermark'].includes(currentTest) ? '❌' : '✅'} Detecção DevTools
                  </div>
                  <div className={`${['basic', 'watermark'].includes(currentTest) ? 'text-gray-500' : 'text-green-400'}`}>
                    {['basic', 'watermark'].includes(currentTest) ? '❌' : '✅'} Detecção Screen Capture
                  </div>
                  <div className="text-green-400">✅ URLs Assinadas</div>
                  <div className="text-green-400">✅ Controle Concorrência</div>
                  <div className="text-green-400">✅ Rate Limiting</div>
                  <div className="text-green-400">✅ Logs de Auditoria</div>
                </div>
              </div>
            </div>

            {/* Security Tests */}
            <div className="mt-6 bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                🧪 Testes de Segurança
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Teste Manual:</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleViolation('manual_test')}
                      className="w-full px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                    >
                      🔍 Simular Violação
                    </button>
                    <button
                      onContextMenu={(e) => {
                        e.preventDefault()
                        handleViolation('right_click')
                      }}
                      className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      🖱️ Testar Clique Direito
                    </button>
                    <button
                      onClick={() => {
                        // Tentar abrir DevTools
                        const script = document.createElement('script')
                        script.textContent = 'debugger;'
                        document.head.appendChild(script)
                        document.head.removeChild(script)
                        handleViolation('devtools_test')
                      }}
                      className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      🔧 Testar DevTools
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">Instruções:</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>• Tente clicar com botão direito no vídeo</p>
                    <p>• Pressione F12 para abrir DevTools</p>
                    <p>• Tente Ctrl+U para ver código fonte</p>
                    <p>• Teste Ctrl+Shift+I para inspetor</p>
                    <p>• Tente fazer screenshot da tela</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Security Logs */}
          <div className="space-y-4">
            {/* Violation Logs */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-medium">🚨 Violações Detectadas</h3>
                <button
                  onClick={clearViolations}
                  className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Limpar
                </button>
              </div>
              <div className="h-48 overflow-y-auto bg-gray-900 rounded p-2">
                {violations.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma violação detectada</p>
                ) : (
                  violations.map((violation, index) => (
                    <div key={index} className="text-xs text-red-400 mb-1 font-mono">
                      {violation}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Security Stats */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">📊 Estatísticas</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Violações:</span>
                  <span className="text-red-400">{violations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sessão ativa:</span>
                  <span className="text-green-400">✅</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Watermarks:</span>
                  <span className="text-blue-400">{currentTest !== 'basic' ? '24' : '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Proteções:</span>
                  <span className="text-purple-400">
                    {currentTest === 'protection' ? '4/4' : currentTest === 'watermark' ? '1/4' : '0/4'}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">🛡️ Recursos Implementados</h3>
              <div className="space-y-1 text-sm text-gray-300">
                <div>✅ URLs temporárias assinadas</div>
                <div>✅ Watermarking dinâmico</div>
                <div>✅ Controle de concorrência</div>
                <div>✅ Rate limiting</div>
                <div>✅ Detecção de DevTools</div>
                <div>✅ Proteção contra clique direito</div>
                <div>✅ Detecção de screen capture</div>
                <div>✅ Logs de auditoria</div>
                <div>✅ Validação de dispositivo</div>
                <div>✅ Heartbeat de sessão</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">⚡ Ações Rápidas</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const report = violations.join('\n')
                    navigator.clipboard.writeText(report)
                    alert('Relatório copiado!')
                  }}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  📋 Copiar Logs
                </button>
                <button
                  onClick={() => {
                    clearViolations()
                    alert('Sessão reiniciada!')
                  }}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  🔄 Reiniciar Sessão
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}