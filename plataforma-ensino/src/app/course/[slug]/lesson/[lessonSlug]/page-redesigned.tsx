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
 * Redesigned lesson page that uses the new LessonPageIntegration component
 * This maintains backward compatibility with existing data flow while using the new UI
 */
export default function LessonPageRedesigned() {
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
  const [exercises, setExercises] = useState<any[]>([])
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [quizProgress, setQuizProgress] = useState<{[key: string]: any}>({})
  
  const supabase = createClient()

  const fetchLessonData = useCallback(async () => {
    try {
      // Get user authentication
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user.id)

      // Fetch course by slug
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title, slug')
        .eq('slug', courseSlug)
        .eq('is_published', true)
        .single()

      if (courseError) {
        if (courseError.code === 'PGRST116') {
          setError('Curso não encontrado')
        } else {
          throw courseError
        }
        return
      }

      setCourse(courseData)

      // Fetch lesson by slug and course
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .eq('slug', lessonSlug)
        .eq('is_published', true)
        .single()

      if (lessonError) {
        if (lessonError.code === 'PGRST116') {
          setError('Aula não encontrada')
        } else {
          throw lessonError
        }
        return
      }

      setLesson(lessonData)

      // Check enrollment
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseData.id)
        .eq('status', 'active')
        .single()

      if (enrollmentError && enrollmentError.code !== 'PGRST116') {
        throw enrollmentError
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
          .select('*')
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
      setError(err?.message || 'Erro ao carregar aula')
    } finally {
      setLoading(false)
    }
  }, [courseSlug, lessonSlug, supabase, router])

  useEffect(() => {
    fetchLessonData()
  }, [fetchLessonData])

  // Handle lesson completion
  const handleLessonComplete = useCallback(async () => {
    try {
      if (!lesson || !userId || !enrollmentId) return

      // Update progress to completed
      const { error: updateError } = await supabase
        .from('progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('lesson_id', lesson.id)
        .eq('enrollment_id', enrollmentId)

      if (updateError) {
        console.error('Error updating progress:', updateError)
        return
      }

      // Navigate back to course
      router.push(`/course/${course?.slug}`)
    } catch (error) {
      console.error('Error completing lesson:', error)
    }
  }, [lesson, userId, enrollmentId, supabase, router, course])

  // Handle exit
  const handleExit = useCallback(() => {
    router.push(`/course/${course?.slug}`)
  }, [router, course])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-destructive text-2xl">⚠</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar aula</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => router.push(`/course/${courseSlug}`)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Voltar ao Curso
          </button>
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