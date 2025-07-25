'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BlurFade } from '@/components/ui/blur-fade';
import { MagicCard } from '@/components/ui/magic-card';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { RefreshCw, Users, Calendar, Clock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompletionIndicatorCompact } from './CompletionIndicator';
import { calculateCompletionStatus, getCompletionStatusForClass } from '@/utils/completionStatus';
import { formatDateISO } from '@/utils/dateCalculations';
import type { StudentWithCompletion } from '@/types/completion-status';

interface CalendarData extends StudentWithCompletion {}

interface EnhancedCalendarViewProps {
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

const SLOT_COLORS = [
  'from-purple-500/20 to-pink-500/20',
  'from-blue-500/20 to-cyan-500/20',
  'from-green-500/20 to-emerald-500/20',
  'from-orange-500/20 to-red-500/20',
  'from-indigo-500/20 to-purple-500/20',
  'from-pink-500/20 to-rose-500/20'
];

export default function EnhancedCalendarView({ teacherId }: EnhancedCalendarViewProps) {
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const supabase = createClient();

  const fetchCalendarData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
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
      const rawData = result.data || [];
      
      // Process completion status for each calendar item
      const dataWithCompletionStatus = rawData.map((item: any) => {
        let completionStatus = { type: 'none', label: '', daysRemaining: 0, isLastClass: false, isWithinOneMonth: false };
        
        if (item.endDate) {
          // For now, calculate basic completion status
          // Last class detection will be handled per calendar cell
          completionStatus = calculateCompletionStatus(item.endDate);
        }
        
        return {
          ...item,
          completionStatus
        };
      });
      
      setCalendarData(dataWithCompletionStatus);

    } catch (err) {
      console.error('Error fetching calendar:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (showRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [teacherId]); // eslint-disable-line react-hooks/exhaustive-deps

  const getStudentsForSlot = (dayIndex: number, timeSlot: string) => {
    return calendarData.filter(
      item => item.dayOfWeek === dayIndex + 1 && item.slotLabel === timeSlot
    );
  };

  // Helper function to get current week dates and calculate completion status for specific class dates
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Adjust for Sunday
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    
    const weekDates = [];
    for (let i = 0; i < 6; i++) { // Monday to Saturday
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(formatDateISO(date));
    }
    return weekDates;
  };

  const currentWeekDates = getWeekDates();

  const getStudentsWithCompletionForDate = (dayIndex: number, timeSlot: string) => {
    const students = getStudentsForSlot(dayIndex, timeSlot);
    const classDate = currentWeekDates[dayIndex];
    
    return students.map(student => {
      if (!student.endDate) {
        return student;
      }
      
      // Calculate completion status for this specific class date
      const completionStatusForClass = getCompletionStatusForClass({
        endDate: student.endDate,
        classDate
      });
      
      return {
        ...student,
        completionStatus: completionStatusForClass
      };
    });
  };

  const stats = useMemo(() => {
    const studentsWithOneMonth = calendarData.filter(item => 
      item.completionStatus?.type === 'one_month_remaining'
    ).length;
    
    const studentsWithLastClass = calendarData.filter(item => 
      item.completionStatus?.type === 'last_class'
    ).length;
    
    return {
      totalClasses: calendarData.length,
      occupiedSlots: new Set(calendarData.map(item => `${item.dayOfWeek}-${item.slotLabel}`)).size,
      uniqueStudents: new Set(calendarData.map(item => item.studentEmail)).size,
      studentsNearCompletion: studentsWithOneMonth + studentsWithLastClass,
      studentsWithOneMonth,
      studentsWithLastClass
    };
  }, [calendarData]);

  if (loading) {
    return (
      <div className="p-6">
        <BlurFade delay={0.1}>
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-3">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              <div className="text-lg text-gray-600 dark:text-gray-300">Carregando calendário...</div>
            </div>
          </div>
        </BlurFade>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <BlurFade delay={0.1}>
          <MagicCard className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full">
                <RefreshCw className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">Erro ao carregar calendário</h3>
                <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
              </div>
            </div>
            <RainbowButton 
              onClick={() => fetchCalendarData()}
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </RainbowButton>
          </MagicCard>
        </BlurFade>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Calendário de Aulas
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Visualize e gerencie os horários das aulas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ShimmerButton
              onClick={() => fetchCalendarData(true)}
              disabled={refreshing}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </ShimmerButton>
          </div>
        </div>
      </BlurFade>

      {/* Statistics Cards */}
      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MagicCard className="group">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-all duration-300 group-hover:shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total de Aulas</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalClasses}</div>
                </div>
              </div>
            </div>
          </MagicCard>

          <MagicCard className="group">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800 rounded-lg p-4 transition-all duration-300 group-hover:shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Horários Ocupados</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.occupiedSlots}</div>
                </div>
              </div>
            </div>
          </MagicCard>

          <MagicCard className="group">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800 rounded-lg p-4 transition-all duration-300 group-hover:shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Estudantes Únicos</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.uniqueStudents}</div>
                </div>
              </div>
            </div>
          </MagicCard>

