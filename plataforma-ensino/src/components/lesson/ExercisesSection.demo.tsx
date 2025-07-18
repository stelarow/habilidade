'use client'

import React from 'react'
import ExercisesSection from './ExercisesSection'

// Demo component to showcase ExercisesSection functionality
const ExercisesSectionDemo: React.FC = () => {
  const handleProgressUpdate = (progress: number) => {
    console.log('Exercise progress updated:', progress + '%')
  }

  const handleFilesUploaded = (files: any[]) => {
    console.log('Files uploaded:', files.map(f => f.name))
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          ExercisesSection Component Demo
        </h1>
        
        {/* Default ExercisesSection */}
        <ExercisesSection
          title="Exercícios Práticos - Aula 1"
          onProgressUpdate={handleProgressUpdate}
          onFilesUploaded={handleFilesUploaded}
        />

        {/* Custom ExercisesSection with different files */}
        <ExercisesSection
          title="Exercícios Avançados - Projeto Final"
          exerciseFiles={[
            {
              id: 'custom1',
              name: 'Projeto Base - React.zip',
              size: 15728640, // 15MB
              type: 'application/zip',
              downloadUrl: '#'
            },
            {
              id: 'custom2',
              name: 'Instruções Detalhadas.pdf',
              size: 3145728, // 3MB
              type: 'application/pdf',
              downloadUrl: '#'
            },
            {
              id: 'custom3',
              name: 'Checklist de Entrega.docx',
              size: 1048576, // 1MB
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              downloadUrl: '#'
            },
            {
              id: 'custom4',
              name: 'Mockups de Referência.png',
              size: 2097152, // 2MB
              type: 'image/png',
              downloadUrl: '#'
            }
          ]}
          maxFileSize={20} // 20MB limit
          allowedFileTypes={[
            'application/pdf',
            'application/zip',
            'application/x-zip-compressed',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/png',
            'image/jpeg',
            'text/plain'
          ]}
          onProgressUpdate={handleProgressUpdate}
          onFilesUploaded={handleFilesUploaded}
        />

        {/* Compact ExercisesSection with fewer files */}
        <ExercisesSection
          title="Exercício Rápido - Quiz Prático"
          exerciseFiles={[
            {
              id: 'quick1',
              name: 'Questões.pdf',
              size: 512000, // 512KB
              type: 'application/pdf',
              downloadUrl: '#'
            }
          ]}
          maxFileSize={5} // 5MB limit
          onProgressUpdate={handleProgressUpdate}
          onFilesUploaded={handleFilesUploaded}
        />
      </div>
    </div>
  )
}

export default ExercisesSectionDemo