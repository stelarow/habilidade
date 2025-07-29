// Email automation types
export interface FollowUpSequence {
  id: string;
  name: string;
  trigger: 'contact' | 'download' | 'signup';
  articleCategory?: string;
  emails: FollowUpEmail[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowUpEmail {
  id: string;
  delay: number; // em horas
  subject: string;
  template: string;
  variables: Record<string, any>;
  ctaUrl?: string;
  ctaText?: string;
}

export interface ScheduledTask {
  id: string;
  taskType: string;
  executeAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payload: Record<string, any>;
  retryCount: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailMetric {
  id: string;
  sequenceId: string;
  emailStep: number;
  eventType: 'sent' | 'opened' | 'clicked' | 'unsubscribed';
  eventData?: Record<string, any>;
  createdAt: Date;
}

export interface EmailSequenceRow {
  id: string;
  contact_email: string;
  sequence_type: string;
  article_slug?: string;
  article_category?: string;
  current_step: number;
  started_at: string;
  last_sent?: string;
  is_active: boolean;
  unsubscribed_at?: string;
  context_data?: Record<string, any>;
  created_at: string;
}

export interface ScheduledTaskRow {
  id: string;
  task_type: string;
  execute_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payload: Record<string, any>;
  retry_count: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailMetricRow {
  id: string;
  sequence_id: string;
  email_step: number;
  event_type: 'sent' | 'opened' | 'clicked' | 'unsubscribed';
  event_data?: Record<string, any>;
  created_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  category: string;
  isActive: boolean;
}

export interface EmailCampaignMetrics {
  sequenceId: string;
  sequenceName: string;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalUnsubscribed: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  conversionRate: number;
}

export interface LeadData {
  email: string;
  name?: string;
  articleSlug?: string;
  articleCategory?: string;
  source: 'contact' | 'whatsapp' | 'download' | 'signup';
  utmData?: Record<string, string>;
  contextData?: Record<string, any>;
}