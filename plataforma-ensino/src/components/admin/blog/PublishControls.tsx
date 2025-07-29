'use client'

import { useState, useEffect } from 'react'
import { format, formatDistanceToNow, isFuture, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

interface PostData {
  id?: string
  title: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  created_at?: string
  updated_at?: string
  seo_title?: string
  seo_description?: string
  content: string
  excerpt?: string
  category_id: string
}

interface PublishControlsProps {
  postData: PostData
  onSave?: (data: PostData) => Promise<void>
  onPublish?: (data: PostData) => Promise<void>
  onSchedule?: (data: PostData, publishDate: Date) => Promise<void>
  onArchive?: (data: PostData) => Promise<void>
  onPreview?: (data: PostData) => void
  isLoading?: boolean
  isSaving?: boolean
}

type ValidationItem = {
  id: string
  label: string
  isValid: boolean
  message?: string
  severity: 'error' | 'warning' | 'info'
}

export default function PublishControls({
  postData,
  onSave,
  onPublish,
  onSchedule,
  onArchive,
  onPreview,
  isLoading = false,
  isSaving = false
}: PublishControlsProps) {
  const [scheduleDate, setScheduleDate] = useState<Date>()
  const [scheduleTime, setScheduleTime] = useState('')
  const [showSchedulePicker, setShowSchedulePicker] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [validationItems, setValidationItems] = useState<ValidationItem[]>([])

  // Auto-save functionality
  useEffect(() => {
    if (postData.id && !isSaving) {
      const autoSaveTimer = setTimeout(() => {
        onSave?.(postData)
      }, 30000) // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer)
    }
    return undefined
  }, [postData, onSave, isSaving])

  // Validation checks
  useEffect(() => {
    const items: ValidationItem[] = []

    // Title validation
    if (!postData.title || postData.title.length < 3) {
      items.push({
        id: 'title',
        label: 'Título',
        isValid: false,
        message: 'Título deve ter pelo menos 3 caracteres',
        severity: 'error'
      })
    } else if (postData.title.length > 60) {
      items.push({
        id: 'title-length',
        label: 'Título',
        isValid: false,
        message: 'Título muito longo (máx. 60 caracteres)',
        severity: 'warning'
      })
    } else {
      items.push({
        id: 'title',
        label: 'Título',
        isValid: true,
        severity: 'info'
      })
    }

    // Content validation
    if (!postData.content || postData.content.length < 100) {
      items.push({
        id: 'content',
        label: 'Conteúdo',
        isValid: false,
        message: 'Conteúdo deve ter pelo menos 100 caracteres',
        severity: 'error'
      })
    } else {
      items.push({
        id: 'content',
        label: 'Conteúdo',
        isValid: true,
        severity: 'info'
      })
    }

    // SEO validation
    if (!postData.seo_description || postData.seo_description.length < 120) {
      items.push({
        id: 'seo',
        label: 'SEO Description',
        isValid: false,
        message: 'Meta description recomendada (120-160 caracteres)',
        severity: 'warning'
      })
    } else {
      items.push({
        id: 'seo',
        label: 'SEO Description',
        isValid: true,
        severity: 'info'
      })
    }

    // Category validation
    if (!postData.category_id) {
      items.push({
        id: 'category',
        label: 'Categoria',
        isValid: false,
        message: 'Categoria é obrigatória',
        severity: 'error'
      })
    } else {
      items.push({
        id: 'category',
        label: 'Categoria',
        isValid: true,
        severity: 'info'
      })
    }

    // Excerpt validation
    if (!postData.excerpt) {
      items.push({
        id: 'excerpt',
        label: 'Resumo',
        isValid: false,
        message: 'Resumo recomendado para melhor SEO',
        severity: 'warning'
      })
    } else {
      items.push({
        id: 'excerpt',
        label: 'Resumo',
        isValid: true,
        severity: 'info'
      })
    }

    setValidationItems(items)
  }, [postData])

  const handleSaveDraft = async () => {
    try {
      await onSave?.({ ...postData, status: 'draft' })
    } catch (error) {
      console.error('Error saving draft:', error)
    }
  }

  const handlePublish = async () => {
    const hasErrors = validationItems.some(item => !item.isValid && item.severity === 'error')
    
    if (hasErrors) {
      setShowValidation(true)
      return
    }

    try {
      await onPublish?.({
        ...postData,
        status: 'published',
        published_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error publishing post:', error)
    }
  }

  const handleSchedule = async () => {
    if (!scheduleDate || !scheduleTime) return

    const [hours, minutes] = scheduleTime.split(':')
    const publishDateTime = new Date(scheduleDate)
    publishDateTime.setHours(parseInt(hours), parseInt(minutes))

    if (isPast(publishDateTime)) {
      alert('Data de agendamento deve ser no futuro')
      return
    }

    try {
      await onSchedule?.(
        {
          ...postData,
          status: 'published',
          published_at: publishDateTime.toISOString()
        },
        publishDateTime
      )
      setShowSchedulePicker(false)
    } catch (error) {
      console.error('Error scheduling post:', error)
    }
  }

  const handleArchive = async () => {
    if (confirm('Tem certeza que deseja arquivar este post?')) {
      try {
        await onArchive?.({ ...postData, status: 'archived' })
      } catch (error) {
        console.error('Error archiving post:', error)
      }
    }
  }

  const getStatusBadge = () => {
    switch (postData.status) {
      case 'published':
        if (postData.published_at && isFuture(new Date(postData.published_at))) {
          return (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              🕒 Agendado
            </Badge>
          )
        }
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            ✅ Publicado
          </Badge>
        )
      case 'draft':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            📝 Rascunho
          </Badge>
        )
      case 'archived':
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            📦 Arquivado
          </Badge>
        )
      default:
        return null
    }
  }

  const canPublish = () => {
    return !validationItems.some(item => !item.isValid && item.severity === 'error')
  }

  const getValidationSummary = () => {
    const errors = validationItems.filter(item => !item.isValid && item.severity === 'error').length
    const warnings = validationItems.filter(item => !item.isValid && item.severity === 'warning').length
    
    return { errors, warnings }
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Status do Post</CardTitle>
            {getStatusBadge()}
          </div>
          {postData.published_at && (
            <CardDescription>
              {postData.status === 'published' && isFuture(new Date(postData.published_at))
                ? `Agendado para ${format(new Date(postData.published_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`
                : postData.status === 'published'
                ? `Publicado ${formatDistanceToNow(new Date(postData.published_at), { addSuffix: true, locale: ptBR })}`
                : `Criado ${formatDistanceToNow(new Date(postData.created_at || new Date()), { addSuffix: true, locale: ptBR })}`
              }
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Actions */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              disabled={isLoading || isSaving}
              className="w-full justify-start"
            >
              💾 {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
            </Button>

            <Button
              onClick={handlePublish}
              className="w-full justify-start bg-green-600 hover:bg-green-700"
              disabled={isLoading || !canPublish()}
            >
              🚀 {isLoading ? 'Publicando...' : 'Publicar Agora'}
            </Button>

            <Popover open={showSchedulePicker} onOpenChange={setShowSchedulePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={isLoading || !canPublish()}
                >
                  ⏰ Agendar Publicação
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Calendar
                      mode="single"
                      selected={scheduleDate}
                      onSelect={setScheduleDate}
                      disabled={(date) => isPast(date)}
                      initialFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Horário</Label>
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleSchedule}
                    className="w-full"
                    disabled={!scheduleDate || !scheduleTime}
                  >
                    Agendar
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Secondary Actions */}
          <Separator />
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => onPreview?.(postData)}
              variant="ghost"
              className="w-full justify-start"
            >
              👁️ Visualizar
            </Button>

            {postData.status === 'published' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    ⚙️ Mais Ações
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={handleArchive}>
                    📦 Arquivar Post
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onPreview?.(postData)}>
                    🌐 Ver no Site
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Checklist de Publicação</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowValidation(!showValidation)}
            >
              {showValidation ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
          <CardDescription>
            {(() => {
              const { errors, warnings } = getValidationSummary()
              if (errors > 0) {
                return `${errors} erro(s) deve(m) ser corrigido(s) antes da publicação`
              } else if (warnings > 0) {
                return `${warnings} aviso(s) para melhorar o post`
              }
              return 'Post pronto para publicação!'
            })()}
          </CardDescription>
        </CardHeader>
        {showValidation && (
          <CardContent>
            <div className="space-y-2">
              {validationItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 p-2 rounded text-sm ${
                    item.severity === 'error'
                      ? 'bg-red-50 text-red-800'
                      : item.severity === 'warning'
                      ? 'bg-yellow-50 text-yellow-800'
                      : 'bg-green-50 text-green-800'
                  }`}
                >
                  {item.isValid ? (
                    <span className="text-green-600">✅</span>
                  ) : item.severity === 'error' ? (
                    <span className="text-red-600">❌</span>
                  ) : (
                    <span className="text-yellow-600">⚠️</span>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    {item.message && (
                      <div className="text-xs opacity-75">{item.message}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Auto-save Indicator */}
      {isSaving && (
        <Alert>
          <span className="h-4 w-4">💾</span>
          <h4 className="text-sm font-medium">Salvando...</h4>
          <AlertDescription>
            Suas alterações estão sendo salvas automaticamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Scheduled Posts (if any) */}
      {postData.status === 'published' && postData.published_at && isFuture(new Date(postData.published_at)) && (
        <Alert>
          <span className="h-4 w-4">⏰</span>
          <h4 className="text-sm font-medium">Post Agendado</h4>
          <AlertDescription>
            Este post será publicado automaticamente em{' '}
            {format(new Date(postData.published_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
