'use client'

import React, { useState, useCallback, Suspense } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Bookmark, 
  Share, 
  Play,
  Pause,
  Maximize,
  Download,
  Clock,
  Star,
  StarIcon,
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  AlertCircle
} from 'lucide-react'

/**
 * Interface definitions for content area
 */
export interface ContentData {
  // Video content
  videoUrl?: string
  videoThumbnail?: string
  videoDuration?: string
  
  // Text content
  htmlContent?: string
  markdownContent?: string
  
  // Interactive content (Canva, etc.)
  embedUrl?: string
  embedType?: 'canva' | 'figma' | 'miro' | 'custom'
  
  // PDF content
  pdfUrl?: string
  pdfPages?: number
  
  // Quiz data
  quizData?: {
    id: string
    title: string
    description?: string
    questions: Array<{
      id: string
      question: string
      options: string[]
      correctAnswer: string
      explanation: string
    }>
    timeLimit?: number
    passingScore: number
  }
}

export interface LessonContent {
  id: string
  title: string
  description?: string
  type: 'video' | 'text' | 'interactive' | 'quiz'
  content: ContentData
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags?: string[]
}

export interface NavigationInfo {
  previousLesson?: {
    id: string
    title: string
  }
  nextLesson?: {
    id: string
    title: string
  }
}

export interface EnhancedContentAreaProps {
  content: LessonContent
  navigation?: NavigationInfo
  isCompleted?: boolean
  onComplete: () => void
  onBookmark: () => void
  onShare: () => void
  onNavigate?: (lessonId: string) => void
  isBookmarked?: boolean
  className?: string
}

/**
 * Content type icon mapping
 */
const getContentIcon = (type: LessonContent['type']) => {
  switch (type) {
    case 'video':
      return <Video className="h-5 w-5" />
    case 'text':
      return <FileText className="h-5 w-5" />
    case 'interactive':
      return <BookOpen className="h-5 w-5" />
    case 'quiz':
      return <HelpCircle className="h-5 w-5" />
    default:
      return <FileText className="h-5 w-5" />
  }
}

/**
 * Difficulty badge component
 */
const DifficultyBadge: React.FC<{ difficulty: LessonContent['difficulty'] }> = ({ difficulty }) => {
  const colors = {
    beginner: 'bg-success/10 text-success border-success/30',
    intermediate: 'bg-warning/10 text-warning border-warning/30',
    advanced: 'bg-destructive/10 text-destructive border-destructive/30'
  }

  return (
    <Badge variant="outline" className={colors[difficulty]}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Badge>
  )
}

/**
 * Video player component
 */
