'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  Download, 
  Upload, 
  Save, 
  X, 
  AlertTriangle,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HolidayForm } from './HolidayForm';
import { HolidayCalendarGrid } from './HolidayCalendarGrid';

// Types based on story schema
interface Holiday {
  id: string;
  date: string;
  name: string;
  year: number;
  is_national: boolean;
  created_at: string;
  updated_at: string;
}

interface HolidayManagerProps {
  year?: number;
  onHolidayChange?: (holidays: Holiday[]) => void;
  readonly?: boolean;
}

// Validation schema from story requirements
const HolidaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  year: z.number().int().min(2025).max(2030, 'Year must be between 2025 and 2030'),
  is_national: z.boolean().optional().default(true)
});

type HolidayFormData = z.infer<typeof HolidaySchema>;

export default function HolidayManager({ 
  year = new Date().getFullYear(), 
  onHolidayChange,
  readonly = false 
}: HolidayManagerProps) {
  // State management
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNational, setFilterNational] = useState<boolean | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<'month' | 'year'>('year');

  // Form management with React Hook Form + Zod
  const form = useForm<HolidayFormData>({
    resolver: zodResolver(HolidaySchema),
    defaultValues: {
      date: '',
      name: '',
      year: year,
      is_national: true
    }
  });

  // Load holidays
  const loadHolidays = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
      const response = await fetch(`/api/holidays?year=${year}`);
      
      if (!response.ok) {
        let errorMessage = 'Failed to load holidays';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      // Handle both direct array and wrapped response formats
      const holidaysData = responseData.data || responseData;
      setHolidays(Array.isArray(holidaysData) ? holidaysData : []);
      onHolidayChange?.(Array.isArray(holidaysData) ? holidaysData : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error loading holidays:', err);
      // Set empty array on error to prevent UI crashes
      setHolidays([]);
      onHolidayChange?.([]);
    } finally {
      setLoading(false);
    }
  }, [year, onHolidayChange]);

  // Create holiday
  const createHoliday = async (data: HolidayFormData) => {
    try {
      const response = await fetch('/api/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create holiday');
      }

      const newHoliday = await response.json();
      setHolidays(prev => [...prev, newHoliday]);
      setIsCreating(false);
      form.reset();
      onHolidayChange?.([...holidays, newHoliday]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create holiday');
    }
  };

  // Update holiday
  const updateHoliday = async (id: string, data: HolidayFormData) => {
    try {
      const response = await fetch(`/api/holidays/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update holiday');
      }

      const updatedHoliday = await response.json();
      setHolidays(prev => prev.map(h => h.id === id ? updatedHoliday : h));
      setIsEditing(false);
      setSelectedHoliday(null);
      form.reset();
      onHolidayChange?.(holidays.map(h => h.id === id ? updatedHoliday : h));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update holiday');
    }
  };

  // Delete holiday
  const deleteHoliday = async (id: string) => {
    try {
      const response = await fetch(`/api/holidays/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete holiday');
      }

      const updatedHolidays = holidays.filter(h => h.id !== id);
      setHolidays(updatedHolidays);
      setShowDeleteConfirm(null);
      onHolidayChange?.(updatedHolidays);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete holiday');
    }
  };

  // Bulk operations
  const exportHolidays = () => {
    const dataStr = JSON.stringify(holidays, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `holidays_${year}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importHolidays = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Validate imported data
        for (const holiday of importedData) {
          HolidaySchema.parse({
            date: holiday.date,
            name: holiday.name,
            year: holiday.year,
            is_national: holiday.is_national
          });
        }

        // Bulk create holidays
        const response = await fetch('/api/holidays/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ holidays: importedData })
        });

        if (!response.ok) {
          throw new Error('Failed to import holidays');
        }

        await loadHolidays();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to import holidays');
      }
    };
    reader.readAsText(file);
  };

  // Filter holidays
  const filteredHolidays = holidays.filter(holiday => {
    const matchesSearch = holiday.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterNational === null || holiday.is_national === filterNational;
    return matchesSearch && matchesFilter;
  });

  // Calendar grid generation is now handled by HolidayCalendarGrid component

  // Initialize
  useEffect(() => {
    loadHolidays();
  }, [loadHolidays]);

  // Form submission
  const onSubmit = (data: HolidayFormData) => {
    if (isEditing && selectedHoliday) {
      updateHoliday(selectedHoliday.id, data);
    } else {
      createHoliday(data);
    }
  };

  // Edit handler
  const handleEdit = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsEditing(true);
  };

  // Cancel handler
  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedHoliday(null);
  };

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center p-8"
        role="status"
        aria-live="polite"
        aria-label="Carregando feriados"
      >
        <div 
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          aria-hidden="true"
        ></div>
        <span className="ml-2" id="loading-text">Carregando feriados...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" role="main" aria-labelledby="holiday-manager-title">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 
            id="holiday-manager-title"
            className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <Calendar className="h-6 w-6" aria-hidden="true" />
            Gerenciamento de Feriados {year}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie feriados e datas especiais do calendário acadêmico
          </p>
        </div>
        
        {!readonly && (
          <div className="flex gap-2">
            <Button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Feriado
            </Button>
            <Button
              variant="outline"
              onClick={exportHolidays}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <label className="cursor-pointer">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4" />
                  Importar
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importHolidays}
                className="hidden"
              />
            </label>
          </div>
        )}
      </header>

      {/* Error Display */}
      {error && (
        <div 
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          role="alert"
          aria-live="assertive"
          aria-labelledby="error-title"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle 
              className="h-4 w-4 text-red-600 dark:text-red-400" 
              aria-hidden="true"
            />
            <span 
              id="error-title"
              className="text-red-800 dark:text-red-200 font-medium"
            >
              Erro:
            </span>
            <span className="text-red-800 dark:text-red-200">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto"
              aria-label="Fechar mensagem de erro"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <section aria-labelledby="filters-title">
        <h2 id="filters-title" className="sr-only">Filtros de pesquisa</h2>
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <label htmlFor="search-holidays" className="sr-only">
                Buscar feriados por nome
              </label>
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
                aria-hidden="true"
              />
              <input
                id="search-holidays"
                type="text"
                placeholder="Buscar feriados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-describedby="search-help"
              />
              <div id="search-help" className="sr-only">
                Digite o nome do feriado para filtrar a lista
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" aria-hidden="true" />
              <label htmlFor="filter-type" className="sr-only">
                Filtrar por tipo de feriado
              </label>
              <select
                id="filter-type"
                value={filterNational === null ? 'all' : filterNational.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilterNational(value === 'all' ? null : value === 'true');
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-describedby="filter-help"
              >
                <option value="all">Todos os tipos</option>
                <option value="true">Nacionais</option>
                <option value="false">Locais</option>
              </select>
              <div id="filter-help" className="sr-only">
                Selecione o tipo de feriado para filtrar
              </div>
            </div>

          <div className="flex items-center gap-2">
            <Button
              variant={calendarView === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCalendarView('month')}
            >
              Mês
            </Button>
            <Button
              variant={calendarView === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCalendarView('year')}
            >
              Ano
            </Button>
          </div>
        </div>
      </Card>
      </section>

      {/* Create/Edit Form */}
      {(isCreating || isEditing) && (
        <HolidayForm
          isEditing={isEditing}
          selectedHoliday={selectedHoliday}
          defaultYear={year}
          onSubmit={onSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Calendar View */}
      <HolidayCalendarGrid
        holidays={filteredHolidays}
        year={year}
        readonly={readonly}
        onEdit={handleEdit}
        onDelete={(holidayId) => setShowDeleteConfirm(holidayId)}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold">Confirmar Exclusão</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tem certeza que deseja excluir este feriado? Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteHoliday(showDeleteConfirm)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredHolidays.length} feriados encontrados
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredHolidays.filter(h => h.is_national).length} nacionais
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredHolidays.filter(h => !h.is_national).length} locais
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}