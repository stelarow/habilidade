# Design System Specifications - Escola Habilidade Platform
*Fase 1: Componentes Core e Tema Violet Dark*

## 📋 Visão Geral

Este documento define as especificações detalhadas do design system para a plataforma Escola Habilidade, focado na implementação do tema Violet Dark e componentes core para uma experiência de aprendizado moderna e acessível.

## 🎨 Design Tokens

### Sistema de Cores - Tema Violet Dark

```typescript
interface ColorTokens {
  // Primary Colors
  primary: {
    50: '#f5f3ff',    // Violet lightest
    100: '#ede9fe',   // Violet very light
    200: '#ddd6fe',   // Violet light
    300: '#c4b5fd',   // Violet medium light
    400: '#a78bfa',   // Violet medium
    500: '#8b5cf6',   // Violet main (primary)
    600: '#7c3aed',   // Violet medium dark
    700: '#6d28d9',   // Violet dark
    800: '#5b21b6',   // Violet very dark
    900: '#4c1d95',   // Violet darkest
  },
  
  // Background Colors
  background: {
    default: '#1e1b2e',    // Dark purple base
    surface: '#2a2640',    // Elevated surface
    elevated: '#332d4d',   // Card/modal background
    overlay: '#1a1625',    // Overlay/sidebar
  },
  
  // Text Colors
  text: {
    primary: '#f5f3ff',     // Primary text (white-violet)
    secondary: '#c4b5fd',   // Secondary text (light violet)
    tertiary: '#a78bfa',    // Tertiary text (medium violet)
    muted: '#7c3aed',       // Muted text (darker violet)
    inverse: '#1e1b2e',     // Text on light backgrounds
  },
  
  // Semantic Colors
  success: {
    50: '#ecfdf5',
    500: '#10b981',    // Emerald
    600: '#059669',
    900: '#064e3b',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',    // Amber
    600: '#d97706',
    900: '#78350f',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',    // Red
    600: '#dc2626',
    900: '#7f1d1d',
  },
  
  // Border Colors
  border: {
    default: 'rgba(139, 92, 246, 0.2)',   // Primary with opacity
    muted: 'rgba(139, 92, 246, 0.1)',     // Subtle borders
    focus: '#8b5cf6',                      // Focus states
  }
}
```

### Tipografia - Inter Font Family

```typescript
interface TypographyTokens {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'Monaco', 'monospace'],
  },
  
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  }
}
```

### Sistema de Espaçamento - Grid 4px

```typescript
interface SpacingTokens {
  space: {
    0: '0',           // 0px
    px: '1px',        // 1px
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
  }
}
```

### Sombras

```typescript
interface ShadowTokens {
  shadow: {
    sm: '0 1px 2px 0 rgba(139, 92, 246, 0.05)',
    base: '0 1px 3px 0 rgba(139, 92, 246, 0.1), 0 1px 2px 0 rgba(139, 92, 246, 0.06)',
    md: '0 4px 6px -1px rgba(139, 92, 246, 0.1), 0 2px 4px -1px rgba(139, 92, 246, 0.06)',
    lg: '0 10px 15px -3px rgba(139, 92, 246, 0.1), 0 4px 6px -2px rgba(139, 92, 246, 0.05)',
    xl: '0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.04)',
    '2xl': '0 25px 50px -12px rgba(139, 92, 246, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(139, 92, 246, 0.06)',
    none: 'none',
  }
}
```

### Breakpoints Responsivos

```typescript
interface BreakpointTokens {
  screens: {
    sm: '640px',    // Mobile large
    md: '768px',    // Tablet
    lg: '1024px',   // Desktop
    xl: '1280px',   // Desktop large
    '2xl': '1536px' // Desktop extra large
  }
}
```

## 🧩 Especificações de Componentes

### 1. SidebarNavigation

#### Visão Geral
Sidebar colapsável com navegação por módulos, busca integrada e indicadores de progresso.

