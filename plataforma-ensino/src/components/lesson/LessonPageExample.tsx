'use client'

import React from 'react'
import { LessonContainer, LessonGrid, GridArea, LessonLayoutProvider } from './layout'
import { VideoPlayer } from './video/VideoPlayer'
import { PDFViewer } from './pdf/PDFViewer'
import { QuizInterface } from './quiz/QuizInterface'
import { ExercisePanel } from './exercises/ExercisePanel'
import { LessonProvider, useLessonContent } from '@/contexts/LessonContext'
import { LessonContent } from '@/types/lesson'

// Import CSS
import '@/styles/lesson-layout.css'

/**
 * LessonPageExample - Example implementation of the adaptive lesson system
 * Part of Fase 1: Validation and demonstration
 * 
 * This component demonstrates:
 * - How the layout adapts to different content types
 * - How components are prioritized and positioned
 * - How the responsive system works
 * - Integration between all Fase 1 components
 */
export function LessonPageExample({ content }: { content: LessonContent }) {
  return (
    <LessonProvider>
      <LessonLayoutProvider initialContent={content}>
        <LessonPageContent />
      </LessonLayoutProvider>
    </LessonProvider>
  )
}

function LessonPageContent() {
  const { content, isLoading, error } = useLessonContent()
  
  if (isLoading) {
    return <div className="lesson-loading">Loading lesson...</div>
  }
  
  if (error) {
    return <div className="lesson-error">Error: {error}</div>
  }
  
  if (!content) {
    return <div className="lesson-empty">No lesson content available</div>
  }
  
  return (
    <LessonContainer content={content} className="lesson-page">
      {/* Header */}
      <GridArea area="header">
        <LessonHeader content={content} />
      </GridArea>
      
      {/* Main Content Area */}
      <GridArea area="main" priority={10}>
        <MainContentRenderer content={content} />
      </GridArea>
      
      {/* Sidebar */}
      <GridArea area="sidebar" priority={8}>
        <SidebarContentRenderer content={content} />
      </GridArea>
      
      {/* Exercises */}
      {content.exercises && content.exercises.length > 0 && (
        <GridArea area="exercises" priority={6}>
          <ExercisePanel exercises={content.exercises} />
        </GridArea>
      )}
      
      {/* Footer */}
      <GridArea area="footer">
        <LessonFooter content={content} />
      </GridArea>
    </LessonContainer>
  )
}

// Header component
function LessonHeader({ content }: { content: LessonContent }) {
  return (
    <header className="lesson-header">
      <div className="lesson-breadcrumb">
        Course &gt; Module &gt; {content.title}
      </div>
      <h1 className="lesson-title">{content.title}</h1>
      {content.description && (
        <p className="lesson-description">{content.description}</p>
      )}
      <div className="lesson-progress-bar">
        <div className="progress-fill" style={{ width: '45%' }}></div>
      </div>
      
      <style jsx>{`
        .lesson-header {
          padding: 1rem 0;
          color: #fff;
        }
        
        .lesson-breadcrumb {
          font-size: 0.9rem;
          opacity: 0.7;
          margin-bottom: 0.5rem;
        }
        
        .lesson-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: #fff;
        }
        
        .lesson-description {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0 0 1rem 0;
        }
        
        .lesson-progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #d400ff, #00c4ff);
          transition: width 0.3s ease;
        }
      `}</style>
    </header>
  )
}

