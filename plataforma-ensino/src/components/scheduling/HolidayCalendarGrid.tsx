'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Holiday {
  id: string;
  date: string;
  name: string;
  year: number;
  is_national: boolean;
  created_at: string;
  updated_at: string;
}

interface HolidayCalendarGridProps {
  holidays: Holiday[];
  year: number;
  readonly?: boolean;
  onEdit: (holiday: Holiday) => void;
  onDelete: (holidayId: string) => void;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const HolidayCalendarGrid = React.memo<HolidayCalendarGridProps>(({
  holidays,
  year,
  readonly = false,
  onEdit,
  onDelete
}) => {
  // Generate calendar grid
  const generateCalendarGrid = () => {
    return Array.from({ length: 12 }, (_, month) => {
      const monthHolidays = holidays.filter((holiday: any) => {
        // Safety check for valid holiday object
        if (!holiday || !holiday.date) return false;
        
        try {
          const holidayDate = new Date(holiday.date);
          return !isNaN(holidayDate.getTime()) && 
                 holidayDate.getMonth() === month && 
                 holidayDate.getFullYear() === year;
        } catch {
          return false;
        }
      });

      return {
        month: month + 1,
        name: MONTH_NAMES[month],
        holidays: monthHolidays
      };
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {generateCalendarGrid().map(({ month, name, holidays: monthHolidays }) => (
        <Card key={month} className="p-4">
          <h3 className="font-semibold text-lg mb-3 text-center border-b pb-2">
            {name}
          </h3>
          
          <div className="space-y-2">
            {monthHolidays.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Nenhum feriado
              </p>
            ) : (
              monthHolidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border-l-4 border-primary"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{holiday.name || 'Nome não disponível'}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {holiday.date ? new Date(holiday.date).toLocaleDateString('pt-BR') : 'Data inválida'}
                      </p>
                      {holiday.is_national && (
                        <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full mt-1">
                          Nacional
                        </span>
                      )}
                    </div>
                    
                    {!readonly && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(holiday)}
                          className="h-6 w-6 p-0"
                          aria-label={`Editar feriado ${holiday.name || 'sem nome'}`}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(holiday.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          aria-label={`Excluir feriado ${holiday.name || 'sem nome'}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      ))}
    </div>
  );
});

HolidayCalendarGrid.displayName = 'HolidayCalendarGrid';