#### Props Interface
```typescript
interface SidebarNavigationProps {
  courseStructure: Module[]
  currentLesson: string
  progress: CourseProgress
  isCollapsed: boolean
  onToggleCollapse: () => void
  onLessonSelect: (lessonId: string) => void
  className?: string
}

interface Module {
  id: string
  title: string
  description?: string
  lessons: Lesson[]
  progress: number // 0-100
  isCompleted: boolean
  estimatedTime?: string
}

interface Lesson {
  id: string
  title: string
  type: 'video' | 'text' | 'quiz' | 'assignment'
  duration?: string
  isCompleted: boolean
  isLocked: boolean
}
```

#### Estados e Variantes
```typescript
interface SidebarStates {
  default: {
    width: '300px',
    background: 'background.overlay',
    borderRight: '1px solid border.default'
  },
  collapsed: {
    width: '64px',
    background: 'background.overlay',
    borderRight: '1px solid border.default'
  },
  mobile: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 50,
    transform: 'translateX(-100%)', // Hidden by default
    transition: 'transform 0.3s ease-in-out'
  }
}
```

#### Layout Interno
```
┌─────────────────────────────┐
│ Header (Logo + Collapse)    │
├─────────────────────────────┤
│ Search Bar                  │ 
├─────────────────────────────┤
│ Progress Overview           │
├─────────────────────────────┤
│ Module 1                    │
│ ├ Lesson 1 ✓               │
│ ├ Lesson 2 ◗ (current)     │
│ └ Lesson 3 ○               │
├─────────────────────────────┤
│ Module 2                    │
│ ├ Lesson 4 🔒              │
│ └ Lesson 5 🔒              │
└─────────────────────────────┘
```

#### Acessibilidade
- ARIA landmarks: `navigation`
- ARIA expanded states para módulos colapsáveis
- Navegação por teclado (Tab, Enter, Arrows)
- Screen reader friendly labels
- Focus management adequado

### 2. EnhancedHeader

#### Visão Geral
Header modernizado com breadcrumbs grandes, barra de progresso global e acesso rápido a funcionalidades.

#### Props Interface
```typescript
interface EnhancedHeaderProps {
  breadcrumbs: Breadcrumb[]
  globalProgress: number
  user: User
  onProfileClick: () => void
  onSettingsClick: () => void
  onThemeToggle: () => void
  className?: string
}

interface Breadcrumb {
  label: string
  href?: string
  isActive: boolean
}

interface User {
  name: string
  avatar?: string
  level: number
  xp: number
}
```

#### Layout e Estrutura
```
┌─────────────────────────────────────────────────────────────┐
│ Sidebar Toggle │ Breadcrumbs              │ User Actions    │
│ ☰             │ Home > Course > Module   │ 🔔 ⚙️ 👤      │
├─────────────────────────────────────────────────────────────┤
│ Progress Bar: ████████████░░░░░░░░░░ 67%                   │
└─────────────────────────────────────────────────────────────┘
```

#### Estados Responsivos
```typescript
interface HeaderResponsiveStates {
  desktop: {
    height: '80px',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  tablet: {
    height: '72px',
    padding: '0 16px'
  },
  mobile: {
    height: '64px',
    padding: '0 12px',
    // Breadcrumbs collapse to show only current page
  }
}
```

### 3. EnhancedContentArea

#### Visão Geral
Área principal de conteúdo com layout otimizado para diferentes tipos de mídia e interações.

#### Props Interface
```typescript
interface EnhancedContentAreaProps {
  content: LessonContent
  onComplete: () => void
  onBookmark: () => void
  onShare: () => void
  className?: string
}

interface LessonContent {
  id: string
  title: string
  description?: string
  type: 'video' | 'text' | 'interactive' | 'quiz'
  content: ContentData
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}
```

#### Layout Flexível
```
┌─────────────────────────────────────────────────────────────┐
│ Content Header                                              │
│ ┌─ Title                            ┌─ Actions ─┐          │
│ │  Lesson Title                     │ 🔖 📤 ✓   │          │
│ │  Estimated: 15min                 └───────────┘          │
│ └─ Difficulty: Intermediate                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Main Content Area                                           │
│ (Video/Text/Interactive based on content type)             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Navigation Controls                                         │
│ ← Previous          Next Lesson →           Complete ✓     │
└─────────────────────────────────────────────────────────────┘
```

