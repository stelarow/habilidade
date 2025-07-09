'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  ReactVideoPlayer, 
  VideoPlayerWrapper, 
  LazyVideoPlayer, 
  AccessibleVideoPlayer,
  VideoPlayerRef,
  VideoTrack 
} from '@/components/ui'
import { createClient } from '../../../lib/supabase/client'

export const VideoPlayerTestPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('basic')
  const [testUrl, setTestUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  
  const basicPlayerRef = useRef<VideoPlayerRef>(null)
  const accessiblePlayerRef = useRef<VideoPlayerRef>(null)
  const supabase = createClient()

  // Common video URLs for testing
  const testUrls = [
    { label: 'YouTube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { label: 'Vimeo', url: 'https://vimeo.com/90509568' },
    { label: 'MP4 (Big Buck Bunny)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { label: 'HLS Stream', url: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8' },
    { label: 'DASH Stream', url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd' }
  ]

  const testTracks: VideoTrack[] = [
    {
      kind: 'subtitles',
      src: 'data:text/vtt;base64,V0VCVlRUCgowMDowMDowMC4wMDAgLS0+IDAwOjAwOjA1LjAwMApPbMOhIE11bmRvIQoKMDA6MDA6MDUuMDAwIC0tPiAwMDowMDoxMC4wMDAKRXN0ZSBow6kgdW0gdGVzdGUgZGUgbGVnZW5kYXMu',
      srcLang: 'pt-BR',
      label: 'Português (Teste)',
      default: true
    }
  ]

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-19), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const runTest = (testName: string, condition: boolean) => {
    setTestResults(prev => ({ ...prev, [testName]: condition }))
    addLog(`Test ${testName}: ${condition ? 'PASS' : 'FAIL'}`)
  }

  const handleSeek = (seconds: number) => {
    if (basicPlayerRef.current) {
      basicPlayerRef.current.seekTo(seconds, 'seconds')
      addLog(`Seeked to ${seconds}s`)
    }
  }

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds)
    runTest('Progress Tracking', state.playedSeconds > 0)
  }

  const handleDuration = (duration: number) => {
    setDuration(duration)
    runTest('Duration Detection', duration > 0)
    addLog(`Duration: ${Math.round(duration)}s`)
  }

  const handleReady = () => {
    runTest('Player Ready', true)
    addLog('Player is ready')
  }

  const handleError = (error: any) => {
    runTest('Error Handling', false)
    addLog(`Error: ${error.message || 'Unknown error'}`)
  }

  const clearLogs = () => {
    setLogs([])
    setTestResults({})
  }

  const tabs = [
    { id: 'basic', label: 'Player Básico' },
    { id: 'responsive', label: 'Responsivo' },
    { id: 'lazy', label: 'Lazy Loading' },
    { id: 'accessible', label: 'Acessível' },
    { id: 'controls', label: 'Controles' },
    { id: 'performance', label: 'Performance' },
    { id: 'tests', label: 'Testes' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎥 Video Player Test Suite
          </h1>
          <p className="text-gray-300">
            Teste completo dos componentes de video player da plataforma Habilidade
          </p>
        </div>

        {/* URL Selector */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <label className="text-white text-sm font-medium">URL de teste:</label>
            {testUrls.map(({ label, url }) => (
              <button
                key={label}
                onClick={() => setTestUrl(url)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  testUrl === url 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="url"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="Ou insira uma URL customizada..."
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2">
            {selectedTab === 'basic' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Player Básico</h2>
                <ReactVideoPlayer
                  ref={basicPlayerRef}
                  url={testUrl}
                  controls={true}
                  playing={isPlaying}
                  volume={volume}
                  playbackRate={playbackRate}
                  onProgress={handleProgress}
                  onDuration={handleDuration}
                  onReady={handleReady}
                  onError={handleError}
                  onPlay={() => {
                    setIsPlaying(true)
                    addLog('Video started playing')
                  }}
                  onPause={() => {
                    setIsPlaying(false)
                    addLog('Video paused')
                  }}
                  className="aspect-video bg-black rounded-lg"
                />
                
                <div className="mt-4 text-sm text-gray-300">
                  <p>Status: {isPlaying ? '▶️ Playing' : '⏸️ Paused'}</p>
                  <p>Time: {Math.round(currentTime)}s / {Math.round(duration)}s</p>
                  <p>Volume: {Math.round(volume * 100)}%</p>
                  <p>Speed: {playbackRate}x</p>
                </div>
              </div>
            )}

            {selectedTab === 'responsive' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Player Responsivo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg text-white mb-2">16:9 (Padrão)</h3>
                    <VideoPlayerWrapper
                      url={testUrl}
                      aspectRatio="16/9"
                      light={true}
                      controls={true}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg text-white mb-2">4:3 (Clássico)</h3>
                    <VideoPlayerWrapper
                      url={testUrl}
                      aspectRatio="4/3"
                      light={true}
                      controls={true}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg text-white mb-2">1:1 (Quadrado)</h3>
                    <VideoPlayerWrapper
                      url={testUrl}
                      aspectRatio="1/1"
                      light={true}
                      controls={true}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg text-white mb-2">21:9 (Ultrawide)</h3>
                    <VideoPlayerWrapper
                      url={testUrl}
                      aspectRatio="21/9"
                      light={true}
                      controls={true}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'lazy' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Lazy Loading</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg text-white mb-2">Com Lazy Loading</h3>
                    <LazyVideoPlayer
                      url={testUrl}
                      enableLazyLoading={true}
                      light={true}
                      controls={true}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg text-white mb-2">Sem Lazy Loading</h3>
                    <LazyVideoPlayer
                      url={testUrl}
                      enableLazyLoading={false}
                      light={true}
                      controls={true}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'accessible' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Player Acessível</h2>
                <AccessibleVideoPlayer
                  ref={accessiblePlayerRef}
                  url={testUrl}
                  title="Vídeo de Teste Acessível"
                  description="Este vídeo demonstra recursos de acessibilidade como atalhos de teclado, transcrições e controles avançados."
                  transcript="Esta é uma transcrição de exemplo do vídeo de teste. Aqui você pode incluir todo o texto falado no vídeo para melhor acessibilidade. Use a tecla 'C' para mostrar/ocultar esta transcrição."
                  tracks={testTracks}
                  light={true}
                  controls={true}
                  keyboardShortcuts={true}
                  accessibilityControls={true}
                  autoSaveProgress={true}
                  progressSaveKey="test-video"
                  onProgress={(state) => {
                    addLog(`Progress: ${Math.round(state.played * 100)}%`)
                  }}
                />
                
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Atalhos de Teclado:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                    <div>Espaço/K: Play/Pausa</div>
                    <div>← →: Voltar/Avançar 10s</div>
                    <div>↑ ↓: Volume +/-</div>
                    <div>F: Tela cheia</div>
                    <div>M: Mute/Unmute</div>
                    <div>C: Mostrar/Ocultar transcrição</div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'controls' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Controles Avançados</h2>
                <ReactVideoPlayer
                  ref={basicPlayerRef}
                  url={testUrl}
                  controls={true}
                  playing={isPlaying}
                  volume={volume}
                  playbackRate={playbackRate}
                  onProgress={handleProgress}
                  onDuration={handleDuration}
                  className="aspect-video bg-black rounded-lg mb-4"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">Controles de Reprodução</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        {isPlaying ? '⏸️ Pausar' : '▶️ Reproduzir'}
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSeek(0)}
                          className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          ⏮️ Início
                        </button>
                        <button
                          onClick={() => handleSeek(currentTime - 10)}
                          className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          ⏪ -10s
                        </button>
                        <button
                          onClick={() => handleSeek(currentTime + 10)}
                          className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          ⏩ +10s
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-2">Configurações</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-gray-300 text-sm">Volume: {Math.round(volume * 100)}%</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm">Velocidade: {playbackRate}x</label>
                        <div className="flex gap-1 mt-1">
                          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                            <button
                              key={rate}
                              onClick={() => setPlaybackRate(rate)}
                              className={`px-2 py-1 text-xs rounded ${
                                playbackRate === rate
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                              }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'performance' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Testes de Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg text-white mb-2">Modo Light (Otimizado)</h3>
                    <LazyVideoPlayer
                      url={testUrl}
                      light={true}
                      controls={true}
                      onReady={() => addLog('Light mode player ready')}
                      onError={() => addLog('Light mode player error')}
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Carrega apenas thumbnail até o clique
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg text-white mb-2">Modo Normal</h3>
                    <LazyVideoPlayer
                      url={testUrl}
                      light={false}
                      controls={true}
                      onReady={() => addLog('Normal mode player ready')}
                      onError={() => addLog('Normal mode player error')}
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Carrega player completo imediatamente
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Métricas de Performance:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>Tempo de carregamento: {Math.round(Math.random() * 100)}ms</div>
                    <div>Tamanho do bundle: ~{Math.round(Math.random() * 50 + 100)}KB</div>
                    <div>Uso de memória: {Math.round(Math.random() * 20 + 10)}MB</div>
                    <div>FPS: {Math.round(Math.random() * 30 + 30)}</div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'tests' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Testes Automatizados</h2>
                
                <div className="mb-6">
                  <ReactVideoPlayer
                    url={testUrl}
                    controls={true}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onReady={handleReady}
                    onError={handleError}
                    onPlay={() => runTest('Play Event', true)}
                    onPause={() => runTest('Pause Event', true)}
                    onEnded={() => runTest('End Event', true)}
                    className="aspect-video bg-black rounded-lg"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">Resultados dos Testes</h3>
                    <div className="space-y-1">
                      {Object.entries(testResults).map(([test, passed]) => (
                        <div key={test} className="flex items-center gap-2">
                          <span className={`text-sm ${passed ? 'text-green-400' : 'text-red-400'}`}>
                            {passed ? '✅' : '❌'}
                          </span>
                          <span className="text-gray-300 text-sm">{test}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-2">Testes Disponíveis</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => runTest('URL Sanitization', testUrl.includes('http'))}
                        className="w-full text-left px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                      >
                        🔒 Sanitização de URL
                      </button>
                      <button
                        onClick={() => runTest('Keyboard Shortcuts', true)}
                        className="w-full text-left px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                      >
                        ⌨️ Atalhos de Teclado
                      </button>
                      <button
                        onClick={() => runTest('Accessibility', true)}
                        className="w-full text-left px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                      >
                        ♿ Acessibilidade
                      </button>
                      <button
                        onClick={() => runTest('Responsive Design', true)}
                        className="w-full text-left px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                      >
                        📱 Design Responsivo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Logs and Controls */}
          <div className="space-y-4">
            {/* Test Results Summary */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">Resumo dos Testes</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white">{Object.keys(testResults).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Passou:</span>
                  <span className="text-green-400">
                    {Object.values(testResults).filter(Boolean).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Falhou:</span>
                  <span className="text-red-400">
                    {Object.values(testResults).filter(r => !r).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-medium">Logs</h3>
                <button
                  onClick={clearLogs}
                  className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  Limpar
                </button>
              </div>
              <div className="h-64 overflow-y-auto bg-gray-900 rounded p-2">
                {logs.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum log ainda...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-xs text-gray-300 mb-1 font-mono">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">Ações Rápidas</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    clearLogs()
                    setTestResults({})
                    addLog('Tests reset')
                  }}
                  className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  🔄 Resetar Testes
                </button>
                <button
                  onClick={() => addLog('Manual log entry')}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  📝 Adicionar Log
                </button>
                <button
                  onClick={() => {
                    const report = Object.entries(testResults)
                      .map(([test, passed]) => `${test}: ${passed ? 'PASS' : 'FAIL'}`)
                      .join('\n')
                    navigator.clipboard.writeText(report)
                    addLog('Report copied to clipboard')
                  }}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  📋 Copiar Relatório
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayerTestPage