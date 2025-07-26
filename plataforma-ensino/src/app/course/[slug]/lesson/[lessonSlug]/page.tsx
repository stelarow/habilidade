'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loading } from '@/components/ui'
import LessonPageIntegration from '@/components/lesson/LessonPageIntegration'

// Types from existing lesson page
interface Course {
  id: string
  title: string
  slug: string
}

interface Lesson {
  id: string
  course_id: string
  title: string
  slug: string
  description?: string
  video_url?: string
  video_duration?: number
  order_index: number
  content?: string
  materials: any[]
  allows_file_upload?: boolean
  is_preview: boolean
  is_published: boolean
}

interface UserProgress {
  id?: string
  lesson_id: string
  completed: boolean
  last_position: number
  watch_time: number
  completed_at?: string
}

/**
 * Updated lesson page that uses the new LessonPageIntegration component
 * This maintains backward compatibility with existing data flow while using the new redesigned UI
 */
export default function LessonPageRefactored() {
  const router = useRouter()
  const params = useParams()
  const courseSlug = params?.slug as string
  const lessonSlug = params?.lessonSlug as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true) // Track initial load to prevent brief errors
  const [exercises, setExercises] = useState<any[]>([])
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [quizProgress, setQuizProgress] = useState<{[key: string]: any}>({})
  
  const supabase = createClient()

  const fetchLessonData = useCallback(async () => {
    try {
      setError(null) // Clear any previous errors
      
      // Get user authentication with timeout for mobile networks
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) {
        console.error('Auth error:', authError)
        setError('Erro de autenticação. Tente novamente.')
        return
      }
      
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user.id)

      // Fetch course by slug with error handling
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title, slug')
        .eq('slug', courseSlug)
        .eq('is_published', true)
        .single()

      if (courseError) {
        console.error('Course fetch error:', courseError)
        if (courseError.code === 'PGRST116') {
          setError('Curso não encontrado')
        } else {
          setError('Erro ao carregar curso. Tente novamente.')
        }
        return
      }

      setCourse(courseData)

      // Fetch lesson by slug and course with error handling
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .eq('slug', lessonSlug)
        .eq('is_published', true)
        .single()

      if (lessonError) {
        console.error('Lesson fetch error:', lessonError)
        if (lessonError.code === 'PGRST116') {
          setError('Aula não encontrada')
        } else {
          setError('Erro ao carregar aula. Tente novamente.')
        }
        return
      }

      setLesson(lessonData)

      // Check enrollment with error handling
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseData.id)
        .in('status', ['active', 'completed'])
        .single()

      if (enrollmentError && enrollmentError.code !== 'PGRST116') {
        console.error('Enrollment fetch error:', enrollmentError)
        setError('Erro ao verificar matrícula. Tente novamente.')
        return
      }

      if (!enrollmentData && !lessonData.is_preview) {
        setError('Você precisa estar matriculado para acessar esta aula')
        return
      }

      if (enrollmentData) {
        setEnrollmentId(enrollmentData.id)

        // Fetch user progress for this lesson
        const { data: progressData, error: progressError } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonData.id)
          .eq('enrollment_id', enrollmentData.id)
          .single()

        if (progressError && progressError.code !== 'PGRST116') {
          throw progressError
        }

        if (progressData) {
          setProgress(progressData)
        } else {
          // Create initial progress record
          const { data: newProgress, error: createError } = await supabase
            .from('progress')
            .insert({
              user_id: user.id,
              lesson_id: lessonData.id,
              enrollment_id: enrollmentData.id,
              completed: false,
              last_position: 0,
              watch_time: 0
            })
            .select()
            .single()

          if (createError) throw createError
          setProgress(newProgress)
        }
      }

      // Fetch exercises, quizzes, and submissions
      try {
        const { data: exercisesData } = await supabase
          .from('exercises')
          .select('*')
          .eq('lesson_id', lessonData.id)
          .order('order_index')
        
        setExercises(exercisesData || [])
      } catch (exerciseError) {
        console.warn('Error fetching exercises:', exerciseError)
        setExercises([])
      }

      try {
        const { data: quizzesData } = await supabase
          .from('quizzes')
          .select(`
            *,
            questions:quiz_questions(*)
          `)
          .eq('lesson_id', lessonData.id)
        
        setQuizzes(quizzesData || [])
      } catch (quizError) {
        console.warn('Error fetching quizzes:', quizError)
        setQuizzes([])
      }

      if (enrollmentData && user) {
        try {
          const { data: submissionsData } = await supabase
            .from('lesson_submissions')
            .select('*')
            .eq('lesson_id', lessonData.id)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
          
          setSubmissions(submissionsData || [])
        } catch (submissionError) {
          console.warn('Error fetching submissions:', submissionError)
          setSubmissions([])
        }
      }

    } catch (err: any) {
      console.error('Error loading lesson data:', err)
      // Only set error if it's not the initial load or if it's been more than 2 seconds
      if (!isInitialLoad) {
        setError(err?.message || 'Erro ao carregar aula')
      } else {
        // On initial load, add a small delay to prevent brief error flashes on mobile
        setTimeout(() => {
          if (isInitialLoad) {
            setError(err?.message || 'Erro ao carregar aula')
          }
        }, 2000)
      }
    } finally {
      setLoading(false)
      setIsInitialLoad(false)
    }
  }, [courseSlug, lessonSlug, supabase, router, isInitialLoad])

  useEffect(() => {
    fetchLessonData()
  }, [fetchLessonData])

  // Handle lesson completion (callback for enhanced completion system)
  const handleLessonComplete = useCallback(async () => {
    try {
      console.log('Lesson completion success callback triggered')
      // The enhanced completion system handles the database update via API
      // This callback is just for additional actions if needed
      
      // Refresh the lesson data to update the progress state
      await fetchLessonData()
    } catch (error) {
      console.error('Error in completion callback:', error)
    }
  }, [fetchLessonData])

  // Handle exit
  const handleExit = useCallback(async () => {
    console.log('Main lesson page handleExit called')
    console.log('Course data:', course)
    console.log('Current URL before exit:', window.location.href)
    console.log('Attempting to navigate to:', `/course/${course?.slug}`)
    
    try {
      if (course?.slug) {
        await router.push(`/course/${course.slug}`)
        console.log('Navigation to course completed successfully')
        
        // Immediate check and force navigation if needed
        setTimeout(() => {
          console.log('Current URL after navigation:', window.location.href)
          const expectedPath = `/course/${course.slug}`
          const currentPath = window.location.pathname
          
          console.log(`🔍 Checking navigation:`)
          console.log(`Expected path: ${expectedPath}`)
          console.log(`Current path: ${currentPath}`)
          console.log(`Paths match: ${currentPath === expectedPath}`)
          console.log(`Current includes expected: ${currentPath.includes(expectedPath)}`)
          
          // Fixed logic: URL should be EXACTLY the expected path
          if (currentPath !== expectedPath) {
            console.log(`❌ URL did NOT change correctly!`)
            console.log('🔧 Forcing immediate redirect...')
            window.location.href = expectedPath
          } else {
            console.log('✅ Navigation successful - URL changed correctly')
          }
        }, 50)
      } else {
        console.log('No course slug available, navigating to dashboard')
        await router.push('/dashboard')
        
        setTimeout(() => {
          if (window.location.pathname !== '/dashboard') {
            console.log('Dashboard navigation failed, forcing reload...')
            window.location.href = '/dashboard'
          }
        }, 100)
      }
    } catch (error) {
      console.error('Navigation error:', error)
      // Fallback to dashboard
      try {
        await router.push('/dashboard')
      } catch (fallbackError) {
        console.error('Dashboard fallback failed:', fallbackError)
        console.log('All navigation failed, forcing dashboard reload...')
        window.location.href = '/dashboard'
      }
    }
  }, [router, course])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error && !isInitialLoad) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-destructive text-2xl">⚠</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar aula</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setError(null)
                setIsInitialLoad(true)
                setLoading(true)
                fetchLessonData()
              }}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => router.push(`/course/${courseSlug}`)}
              className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              Voltar ao Curso
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!lesson || !course) {
    return null
  }

  return (
    <LessonPageIntegration
      course={course}
      lesson={lesson}
      progress={progress}
      exercises={exercises}
      quizzes={quizzes}
      submissions={submissions}
      quizProgress={quizProgress}
      onLessonComplete={handleLessonComplete}
      onExit={handleExit}
      userId={userId}
      enrollmentId={enrollmentId}
    />
  )
}