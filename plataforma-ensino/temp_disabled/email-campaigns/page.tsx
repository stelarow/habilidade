'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmailAutomationService } from '@/services/emailAutomation';
import { getSchedulerService } from '@/services/schedulerService';
import { EmailCampaignMetrics } from '@/types/email';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Mail, 
  TrendingUp, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function EmailCampaignsPage() {
  const [metrics, setMetrics] = useState<EmailCampaignMetrics[]>([]);
  const [queueStats, setQueueStats] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    avgProcessingTime: 0,
    lastProcessedAt: null as string | null
  });
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  const emailService = new EmailAutomationService();
  const schedulerService = getSchedulerService();

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load metrics
      const campaignMetrics = await emailService.getEmailMetrics();
      setMetrics(campaignMetrics);

      // Load queue stats
      const stats = await schedulerService.getQueueStats();
      setQueueStats(stats);

      // Check if scheduler is running
      setIsRunning(schedulerService.isRunning());
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartScheduler = () => {
    schedulerService.resumeProcessing();
    setIsRunning(true);
  };

  const handleStopScheduler = () => {
    schedulerService.pauseProcessing();
    setIsRunning(false);
  };

  const handleRetryFailed = async () => {
    await schedulerService.retryFailedTasks();
    await loadDashboardData();
  };

  const handleForceProcess = async () => {
    await schedulerService.forceProcessQueue();
    await loadDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando campanhas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campanhas de Email</h1>
          <p className="text-gray-600">Gerencie e monitore suas sequências de follow-up</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant={isRunning ? "default" : "destructive"}>
            {isRunning ? 'Ativo' : 'Pausado'}
          </Badge>
          
          {isRunning ? (
            <Button onClick={handleStopScheduler} variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-2" />
              Pausar
            </Button>
          ) : (
            <Button onClick={handleStartScheduler} size="sm">
              <Play className="h-4 w-4 mr-2" />
              Iniciar
            </Button>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{queueStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Processando</p>
                <p className="text-2xl font-bold text-gray-900">{queueStats.processing}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">{queueStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Falharam</p>
                <p className="text-2xl font-bold text-gray-900">{queueStats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <Button onClick={handleForceProcess} variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Processar Agora
        </Button>
        
        {queueStats.failed > 0 && (
          <Button onClick={handleRetryFailed} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Retentar Falhas ({queueStats.failed})
          </Button>
        )}
      </div>

      {/* Campaign Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance das Sequências
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma campanha ativa encontrada</p>
              <p className="text-sm text-gray-500 mt-2">
                As métricas aparecerão aqui quando você tiver sequências de email ativas
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.map((metric) => (
                <div key={metric.sequenceId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{metric.sequenceName}</h3>
                    <Badge variant="outline">{metric.totalSent} enviados</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {metric.openRate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600">Taxa de Abertura</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {metric.clickRate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600">Taxa de Clique</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {metric.conversionRate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600">Taxa de Conversão</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {metric.unsubscribeRate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600">Taxa de Descadastro</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Tempo Médio de Processamento:</p>
              <p className="text-gray-600">{queueStats.avgProcessingTime}s</p>
            </div>
            
            <div>
              <p className="font-medium text-gray-700">Último Processamento:</p>
              <p className="text-gray-600">
                {queueStats.lastProcessedAt 
                  ? new Date(queueStats.lastProcessedAt).toLocaleString('pt-BR')
                  : 'Nunca'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}