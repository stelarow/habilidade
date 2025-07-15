'use client'

import React, { useState, useRef } from 'react'
import { ExerciseData } from '@/types/lesson'

interface ExercisePanelProps {
  exercises: ExerciseData[]
  className?: string
  onExerciseSubmit?: (exerciseId: string, file: File) => void
}

/**
 * ExercisePanel - Interactive exercise list with upload functionality
 * 
 * PLACEHOLDER for Fase 2: Desenvolvimento de Componentes
 * 
 * Will implement:
 * - Expandable cards for each exercise
 * - Status indicators (not started/in progress/completed)
 * - Download buttons for exercise files
 * - Drag & drop upload area
 * - File preview functionality
 * - Submission history
 * - Instructor feedback display
 * - Progress tracking per exercise
 */
export function ExercisePanel({ exercises, className, onExerciseSubmit }: ExercisePanelProps) {
  const completedCount = exercises.filter(ex => ex.status === 'completed').length
  const inProgressCount = exercises.filter(ex => ex.status === 'in_progress').length
  const [uploadingExercise, setUploadingExercise] = useState<string | null>(null)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  
  const handleFileUpload = (exerciseId: string) => {
    const input = fileInputRefs.current[exerciseId]
    if (input) {
      input.click()
    }
  }
  
  const handleFileChange = async (exerciseId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onExerciseSubmit) {
      setUploadingExercise(exerciseId)
      try {
        await onExerciseSubmit(exerciseId, file)
        // Reset file input
        if (event.target) {
          event.target.value = ''
        }
      } catch (error) {
        console.error('Error submitting exercise:', error)
        alert('Erro ao enviar exercício. Tente novamente.')
      } finally {
        setUploadingExercise(null)
      }
    }
  }
  
  return (
    <div className={`exercise-panel-container ${className || ''}`}>
      <div className="exercise-panel-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-header">
            <div className="placeholder-icon">📋</div>
            <h3>Exercise Panel</h3>
            <p>Fase 2 Implementation Pending</p>
          </div>
          
          <div className="exercise-summary">
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-number">{exercises.length}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat">
                <span className="stat-number">{completedCount}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat">
                <span className="stat-number">{inProgressCount}</span>
                <span className="stat-label">In Progress</span>
              </div>
            </div>
          </div>
          
          <div className="exercise-list">
            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="exercise-item">
                <div className="exercise-status">
                  {exercise.status === 'completed' ? '✅' : 
                   exercise.status === 'in_progress' ? '🔄' : '⭕'}
                </div>
                <div className="exercise-info">
                  <div className="exercise-title">{exercise.title}</div>
                  {exercise.description && (
                    <div className="exercise-description">{exercise.description}</div>
                  )}
                  <div className="exercise-actions">
                    {exercise.downloadUrl && (
                      <button className="download-btn">📥 Download</button>
                    )}
                    {exercise.allowsUpload && (
                      <>
                        <input
                          type="file"
                          ref={el => { fileInputRefs.current[exercise.id] = el }}
                          onChange={(e) => handleFileChange(exercise.id, e)}
                          accept="image/*,.pdf,.doc,.docx,.txt"
                          style={{ display: 'none' }}
                        />
                        <button 
                          className="upload-btn"
                          onClick={() => handleFileUpload(exercise.id)}
                          disabled={uploadingExercise === exercise.id}
                        >
                          {uploadingExercise === exercise.id ? (
                            <span>⏳ Enviando...</span>
                          ) : (
                            <span>📤 Enviar imagem do exercício completo</span>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .exercise-panel-container {
          width: 100%;
          height: 100%;
          min-height: 250px;
        }
        
        .exercise-panel-placeholder {
          background: linear-gradient(145deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
          border: 2px dashed rgba(245, 158, 11, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          height: 100%;
        }
        
        .placeholder-content {
          color: #fff;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .placeholder-header {
          text-align: center;
          margin-bottom: 1rem;
        }
        
        .placeholder-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .exercise-summary {
          margin-bottom: 1rem;
        }
        
        .summary-stats {
          display: flex;
          justify-content: space-around;
          gap: 1rem;
        }
        
        .stat {
          text-align: center;
          background: rgba(245, 158, 11, 0.1);
          padding: 0.5rem;
          border-radius: 6px;
          flex: 1;
        }
        
        .stat-number {
          display: block;
          font-size: 1.2rem;
          font-weight: bold;
          color: #fbbf24;
        }
        
        .stat-label {
          font-size: 0.8rem;
          opacity: 0.8;
        }
        
        .exercise-list {
          flex: 1;
          overflow-y: auto;
          max-height: 300px;
        }
        
        .exercise-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          margin-bottom: 0.5rem;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        
        .exercise-status {
          font-size: 1.2rem;
          margin-top: 0.1rem;
        }
        
        .exercise-info {
          flex: 1;
        }
        
        .exercise-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
        }
        
        .exercise-description {
          font-size: 0.8rem;
          opacity: 0.8;
          margin-bottom: 0.5rem;
        }
        
        .exercise-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .download-btn,
        .upload-btn {
          padding: 0.5rem 0.75rem;
          border: 1px solid rgba(245, 158, 11, 0.5);
          background: rgba(245, 158, 11, 0.1);
          color: #fff;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }
        
        .download-btn:hover,
        .upload-btn:hover {
          background: rgba(245, 158, 11, 0.2);
        }
        
        .upload-btn {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.5);
          min-width: 180px;
        }
        
        .upload-btn:hover:not(:disabled) {
          background: rgba(34, 197, 94, 0.2);
          transform: translateY(-1px);
        }
        
        .upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}