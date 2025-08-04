'use client'

import React from 'react'

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
        priority: 'high'
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
      priority: 'high'
    }]
  }
  
  private static detectSectionType(title: string, content: string): ContentSection['type'] {
    const titleLower = title.toLowerCase()
    
    // Learning objectives patterns
    if (titleLower.includes('objetivo') || titleLower.includes('aprend') || 
        titleLower.includes('meta')) {
      return 'objectives'
    }
    
    // Overview patterns
    if (titleLower.includes('visão geral') || titleLower.includes('introdução') || 
        titleLower.includes('resumo') || titleLower.includes('overview')) {
      return 'overview'
    }
    
    // Summary patterns
    if (titleLower.includes('conclusão') || titleLower.includes('resumo') || 
        titleLower.includes('síntese') || titleLower.includes('sumário')) {
      return 'summary'
    }
    
    // Exercise patterns
    if (titleLower.includes('exercício') || titleLower.includes('prática') || 
        titleLower.includes('atividade') || titleLower.includes('tarefa')) {
      return 'exercise'
    }
    
    // Tips patterns
    if (titleLower.includes('dica') || titleLower.includes('tip') || 
        titleLower.includes('importante')) {
      return 'tip'
    }
    
    // Resources patterns
    if (titleLower.includes('recurso') || titleLower.includes('material') || 
        titleLower.includes('referência') || titleLower.includes('link')) {
      return 'resources'
    }
    
    return 'content'
  }
  
  private static detectPriority(title: string, type: ContentSection['type']): ContentSection['priority'] {
    const titleLower = title.toLowerCase()
    
    // High priority indicators
    if (type === 'objectives' || type === 'overview' || 
        titleLower.includes('essencial') || titleLower.includes('fundamental') ||
        titleLower.includes('importante') || titleLower.includes('básico')) {
      return 'high'
    }
    
    // Low priority indicators
    if (type === 'resources' || titleLower.includes('adicional') || 
        titleLower.includes('complementar') || titleLower.includes('extra')) {
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
  
  static extractKeyTopics(content: string): string[] {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = content
    
    const topics: string[] = []
    
    // Extract from headings
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')
    headings.forEach(heading => {
      if (heading.textContent) {
        topics.push(heading.textContent.trim())
      }
    })
    
    // Extract from strong/bold text (often key concepts)
    const strongElements = tempDiv.querySelectorAll('strong, b')
    strongElements.forEach(element => {
      if (element.textContent && element.textContent.length < 50) {
        topics.push(element.textContent.trim())
      }
    })
    
    // Extract from list items (often key points)
    const listItems = tempDiv.querySelectorAll('li')
    listItems.forEach(item => {
      if (item.textContent && item.textContent.length < 100) {
        const text = item.textContent.trim()
        // Take first part if it's a complex sentence
        const firstPart = text.split('.')[0] || text.split(':')[0] || text
        if (firstPart.length < 80) {
          topics.push(firstPart.trim())
        }
      }
    })
    
    // Remove duplicates and return
    return [...new Set(topics)].slice(0, 10) // Limit to 10 topics
  }
  
  static generateContentOutline(sections: ContentSection[]): { title: string; subsections: string[] }[] {
    return sections.map(section => {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = section.content
      
      const subsections: string[] = []
      
      // Extract subsection headings
      const subHeadings = tempDiv.querySelectorAll('h3, h4, h5, h6')
      subHeadings.forEach(heading => {
        if (heading.textContent) {
          subsections.push(heading.textContent.trim())
        }
      })
      
      // If no subsections, extract key points from lists
      if (subsections.length === 0) {
        const listItems = tempDiv.querySelectorAll('li')
        listItems.forEach((item, index) => {
          if (item.textContent && index < 5) { // Limit to 5 items
            const text = item.textContent.trim()
            const shortText = text.length > 60 ? text.substring(0, 60) + '...' : text
            subsections.push(shortText)
          }
        })
      }
      
      return {
        title: section.title,
        subsections: subsections.slice(0, 8) // Limit subsections
      }
    })
  }
}

export default ContentAnalyzer