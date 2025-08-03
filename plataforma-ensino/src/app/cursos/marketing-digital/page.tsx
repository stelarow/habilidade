'use client'

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Clock, 
  Users, 
  Award,
  BookOpen,
  ChevronRight,
  CheckCircle
} from 'lucide-react'

// Dados do curso
const courseData = {
  id: '4',
  title: 'Marketing Digital Estratégico',
  slug: 'marketing-digital',
  description: 'Domine as estratégias mais eficazes do marketing digital moderno. Aprenda a criar campanhas que convertem, entender seu público-alvo e maximizar o ROI dos seus investimentos digitais.',
  level: 'Iniciante',
  duration: '800 minutos',
  students: 1247,
  rating: 4.8,
  instructor: {
    name: 'Prof. Ana Marketing',
    bio: 'Especialista em Marketing Digital com 8 anos de experiência',
    avatar: '/avatars/prof-ana.jpg'
  },
  category: {
    name: 'Marketing Digital',
    color: 'bg-purple-100 text-purple-800'
  }
}

// Lista de aulas do curso
const lessons = [
  {
    id: '4-1',
    title: 'Fundamentos do Marketing Digital',
    slug: 'fundamentos',
    description: 'Introdução aos conceitos essenciais do marketing digital moderno.',
    duration: 60,
    order: 1,
    type: 'video+materials',
    isCompleted: false,
    isLocked: false,
    isPreview: true,
    topics: [
      'Conceitos fundamentais',
      'Diferenças do marketing tradicional',
      'Personas e segmentação',
      'Funil de marketing',
      'Principais canais digitais'
    ]
  },
  {
    id: '4-2',
    title: 'Estratégias de Conteúdo',
    slug: 'estrategias-conteudo',
    description: 'Como criar conteúdo que engaja e converte seu público-alvo.',
    duration: 75,
    order: 2,
    type: 'video+exercise',
    isCompleted: false,
    isLocked: true,
    isPreview: false,
    topics: [
      'Planejamento de conteúdo',
      'Storytelling digital',
      'Calendário editorial',
      'Métricas de engajamento'
    ]
  },
  {
    id: '4-3',
    title: 'Redes Sociais e Comunidades',
    slug: 'redes-sociais',
    description: 'Aprenda a construir e gerenciar comunidades nas principais redes sociais.',
    duration: 90,
    order: 3,
    type: 'video+quiz',
    isCompleted: false,
    isLocked: true,
    isPreview: false,
    topics: [
      'Escolha das plataformas',
      'Estratégias por rede social',
      'Gestão de comunidades',
      'Crisis management'
    ]
  },
  {
    id: '4-4',
    title: 'SEO e Marketing de Busca',
    slug: 'seo-marketing-busca',
    description: 'Domine as técnicas de otimização para mecanismos de busca.',
    duration: 85,
    order: 4,
    type: 'video+materials+exercise',
    isCompleted: false,
    isLocked: true,
    isPreview: false,
    topics: [
      'Fundamentos de SEO',
      'Pesquisa de palavras-chave',
      'SEO on-page e off-page',
      'Google Ads básico'
    ]
  },
  {
    id: '4-5',
    title: 'Email Marketing Efetivo',
    slug: 'email-marketing',
    description: 'Estratégias para criar campanhas de email que realmente convertem.',
    duration: 70,
    order: 5,
    type: 'video+exercise',
    isCompleted: false,
    isLocked: true,
    isPreview: false,
    topics: [
      'Construção de listas',
      'Segmentação de audiência',
      'Design de emails',
      'Automação de marketing'
    ]
  },
  {
    id: '4-6',
    title: 'Métricas e Análise de Resultados',
    slug: 'metricas-analise',
    description: 'Como medir e otimizar o desempenho das suas campanhas digitais.',
    duration: 80,
    order: 6,
    type: 'video+quiz+exercise',
    isCompleted: false,
    isLocked: true,
    isPreview: false,
    topics: [
      'KPIs essenciais',
      'Google Analytics',
      'ROI e ROAS',
      'Relatórios e dashboards'
    ]
  }
]

// Progresso geral do curso
const courseProgress = {
  completedLessons: 0,
  totalLessons: lessons.length,
  overallProgress: 0
}

