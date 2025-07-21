'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CalendarData {
  id: string;
  teacherId: string;
  studentEmail: string;
  studentName?: string;
  courseName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotLabel: string;
  startDate?: string;
  endDate?: string;
}

interface CalendarViewProps {
  teacherId?: string;
}

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const TIME_SLOTS = [
  '08:00 às 10:00',
  '10:00 às 12:00', 
  '13:30 às 15:30',
  '15:30 às 17:30',
  '18:00 às 20:00',
  '20:00 às 22:00'
];

export default function CalendarView({ teacherId }: CalendarViewProps) {
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchCalendarData();
  }, [teacherId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = new URL('/api/calendar', window.location.origin);
      if (teacherId) {
        url.searchParams.set('teacherId', teacherId);
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch calendar data');
      }

      const result = await response.json();
      setCalendarData(result.data || []);

    } catch (err) {
      console.error('Error fetching calendar:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getStudentsForSlot = (dayIndex: number, timeSlot: string) => {
    return calendarData.filter(
      item => item.dayOfWeek === dayIndex + 1 && item.slotLabel === timeSlot
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Carregando calendário...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-md">
        <p className="text-red-600 mb-2">Erro: {error}</p>
        <button 
          onClick={fetchCalendarData}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Calendário de Aulas
        </h2>
        <button
          onClick={fetchCalendarData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Atualizar
        </button>
      </div>

      {/* Grid simples do calendário */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-3 bg-gray-50 text-left font-semibold">
                Horário
              </th>
              {DAYS.map((day, index) => (
                <th key={index} className="border border-gray-300 p-3 bg-gray-50 text-center font-semibold min-w-[150px]">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((timeSlot, timeIndex) => (
              <tr key={timeIndex}>
                <td className="border border-gray-300 p-3 font-medium bg-gray-50 whitespace-nowrap">
                  {timeSlot}
                </td>
                {DAYS.map((day, dayIndex) => {
                  const students = getStudentsForSlot(dayIndex, timeSlot);
                  return (
                    <td key={dayIndex} className="border border-gray-300 p-2 align-top h-24 relative">
                      <div className="space-y-1">
                        {students.map((student, studentIndex) => (
                          <div
                            key={studentIndex}
                            className="bg-blue-100 border border-blue-200 rounded p-1 text-xs"
                          >
                            <div className="font-medium text-blue-900 truncate" title={student.studentName || student.studentEmail}>
                              {student.studentName || student.studentEmail}
                            </div>
                            <div className="text-blue-600 truncate" title={student.courseName}>
                              {student.courseName}
                            </div>
                          </div>
                        ))}
                        {students.length === 0 && (
                          <div className="text-gray-400 text-xs p-1">
                            Disponível
                          </div>
                        )}
                        {students.length > 0 && (
                          <div className="text-xs text-gray-500 text-center">
                            {students.length}/3 alunos
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumo de estatísticas */}
      {calendarData.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <div className="text-sm text-gray-500">Total de Aulas</div>
            <div className="text-2xl font-bold text-gray-900">{calendarData.length}</div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-sm text-gray-500">Horários Ocupados</div>
            <div className="text-2xl font-bold text-green-600">
              {new Set(calendarData.map(item => `${item.dayOfWeek}-${item.slotLabel}`)).size}
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-sm text-gray-500">Estudantes Únicos</div>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(calendarData.map(item => item.studentEmail)).size}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}