/**
 * Contact Integration Service (Temporarily Disabled)
 * This service will be re-enabled when EmailAutomationService is implemented
 */

export class ContactIntegrationService {
  constructor() {
    // Service temporarily disabled
  }

  async processContactFormSubmission(contactData: {
    email: string;
    name?: string;
    message?: string;
    articleSlug?: string;
    category?: string;
    source: "contact" | "whatsapp" | "download";
    utmData?: Record<string, string>;
  }): Promise<string> {
    console.log("ContactIntegrationService temporarily disabled");
    return "mock_sequence_" + Date.now();
  }

  async processUnsubscribe(token: string): Promise<boolean> {
    console.log("ContactIntegrationService temporarily disabled");
    return true;
  }

  public detectArticleCategory(articleSlug?: string): string {
    if (!articleSlug) return "geral";
    return "geral";
  }
}

let instance: ContactIntegrationService | null = null;

export function getContactIntegrationService(): ContactIntegrationService {
  if (!instance) {
    instance = new ContactIntegrationService();
  }
  return instance;
}