export default function MarketingDigitalCoursePage() {
  const getTypeIcon = (type: string) => {
    if (type.includes('video')) return <Play className="h-4 w-4" />
    if (type.includes('quiz')) return <Award className="h-4 w-4" />
    return <BookOpen className="h-4 w-4" />
  }

  const getTypeBadgeColor = (type: string) => {
    if (type.includes('quiz')) return 'bg-orange-100 text-orange-800'
    if (type.includes('exercise')) return 'bg-green-100 text-green-800'
    return 'bg-blue-100 text-blue-800'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header do curso */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge className={courseData.category.color}>
                {courseData.category.name}
              </Badge>
              <Badge variant="outline" className="text-white border-white/30">
                {courseData.level}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{courseData.title}</h1>
            <p className="text-xl text-purple-100 mb-6 max-w-3xl">
              {courseData.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-purple-100">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{courseData.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{courseData.students.toLocaleString()} alunos</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>⭐ {courseData.rating}/5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conteúdo principal - Lista de aulas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Conteúdo do Curso</h2>
              <div className="text-sm text-muted-foreground">
                {courseProgress.completedLessons} de {courseProgress.totalLessons} aulas concluídas
              </div>
            </div>

            {/* Progresso geral */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Progresso do Curso</span>
                <span className="text-sm text-muted-foreground">
                  {courseProgress.overallProgress}%
                </span>
              </div>
              <Progress value={courseProgress.overallProgress} className="mb-4" />
              <p className="text-sm text-muted-foreground">
                Continue estudando para desbloquear novas aulas e completar o curso!
              </p>
            </Card>

            {/* Lista de aulas */}
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <Card key={lesson.id} className={`p-6 transition-all hover:shadow-md ${
                  lesson.isLocked ? 'opacity-60' : ''
                }`}>
                  <div className="flex items-start gap-4">
                    {/* Status da aula */}
                    <div className="flex-shrink-0 mt-1">
                      {lesson.isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          lesson.isLocked 
                            ? 'border-gray-300 text-gray-400' 
                            : 'border-primary text-primary'
                        }`}>
                          {lesson.order}
                        </div>
                      )}
                    </div>

                    {/* Conteúdo da aula */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{lesson.title}</h3>
                            {lesson.isPreview && (
                              <Badge variant="outline" className="text-xs">
                                Prévia
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground mb-3">{lesson.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{lesson.duration} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(lesson.type)}
                              <span className="capitalize">{lesson.type.replace('+', ' + ')}</span>
                            </div>
                          </div>

                          {/* Tópicos da aula */}
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Tópicos abordados:</p>
                            <div className="flex flex-wrap gap-1">
                              {lesson.topics.map((topic, topicIndex) => (
                                <Badge 
                                  key={topicIndex} 
                                  variant="secondary" 
                                  className="text-xs"
                                >
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Botão de ação */}
                        <div className="flex-shrink-0">
                          {!lesson.isLocked ? (
                            <Link href={`/cursos/marketing-digital/aulas/${lesson.slug}`}>
                              <Button className="gradient-button">
                                {lesson.isCompleted ? 'Revisar' : 'Iniciar'}
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                          ) : (
                            <Button disabled variant="outline">
                              Bloqueado
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Informações do curso */}
          <div className="space-y-6">
            {/* Informações do instrutor */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Seu Instrutor</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  AM
                </div>
                <div>
                  <p className="font-medium">{courseData.instructor.name}</p>
                  <p className="text-sm text-muted-foreground">Instrutor</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {courseData.instructor.bio}
              </p>
            </Card>

            {/* Certificado */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Certificado de Conclusão</h3>
              <div className="text-center py-6">
                <Award className="h-12 w-12 mx-auto text-yellow-500 mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Complete todas as aulas para receber seu certificado digital
                </p>
                <Progress value={courseProgress.overallProgress} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  {courseProgress.completedLessons} de {courseProgress.totalLessons} aulas
                </p>
              </div>
            </Card>

            {/* Suporte */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Precisa de Ajuda?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Nossa equipe está sempre pronta para ajudar você em sua jornada de aprendizado.
              </p>
              <Button variant="outline" className="w-full">
                Falar com Suporte
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}