'use client'

import React from 'react'
import { createClient } from '@/lib/supabase/client'
import CryptoJS from 'crypto-js'

export interface SecureVideoConfig {
  videoId: string
  userId: string
  courseId: string
  maxConcurrentViews?: number
  allowDownload?: boolean
  allowScreenCapture?: boolean
  watermarkText?: string
  expiresIn?: number // em segundos
}

export interface VideoSecurityViolation {
  type: 'right_click' | 'devtools' | 'screen_capture' | 'concurrent_limit' | 'url_sharing' | 'download_attempt'
  userId: string
  videoId: string
  userAgent: string
  timestamp: Date
  metadata?: Record<string, any>
}

export class VideoSecurity {
  private static readonly SECRET_KEY = process.env.NEXT_PUBLIC_VIDEO_SECURITY_KEY || 'habilidade-secret-key'
  private static violations: VideoSecurityViolation[] = []

  // 1. Geração de URLs assinadas e temporárias
  static async generateSecureVideoUrl(config: SecureVideoConfig): Promise<string> {
    const { videoId, userId, courseId, expiresIn = 3600 } = config
    const supabase = createClient()

    // Verificar se usuário tem acesso ao curso
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('status', 'active')
      .single()

    if (!enrollment) {
      throw new Error('Usuário não matriculado no curso')
    }

    const expiration = Date.now() + (expiresIn * 1000)
    const sessionId = crypto.randomUUID()
    
    // Criar assinatura com dados críticos
    const signatureData = `${videoId}:${userId}:${courseId}:${expiration}:${sessionId}`
    const signature = CryptoJS.HmacSHA256(signatureData, this.SECRET_KEY).toString()

    // Gerar URL assinada
    const params = new URLSearchParams({
      v: videoId,
      u: userId,
      c: courseId,
      exp: expiration.toString(),
      sid: sessionId,
      sig: signature
    })

    return `/api/secure-video?${params.toString()}`
  }

  // 2. Validação de assinatura
  static validateSignature(
    videoId: string,
    userId: string,
    courseId: string,
    expiration: string,
    sessionId: string,
    signature: string
  ): boolean {
    // Verificar expiração
    if (Date.now() > parseInt(expiration)) {
      return false
    }

    // Recriar assinatura
    const signatureData = `${videoId}:${userId}:${courseId}:${expiration}:${sessionId}`
    const expectedSignature = CryptoJS.HmacSHA256(signatureData, this.SECRET_KEY).toString()

    return signature === expectedSignature
  }

  // 3. Controle de visualizações concorrentes
  static async checkConcurrentViews(userId: string, videoId: string, maxViews = 2): Promise<boolean> {
    const supabase = createClient()
    
    // Verificar sessões ativas
    const { data: activeSessions } = await supabase
      .from('video_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .eq('status', 'active')
      .gte('last_heartbeat', new Date(Date.now() - 60000)) // último heartbeat em 1 min

    return (activeSessions?.length || 0) < maxViews
  }

  // 4. Registro de violações de segurança
  static async reportViolation(violation: VideoSecurityViolation): Promise<void> {
    const supabase = createClient()
    
    // Armazenar localmente
    this.violations.push(violation)

    // Enviar para banco de dados
    await supabase
      .from('security_violations')
      .insert({
        type: violation.type,
        user_id: violation.userId,
        video_id: violation.videoId,
        user_agent: violation.userAgent,
        metadata: violation.metadata,
        created_at: violation.timestamp
      })

    // Alertar em casos críticos
    if (['screen_capture', 'download_attempt'].includes(violation.type)) {
      await this.triggerSecurityAlert(violation)
    }
  }

  // 5. Geração de watermark dinâmico
  static generateWatermarkData(userId: string, videoId: string): string {
    const timestamp = new Date().toISOString()
    const sessionId = crypto.randomUUID().substring(0, 8)
    return `${userId.substring(0, 8)}-${sessionId}-${timestamp.substring(0, 10)}`
  }

  // 6. Rate limiting para acesso a vídeos
  static async checkRateLimit(userId: string, maxRequests = 100, windowMinutes = 60): Promise<boolean> {
    const supabase = createClient()
    const windowStart = new Date(Date.now() - (windowMinutes * 60 * 1000))

    const { data: requests } = await supabase
      .from('video_access_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', windowStart.toISOString())

    return (requests?.length || 0) < maxRequests
  }

  // 7. Detecção de dispositivos suspeitos
  static async validateDeviceFingerprint(userId: string, fingerprint: string): Promise<boolean> {
    const supabase = createClient()
    
    const { data: knownDevices } = await supabase
      .from('user_devices')
      .select('*')
      .eq('user_id', userId)
      .eq('fingerprint', fingerprint)

    return !!(knownDevices && knownDevices.length > 0)
  }

  private static async triggerSecurityAlert(violation: VideoSecurityViolation): Promise<void> {
    // Implementar notificação para administradores
    console.warn('Security Violation Detected:', violation)
    
    // Aqui você pode integrar com sistemas de alerta como:
    // - Email para admins
    // - Webhook para sistemas de monitoramento
    // - Suspensão automática em casos graves
  }
}

// Hook para uso em componentes
export const useVideoSecurity = (config: SecureVideoConfig) => {
  const [secureUrl, setSecureUrl] = React.useState<string | null>(null)
  const [isAuthorized, setIsAuthorized] = React.useState(false)
  const [violations, setViolations] = React.useState<VideoSecurityViolation[]>([])

  React.useEffect(() => {
    const initializeSecurity = async () => {
      try {
        const url = await VideoSecurity.generateSecureVideoUrl(config)
        setSecureUrl(url)
        setIsAuthorized(true)
      } catch (error) {
        console.error('Video security initialization failed:', error)
        setIsAuthorized(false)
      }
    }

    initializeSecurity()
  }, [config])

  const reportViolation = React.useCallback(async (type: VideoSecurityViolation['type'], metadata?: Record<string, any>) => {
    const violation: VideoSecurityViolation = {
      type,
      userId: config.userId,
      videoId: config.videoId,
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      metadata
    }

    await VideoSecurity.reportViolation(violation)
    setViolations(prev => [...prev, violation])
  }, [config])

  return {
    secureUrl,
    isAuthorized,
    violations,
    reportViolation,
    watermarkData: VideoSecurity.generateWatermarkData(config.userId, config.videoId)
  }
}