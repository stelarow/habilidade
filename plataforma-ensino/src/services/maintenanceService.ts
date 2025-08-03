/**
 * MaintenanceService - Sistema de gerenciamento de janelas de manutenção
 * Feature: FEATURE_003_MAINTENANCE_MODE
 * 
 * Responsável por:
 * - Agendar e gerenciar janelas de manutenção
 * - Controlar bypass de usuários administrativos
 * - Enviar notificações automáticas
 * - Gerenciar cache de status para performance
 */

import { createClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';
// import type { Database } from '@/types/database'; // Type file doesn't exist

// Types
export interface MaintenanceWindow {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  affectedServices: string[];
  bypassEnabled: boolean;
  notificationSent: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceBypassUser {
  id: string;
  userId: string;
  maintenanceWindowId?: string;
  expiresAt?: Date;
  isPermanent: boolean;
  createdBy?: string;
  createdAt: Date;
  lastUsedAt?: Date;
}

export interface MaintenanceStatus {
  isActive: boolean;
  currentMaintenance?: MaintenanceWindow;
  estimatedEndTime?: Date;
  affectedServices: string[];
  userHasBypass: boolean;
}

export interface NotificationTemplate {
  subject: string;
  body: string;
  variables: Record<string, string>;
}

// Cache for maintenance status to optimize performance
class MaintenanceCache {
  private static instance: MaintenanceCache;
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly TTL = parseInt(process.env.MAINTENANCE_CACHE_TTL || '300') * 1000; // 5 minutes default

  static getInstance(): MaintenanceCache {
    if (!MaintenanceCache.instance) {
      MaintenanceCache.instance = new MaintenanceCache();
    }
    return MaintenanceCache.instance;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.TTL
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export class MaintenanceService {
  private supabase;
  private cache = MaintenanceCache.getInstance();

  constructor(isServer = false) {
    this.supabase = isServer ? createServerClient() : createClient();
  }

  /**
   * Agendar nova janela de manutenção
   */
  async scheduleMaintenanceWindow(data: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    affectedServices: string[];
    bypassEnabled?: boolean;
  }): Promise<MaintenanceWindow> {
    try {
      // Validations
      if (data.endTime <= data.startTime) {
        throw new Error('End time must be after start time');
      }

      if (data.startTime <= new Date()) {
        throw new Error('Start time must be in the future');
      }

      // Check for overlapping maintenance windows
      const { data: overlapping, error: overlapError } = await this.supabase
        .from('maintenance_windows')
        .select('*')
        .eq('status', 'scheduled')
        .or(`start_time.lte.${data.endTime.toISOString()},end_time.gte.${data.startTime.toISOString()}`);

      if (overlapError) throw overlapError;
      if (overlapping && overlapping.length > 0) {
        throw new Error('Overlapping maintenance window already exists');
      }

      // Create maintenance window
      const { data: maintenance, error } = await this.supabase
        .from('maintenance_windows')
        .insert({
          title: data.title,
          description: data.description,
          start_time: data.startTime.toISOString(),
          end_time: data.endTime.toISOString(),
          affected_services: data.affectedServices,
          bypass_enabled: data.bypassEnabled ?? true,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      // Clear cache to force refresh
      this.cache.clear();

      // Log the scheduling
      console.log(`Maintenance window scheduled: ${maintenance.id} - ${data.title}`);

      return this.mapDatabaseToWindow(maintenance);
    } catch (error) {
      console.error('Error scheduling maintenance window:', error);
      throw error;
    }
  }

  /**
   * Ativar modo de manutenção manualmente ou automaticamente
   */
  async activateMaintenanceMode(windowId?: string): Promise<MaintenanceWindow> {
    try {
      let maintenance;

      if (windowId) {
        // Activate specific window
        const { data, error } = await this.supabase
          .from('maintenance_windows')
          .update({ status: 'active' })
          .eq('id', windowId)
          .eq('status', 'scheduled')
          .select()
          .single();

        if (error) throw error;
        if (!data) throw new Error('Maintenance window not found or already active');
        maintenance = data;
      } else {
        // Create emergency maintenance
        const now = new Date();
        const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours default

        const { data, error } = await this.supabase
          .from('maintenance_windows')
          .insert({
            title: 'Emergency Maintenance',
            description: 'Emergency maintenance activated manually',
            start_time: now.toISOString(),
            end_time: endTime.toISOString(),
            affected_services: ['all'],
            status: 'active',
            bypass_enabled: true
          })
          .select()
          .single();

        if (error) throw error;
        maintenance = data;
      }

      // Clear cache
      this.cache.clear();

      // Send notifications
      await this.sendMaintenanceNotifications(maintenance.id, 'activated');

      console.log(`Maintenance mode activated: ${maintenance.id}`);
      return this.mapDatabaseToWindow(maintenance);
    } catch (error) {
      console.error('Error activating maintenance mode:', error);
      throw error;
    }
  }

  /**
   * Desativar modo de manutenção
   */
  async deactivateMaintenanceMode(windowId?: string): Promise<void> {
    try {
      let query = this.supabase
        .from('maintenance_windows')
        .update({ status: 'completed' })
        .eq('status', 'active');

      if (windowId) {
        query = query.eq('id', windowId);
      }

      const { error } = await query;
      if (error) throw error;

      // Clear cache
      this.cache.clear();

      // Send completion notifications
      if (windowId) {
        await this.sendMaintenanceNotifications(windowId, 'completed');
      }

      console.log(`Maintenance mode deactivated${windowId ? `: ${windowId}` : ''}`);
    } catch (error) {
      console.error('Error deactivating maintenance mode:', error);
      throw error;
    }
  }

  /**
   * Verificar status atual do sistema de manutenção
   */
  async checkMaintenanceStatus(userId?: string): Promise<MaintenanceStatus> {
    try {
      const cacheKey = `maintenance_status_${userId || 'anonymous'}`;
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;

      // Get active maintenance
      const { data: activeMaintenance, error } = await this.supabase
        .from('maintenance_windows')
        .select('*')
        .eq('status', 'active')
        .order('start_time', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      let userHasBypass = false;
      if (userId && activeMaintenance) {
        const { data: bypass } = await this.supabase
          .from('maintenance_bypass_users')
          .select('*')
          .eq('user_id', userId)
          .or(`maintenance_window_id.eq.${activeMaintenance.id},is_permanent.eq.true`)
          .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
          .limit(1)
          .single();

        userHasBypass = !!bypass;
      }

      const status: MaintenanceStatus = {
        isActive: !!activeMaintenance,
        currentMaintenance: activeMaintenance ? this.mapDatabaseToWindow(activeMaintenance) : undefined,
        estimatedEndTime: activeMaintenance ? new Date(activeMaintenance.end_time) : undefined,
        affectedServices: activeMaintenance?.affected_services || [],
        userHasBypass
      };

      // Cache the result
      this.cache.set(cacheKey, status);

      return status;
    } catch (error) {
      console.error('Error checking maintenance status:', error);
      throw error;
    }
  }

  /**
   * Adicionar usuário ao bypass temporário
   */
  async addBypassUser(data: {
    userId: string;
    maintenanceWindowId?: string;
    expiresAt?: Date;
    isPermanent?: boolean;
  }): Promise<MaintenanceBypassUser> {
    try {
      const { data: bypass, error } = await this.supabase
        .from('maintenance_bypass_users')
        .insert({
          user_id: data.userId,
          maintenance_window_id: data.maintenanceWindowId,
          expires_at: data.expiresAt?.toISOString(),
          is_permanent: data.isPermanent || false
        })
        .select()
        .single();

      if (error) throw error;

      // Clear cache for this user
      this.cache.invalidate(`maintenance_status_${data.userId}`);

      console.log(`Bypass added for user: ${data.userId}`);
      return this.mapDatabaseToBypass(bypass);
    } catch (error) {
      console.error('Error adding bypass user:', error);
      throw error;
    }
  }

  /**
   * Remover usuário do bypass
   */
  async removeBypassUser(userId: string, maintenanceWindowId?: string): Promise<void> {
    try {
      let query = this.supabase
        .from('maintenance_bypass_users')
        .delete()
        .eq('user_id', userId);

      if (maintenanceWindowId) {
        query = query.eq('maintenance_window_id', maintenanceWindowId);
      }

      const { error } = await query;
      if (error) throw error;

      // Clear cache for this user
      this.cache.invalidate(`maintenance_status_${userId}`);

      console.log(`Bypass removed for user: ${userId}`);
    } catch (error) {
      console.error('Error removing bypass user:', error);
      throw error;
    }
  }

  /**
   * Enviar notificações de manutenção
   */
  async sendMaintenanceNotifications(
    windowId: string, 
    type: 'scheduled' | 'activated' | 'completed' | 'reminder'
  ): Promise<void> {
    try {
      // Get maintenance window details
      const { data: maintenance, error } = await this.supabase
        .from('maintenance_windows')
        .select('*')
        .eq('id', windowId)
        .single();

      if (error) throw error;

      // Get all users for notification
      const { data: users, error: usersError } = await this.supabase
        .from('users')
        .select('id, email, full_name')
        .not('email', 'is', null);

      if (usersError) throw usersError;

      // Prepare notification template
      const template = this.getNotificationTemplate(type, maintenance);

      // Send notifications (this would integrate with your email service)
      // For now, we'll just log the notifications
      console.log(`Sending ${type} notifications for maintenance ${windowId} to ${users?.length || 0} users`);
      console.log('Template:', template);

      // Mark notification as sent
      if (type === 'scheduled') {
        await this.supabase
          .from('maintenance_windows')
          .update({ notification_sent: true })
          .eq('id', windowId);
      }

      // Here you would integrate with your email service
      // Example: await emailService.sendBulk(users, template);

    } catch (error) {
      console.error('Error sending maintenance notifications:', error);
      throw error;
    }
  }

  /**
   * Listar janelas de manutenção
   */
  async listMaintenanceWindows(status?: MaintenanceWindow['status']): Promise<MaintenanceWindow[]> {
    try {
      let query = this.supabase
        .from('maintenance_windows')
        .select('*')
        .order('start_time', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data?.map(this.mapDatabaseToWindow) || [];
    } catch (error) {
      console.error('Error listing maintenance windows:', error);
      throw error;
    }
  }

  /**
   * Cleanup expired bypass users
   */
  async cleanupExpiredBypass(): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('cleanup_expired_bypass');
      if (error) throw error;
      
      console.log('Expired bypass users cleaned up');
    } catch (error) {
      console.error('Error cleaning up expired bypass:', error);
      throw error;
    }
  }

  // Private helper methods
  private mapDatabaseToWindow(data: any): MaintenanceWindow {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      startTime: new Date(data.start_time),
      endTime: new Date(data.end_time),
      status: data.status,
      affectedServices: data.affected_services || [],
      bypassEnabled: data.bypass_enabled,
      notificationSent: data.notification_sent,
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapDatabaseToBypass(data: any): MaintenanceBypassUser {
    return {
      id: data.id,
      userId: data.user_id,
      maintenanceWindowId: data.maintenance_window_id,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
      isPermanent: data.is_permanent,
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      lastUsedAt: data.last_used_at ? new Date(data.last_used_at) : undefined
    };
  }

  private getNotificationTemplate(type: string, maintenance: any): NotificationTemplate {
    const templates = {
      scheduled: {
        subject: `Manutenção Programada: ${maintenance.title}`,
        body: `Olá,\n\nUma manutenção foi programada em nossa plataforma.\n\nDetalhes:\n- Título: ${maintenance.title}\n- Descrição: ${maintenance.description || 'N/A'}\n- Início: ${new Date(maintenance.start_time).toLocaleString('pt-BR')}\n- Fim: ${new Date(maintenance.end_time).toLocaleString('pt-BR')}\n- Serviços afetados: ${maintenance.affected_services.join(', ')}\n\nDurante este período, alguns serviços podem ficar indisponíveis.\n\nObrigado pela compreensão.`,
        variables: { title: maintenance.title, description: maintenance.description }
      },
      activated: {
        subject: `Manutenção Ativada: ${maintenance.title}`,
        body: `A manutenção "${maintenance.title}" foi ativada.\n\nServiços afetados: ${maintenance.affected_services.join(', ')}\nPrevisão de conclusão: ${new Date(maintenance.end_time).toLocaleString('pt-BR')}`,
        variables: { title: maintenance.title }
      },
      completed: {
        subject: `Manutenção Concluída: ${maintenance.title}`,
        body: `A manutenção "${maintenance.title}" foi concluída com sucesso.\n\nTodos os serviços estão funcionando normalmente.`,
        variables: { title: maintenance.title }
      },
      reminder: {
        subject: `Lembrete: Manutenção em 1 hora - ${maintenance.title}`,
        body: `Lembramos que a manutenção "${maintenance.title}" será iniciada em aproximadamente 1 hora.\n\nInício previsto: ${new Date(maintenance.start_time).toLocaleString('pt-BR')}`,
        variables: { title: maintenance.title }
      }
    };

    return templates[type as keyof typeof templates] || templates.scheduled;
  }
}

// Export singleton instance
export const maintenanceService = new MaintenanceService();
export const serverMaintenanceService = new MaintenanceService(true);