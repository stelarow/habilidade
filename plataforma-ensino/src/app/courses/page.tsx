'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { GradientButton, Starfield, Loading } from '@/components/ui'
import { 
  BookOpen, 
  Clock, 
  User,
  Star,
  Play,
  ArrowLeft,
  Funnel,
  MagnifyingGlass
} from 'phosphor-react'

interface Course {
  id: string
  title: string
  slug: string
  description?: string
  short_description?: string
  thumbnail_url?: string
  price: number
  duration_minutes: number
  level: 'beginner' | 'intermediate' | 'advanced'
  is_published: boolean
  created_at: string
  category?: {
    name: string
    color_theme: string
  }
  instructor?: {
    user?: {
      full_name: string
    }
  }
}

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  const fetchCourses = useCallback(async () => {
    try {
      // Get user authentication
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user.id)

      // Fetch courses
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          category:categories(name, color_theme),
          instructor:instructors(
            user:users(full_name)
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Fetch user enrollments
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('course_id, status, enrolled_at')
        .eq('user_id', user.id)

      if (enrollmentsError) throw enrollmentsError

      setCourses(data || [])
      setEnrollments(enrollmentsData || [])
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar cursos')
    } finally {
      setLoading(false)
    }
  }, [supabase, router])

  // Carregar cursos após definir a função
  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  // Function to check if user is enrolled in a course
  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.course_id === courseId && ['active', 'completed'].includes(e.status))
  }

  // Function to handle course enrollment
  const handleEnroll = async (courseId: string) => {
    if (!userId) return

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
          status: 'active',
          enrolled_at: new Date().toISOString()
        })

      if (error) throw error

      // Refresh enrollments
      const { data: newEnrollments } = await supabase
        .from('enrollments')
        .select('course_id, status, enrolled_at')
        .eq('user_id', userId)

      setEnrollments(newEnrollments || [])
      
      // Navigate to course
      const course = courses.find(c => c.id === courseId)
      if (course) {
        router.push(`/course/${course.slug}`)
      }

    } catch (err) {
      console.error('Error enrolling in course:', err)
    }
  }

  // Function to continue course
  const handleContinueCourse = (courseSlug: string) => {
    router.push(`/course/${courseSlug}`)
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    
    return matchesSearch && matchesLevel
  })

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}min` : ''}`
    }
    return `${mins}min`
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-400 bg-green-400/20'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20'
      case 'advanced': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Iniciante'
      case 'intermediate': return 'Intermediário'
      case 'advanced': return 'Avançado'
      default: return level
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Erro ao carregar cursos</h3>
          <p className="text-white/60 mb-4">{error}</p>
          <GradientButton onClick={fetchCourses}>
            Tentar novamente
          </GradientButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <Starfield count={30} className="opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Explorar Cursos
              </h1>
              <p className="text-gray-400 mt-2">
                Descubra novos conhecimentos e habilidades
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/progress')}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Star className="w-4 h-4" />
              <span>Progresso</span>
            </button>
            <GradientButton onClick={() => router.push('/profile')}>
              Perfil
            </GradientButton>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-3 bg-zinc-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos os níveis</option>
            <option value="beginner">Iniciante</option>
            <option value="intermediate">Intermediário</option>
            <option value="advanced">Avançado</option>
          </select>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6 text-center">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{courses.length}</p>
            <p className="text-gray-400 text-sm">Cursos Disponíveis</p>
          </div>
          
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6 text-center">
            <Clock className="w-8 h-8 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {Math.round(courses.reduce((total, course) => total + course.duration_minutes, 0) / 60)}h
            </p>
            <p className="text-gray-400 text-sm">Total de Conteúdo</p>
          </div>
          
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6 text-center">
            <Funnel className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{filteredCourses.length}</p>
            <p className="text-gray-400 text-sm">Resultados Filtrados</p>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 overflow-hidden hover:border-primary/50 transition-all duration-300 group cursor-pointer flex flex-col h-full"
                onClick={() => router.push(`/course/${course.slug}`)}
              >
                {/* Course Image */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                  {course.thumbnail_url ? (
                    <Image 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Play className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                  )}
                </div>

                {/* Course Info */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      {course.category && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          {course.category.name}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(course.level)}`}>
                      {getLevelText(course.level)}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {course.short_description || course.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDuration(course.duration_minutes)}</span>
                      </div>
                      {course.instructor?.user && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{course.instructor.user.full_name}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      {course.price > 0 ? (
                        <p className="text-lg font-bold text-primary">
                          R$ {course.price.toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-lg font-bold text-green-400">
                          Gratuito
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Enrollment Button */}
                  <div className="mt-auto">
                    {isEnrolled(course.id) ? (
                      <GradientButton 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation()
                          handleContinueCourse(course.slug)
                        }}
                        className="w-full"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Continuar Curso
                      </GradientButton>
                    ) : (
                      <GradientButton 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation()
                          handleEnroll(course.id)
                        }}
                        className="w-full"
                      >
                        Matricular-se
                      </GradientButton>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum curso encontrado</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedLevel !== 'all' 
                ? 'Tente ajustar os filtros ou buscar por outros termos'
                : 'Não há cursos disponíveis no momento'
              }
            </p>
            {(searchTerm || selectedLevel !== 'all') && (
              <GradientButton 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedLevel('all')
                }}
              >
                Limpar Filtros
              </GradientButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}