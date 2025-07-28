'use client'

import { useState, useEffect } from 'react'
import type { Lesson, Course, User } from '@/types'
import type { UserProfile } from '@/lib/auth/session'
import { hasPermission } from '@/lib/auth/permissions-client'
import { createClient } from '@/lib/supabase/client'
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline'
import { BookOpenIcon } from '@heroicons/react/24/solid'
import LessonForm from './LessonForm'

interface LessonManagementProps {
  lessons: Lesson[]
  courses: Course[]
  currentUser: User | UserProfile | null
}

export function LessonManagement({ 
  lessons: initialLessons, 
  courses,
  currentUser 
}: LessonManagementProps) {
  const [lessons, setLessons] = useState(initialLessons)
  const [filteredLessons, setFilteredLessons] = useState(initialLessons)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [courseFilter, setCourseFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    let filtered = lessons

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((lesson: any) => 
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((lesson: any) => 
        statusFilter === 'published' ? lesson.is_published : !lesson.is_published
      )
    }

    // Filter by course
    if (courseFilter !== 'all') {
      filtered = filtered.filter((lesson: any) => lesson.course_id === courseFilter)
    }

    setFilteredLessons(filtered)
  }, [lessons, searchTerm, statusFilter, courseFilter])

  const handleTogglePublish = async (lessonId: string, currentStatus: boolean) => {
    if (!hasPermission(currentUser, 'admin.courses.edit')) {
      alert('Você não tem permissão para editar aulas')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('lessons')
        .update({ is_published: !currentStatus })
        .eq('id', lessonId)

      if (error) throw error

      setLessons(lessons.map((lesson: any) => 
        lesson.id === lessonId ? { ...lesson, is_published: !currentStatus } : lesson
      ))
    } catch (error) {
      console.error('Error updating lesson status:', error)
      alert('Erro ao atualizar status da aula')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!hasPermission(currentUser, 'admin.courses.delete')) {
      alert('Você não tem permissão para deletar aulas')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete lesson')

      setLessons(lessons.filter((lesson: any) => lesson.id !== lessonId))
      setShowDeleteModal(false)
      setSelectedLesson(null)
    } catch (error) {
      console.error('Error deleting lesson:', error)
      alert('Erro ao deletar aula')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLesson = async (lessonData: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
      })

      if (!response.ok) throw new Error('Failed to create lesson')

      const result = await response.json()
      setLessons([result.data, ...lessons])
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating lesson:', error)
      alert('Erro ao criar aula')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateLesson = async (lessonData: any) => {
    if (!selectedLesson) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/lessons/${selectedLesson.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
      })

      if (!response.ok) throw new Error('Failed to update lesson')

      const result = await response.json()
      setLessons(lessons.map((lesson: any) => 
        lesson.id === selectedLesson.id ? result.data : lesson
      ))
      setShowEditModal(false)
      setSelectedLesson(null)
    } catch (error) {
      console.error('Error updating lesson:', error)
      alert('Erro ao atualizar aula')
    } finally {
      setLoading(false)
    }
  }

  const getCourseTitle = (courseId: string) => {
    const course = courses.find((c: any) => c.id === courseId)
    return course?.title || 'Curso não encontrado'
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Gerenciar Aulas</h1>
            <p className="text-slate-400 mt-2">
              Gerencie todas as aulas da plataforma
            </p>
          </div>
          
          {hasPermission(currentUser, 'admin.courses.create') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Nova Aula
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-slate-900 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar aulas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                <option value="all">Todos os status</option>
                <option value="published">Publicadas</option>
                <option value="draft">Rascunhos</option>
              </select>
              <ChevronDownIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Course Filter */}
            <div className="relative">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                <option value="all">Todos os cursos</option>
                {courses.map((course: any) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Results count */}
            <div className="flex items-center text-slate-400">
              <span>{filteredLessons.length} aula{filteredLessons.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <div key={lesson.id} className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              {/* Lesson Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpenIcon className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-slate-400">
                      Aula {lesson.order_index}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-2">
                    {getCourseTitle(lesson.course_id)}
                  </p>
                </div>

                {/* Status Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  lesson.is_published 
                    ? 'bg-green-900/50 text-green-400' 
                    : 'bg-yellow-900/50 text-yellow-400'
                }`}>
                  {lesson.is_published ? 'Publicada' : 'Rascunho'}
                </span>
              </div>

              {/* Lesson Features */}
              <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                {lesson.video_url && (
                  <div className="flex items-center gap-1">
                    <PlayIcon className="h-4 w-4" />
                    <span>{formatDuration(lesson.video_duration)}</span>
                  </div>
                )}
                
                {lesson.content && (
                  <div className="flex items-center gap-1">
                    <DocumentTextIcon className="h-4 w-4" />
                    <span>Apostila</span>
                  </div>
                )}
                
                {lesson.exercises && lesson.exercises.length > 0 && (
                  <div className="flex items-center gap-1">
                    <PaperClipIcon className="h-4 w-4" />
                    <span>{lesson.exercises.length} Exerc.</span>
                  </div>
                )}
                
                {lesson.quizzes && lesson.quizzes.length > 0 && (
                  <div className="flex items-center gap-1">
                    <QuestionMarkCircleIcon className="h-4 w-4" />
                    <span>Quiz</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {lesson.description && (
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                  {lesson.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasPermission(currentUser, 'admin.courses.edit') && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedLesson(lesson)
                          setShowEditModal(true)
                        }}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span className="text-sm">Editar</span>
                      </button>

                      <button
                        onClick={() => handleTogglePublish(lesson.id, lesson.is_published)}
                        disabled={loading}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                      >
                        {lesson.is_published ? (
                          <XCircleIcon className="h-4 w-4" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4" />
                        )}
                        <span className="text-sm">
                          {lesson.is_published ? 'Despublicar' : 'Publicar'}
                        </span>
                      </button>
                    </>
                  )}
                </div>

                {hasPermission(currentUser, 'admin.courses.delete') && (
                  <button
                    onClick={() => {
                      setSelectedLesson(lesson)
                      setShowDeleteModal(true)
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">
              Nenhuma aula encontrada
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || statusFilter !== 'all' || courseFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando sua primeira aula'}
            </p>
            {hasPermission(currentUser, 'admin.courses.create') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Criar primeira aula
              </button>
            )}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <LessonForm
            courses={courses}
            onSubmit={handleCreateLesson}
            onCancel={() => setShowCreateModal(false)}
            loading={loading}
          />
        )}

        {/* Edit Modal */}
        {showEditModal && selectedLesson && (
          <LessonForm
            lesson={selectedLesson}
            courses={courses}
            onSubmit={handleUpdateLesson}
            onCancel={() => {
              setShowEditModal(false)
              setSelectedLesson(null)
            }}
            loading={loading}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedLesson && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-white mb-4">
                Confirmar exclusão
              </h3>
              <p className="text-slate-300 mb-6">
                Tem certeza que deseja excluir a aula &ldquo;{selectedLesson.title}&rdquo;? 
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedLesson(null)
                  }}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteLesson(selectedLesson.id)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LessonManagement