'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Validation schema
const HolidaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  year: z.number().int().min(2025).max(2030, 'Year must be between 2025 and 2030'),
  is_national: z.boolean().optional().default(true)
});

export type HolidayFormData = z.infer<typeof HolidaySchema>;

interface Holiday {
  id: string;
  date: string;
  name: string;
  year: number;
  is_national: boolean;
  created_at: string;
  updated_at: string;
}

interface HolidayFormProps {
  isEditing: boolean;
  selectedHoliday: Holiday | null;
  defaultYear: number;
  onSubmit: (data: HolidayFormData) => void;
  onCancel: () => void;
}

export const HolidayForm = React.memo<HolidayFormProps>(({
  isEditing,
  selectedHoliday,
  defaultYear,
  onSubmit,
  onCancel
}) => {
  const form = useForm<HolidayFormData>({
    resolver: zodResolver(HolidaySchema),
    defaultValues: {
      date: selectedHoliday?.date || '',
      name: selectedHoliday?.name || '',
      year: selectedHoliday?.year || defaultYear,
      is_national: selectedHoliday?.is_national ?? true
    }
  });

  React.useEffect(() => {
    if (selectedHoliday) {
      form.reset({
        date: selectedHoliday.date,
        name: selectedHoliday.name,
        year: selectedHoliday.year,
        is_national: selectedHoliday.is_national
      });
    } else {
      form.reset({
        date: '',
        name: '',
        year: defaultYear,
        is_national: true
      });
    }
  }, [selectedHoliday, defaultYear, form]);

  const handleSubmit = (data: HolidayFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {isEditing ? 'Editar Feriado' : 'Novo Feriado'}
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          aria-label="Fechar formulário"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="holiday-name"
              className="block text-sm font-medium mb-2"
            >
              Nome do Feriado *
            </label>
            <input
              id="holiday-name"
              {...form.register('name')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ex: Natal, Ano Novo"
              aria-describedby="name-error"
            />
            {form.formState.errors.name && (
              <p id="name-error" className="text-red-600 text-sm mt-1" role="alert">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label 
              htmlFor="holiday-date"
              className="block text-sm font-medium mb-2"
            >
              Data *
            </label>
            <input
              id="holiday-date"
              {...form.register('date')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-describedby="date-error"
            />
            {form.formState.errors.date && (
              <p id="date-error" className="text-red-600 text-sm mt-1" role="alert">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          <div>
            <label 
              htmlFor="holiday-year"
              className="block text-sm font-medium mb-2"
            >
              Ano *
            </label>
            <input
              id="holiday-year"
              {...form.register('year', { valueAsNumber: true })}
              type="number"
              min="2025"
              max="2030"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-describedby="year-error"
            />
            {form.formState.errors.year && (
              <p id="year-error" className="text-red-600 text-sm mt-1" role="alert">
                {form.formState.errors.year.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              {...form.register('is_national')}
              type="checkbox"
              id="is_national"
              className="rounded border-gray-300 focus:ring-primary"
            />
            <label htmlFor="is_national" className="text-sm font-medium">
              Feriado Nacional
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Card>
  );
});

HolidayForm.displayName = 'HolidayForm';