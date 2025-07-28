'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Course, Category, Instructor, User } from '@/types'
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
  XCircleIcon
} from '@heroicons/react/24/outline'
import { BookOpenIcon } from '@heroicons/react/24/solid'
import { CourseForm } from './CourseForm'

interface CoursesManagementProps {
  courses: Course[]
  categories: Category[]
  instructors: Instructor[]
  currentUser: User | UserProfile | null
}

export function CoursesManagement({ 
  courses: initialCourses, 
  categories, 
  instructors, 
  currentUser 
}: CoursesManagementProps) {
  const [courses, setCourses] = useState(initialCourses)
  const [filteredCourses, setFilteredCourses] = useState(initialCourses)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const supabase = createClient()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    let filtered = courses

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((course: any) => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((course: any) => 
        statusFilter === 'published' ? course.is_published : !course.is_published
      )
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((course: any) => course.category_id === categoryFilter)
    }

    setFilteredCourses(filtered)
  }, [courses, searchTerm, statusFilter, categoryFilter])

  // Handle URL parameter for auto-opening create modal
  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'new' && hasPermission(currentUser, 'admin.courses.create')) {
      setShowCreateModal(true)
      // Clean up URL parameter after opening modal
      const url = new URL(window.location.href)
      url.searchParams.delete('action')
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [searchParams, currentUser, router])

  const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
    if (!hasPermission(currentUser, 'admin.courses.edit')) {
      alert('Você não tem permissão para editar cursos')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !currentStatus })
        .eq('id', courseId)

      if (error) throw error

      setCourses(courses.map((course: any) => 
        course.id === courseId ? { ...course, is_published: !currentStatus } : course
      ))
    } catch (error) {
      console.error('Error updating course status:', error)
      alert('Erro ao atualizar status do curso')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = async (courseData: any) => {
    if (!hasPermission(currentUser, 'admin.courses.create')) {
      alert('Você não tem permissão para criar cursos')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar curso')
      }

      const { data: newCourse } = await response.json()
      setCourses([newCourse, ...courses])
      setShowCreateModal(false)
      alert('Curso criado com sucesso!')
    } catch (error: any) {
      console.error('Error creating course:', error)
      alert(error instanceof Error ? error.message : 'Erro ao criar curso')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCourse = async (courseData: any) => {
    if (!hasPermission(currentUser, 'admin.courses.edit') || !selectedCourse) {
      alert('Você não tem permissão para editar cursos')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/courses/${selectedCourse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar curso')
      }

      const { data: updatedCourse } = await response.json()
      setCourses(courses.map((course: any) => 
        course.id === selectedCourse.id ? updatedCourse : course
      ))
      setShowEditModal(false)
      setSelectedCourse(null)
      alert('Curso atualizado com sucesso!')
    } catch (error: any) {
      console.error('Error updating course:', error)
      alert(error instanceof Error ? error.message : 'Erro ao atualizar curso')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!hasPermission(currentUser, 'admin.courses.delete')) {
      alert('Você não tem permissão para deletar cursos')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao deletar curso')
      }

      setCourses(courses.filter((course: any) => course.id !== courseId))
      setShowDeleteModal(false)
      setSelectedCourse(null)
      alert('Curso excluído com sucesso!')
    } catch (error: any) {
      console.error('Error deleting course:', error)
      alert(error instanceof Error ? error.message : 'Erro ao deletar curso')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Iniciante'
      case 'intermediate': return 'Intermediário'
      case 'advanced': return 'Avançado'
      default: return level
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Gerenciamento de Cursos</h1>
          <p className="text-gray-400">Gerencie os cursos da plataforma</p>
        </div>
        {hasPermission(currentUser, 'admin.courses.create') && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Novo Curso</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos os Status</option>
              <option value="published">Publicados</option>
              <option value="draft">Rascunhos</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            {/* Course Image */}
            <div className="relative h-48 bg-gray-700">
              {course.thumbnail_url ? (
                <Image
                  src={course.thumbnail_url}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpenIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                {course.is_published ? (
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Publicado
                  </span>
                ) : (
                  <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Rascunho
                  </span>
                )}
              </div>
            </div>

            {/* Course Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-white truncate">
                  {course.title}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(course.level)}`}>
                  {getLevelLabel(course.level)}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {course.short_description || course.description}
              </p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: course.category?.color_theme || '#d400ff' }}
                  />
                  <span className="text-sm text-gray-400">
                    {course.category?.name || 'Sem categoria'}
                  </span>
                </div>
                <span className="text-sm font-medium text-purple-400">
                  {formatPrice(course.price)}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>{course.stats?.total_enrollments || 0} alunos</span>
                <span>⭐ {course.stats?.average_rating?.toFixed(1) || '0.0'}</span>
                <span>{Math.floor((course.duration_minutes || 0) / 60)}h</span>
              </div>

              {/* Instructor */}
              <div className="text-sm text-gray-400 mb-4">
                <span>Instrutor: {course.instructor?.user?.full_name || 'Não atribuído'}</span>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(`/course/${course.slug}`, '_blank')}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Visualizar"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  
                  {hasPermission(currentUser, 'admin.courses.edit') && (
                    <button
                      onClick={() => {
                        setSelectedCourse(course)
                        setShowEditModal(true)
                      }}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors"
                      title="Editar"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                  
                  {hasPermission(currentUser, 'admin.courses.delete') && (
                    <button
                      onClick={() => {
                        setSelectedCourse(course)
                        setShowDeleteModal(true)
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Excluir"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {hasPermission(currentUser, 'admin.courses.publish') && (
                  <button
                    onClick={() => handleTogglePublish(course.id, course.is_published)}
                    disabled={loading}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                      course.is_published
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {course.is_published ? (
                      <>
                        <XCircleIcon className="h-4 w-4" />
                        <span>Ocultar</span>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>Publicar</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <BookOpenIcon className="h-16 w-16 mx-auto mb-4" />
          <p className="text-lg">Nenhum curso encontrado</p>
          <p className="text-sm">Tente ajustar os filtros ou criar um novo curso</p>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-white mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja excluir o curso <strong>{selectedCourse.title}</strong>?
              Esta ação não pode ser desfeita e todas as matrículas serão perdidas.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteCourse(selectedCourse.id)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <CourseForm
          categories={categories}
          instructors={instructors}
          onSubmit={handleCreateCourse}
          onCancel={() => setShowCreateModal(false)}
          loading={loading}
        />
      )}

      {/* Edit Course Modal */}
      {showEditModal && selectedCourse && (
        <CourseForm
          course={selectedCourse}
          categories={categories}
          instructors={instructors}
          onSubmit={handleUpdateCourse}
          onCancel={() => {
            setShowEditModal(false)
            setSelectedCourse(null)
          }}
          loading={loading}
        />
      )}
    </div>
  )
}