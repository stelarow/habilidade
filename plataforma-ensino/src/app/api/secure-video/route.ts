import { NextRequest, NextResponse } from 'next/server'
import { VideoSecurity } from '@/lib/video-security'
import { createClient } from '@/lib/supabase/server'
import { logError } from '@/lib/utils/logger'

// Force dynamic rendering for authentication and database queries
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extrair parâmetros da URL assinada
    const videoId = searchParams.get('v')
    const userId = searchParams.get('u')
    const courseId = searchParams.get('c')
    const expiration = searchParams.get('exp')
    const sessionId = searchParams.get('sid')
    const signature = searchParams.get('sig')

    // Validar parâmetros obrigatórios
    if (!videoId || !userId || !courseId || !expiration || !sessionId || !signature) {
      return NextResponse.json(
        { error: 'Parâmetros de segurança inválidos' },
        { status: 400 }
      )
    }

    // Validar assinatura
    const isValidSignature = VideoSecurity.validateSignature(
      videoId, userId, courseId, expiration, sessionId, signature
    )

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Assinatura inválida ou expirada' },
        { status: 401 }
      )
    }

    // Verificar rate limiting
    const withinRateLimit = await VideoSecurity.checkRateLimit(userId)
    if (!withinRateLimit) {
      return NextResponse.json(
        { error: 'Limite de requisições excedido' },
        { status: 429 }
      )
    }

    // Verificar visualizações concorrentes
    const allowedConcurrent = await VideoSecurity.checkConcurrentViews(userId, videoId)
    if (!allowedConcurrent) {
      return NextResponse.json(
        { error: 'Limite de visualizações simultâneas excedido' },
        { status: 409 }
      )
    }

    const supabase = createClient()

    // Buscar informações do vídeo no banco
    const { data: video, error: videoError } = await supabase
      .from('course_videos')
      .select(`
        *,
        course:courses!inner(*)
      `)
      .eq('id', videoId)
      .eq('courses.id', courseId)
      .single()

    if (videoError || !video) {
      return NextResponse.json(
        { error: 'Vídeo não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se usuário tem acesso ao curso
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('status', 'active')
      .single()

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Usuário não matriculado no curso' },
        { status: 403 }
      )
    }

    // Registrar acesso
    await supabase
      .from('video_access_logs')
      .insert({
        user_id: userId,
        video_id: videoId,
        course_id: courseId,
        session_id: sessionId,
        ip_address: request.ip || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })

    // Criar/atualizar sessão de vídeo
    await supabase
      .from('video_sessions')
      .upsert({
        user_id: userId,
        video_id: videoId,
        session_id: sessionId,
        status: 'active',
        last_heartbeat: new Date().toISOString()
      }, {
        onConflict: 'user_id,video_id,session_id'
      })

    // Retornar URL real do vídeo (pode ser URL de CDN, YouTube, Vimeo, etc.)
    const actualVideoUrl = video.video_url || video.youtube_url || video.vimeo_url

    // Para URLs do YouTube/Vimeo, adicionar parâmetros de segurança
    let secureVideoUrl = actualVideoUrl
    
    if (actualVideoUrl.includes('youtube.com') || actualVideoUrl.includes('youtu.be')) {
      const url = new URL(actualVideoUrl)
      url.searchParams.set('rel', '0') // Não mostrar vídeos relacionados
      url.searchParams.set('modestbranding', '1') // Remover logo do YouTube
      url.searchParams.set('disablekb', '0') // Manter controles de teclado
      secureVideoUrl = url.toString()
    }

    // Retornar dados do vídeo com segurança
    return NextResponse.json({
      videoUrl: secureVideoUrl,
      title: video.title,
      description: video.description,
      duration: video.duration,
      watermark: VideoSecurity.generateWatermarkData(userId, videoId),
      sessionId,
      allowDownload: false,
      allowScreenCapture: false
    })

  } catch (error) {
    logError('Secure video API error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para heartbeat de sessão
export async function POST(request: NextRequest) {
  try {
    const { userId, videoId, sessionId } = await request.json()
    
    if (!userId || !videoId) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios ausentes' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Atualizar heartbeat da sessão
    await supabase
      .from('video_sessions')
      .update({
        last_heartbeat: new Date().toISOString(),
        status: 'active'
      })
      .eq('user_id', userId)
      .eq('video_id', videoId)

    return NextResponse.json({ success: true })

  } catch (error) {
    logError('Video heartbeat error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}