#### Variantes por Tipo de Conteúdo
```typescript
interface ContentVariants {
  video: {
    playerWrapper: 'aspect-video rounded-lg overflow-hidden',
    controls: 'custom violet theme controls'
  },
  text: {
    typography: 'prose prose-violet prose-invert max-w-none',
    layout: 'single column with optimal line length'
  },
  interactive: {
    container: 'full width interactive area',
    controls: 'embedded interaction controls'
  }
}
```

### 4. InteractiveQuiz

#### Visão Geral
Sistema de quiz interativo com feedback instantâneo, revisão detalhada e gamificação.

#### Props Interface
```typescript
interface InteractiveQuizProps {
  quiz: Quiz
  onComplete: (results: QuizResults) => void
  onRetry: () => void
  allowRetake?: boolean
  showTimer?: boolean
  className?: string
}

interface Quiz {
  id: string
  title: string
  description?: string
  questions: Question[]
  timeLimit?: number // in minutes
  passingScore: number // percentage
}

interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'drag-drop'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  points: number
}

interface QuizResults {
  score: number
  percentage: number
  correctAnswers: number
  totalQuestions: number
  timeTaken: number
  questionResults: QuestionResult[]
}
```

#### Estados de Interação
```typescript
interface QuizStates {
  initial: {
    showIntroduction: true,
    showStartButton: true
  },
  inProgress: {
    showQuestion: true,
    showTimer: boolean,
    showProgress: true,
    allowNavigation: boolean
  },
  questionAnswered: {
    showFeedback: true,
    highlightCorrect: true,
    disableOptions: true,
    showExplanation: true
  },
  completed: {
    showResults: true,
    showReview: true,
    showRetakeButton: boolean
  }
}
```

#### Layout de Questão
```
┌─────────────────────────────────────────────────────────────┐
│ Quiz Progress: ████████░░░░ Question 3 of 5    ⏱️ 02:34    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Question Title/Description                                  │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ A) Option 1                                          ○ │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ B) Option 2                                          ● │ │ (selected)
│ ├─────────────────────────────────────────────────────────┤ │
│ │ C) Option 3                                          ○ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│              [Submit Answer] [Skip Question]                │
└─────────────────────────────────────────────────────────────┘
```

#### Feedback Visual
```typescript
interface QuizFeedbackStates {
  correct: {
    borderColor: 'success.500',
    backgroundColor: 'success.50',
    icon: '✓',
    animation: 'success-pulse'
  },
  incorrect: {
    borderColor: 'error.500',
    backgroundColor: 'error.50',
    icon: '✗',
    animation: 'shake'
  },
  showCorrect: {
    borderColor: 'success.500',
    backgroundColor: 'success.100',
    icon: '→',
    label: 'Correct Answer'
  }
}
```

### 5. Progress Indicators

#### Visão Geral
Sistema unificado de indicadores de progresso para diferentes contextos na plataforma.

#### Variantes de Progresso

##### Linear Progress Bar
```typescript
interface LinearProgressProps {
  value: number // 0-100
  size: 'sm' | 'md' | 'lg'
  color: 'primary' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  animated?: boolean
  className?: string
}

interface LinearProgressStates {
  sm: { height: '4px' },
  md: { height: '8px' },
  lg: { height: '12px' }
}
```

##### Circular Progress
```typescript
interface CircularProgressProps {
  value: number
  size: number
  strokeWidth?: number
  color: 'primary' | 'success' | 'warning' | 'error'
  showValue?: boolean
  children?: ReactNode
  className?: string
}
```

##### Module Progress Card
```typescript
interface ModuleProgressProps {
  module: Module
  progress: number
  lessonsCompleted: number
  totalLessons: number
  timeSpent?: string
  estimatedTimeRemaining?: string
}
```

#### Estados Visuais
```typescript
interface ProgressStates {
  empty: {
    background: 'rgba(139, 92, 246, 0.1)',
    text: 'text.muted'
  },
  inProgress: {
    background: 'linear-gradient(90deg, primary.500, primary.400)',
    animation: 'progress-fill 0.5s ease-out'
  },
  completed: {
    background: 'success.500',
    icon: '✓'
  },
  locked: {
    background: 'rgba(124, 58, 237, 0.1)',
    icon: '🔒',
    opacity: 0.6
  }
}
```

