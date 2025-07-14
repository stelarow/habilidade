'use client';

import React from 'react';
import { LessonContent } from '@/types/lesson/content';

interface CentralizedLessonLayoutProps {
  lesson: LessonContent;
  progress: {
    overall: number;
    video: number;
    pdf: number;
    quiz: number;
    exercises: number;
  };
  children: {
    title: React.ReactNode;
    progress: React.ReactNode;
    video?: React.ReactNode;
    pdf?: React.ReactNode;
    exercises?: React.ReactNode;
    quiz?: React.ReactNode;
  };
}

/**
 * Centralized Lesson Layout Component
 * 
 * Replaces the grid-based layout with a single-column, centralized design
 * following the main site's aesthetic patterns.
 * 
 * Content Order:
 * 1. Title
 * 2. Progress
 * 3. Video (when available)
 * 4. PDF (when available)
 * 5. Exercises (when available)
 * 6. Quiz/Tests (when available)
 */
export default function CentralizedLessonLayout({
  lesson,
  progress,
  children
}: CentralizedLessonLayoutProps) {
  return (
    <div className="lesson-background min-h-screen py-8 sm:py-12">
      <div className="lesson-centralized-container">
        <div className="lesson-content-spacing">
          {/* Title Section */}
          <section className="lesson-fade-in">
            {children.title}
          </section>

          {/* Progress Section */}
          <section className="lesson-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="lesson-progress-card">
              <div className="lesson-progress-header">
                Progresso da Aula
              </div>
              <div className="lesson-progress-content">
                {children.progress}
              </div>
            </div>
          </section>

          {/* Video Section */}
          {children.video && lesson.video && (
            <section className="lesson-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="lesson-video-container">
                <div className="lesson-video-header">
                  📹 Vídeo da Aula
                </div>
                <div className="lesson-video-wrapper">
                  {children.video}
                </div>
              </div>
            </section>
          )}

          {/* PDF Section */}
          {children.pdf && lesson.pdf && (
            <section className="lesson-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="lesson-pdf-container">
                <div className="lesson-pdf-header">
                  📄 Material de Estudo
                </div>
                {children.pdf}
              </div>
            </section>
          )}

          {/* Exercises Section */}
          {children.exercises && lesson.exercises && lesson.exercises.length > 0 && (
            <section className="lesson-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="lesson-exercise-container">
                <div className="lesson-exercise-header">
                  ✏️ Exercícios Práticos
                </div>
                {children.exercises}
              </div>
            </section>
          )}

          {/* Quiz/Tests Section */}
          {children.quiz && lesson.quiz && lesson.quiz.totalQuestions > 0 && (
            <section className="lesson-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="lesson-quiz-container">
                <div className="lesson-quiz-header">
                  🎯 Teste de Conhecimento
                </div>
                <div className="lesson-quiz-content">
                  {children.quiz}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for managing centralized layout state
 */
export function useCentralizedLayout() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  const scrollToSection = React.useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for any fixed headers
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveSection(sectionId);
    }
  }, []);

  React.useEffect(() => {
    // Intersection Observer for tracking active sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px'
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return {
    isLoading,
    setIsLoading,
    activeSection,
    scrollToSection
  };
}

/**
 * Centralized Lesson Title Component
 */
export function CentralizedLessonTitle({ 
  title, 
  courseTitle, 
  themeColors 
}: { 
  title: string; 
  courseTitle: string;
  themeColors?: {
    primary: string;
    secondary: string;
  };
}) {
  const gradientStyle = themeColors ? {
    background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})`
  } : {};

  return (
    <div className="text-center space-y-4">
      <div className="lesson-text-subtitle">
        {courseTitle}
      </div>
      <h1 
        className="lesson-title lesson-title-gradient"
        style={themeColors ? {
          background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        } : {}}
      >
        {title}
      </h1>
    </div>
  );
}

/**
 * Centralized Navigation for lesson sections
 */
export function CentralizedLessonNav({ 
  lesson, 
  activeSection, 
  onSectionClick 
}: {
  lesson: LessonContent;
  activeSection: string | null;
  onSectionClick: (sectionId: string) => void;
}) {
  const sections = [
    { id: 'progress', label: 'Progresso', icon: '📊' },
    ...(lesson.video ? [{ id: 'video', label: 'Vídeo', icon: '📹' }] : []),
    ...(lesson.pdf ? [{ id: 'pdf', label: 'Material', icon: '📄' }] : []),
    ...(lesson.exercises && lesson.exercises.length > 0 ? [{ id: 'exercises', label: 'Exercícios', icon: '✏️' }] : []),
    ...(lesson.quiz && lesson.quiz.totalQuestions > 0 ? [{ id: 'quiz', label: 'Teste', icon: '🎯' }] : [])
  ];

  return (
    <nav className="lesson-card-base lesson-card-padding sticky top-20 z-10 mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
              ${activeSection === section.id 
                ? 'bg-purple-600 text-white border-purple-500' 
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
              }
              border lesson-focusable
            `}
          >
            <span>{section.icon}</span>
            <span className="hidden sm:inline">{section.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}