'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Users, 
  Clock, 
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
  Filter,
  Calendar,
  Settings,
  BarChart3,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Types based on story requirements
interface Teacher {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  bio?: string;
  expertise: string[];
  rating: number;
  total_reviews: number;
}

interface TeacherAvailability {
  id: string;
  teacher_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_students: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  teacher?: Teacher;
}

interface AdminTeacherAvailabilityProps {
  filters?: {
    teacherId?: string;
    dateRange?: { start: Date; end: Date };
  };
  onBulkUpdate?: (updates: BulkAvailabilityUpdate[]) => void;
}

interface BulkAvailabilityUpdate {
  teacher_id: string;
  availability_updates: Partial<TeacherAvailability>[];
}

interface AvailabilityConflict {
  teacher_id: string;
  conflicts: {
    existing_slot: TeacherAvailability;
    conflicting_slot: TeacherAvailability;
    overlap_minutes: number;
  }[];
}

interface AvailabilityChangeRequest {
  id: string;
  teacher_id: string;
  teacher_name: string;
  teacher_email: string;
  change_type: 'create' | 'update' | 'delete';
  requested_changes: any;
  original_data?: any;
  status: 'pending' | 'approved' | 'rejected';
  requested_by_name: string;
  requested_by_email: string;
  created_at: string;
  change_summary: string;
}

// Validation schema from story requirements  
const AvailabilitySchema = z.object({
  teacher_id: z.string().uuid('Invalid teacher ID'),
  day_of_week: z.number().int().min(0).max(6, 'Day must be 0-6 (Sunday-Saturday)'),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  max_students: z.number().int().min(1).max(50, 'Max students must be between 1 and 50'),
  is_active: z.boolean().optional().default(true)
}).refine(data => {
  const startTime = new Date(`2000-01-01T${data.start_time}:00`);
  const endTime = new Date(`2000-01-01T${data.end_time}:00`);
  return startTime < endTime;
}, {
  message: 'Start time must be before end time',
  path: ['end_time']
});

type AvailabilityFormData = z.infer<typeof AvailabilitySchema>;

const DAYS_OF_WEEK = [
  'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
];

