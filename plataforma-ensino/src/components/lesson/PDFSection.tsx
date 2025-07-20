'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PDFSectionProps {
  title?: string
  pdfUrl?: string
  lessonId?: string
  onProgressUpdate?: (progress: number) => void
  initialProgress?: number
}

const PDFSection: React.FC<PDFSectionProps> = ({
  title = "Material Didático - Apostila",
  pdfUrl,
  lessonId = "test-lesson",
  onProgressUpdate,
  initialProgress = 0
}) => {
  const [progress, setProgress] = useState(initialProgress)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Convert Google Drive URLs to viewer format (CORS-free)
  const convertGoogleDriveUrl = (url: string): { viewerUrl: string, isGoogleDrive: boolean } => {
    const shareMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
    const downloadMatch = url.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/)
    
    if (shareMatch || downloadMatch) {
      const fileId = shareMatch?.[1] || downloadMatch?.[1]
      return {
        viewerUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        isGoogleDrive: true
      }
    }
    return {
      viewerUrl: url,
      isGoogleDrive: false
    }
  }

  const { viewerUrl, isGoogleDrive } = pdfUrl ? convertGoogleDriveUrl(pdfUrl) : { viewerUrl: '', isGoogleDrive: false }

  useEffect(() => {
    if (pdfUrl) {
      setProgress(100)
      if (onProgressUpdate) onProgressUpdate(100)
    }
  }, [pdfUrl, onProgressUpdate])

  if (!pdfUrl) {
    return (
      <Card className="p-6 border-border/50">
        <h3 className="text-xl font-bold mb-4 gradient-text">{title}</h3>
        <div className="flex items-center justify-center h-96">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Nenhum PDF configurado para esta aula</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-border/50">
      <h3 className="text-xl font-bold mb-4 gradient-text">{title}</h3>

      {/* PDF Viewer */}
      <div className="relative bg-muted rounded-lg min-h-[600px] mb-4 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Carregando PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-white text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Google Drive iframe viewer (CORS-free) */}
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <iframe
            src={viewerUrl}
            className="w-full h-full border-0"
            title={title}
            onLoad={() => {
              setIsLoading(false)
              setError(null)
            }}
            onError={() => {
              setError('Erro ao carregar o PDF')
              setIsLoading(false)
            }}
          />
        </div>
      </div>

      {/* Progress Information */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Progresso de leitura:</span>
          <Progress value={progress} className="flex-1" />
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          💡 Dica: Use os controles nativos do Google Drive para navegar pelo PDF.
        </div>
      </div>
    </Card>
  )
}

export default PDFSection