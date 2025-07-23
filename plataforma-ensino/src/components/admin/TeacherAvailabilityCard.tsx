'use client';

import React from 'react';
import { Users, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

interface TeacherAvailabilityCardProps {
  teacher: Teacher;
  availabilities: TeacherAvailability[];
  selectedSlots: string[];
  onEdit: (availability: TeacherAvailability) => void;
  onDelete: (availabilityId: string) => void;
  onSlotSelect: (availabilityId: string) => void;
}

const DAYS_OF_WEEK = [
  'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
];

export const TeacherAvailabilityCard = React.memo<TeacherAvailabilityCardProps>(({
  teacher,
  availabilities,
  selectedSlots,
  onEdit,
  onDelete,
  onSlotSelect
}) => {
  const handleSlotClick = (availabilityId: string) => {
    onSlotSelect(availabilityId);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{teacher.full_name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {teacher.email} • {availabilities.length} horário(s)
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
            aria-label={`Ver agenda de ${teacher.full_name}`}
          >
            <Calendar className="h-3 w-3" />
            Ver Agenda
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {availabilities.map((availability) => (
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
            onClick={() => handleSlotClick(availability.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSlotClick(availability.id);
              }
            }}
            aria-label={`Selecionar horário ${DAYS_OF_WEEK[availability.day_of_week]} ${availability.start_time}-${availability.end_time}`}
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
                    onEdit(availability);
                  }}
                  className="h-6 w-6 p-0"
                  aria-label={`Editar horário ${DAYS_OF_WEEK[availability.day_of_week]}`}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(availability.id);
                  }}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  aria-label={`Excluir horário ${DAYS_OF_WEEK[availability.day_of_week]}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {availabilities.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            Nenhuma disponibilidade configurada
          </div>
        )}
      </div>
    </Card>
  );
});

TeacherAvailabilityCard.displayName = 'TeacherAvailabilityCard';