const VideoPlayer: React.FC<{
  videoUrl: string
  thumbnail?: string
  title: string
}> = ({ videoUrl, thumbnail, title }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
      {!isPlaying && thumbnail && (
        <div 
          className="absolute inset-0 bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${thumbnail})` }}
          onClick={() => setIsPlaying(true)}
        >
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Button size="lg" className="rounded-full h-16 w-16 p-0">
              <Play className="h-8 w-8 ml-1" />
            </Button>
          </div>
        </div>
      )}
      
      {isPlaying && (
        <div className="w-full h-full">
          {/* Placeholder for actual video player integration */}
          <div className="w-full h-full bg-black flex items-center justify-center">
            <p className="text-white">Video Player: {title}</p>
          </div>
          
          {/* Video controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Interactive embed component
 */
const InteractiveEmbed: React.FC<{
  embedUrl: string
  embedType: ContentData['embedType']
  title: string
}> = ({ embedUrl, embedType, title }) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative">
      <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Loading {embedType}...</p>
            </div>
          </div>
        )}
        
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      </div>
      
      {/* Embed actions */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
          asChild
        >
          <a href={embedUrl} target="_blank" rel="noopener noreferrer">
            <Maximize className="h-4 w-4 mr-2" />
            Full Screen
          </a>
        </Button>
      </div>
    </div>
  )
}

/**
 * Text content renderer
 */
const TextContent: React.FC<{
  content: string
  isMarkdown?: boolean
}> = ({ content, isMarkdown = false }) => {
  return (
    <div className="prose prose-invert max-w-none">
      {isMarkdown ? (
        // In a real implementation, you'd use a markdown renderer here
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  )
}

/**
 * Content renderer based on type
 */
const ContentRenderer: React.FC<{
  content: LessonContent
}> = ({ content }) => {
  switch (content.type) {
    case 'video':
      return content.content.videoUrl ? (
        <VideoPlayer
          videoUrl={content.content.videoUrl}
          thumbnail={content.content.videoThumbnail}
          title={content.title}
        />
      ) : (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Video not available</p>
          </div>
        </div>
      )

    case 'interactive':
      return content.content.embedUrl ? (
        <InteractiveEmbed
          embedUrl={content.content.embedUrl}
          embedType={content.content.embedType || 'custom'}
          title={content.title}
        />
      ) : (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Interactive content not available</p>
          </div>
        </div>
      )

    case 'text':
      return content.content.htmlContent || content.content.markdownContent ? (
        <TextContent
          content={content.content.htmlContent || content.content.markdownContent || ''}
          isMarkdown={!!content.content.markdownContent}
        />
      ) : (
        <div className="text-center text-muted-foreground py-8">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>Content not available</p>
        </div>
      )

    case 'quiz':
      return (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Interactive Quiz</h3>
          <p className="text-muted-foreground mb-4">
            Test your knowledge with this interactive quiz
          </p>
          <Button>Start Quiz</Button>
        </div>
      )

    default:
      return (
        <div className="text-center text-muted-foreground py-8">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>Content type not supported</p>
        </div>
      )
  }
}

/**
 * Navigation controls component
 */
const NavigationControls: React.FC<{
  navigation?: NavigationInfo
  onNavigate?: (lessonId: string) => void
  isCompleted?: boolean
  onComplete: () => void
}> = ({ navigation, onNavigate, isCompleted, onComplete }) => {
  return (
    <div className="flex items-center justify-between pt-8 border-t border-border">
      <div className="flex-1">
        {navigation?.previousLesson && onNavigate && (
          <Button
            variant="outline"
            onClick={() => onNavigate(navigation.previousLesson!.id)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous:</span>
            <span className="truncate max-w-32 sm:max-w-48">
              {navigation.previousLesson.title}
            </span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={onComplete}
          className={cn(
            "flex items-center gap-2",
            isCompleted && "bg-success hover:bg-success/90"
          )}
        >
          <Check className="h-4 w-4" />
          {isCompleted ? 'Completed' : 'Mark Complete'}
        </Button>
      </div>

      <div className="flex-1 flex justify-end">
        {navigation?.nextLesson && onNavigate && (
          <Button
            variant="outline"
            onClick={() => onNavigate(navigation.nextLesson!.id)}
            className="flex items-center gap-2"
          >
            <span className="truncate max-w-32 sm:max-w-48">
              {navigation.nextLesson.title}
            </span>
            <span className="hidden sm:inline">:Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Main enhanced content area component
 */
export const EnhancedContentArea: React.FC<EnhancedContentAreaProps> = ({
  content,
  navigation,
  isCompleted = false,
  onComplete,
  onBookmark,
  onShare,
  onNavigate,
  isBookmarked = false,
  className
}) => {
  return (
    <div className={cn("max-w-4xl mx-auto p-6 space-y-6", className)}>
      {/* Content Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-primary">
                  {getContentIcon(content.type)}
                </div>
                <h1 className="text-2xl font-bold leading-tight">
                  {content.title}
                </h1>
              </div>
              
              {content.description && (
                <p className="text-muted-foreground mb-4">
                  {content.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Estimated: {content.estimatedTime}</span>
                </div>
                
                <DifficultyBadge difficulty={content.difficulty} />
                
                {content.tags && content.tags.length > 0 && (
                  <div className="flex gap-1">
                    {content.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBookmark}
                className={cn(
                  "h-9 w-9 p-0",
                  isBookmarked && "text-warning"
                )}
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                className="h-9 w-9 p-0"
                aria-label="Share lesson"
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card>
        <CardContent className="p-6">
          <Suspense
            fallback={
              <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            }
          >
            <ContentRenderer content={content} />
          </Suspense>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <NavigationControls
        navigation={navigation}
        onNavigate={onNavigate}
        isCompleted={isCompleted}
        onComplete={onComplete}
      />
    </div>
  )
}

export default EnhancedContentArea