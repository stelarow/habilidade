import * as cron from 'node-cron';
import { EmailAutomationService } from './emailAutomation';
import { ScheduledTask, ScheduledTaskRow } from '@/types/email';
import { createClient } from '@/lib/supabase/client';

export class SchedulerService {
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();
  private emailService: EmailAutomationService;
  private supabase = createClient();
  
  // Configuration
  private readonly BATCH_SIZE = parseInt(process.env.EMAIL_BATCH_SIZE || '50');
  private readonly RATE_LIMIT_PER_HOUR = parseInt(process.env.EMAIL_RATE_LIMIT_PER_HOUR || '500');
  private readonly CRON_INTERVAL = parseInt(process.env.CRON_EMAIL_PROCESSING_INTERVAL || '15');

  constructor() {
    this.emailService = new EmailAutomationService();
    this.initializeCronJobs();
  }

  /**
   * Inicializa os cron jobs principais
   */
  private initializeCronJobs(): void {
    try {
      // Processamento principal de emails - a cada 15 minutos
      const mainProcessorJob = cron.schedule(`*/${this.CRON_INTERVAL} * * * *`, () => {
        this.processEmailQueue().catch(error => {
          console.error('Erro no processamento principal de emails:', error);
        });
      }, {
        scheduled: false,
        timezone: 'America/Sao_Paulo'
      });

      // Processamento urgente - a cada 5 minutos para emails com delay < 1 hora
      const urgentProcessorJob = cron.schedule('*/5 * * * *', () => {
        this.processUrgentEmails().catch(error => {
          console.error('Erro no processamento urgente de emails:', error);
        });
      }, {
        scheduled: false,
        timezone: 'America/Sao_Paulo'
      });

      // Limpeza diária - remove tasks antigas
      const cleanupJob = cron.schedule('0 2 * * *', () => {
        this.cleanupOldTasks().catch(error => {
          console.error('Erro na limpeza de tasks antigas:', error);
        });
      }, {
        scheduled: false,
        timezone: 'America/Sao_Paulo'
      });

      // Health check - a cada hora
      const healthCheckJob = cron.schedule('0 * * * *', () => {
        this.performHealthCheck().catch(error => {
          console.error('Erro no health check:', error);
        });
      }, {
        scheduled: false,
        timezone: 'America/Sao_Paulo'
      });

      // Armazenar referências dos jobs
      this.cronJobs.set('main-processor', mainProcessorJob);
      this.cronJobs.set('urgent-processor', urgentProcessorJob);
      this.cronJobs.set('cleanup', cleanupJob);
      this.cronJobs.set('health-check', healthCheckJob);

      console.log('Cron jobs inicializados com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar cron jobs:', error);
      throw error;
    }
  }

  /**
   * Inicia todos os cron jobs
   */
  start(): void {
    try {
      this.cronJobs.forEach((job, name) => {
        job.start();
        console.log(`Cron job '${name}' iniciado`);
      });

      console.log('Scheduler Service iniciado com sucesso');
    } catch (error) {
      console.error('Erro ao iniciar Scheduler Service:', error);
      throw error;
    }
  }

  /**
   * Para todos os cron jobs
   */
  stop(): void {
    try {
      this.cronJobs.forEach((job, name) => {
        job.stop();
        console.log(`Cron job '${name}' parado`);
      });

      console.log('Scheduler Service parado com sucesso');
    } catch (error) {
      console.error('Erro ao parar Scheduler Service:', error);
      throw error;
    }
  }

