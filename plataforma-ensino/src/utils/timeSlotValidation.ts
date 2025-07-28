import { z } from 'zod';

// Validação para formato de tempo (HH:MM)
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const timeSlotValidation = {
  // Schema para validação de tempo individual
  timeSchema: z.string()
    .regex(timeRegex, 'Formato de tempo inválido. Use HH:MM (ex: 08:00)')
    .refine((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    }, 'Horário deve estar entre 00:00 e 23:59'),

  // Schema para dia da semana
  dayOfWeekSchema: z.number()
    .int('Dia da semana deve ser um número inteiro')
    .min(0, 'Dia da semana deve ser entre 0 (Domingo) e 6 (Sábado)')
    .max(6, 'Dia da semana deve ser entre 0 (Domingo) e 6 (Sábado)'),

  // Schema para horário padrão do sistema
  defaultTimeSlotSchema: z.object({
    startTime: z.string().regex(timeRegex, 'Formato de startTime inválido'),
    endTime: z.string().regex(timeRegex, 'Formato de endTime inválido'),
  }).refine((data) => {
    const startMinutes = timeToMinutes(data.startTime);
    const endMinutes = timeToMinutes(data.endTime);
    return startMinutes < endMinutes;
  }, {
    message: 'Horário de início deve ser anterior ao horário de fim',
    path: ['endTime']
  }).refine((data) => {
    const startMinutes = timeToMinutes(data.startTime);
    const endMinutes = timeToMinutes(data.endTime);
    const duration = endMinutes - startMinutes;
    return duration >= 30; // Mínimo 30 minutos
  }, {
    message: 'Duração mínima de 30 minutos entre início e fim',
    path: ['endTime']
  }),

  // Schema para criação de disponibilidade de professor
  teacherAvailabilitySchema: z.object({
    teacherId: z.string().uuid('ID do professor deve ser um UUID válido'),
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(timeRegex),
    endTime: z.string().regex(timeRegex),
    maxStudents: z.number().int().min(1, 'Mínimo 1 aluno').max(10, 'Máximo 10 alunos'),
    isActive: z.boolean().default(true)
  }).refine((data) => {
    const startMinutes = timeToMinutes(data.startTime);
    const endMinutes = timeToMinutes(data.endTime);
    return startMinutes < endMinutes;
  }, {
    message: 'Horário de início deve ser anterior ao horário de fim',
    path: ['endTime']
  }),

  // Schema para aplicar horários padrões
  applyDefaultSlotsSchema: z.object({
    teacherId: z.string().uuid('ID do professor deve ser um UUID válido'),
    maxStudents: z.number().int().min(1).max(10).default(3),
    daysOfWeek: z.array(z.number().int().min(1).max(6)).optional().default([1, 2, 3, 4, 5, 6]), // Segunda a Sábado
    overwriteExisting: z.boolean().default(false)
  }),

  // Schema para edição de slot individual
  updateTimeSlotSchema: z.object({
    id: z.string().uuid('ID do slot deve ser um UUID válido'),
    startTime: z.string().regex(timeRegex).optional(),
    endTime: z.string().regex(timeRegex).optional(),
    maxStudents: z.number().int().min(1).max(10).optional(),
    isActive: z.boolean().optional()
  }).refine((data) => {
    // Se ambos os tempos foram fornecidos, validar ordem
    if (data.startTime && data.endTime) {
      const startMinutes = timeToMinutes(data.startTime);
      const endMinutes = timeToMinutes(data.endTime);
      return startMinutes < endMinutes;
    }
    return true;
  }, {
    message: 'Horário de início deve ser anterior ao horário de fim',
    path: ['endTime']
  }),

  // Schema para busca/filtros
  timeSlotFilterSchema: z.object({
    teacherId: z.string().uuid().optional(),
    dayOfWeek: z.number().int().min(0).max(6).optional(),
    isActive: z.boolean().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
  })
};

// Funções utilitárias
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function calculateDuration(startTime: string, endTime: string): number {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

// Constantes para horários padrões
export const DEFAULT_TIME_SLOTS = [
  { startTime: '08:00', endTime: '10:00' },
  { startTime: '10:00', endTime: '12:00' },
  { startTime: '13:30', endTime: '15:30' },
  { startTime: '15:30', endTime: '17:30' },
  { startTime: '18:00', endTime: '20:00' },
  { startTime: '20:00', endTime: '22:00' }
] as const;

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo', short: 'Dom', workingDay: false },
  { value: 1, label: 'Segunda-feira', short: 'Seg', workingDay: true },
  { value: 2, label: 'Terça-feira', short: 'Ter', workingDay: true },
  { value: 3, label: 'Quarta-feira', short: 'Qua', workingDay: true },
  { value: 4, label: 'Quinta-feira', short: 'Qui', workingDay: true },
  { value: 5, label: 'Sexta-feira', short: 'Sex', workingDay: true },
  { value: 6, label: 'Sábado', short: 'Sáb', workingDay: true }
] as const;

export const WORKING_DAYS = DAYS_OF_WEEK.filter((day: any) => day.workingDay);

// Função para validar conflitos de horários
export function hasTimeConflict(
  slot1: { startTime: string; endTime: string },
  slot2: { startTime: string; endTime: string }
): boolean {
  const start1 = timeToMinutes(slot1.startTime);
  const end1 = timeToMinutes(slot1.endTime);
  const start2 = timeToMinutes(slot2.startTime);
  const end2 = timeToMinutes(slot2.endTime);

  // Conflito se um slot começa antes do outro terminar
  return (start1 < end2) && (start2 < end1);
}

// Função para validar horário de funcionamento
export function isWithinWorkingHours(startTime: string, endTime: string): boolean {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  
  // Horário de funcionamento: 08:00 às 22:00
  const workingStart = timeToMinutes('08:00');
  const workingEnd = timeToMinutes('22:00');
  
  return start >= workingStart && end <= workingEnd;
}

export type TimeSlotValidation = typeof timeSlotValidation;
export type DefaultTimeSlot = typeof DEFAULT_TIME_SLOTS[number];
export type DayOfWeek = typeof DAYS_OF_WEEK[number];