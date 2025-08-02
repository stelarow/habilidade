'use client'

import React, { useState } from 'react'
import { SidebarNavigation } from '@/components/ui/sidebar-navigation'
import { EnhancedHeader } from '@/components/ui/enhanced-header'
import { EnhancedContentArea } from '@/components/ui/enhanced-content-area'
import { InteractiveQuiz } from '@/components/ui/interactive-quiz'
import { 
  LinearProgress, 
  CircularProgress, 
  StepProgress, 
  ModuleProgress,
  AchievementProgress,
  GamificationProgress
} from '@/components/ui/enhanced-progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Zap,
  Star,
  Clock,
  Award
} from 'lucide-react'

// Mock data for components
const mockCourseStructure = [
  {
    id: 'module-1',
    title: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming language',
    progress: 85,
    isCompleted: false,
    estimatedTime: '2 hours remaining',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Introduction to JavaScript',
        type: 'video' as const,
        duration: '15 min',
        isCompleted: true,
        isLocked: false
      },
      {
        id: 'lesson-2',
        title: 'Variables and Data Types',
        type: 'text' as const,
        duration: '20 min',
        isCompleted: true,
        isLocked: false
      },
      {
        id: 'lesson-3',
        title: 'Functions and Scope',
        type: 'video' as const,
        duration: '25 min',
        isCompleted: false,
        isLocked: false
      },
      {
        id: 'lesson-4',
        title: 'Practice Quiz',
        type: 'quiz' as const,
        duration: '10 min',
        isCompleted: false,
        isLocked: true
      }
    ]
  },
  {
    id: 'module-2',
    title: 'React Development',
    description: 'Build modern web applications with React',
    progress: 30,
    isCompleted: false,
    estimatedTime: '6 hours remaining',
    lessons: [
      {
        id: 'lesson-5',
        title: 'React Components',
        type: 'video' as const,
        duration: '30 min',
        isCompleted: false,
        isLocked: false
      },
      {
        id: 'lesson-6',
        title: 'State Management',
        type: 'text' as const,
        duration: '45 min',
        isCompleted: false,
        isLocked: true
      }
    ]
  }
]

const mockProgress = {
  totalLessons: 6,
  completedLessons: 2,
  currentStreak: 7,
  totalTimeSpent: '4h 30m'
}

const mockBreadcrumbs = [
  { label: 'Home', href: '/', isActive: false },
  { label: 'JavaScript Course', href: '/course/javascript', isActive: false },
  { label: 'Module 1', href: '/course/javascript/module-1', isActive: false },
  { label: 'Variables and Data Types', href: '', isActive: true }
]

const mockUser = {
  name: 'João Silva',
  avatar: '',
  level: 5,
  xp: 1250,
  email: 'joao@example.com'
}

const mockLessonContent = {
  id: 'lesson-2',
  title: 'Variables and Data Types in JavaScript',
  description: 'Learn how to declare and use variables in JavaScript, understanding different data types and their use cases.',
  type: 'text' as const,
  content: {
    htmlContent: `
      <h2>JavaScript Variables</h2>
      <p>Variables are containers for storing data values. In JavaScript, you can declare variables using <code>var</code>, <code>let</code>, or <code>const</code>.</p>
      
      <h3>Data Types</h3>
      <ul>
        <li><strong>String:</strong> Text data</li>
        <li><strong>Number:</strong> Numeric data</li>
        <li><strong>Boolean:</strong> True or false values</li>
        <li><strong>Array:</strong> List of values</li>
        <li><strong>Object:</strong> Collection of key-value pairs</li>
      </ul>
      
      <h3>Example Code</h3>
      <pre><code>
let name = "João";
let age = 25;
let isStudent = true;
let hobbies = ["programming", "reading", "gaming"];
      </code></pre>
    `
  },
  estimatedTime: '20 minutes',
  difficulty: 'beginner' as const,
  tags: ['javascript', 'variables', 'data-types', 'fundamentals']
}

const mockQuiz = {
  id: 'quiz-1',
  title: 'JavaScript Variables Quiz',
  description: 'Test your understanding of JavaScript variables and data types',
  passingScore: 70,
  allowRetake: true,
  showFeedback: true,
  timeLimit: 5,
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice' as const,
      question: 'Which keyword is used to declare a constant in JavaScript?',
      options: ['var', 'let', 'const', 'final'],
      correctAnswer: 'const',
      explanation: 'The "const" keyword is used to declare constants that cannot be reassigned.',
      points: 10,
      hint: 'Think about immutable values'
    },
    {
      id: 'q2',
      type: 'true-false' as const,
      question: 'JavaScript is a statically typed language.',
      correctAnswer: 'False',
      explanation: 'JavaScript is a dynamically typed language, meaning variable types are determined at runtime.',
      points: 10
    },
    {
      id: 'q3',
      type: 'multiple-choice' as const,
      question: 'What is the result of typeof null in JavaScript?',
      options: ['null', 'undefined', 'object', 'boolean'],
      correctAnswer: 'object',
      explanation: 'This is a well-known quirk in JavaScript. typeof null returns "object" due to a legacy bug.',
      points: 15,
      hint: 'This is a famous JavaScript quirk'
    }
  ]
}

const mockSteps = [
  {
    id: 'step-1',
    title: 'Setup',
    description: 'Configure your development environment',
    isCompleted: true,
    isActive: false
  },
  {
    id: 'step-2',
    title: 'Learn Basics',
    description: 'Understand fundamental concepts',
    isCompleted: true,
    isActive: false
  },
  {
    id: 'step-3',
    title: 'Practice',
    description: 'Complete hands-on exercises',
    isCompleted: false,
    isActive: true
  },
  {
    id: 'step-4',
    title: 'Build Project',
    description: 'Create a real-world application',
    isCompleted: false,
    isActive: false
  }
]

