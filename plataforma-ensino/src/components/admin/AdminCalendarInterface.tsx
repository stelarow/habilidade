'use client';

import { useState } from 'react';
import { CalendarView } from '@/components/calendar';

interface Teacher {
  id: string;
  email: string;
  full_name?: string;
}

interface AdminCalendarInterfaceProps {
  teachers: Teacher[];
}

export function AdminCalendarInterface({ teachers }: AdminCalendarInterfaceProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">
          Visualização do Calendário
        </h2>
        
        <div className="flex items-center space-x-4">
          <div className="min-w-0 flex-1">
            <label htmlFor="teacher-select" className="sr-only">
              Selecionar professor
            </label>
            <select
              id="teacher-select"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md min-w-[200px]"
            >
              <option value="">Todos os professores</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.full_name || teacher.email}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calendar View Component */}
      <CalendarView teacherId={selectedTeacher || undefined} />

      {/* Additional admin info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Informações Administrativas:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Limite máximo: 3 alunos por horário</li>
          <li>• Horários disponíveis: Segunda a Sábado</li>
          <li>• 6 slots diários: 08:00-10:00, 10:00-12:00, 13:30-15:30, 15:30-17:30, 18:00-20:00, 20:00-22:00</li>
          <li>• Filtro por professor disponível no dropdown acima</li>
        </ul>
      </div>
    </div>
  );
}