/**
 * Interface Administrativa de Configura��o de Alertas
 * Task 3 - FEATURE_001_SISTEMA_ALERTAS
 * Componente React com Shadcn/ui para gest�o completa de alertas
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Shadcn/ui Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Icons
import { 
  Bell, 
  Settings, 
  History, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Webhook, 
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Server,
  Cpu,
  Activity
} from 'lucide-react';

// Service imports
import { 
  alertService, 
  AlertConfig as AlertConfigType,
  AlertInstance,
  AlertHistory,
  AlertType,
  AlertSeverity,
  AlertChannel,
  AlertStatus,
  AlertMetrics
} from '@/services/alertService';
import { logger } from '@/utils/logger';

// Validation schemas
const alertConfigSchema = z.object({
  name: z.string().min(1, 'Nome � obrigat�rio').max(100, 'Nome muito longo'),
  type: z.enum(['downtime', 'performance', 'error', 'custom'] as const),
  severity: z.enum(['low', 'medium', 'high', 'critical'] as const),
  threshold: z.object({
    value: z.number().min(0, 'Valor deve ser positivo'),
    unit: z.string().min(1, 'Unidade � obrigat�ria'),
    comparison: z.enum(['greater_than', 'less_than', 'equals'] as const)
  }),
  channels: z.array(z.enum(['email', 'webhook', 'slack'] as const)).min(1, 'Pelo menos um canal � obrigat�rio'),
  enabled: z.boolean(),
  escalation: z.object({
    enabled: z.boolean(),
    timeout: z.number().min(1, 'Timeout deve ser maior que 0'),
    escalate_to: z.array(z.enum(['email', 'webhook', 'slack'] as const))
  }),
  conditions: z.object({
    duration: z.number().min(1, 'Dura��o deve ser maior que 0'),
    cooldown: z.number().min(1, 'Cooldown deve ser maior que 0')
  }),
  metadata: z.record(z.any()).optional()
});

const channelConfigSchema = z.object({
  email_recipients: z.string().email('Email inv�lido').optional(),
  webhook_url: z.string().url('URL inv�lida').optional(),
  slack_webhook: z.string().url('URL do Slack inv�lida').optional()
});

type AlertConfigForm = z.infer<typeof alertConfigSchema>;
type ChannelConfigForm = z.infer<typeof channelConfigSchema>;

// Type guards and utilities
const getAlertTypeIcon = (type: AlertType) => {
  switch (type) {
    case 'downtime': return <Server className="w-4 h-4" />;
    case 'performance': return <TrendingUp className="w-4 h-4" />;
    case 'error': return <AlertTriangle className="w-4 h-4" />;
    case 'custom': return <Settings className="w-4 h-4" />;
  }
};

const getSeverityColor = (severity: AlertSeverity) => {
  switch (severity) {
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  }
};

const getStatusIcon = (status: AlertStatus) => {
  switch (status) {
    case 'active': return <Activity className="w-4 h-4 text-red-500" />;
    case 'acknowledged': return <CheckCircle className="w-4 h-4 text-yellow-500" />;
    case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'escalated': return <TrendingUp className="w-4 h-4 text-red-700" />;
  }
};

const getChannelIcon = (channel: AlertChannel) => {
  switch (channel) {
    case 'email': return <Mail className="w-4 h-4" />;
    case 'webhook': return <Webhook className="w-4 h-4" />;
    case 'slack': return <MessageSquare className="w-4 h-4" />;
  }
};

// Main component
export default function AlertConfig() {
  // State management
  const [activeTab, setActiveTab] = useState('rules');
  const [configs, setConfigs] = useState<AlertConfigType[]>([]);
  const [history, setHistory] = useState<AlertHistory>({ instances: [], total_count: 0, page: 1, per_page: 20, filters: {} });
  const [metrics, setMetrics] = useState<AlertMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AlertConfigType | null>(null);

  // Forms
  const alertForm = useForm<AlertConfigForm>({
    resolver: zodResolver(alertConfigSchema),
    defaultValues: {
      name: '',
      type: 'downtime',
      severity: 'medium',
      threshold: {
        value: 0,
        unit: 'ms',
        comparison: 'greater_than'
      },
      channels: ['email'],
      enabled: true,
      escalation: {
        enabled: false,
        timeout: 30,
        escalate_to: []
      },
      conditions: {
        duration: 5,
        cooldown: 15
      },
      metadata: {}
    }
  });

  const channelForm = useForm<ChannelConfigForm>({
    resolver: zodResolver(channelConfigSchema),
    defaultValues: {
      email_recipients: '',
      webhook_url: '',
      slack_webhook: ''
    }
  });

  // Effects
  useEffect(() => {
    loadConfigurations();
    loadHistory();
    loadMetrics();
  }, []);

  // Data loading functions
  const loadConfigurations = async () => {
    try {
      setLoading(true);
      const alertConfigs = await alertService.loadAlertConfigurations();
      setConfigs(alertConfigs);
    } catch (error) {
      logger.error('AlertConfig: Failed to load configurations', { error });
      setConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const alertHistory = await alertService.getAlertHistory({}, 1, 20);
      setHistory(alertHistory);
    } catch (error) {
      logger.error('AlertConfig: Failed to load history', { error });
    }
  };

  const loadMetrics = async () => {
    try {
      const alertMetrics = await alertService.getAlertMetrics();
      setMetrics(alertMetrics);
    } catch (error) {
      logger.error('AlertConfig: Failed to load metrics', { error });
    }
  };

  // Form handlers
  const onSubmitAlertConfig = async (data: AlertConfigForm) => {
    try {
      setLoading(true);
      
      if (editingConfig) {
        // Update existing config (not implemented in service yet)
        logger.info('AlertConfig: Updating configuration', { id: editingConfig.id, data });
      } else {
        // Create new config
        await alertService.configAlertRules(data);
        logger.info('AlertConfig: Created new alert configuration', { data });
      }
      
      alertForm.reset();
      setEditingConfig(null);
      await loadConfigurations();
      
    } catch (error) {
      logger.error('AlertConfig: Failed to save configuration', { error });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitChannelConfig = async (data: ChannelConfigForm) => {
    try {
      setLoading(true);
      // Save channel configuration (would be implemented in a separate service)
      logger.info('AlertConfig: Channel configuration saved', { data });
    } catch (error) {
      logger.error('AlertConfig: Failed to save channel configuration', { error });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfig = async (configId: string) => {
    try {
      setLoading(true);
      const success = await alertService.deleteAlertConfig(configId);
      if (success) {
        await loadConfigurations();
      }
    } catch (error) {
      logger.error('AlertConfig: Failed to delete configuration', { error });
    } finally {
      setLoading(false);
    }
  };

  const handleEditConfig = (config: AlertConfigType) => {
    setEditingConfig(config);
    alertForm.reset({
      name: config.name,
      type: config.type,
      severity: config.severity,
      threshold: config.threshold,
      channels: config.channels,
      enabled: config.enabled,
      escalation: config.escalation,
      conditions: config.conditions,
      metadata: config.metadata
    });
    setActiveTab('rules');
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await alertService.acknowledgeAlert(alertId, 'admin');
      await loadHistory();
    } catch (error) {
      logger.error('AlertConfig: Failed to acknowledge alert', { error });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Configura��o de Alertas
          </h1>
          <p className="text-muted-foreground">
            Gerencie alertas autom�ticos, canais de notifica��o e hist�rico do sistema
          </p>
        </div>
        
        {/* Metrics Summary */}
        {metrics && (
          <div className="flex gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Alertas Ativos</p>
                  <p className="text-lg font-semibold">{metrics.active_alerts}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Tempo M�dio</p>
                  <p className="text-lg font-semibold">{metrics.average_resolution_time}min</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Regras
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Canais
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Hist�rico
          </TabsTrigger>
        </TabsList>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {editingConfig ? 'Editar Regra' : 'Nova Regra de Alerta'}
                </CardTitle>
                <CardDescription>
                  Configure as condi��es e canais para disparar alertas autom�ticos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...alertForm}>
                  <form onSubmit={alertForm.handleSubmit(onSubmitAlertConfig)} className="space-y-4">
                    {/* Basic Configuration */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={alertForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da Regra</FormLabel>
                            <FormControl>
                              <Input placeholder="API Downtime Alert" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={alertForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Alerta</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="downtime">Downtime</SelectItem>
                                <SelectItem value="performance">Performance</SelectItem>
                                <SelectItem value="error">Error Rate</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={alertForm.control}
                        name="severity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Severidade</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a severidade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Baixa</SelectItem>
                                <SelectItem value="medium">M�dia</SelectItem>
                                <SelectItem value="high">Alta</SelectItem>
                                <SelectItem value="critical">Cr�tica</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={alertForm.control}
                        name="enabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Ativo</FormLabel>
                              <FormDescription>
                                Regra est� ativa
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Threshold Configuration */}
                    <div className="space-y-4">
                      <FormLabel>Configura��o de Threshold</FormLabel>
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={alertForm.control}
                          name="threshold.value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="5000" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={alertForm.control}
                          name="threshold.unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unidade</FormLabel>
                              <FormControl>
                                <Input placeholder="ms" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={alertForm.control}
                          name="threshold.comparison"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Compara��o</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="greater_than">Maior que</SelectItem>
                                  <SelectItem value="less_than">Menor que</SelectItem>
                                  <SelectItem value="equals">Igual a</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Conditions */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={alertForm.control}
                        name="conditions.duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dura��o (minutos)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="5"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Tempo antes de disparar o alerta
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={alertForm.control}
                        name="conditions.cooldown"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cooldown (minutos)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="15"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Tempo antes de permitir novo alerta
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Escalation */}
                    <div className="space-y-4">
                      <FormField
                        control={alertForm.control}
                        name="escalation.enabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Escala��o Autom�tica</FormLabel>
                              <FormDescription>
                                Escalar alertas n�o reconhecidos
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {alertForm.watch('escalation.enabled') && (
                        <FormField
                          control={alertForm.control}
                          name="escalation.timeout"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Timeout para Escala��o (minutos)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="30"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? 'Salvando...' : editingConfig ? 'Atualizar' : 'Criar Regra'}
                      </Button>
                      {editingConfig && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setEditingConfig(null);
                            alertForm.reset();
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Configuration List */}
            <Card>
              <CardHeader>
                <CardTitle>Regras Configuradas</CardTitle>
                <CardDescription>
                  Lista de todas as regras de alerta configuradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {configs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma regra configurada</p>
                    <p className="text-sm">Configure sua primeira regra de alerta</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {configs.map((config) => (
                      <div
                        key={config.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getAlertTypeIcon(config.type)}
                          <div>
                            <p className="font-medium">{config.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge className={getSeverityColor(config.severity)}>
                                {config.severity}
                              </Badge>
                              <span>"</span>
                              <span>{config.type}</span>
                              {!config.enabled && (
                                <>
                                  <span>"</span>
                                  <span className="text-red-500">Inativo</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditConfig(config)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Regra</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir a regra "{config.name}"? 
                                  Esta a��o n�o pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteConfig(config.id)}
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configura��o de Canais
              </CardTitle>
              <CardDescription>
                Configure os canais de notifica��o para receber alertas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...channelForm}>
                <form onSubmit={channelForm.handleSubmit(onSubmitChannelConfig)} className="space-y-6">
                  {/* Email Configuration */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      <h3 className="text-lg font-medium">Email</h3>
                    </div>
                    <FormField
                      control={channelForm.control}
                      name="email_recipients"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destinat�rios</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="admin@escolahabilidade.com.br"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Endere�os de email separados por v�rgula
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Webhook Configuration */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Webhook className="w-5 h-5" />
                      <h3 className="text-lg font-medium">Webhook</h3>
                    </div>
                    <FormField
                      control={channelForm.control}
                      name="webhook_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL do Webhook</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://api.exemplo.com/webhook"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            URL para enviar dados dos alertas via HTTP POST
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Slack Configuration */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      <h3 className="text-lg font-medium">Slack</h3>
                    </div>
                    <FormField
                      control={channelForm.control}
                      name="slack_webhook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Webhook do Slack</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://hooks.slack.com/services/..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            URL do webhook incoming do Slack
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Configura��es'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Hist�rico de Alertas
              </CardTitle>
              <CardDescription>
                Visualize todos os alertas disparados pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history.instances.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum alerta no hist�rico</p>
                  <p className="text-sm">Os alertas aparecer�o aqui quando forem disparados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>T�tulo</TableHead>
                        <TableHead>Severidade</TableHead>
                        <TableHead>Disparado em</TableHead>
                        <TableHead>Canais</TableHead>
                        <TableHead>A��es</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.instances.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(alert.status)}
                              <span className="capitalize">{alert.status}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {alert.title}
                          </TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(alert.triggered_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {alert.channels_sent.map((channel) => (
                                <Badge key={channel} variant="outline" className="text-xs">
                                  {getChannelIcon(channel)}
                                  {channel}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {alert.status === 'active' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAcknowledgeAlert(alert.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Reconhecer
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}