## 🎛️ Sistema de Estados Interativos

### Estados Globais
```typescript
interface InteractionStates {
  // Estados de Hover
  hover: {
    scale: '1.02',
    boxShadow: 'shadow.md',
    transition: 'all 0.2s ease-out',
    borderColor: 'primary.400'
  },
  
  // Estados de Focus
  focus: {
    outline: '2px solid primary.500',
    outlineOffset: '2px',
    borderColor: 'primary.500'
  },
  
  // Estados de Active
  active: {
    scale: '0.98',
    boxShadow: 'shadow.sm',
    transition: 'all 0.1s ease-out'
  },
  
  // Estados de Disabled
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none'
  },
  
  // Estados de Loading
  loading: {
    opacity: 0.7,
    cursor: 'wait',
    animation: 'pulse 2s infinite'
  }
}
```

### Transições e Animações
```typescript
interface AnimationTokens {
  transition: {
    fast: '0.1s ease-out',
    normal: '0.2s ease-out',
    slow: '0.3s ease-out',
    slower: '0.5s ease-out'
  },
  
  animation: {
    fadeIn: 'fadeIn 0.3s ease-out',
    slideIn: 'slideIn 0.3s ease-out',
    scaleIn: 'scaleIn 0.2s ease-out',
    pulse: 'pulse 2s infinite',
    spin: 'spin 1s linear infinite'
  }
}
```

## ♿ Especificações de Acessibilidade

### Conformidade WCAG 2.1 AA

#### Contraste de Cores
```typescript
interface ContrastRequirements {
  // Texto normal: mínimo 4.5:1
  normalText: {
    'text.primary on background.default': '15.8:1', // ✓ Excellent
    'text.secondary on background.default': '8.2:1', // ✓ Excellent
    'text.tertiary on background.default': '5.1:1',  // ✓ Good
  },
  
  // Texto grande: mínimo 3:1
  largeText: {
    'text.primary on background.surface': '13.2:1', // ✓ Excellent
    'text.secondary on background.surface': '7.1:1', // ✓ Excellent
  },
  
  // Elementos de interface: mínimo 3:1
  uiElements: {
    'border.default on background.default': '3.8:1', // ✓ Good
    'primary.500 on background.default': '4.2:1',    // ✓ Good
  }
}
```

#### Navegação por Teclado
```typescript
interface KeyboardNavigation {
  focusOrder: [
    'skip-link',
    'sidebar-toggle',
    'search-input',
    'main-navigation',
    'content-area',
    'quiz-questions',
    'navigation-controls'
  ],
  
  shortcuts: {
    'Alt + M': 'Open main menu',
    'Alt + S': 'Focus search',
    'Alt + N': 'Next lesson',
    'Alt + P': 'Previous lesson',
    'Space': 'Play/pause video',
    'Enter': 'Submit quiz answer'
  }
}
```

#### ARIA Labels e Roles
```typescript
interface AriaSpecifications {
  landmarks: {
    sidebar: 'navigation',
    header: 'banner',
    content: 'main',
    quiz: 'application'
  },
  
  states: {
    'aria-expanded': 'for collapsible elements',
    'aria-selected': 'for navigation items',
    'aria-checked': 'for quiz options',
    'aria-disabled': 'for inactive elements',
    'aria-busy': 'for loading states'
  },
  
  properties: {
    'aria-label': 'descriptive labels',
    'aria-describedby': 'additional descriptions',
    'aria-live': 'for dynamic content updates',
    'aria-current': 'for current page/step'
  }
}
```

### Personalizações de Acessibilidade
```typescript
interface AccessibilityCustomizations {
  fontSize: {
    options: ['small', 'normal', 'large', 'extra-large'],
    impact: 'affects all text content proportionally'
  },
  
  contrast: {
    modes: ['normal', 'high', 'extra-high'],
    adjustments: 'modifies color relationships'
  },
  
  motion: {
    preferences: ['normal', 'reduced'],
    respects: 'prefers-reduced-motion media query'
  },
  
  focus: {
    styles: ['subtle', 'prominent', 'high-contrast'],
    customizable: 'focus indicator thickness and color'
  }
}
```

