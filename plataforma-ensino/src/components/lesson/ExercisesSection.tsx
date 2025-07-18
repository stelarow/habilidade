'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Upload, FileText, Check, X, AlertCircle } from 'lucide-react'

interface ExerciseFile {
  id: string
  name: string
  size: number
  type: string
  downloadUrl?: string
}

interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  uploadedAt: Date
}

interface ExercisesSectionProps {
  title?: string
  exerciseFiles?: ExerciseFile[]
  onProgressUpdate?: (progress: number) => void
  onFilesUploaded?: (files: UploadedFile[]) => void
  maxFileSize?: number // in MB
  allowedFileTypes?: string[]
}

const ExercisesSection: React.FC<ExercisesSectionProps> = ({
  title = "Exercícios Práticos",
  exerciseFiles = [
    {
      id: '1',
      name: 'Exercício 1 - Fundamentos.pdf',
      size: 2048000, // 2MB
      type: 'application/pdf',
      downloadUrl: '#'
    },
    {
      id: '2', 
      name: 'Exercício 2 - Prática.docx',
      size: 1024000, // 1MB
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      downloadUrl: '#'
    },
    {
      id: '3',
      name: 'Template - Projeto Final.zip',
      size: 5120000, // 5MB
      type: 'application/zip',
      downloadUrl: '#'
    }
  ],
  onProgressUpdate,
  onFilesUploaded,
  maxFileSize = 10, // 10MB default
  allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain'
  ]
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || type.includes('document')) return '📝'
    if (type.includes('zip') || type.includes('compressed')) return '📦'
    if (type.includes('image')) return '🖼️'
    return '📁'
  }

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `Arquivo muito grande. Tamanho máximo: ${maxFileSize}MB`
    }

    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      return 'Tipo de arquivo não permitido'
    }

    return null
  }, [maxFileSize, allowedFileTypes])

  // Handle file upload
  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return

    setUploadError(null)
    const newUploadedFiles: UploadedFile[] = []
    const errors: string[] = []

    Array.from(files).forEach((file) => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
        return
      }

      // Check if file already uploaded
      const isDuplicate = uploadedFiles.some(
        (uploaded) => uploaded.name === file.name && uploaded.size === file.size
      )

      if (isDuplicate) {
        errors.push(`${file.name}: Arquivo já foi enviado`)
        return
      }

      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date()
      }

      newUploadedFiles.push(uploadedFile)
    })

    if (errors.length > 0) {
      setUploadError(errors.join('; '))
    }

    if (newUploadedFiles.length > 0) {
      const updatedFiles = [...uploadedFiles, ...newUploadedFiles]
      setUploadedFiles(updatedFiles)
      
      // Calculate progress based on uploaded files
      const progress = Math.min((updatedFiles.length / exerciseFiles.length) * 100, 100)
      if (onProgressUpdate) {
        onProgressUpdate(progress)
      }

      if (onFilesUploaded) {
        onFilesUploaded(updatedFiles)
      }
    }
  }, [uploadedFiles, exerciseFiles.length, onProgressUpdate, onFilesUploaded, validateFile])

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }, [handleFileUpload])

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files)
    // Reset input value to allow same file selection
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle file download
  const handleDownload = (file: ExerciseFile) => {
    if (file.downloadUrl && file.downloadUrl !== '#') {
      window.open(file.downloadUrl, '_blank')
    } else {
      // Simulate download for demo
      console.log(`Downloading: ${file.name}`)
    }
  }

  // Remove uploaded file
  const removeUploadedFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId)
    setUploadedFiles(updatedFiles)
    
    // Update progress
    const progress = Math.min((updatedFiles.length / exerciseFiles.length) * 100, 100)
    if (onProgressUpdate) {
      onProgressUpdate(progress)
    }

    if (onFilesUploaded) {
      onFilesUploaded(updatedFiles)
    }
  }

  return (
    <Card className="p-6 border-border/50">
      <h3 className="text-xl font-bold mb-4 gradient-text">{title}</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
          
          <div>
            <h4 className="font-semibold mb-3">Downloads de Exercícios</h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Exercício 1 - Análise de Casos.pdf
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Exercício 2 - Projeto Prático.pdf
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Exercício 3 - Estudo Dirigido.pdf
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Upload de Respostas</h4>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Envie imagens dos exercícios concluídos
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInputChange}
                  className="max-w-xs mx-auto"
                />
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Arquivos enviados:</p>
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        {uploadedFiles.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Progresso dos Exercícios
              </span>
              <span className="font-medium">
                {uploadedFiles.length} de {exerciseFiles.length} arquivos enviados
              </span>
            </div>
          </div>
        )}
    </Card>
  )
}

export default ExercisesSection