  /**
   * Agenda uma nova tarefa
   */
  async schedule(task: {
    taskType: string;
    executeAt: Date;
    payload: Record<string, any>;
    priority?: 'low' | 'normal' | 'high';
  }): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('scheduled_tasks')
        .insert({
          task_type: task.taskType,
          execute_at: task.executeAt.toISOString(),
          payload: task.payload,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao agendar tarefa: ${error.message}`);
      }

      console.log(`Tarefa agendada: ${task.taskType} para ${task.executeAt.toISOString()}`);
      return data.id;
    } catch (error) {
      console.error('Erro ao agendar tarefa:', error);
      throw error;
    }
  }

  /**
   * Processa a fila principal de emails
   */
  async processEmailQueue(): Promise<void> {
    try {
      const startTime = Date.now();
      console.log('Iniciando processamento da fila de emails...');

      // Verificar rate limiting
      const hourlyCount = await this.getHourlyEmailCount();
      if (hourlyCount >= this.RATE_LIMIT_PER_HOUR) {
        console.log(`Rate limit atingido: ${hourlyCount}/${this.RATE_LIMIT_PER_HOUR} emails/hora`);
        return;
      }

      const remainingQuota = this.RATE_LIMIT_PER_HOUR - hourlyCount;
      const batchSize = Math.min(this.BATCH_SIZE, remainingQuota);

      // Processar emails via EmailAutomationService
      await this.emailService.processScheduledEmails();

      const endTime = Date.now();
      console.log(`Processamento concluído em ${endTime - startTime}ms`);
    } catch (error) {
      console.error('Erro no processamento da fila:', error);
      throw error;
    }
  }

  /**
   * Processa emails urgentes (delay < 1 hora)
   */
  private async processUrgentEmails(): Promise<void> {
    try {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      const { data: urgentTasks, error } = await this.supabase
        .from('scheduled_tasks')
        .select('*')
        .eq('status', 'pending')
        .eq('task_type', 'send_followup_email')
        .lte('execute_at', oneHourFromNow.toISOString())
        .limit(10);

      if (error) {
        throw new Error(`Erro ao buscar emails urgentes: ${error.message}`);
      }

      if (urgentTasks && urgentTasks.length > 0) {
        console.log(`Processando ${urgentTasks.length} emails urgentes`);
        await this.emailService.processScheduledEmails();
      }
    } catch (error) {
      console.error('Erro no processamento urgente:', error);
    }
  }

  /**
   * Cancela uma tarefa agendada
   */
  async cancelScheduledTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('scheduled_tasks')
        .update({ status: 'cancelled' })
        .eq('id', taskId)
        .eq('status', 'pending');

      if (error) {
        throw new Error(`Erro ao cancelar tarefa: ${error.message}`);
      }

      console.log(`Tarefa ${taskId} cancelada`);
      return true;
    } catch (error) {
      console.error('Erro ao cancelar tarefa:', error);
      return false;
    }
  }

  /**
   * Reprocessa tarefas falhadas
   */
  async retryFailedTasks(): Promise<void> {
    try {
      const { data: failedTasks, error } = await this.supabase
        .from('scheduled_tasks')
        .select('*')
        .eq('status', 'failed')
        .lt('retry_count', 3)
        .limit(20);

      if (error) {
        throw new Error(`Erro ao buscar tarefas falhadas: ${error.message}`);
      }

      if (!failedTasks || failedTasks.length === 0) {
        return;
      }

      console.log(`Reenviando ${failedTasks.length} tarefas falhadas`);

      for (const task of failedTasks) {
        // Reagendar com exponential backoff
        const retryDelay = Math.pow(2, task.retry_count) * 30; // 30s, 60s, 120s
        const newExecuteAt = new Date(Date.now() + retryDelay * 1000);

        await this.supabase
          .from('scheduled_tasks')
          .update({
            status: 'pending',
            execute_at: newExecuteAt.toISOString(),
            retry_count: task.retry_count + 1,
            error_message: null
          })
          .eq('id', task.id);
      }
    } catch (error) {
      console.error('Erro ao reprocessar tarefas falhadas:', error);
    }
  }

  /**
   * Limpa tarefas antigas
   */
  private async cleanupOldTasks(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { error } = await this.supabase
        .from('scheduled_tasks')
        .delete()
        .in('status', ['completed', 'failed', 'cancelled'])
        .lt('created_at', thirtyDaysAgo.toISOString());

      if (error) {
        throw new Error(`Erro na limpeza: ${error.message}`);
      }

      console.log('Limpeza de tarefas antigas concluída');
    } catch (error) {
      console.error('Erro na limpeza:', error);
    }
  }

  /**
   * Realiza health check do sistema
   */
  private async performHealthCheck(): Promise<void> {
    try {
      // Verificar conexão com banco
      const { error: dbError } = await this.supabase
        .from('scheduled_tasks')
        .select('id')
        .limit(1);

      if (dbError) {
        console.error('Health check falhou - Erro de banco:', dbError);
        return;
      }

      // Verificar se há tarefas travadas (processando por mais de 1 hora)
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      const { data: stuckTasks, error: stuckError } = await this.supabase
        .from('scheduled_tasks')
        .select('id')
        .eq('status', 'processing')
        .lt('updated_at', oneHourAgo.toISOString());

      if (stuckError) {
        console.error('Erro ao verificar tarefas travadas:', stuckError);
        return;
      }

      if (stuckTasks && stuckTasks.length > 0) {
        console.warn(`${stuckTasks.length} tarefas travadas detectadas`);
        // Resetar tarefas travadas
        await this.supabase
          .from('scheduled_tasks')
          .update({ status: 'pending' })
          .in('id', stuckTasks.map(t => t.id));
      }

      // Obter estatísticas
      const queueStats = await this.getQueueStats();
      console.log('Health check OK - Stats:', queueStats);
    } catch (error) {
      console.error('Erro no health check:', error);
    }
  }

  /**
   * Obtém contagem de emails enviados na última hora
   */
  private async getHourlyEmailCount(): Promise<number> {
    try {
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      const { data, error } = await this.supabase
        .from('scheduled_tasks')
        .select('id')
        .eq('task_type', 'send_followup_email')
        .eq('status', 'completed')
        .gte('updated_at', oneHourAgo.toISOString());

      if (error) {
        throw new Error(`Erro ao contar emails: ${error.message}`);
      }

      return data?.length || 0;
    } catch (error) {
      console.error('Erro ao obter contagem horária:', error);
      return 0;
    }
  }

  /**
   * Obtém estatísticas da fila
   */
  async getQueueStats(): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    avgProcessingTime: number;
    lastProcessedAt: string | null;
  }> {
    try {
      const { data: tasks, error } = await this.supabase
        .from('scheduled_tasks')
        .select('status, created_at, updated_at')
        .eq('task_type', 'send_followup_email');

      if (error) {
        throw new Error(`Erro ao obter estatísticas: ${error.message}`);
      }

      const stats = {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        avgProcessingTime: 0,
        lastProcessedAt: null as string | null
      };

      let totalProcessingTime = 0;
      let completedTasks = 0;
      let latestCompletedAt: Date | null = null;

      for (const task of tasks || []) {
        stats[task.status as keyof typeof stats]++;

        if (task.status === 'completed') {
          completedTasks++;
          const createdAt = new Date(task.created_at);
          const updatedAt = new Date(task.updated_at);
          totalProcessingTime += updatedAt.getTime() - createdAt.getTime();

          if (!latestCompletedAt || updatedAt > latestCompletedAt) {
            latestCompletedAt = updatedAt;
          }
        }
      }

      if (completedTasks > 0) {
        stats.avgProcessingTime = Math.round(totalProcessingTime / completedTasks / 1000); // em segundos
      }

      if (latestCompletedAt) {
        stats.lastProcessedAt = latestCompletedAt.toISOString();
      }

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        avgProcessingTime: 0,
        lastProcessedAt: null
      };
    }
  }

  /**
   * Força processamento imediato da fila
   */
  async forceProcessQueue(): Promise<void> {
    console.log('Forçando processamento imediato da fila...');
    await this.processEmailQueue();
  }

  /**
   * Obtém próximas tarefas agendadas
   */
  async getUpcomingTasks(limit: number = 10): Promise<ScheduledTaskRow[]> {
    try {
      const { data, error } = await this.supabase
        .from('scheduled_tasks')
        .select('*')
        .eq('status', 'pending')
        .order('execute_at', { ascending: true })
        .limit(limit);

      if (error) {
        throw new Error(`Erro ao buscar próximas tarefas: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao obter próximas tarefas:', error);
      return [];
    }
  }

  /**
   * Pausa processamento temporariamente
   */
  pauseProcessing(): void {
    const mainProcessor = this.cronJobs.get('main-processor');
    const urgentProcessor = this.cronJobs.get('urgent-processor');
    
    if (mainProcessor) mainProcessor.stop();
    if (urgentProcessor) urgentProcessor.stop();
    
    console.log('Processamento pausado');
  }

  /**
   * Resume processamento
   */
  resumeProcessing(): void {
    const mainProcessor = this.cronJobs.get('main-processor');
    const urgentProcessor = this.cronJobs.get('urgent-processor');
    
    if (mainProcessor) mainProcessor.start();
    if (urgentProcessor) urgentProcessor.start();
    
    console.log('Processamento resumido');
  }

  /**
   * Verifica se o serviço está rodando
   */
  isRunning(): boolean {
    const mainProcessor = this.cronJobs.get('main-processor');
    return mainProcessor ? mainProcessor.running : false;
  }
}

// Singleton instance
let schedulerInstance: SchedulerService | null = null;

export function getSchedulerService(): SchedulerService {
  if (!schedulerInstance) {
    schedulerInstance = new SchedulerService();
  }
  return schedulerInstance;
}