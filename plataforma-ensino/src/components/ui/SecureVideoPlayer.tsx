'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { LazyVideoPlayer } from './LazyVideoPlayer'
import { useVideoSecurity, VideoSecurity, type SecureVideoConfig } from '@/lib/video-security'
import { cn } from '@/lib/utils'

interface SecureVideoPlayerProps {
  config: SecureVideoConfig
  className?: string
  onViolation?: (type: string) => void
  enableWatermark?: boolean
  enableScreenCaptureDetection?: boolean
  enableRightClickProtection?: boolean
  enableDevToolsDetection?: boolean
}

export const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  config,
  className,
  onViolation,
  enableWatermark = true,
  enableScreenCaptureDetection = true,
  enableRightClickProtection = true,
  enableDevToolsDetection = true
}) => {
  const { secureUrl, isAuthorized, reportViolation, watermarkData } = useVideoSecurity(config)
  const playerRef = useRef<HTMLDivElement>(null)
  const [devToolsOpen, setDevToolsOpen] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)

  // 1. Proteção contra clique direito
  useEffect(() => {
    if (!enableRightClickProtection) return

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      reportViolation('right_click')
      onViolation?.('right_click')
    }

    const handleSelectStart = (e: Event) => {
      e.preventDefault()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Bloquear F12, Ctrl+Shift+I, Ctrl+U, etc.
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')
      ) {
        e.preventDefault()
        reportViolation('devtools')
        onViolation?.('devtools')
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enableRightClickProtection, reportViolation, onViolation])

  // 2. Detecção de ferramentas de desenvolvedor
  useEffect(() => {
    if (!enableDevToolsDetection) return

    let devToolsCheckInterval: NodeJS.Timeout

    const checkDevTools = () => {
      const threshold = 160
      const isOpen = 
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold

      if (isOpen && !devToolsOpen) {
        setDevToolsOpen(true)
        reportViolation('devtools', { 
          windowDimensions: {
            outer: { width: window.outerWidth, height: window.outerHeight },
            inner: { width: window.innerWidth, height: window.innerHeight }
          }
        })
        onViolation?.('devtools')
      } else if (!isOpen && devToolsOpen) {
        setDevToolsOpen(false)
      }
    }

    devToolsCheckInterval = setInterval(checkDevTools, 1000)

    return () => {
      if (devToolsCheckInterval) {
        clearInterval(devToolsCheckInterval)
      }
    }
  }, [enableDevToolsDetection, devToolsOpen, reportViolation, onViolation])

  // 3. Detecção de captura de tela
  useEffect(() => {
    if (!enableScreenCaptureDetection) return

    const detectScreenCapture = async () => {
      try {
        // Detectar mudanças na API de mídia
        const checkScreenShare = () => {
          if ('mediaDevices' in navigator && 'getDisplayMedia' in navigator.mediaDevices) {
            // Método indireto para detectar screen sharing
            const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia
            navigator.mediaDevices.getDisplayMedia = function(...args) {
              reportViolation('screen_capture')
              onViolation?.('screen_capture')
              return originalGetDisplayMedia.apply(this, args)
            }
          }
        }

        checkScreenShare()

        // Detectar mudanças de visibilidade que podem indicar screen recording
        const handleVisibilityChange = () => {
          if (document.hidden && sessionActive) {
            reportViolation('screen_capture', { 
              reason: 'window_hidden_during_playback',
              timestamp: new Date().toISOString()
            })
          }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
      } catch (error) {
        console.warn('Screen capture detection setup failed:', error)
      }
    }

    detectScreenCapture()
  }, [enableScreenCaptureDetection, sessionActive, reportViolation, onViolation])

  // 4. Watermark dinâmico
  const WatermarkOverlay = useCallback(() => {
    if (!enableWatermark) return null

    return (
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Watermark nos cantos */}
        <div className="absolute top-4 right-4 text-white/30 text-xs font-mono bg-black/20 px-2 py-1 rounded">
          {watermarkData}
        </div>
        <div className="absolute bottom-4 left-4 text-white/20 text-xs font-mono bg-black/20 px-2 py-1 rounded">
          Escola Habilidade
        </div>
        
        {/* Watermark central rotativo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/10 text-2xl font-bold transform rotate-45 select-none">
            {config.userId.substring(0, 8).toUpperCase()}
          </div>
        </div>

        {/* Grade de micro-watermarks */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-4 p-8">
          {Array.from({ length: 24 }, (_, i) => (
            <div 
              key={i} 
              className="text-white/5 text-xs font-mono text-center select-none"
              style={{ 
                transform: `rotate(${Math.random() * 360}deg)`,
                opacity: Math.random() * 0.3 + 0.1
              }}
            >
              {watermarkData.substring(i % watermarkData.length, (i % watermarkData.length) + 6)}
            </div>
          ))}
        </div>
      </div>
    )
  }, [enableWatermark, watermarkData, config.userId])

  // 5. Monitor de sessão ativa
  useEffect(() => {
    let heartbeatInterval: NodeJS.Timeout

    const startHeartbeat = () => {
      heartbeatInterval = setInterval(async () => {
        // Enviar heartbeat para o servidor para manter sessão ativa
        try {
          await fetch('/api/video-heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: config.userId,
              videoId: config.videoId,
              timestamp: new Date().toISOString()
            })
          })
        } catch (error) {
          console.warn('Heartbeat failed:', error)
        }
      }, 30000) // A cada 30 segundos
    }

    if (sessionActive) {
      startHeartbeat()
    }

    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval)
      }
    }
  }, [sessionActive, config.userId, config.videoId])

  // Renderização
  if (!isAuthorized) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-gray-900 text-white p-8 rounded-lg",
        className
      )}>
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
          <p className="text-gray-400 text-sm">
            Você não tem permissão para acessar este vídeo.
          </p>
        </div>
      </div>
    )
  }

  if (!secureUrl) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-gray-100 aspect-video",
        className
      )}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando vídeo seguro...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={playerRef}
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none'
      }}
    >
      {/* Player de vídeo */}
      <LazyVideoPlayer
        url={secureUrl}
        controls={true}
        light={false}
        onPlay={() => setSessionActive(true)}
        onPause={() => setSessionActive(false)}
        onEnded={() => setSessionActive(false)}
        onError={(error) => {
          reportViolation('download_attempt', { error: error.message })
          onViolation?.('error')
        }}
        config={{
          youtube: {
            playerVars: {
              disablekb: 0, // Manter controles de teclado
              fs: 0, // Desabilitar fullscreen
              rel: 0, // Não mostrar vídeos relacionados
              modestbranding: 1 // Remover logo do YouTube
            }
          },
          vimeo: {
            playerOptions: {
              title: false,
              byline: false,
              portrait: false,
              pip: false
            }
          }
        }}
        className="w-full h-full"
      />

      {/* Watermark overlay */}
      <WatermarkOverlay />

      {/* Sobreposição anti-screenshot */}
      <div 
        className="absolute inset-0 pointer-events-none bg-transparent"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-family='monospace' font-size='10' fill='%23ffffff' fill-opacity='0.02' text-anchor='middle' dominant-baseline='middle'%3E${watermarkData}%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px'
        }}
      />

      {/* Alerta de DevTools */}
      {devToolsOpen && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-red-600 text-white p-6 rounded-lg text-center max-w-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Violação de Segurança</h3>
            <p className="text-sm">
              Ferramentas de desenvolvedor detectadas. O vídeo foi pausado por motivos de segurança.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SecureVideoPlayer