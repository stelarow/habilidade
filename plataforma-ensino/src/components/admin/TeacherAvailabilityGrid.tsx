'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  Users,
  Calendar,
  AlertCircle,
  Loader2,
  Filter,
  TrendingUp,
  TrendingDown,
  BarChart3,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxStudents: number;
  isActive: boolean;
  currentBookings: number;
  availableSpots: number;
}

interface DaySchedule {
  dayOfWeek: number;
  dayName: string;
  slots: TimeSlot[];
  totalCapacity: number;
  totalBooked: number;
  utilizationRate: number;
}

interface TeacherInfo {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  expertise?: string[];
  rating?: number;
  totalReviews?: number;
}

interface AvailabilityResponse {
  teacher: TeacherInfo;
  schedule: DaySchedule[];
  statistics: {
    totalSlots: number;
    activeSlots: number;
    inactiveSlots: number;
    totalCapacity: number;
    totalBookings: number;
    availableSpots: number;
    overallUtilization: number;
    workingDays: number;
    averageSlotsPerDay: number;
  };
  insights: {
    mostOccupiedSlots: Array<{ time: string; utilizationRate: number }>;
    leastOccupiedSlots: Array<{ time: string; utilizationRate: number }>;
    peakDays: Array<{ dayName: string; utilizationRate: number }>;
  };
}

interface TeacherAvailabilityGridProps {
  teacherId: string;
  onSlotClick?: (slot: TimeSlot) => void;
}

export function TeacherAvailabilityGrid({ teacherId, onSlotClick }: TeacherAvailabilityGridProps) {
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    loadAvailability();
  }, [teacherId]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/teachers/${teacherId}/availability`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar disponibilidade');
      }

      const availabilityData = await response.json();
      setData(availabilityData);
    } catch (err) {
      console.error('Erro ao carregar disponibilidade:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getSlotStatusColor = (slot: TimeSlot) => {
    if (!slot.isActive) return 'bg-gray-100 text-gray-500';
    
    const occupancyRate = slot.maxStudents > 0 
      ? (slot.currentBookings / slot.maxStudents) * 100 
      : 0;

    if (occupancyRate === 100) return 'bg-red-100 text-red-800 border-red-200';
    if (occupancyRate >= 75) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (occupancyRate >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (occupancyRate > 0) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return 'text-red-600';
    if (rate >= 60) return 'text-orange-600';
    if (rate >= 40) return 'text-yellow-600';
    if (rate >= 20) return 'text-green-600';
    return 'text-blue-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Carregando disponibilidade...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error || 'Erro ao carregar dados'}
        </AlertDescription>
      </Alert>
    );
  }

  const { teacher, schedule, statistics, insights } = data;
  const filteredSchedule = selectedDay !== null 
    ? schedule.filter((day: any) => day.dayOfWeek === selectedDay)
    : schedule;

  return (
    <div className="space-y-6">
      {/* Header com informações do professor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>{teacher.name}</CardTitle>
                <CardDescription>{teacher.email}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Taxa de Ocupação</div>
              <div className={cn("text-2xl font-bold", getUtilizationColor(statistics.overallUtilization))}>
                {statistics.overallUtilization}%
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Slots Totais</p>
                <p className="text-xl font-bold">{statistics.totalSlots}</p>
                <p className="text-xs text-muted-foreground">
                  {statistics.activeSlots} ativos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Capacidade Total</p>
                <p className="text-xl font-bold">{statistics.totalCapacity}</p>
                <p className="text-xs text-muted-foreground">
                  {statistics.availableSpots} disponíveis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Agendamentos</p>
                <p className="text-xl font-bold">{statistics.totalBookings}</p>
                <p className="text-xs text-muted-foreground">
                  {statistics.workingDays} dias/semana
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Média por Dia</p>
                <p className="text-xl font-bold">{statistics.averageSlotsPerDay}</p>
                <p className="text-xs text-muted-foreground">
                  horários
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtrar por Dia
            </CardTitle>
            {selectedDay !== null && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDay(null)}
              >
                Limpar Filtro
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {schedule
              .filter((day: any) => day.slots.length > 0)
              .map((day: any) => (
                <Button
                  key={day.dayOfWeek}
                  variant={selectedDay === day.dayOfWeek ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDay(day.dayOfWeek)}
                  className="gap-2"
                >
                  {day.dayName}
                  <Badge variant="secondary" className="ml-1">
                    {day.slots.length}
                  </Badge>
                </Button>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade de Horários */}
      <Card>
        <CardHeader>
          <CardTitle>Grade de Horários</CardTitle>
          <CardDescription>
            Clique em um horário para ver detalhes ou editar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredSchedule
              .filter((day: any) => day.slots.length > 0)
              .map((day: any) => (
                <div key={day.dayOfWeek}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{day.dayName}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Ocupação: {day.totalBooked}/{day.totalCapacity}
                      </span>
                      <Progress value={day.utilizationRate} className="w-20" />
                      <span className={cn("font-medium", getUtilizationColor(day.utilizationRate))}>
                        {day.utilizationRate}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {day.slots.map((slot: any) => (
                      <Card
                        key={slot.id}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          getSlotStatusColor(slot),
                          !slot.isActive && "opacity-60"
                        )}
                        onClick={() => onSlotClick?.(slot)}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="mt-2 text-xs">
                            <div className="flex items-center justify-center gap-1">
                              <Users className="w-3 h-3" />
                              {slot.currentBookings}/{slot.maxStudents}
                            </div>
                            {!slot.isActive && (
                              <Badge variant="secondary" className="mt-1 text-xs">
                                Inativo
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {day !== filteredSchedule[filteredSchedule.length - 1] && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
          </div>

          {filteredSchedule.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum horário disponível para o filtro selecionado.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              Horários Mais Ocupados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.mostOccupiedSlots.map((slot, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{slot.time}</span>
                  <Badge variant="destructive">{slot.utilizationRate}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-600" />
              Horários Menos Ocupados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.leastOccupiedSlots.map((slot, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{slot.time}</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {slot.utilizationRate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Dias Mais Movimentados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.peakDays.map((day, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{day.dayName}</span>
                  <Badge variant="secondary">{day.utilizationRate}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Legenda de Cores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
              <span>Lotado (100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-100 border border-orange-200" />
              <span>Quase Lotado (75%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200" />
              <span>Moderado (50%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
              <span>Com Vagas (1-49%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />
              <span>Vazio (0%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
              <span>Inativo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}