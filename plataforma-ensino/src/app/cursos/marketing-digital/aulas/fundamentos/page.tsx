'use client'

import React, { useEffect, useState } from 'react'
import LessonPageRedesigned from '@/components/lesson/LessonPageRedesigned'
import { createClient } from '@/lib/supabase/client'

// Dados da aula de Marketing Digital (fallback)
const fallbackLessonData = {
  id: 'd1a9caa2-f86d-4c2d-bf4d-6d2402237c95',
  title: 'Fundamentos do Marketing Digital',
  slug: 'introducao-marketing-digital',
  description: 'Introdução aos conceitos essenciais do marketing digital moderno, estratégias de posicionamento e ferramentas fundamentais para o sucesso online.',
  course: {
    id: '2e6aa078-ec48-4ba1-86f9-b6fb1d8d758d',
    title: 'Marketing Digital',
    slug: 'marketing-digital'
  }
}

// Dados de progresso inicial
const initialProgressData = {
  lessonId: 'd1a9caa2-f86d-4c2d-bf4d-6d2402237c95',
  videoProgress: {
    percentageWatched: 0,
    currentTime: 0,
    duration: 0,
    lastWatchedAt: null
  },
  pdfProgress: {
    percentageRead: 0,
    currentPage: 1,
    totalPages: 25,
    lastReadAt: null
  },
  quizProgress: {
    score: 0,
    isCompleted: false,
    isPassed: false,
    completedAt: null
  },
  exerciseProgress: {
    percentageComplete: 0,
    uploadedFiles: [],
    completedAt: null
  },
  contentProgress: {
    percentageRead: 0,
    lastReadAt: null
  },
  overallProgress: 0,
  completedAt: null,
  isCompleted: false
}

// URL do vídeo (exemplo)
const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

// Materiais da aula
const materials = [
  {
    id: 'pdf-1',
    type: 'pdf',
    title: 'Guia Completo de Marketing Digital',
    description: 'Material didático com conceitos fundamentais, estratégias e exercícios práticos.',
    url: '/materials/marketing-digital-fundamentos.pdf',
    downloadable: true
  },
  {
    id: 'checklist-1',
    type: 'document',
    title: 'Checklist de Estratégias Digitais',
    description: 'Lista de verificação para implementar uma estratégia de marketing digital eficaz.',
    url: '/materials/checklist-marketing-digital.pdf',
    downloadable: true
  }
]

// Exercícios práticos
const exercises = [
  {
    id: 'ex-1',
    title: 'Análise de Persona de Cliente',
    description: 'Crie uma persona detalhada para um negócio fictício, incluindo dados demográficos, comportamentais e psicográficos.',
    instructions: [
      'Escolha um segmento de mercado',
      'Defina idade, renda, localização',
      'Identifique dores e necessidades',
      'Descreva comportamento online',
      'Crie uma representação visual'
    ],
    type: 'upload',
    acceptedFormats: ['jpg', 'png', 'pdf', 'doc', 'docx'],
    maxFiles: 3
  },
  {
    id: 'ex-2',
    title: 'Mapeamento de Jornada do Cliente',
    description: 'Desenvolva um mapa da jornada do cliente desde a descoberta até a conversão.',
    instructions: [
      'Identifique os touchpoints principais',
      'Mapeie as emoções em cada etapa',
      'Defina as ações do cliente',
      'Identifique oportunidades de melhoria',
      'Apresente em formato visual'
    ],
    type: 'upload',
    acceptedFormats: ['jpg', 'png', 'pdf'],
    maxFiles: 2
  },
  {
    id: 'ex-3',
    title: 'Estratégia de Conteúdo para Redes Sociais',
    description: 'Crie um plano de conteúdo para uma marca nas principais redes sociais.',
    instructions: [
      'Selecione 3 redes sociais relevantes',
      'Defina tipos de conteúdo para cada uma',
      'Crie um calendário semanal',
      'Estabeleça métricas de sucesso',
      'Proponha 5 posts específicos'
    ],
    type: 'upload',
    acceptedFormats: ['pdf', 'doc', 'docx', 'xlsx'],
    maxFiles: 5
  }
]