const mockAchievements = [
  {
    id: 'achievement-1',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: <BookOpen className="w-6 h-6" />,
    requirement: 1,
    current: 1,
    isUnlocked: true
  },
  {
    id: 'achievement-2',
    title: 'Streak Master',
    description: 'Study for 7 days in a row',
    icon: <Target className="w-6 h-6" />,
    requirement: 7,
    current: 7,
    isUnlocked: true
  },
  {
    id: 'achievement-3',
    title: 'Quiz Expert',
    description: 'Score 100% on 5 quizzes',
    icon: <Trophy className="w-6 h-6" />,
    requirement: 5,
    current: 3,
    isUnlocked: false
  }
]

const mockGamificationUser = {
  level: 5,
  currentXP: 1250,
  nextLevelXP: 1500,
  totalXP: 4750,
  streak: 7,
  badges: 12
}

export default function DesignSystemShowcase() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentLesson, setCurrentLesson] = useState('lesson-2')
  const [activeTab, setActiveTab] = useState('components')

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLesson(lessonId)
  }

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <EnhancedHeader
        breadcrumbs={mockBreadcrumbs}
        globalProgress={33}
        user={mockUser}
        onSidebarToggle={handleSidebarToggle}
        onProfileClick={() => console.log('Profile clicked')}
        onSettingsClick={() => console.log('Settings clicked')}
        onThemeToggle={() => console.log('Theme toggled')}
        notifications={3}
      />

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="flex-shrink-0">
          <SidebarNavigation
            courseStructure={mockCourseStructure}
            currentLesson={currentLesson}
            progress={mockProgress}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleSidebarToggle}
            onLessonSelect={handleLessonSelect}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Page Header */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold gradient-text">
                  Design System Showcase
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Demonstrating the Phase 1 components with Violet Dark theme
                </p>
                <Badge className="bg-primary/10 text-primary border-primary/30">
                  Escola Habilidade Platform
                </Badge>
              </div>

              {/* Tabs for different sections */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="components">Components</TabsTrigger>
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz</TabsTrigger>
                </TabsList>

                {/* Components Tab */}
                <TabsContent value="components" className="space-y-8">
                  <div className="grid gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Sidebar Navigation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          The sidebar navigation is visible on the left. Features:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Collapsible design with responsive behavior</li>
                          <li>Search functionality for lessons</li>
                          <li>Progress indicators per module</li>
                          <li>Lesson status icons (completed, locked, current)</li>
                          <li>Overall course progress overview</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Enhanced Header
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          The header above demonstrates:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Large, clickable breadcrumb navigation</li>
                          <li>Global course progress bar</li>
                          <li>User profile dropdown with level and XP</li>
                          <li>Notification and theme toggle buttons</li>
                          <li>Responsive design for mobile devices</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Progress Tab */}
                <TabsContent value="progress" className="space-y-8">
                  <div className="grid gap-8">
                    {/* Linear Progress Examples */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Linear Progress Indicators</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <LinearProgress value={75} size="sm" label="Small Progress" showLabel />
                          <LinearProgress value={50} size="md" label="Medium Progress" showLabel color="success" />
                          <LinearProgress value={25} size="lg" label="Large Progress" showLabel color="warning" animated />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Circular Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Circular Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-8 justify-center">
                          <CircularProgress value={85} color="primary" />
                          <CircularProgress value={65} color="success" size={100} />
                          <CircularProgress value={45} color="warning" size={80} />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Step Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Step Progress</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        <div>
                          <h4 className="text-sm font-medium mb-4">Horizontal Steps</h4>
                          <StepProgress steps={mockSteps} currentStep={3} orientation="horizontal" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-4">Vertical Steps</h4>
                          <div className="max-w-md">
                            <StepProgress steps={mockSteps} currentStep={3} orientation="vertical" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Module Progress */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {mockCourseStructure.map((module) => (
                        <ModuleProgress
                          key={module.id}
                          module={{
                            ...module,
                            lessonsCompleted: module.lessons.filter(l => l.isCompleted).length,
                            totalLessons: module.lessons.length,
                            timeSpent: '2h 15m',
                            difficulty: 'intermediate' as const
                          }}
                          progress={module.progress}
                        />
                      ))}
                    </div>

                    {/* Achievement Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Achievement Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {mockAchievements.map((achievement) => (
                            <AchievementProgress
                              key={achievement.id}
                              achievement={achievement}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Gamification Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Gamification Dashboard</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="max-w-md mx-auto">
                          <GamificationProgress user={mockGamificationUser} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-8">
                  <EnhancedContentArea
                    content={mockLessonContent}
                    navigation={{
                      previousLesson: {
                        id: 'lesson-1',
                        title: 'Introduction to JavaScript'
                      },
                      nextLesson: {
                        id: 'lesson-3',
                        title: 'Functions and Scope'
                      }
                    }}
                    isCompleted={false}
                    onComplete={() => console.log('Lesson completed')}
                    onBookmark={() => console.log('Lesson bookmarked')}
                    onShare={() => console.log('Lesson shared')}
                    onNavigate={(lessonId) => console.log('Navigate to', lessonId)}
                  />
                </TabsContent>

                {/* Quiz Tab */}
                <TabsContent value="quiz" className="space-y-8">
                  <InteractiveQuiz
                    quiz={mockQuiz}
                    onComplete={(results) => console.log('Quiz completed:', results)}
                    onRetry={() => console.log('Quiz retried')}
                    allowRetake={true}
                    showTimer={true}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}