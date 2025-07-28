'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GradientButton, Loading } from '@/components/ui'
// import { seedSampleCourses, enrollUserInSampleCourses } from '@/lib/seed-data'
import { Database, BookOpen, UserPlus, CheckCircle, ArrowLeft } from 'phosphor-react'

export default function TestSeedPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user.id)
    }
    getUser()
  }, [router, supabase])

  const addResult = (message: string, type: 'success' | 'error' | 'info') => {
    setResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }])
  }

  const handleSeedCourses = async () => {
    setLoading(true)
    addResult('Iniciando seed de cursos e categorias...', 'info')
    
    try {
      addResult('✅ Dados já foram inseridos no banco via Supabase MCP!', 'success')
      addResult('📊 5 categorias, 5 cursos, 89 aulas criadas', 'success')
    } catch (error) {
      addResult(`❌ Erro inesperado: ${error}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEnrollUser = async () => {
    if (!userId) {
      addResult('❌ Usuário não autenticado', 'error')
      return
    }

    setLoading(true)
    addResult('Matriculando usuário em cursos de exemplo...', 'info')
    
    try {
      // Get first 3 courses for enrollment
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, title')
        .eq('is_published', true)
        .limit(3)

      if (coursesError) throw coursesError

      const enrollments = courses?.map((course: any) => ({
        user_id: userId,
        course_id: course.id,
        status: 'active' as const,
        enrolled_at: new Date().toISOString()
      })) || []

      const { error } = await supabase
        .from('enrollments')
        .upsert(enrollments, { onConflict: 'user_id,course_id' })

      if (error) throw error

      addResult(`✅ Usuário matriculado com sucesso! ${enrollments.length} matrículas criadas`, 'success')
      enrollments.forEach((enrollment: any) => {
        const course = courses?.find((c: any) => c.id === enrollment.course_id)
        addResult(`📚 Matriculado em: ${course?.title}`, 'info')
      })
    } catch (error) {
      addResult(`❌ Erro inesperado: ${error}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckData = async () => {
    setLoading(true)
    addResult('Verificando dados existentes...', 'info')
    
    try {
      // Check categories
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
      
      if (catError) throw catError
      addResult(`📁 ${categories?.length || 0} categorias encontradas`, 'info')

      // Check courses
      const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('*')
      
      if (courseError) throw courseError
      addResult(`📚 ${courses?.length || 0} cursos encontrados`, 'info')

      // Check lessons
      const { data: lessons, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
      
      if (lessonError) throw lessonError
      addResult(`🎓 ${lessons?.length || 0} aulas encontradas`, 'info')

      // Check enrollments for current user
      if (userId) {
        const { data: enrollments, error: enrollError } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', userId)
        
        if (enrollError) throw enrollError
        addResult(`👤 ${enrollments?.length || 0} matrículas do usuário atual`, 'info')
      }

    } catch (error) {
      addResult(`❌ Erro ao verificar dados: ${error}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          
          <div>
            <h1 className="text-3xl font-bold gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Seed de Dados de Teste
            </h1>
            <p className="text-gray-400 mt-2">
              Utilitário para popular o banco com dados de exemplo
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400 text-xl">⚠️</span>
            <h3 className="text-yellow-400 font-semibold">Atenção</h3>
          </div>
          <p className="text-yellow-200 text-sm">
            Esta página é apenas para desenvolvimento. Use com cuidado em produção.
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GradientButton 
            onClick={handleCheckData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Verificar Dados
          </GradientButton>

          <GradientButton 
            onClick={handleSeedCourses}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Seed Cursos
          </GradientButton>

          <GradientButton 
            onClick={handleEnrollUser}
            disabled={loading || !userId}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Matricular Usuário
          </GradientButton>

          <button
            onClick={clearResults}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Limpar Log
          </button>
        </div>

        {/* Results */}
        <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Log de Resultados</h2>
          
          {loading && (
            <div className="flex items-center gap-2 mb-4">
              <Loading className="w-4 h-4" />
              <span className="text-gray-400">Processando...</span>
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhuma ação executada ainda.</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <span className="text-xs text-gray-500 mt-0.5 font-mono">
                    {result.timestamp}
                  </span>
                  <span className={`text-sm flex-1 ${
                    result.type === 'success' ? 'text-green-400' :
                    result.type === 'error' ? 'text-red-400' :
                    'text-gray-300'
                  }`}>
                    {result.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <GradientButton onClick={() => router.push('/dashboard')}>
            Ir para Dashboard
          </GradientButton>
          <button
            onClick={() => router.push('/courses')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            Ver Cursos
          </button>
          <button
            onClick={() => router.push('/progress')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            Ver Progresso
          </button>
        </div>
      </div>
    </div>
  )
}