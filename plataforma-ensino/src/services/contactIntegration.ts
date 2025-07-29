import { EmailAutomationService } from './emailAutomation';
import { LeadData } from '@/types/email';

export class ContactIntegrationService {
  private emailService: EmailAutomationService;

  constructor() {
    this.emailService = new EmailAutomationService();
  }

  /**
   * Processa contato do formulário e inicia sequência de follow-up
   */
  async processContactFormSubmission(contactData: {
    email: string;
    name?: string;
    message?: string;
    articleSlug?: string;
    category?: string;
    source: 'contact' | 'whatsapp' | 'download';
    utmData?: Record<string, string>;
  }): Promise<string> {
    try {
      const leadData: LeadData = {
        email: contactData.email,
        name: contactData.name,
        articleSlug: contactData.articleSlug,
        articleCategory: contactData.category,
        source: contactData.source,
        utmData: contactData.utmData,
        contextData: {
          message: contactData.message,
          timestamp: new Date().toISOString()
        }
      };

      // Determinar tipo de sequência baseado na categoria do artigo
      let sequenceType: 'contact' | 'download' | 'signup' = 'contact';
      
      if (contactData.source === 'download') {
        sequenceType = 'download';
      } else if (contactData.source === 'whatsapp') {
        sequenceType = 'contact';
      }

      // Iniciar sequência de follow-up
      const sequenceId = await this.emailService.scheduleFollowUpSequence(
        leadData,
        sequenceType
      );

      console.log(`Follow-up iniciado para ${contactData.email} - Sequência: ${sequenceId}`);
      return sequenceId;
    } catch (error) {
      console.error('Erro ao processar contato:', error);
      throw error;
    }
  }

  /**
   * Processa link de unsubscribe
   */
  async processUnsubscribe(token: string): Promise<boolean> {
    try {
      return await this.emailService.unsubscribeUser(token);
    } catch (error) {
      console.error('Erro ao desinscrever usuário:', error);
      return false;
    }
  }

  /**
   * Detecta categoria do artigo baseado na URL ou slug
   */
  private detectArticleCategory(articleSlug?: string): string {
    if (!articleSlug) return 'geral';

    const categoryMap: Record<string, string> = {
      'tecnologia': 'tecnologia',
      'programacao': 'tecnologia',
      'javascript': 'tecnologia',
      'react': 'tecnologia',
      'python': 'tecnologia',
      'carreira': 'carreira',
      'promocao': 'carreira',
      'salario': 'carreira',
      'networking': 'carreira',
      'design': 'design',
      'photoshop': 'design',
      'figma': 'design',
      'ui-ux': 'design',
      'marketing': 'marketing',
      'digital': 'marketing',
      'vendas': 'marketing',
      'empreendedorismo': 'empreendedorismo',
      'negocios': 'empreendedorismo',
      'startup': 'empreendedorismo'
    };

    const slug = articleSlug.toLowerCase();
    
    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (slug.includes(keyword)) {
        return category;
      }
    }

    return 'geral';
  }

  /**
   * Enriquece dados do lead com informações adicionais
   */
  private enrichLeadData(contactData: any): LeadData {
    return {
      ...contactData,
      articleCategory: contactData.category || this.detectArticleCategory(contactData.articleSlug),
      contextData: {
        ...contactData.contextData,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Singleton instance
let contactIntegrationInstance: ContactIntegrationService | null = null;

export function getContactIntegrationService(): ContactIntegrationService {
  if (!contactIntegrationInstance) {
    contactIntegrationInstance = new ContactIntegrationService();
  }
  return contactIntegrationInstance;
}