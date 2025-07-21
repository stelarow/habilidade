'use client';

import { useState } from 'react';
import EnhancedCalendarView from '@/components/calendar/EnhancedCalendarView';
import { BlurFade } from '@/components/ui/blur-fade';
import { MagicCard } from '@/components/ui/magic-card';
import { User, Calendar, ChevronDown } from 'lucide-react';

interface Teacher {
  id: string;
  email: string;
  full_name?: string;
}

interface EnhancedAdminCalendarInterfaceProps {
  teachers: Teacher[];
}

export function EnhancedAdminCalendarInterface({ teachers }: EnhancedAdminCalendarInterfaceProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Visualização do Calendário
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Administre e monitore os horários das aulas
            </p>
          </div>
          
          <MagicCard className="group">
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1 transition-all duration-300 group-hover:shadow-lg">
              <label htmlFor="teacher-select" className="sr-only">
                Selecionar professor
              </label>
              <div className="flex items-center space-x-2 px-3 py-2">
                <User className="h-4 w-4 text-gray-500" />
                <select
                  id="teacher-select"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="block bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-gray-700 dark:text-gray-200 min-w-[200px] appearance-none cursor-pointer"
                >
                  <option value="">Todos os professores</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.full_name || teacher.email}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </MagicCard>
        </div>
      </BlurFade>

      {/* Enhanced Calendar Component */}
      <BlurFade delay={0.2}>
        <EnhancedCalendarView teacherId={selectedTeacher || undefined} />
      </BlurFade>

      {/* Additional Admin Information */}
      <BlurFade delay={0.4}>
        <MagicCard>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">
                Informações Administrativas
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-indigo-800 dark:text-indigo-200">
                  <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                  <span>Limite máximo: 3 alunos por horário</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-indigo-800 dark:text-indigo-200">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>Horários disponíveis: Segunda a Sábado</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-indigo-800 dark:text-indigo-200">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span>6 slots diários: 08:00-22:00</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-indigo-800 dark:text-indigo-200">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <span>Filtro por professor disponível acima</span>
                </div>
              </div>
            </div>
          </div>
        </MagicCard>
      </BlurFade>
    </div>
  );
}