# Design Document

## Overview

Esta especificação de design define a refatoração completa da página de aulas da plataforma de ensino, removendo a sidebar atual e criando um header moderno com elementos de progresso integrados, baseado no design da página inicial da Escola Habilidade.

## Architecture

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Lesson Header                        │
│  [Logo] [Exit Button] [Progress Indicators] [Complete] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                  Main Content Area                      │
│                   (Full Width)                         │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                Video Player                         │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                Lesson Content                       │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                PDF Viewer                           │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Exercises & Quizzes                    │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Header Design

O header será baseado no design da página inicial, mas adaptado para o contexto de aulas:

- **Posicionamento**: Não fixo, acompanha o scroll da página
- **Background**: `bg-zinc-900/70 backdrop-blur-md` com `border-b border-gray-800/50`
- **Height**: `h-16` (64px) para consistência com o header principal
- **Layout**: Flexbox com `justify-between` para distribuir elementos

## Components and Interfaces

### 1. LessonHeader Component

```typescript
interface LessonHeaderProps {
  course: {
    title: string
    slug: string
  }
  lesson: {
    title: string
    slug: string
  }
  progress: {
    overall: number
    time: {
      current: number
      required: number
      formatted: string
    }
    pdf: {
      percentage: number
      isCompleted: boolean
    }
    exercises: {
      completed: number
      total: number
      isCompleted: boolean
    }
    quiz: {
      score: number
      isCompleted: boolean
      isPassed: boolean
    }
  }
  canComplete: boolean
  onExit: () => void
  onComplete: () => void
}
```

### 2. ProgressIndicator Component

```typescript
interface ProgressIndicatorProps {
  icon: React.ComponentType
  label: string
  progress: number
  isCompleted: boolean
  color: string
  onClick?: () => void
}
```

### 3. VideoPlayer Component

```typescript
interface VideoPlayerProps {
  videoUrl: string
  duration?: number
  onTimeUpdate: (currentTime: number) => void
  onEnded: () => void
}
```

### 4. QuizInterface Component

```typescript
interface QuizInterfaceProps {
  quiz: {
    id: string
    title: string
    questions: Question[]
    passingScore: number
    attemptsAllowed: number
  }
  onStart: () => void
  onComplete: (score: number) => void
  onClose: () => void
}
```

## Data Models

### Progress Tracking Model

```typescript
interface LessonProgress {
  lessonId: string
  userId: string
  timeSpent: number // em segundos
  videoProgress: number // porcentagem
  pdfProgress: number // porcentagem
  exercisesCompleted: number
  quizScore: number
  isCompleted: boolean
  completedAt?: Date
  criteria: {
    timeRequirement: boolean // >= 25 minutos
    pdfRequirement: boolean // 100% lido
    exerciseRequirement: boolean // todos exercícios
    quizRequirement: boolean // >= 70%
  }
}
```

### Icon Mapping

```typescript
const LESSON_ICONS = {
  time: Clock,
  pdf: FileText,
  exercises: BookOpen,
  quiz: Question,
  video: Play,
  download: Download,
  upload: PaperPlaneRight,
  trophy: Trophy,
  exit: ArrowLeft
}
```

## Error Handling

### Video Player Errors

1. **URL inválida**: Exibir mensagem de erro com opção de recarregar
2. **Falha no carregamento**: Fallback para player básico HTML5
3. **Problemas de rede**: Indicador de buffering e retry automático

### PDF Viewer Errors

1. **Arquivo não encontrado**: Exibir fallback com opção de download
2. **Erro de renderização**: Usar componente PDFViewerFallback
3. **Worker não carregado**: Configuração automática do PDF.js worker

### Quiz Errors

1. **Falha ao carregar perguntas**: Mensagem de erro com botão retry
2. **Erro ao submeter respostas**: Salvar localmente e tentar reenviar
3. **Timeout de sessão**: Alertar usuário e salvar progresso

## Testing Strategy

### Unit Tests

1. **LessonHeader Component**
   - Renderização correta dos elementos
   - Cálculo de progresso
   - Interações de botões

2. **ProgressIndicator Component**
   - Estados visuais (completo/incompleto)
   - Animações de transição
   - Cores corretas por tipo

3. **VideoPlayer Component**
   - Controles de reprodução
   - Tracking de progresso
   - Eventos de tempo

### Integration Tests

1. **Progress Tracking**
   - Sincronização entre componentes
   - Persistência no banco de dados
   - Critérios de conclusão

2. **Quiz Functionality**
   - Fluxo completo de questionário
   - Cálculo de pontuação
   - Atualização de progresso

### E2E Tests

1. **Complete Lesson Flow**
   - Assistir vídeo completo
   - Ler PDF inteiro
   - Completar exercícios
   - Passar no quiz
   - Concluir aula

## Visual Design Specifications

### Color Palette

- **Primary**: `#d400ff` (Magenta da marca)
- **Secondary**: `#00c4ff` (Cyan da marca)
- **Accent**: `#a000ff` (Purple da marca)
- **Success**: `#22c55e` (Green para completado)
- **Warning**: `#f59e0b` (Amber para em progresso)
- **Error**: `#ef4444` (Red para falhas)

### Typography

- **Font Family**: Montserrat (consistente com a marca)
- **Header Title**: `text-2xl font-bold`
- **Progress Labels**: `text-sm font-medium`
- **Indicators**: `text-xs`

### Spacing and Layout

- **Header Padding**: `px-4` (16px horizontal)
- **Progress Indicators Gap**: `gap-4` (16px)
- **Content Margins**: `mx-auto max-w-7xl`
- **Section Spacing**: `space-y-6` (24px vertical)

### Animations

- **Progress Updates**: `transition-all duration-300 ease-in-out`
- **Hover Effects**: `hover:scale-105 transition-transform duration-200`
- **Completion States**: `animate-pulse` para indicar mudanças

### Responsive Design

#### Desktop (>= 1024px)
- Header com todos os elementos visíveis
- Progress indicators em linha horizontal
- Botão de conclusão no canto direito

#### Tablet (768px - 1023px)
- Progress indicators com labels reduzidos
- Botão de conclusão centralizado
- Ícones menores (20px)

#### Mobile (< 768px)
- Progress indicators apenas com ícones
- Header em duas linhas se necessário
- Botão de conclusão full-width

### Accessibility

- **ARIA Labels**: Todos os botões e indicadores
- **Keyboard Navigation**: Tab order lógico
- **Screen Reader**: Anúncios de progresso
- **Color Contrast**: WCAG AA compliance
- **Focus Indicators**: Visíveis e consistentes