// Main content renderer
function MainContentRenderer({ content }: { content: LessonContent }) {
  // Video has highest priority
  if (content.video) {
    return <VideoPlayer video={content.video} />
  }
  
  // PDF as fallback
  if (content.pdf) {
    return <PDFViewer pdf={content.pdf} />
  }
  
  // Rich text content
  if (content.content) {
    return (
      <div className="content-viewer">
        <div className="content-body" dangerouslySetInnerHTML={{ __html: content.content }} />
        
        <style jsx>{`
          .content-viewer {
            padding: 1.5rem;
            color: #fff;
            line-height: 1.6;
          }
          
          .content-body {
            font-size: 1.1rem;
          }
          
          .content-body :global(h1),
          .content-body :global(h2),
          .content-body :global(h3) {
            color: #d400ff;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          
          .content-body :global(p) {
            margin-bottom: 1rem;
          }
          
          .content-body :global(code) {
            background: rgba(255, 255, 255, 0.1);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: 'Fira Code', monospace;
          }
        `}</style>
      </div>
    )
  }
  
  // Fallback
  return (
    <div className="no-main-content">
      <p>No main content available for this lesson.</p>
    </div>
  )
}

// Sidebar content renderer
function SidebarContentRenderer({ content }: { content: LessonContent }) {
  return (
    <div className="sidebar-content">
      {/* Quiz gets priority in sidebar */}
      {content.quiz && (
        <div className="sidebar-section">
          <QuizInterface quiz={content.quiz} />
        </div>
      )}
      
      {/* Materials */}
      {content.materials && content.materials.length > 0 && (
        <div className="sidebar-section">
          <MaterialsList materials={content.materials} />
        </div>
      )}
      
      {/* Transcript */}
      {content.transcript && (
        <div className="sidebar-section">
          <TranscriptViewer transcript={content.transcript} />
        </div>
      )}
      
      <style jsx>{`
        .sidebar-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
        }
        
        .sidebar-section {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  )
}

// Materials list
function MaterialsList({ materials }: { materials: any[] }) {
  return (
    <div className="materials-list">
      <h3>📚 Materials</h3>
      {materials.map((material, index) => (
        <div key={index} className="material-item">
          <div className="material-icon">
            {material.type === 'pdf' ? '📄' : 
             material.type === 'link' ? '🔗' : 
             material.type === 'image' ? '🖼️' : '📎'}
          </div>
          <div className="material-info">
            <div className="material-title">{material.title}</div>
            {material.size && (
              <div className="material-size">
                {(material.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </div>
        </div>
      ))}
      
      <style jsx>{`
        .materials-list {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 1rem;
          color: #fff;
        }
        
        .materials-list h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
        }
        
        .material-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .material-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .material-icon {
          font-size: 1.2rem;
        }
        
        .material-info {
          flex: 1;
        }
        
        .material-title {
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .material-size {
          font-size: 0.8rem;
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
}

// Transcript viewer
function TranscriptViewer({ transcript }: { transcript: string }) {
  return (
    <div className="transcript-viewer">
      <h3>📝 Transcript</h3>
      <div className="transcript-content">
        {transcript}
      </div>
      
      <style jsx>{`
        .transcript-viewer {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 1rem;
          color: #fff;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .transcript-viewer h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
        }
        
        .transcript-content {
          font-size: 0.85rem;
          line-height: 1.5;
          opacity: 0.9;
        }
      `}</style>
    </div>
  )
}

// Footer component
function LessonFooter({ content }: { content: LessonContent }) {
  return (
    <footer className="lesson-footer">
      <div className="lesson-navigation">
        <button className="nav-button prev">← Previous Lesson</button>
        <button className="nav-button next">Next Lesson →</button>
      </div>
      
      <style jsx>{`
        .lesson-footer {
          padding: 1rem 0;
          display: flex;
          justify-content: center;
        }
        
        .lesson-navigation {
          display: flex;
          gap: 1rem;
        }
        
        .nav-button {
          padding: 0.75rem 1.5rem;
          background: rgba(212, 0, 255, 0.2);
          border: 1px solid rgba(212, 0, 255, 0.5);
          color: #fff;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }
        
        .nav-button:hover {
          background: rgba(212, 0, 255, 0.3);
          transform: translateY(-1px);
        }
        
        .nav-button.prev {
          background: rgba(0, 196, 255, 0.2);
          border-color: rgba(0, 196, 255, 0.5);
        }
        
        .nav-button.prev:hover {
          background: rgba(0, 196, 255, 0.3);
        }
      `}</style>
    </footer>
  )
}