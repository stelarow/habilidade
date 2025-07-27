'use client'

import { useState, useEffect } from 'react'
import type { Lesson, Course, ExtendedLessonForm, ExerciseForm, QuizQuestionForm } from '@/types'
import { 
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  PaperClipIcon,
  PlayIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { validateAndFormatYouTubeUrl } from '@/lib/youtube-utils'

interface LessonFormProps {
  lesson?: Lesson
  courses: Course[]
  onSubmit: (data: ExtendedLessonForm) => void
  onCancel: () => void
  loading: boolean
}

export function LessonForm({ 
  lesson, 
  courses, 
  onSubmit, 
  onCancel, 
  loading 
}: LessonFormProps) {
  const [formData, setFormData] = useState<ExtendedLessonForm>({
    title: lesson?.title || '',
    description: lesson?.description || '',
    video_url: lesson?.video_url || '',
    content: lesson?.content || '',
    allows_file_upload: lesson?.allows_file_upload || false,
    materials: lesson?.materials || [],
    is_preview: lesson?.is_preview || false,
    order_index: lesson?.order_index || 1,
    exercises: [],
    quiz: undefined
  })
  
  const [selectedCourseId, setSelectedCourseId] = useState(lesson?.course_id || '')
  const [nextOrderIndex, setNextOrderIndex] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'exercises' | 'quiz'>('basic')
  const [videoUrlError, setVideoUrlError] = useState<string | null>(null)

  // Fetch next order index when course is selected
  useEffect(() => {
    if (selectedCourseId && !lesson) {
      fetchNextOrderIndex(selectedCourseId)
    }
  }, [selectedCourseId, lesson])

  const fetchNextOrderIndex = async (courseId: string) => {
    try {
      const response = await fetch(`/api/admin/lessons/next-order?courseId=${courseId}`)
      if (response.ok) {
        const result = await response.json()
        setNextOrderIndex(result.data.nextOrderIndex)
        setFormData(prev => ({ ...prev, order_index: result.data.nextOrderIndex }))
      }
    } catch (error) {
      console.error('Error fetching next order index:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCourseId) {
      alert('Por favor, selecione um curso')
      return
    }
    
    if (!formData.title.trim()) {
      alert('Por favor, insira um título para a aula')
      return
    }

    const submitData = {
      ...formData,
      course_id: selectedCourseId
    }

    onSubmit(submitData)
  }

  const addExercise = () => {
    const newExercise: ExerciseForm = {
      title: '',
      description: '',
      download_url: '',
      order_index: formData.exercises.length + 1
    }
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }))
  }

  const updateExercise = (index: number, field: keyof ExerciseForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      )
    }))
  }

  const removeExercise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }))
  }

  const addQuizQuestion = () => {
    if (!formData.quiz) {
      setFormData(prev => ({
        ...prev,
        quiz: {
          title: '',
          description: '',
          instructions: '',
          attempts_allowed: 1,
          passing_score: 70,
          questions: []
        }
      }))
    }

    const newQuestion: QuizQuestionForm = {
      question: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      explanation: '',
      points: 1,
      order_index: (formData.quiz?.questions.length || 0) + 1
    }

    setFormData(prev => ({
      ...prev,
      quiz: prev.quiz ? {
        ...prev.quiz,
        questions: [...prev.quiz.questions, newQuestion]
      } : {
        title: '',
        description: '',
        instructions: '',
        attempts_allowed: 1,
        passing_score: 70,
        questions: [newQuestion]
      }
    }))
  }

  const updateQuizQuestion = (questionIndex: number, field: keyof QuizQuestionForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      quiz: prev.quiz ? {
        ...prev.quiz,
        questions: prev.quiz.questions.map((question, i) => 
          i === questionIndex ? { ...question, [field]: value } : question
        )
      } : undefined
    }))
  }

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      quiz: prev.quiz ? {
        ...prev.quiz,
        questions: prev.quiz.questions.map((question, i) => 
          i === questionIndex ? {
            ...question,
            options: question.options.map((option, j) => j === optionIndex ? value : option)
          } : question
        )
      } : undefined
    }))
  }

  const removeQuizQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      quiz: prev.quiz ? {
        ...prev.quiz,
        questions: prev.quiz.questions.filter((_, i) => i !== index)
      } : undefined
    }))
  }

  const tabs = [
    { id: 'basic', label: 'Informações Básicas', icon: PlayIcon },
    { id: 'content', label: 'Conteúdo da Apostila', icon: DocumentTextIcon },
    { id: 'exercises', label: 'Exercícios', icon: PaperClipIcon },
    { id: 'quiz', label: 'Quiz', icon: QuestionMarkCircleIcon },
  ] as const

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">
            {lesson ? 'Editar Aula' : 'Nova Aula'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className="border-b border-slate-800">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Curso *
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    required
                    disabled={!!lesson} // Can't change course when editing
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    <option value="">Selecione um curso</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  {nextOrderIndex !== null && (
                    <p className="text-sm text-slate-400 mt-1">
                      Esta será a aula {nextOrderIndex} do curso
                    </p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Título da Aula *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: Introdução ao React"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Descreva o que será abordado nesta aula..."
                  />
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Link do Vídeo (opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => {
                      const url = e.target.value
                      setFormData(prev => ({ ...prev, video_url: url }))
                      
                      // Validate YouTube URL
                      if (url) {
                        const validation = validateAndFormatYouTubeUrl(url)
                        if (!validation.isValid) {
                          setVideoUrlError(validation.error || 'URL do YouTube inválida')
                        } else {
                          setVideoUrlError(null)
                        }
                      } else {
                        setVideoUrlError(null)
                      }
                    }}
                    className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                      videoUrlError ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-purple-500'
                    }`}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {videoUrlError && (
                    <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
                      <ExclamationTriangleIcon className="w-4 h-4" />
                      <span>{videoUrlError}</span>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-slate-400">
                    Suporte para URLs do YouTube (youtube.com/watch?v=, youtu.be/, youtube.com/embed/)
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_preview"
                      checked={formData.is_preview}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_preview: e.target.checked }))}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-600 bg-slate-800"
                    />
                    <label htmlFor="is_preview" className="ml-2 text-sm text-slate-300">
                      Aula de preview (visível para não-inscritos)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allows_file_upload"
                      checked={formData.allows_file_upload}
                      onChange={(e) => setFormData(prev => ({ ...prev, allows_file_upload: e.target.checked }))}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-600 bg-slate-800"
                    />
                    <label htmlFor="allows_file_upload" className="ml-2 text-sm text-slate-300">
                      Permitir upload de arquivos pelos alunos
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Conteúdo da Apostila
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Escreva o conteúdo da apostila aqui. Você pode incluir texto, links, ou informações sobre PDFs que os alunos devem baixar..."
                  />
                  <p className="text-sm text-slate-400 mt-2">
                    Você pode incluir texto explicativo, links para materiais externos, ou instruções para download de PDFs.
                  </p>
                </div>
              </div>
            )}

            {/* Exercises Tab */}
            {activeTab === 'exercises' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Exercícios</h3>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Adicionar Exercício
                  </button>
                </div>

                {formData.exercises.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <PaperClipIcon className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                    <p>Nenhum exercício adicionado</p>
                    <p className="text-sm">Clique em &ldquo;Adicionar Exercício&rdquo; para começar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.exercises.map((exercise, index) => (
                      <div key={index} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-medium text-white">
                            Exercício {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Título do Exercício
                            </label>
                            <input
                              type="text"
                              value={exercise.title}
                              onChange={(e) => updateExercise(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Ex: Exercícios de Fixação"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Descrição/Contexto
                            </label>
                            <textarea
                              value={exercise.description}
                              onChange={(e) => updateExercise(index, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Descreva o exercício e forneça instruções..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Link para Download (opcional)
                            </label>
                            <input
                              type="url"
                              value={exercise.download_url}
                              onChange={(e) => updateExercise(index, 'download_url', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="https://example.com/exercicio.pdf"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Quiz</h3>
                  {!formData.quiz && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        quiz: {
                          title: '',
                          description: '',
                          instructions: '',
                          attempts_allowed: 1,
                          passing_score: 70,
                          questions: []
                        }
                      }))}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Criar Quiz
                    </button>
                  )}
                </div>

                {!formData.quiz ? (
                  <div className="text-center py-8 text-slate-400">
                    <QuestionMarkCircleIcon className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                    <p>Nenhum quiz criado</p>
                    <p className="text-sm">Clique em &ldquo;Criar Quiz&rdquo; para começar</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Quiz Settings */}
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-md font-medium text-white mb-4">Configurações do Quiz</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Título do Quiz
                          </label>
                          <input
                            type="text"
                            value={formData.quiz.title}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              quiz: prev.quiz ? { ...prev.quiz, title: e.target.value } : undefined
                            }))}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Ex: Quiz sobre React"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Tentativas Permitidas
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={formData.quiz.attempts_allowed}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              quiz: prev.quiz ? { ...prev.quiz, attempts_allowed: parseInt(e.target.value) || 1 } : undefined
                            }))}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Nota Mínima (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.quiz.passing_score}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              quiz: prev.quiz ? { ...prev.quiz, passing_score: parseInt(e.target.value) || 70 } : undefined
                            }))}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Limite de Tempo (min, opcional)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formData.quiz.time_limit_minutes || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              quiz: prev.quiz ? { 
                                ...prev.quiz, 
                                time_limit_minutes: e.target.value ? parseInt(e.target.value) : undefined 
                              } : undefined
                            }))}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Deixe vazio para sem limite"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Instruções do Quiz
                        </label>
                        <textarea
                          value={formData.quiz.instructions}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            quiz: prev.quiz ? { ...prev.quiz, instructions: e.target.value } : undefined
                          }))}
                          rows={3}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Instruções para os alunos sobre como realizar o quiz..."
                        />
                      </div>
                    </div>

                    {/* Quiz Questions */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-medium text-white">Questões</h4>
                        <button
                          type="button"
                          onClick={addQuizQuestion}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                          Adicionar Questão
                        </button>
                      </div>

                      {formData.quiz.questions.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                          <QuestionMarkCircleIcon className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                          <p>Nenhuma questão adicionada</p>
                          <p className="text-sm">Clique em &ldquo;Adicionar Questão&rdquo; para começar</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {formData.quiz.questions.map((question, questionIndex) => (
                            <div key={questionIndex} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                              <div className="flex items-center justify-between mb-4">
                                <h5 className="text-md font-medium text-white">
                                  Questão {questionIndex + 1}
                                </h5>
                                <button
                                  type="button"
                                  onClick={() => removeQuizQuestion(questionIndex)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="space-y-4">
                                {/* Question Text */}
                                <div>
                                  <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Enunciado da Questão
                                  </label>
                                  <textarea
                                    value={question.question}
                                    onChange={(e) => updateQuizQuestion(questionIndex, 'question', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Digite a pergunta aqui..."
                                  />
                                </div>

                                {/* Options */}
                                <div>
                                  <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Opções de Resposta
                                  </label>
                                  {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-3 mb-2">
                                      <input
                                        type="radio"
                                        name={`question-${questionIndex}-correct`}
                                        checked={question.correct_answer === optionIndex}
                                        onChange={() => updateQuizQuestion(questionIndex, 'correct_answer', optionIndex)}
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-600 bg-slate-800"
                                      />
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => updateQuestionOption(questionIndex, optionIndex, e.target.value)}
                                        className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder={`Opção ${optionIndex + 1}`}
                                      />
                                    </div>
                                  ))}
                                  <p className="text-xs text-slate-400 mt-1">
                                    Selecione o botão de rádio ao lado da resposta correta
                                  </p>
                                </div>

                                {/* Explanation */}
                                <div>
                                  <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Explicação (opcional)
                                  </label>
                                  <textarea
                                    value={question.explanation}
                                    onChange={(e) => updateQuizQuestion(questionIndex, 'explanation', e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Explicação da resposta correta..."
                                  />
                                </div>

                                {/* Points */}
                                <div>
                                  <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Pontos
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={question.points}
                                    onChange={(e) => updateQuizQuestion(questionIndex, 'points', parseInt(e.target.value) || 1)}
                                    className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 p-6 border-t border-slate-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : (lesson ? 'Atualizar Aula' : 'Criar Aula')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LessonForm