          <MagicCard className="group">
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4 transition-all duration-300 group-hover:shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Próximos ao Fim</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.studentsNearCompletion}</div>
                </div>
              </div>
            </div>
          </MagicCard>
        </div>
      </BlurFade>

      {/* Calendar Grid */}
      <BlurFade delay={0.3}>
        <MagicCard className="overflow-hidden">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-4 font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                    Horário
                  </div>
                  {DAYS.map((day, index) => (
                    <div key={index} className="p-4 text-center font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time slots */}
                {TIME_SLOTS.map((timeSlot, timeIndex) => (
                  <BlurFade key={timeIndex} delay={0.4 + (timeIndex * 0.1)}>
                    <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <div className={cn(
                        "p-4 font-medium bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 min-h-[120px] flex items-center",
                        `bg-gradient-to-r ${SLOT_COLORS[timeIndex]}`
                      )}>
                        <div className="text-sm whitespace-nowrap">
                          {timeSlot}
                        </div>
                      </div>
                      
                      {DAYS.map((day, dayIndex) => {
                        const students = getStudentsWithCompletionForDate(dayIndex, timeSlot);
                        const isOccupied = students.length > 0;
                        const isFull = students.length >= 3;
                        
                        return (
                          <div key={dayIndex} className="p-3 border-r border-gray-200 dark:border-gray-700 last:border-r-0 min-h-[120px] relative group">
                            {isOccupied ? (
                              <div className="space-y-2">
                                {students.slice(0, 3).map((student, studentIndex) => (
                                  <BlurFade key={studentIndex} delay={0.5 + (studentIndex * 0.1)}>
                                    <MagicCard className="group">
                                      <div className={cn(
                                        "p-2 rounded-lg text-xs border transition-all duration-200",
                                        "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50",
                                        "border-blue-200 dark:border-blue-800",
                                        "hover:shadow-md hover:scale-105"
                                      )}>
                                        <div className="flex items-center space-x-1 mb-1">
                                          <Users className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                          <div className="font-medium text-blue-900 dark:text-blue-100 truncate" 
                                               title={student.studentName || student.studentEmail}>
                                            {student.studentName || student.studentEmail}
                                          </div>
                                        </div>
                                        {student.completionStatus && student.completionStatus.type !== 'none' && (
                                          <div className="mb-1">
                                            <CompletionIndicatorCompact
                                              type={student.completionStatus.type}
                                              label={student.completionStatus.label}
                                              daysRemaining={student.completionStatus.daysRemaining}
                                            />
                                          </div>
                                        )}
                                        <div className="flex items-center space-x-1">
                                          <BookOpen className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                          <div className="text-blue-600 dark:text-blue-300 truncate text-xs" 
                                               title={student.courseName}>
                                            {student.courseName}
                                          </div>
                                        </div>
                                      </div>
                                    </MagicCard>
                                  </BlurFade>
                                ))}
                                
                                <div className={cn(
                                  "text-xs text-center py-1 px-2 rounded-full",
                                  isFull 
                                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" 
                                    : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                )}>
                                  {students.length}/3 alunos
                                </div>
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center">
                                <div className="text-gray-400 dark:text-gray-500 text-sm text-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg w-full transition-all duration-200 group-hover:border-gray-300 dark:group-hover:border-gray-600 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50">
                                  <Calendar className="h-6 w-6 mx-auto mb-2 opacity-50" />
                                  <div>Disponível</div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </BlurFade>
                ))}
              </div>
            </div>
          </div>
        </MagicCard>
      </BlurFade>

      {/* Legend */}
      <BlurFade delay={0.6}>
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center">
            <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded mr-2">
              <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            Informações do Sistema
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span>Limite máximo: 3 alunos por horário</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>Horários disponíveis: Segunda a Sábado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <span>6 slots diários disponíveis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
              <span>Filtro por professor disponível</span>
            </div>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}