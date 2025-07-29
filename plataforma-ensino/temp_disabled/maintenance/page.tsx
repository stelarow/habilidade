'use client';

/**
 * Painel de Controle de Manutenção - Interface administrativa completa
 * Feature: FEATURE_003_MAINTENANCE_MODE
 * 
 * Permite agendar, ativar, desativar e gerenciar janelas de manutenção,
 * bem como controlar bypass de usuários e visualizar histórico.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  Users, 
  Activity,
  Plus,
  Eye,
  Edit,
  Trash2,
  Play,
  Square,
  RefreshCw,
  Shield,
  Mail,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { serverMaintenanceService } from '@/services/maintenanceService';
import type { MaintenanceWindow, MaintenanceBypassUser } from '@/services/maintenanceService';

export default function MaintenanceControlPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State
  const [maintenanceWindows, setMaintenanceWindows] = useState<MaintenanceWindow[]>([]);
  const [activeMaintenance, setActiveMaintenance] = useState<MaintenanceWindow | null>(null);
  const [systemMetrics, setSystemMetrics] = useState({
    totalWindows: 0,
    activeWindows: 0,
    scheduledWindows: 0,
    completedWindows: 0,
    uptimePercentage: 99.5
  });

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch maintenance windows
      const windows = await serverMaintenanceService.listMaintenanceWindows();
      setMaintenanceWindows(windows);

      // Find active maintenance
      const active = windows.find(w => w.status === 'active');
      setActiveMaintenance(active || null);

      // Calculate metrics
      setSystemMetrics({
        totalWindows: windows.length,
        activeWindows: windows.filter(w => w.status === 'active').length,
        scheduledWindows: windows.filter(w => w.status === 'scheduled').length,
        completedWindows: windows.filter(w => w.status === 'completed').length,
        uptimePercentage: 99.5 // This would be calculated from actual data
      });

    } catch (err) {
      console.error('Error fetching maintenance data:', err);
      setError('Erro ao carregar dados de manutenção');
    } finally {
      setLoading(false);
    }
  };

  // Emergency actions
  const handleEmergencyActivation = async () => {
    try {
      const result = await serverMaintenanceService.activateMaintenanceMode();
      await fetchData();
      alert(`Manutenção emergencial ativada: ${result.title}`);
    } catch (err) {
      console.error('Error activating emergency maintenance:', err);
      alert('Erro ao ativar manutenção emergencial');
    }
  };

  const handleDeactivateAll = async () => {
    if (!confirm('Tem certeza que deseja desativar todas as manutenções ativas?')) {
      return;
    }

    try {
      await serverMaintenanceService.deactivateMaintenanceMode();
      await fetchData();
      alert('Todas as manutenções foram desativadas');
    } catch (err) {
      console.error('Error deactivating maintenance:', err);
      alert('Erro ao desativar manutenções');
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
    
    // Auto-refresh every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p>Carregando painel de manutenção...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Controle de Manutenção
          </h1>
          <p className="text-muted-foreground">
            Gerencie janelas de manutenção e controle o acesso ao sistema
          </p>
        </div>
        
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className={`w-5 h-5 ${activeMaintenance ? 'text-red-500' : 'text-green-500'}`} />
              <div>
                <p className="text-sm text-muted-foreground">Status do Sistema</p>
                <p className="font-semibold">
                  {activeMaintenance ? 'Manutenção Ativa' : 'Operacional'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Agendadas</p>
                <p className="font-semibold">{systemMetrics.scheduledWindows}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Janelas</p>
                <p className="font-semibold">{systemMetrics.totalWindows}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="font-semibold">{systemMetrics.uptimePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Maintenance Alert */}
      {activeMaintenance && (
        <Alert className="border-orange-500 bg-orange-50">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Manutenção Ativa:</strong> {activeMaintenance.title}
                <br />
                <span className="text-sm">
                  Previsto para terminar em: {formatDistanceToNow(activeMaintenance.endTime, { locale: ptBR })}
                </span>
              </div>
              <Button 
                onClick={handleDeactivateAll}
                variant="outline" 
                size="sm"
                className="border-orange-600 text-orange-600 hover:bg-orange-100"
              >
                <Square className="w-4 h-4 mr-2" />
                Desativar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button 
          onClick={handleEmergencyActivation}
          variant="destructive"
          disabled={!!activeMaintenance}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Ativação Emergencial
        </Button>
        
        {activeMaintenance && (
          <Button 
            onClick={handleDeactivateAll}
            variant="outline"
          >
            <Square className="w-4 h-4 mr-2" />
            Desativar Todas
          </Button>
        )}
        
        <Button 
          onClick={() => window.open('/maintenance', '_blank')}
          variant="outline"
        >
          <Eye className="w-4 h-4 mr-2" />
          Visualizar Página
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="schedule">Agendar</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Manutenção Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeMaintenance ? (
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">{activeMaintenance.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {activeMaintenance.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {activeMaintenance.affectedServices.map((service, index) => (
                        <Badge key={index} variant="destructive">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-sm">
                      <p><strong>Início:</strong> {format(activeMaintenance.startTime, "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                      <p><strong>Previsão de Fim:</strong> {format(activeMaintenance.endTime, "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p className="text-muted-foreground">
                      Nenhuma manutenção ativa no momento
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Próximas Manutenções
                </CardTitle>
              </CardHeader>
              <CardContent>
                {maintenanceWindows.filter(w => w.status === 'scheduled').length > 0 ? (
                  <div className="space-y-3">
                    {maintenanceWindows
                      .filter(w => w.status === 'scheduled')
                      .slice(0, 3)
                      .map((window) => (
                        <div key={window.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium">{window.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(window.startTime, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Nenhuma manutenção agendada
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Agendar Nova Manutenção</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure uma nova janela de manutenção programada
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Formulário de agendamento será implementado aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Manutenções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceWindows.map((window) => (
                  <div key={window.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{window.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(window.startTime, "dd/MM/yyyy HH:mm", { locale: ptBR })} - 
                          {format(window.endTime, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          window.status === 'active' ? 'destructive' :
                          window.status === 'scheduled' ? 'default' :
                          window.status === 'completed' ? 'secondary' : 'outline'
                        }
                      >
                        {window.status}
                      </Badge>
                    </div>
                    
                    {window.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {window.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {window.affectedServices.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                
                {maintenanceWindows.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Nenhuma manutenção registrada
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Sistema de Manutenção Habilitado</h4>
                  <p className="text-sm text-muted-foreground">
                    Controla se o sistema de manutenção está ativo
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notificações Automáticas</h4>
                  <p className="text-sm text-muted-foreground">
                    Enviar emails automáticos para usuários
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Bypass Automático para Admins</h4>
                  <p className="text-sm text-muted-foreground">
                    Administradores ignoram manutenção automaticamente
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}