'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import SimplifiedWeeklySchedule from '@/components/enrollment/SimplifiedWeeklySchedule'

export default function TestSimplifiedSchedulePage() {
  const [teachers, setTeachers] = useState<Array<{id: string, name: string}>>([])
  const [selectedTeacher, setSelectedTeacher] = useState<string>('')
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const { data, error } = await supabase
          .from('instructors')
          .select(`
            id,
            user_id,
            users!inner (
              full_name
            )
          `)

        if (error) {
          console.error('Error loading teachers:', error)
          return
        }

        const teacherList = data?.map(instructor => ({
          id: instructor.id,
          name: instructor.users?.full_name || 'Nome não disponível'
        })) || []

        setTeachers(teacherList)
        if (teacherList.length > 0) {
          setSelectedTeacher(teacherList[0].id)
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadTeachers()
  }, [supabase])

  const handleSlotSelect = (slot1: string, slot2?: string) => {
    const newSlots = slot2 ? [slot1, slot2] : [slot1]
    setSelectedSlots(newSlots)
    console.log('Selected slots:', newSlots)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Carregando Teste...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste do SimplifiedWeeklySchedule</h1>
        
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            Selecionar Professor:
          </label>
          <select 
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-md p-2 text-white"
          >
            <option value="">Selecione um professor</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Horários Selecionados:</h2>
          {selectedSlots.length > 0 ? (
            <div className="bg-gray-800 p-4 rounded-md">
              {selectedSlots.map((slot, index) => (
                <div key={index} className="text-green-400">
                  Slot {index + 1}: {slot}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400">Nenhum horário selecionado</div>
          )}
        </div>

        {selectedTeacher && (
          <SimplifiedWeeklySchedule
            teacherId={selectedTeacher}
            onSlotSelect={handleSlotSelect}
            selectedSlots={selectedSlots}
            maxSelectableSlots={2}
            hasTwoClassesPerWeek={true}
            className="bg-gray-900 p-6 rounded-lg"
          />
        )}
      </div>
    </div>
  )
}