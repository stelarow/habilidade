import * as React from 'react'

interface ContentSection {
  id: string
  title: string
  type: 'overview' | 'objectives' | 'content' | 'summary' | 'resources' | 'exercise' | 'tip'
  content: string
  estimatedTime?: number
  priority?: 'high' | 'medium' | 'low'
}

export class ContentAnalyzer {
  static parseContent(htmlContent: string): ContentSection[] {
    const sections: ContentSection[] = []
    
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    
    // Extract all headings and their content
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    if (headings.length === 0) {
      // No headings found, treat as single content section
      return [{
        id: 'main-content',
        title: 'Conteúdo Principal',
        type: 'content',
        content: htmlContent,
        estimatedTime: this.estimateReadingTime(htmlContent),
        priority: 'medium'
      }]
    }
    
    const elements = Array.from(tempDiv.children)
    let currentContent = ''
    
    // Process each element
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      const tagName = element.tagName.toLowerCase()
      
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        // Save previous section if exists
        if (currentContent.trim()) {
          const lastSection = sections[sections.length - 1]
          if (lastSection) {
            lastSection.content = currentContent
            lastSection.estimatedTime = this.estimateReadingTime(currentContent)
          }
          currentContent = ''
        }
        
        // Start new section
        const title = element.textContent || `Seção ${sections.length + 1}`
        const type = this.detectSectionType(title, element.innerHTML)
        
        const newSection: ContentSection = {
          id: `section-${sections.length + 1}`,
          title: title,
          type: type,
          content: '',
          priority: this.detectPriority(title, type)
        }
        
        sections.push(newSection)
      } else {
        // Add content to current section
        currentContent += element.outerHTML
      }
    }
    
    // Add final content
    if (currentContent.trim() && sections.length > 0) {
      const lastSection = sections[sections.length - 1]
      lastSection.content = currentContent
      lastSection.estimatedTime = this.estimateReadingTime(currentContent)
    }
    
    return sections.length > 0 ? sections : [{
      id: 'main-content',
      title: 'Conteúdo Principal',
      type: 'content',
      content: htmlContent,
      estimatedTime: this.estimateReadingTime(htmlContent),
      priority: 'medium'
    }]
  }

  private static detectSectionType(title: string, content: string): ContentSection['type'] {
    const titleLower = title.toLowerCase()
    
    if (titleLower.includes('objetivo') || titleLower.includes('meta')) {
      return 'objectives'
    } else if (titleLower.includes('resumo') || titleLower.includes('conclus')) {
      return 'summary'
    } else if (titleLower.includes('recurso') || titleLower.includes('material')) {
      return 'resources'
    } else if (titleLower.includes('exercí') || titleLower.includes('atividade') || titleLower.includes('prática')) {
      return 'exercise'
    } else if (titleLower.includes('dica') || titleLower.includes('importante') || titleLower.includes('atenção')) {
      return 'tip'
    } else if (titleLower.includes('visão geral') || titleLower.includes('introdução') || titleLower.includes('overview')) {
      return 'overview'
    }
    
    return 'content'
  }

  private static detectPriority(title: string, type: ContentSection['type']): ContentSection['priority'] {
    const titleLower = title.toLowerCase()
    
    // High priority sections
    if (type === 'objectives' || type === 'overview') {
      return 'high'
    }
    
    if (titleLower.includes('importante') || titleLower.includes('crítico') || titleLower.includes('essencial')) {
      return 'high'
    }
    
    // Low priority sections
    if (type === 'resources' || titleLower.includes('adicional') || titleLower.includes('complementar')) {
      return 'low'
    }
    
    return 'medium'
  }

  private static estimateReadingTime(content: string): number {
    // Remove HTML tags for word count
    const textContent = content.replace(/<[^>]*>/g, ' ')
    const words = textContent.split(/\s+/).filter(word => word.length > 0)
    
    // Average reading speed: 200 words per minute in Portuguese
    const wordsPerMinute = 200
    const minutes = Math.ceil(words.length / wordsPerMinute)
    
    return Math.max(1, minutes) // Minimum 1 minute
  }

  static generateProgress(sections: ContentSection[], currentSectionId: string): {
    current: number
    total: number
    percentage: number
    completed: string[]
    remaining: string[]
  } {
    const currentIndex = sections.findIndex(section => section.id === currentSectionId)
    const completed = sections.slice(0, currentIndex + 1).map(s => s.id)
    const remaining = sections.slice(currentIndex + 1).map(s => s.id)
    
    return {
      current: currentIndex + 1,
      total: sections.length,
      percentage: Math.round(((currentIndex + 1) / sections.length) * 100),
      completed,
      remaining
    }
  }

  static getNextSection(sections: ContentSection[], currentSectionId: string): ContentSection | null {
    const currentIndex = sections.findIndex(section => section.id === currentSectionId)
    return currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null
  }

  static getPreviousSection(sections: ContentSection[], currentSectionId: string): ContentSection | null {
    const currentIndex = sections.findIndex(section => section.id === currentSectionId)
    return currentIndex > 0 ? sections[currentIndex - 1] : null
  }

  static generateContentOutline(sections: ContentSection[]): any[] {
    return sections.map((section, index) => ({
      id: section.id,
      title: section.title,
      type: section.type,
      level: 1,
      order: index + 1,
      estimatedTime: section.estimatedTime || 1
    }))
  }

  static extractKeyTopics(content: string): string[] {
    // Simple keyword extraction
    const text = content.replace(/<[^>]*>/g, ' ').toLowerCase()
    const words = text.split(/\s+/)
    
    // Filter common words and get meaningful keywords
    const commonWords = ['o', 'a', 'de', 'da', 'do', 'que', 'e', 'em', 'um', 'uma', 'para', 'com', 'não', 'se', 'na', 'por', 'mais', 'as', 'os', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'suas', 'nem', 'nos', 'meu', 'minha', 'numa', 'pelos', 'pelas', 'esse', 'essa', 'num', 'essa', 'onde', 'bem', 'te', 'dos', 'me', 'este', 'esta', 'então', 'antes', 'nunca', 'nos', 'eu', 'nem', 'sempre', 'aqui', 'são', 'dele', 'dela', 'outros', 'outras']
    
    const meaningfulWords = words
      .filter(word => word.length > 3)
      .filter(word => !commonWords.includes(word))
      .filter(word => /^[a-záàâãéèêíïóôõöúçñ]+$/i.test(word))
    
    // Count frequency and return top keywords
    const frequency: Record<string, number> = {}
    meaningfulWords.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1
    })
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
  }
}

export type { ContentSection }