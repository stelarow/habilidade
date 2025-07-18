'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

interface PDFSectionProps {
  title?: string
  totalPages?: number
  onProgressUpdate?: (progress: number) => void
  initialProgress?: number
}

const PDFSection: React.FC<PDFSectionProps> = ({
  title = "Material Didático - Apostila",
  totalPages = 20,
  onProgressUpdate,
  initialProgress = 0
}) => {
  const [pdfProgress, setPdfProgress] = useState(initialProgress)

  const handleSimulateReading = () => {
    const newProgress = Math.min(pdfProgress + 10, 100)
    setPdfProgress(newProgress)
    
    if (onProgressUpdate) {
      onProgressUpdate(newProgress)
    }
  }

  const getPagesRead = () => {
    return Math.floor((pdfProgress / 100) * totalPages)
  }

  return (
    <Card className="p-6 border-border/50">
      <h3 className="text-xl font-bold mb-4 gradient-text">{title}</h3>
      
      <div className="bg-muted rounded-lg p-8 min-h-96 mb-4">
        <div className="text-center text-muted-foreground">
          <FileText className="h-16 w-16 mx-auto mb-4" />
          <p>Visualizador de PDF - Apostila da Aula</p>
          <p className="text-sm mt-2">Progresso atual: {pdfProgress}%</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Button 
          onClick={handleSimulateReading} 
          className="gradient-button"
          disabled={pdfProgress >= 100}
        >
          {pdfProgress >= 100 ? "Leitura Concluída" : "Simular Leitura"}
        </Button>
        <span className="text-sm text-muted-foreground">
          Páginas lidas: {getPagesRead()}/{totalPages}
        </span>
      </div>
    </Card>
  )
}

export default PDFSection