// Quiz de avaliação
const quizzes = [
  {
    id: 'quiz-1',
    title: 'Avaliação: Fundamentos do Marketing Digital',
    description: 'Teste seus conhecimentos sobre os conceitos fundamentais abordados na aula.',
    passing_score: 70,
    questions: [
      {
        id: 1,
        question: 'Qual é o primeiro passo essencial para criar uma estratégia de marketing digital eficaz?',
        type: 'multiple_choice',
        options: [
          'Criar conteúdo viral',
          'Definir personas e público-alvo',
          'Investir em anúncios pagos',
          'Contratar influenciadores'
        ],
        correct_answer: 1,
        explanation: 'Definir personas e público-alvo é fundamental pois orienta todas as outras decisões estratégicas, desde a escolha dos canais até o tom da comunicação.'
      },
      {
        id: 2,
        question: 'O que significa ROI no contexto do marketing digital?',
        type: 'multiple_choice',
        options: [
          'Return on Investment (Retorno sobre Investimento)',
          'Rate of Interest (Taxa de Juros)',
          'Reach of Influence (Alcance de Influência)',
          'Revenue of Internet (Receita da Internet)'
        ],
        correct_answer: 0,
        explanation: 'ROI significa Return on Investment e é uma métrica crucial para medir a eficácia financeira das campanhas de marketing digital.'
      },
      {
        id: 3,
        question: 'Qual das seguintes NÃO é considerada uma das principais etapas do funil de marketing digital?',
        type: 'multiple_choice',
        options: [
          'Atração (Awareness)',
          'Consideração (Consideration)',
          'Competição (Competition)',
          'Conversão (Conversion)'
        ],
        correct_answer: 2,
        explanation: 'As principais etapas do funil são: Atração, Consideração, Conversão e Retenção. Competição não é uma etapa do funil de marketing.'
      },
      {
        id: 4,
        question: 'Qual é a principal vantagem do marketing digital em relação ao marketing tradicional?',
        type: 'multiple_choice',
        options: [
          'É sempre mais barato',
          'Permite maior segmentação e mensuração',
          'Não requer planejamento',
          'Garante resultados imediatos'
        ],
        correct_answer: 1,
        explanation: 'A principal vantagem do marketing digital é a capacidade de segmentar audiências específicas e medir resultados em tempo real com precisão.'
      },
      {
        id: 5,
        question: 'O que é importante considerar ao escolher as redes sociais para uma marca?',
        type: 'multiple_choice',
        options: [
          'Apenas o número total de usuários',
          'Onde estão os concorrentes',
          'Onde está o público-alvo e os objetivos da marca',
          'As redes mais populares no momento'
        ],
        correct_answer: 2,
        explanation: 'A escolha das redes sociais deve ser baseada em onde está o público-alvo da marca e quais plataformas melhor atendem aos objetivos de marketing estabelecidos.'
      }
    ]
  }
]

// Conteúdo HTML da aula
const lessonContent = `
<div class="lesson-content">
  <h2>Bem-vindos aos Fundamentos do Marketing Digital</h2>
  
  <p class="lead">
    O marketing digital transformou completamente a forma como as empresas se conectam com seus clientes. 
    Nesta aula, você aprenderá os conceitos essenciais que formam a base de qualquer estratégia digital bem-sucedida.
  </p>

  <h3>O que você aprenderá nesta aula:</h3>
  <ul>
    <li><strong>Conceitos fundamentais</strong> do marketing digital moderno</li>
    <li><strong>Personas e segmentação</strong> de público-alvo</li>
    <li><strong>Funil de marketing</strong> e jornada do cliente</li>
    <li><strong>Principais canais digitais</strong> e suas características</li>
    <li><strong>Métricas e KPIs</strong> essenciais para medir sucesso</li>
    <li><strong>Estratégias de conteúdo</strong> para diferentes plataformas</li>
  </ul>

  <h3>Por que o Marketing Digital é essencial hoje?</h3>
  <p>
    Vivemos na era digital, onde mais de 4.8 bilhões de pessoas estão conectadas à internet. 
    As empresas que não investem em marketing digital ficam para trás, perdendo oportunidades 
    valiosas de crescimento e conexão com seus clientes.
  </p>

  <div class="highlight-box">
    <h4>💡 Dica importante:</h4>
    <p>
      Marketing digital não é apenas sobre tecnologia - é sobre pessoas. O segredo está em 
      entender profundamente seu público e entregar valor real através dos canais digitais.
    </p>
  </div>

  <h3>Principais diferenças do Marketing Digital:</h3>
  <div class="comparison-table">
    <div class="traditional">
      <h4>Marketing Tradicional</h4>
      <ul>
        <li>Comunicação unidirecional</li>
        <li>Difícil mensuração de resultados</li>
        <li>Segmentação limitada</li>
        <li>Altos custos de produção</li>
        <li>Alcance geográfico restrito</li>
      </ul>
    </div>
    <div class="digital">
      <h4>Marketing Digital</h4>
      <ul>
        <li>Comunicação bidirecional</li>
        <li>Mensuração em tempo real</li>
        <li>Hipersegmentação possível</li>
        <li>Custos mais acessíveis</li>
        <li>Alcance global instantâneo</li>
      </ul>
    </div>
  </div>

  <h3>Preparação para os próximos passos:</h3>
  <p>
    Após assistir ao vídeo e estudar o material, você estará preparado para aplicar 
    esses conceitos através dos exercícios práticos. Lembre-se: a prática é fundamental 
    para consolidar o aprendizado!
  </p>
</div>

<style>
.lesson-content {
  line-height: 1.6;
  color: #333;
}

.lead {
  font-size: 1.2em;
  color: #555;
  margin-bottom: 2em;
  padding: 1em;
  background: #f8f9fa;
  border-left: 4px solid #007bff;
  border-radius: 4px;
}

.highlight-box {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1.5em;
  margin: 2em 0;
}

.highlight-box h4 {
  color: #856404;
  margin-top: 0;
}

.comparison-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2em;
  margin: 2em 0;
}

.traditional, .digital {
  padding: 1.5em;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.traditional {
  background: #fff5f5;
  border-color: #fecaca;
}

.digital {
  background: #f0fff4;
  border-color: #bbf7d0;
}

.traditional h4 {
  color: #dc2626;
}

.digital h4 {
  color: #16a34a;
}

@media (max-width: 768px) {
  .comparison-table {
    grid-template-columns: 1fr;
  }
}
</style>
`