export default function AdminTeacherAvailability({ 
  filters,
  onBulkUpdate 
}: AdminTeacherAvailabilityProps) {
  // State management
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [availabilities, setAvailabilities] = useState<TeacherAvailability[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<TeacherAvailability | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState<number | null>(null);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [showConflicts, setShowConflicts] = useState(false);
  const [conflicts, setConflicts] = useState<AvailabilityConflict[]>([]);
  const [bulkOperations, setBulkOperations] = useState<'none' | 'update' | 'delete'>('none');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showApprovals, setShowApprovals] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<AvailabilityChangeRequest[]>([]);
  const [approvalLoading, setApprovalLoading] = useState(false);

  // Form management with React Hook Form + Zod
  const form = useForm<AvailabilityFormData>({
    resolver: zodResolver(AvailabilitySchema),
    defaultValues: {
      teacher_id: '',
      day_of_week: 1, // Monday
      start_time: '09:00',
      end_time: '10:00',
      max_students: 10,
      is_active: true
    }
  });

  // Load teachers
  const loadTeachers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/teachers');
      if (!response.ok) throw new Error('Failed to load teachers');
      
      const data = await response.json();
      setTeachers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teachers');
    }
  }, []);

  // Load pending approval requests
  const loadPendingRequests = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/availability-approvals');
      if (!response.ok) throw new Error('Failed to load pending requests');
      
      const data = await response.json();
      setPendingRequests(data.data || []);
    } catch (err) {
      console.error('Failed to load pending requests:', err);
    }
  }, []);

  // Load availabilities
  const loadAvailabilities = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/admin/teacher-availability';
      const params = new URLSearchParams();
      
      if (filters?.teacherId) {
        params.append('teacherId', filters.teacherId);
      }
      
      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start.toISOString().split('T')[0]);
        params.append('endDate', filters.dateRange.end.toISOString().split('T')[0]);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load availabilities');
      
      const data = await response.json();
      setAvailabilities(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load availabilities');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Detect conflicts
  const detectConflicts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/teacher-availability/conflicts');
      if (!response.ok) throw new Error('Failed to detect conflicts');
      
      const data = await response.json();
      setConflicts(data.data || []);
    } catch (err) {
      console.error('Failed to detect conflicts:', err);
    }
  }, []);

  // Create availability
  const createAvailability = async (data: AvailabilityFormData) => {
    try {
      const response = await fetch('/api/admin/teacher-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create availability');
      }

      const newAvailability = await response.json();
      setAvailabilities(prev => [...prev, newAvailability.data]);
      setIsCreating(false);
      form.reset();
      await detectConflicts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create availability');
    }
  };

  // Update availability
  const updateAvailability = async (id: string, data: Partial<AvailabilityFormData>) => {
    try {
      const response = await fetch(`/api/admin/teacher-availability/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update availability');
      }

      const updatedAvailability = await response.json();
      setAvailabilities(prev => 
        prev.map((a: any) => a.id === id ? updatedAvailability.data : a)
      );
      setIsEditing(false);
      setSelectedAvailability(null);
      form.reset();
      await detectConflicts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update availability');
    }
  };

  // Delete availability
  const deleteAvailability = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/teacher-availability/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete availability');
      }

      setAvailabilities(prev => prev.filter((a: any) => a.id !== id));
      await detectConflicts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete availability');
    }
  };

  // Bulk operations
  const performBulkUpdate = async () => {
    if (selectedSlots.length === 0) return;
    
    try {
      const updates = selectedSlots.map((slotId: any) => {
        const slot = availabilities.find((a: any) => a.id === slotId);
        return {
          id: slotId,
          teacher_id: slot?.teacher_id || '',
          is_active: bulkOperations === 'update' ? true : false
        };
      });

      const response = await fetch('/api/admin/teacher-availability/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (!response.ok) throw new Error('Bulk operation failed');

      await loadAvailabilities();
      setSelectedSlots([]);
      setBulkOperations('none');
      await detectConflicts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk operation failed');
    }
  };

  const performBulkDelete = async () => {
    if (selectedSlots.length === 0) return;
    
    try {
      const response = await fetch('/api/admin/teacher-availability/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedSlots })
      });

      if (!response.ok) throw new Error('Bulk delete failed');

      await loadAvailabilities();
      setSelectedSlots([]);
      setBulkOperations('none');
      await detectConflicts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk delete failed');
    }
  };

  // Approve availability request
  const approveRequest = async (requestId: string) => {
    try {
      setApprovalLoading(true);
      const response = await fetch(`/api/admin/availability-approvals/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to approve request');

      await loadPendingRequests();
      await loadAvailabilities();
      await detectConflicts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve request');
    } finally {
      setApprovalLoading(false);
    }
  };

  // Reject availability request
  const rejectRequest = async (requestId: string, adminNotes?: string) => {
    try {
      setApprovalLoading(true);
      const response = await fetch(`/api/admin/availability-approvals/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNotes })
      });

      if (!response.ok) throw new Error('Failed to reject request');

      await loadPendingRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject request');
    } finally {
      setApprovalLoading(false);
    }
  };

  // Export availabilities
  const exportAvailabilities = () => {
    const dataStr = JSON.stringify(filteredAvailabilities, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `teacher_availability_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Filter availabilities
  const filteredAvailabilities = availabilities.filter((availability: any) => {
    const teacher = teachers.find((t: any) => t.id === availability.teacher_id);
    const matchesSearch = !searchTerm || 
      teacher?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDay = filterDay === null || availability.day_of_week === filterDay;
    const matchesActive = filterActive === null || availability.is_active === filterActive;
    
    return matchesSearch && matchesDay && matchesActive;
  });

  // Group availabilities by teacher
  const groupedAvailabilities = teachers.map((teacher: any) => ({
    teacher,
    availabilities: filteredAvailabilities.filter((a: any) => a.teacher_id === teacher.id)
  })).filter((group: any) => group.availabilities.length > 0 || !searchTerm);

  // Initialize
  useEffect(() => {
    loadTeachers();
    loadAvailabilities();
    detectConflicts();
    loadPendingRequests();
  }, [loadTeachers, loadAvailabilities, detectConflicts, loadPendingRequests]);

  // Form submission
  const onSubmit = (data: AvailabilityFormData) => {
    if (isEditing && selectedAvailability) {
      updateAvailability(selectedAvailability.id, data);
    } else {
      createAvailability(data);
    }
  };

  // Edit handler
  const handleEdit = (availability: TeacherAvailability) => {
    setSelectedAvailability(availability);
    setIsEditing(true);
    form.reset({
      teacher_id: availability.teacher_id,
      day_of_week: availability.day_of_week,
      start_time: availability.start_time,
      end_time: availability.end_time,
      max_students: availability.max_students,
      is_active: availability.is_active
    });
  };

  // Cancel handler
  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedAvailability(null);
    form.reset();
  };

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center p-8"
        role="status"
        aria-live="polite"
        aria-label="Carregando disponibilidades"
      >
        <div 
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          aria-hidden="true"
        ></div>
        <span className="ml-2">Carregando disponibilidades...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" role="main" aria-labelledby="availability-manager-title">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 
            id="availability-manager-title"
            className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <Users className="h-6 w-6" aria-hidden="true" />
            Gerenciamento de Disponibilidade de Professores
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie e supervisione a disponibilidade de horários dos professores
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => detectConflicts()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Detectar Conflitos
          </Button>
          <Button
            onClick={() => setShowApprovals(!showApprovals)}
            variant="outline"
            className="flex items-center gap-2 relative"
          >
            <Settings className="h-4 w-4" />
            Aprovações
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </Button>
          <Button
            onClick={() => setShowAnalytics(!showAnalytics)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Disponibilidade
          </Button>
        </div>
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

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-yellow-800 dark:text-yellow-200">
                {conflicts.length} conflito(s) de horário detectado(s)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConflicts(!showConflicts)}
            >
              {showConflicts ? 'Ocultar' : 'Ver Conflitos'}
            </Button>
          </div>
          
          {showConflicts && (
            <div className="mt-4 space-y-2">
              {conflicts.map((conflict, index) => {
                const teacher = teachers.find((t: any) => t.id === conflict.teacher_id);
                return (
                  <div key={index} className="bg-yellow-100 dark:bg-yellow-900/40 rounded p-3">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                      {teacher?.full_name}
                    </h4>
                    {conflict.conflicts.map((c, ci) => (
                      <p key={ci} className="text-sm text-yellow-800 dark:text-yellow-200">
                        Conflito: {DAYS_OF_WEEK[c.existing_slot.day_of_week]} {c.existing_slot.start_time}-{c.existing_slot.end_time} 
                        vs {c.conflicting_slot.start_time}-{c.conflicting_slot.end_time} 
                        ({c.overlap_minutes} min sobreposição)
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Filters and Controls */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <label htmlFor="search-teachers" className="sr-only">
              Buscar professores por nome ou email
            </label>
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
              aria-hidden="true"
            />
            <input
              id="search-teachers"
              type="text"
              placeholder="Buscar professores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-describedby="search-help"
            />
            <div id="search-help" className="sr-only">
              Digite o nome ou email do professor para filtrar a lista
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterDay === null ? 'all' : filterDay.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setFilterDay(value === 'all' ? null : parseInt(value));
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">Todos os dias</option>
              {DAYS_OF_WEEK.map((day, index) => (
                <option key={index} value={index}>{day}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterActive === null ? 'all' : filterActive.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setFilterActive(value === 'all' ? null : value === 'true');
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">Todos os status</option>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>

          <Button
            onClick={exportAvailabilities}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>

        {/* Bulk Operations */}
        {selectedSlots.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 dark:text-blue-200">
                {selectedSlots.length} horário(s) selecionado(s)
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={performBulkUpdate}
                  className="flex items-center gap-1"
                >
                  <Settings className="h-3 w-3" />
                  Ativar Todos
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={performBulkDelete}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Excluir Todos
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedSlots([])}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Create/Edit Form */}
      {(isCreating || isEditing) && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {isEditing ? 'Editar Disponibilidade' : 'Nova Disponibilidade'}
            </h3>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Professor *
                </label>
                <select
                  {...form.register('teacher_id')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Selecione um professor</option>
                  {teachers.map((teacher: any) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.full_name}
                    </option>
                  ))}
                </select>
                {form.formState.errors.teacher_id && (
                  <p className="text-red-600 text-sm mt-1">
                    {form.formState.errors.teacher_id.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Dia da Semana *
                </label>
                <select
                  {...form.register('day_of_week', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {DAYS_OF_WEEK.map((day, index) => (
                    <option key={index} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
                {form.formState.errors.day_of_week && (
                  <p className="text-red-600 text-sm mt-1">
                    {form.formState.errors.day_of_week.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Horário de Início *
                </label>
                <input
                  {...form.register('start_time')}
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                {form.formState.errors.start_time && (
                  <p className="text-red-600 text-sm mt-1">
                    {form.formState.errors.start_time.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Horário de Fim *
                </label>
                <input
                  {...form.register('end_time')}
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                {form.formState.errors.end_time && (
                  <p className="text-red-600 text-sm mt-1">
                    {form.formState.errors.end_time.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Máximo de Alunos *
                </label>
                <input
                  {...form.register('max_students', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                {form.formState.errors.max_students && (
                  <p className="text-red-600 text-sm mt-1">
                    {form.formState.errors.max_students.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  {...form.register('is_active')}
                  type="checkbox"
                  id="is_active"
                  className="rounded border-gray-300"
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Ativo
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isEditing ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Teacher Availability Grid */}
      <div className="space-y-4">
        {groupedAvailabilities.map(({ teacher, availabilities: teacherAvailabilities }) => (
          <Card key={teacher.id} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{teacher.full_name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {teacher.email} • {teacherAvailabilities.length} horário(s)
                  </p>
                  {teacher.rating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {teacher.rating.toFixed(1)} ({teacher.total_reviews} avaliações)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  Ver Agenda
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {teacherAvailabilities.map((availability) => (
                <div
                  key={availability.id}
                  className={`
                    border rounded-lg p-3 transition-colors cursor-pointer
                    ${availability.is_active 
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                    }
                    ${selectedSlots.includes(availability.id) 
                      ? 'ring-2 ring-blue-500' 
                      : ''
                    }
                  `}
                  onClick={() => {
                    const isSelected = selectedSlots.includes(availability.id);
                    if (isSelected) {
                      setSelectedSlots(prev => prev.filter((id: any) => id !== availability.id));
                    } else {
                      setSelectedSlots(prev => [...prev, availability.id]);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium text-sm">
                          {DAYS_OF_WEEK[availability.day_of_week]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {availability.start_time} - {availability.end_time}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Máx: {availability.max_students} alunos
                      </p>
                      {!availability.is_active && (
                        <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full mt-1">
                          Inativo
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(availability);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAvailability(availability.id);
                        }}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {teacherAvailabilities.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  Nenhuma disponibilidade configurada
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Approvals Modal */}
      {showApprovals && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Solicitações de Aprovação ({pendingRequests.length})
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowApprovals(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma solicitação pendente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{request.teacher_name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{request.teacher_email}</p>
                          </div>
                        </div>
                        
                        <div className="ml-10">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`
                              px-2 py-1 rounded-full text-xs font-medium
                              ${request.change_type === 'create' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : ''}
                              ${request.change_type === 'update' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : ''}
                              ${request.change_type === 'delete' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : ''}
                            `}>
                              {request.change_type === 'create' ? 'Criar' : 
                               request.change_type === 'update' ? 'Atualizar' : 'Excluir'}
                            </span>
                            <span className="text-sm font-medium">{request.change_summary}</span>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Solicitado por: {request.requested_by_name} em{' '}
                            {new Date(request.created_at).toLocaleString('pt-BR')}
                          </p>
                          
                          {request.change_type !== 'delete' && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 text-sm">
                              <pre>{JSON.stringify(request.requested_changes, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => approveRequest(request.id)}
                          disabled={approvalLoading}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectRequest(request.id)}
                          disabled={approvalLoading}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Rejeitar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Relatório de Disponibilidade
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAnalytics(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Total de Professores</h4>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{teachers.length}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100">Horários Ativos</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {availabilities.filter((a: any) => a.is_active).length}
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Conflitos</h4>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{conflicts.length}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 dark:text-purple-100">Capacidade Total</h4>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {availabilities.reduce((sum, a) => sum + a.max_students, 0)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Distribuição por Dia da Semana</h4>
              <div className="grid grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map((day, index) => {
                  const dayCount = availabilities.filter((a: any) => a.day_of_week === index && a.is_active).length;
                  return (
                    <div key={index} className="text-center">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                        <p className="text-xs font-medium">{day.slice(0, 3)}</p>
                        <p className="text-lg font-bold text-primary">{dayCount}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                {filteredAvailabilities.length} disponibilidades encontradas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredAvailabilities.filter((a: any) => a.is_active).length} ativas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {teachers.length} professores
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}