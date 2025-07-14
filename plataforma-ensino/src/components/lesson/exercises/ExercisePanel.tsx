'use client'

import React from 'react'
import { ExerciseData } from '@/types/lesson'

interface ExercisePanelProps {
  exercises: ExerciseData[]
  className?: string
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
export function ExercisePanel({ exercises, className }: ExercisePanelProps) {
  const completedCount = exercises.filter(ex => ex.status === 'completed').length
  const inProgressCount = exercises.filter(ex => ex.status === 'in_progress').length
  
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
                      <button className="upload-btn">📤 Submit</button>
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
        }
        
        .download-btn,
        .upload-btn {
          padding: 0.25rem 0.5rem;
          border: 1px solid rgba(245, 158, 11, 0.5);
          background: rgba(245, 158, 11, 0.1);
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          transition: background-color 0.2s;
        }
        
        .download-btn:hover,
        .upload-btn:hover {
          background: rgba(245, 158, 11, 0.2);
        }
        
        .upload-btn {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.5);
        }
        
        .upload-btn:hover {
          background: rgba(34, 197, 94, 0.2);
        }
      `}</style>
    </div>
  )
}