// Dados do Canva (usando o Canva atual da aula de Marketing Digital)
const canvaEmbedUrl = "https://www.canva.com/design/DAGuqW8uqiw/_HxYFw6YjdkL93523L-55w/view?embed"
const canvaTitle = "Fundamentos do Marketing Digital - Apresentação Interativa"
const canvaDescription = "Apresentação visual completa com os conceitos fundamentais do marketing digital, estratégias e exemplos práticos para seu aprendizado."
const canvaAuthor = "Escola Habilidade"
const canvaAuthorUrl = "https://www.canva.com/design/DAGuqW8uqiw/_HxYFw6YjdkL93523L-55w/view?utm_content=DAGuqW8uqiw&utm_campaign=designshare&utm_medium=embeds&utm_source=link"

export default function MarketingDigitalFundamentosPage() {
  const [lessonData, setLessonData] = useState(fallbackLessonData)
  const [exercises, setExercises] = useState<any[]>([])
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [lessonContent, setLessonContent] = useState('')
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchLessonData() {
      try {
        // Buscar dados da aula
        const { data: lesson, error: lessonError } = await supabase
          .from('lessons')
          .select(`
            *,
            course:courses(id, title, slug)
          `)
          .eq('id', 'd1a9caa2-f86d-4c2d-bf4d-6d2402237c95')
          .single()

        if (lessonError) throw lessonError

        if (lesson) {
          setLessonData({
            id: lesson.id,
            title: lesson.title,
            slug: lesson.slug,
            description: lesson.description,
            course: lesson.course
          })
          setLessonContent(lesson.content || '')
          setMaterials(lesson.materials || [])
        }

        // Buscar exercícios
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .eq('lesson_id', 'd1a9caa2-f86d-4c2d-bf4d-6d2402237c95')
          .order('order_index')

        if (exercisesError) throw exercisesError
        if (exercisesData) setExercises(exercisesData)

        // Buscar quiz
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select(`
            *,
            quiz_questions(*)
          `)
          .eq('lesson_id', 'd1a9caa2-f86d-4c2d-bf4d-6d2402237c95')

        if (quizError) throw quizError
        if (quizData && quizData.length > 0) {
          const quiz = quizData[0]
          const formattedQuiz = {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            passing_score: quiz.passing_score,
            questions: quiz.quiz_questions.map((q: any, index: number) => ({
              id: index + 1,
              question: q.question,
              options: q.options,
              correct_answer: q.correct_answer,
              explanation: q.explanation
            }))
          }
          setQuizzes([formattedQuiz])
        }

      } catch (error) {
        console.error('Erro ao carregar dados da aula:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLessonData()
  }, [])

  const handleExit = () => {
    window.location.href = '/cursos/marketing-digital'
  }

  const handleLessonComplete = () => {
    console.log('Aula de Marketing Digital concluída!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando aula...</p>
        </div>
      </div>
    )
  }

  return (
    <LessonPageRedesigned
      lesson={lessonData}
      progressData={initialProgressData}
      onExit={handleExit}
      onLessonComplete={handleLessonComplete}
      videoUrl={videoUrl}
      materials={materials}
      exercises={exercises}
      quizzes={quizzes}
      content={lessonContent}
      canvaEmbedUrl={canvaEmbedUrl}
      canvaTitle={canvaTitle}
      canvaDescription={canvaDescription}
      canvaAuthor={canvaAuthor}
      canvaAuthorUrl={canvaAuthorUrl}
    />
  )
}