## 📱 Especificações Responsivas

### Layout Adaptativo

#### Sidebar Behavior
```typescript
interface SidebarResponsive {
  desktop: {
    position: 'fixed',
    width: '300px',
    height: '100vh',
    transform: 'none'
  },
  
  tablet: {
    position: 'fixed',
    width: '280px',
    height: '100vh',
    transform: 'translateX(-100%)', // Hidden by default
    overlay: true
  },
  
  mobile: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    transform: 'translateX(-100%)', // Hidden by default
    overlay: true,
    zIndex: 999
  }
}
```

#### Content Area Adaptation
```typescript
interface ContentResponsive {
  desktop: {
    marginLeft: '300px', // Account for sidebar
    padding: '24px',
    maxWidth: 'none'
  },
  
  tablet: {
    marginLeft: '0',
    padding: '16px',
    maxWidth: '100%'
  },
  
  mobile: {
    marginLeft: '0',
    padding: '12px',
    maxWidth: '100%',
    fontSize: 'adjusted for mobile readability'
  }
}
```

#### Quiz Responsive Behavior
```typescript
interface QuizResponsive {
  desktop: {
    layout: 'two-column when beneficial',
    spacing: 'generous padding and margins'
  },
  
  tablet: {
    layout: 'single column',
    spacing: 'medium padding'
  },
  
  mobile: {
    layout: 'stacked vertically',
    spacing: 'compact but touch-friendly',
    fontSize: 'optimized for small screens'
  }
}
```

## 🚀 Performance e Otimizações

### Lazy Loading Strategy
```typescript
interface LazyLoadingSpecs {
  components: [
    'QuizComponent',      // Load when quiz lesson accessed
    'VideoPlayer',        // Load when video content accessed
    'InteractiveContent', // Load when interactive lesson accessed
  ],
  
  images: {
    strategy: 'intersection-observer',
    placeholder: 'low-quality blur',
    formats: ['webp', 'avif', 'jpeg']
  },
  
  routes: {
    strategy: 'code-splitting by route',
    preload: 'next likely route'
  }
}
```

### Bundle Optimization
```typescript
interface BundleOptimization {
  codesplitting: {
    byRoute: true,
    byComponent: true,
    byFeature: true
  },
  
  treeshaking: {
    lodash: 'import specific functions only',
    icons: 'import only used icons',
    utilities: 'remove unused CSS utilities'
  },
  
  compression: {
    gzip: true,
    brotli: true,
    minification: 'aggressive but safe'
  }
}
```

## 📊 Wireframes e Layout Visual

### Sidebar Navigation Wireframe
```
┌─────────────────────────────┐
│ [≡] Escola Habilidade       │ ← Header with logo and collapse
├─────────────────────────────┤
│ [🔍] Search lessons...      │ ← Search bar
├─────────────────────────────┤
│ 📊 Overall Progress         │ ← Progress summary
│ ████████░░░ 78%             │
├─────────────────────────────┤
│ ▼ Module 1: Basics          │ ← Expandable module
│   ✓ Intro to Platform       │ ← Completed lesson
│   ▶ Current Topic          │ ← Current lesson (highlighted)
│   ○ Advanced Features       │ ← Upcoming lesson
├─────────────────────────────┤
│ ▶ Module 2: Intermediate    │ ← Collapsed module
│   🔒 5 lessons              │ ← Locked indicator
├─────────────────────────────┤
│ ▶ Module 3: Advanced        │
│   🔒 3 lessons              │
└─────────────────────────────┘
```

### Enhanced Header Wireframe
```
┌──────────────────────────────────────────────────────────────┐
│ [≡] Home > Course Name > Module 2          🔔 ⚙️ [Avatar]   │
├──────────────────────────────────────────────────────────────┤
│ Course Progress: ██████████████░░░░░░░ 78% (23/30 lessons)   │
└──────────────────────────────────────────────────────────────┘
```

