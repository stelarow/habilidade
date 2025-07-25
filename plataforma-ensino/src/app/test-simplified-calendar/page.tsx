/**
 * Test page for the simplified calendar system
 * This page tests the new SimplifiedWeeklySchedule component
 */

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import SimplifiedWeeklySchedule from '@/components/enrollment/SimplifiedWeeklySchedule'
import { seedSampleInstructors } from '@/lib/seed-data'

export default function TestSimplifiedCalendarPage() {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('')
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [hasTwoClasses, setHasTwoClasses] = useState(false)
  const [isSeedingData, setIsSeedingData] = useState(false)

  // Sample teacher IDs for testing
  const sampleTeachers = [
    { id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', name: 'Prof. João Silva' },
    { id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q', name: 'Prof. Maria Santos' },
    { id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r', name: 'Prof. Carlos Costa' }
  ]

  const handleSlotSelect = (slot1: string, slot2?: string) => {
    const newSlots = [slot1, slot2].filter(Boolean) as string[]
    setSelectedSlots(newSlots)
    console.log('Selected slots:', newSlots)
  }

  const handleSeedData = async () => {
    setIsSeedingData(true)
    try {
      const result = await seedSampleInstructors()
      if (result.success) {
        alert('Dados de exemplo criados com sucesso!')
      } else {
        alert('Erro ao criar dados: ' + (result.error?.message || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Error seeding data:', error)
      alert('Erro ao criar dados de exemplo')
    } finally {
      setIsSeedingData(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 border-gray-700 bg-gray-800/50">
          <h1 className="text-3xl font-bold text-white mb-2">
            Teste: Calendário Semanal Simplificado
          </h1>
          <p className="text-gray-300">
            Esta página testa o novo sistema de calendário simplificado para matrículas presenciais.
          </p>
        </Card>

        {/* Controls */}
        <Card className="p-6 border-gray-700 bg-gray-800/50">
          <h2 className="text-xl font-semibold text-white mb-4">Configurações de Teste</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teacher Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selecionar Professor
              </label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um professor...</option>
                {sampleTeachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Two Classes Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hasTwoClasses"
                checked={hasTwoClasses}
                onChange={(e) => setHasTwoClasses(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="hasTwoClasses" className="text-sm font-medium text-gray-300">
                Duas aulas por semana
              </label>
            </div>
          </div>

          {/* Seed Data Button */}
          <div className="mt-4 pt-4 border-t border-gray-600">
            <button
              onClick={handleSeedData}
              disabled={isSeedingData}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSeedingData ? 'Criando...' : 'Criar Dados de Exemplo'}
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Cria professores de exemplo com horários padrão no banco de dados
            </p>
          </div>
        </Card>

        {/* Selected Slots Info */}
        {selectedSlots.length > 0 && (
          <Card className="p-4 border-purple-500/30 bg-purple-900/20">
            <h3 className="text-lg font-semibold text-white mb-2">Horários Selecionados</h3>
            <div className="space-y-1">
              {selectedSlots.map((slotId, index) => (
                <div key={slotId} className="text-purple-300">
                  Slot {index + 1}: {slotId}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Simplified Calendar */}
        <Card className="p-6 border-gray-700 bg-gray-800/50">
          <SimplifiedWeeklySchedule
            teacherId={selectedTeacherId || undefined}
            onSlotSelect={handleSlotSelect}
            selectedSlots={selectedSlots}
            maxSelectableSlots={hasTwoClasses ? 2 : 1}
            hasTwoClassesPerWeek={hasTwoClasses}
          />
        </Card>

        {/* Debug Info */}
        <Card className="p-4 border-gray-700 bg-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Debug Info</h3>
          <pre className="text-xs text-gray-500 font-mono">
            {JSON.stringify({
              selectedTeacherId,
              selectedSlots,
              hasTwoClasses,
              maxSlots: hasTwoClasses ? 2 : 1
            }, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  )
}