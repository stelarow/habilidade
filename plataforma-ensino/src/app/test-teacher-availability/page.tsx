'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// ID da professora Maria Eduarda
const TEACHER_ID = '3834f9e6-2fd9-447f-9d74-757cdd6b6e44';

interface TeacherData {
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

interface Statistics {
  totalSlots: number;
  activeSlots: number;
  inactiveSlots: number;
  totalCapacity: number;
  totalBookings: number;
  availableSpots: number;
  overallUtilization: number;
  workingDays: number;
  averageSlotsPerDay: number;
}

interface Insights {
  mostOccupiedSlots: Array<{ time: string; utilizationRate: number }>;
  leastOccupiedSlots: Array<{ time: string; utilizationRate: number }>;
  peakDays: Array<{ dayName: string; utilizationRate: number }>;
}

interface AvailabilityResponse {
  teacher: TeacherData;
  schedule: DaySchedule[];
  statistics: Statistics;
  insights: Insights;
  metadata: {
    fetched_at: string;
  };
}

export default function TestTeacherAvailabilityPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [testResults, setTestResults] = useState<{
    apiResponse: boolean;
    dataStructure: boolean;
    totalSlots: boolean;
    utilizationCalculation: boolean;
    insights: boolean;
  }>({
    apiResponse: false,
    dataStructure: false,
    totalSlots: false,
    utilizationCalculation: false,
    insights: false,
  });

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setTestResults({
      apiResponse: false,
      dataStructure: false,
      totalSlots: false,
      utilizationCalculation: false,
      insights: false,
    });

    try {
      const response = await fetch(`/api/admin/teachers/${TEACHER_ID}/availability`);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao buscar disponibilidade');
      }

      setData(responseData);
      
      // Validar estrutura dos dados
      const results = {
        apiResponse: true,
        dataStructure: !!(
          responseData.teacher &&
          Array.isArray(responseData.schedule) &&
          responseData.statistics &&
          responseData.insights
        ),
        totalSlots: responseData.statistics?.totalSlots === 36, // 6 horários × 6 dias
        utilizationCalculation: false,
        insights: !!(
          responseData.insights?.mostOccupiedSlots?.length > 0 &&
          responseData.insights?.leastOccupiedSlots?.length > 0
        ),
      };

      // Verificar cálculo de utilização
      if (responseData.statistics) {
        const { totalCapacity, totalBookings, overallUtilization } = responseData.statistics;
        const calculatedUtilization = totalCapacity > 0 
          ? Math.round((totalBookings / totalCapacity) * 100)
          : 0;
        results.utilizationCalculation = calculatedUtilization === overallUtilization;
      }

      setTestResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar disponibilidade:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => time.substring(0, 5);

  const getTestIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Teste da API de Disponibilidade de Professores</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações do Teste</CardTitle>
          <CardDescription>
            Testando a professora Maria Eduarda (ID: {TEACHER_ID})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchAvailability} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Carregando...
              </>
            ) : (
              'Executar Teste'
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data && (
        <>
          {/* Resultados dos Testes */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resultados dos Testes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getTestIcon(testResults.apiResponse)}
                  <span>API respondeu com sucesso</span>
                </div>
                <div className="flex items-center gap-2">
                  {getTestIcon(testResults.dataStructure)}
                  <span>Estrutura de dados correta</span>
                </div>
                <div className="flex items-center gap-2">
                  {getTestIcon(testResults.totalSlots)}
                  <span>Total de 36 horários padrões (6 por dia × 6 dias)</span>
                </div>
                <div className="flex items-center gap-2">
                  {getTestIcon(testResults.utilizationCalculation)}
                  <span>Cálculo de taxa de ocupação correto</span>
                </div>
                <div className="flex items-center gap-2">
                  {getTestIcon(testResults.insights)}
                  <span>Insights gerados corretamente</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Professor */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Dados do Professor</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium text-muted-foreground">Nome</dt>
                  <dd>{data.teacher.name}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Email</dt>
                  <dd>{data.teacher.email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">ID do Usuário</dt>
                  <dd className="font-mono text-sm">{data.teacher.userId}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Avaliação</dt>
                  <dd>{data.teacher.rating || 'N/A'} ({data.teacher.totalReviews || 0} avaliações)</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-medium text-muted-foreground">Especialidades</dt>
                  <dd>{data.teacher.expertise?.join(', ') || 'N/A'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Estatísticas Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-3 gap-4">
                <div>
                  <dt className="font-medium text-muted-foreground">Total de Slots</dt>
                  <dd className="text-2xl font-bold">{data.statistics.totalSlots}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Slots Ativos</dt>
                  <dd className="text-2xl font-bold text-green-600">{data.statistics.activeSlots}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Slots Inativos</dt>
                  <dd className="text-2xl font-bold text-red-600">{data.statistics.inactiveSlots}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Capacidade Total</dt>
                  <dd className="text-2xl font-bold">{data.statistics.totalCapacity}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Total de Agendamentos</dt>
                  <dd className="text-2xl font-bold">{data.statistics.totalBookings}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Vagas Disponíveis</dt>
                  <dd className="text-2xl font-bold">{data.statistics.availableSpots}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Taxa de Ocupação</dt>
                  <dd className="text-2xl font-bold">{data.statistics.overallUtilization}%</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Dias Trabalhados</dt>
                  <dd className="text-2xl font-bold">{data.statistics.workingDays}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Média Slots/Dia</dt>
                  <dd className="text-2xl font-bold">{data.statistics.averageSlotsPerDay}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Disponibilidade por Dia */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Disponibilidade por Dia da Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.schedule.map((day) => (
                  <div key={day.dayOfWeek} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">{day.dayName}</h3>
                    <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Horários:</span> {day.slots.length}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Capacidade:</span> {day.totalCapacity}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ocupados:</span> {day.totalBooked}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Taxa:</span> {day.utilizationRate}%
                      </div>
                    </div>
                    {day.slots.length > 0 && (
                      <div className="space-y-1">
                        {day.slots.map((slot) => (
                          <div key={slot.id} className="flex items-center gap-4 text-sm">
                            <span className="font-mono">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </span>
                            <span className={slot.isActive ? 'text-green-600' : 'text-red-600'}>
                              {slot.isActive ? 'Ativo' : 'Inativo'}
                            </span>
                            <span>Capacidade: {slot.maxStudents}</span>
                            <span>Ocupados: {slot.currentBookings}</span>
                            <span>Disponíveis: {slot.availableSpots}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Horários Mais Ocupados</h4>
                  <ul className="space-y-1">
                    {data.insights.mostOccupiedSlots.map((slot, i) => (
                      <li key={i} className="text-sm">
                        {i + 1}. {slot.time}: {slot.utilizationRate}%
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Horários Menos Ocupados</h4>
                  <ul className="space-y-1">
                    {data.insights.leastOccupiedSlots.map((slot, i) => (
                      <li key={i} className="text-sm">
                        {i + 1}. {slot.time}: {slot.utilizationRate}%
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Dias Mais Movimentados</h4>
                  <ul className="space-y-1">
                    {data.insights.peakDays.map((day, i) => (
                      <li key={i} className="text-sm">
                        {i + 1}. {day.dayName}: {day.utilizationRate}%
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados Brutos (Debug) */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Brutos (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">
                {JSON.stringify(data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}