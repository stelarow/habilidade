'use client'

import React, { useRef, useState } from 'react'
import { ReactVideoPlayer, VideoPlayerRef } from '../ui/ReactVideoPlayer'
import { VideoPlayerWrapper } from '../ui/VideoPlayerWrapper'
import { LazyVideoPlayer } from '../ui/LazyVideoPlayer'
import { AccessibleVideoPlayer } from '../ui/AccessibleVideoPlayer'
import { LessonVideoPlayer } from '../course/LessonVideoPlayer'

export const VideoPlayerExamples: React.FC = () => {
  const playerRef = useRef<VideoPlayerRef>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds')
    }
  }

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds)
  }

  const handleDuration = (duration: number) => {
    setDuration(duration)
  }

  const sampleTracks = [
    {
      kind: 'subtitles' as const,
      src: '/path/to/subtitles.vtt',
      srcLang: 'pt-BR',
      label: 'Português',
      default: true
    }
  ]

  const sampleLesson = {
    id: 'lesson-1',
    title: 'Introdução ao React',
    description: 'Aprenda os conceitos fundamentais do React',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_duration: 300,
    transcript: 'Esta é uma transcrição de exemplo do vídeo...',
    materials: [
      {
        type: 'subtitle' as const,
        title: 'Legendas em Português',
        url: '/path/to/subtitles.vtt'
      }
    ]
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold text-white mb-8">Exemplos de Video Player</h1>

      {/* Example 1: Basic Video Player */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">1. Player Básico</h2>
        <p className="text-gray-400 mb-4">
          Implementação básica do ReactVideoPlayer com controles padrão.
        </p>
        <ReactVideoPlayer
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          controls={true}
          className="aspect-video"
        />
      </section>

      {/* Example 2: Responsive Video Player */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">2. Player Responsivo</h2>
        <p className="text-gray-400 mb-4">
          Player com wrapper responsivo e proporção 16:9.
        </p>
        <VideoPlayerWrapper
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          aspectRatio="16/9"
          light={true}
          controls={true}
        />
      </section>

      {/* Example 3: Lazy Loading Player */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">3. Player com Lazy Loading</h2>
        <p className="text-gray-400 mb-4">
          Player que carrega apenas quando necessário, melhorando a performance.
        </p>
        <LazyVideoPlayer
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          light={true}
          controls={true}
          enableLazyLoading={true}
        />
      </section>

      {/* Example 4: Accessible Video Player */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">4. Player Acessível</h2>
        <p className="text-gray-400 mb-4">
          Player com recursos de acessibilidade, atalhos de teclado e transcrição.
        </p>
        <AccessibleVideoPlayer
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Vídeo de Exemplo"
          description="Este é um vídeo de demonstração com recursos de acessibilidade"
          transcript="Esta é uma transcrição de exemplo do vídeo. Aqui você pode incluir todo o texto falado no vídeo para melhor acessibilidade."
          tracks={sampleTracks}
          light={true}
          controls={true}
          keyboardShortcuts={true}
          accessibilityControls={true}
          autoSaveProgress={true}
          progressSaveKey="example-video"
        />
      </section>

      {/* Example 5: Advanced Controls */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">5. Controles Avançados</h2>
        <p className="text-gray-400 mb-4">
          Player com controles customizados usando refs.
        </p>
        
        <ReactVideoPlayer
          ref={playerRef}
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          controls={true}
          onProgress={handleProgress}
          onDuration={handleDuration}
          className="aspect-video mb-4"
        />

        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => handleSeek(0)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Início
          </button>
          <button
            onClick={() => handleSeek(currentTime - 10)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            -10s
          </button>
          <button
            onClick={() => handleSeek(currentTime + 10)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            +10s
          </button>
          <button
            onClick={() => handleSeek(duration * 0.5)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Meio
          </button>
        </div>

        <div className="text-sm text-gray-400">
          Tempo: {Math.floor(currentTime)}s / {Math.floor(duration)}s
        </div>
      </section>

      {/* Example 6: Platform Integration */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">6. Integração com Plataforma</h2>
        <p className="text-gray-400 mb-4">
          Player integrado com sistema de progresso e aulas da plataforma.
        </p>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-yellow-400 mb-4">
            ⚠️ Este exemplo requer dados reais de usuário e matrícula.
          </p>
          <pre className="text-sm text-gray-300 bg-gray-900 p-4 rounded overflow-x-auto">
{`<LessonVideoPlayer
  lesson={sampleLesson}
  enrollmentId="enrollment-123"
  userId="user-456"
  onProgress={(progress) => console.log('Progress:', progress)}
  onComplete={() => console.log('Lesson completed!')}
  autoplay={false}
/>`}
          </pre>
        </div>
      </section>

      {/* Example 7: Performance Optimizations */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">7. Otimizações de Performance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Modo Light</h3>
            <p className="text-gray-400 text-sm mb-3">
              Carrega apenas thumbnail até o usuário clicar
            </p>
            <LazyVideoPlayer
              url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              light={true}
              controls={true}
              aspectRatio="16/9"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Autoplay Otimizado</h3>
            <p className="text-gray-400 text-sm mb-3">
              Autoplay com som desabilitado (requerido pelos navegadores)
            </p>
            <LazyVideoPlayer
              url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              playing={true}
              muted={true}
              controls={true}
              aspectRatio="16/9"
            />
          </div>
        </div>
      </section>

      {/* Example 8: Error Handling */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4">8. Tratamento de Erros</h2>
        <p className="text-gray-400 mb-4">
          Player com URL inválida para demonstrar tratamento de erro.
        </p>
        <ReactVideoPlayer
          url="https://invalid-url.com/video.mp4"
          controls={true}
          className="aspect-video"
          fallback={
            <div className="text-center p-8">
              <div className="text-4xl mb-4">🚫</div>
              <p className="text-red-400 font-medium">Falha customizada</p>
              <p className="text-gray-400 text-sm">Este vídeo não pode ser reproduzido</p>
            </div>
          }
        />
      </section>

      {/* Usage Tips */}
      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Dicas de Uso</h2>
        <ul className="space-y-2 text-gray-300">
          <li>• Use <code className="bg-gray-700 px-2 py-1 rounded">light=true</code> para melhor performance</li>
          <li>• Sempre inclua <code className="bg-gray-700 px-2 py-1 rounded">playsInline=true</code> para iOS</li>
          <li>• Use <code className="bg-gray-700 px-2 py-1 rounded">muted=true</code> com autoplay</li>
          <li>• Implemente lazy loading para múltiplos vídeos</li>
          <li>• Adicione legendas para melhor acessibilidade</li>
          <li>• Use refs para controles avançados</li>
          <li>• Sanitize URLs com DOMPurify (já incluído)</li>
        </ul>
      </section>
    </div>
  )
}

export default VideoPlayerExamples