'use client'

import React from 'react'
import MuxVideoPlayer from '@/components/ui/MuxVideoPlayer'

export default function TestPlayerPage() {
  /*
    Substitua `PLAYBACK_ID` por um playbackId válido do seu asset no Mux.
    Caso o vídeo esteja protegido com assinatura, configure as envs
    NEXT_PUBLIC_MUX_TOKEN/NEXT_PUBLIC_MUX_URL conforme necessário.
  */
  const playbackId = process.env.NEXT_PUBLIC_MUX_PLAYBACK_ID || 'PLAYBACK_ID'

  // Check if playback ID is valid
  if (!playbackId || playbackId === 'PLAYBACK_ID') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-yellow-400 text-2xl">⚠</span>
          </div>
          <h1 className="text-xl font-semibold mb-2">Configuração do Mux necessária</h1>
          <p className="text-white/60 mb-4">
            Configure um playback ID válido do Mux para testar o player de vídeo.
          </p>
          <div className="bg-gray-800 rounded-lg p-4 text-left text-sm">
            <p className="text-gray-300 mb-2">Adicione ao seu arquivo .env.local:</p>
            <code className="text-green-400">NEXT_PUBLIC_MUX_PLAYBACK_ID=seu_playback_id_aqui</code>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-3xl aspect-video">
        <MuxVideoPlayer
          playbackId={playbackId}
          poster={`https://image.mux.com/${playbackId}/thumbnail.jpg`}
        />
      </div>
    </div>
  )
} 