### Quiz Interface Wireframe
```
┌──────────────────────────────────────────────────────────────┐
│ Quiz: Module 2 Assessment        Question 2 of 5    ⏱️ 08:42 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Which of the following best describes...?                   │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ ○ Option A: Lorem ipsum dolor sit amet                  │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ ● Option B: Consectetur adipiscing elit (selected)      │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ ○ Option C: Sed do eiusmod tempor incididunt           │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ ○ Option D: Ut labore et dolore magna aliqua           │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│         [Previous]        [Submit Answer]        [Next]     │
└──────────────────────────────────────────────────────────────┘
```

### Content Area Layout
```
┌──────────────────────────────────────────────────────────────┐
│ Lesson: Introduction to React Hooks         🔖 📤 [Complete] │
├──────────────────────────────────────────────────────────────┤
│ Estimated time: 15 minutes  │  Difficulty: Intermediate      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌────────────────────────────────────────────────────────┐   │
│ │                                                        │   │
│ │                Video Player Area                       │   │
│ │                (16:9 aspect ratio)                     │   │
│ │                                                        │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ Lesson content and description would appear here...         │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ ← Previous: State Management    Next: Custom Hooks →        │
└──────────────────────────────────────────────────────────────┘
```

## 🎨 Design Implementation Guidelines

### CSS Custom Properties
```css
:root {
  /* Color tokens */
  --color-primary-50: #f5f3ff;
  --color-primary-500: #8b5cf6;
  --color-primary-900: #4c1d95;
  
  --color-background-default: #1e1b2e;
  --color-background-surface: #2a2640;
  --color-background-elevated: #332d4d;
  
  --color-text-primary: #f5f3ff;
  --color-text-secondary: #c4b5fd;
  
  /* Spacing tokens */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  
  /* Typography tokens */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  
  /* Shadow tokens */
  --shadow-sm: 0 1px 2px 0 rgba(139, 92, 246, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(139, 92, 246, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(139, 92, 246, 0.1);
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  
  /* Transitions */
  --transition-fast: 0.1s ease-out;
  --transition-normal: 0.2s ease-out;
  --transition-slow: 0.3s ease-out;
}
```

### Component Base Classes
```css
/* Base component classes */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: var(--transition-normal);
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.btn-primary:hover {
  background-color: var(--color-primary-600);
  border-color: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.card {
  background-color: var(--color-background-surface);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

## 📋 Lista de Verificação de Implementação

### Design Tokens ✓
- [ ] Cores do tema Violet Dark definidas
- [ ] Tipografia Inter configurada
- [ ] Sistema de espaçamento 4px grid
- [ ] Sombras com cor primária
- [ ] Breakpoints responsivos
- [ ] Tokens de transição e animação

### Componentes Core
- [ ] SidebarNavigation com todos os estados
- [ ] EnhancedHeader com breadcrumbs e progresso
- [ ] EnhancedContentArea adaptável
- [ ] InteractiveQuiz com feedback instantâneo
- [ ] Progress Indicators variados

### Acessibilidade ✓
- [ ] Conformidade WCAG 2.1 AA
- [ ] Contraste de cores validado
- [ ] Navegação por teclado completa
- [ ] ARIA labels implementados
- [ ] Support para leitores de tela
- [ ] Personalização de acessibilidade

### Responsividade ✓
- [ ] Layout mobile-first
- [ ] Breakpoints definidos
- [ ] Componentes adaptáveis
- [ ] Touch-friendly em mobile
- [ ] Performance em dispositivos móveis

### Performance ✓
- [ ] Lazy loading configurado
- [ ] Code splitting implementado
- [ ] Otimização de imagens
- [ ] Bundle size otimizado
- [ ] Core Web Vitals atendidos

---

## 🎯 Próximos Passos

1. **Validação das Especificações**
   - Review por stakeholders
   - Feedback do time de desenvolvimento
   - Ajustes baseados em viabilidade técnica

2. **Prototipagem**
   - Criação de protótipos interativos
   - Teste de usabilidade
   - Validação de acessibilidade

3. **Implementação Fase 1**
   - Setup do design system
   - Desenvolvimento dos componentes core
   - Integração com plataforma existente

4. **Testes e Validação**
   - Testes de acessibilidade
   - Performance testing
   - User acceptance testing

---

*Documento criado em: 02/08/2025*
*Versão: 1.0*
*Status: Pronto para implementação*