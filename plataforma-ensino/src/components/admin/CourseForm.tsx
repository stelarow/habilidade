'use client'

import { useState, useEffect } from 'react'
import { Course, Category, Instructor } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { 
  XMarkIcon,
  PhotoIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface CourseFormProps {
  course?: Course | null
  categories: Category[]
  instructors: Instructor[]
  onSubmit: (courseData: any) => Promise<void>
  onCancel: () => void
  loading: boolean
}

type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

interface CourseFormData {
  title: string
  slug: string
  description: string
  short_description: string
  thumbnail_url: string
  video_preview_url: string
  category_id: string
  instructor_id: string
  price: number
  duration_minutes: number
  level: CourseLevel
  requirements: string[]
  what_you_learn: string[]
  background_theme: string
  is_published: boolean
}

const defaultFormData: CourseFormData = {
  title: '',
  slug: '',
  description: '',
  short_description: '',
  thumbnail_url: '',
  video_preview_url: '',
  category_id: '',
  instructor_id: '',
  price: 0,
  duration_minutes: 0,
  level: 'beginner',
  requirements: [''],
  what_you_learn: [''],
  background_theme: 'default',
  is_published: false
}

export function CourseForm({ 
  course, 
  categories, 
  instructors, 
  onSubmit, 
  onCancel, 
  loading 
}: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>(defaultFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        slug: course.slug || '',
        description: course.description || '',
        short_description: course.short_description || '',
        thumbnail_url: course.thumbnail_url || '',
        video_preview_url: course.video_preview_url || '',
        category_id: course.category_id || '',
        instructor_id: course.instructor_id || '',
        price: course.price || 0,
        duration_minutes: course.duration_minutes || 0,
        level: course.level || 'beginner',
        requirements: course.requirements && course.requirements.length > 0 ? course.requirements : [''],
        what_you_learn: course.what_you_learn && course.what_you_learn.length > 0 ? course.what_you_learn : [''],
        background_theme: course.background_theme || 'default',
        is_published: course.is_published || false
      })
    } else {
      setFormData(defaultFormData)
    }
  }, [course])

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  }

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug when title changes
    if (field === 'title' && !course) {
      const slug = generateSlug(value)
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleArrayChange = (field: 'requirements' | 'what_you_learn', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'requirements' | 'what_you_learn') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'requirements' | 'what_you_learn', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug é obrigatório'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug deve conter apenas letras minúsculas, números e hífens'
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Categoria é obrigatória'
    }

    // Instructor is now optional - no validation required

    if (formData.price < 0) {
      newErrors.price = 'Preço deve ser positivo'
    }

    if (formData.duration_minutes < 0) {
      newErrors.duration_minutes = 'Duração deve ser positiva'
    }

    if (formData.thumbnail_url && !isValidUrl(formData.thumbnail_url)) {
      newErrors.thumbnail_url = 'URL da thumbnail inválida'
    }

    if (formData.video_preview_url && !isValidUrl(formData.video_preview_url)) {
      newErrors.video_preview_url = 'URL do vídeo preview inválida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Clean up arrays by removing empty items
    const cleanedData = {
      ...formData,
      requirements: formData.requirements.filter(req => req.trim()),
      what_you_learn: formData.what_you_learn.filter(item => item.trim())
    }

    await onSubmit(cleanedData)
  }

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            {course ? 'Editar Curso' : 'Novo Curso'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Nome do curso"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.slug ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="nome-do-curso"
                />
                {errors.slug && <p className="text-red-400 text-sm mt-1">{errors.slug}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição Curta
              </label>
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Resumo do curso em uma linha"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição Completa
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Descrição detalhada do curso"
              />
            </div>

            {/* Category and Instructor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.category_id ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">Selecionar categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <p className="text-red-400 text-sm mt-1">{errors.category_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instrutor (opcional)
                </label>
                <select
                  value={formData.instructor_id}
                  onChange={(e) => handleInputChange('instructor_id', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Nenhum instrutor selecionado</option>
                  {instructors.map((instructor: any) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.user?.full_name || 'Instrutor sem nome'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price, Duration and Level */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duração (minutos)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.duration_minutes}
                  onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.duration_minutes ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {formData.duration_minutes > 0 && (
                  <p className="text-gray-400 text-sm mt-1">
                    Equivale a {formatTime(formData.duration_minutes)}
                  </p>
                )}
                {errors.duration_minutes && <p className="text-red-400 text-sm mt-1">{errors.duration_minutes}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nível
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value as CourseLevel)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="beginner">Iniciante</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                </select>
              </div>
            </div>

            {/* Media URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <PhotoIcon className="w-4 h-4 inline mr-1" />
                  URL da Thumbnail
                </label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.thumbnail_url ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.thumbnail_url && <p className="text-red-400 text-sm mt-1">{errors.thumbnail_url}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <PlayIcon className="w-4 h-4 inline mr-1" />
                  URL do Vídeo Preview
                </label>
                <input
                  type="url"
                  value={formData.video_preview_url}
                  onChange={(e) => handleInputChange('video_preview_url', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.video_preview_url ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="https://example.com/video.mp4"
                />
                {errors.video_preview_url && <p className="text-red-400 text-sm mt-1">{errors.video_preview_url}</p>}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pré-requisitos
              </label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: Conhecimento básico de computação"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="text-purple-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-1"
              >
                <PlusIcon className="h-4 w-4" />
                Adicionar pré-requisito
              </button>
            </div>

            {/* What You Learn */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                O que você aprenderá
              </label>
              {formData.what_you_learn.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('what_you_learn', index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: Como criar aplicações web modernas"
                  />
                  {formData.what_you_learn.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('what_you_learn', index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('what_you_learn')}
                className="text-purple-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-1"
              >
                <PlusIcon className="h-4 w-4" />
                Adicionar item
              </button>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tema de Fundo
                </label>
                <select
                  value={formData.background_theme}
                  onChange={(e) => handleInputChange('background_theme', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="default">Padrão</option>
                  <option value="programming">Programação</option>
                  <option value="design">Design Gráfico</option>
                  <option value="marketing">Marketing Digital</option>
                  <option value="3d">Projetista 3D</option>
                  <option value="video">Edição de Vídeo</option>
                  <option value="ai">Inteligência Artificial</option>
                  <option value="bi">Business Intelligence</option>
                  <option value="administration">Administração</option>
                  <option value="informatics">Informática</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => handleInputChange('is_published', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-300">
                  Publicar curso
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : course ? 'Atualizar' : 'Criar Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}