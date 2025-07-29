'use client'

import { useState, useCallback, useRef, type DragEvent } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Eye, 
  Copy,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  thumbnailUrl?: string
  altText?: string
  uploadedAt: Date
  variants?: {
    thumbnail: string
    medium: string
    large: string
  }
}

interface MediaUploaderProps {
  onFileSelect?: (file: UploadedFile) => void
  allowMultiple?: boolean
  acceptedTypes?: string[]
  maxFileSize?: number // em MB
  existingFiles?: UploadedFile[]
  className?: string
}

export function MediaUploader({
  onFileSelect,
  allowMultiple = true,
  acceptedTypes = ['image/*'],
  maxFileSize = 10,
  existingFiles = [],
  className
}: MediaUploaderProps) {
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, number>>(new Map())
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(existingFiles)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    const validFiles = fileArray.filter(file => {
      // Verificar tipo de arquivo
      const isValidType = acceptedTypes.some(type => {
        if (type === 'image/*') return file.type.startsWith('image/')
        return file.type === type
      })

      // Verificar tamanho
      const isValidSize = file.size <= maxFileSize * 1024 * 1024

      if (!isValidType) {
        console.warn(`Tipo de arquivo inv�lido: ${file.name}`)
        return false
      }

      if (!isValidSize) {
        console.warn(`Arquivo muito grande: ${file.name}`)
        return false
      }

      return true
    })

    // Upload dos arquivos v�lidos
    for (const file of validFiles) {
      await uploadFile(file)
    }
  }, [acceptedTypes, maxFileSize])

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  const uploadFile = async (file: File): Promise<void> => {
    const fileId = `${Date.now()}-${file.name}`
    
    try {
      // Iniciar upload
      setUploadingFiles(prev => new Map(prev.set(fileId, 0)))

      // Simular progresso de upload (substituir pela implementa��o real do Supabase)
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setUploadingFiles(prev => new Map(prev.set(fileId, progress)))
      }

      // Criar variants de imagem
      const variants = await createImageVariants(file)

      // Upload para Supabase Storage (implementar)
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file), // Substituir pela URL do Supabase
        thumbnailUrl: variants.thumbnail,
        uploadedAt: new Date(),
        variants
      }

      // Adicionar � lista de arquivos
      setUploadedFiles(prev => [...prev, uploadedFile])
      setUploadingFiles(prev => {
        const newMap = new Map(prev)
        newMap.delete(fileId)
        return newMap
      })

      console.log(`Upload conclu�do: ${file.name}`)

    } catch (error) {
      setUploadingFiles(prev => {
        const newMap = new Map(prev)
        newMap.delete(fileId)
        return newMap
      })
      
      console.error('Upload error:', error)
    }
  }

  const createImageVariants = async (file: File) => {
    // Criar diferentes tamanhos da imagem
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    return new Promise<{thumbnail: string, medium: string, large: string}>((resolve) => {
      img.onload = () => {
        const variants = {
          thumbnail: resizeImage(img, canvas, ctx, 150, 150),
          medium: resizeImage(img, canvas, ctx, 600, 400),
          large: resizeImage(img, canvas, ctx, 1200, 800)
        }
        resolve(variants)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const resizeImage = (
    img: HTMLImageElement, 
    canvas: HTMLCanvasElement, 
    ctx: CanvasRenderingContext2D | null,
    maxWidth: number,
    maxHeight: number
  ): string => {
    if (!ctx) return ''

    // Calcular dimens�es mantendo propor��o
    let { width, height } = img
    
    if (width > height) {
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
    } else {
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }
    }

    canvas.width = width
    canvas.height = height

    ctx.drawImage(img, 0, 0, width, height)
    return canvas.toDataURL('image/jpeg', 0.8)
  }

  const deleteFile = async (fileId: string) => {
    try {
      // Remover do Supabase Storage (implementar)
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
      console.log('Arquivo removido')
    } catch (error) {
      console.error('Erro ao remover arquivo:', error)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    console.log('URL copiada para a �rea de transfer�ncia')
  }

  const updateAltText = (fileId: string, altText: string) => {
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileId ? { ...f, altText } : f)
    )
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* �rea de Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de M�dia
          </CardTitle>
          <CardDescription>
            Arraste arquivos aqui ou clique para selecionar. 
            Tamanho m�ximo: {maxFileSize}MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive 
                ? "border-primary bg-primary/10" 
                : "border-muted-foreground/25 hover:border-primary/50"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple={allowMultiple}
              accept={acceptedTypes.join(',')}
              onChange={handleInputChange}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              
              {isDragActive ? (
                <p className="text-lg font-medium">Solte os arquivos aqui...</p>
              ) : (
                <>
                  <div>
                    <p className="text-lg font-medium">
                      Arraste arquivos aqui ou clique para selecionar
                    </p>
                    <p className="text-muted-foreground">
                      Suporte para {acceptedTypes.join(', ')}
                    </p>
                  </div>
                  <Button variant="outline" type="button">
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Arquivos
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Progresso dos uploads */}
          {uploadingFiles.size > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Uploads em andamento:</h4>
              {Array.from(uploadingFiles.entries()).map(([fileId, progress]) => (
                <div key={fileId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{fileId.split('-').slice(1).join('-')}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Galeria de Arquivos */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  M�dia Enviada
                </CardTitle>
                <CardDescription>
                  {uploadedFiles.length} arquivo{uploadedFiles.length !== 1 ? 's' : ''} enviado{uploadedFiles.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setIsGalleryOpen(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Galeria
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {uploadedFiles.slice(0, 6).map((file) => (
                <div
                  key={file.id}
                  className="group relative aspect-square rounded-lg overflow-hidden border cursor-pointer hover:ring-2 hover:ring-primary"
                  onClick={() => onFileSelect?.(file)}
                >
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.thumbnailUrl || file.url}
                      alt={file.altText || file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(file.url)
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteFile(file.id)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-1 left-1 right-1">
                    <Badge variant="secondary" className="text-xs">
                      {formatFileSize(file.size)}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {uploadedFiles.length > 6 && (
                <div 
                  className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary"
                  onClick={() => setIsGalleryOpen(true)}
                >
                  <div className="text-center">
                    <p className="text-sm font-medium">+{uploadedFiles.length - 6}</p>
                    <p className="text-xs text-muted-foreground">Ver todos</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal da Galeria */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Galeria de M�dia</DialogTitle>
            <DialogDescription>
              Gerencie suas imagens e arquivos enviados
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="space-y-2">
                <div className="group relative aspect-square rounded-lg overflow-hidden border">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.thumbnailUrl || file.url}
                      alt={file.altText || file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(file.url)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteFile(file.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                  
                  <Input
                    placeholder="Texto alternativo..."
                    value={file.altText || ''}
                    onChange={(e) => updateAltText(file.id, e.target.value)}
                    className="text-xs h-7"
                  />
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs h-7"
                    onClick={() => {
                      onFileSelect?.(file)
                      setIsGalleryOpen(false)
                    }}
                  >
                    Selecionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}