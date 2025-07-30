import type { Holiday } from '@/types/date-calculation';

/**
 * Brazilian holidays for 2025
 * Includes national holidays and SÃ£o Paulo regional holidays
 */
export const BRAZILIAN_HOLIDAYS_2025: Holiday[] = [
  // National holidays
  { date: '2025-01-01', name: 'ConfraternizaÃ§Ã£o Universal', type: 'national' },
  { date: '2025-04-18', name: 'Sexta-feira Santa', type: 'national' },
  { date: '2025-04-21', name: 'Tiradentes', type: 'national' },
  { date: '2025-05-01', name: 'Dia do Trabalhador', type: 'national' },
  { date: '2025-09-07', name: 'IndependÃªncia do Brasil', type: 'national' },
  { date: '2025-10-12', name: 'Nossa Senhora Aparecida', type: 'national' },
  { date: '2025-11-02', name: 'Finados', type: 'national' },
  { date: '2025-11-15', name: 'ProclamaÃ§Ã£o da RepÃºblica', type: 'national' },
  { date: '2025-12-25', name: 'Natal', type: 'national' },

  // Carnival (national)
  { date: '2025-03-03', name: 'Carnaval - Segunda-feira', type: 'national' },
  { date: '2025-03-04', name: 'Carnaval - TerÃ§a-feira', type: 'national' },

  // Corpus Christi (national)
  { date: '2025-06-19', name: 'Corpus Christi', type: 'national' },

  // SÃ£o Paulo regional holidays
  { date: '2025-01-25', name: 'AniversÃ¡rio de SÃ£o Paulo', type: 'regional' },
  { date: '2025-04-23', name: 'SÃ£o Jorge', type: 'regional' },
  { date: '2025-07-09', name: 'RevoluÃ§Ã£o Constitucionalista', type: 'regional' },
  { date: '2025-11-20', name: 'ConsciÃªncia Negra', type: 'regional' },
];

/**
 * Get all holidays for 2025
 */
export function getBrazilianHolidays2025(): Holiday[] {
  return BRAZILIAN_HOLIDAYS_2025;
}

/**
 * Get holidays by type
 */
export function getHolidaysByType(type: 'national' | 'regional'): Holiday[] {
  return BRAZILIAN_HOLIDAYS_2025.filter((holiday: any) => holiday.type === type);
}

/**
 * Validate holiday data structure
 */
export function validateHolidayData(holidays: Holiday[]): boolean {
  return holidays.every(holiday => {
    // Check if date is valid ISO format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(holiday.date)) return false;

    // Check if date is actually valid
    const date = new Date(holiday.date);
    if (isNaN(date.getTime())) return false;

    // Check if name exists
    if (!holiday.name || holiday.name.trim() === '') return false;

    // Check if type is valid
    if (holiday.type !== 'national' && holiday.type !== 'regional') return false;

    return true;
  });
}