import React from 'react'
import ProgressIndicator from './ProgressIndicator'

export const ProgressIndicatorExamples: React.FC = () => {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          ProgressIndicator Component Examples
        </h1>

        {/* Basic Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Basic Progress Indicators
          </h2>
          <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <span className="w-20 text-sm text-gray-600">Video:</span>
              <ProgressIndicator
                label="Vídeo"
                shortLabel="V"
                progress={75}
                variant="video"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-20 text-sm text-gray-600">Material:</span>
              <ProgressIndicator
                label="Material"
                shortLabel="M"
                progress={50}
                variant="material"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-20 text-sm text-gray-600">Exercise:</span>
              <ProgressIndicator
                label="Exercício"
                shortLabel="E"
                progress={100}
                variant="exercise"
              />
            </div>
          </div>
        </section>

        {/* Responsive Behavior */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Responsive Behavior
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-4">
              Resize your browser window to see how labels adapt to different screen sizes.
            </p>
            <div className="space-y-4">
              <ProgressIndicator
                label="Vídeo Completo"
                shortLabel="V"
                progress={85}
                variant="video"
              />
              <ProgressIndicator
                label="Material de Apoio"
                shortLabel="M"
                progress={60}
                variant="material"
              />
              <ProgressIndicator
                label="Exercícios Práticos"
                shortLabel="E"
                progress={40}
                variant="exercise"
              />
            </div>
          </div>
        </section>

        {/* Compact Mode */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Compact Mode
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-4">
              Compact mode always shows short labels regardless of screen size.
            </p>
            <div className="space-y-4">
              <ProgressIndicator
                label="Vídeo Completo"
                shortLabel="V"
                progress={90}
                variant="video"
                compact
              />
              <ProgressIndicator
                label="Material de Apoio"
                shortLabel="M"
                progress={70}
                variant="material"
                compact
              />
              <ProgressIndicator
                label="Exercícios Práticos"
                shortLabel="E"
                progress={30}
                variant="exercise"
                compact
              />
            </div>
          </div>
        </section>

        {/* Progress Values */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Different Progress Values
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-4">
              <ProgressIndicator
                label="Not Started"
                shortLabel="NS"
                progress={0}
                variant="default"
              />
              <ProgressIndicator
                label="In Progress"
                shortLabel="IP"
                progress={25}
                variant="video"
              />
              <ProgressIndicator
                label="Half Complete"
                shortLabel="HC"
                progress={50}
                variant="material"
              />
              <ProgressIndicator
                label="Almost Done"
                shortLabel="AD"
                progress={90}
                variant="exercise"
              />
              <ProgressIndicator
                label="Completed"
                shortLabel="C"
                progress={100}
                variant="exercise"
              />
            </div>
          </div>
        </section>

        {/* Header Layout Simulation */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Header Layout Simulation
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-100 rounded">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-500 rounded"></div>
              </div>
              
              {/* Progress Section */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <ProgressIndicator
                  label="Vídeo"
                  shortLabel="V"
                  progress={75}
                  variant="video"
                />
                <ProgressIndicator
                  label="Material"
                  shortLabel="M"
                  progress={50}
                  variant="material"
                />
                <ProgressIndicator
                  label="Exercício"
                  shortLabel="E"
                  progress={100}
                  variant="exercise"
                />
              </div>
              
              {/* Exit Button */}
              <div className="flex-shrink-0">
                <button className="px-4 py-2 bg-red-500 text-white rounded text-sm">
                  Sair
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Edge Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Edge Cases
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Progress over 100% (clamped to 100%):</p>
                <ProgressIndicator
                  label="Over Limit"
                  shortLabel="OL"
                  progress={150}
                  variant="video"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Negative progress (clamped to 0%):</p>
                <ProgressIndicator
                  label="Negative"
                  shortLabel="N"
                  progress={-25}
                  variant="material"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Very long labels:</p>
                <ProgressIndicator
                  label="Very Long Label That Should Be Truncated"
                  shortLabel="VL"
                  progress={42}
                  variant="exercise"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProgressIndicatorExamples