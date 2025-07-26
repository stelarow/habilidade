'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Settings,
  Plus,
  BarChart3,
  Eye
} from 'lucide-react';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  description: string;
  isDefault: boolean;
}

interface DayOfWeek {
  value: number;
  label: string;
  short: string;
}

interface Teacher {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  availability: {
    totalSlots: number;
    activeSlots: number;
    hasScheduleConfigured: boolean;
    utilizationRate: number;
    daysConfigured: number;
    totalCapacity: number;
    currentBookings: number;
  };
}

interface DefaultTimeSlotsResponse {
  timeSlots: TimeSlot[];
  daysOfWeek: DayOfWeek[];
  defaultCapacity: number;
  availableDays: string;
}

interface TeachersResponse {
  teachers: Teacher[];
  statistics: {
    totalTeachers: number;
    teachersWithSchedule: number;
    teachersWithoutSchedule: number;
    overallUtilization: number;
  };
}

export function AdminTimeSlotConfig() {
  const router = useRouter();
  const [defaultSlots, setDefaultSlots] = useState<DefaultTimeSlotsResponse | null>(null);
  const [teachers, setTeachers] = useState<TeachersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingSchedule, setApplyingSchedule] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar horários padrões e professores em paralelo
      const [slotsResponse, teachersResponse] = await Promise.all([
        fetch('/api/admin/time-slots/default'),
        fetch('/api/admin/teachers')
      ]);

      if (!slotsResponse.ok) {
        throw new Error('Erro ao carregar horários padrões');
      }

      if (!teachersResponse.ok) {
        throw new Error('Erro ao carregar professores');
      }

      const slotsData = await slotsResponse.json();
      const teachersData = await teachersResponse.json();

      setDefaultSlots(slotsData);
      setTeachers(teachersData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const applyDefaultSchedule = async (teacherId: string, teacherName: string) => {
    try {
      setApplyingSchedule(teacherId);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/time-slots/default', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId,
          maxStudents: 3
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao aplicar horários padrões');
      }

      setSuccess(`Horários padrões aplicados com sucesso para ${teacherName}!`);
      
      // Recarregar dados
      await loadData();
    } catch (err) {
      console.error('Erro ao aplicar horários:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setApplyingSchedule(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Carregando configurações...</span>
      </div>
    );
  }

  if (!defaultSlots || !teachers) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar dados. Tente recarregar a página.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Configuração de Horários Padrões</h1>
          <p className="text-muted-foreground">
            Configure os horários padrões disponíveis para todos os professores
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Professores</p>
                <p className="text-2xl font-bold">{teachers.statistics.totalTeachers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Com Horários</p>
                <p className="text-2xl font-bold text-green-600">
                  {teachers.statistics.teachersWithSchedule}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Sem Horários</p>
                <p className="text-2xl font-bold text-orange-600">
                  {teachers.statistics.teachersWithoutSchedule}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Utilização Geral</p>
                <p className="text-2xl font-bold text-blue-600">
                  {teachers.statistics.overallUtilization}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Horários Padrões do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horários Padrões do Sistema
          </CardTitle>
          <CardDescription>
            Estes são os horários que serão aplicados automaticamente para todos os professores.
            Disponibilidade: {defaultSlots.availableDays} • Capacidade padrão: {defaultSlots.defaultCapacity} alunos por horário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {defaultSlots.timeSlots.map((slot) => (
              <Card key={slot.id} className="p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  {slot.startTime} - {slot.endTime}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  2 horas
                </div>
              </Card>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              6 dias por semana
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              3 alunos por horário
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              {defaultSlots.timeSlots.length * 6} slots por professor
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Professores */}
      <Card>
        <CardHeader>
          <CardTitle>Professores</CardTitle>
          <CardDescription>
            Aplique os horários padrões aos professores que ainda não possuem configuração
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teachers.teachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{teacher.name}</h3>
                      {teacher.availability.hasScheduleConfigured ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Configurado
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Sem horários
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{teacher.email}</p>
                  </div>

                  {teacher.availability.hasScheduleConfigured && (
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-muted-foreground">Slots Ativos</p>
                          <p className="font-medium">{teacher.availability.activeSlots}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Dias</p>
                          <p className="font-medium">{teacher.availability.daysConfigured}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Utilização</p>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={teacher.availability.utilizationRate} 
                              className="w-16" 
                            />
                            <span className="text-xs font-medium">
                              {teacher.availability.utilizationRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!teacher.availability.hasScheduleConfigured ? (
                    <Button
                      onClick={() => applyDefaultSchedule(teacher.id, teacher.name)}
                      disabled={applyingSchedule === teacher.id}
                      className="gap-2"
                    >
                      {applyingSchedule === teacher.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      Aplicar Horários Padrões
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/admin/teachers/${teacher.id}/availability`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}