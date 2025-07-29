import { 
  FollowUpSequence, 
  FollowUpEmail, 
  ScheduledTask,
  EmailMetric,
  EmailSequenceRow,
  ScheduledTaskRow,
  EmailMetricRow,
  EmailCampaignMetrics,
  LeadData 
} from '@/types/email';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import emailjs from '@emailjs/browser';

export class EmailAutomationService {
  private supabase = createClient();
  
  // Email service configuration
  private readonly EMAIL_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
  private readonly EMAIL_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
  private readonly EMAIL_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
  private readonly BATCH_SIZE = parseInt(process.env.EMAIL_BATCH_SIZE || '50');
  private readonly RATE_LIMIT_PER_HOUR = parseInt(process.env.EMAIL_RATE_LIMIT_PER_HOUR || '500');

  /**
   * Agenda uma sequência de follow-up para um lead
   */
  async scheduleFollowUpSequence(
    leadData: LeadData,
    sequenceType: 'contact' | 'download' | 'signup'
  ): Promise<string> {
    try {
      // Verificar se já existe uma sequência ativa para este email
      const { data: existingSequence, error: checkError } = await this.supabase
        .from('followup_sequences')
        .select('id')
        .eq('contact_email', leadData.email)
        .eq('is_active', true)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(`Erro ao verificar sequência existente: ${checkError.message}`);
      }

      if (existingSequence) {
        console.log(`Sequência já ativa para ${leadData.email}`);
        return existingSequence.id;
      }

      // Criar nova sequência
      const { data: sequence, error: sequenceError } = await this.supabase
        .from('followup_sequences')
        .insert({
          contact_email: leadData.email,
          sequence_type: sequenceType,
          article_slug: leadData.articleSlug,
          article_category: leadData.articleCategory,
          current_step: 0,
          is_active: true,
          context_data: {
            name: leadData.name,
            source: leadData.source,
            utmData: leadData.utmData,
            ...leadData.contextData
          }
        })
        .select()
        .single();

      if (sequenceError) {
        throw new Error(`Erro ao criar sequência: ${sequenceError.message}`);
      }

      // Agendar primeiro email da sequência
      await this.scheduleNextEmail(sequence.id);

      console.log(`Sequência ${sequenceType} agendada para ${leadData.email}`);
      return sequence.id;
    } catch (error) {
      console.error('Erro ao agendar sequência:', error);
      throw error;
    }
  }

  /**
   * Agenda o próximo email da sequência
   */
  private async scheduleNextEmail(sequenceId: string): Promise<void> {
    try {
      const { data: sequence, error } = await this.supabase
        .from('followup_sequences')
        .select('*')
        .eq('id', sequenceId)
        .single();

      if (error) {
        throw new Error(`Erro ao buscar sequência: ${error.message}`);
      }

      // Obter template da sequência
      const sequenceTemplate = await this.getSequenceTemplate(
        sequence.sequence_type,
        sequence.article_category
      );

      if (!sequenceTemplate || sequence.current_step >= sequenceTemplate.emails.length) {
        // Sequência completa
        await this.supabase
          .from('followup_sequences')
          .update({ is_active: false })
          .eq('id', sequenceId);
        return;
      }

      const emailConfig = sequenceTemplate.emails[sequence.current_step];
      const executeAt = new Date();
      executeAt.setHours(executeAt.getHours() + emailConfig.delay);

      // Criar task agendada
      const { error: taskError } = await this.supabase
        .from('scheduled_tasks')
        .insert({
          task_type: 'send_followup_email',
          execute_at: executeAt.toISOString(),
          payload: {
            sequenceId,
            emailStep: sequence.current_step,
            emailConfig,
            contextData: sequence.context_data
          }
        });

      if (taskError) {
        throw new Error(`Erro ao agendar email: ${taskError.message}`);
      }
    } catch (error) {
      console.error('Erro ao agendar próximo email:', error);
      throw error;
    }
  }

  /**
   * Processa emails agendados
   */
  async processScheduledEmails(): Promise<void> {
    try {
      const now = new Date();
      
      // Buscar tasks pendentes
      const { data: tasks, error } = await this.supabase
        .from('scheduled_tasks')
        .select('*')
        .eq('status', 'pending')
        .eq('task_type', 'send_followup_email')
        .lte('execute_at', now.toISOString())
        .limit(this.BATCH_SIZE);

      if (error) {
        throw new Error(`Erro ao buscar tasks: ${error.message}`);
      }

      if (!tasks || tasks.length === 0) {
        return;
      }

      console.log(`Processando ${tasks.length} emails agendados`);

      // Processar cada task
      for (const task of tasks) {
        await this.processEmailTask(task);
      }
    } catch (error) {
      console.error('Erro ao processar emails agendados:', error);
      throw error;
    }
  }

  /**
   * Processa uma task individual de email
   */
  private async processEmailTask(task: ScheduledTaskRow): Promise<void> {
    try {
      // Marcar como processando
      await this.supabase
        .from('scheduled_tasks')
        .update({ status: 'processing', updated_at: new Date().toISOString() })
        .eq('id', task.id);

      const { sequenceId, emailStep, emailConfig, contextData } = task.payload;

      // Buscar sequência
      const { data: sequence, error: sequenceError } = await this.supabase
        .from('followup_sequences')
        .select('*')
        .eq('id', sequenceId)
        .single();

      if (sequenceError || !sequence || !sequence.is_active) {
        await this.supabase
          .from('scheduled_tasks')
          .update({ status: 'completed' })
          .eq('id', task.id);
        return;
      }

      // Renderizar email
      const emailContent = await this.parseTemplate(emailConfig, {
        contactName: contextData.name || 'Estudante',
        contactEmail: sequence.contact_email,
        articleTitle: contextData.articleTitle || 'Artigo de interesse',
        unsubscribeUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=${this.generateUnsubscribeToken(sequence.id)}`
      });

      // Enviar email
      await this.sendEmail({
        to: sequence.contact_email,
        subject: emailContent.subject,
        html: emailContent.html,
        trackingData: {
          sequenceId: sequence.id,
          emailStep: emailStep
        }
      });

      // Registrar métrica
      await this.recordEmailMetric(sequence.id, emailStep, 'sent');

      // Atualizar sequência
      await this.supabase
        .from('followup_sequences')
        .update({
          current_step: emailStep + 1,
          last_sent: new Date().toISOString()
        })
        .eq('id', sequenceId);

      // Agendar próximo email
      await this.scheduleNextEmail(sequenceId);

      // Marcar task como completa
      await this.supabase
        .from('scheduled_tasks')
        .update({ status: 'completed' })
        .eq('id', task.id);

      console.log(`Email enviado para ${sequence.contact_email} (step ${emailStep})`);
    } catch (error) {
      console.error(`Erro ao processar task ${task.id}:`, error);

      // Incrementar retry count
      const newRetryCount = task.retry_count + 1;
      const maxRetries = 3;

      if (newRetryCount < maxRetries) {
        // Reagendar para retry
        const retryAt = new Date();
        retryAt.setMinutes(retryAt.getMinutes() + Math.pow(2, newRetryCount) * 15); // Exponential backoff

        await this.supabase
          .from('scheduled_tasks')
          .update({
            status: 'pending',
            retry_count: newRetryCount,
            execute_at: retryAt.toISOString(),
            error_message: error instanceof Error ? error.message : 'Erro desconhecido'
          })
          .eq('id', task.id);
      } else {
        // Marcar como falhou
        await this.supabase
          .from('scheduled_tasks')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Erro desconhecido'
          })
          .eq('id', task.id);
      }
    }
  }

  /**
   * Desinscreve um usuário
   */
  async unsubscribeUser(token: string): Promise<boolean> {
    try {
      const sequenceId = this.validateUnsubscribeToken(token);
      
      if (!sequenceId) {
        return false;
      }

      const { error } = await this.supabase
        .from('followup_sequences')
        .update({
          is_active: false,
          unsubscribed_at: new Date().toISOString()
        })
        .eq('id', sequenceId);

      if (error) {
        throw new Error(`Erro ao desinscrever: ${error.message}`);
      }

      // Registrar métrica de unsubscribe
      const { data: sequence } = await this.supabase
        .from('followup_sequences')
        .select('current_step')
        .eq('id', sequenceId)
        .single();

      if (sequence) {
        await this.recordEmailMetric(sequenceId, sequence.current_step, 'unsubscribed');
      }

      return true;
    } catch (error) {
      console.error('Erro ao desinscrever usuário:', error);
      return false;
    }
  }

  /**
   * Obtém métricas de email
   */
  async getEmailMetrics(sequenceId?: string): Promise<EmailCampaignMetrics[]> {
    try {
      let query = this.supabase
        .from('followup_sequences')
        .select(`
          id,
          sequence_type,
          email_metrics (
            event_type,
            email_step
          )
        `);

      if (sequenceId) {
        query = query.eq('id', sequenceId);
      }

      const { data: sequences, error } = await query;

      if (error) {
        throw new Error(`Erro ao buscar métricas: ${error.message}`);
      }

      const metrics: EmailCampaignMetrics[] = [];

      for (const sequence of sequences || []) {
        const emailMetrics = sequence.email_metrics || [];
        
        const totalSent = emailMetrics.filter(m => m.event_type === 'sent').length;
        const totalOpened = emailMetrics.filter(m => m.event_type === 'opened').length;
        const totalClicked = emailMetrics.filter(m => m.event_type === 'clicked').length;
        const totalUnsubscribed = emailMetrics.filter(m => m.event_type === 'unsubscribed').length;

        metrics.push({
          sequenceId: sequence.id,
          sequenceName: sequence.sequence_type,
          totalSent,
          totalOpened,
          totalClicked,
          totalUnsubscribed,
          openRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
          clickRate: totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0,
          unsubscribeRate: totalSent > 0 ? (totalUnsubscribed / totalSent) * 100 : 0,
          conversionRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0
        });
      }

      return metrics;
    } catch (error) {
      console.error('Erro ao obter métricas:', error);
      throw error;
    }
  }

  /**
   * Engine de template parsing
   */
  private async parseTemplate(
    emailConfig: FollowUpEmail,
    variables: Record<string, string>
  ): Promise<{ subject: string; html: string }> {
    try {
      let subject = emailConfig.subject;
      let htmlContent = emailConfig.template;

      // Substituir variáveis
      for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, value);
        htmlContent = htmlContent.replace(regex, value);
      }

      // Substituir variáveis do email config
      for (const [key, value] of Object.entries(emailConfig.variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, String(value));
        htmlContent = htmlContent.replace(regex, String(value));
      }

      return { subject, html: htmlContent };
    } catch (error) {
      console.error('Erro ao parsear template:', error);
      throw error;
    }
  }

  /**
   * Envia email via EmailJS
   */
  private async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    trackingData?: Record<string, any>;
  }): Promise<void> {
    try {
      const templateParams = {
        to_email: params.to,
        subject: params.subject,
        html_content: params.html,
        tracking_pixel: params.trackingData 
          ? `<img src="${process.env.NEXT_PUBLIC_BASE_URL}/api/email/track?data=${encodeURIComponent(JSON.stringify(params.trackingData))}" width="1" height="1" style="display:none" />`
          : ''
      };

      await emailjs.send(
        this.EMAIL_SERVICE_ID,
        this.EMAIL_TEMPLATE_ID,
        templateParams,
        this.EMAIL_PUBLIC_KEY
      );
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  }

  /**
   * Registra métrica de email
   */
  private async recordEmailMetric(
    sequenceId: string,
    emailStep: number,
    eventType: 'sent' | 'opened' | 'clicked' | 'unsubscribed',
    eventData?: Record<string, any>
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('email_metrics')
        .insert({
          sequence_id: sequenceId,
          email_step: emailStep,
          event_type: eventType,
          event_data: eventData
        });

      if (error) {
        throw new Error(`Erro ao registrar métrica: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao registrar métrica:', error);
      // Não propagar erro para não interromper o fluxo principal
    }
  }

  /**
   * Obtém template da sequência
   */
  private async getSequenceTemplate(
    sequenceType: string,
    articleCategory?: string
  ): Promise<FollowUpSequence | null> {
    // Esta função seria implementada para buscar templates configurados
    // Por enquanto, retorna um template padrão
    const { followupTemplates } = await import('@/data/followupTemplates');
    return followupTemplates.find(t => 
      t.trigger === sequenceType && 
      (!articleCategory || t.articleCategory === articleCategory)
    ) || null;
  }

  /**
   * Gera token de unsubscribe
   */
  private generateUnsubscribeToken(sequenceId: string): string {
    const secret = process.env.FOLLOWUP_UNSUBSCRIBE_SECRET || 'default-secret';
    const data = `${sequenceId}:${Date.now()}`;
    return Buffer.from(`${data}:${secret}`).toString('base64');
  }

  /**
   * Valida token de unsubscribe
   */
  private validateUnsubscribeToken(token: string): string | null {
    try {
      const decoded = Buffer.from(token, 'base64').toString();
      const [sequenceId] = decoded.split(':');
      return sequenceId;
    } catch {
      return null;
    }
  }

  /**
   * Obtém status da fila
   */
  async getQueueStatus(): Promise<{
    pending: number;
    processing: number;
    failed: number;
    completed: number;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('scheduled_tasks')
        .select('status')
        .eq('task_type', 'send_followup_email');

      if (error) {
        throw new Error(`Erro ao buscar status da fila: ${error.message}`);
      }

      const status = {
        pending: 0,
        processing: 0,
        failed: 0,
        completed: 0
      };

      data?.forEach(task => {
        status[task.status as keyof typeof status]++;
      });

      return status;
    } catch (error) {
      console.error('Erro ao obter status da fila:', error);
      throw error;
    }
  }
}