'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Presentation } from 'lucide-react'

interface CanvaEmbedProps {
  embedUrl: string
  title?: string
  description?: string
  author?: string
  authorUrl?: string
  className?: string
  showHeader?: boolean
}

/**
 * Canva Embed Component
 * 
 * This component safely embeds Canva presentations into lesson pages.
 * It uses the provided HTML embed code structure with enhanced styling using shadcn components.
 * 
 * Key features:
 * - Responsive iframe container with proper aspect ratio
 * - Violet theme styling consistent with the platform
 * - Optional header with title, description, and author info
 * - External link to view presentation in Canva
 * - Loading state and error handling
 * - Accessibility support
 */
const CanvaEmbed: React.FC<CanvaEmbedProps> = ({
  embedUrl,
  title = "Apresentação",
  description,
  author,
  authorUrl,
  className = "",
  showHeader = true
}) => {
  // Validate embed URL
  if (!embedUrl || !embedUrl.includes('canva.com')) {
    return (
      <Card className={`border-red-200 bg-red-50 dark:bg-red-950/20 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-700 dark:text-red-400">
            URL de embed inválida. Por favor, verifique o link do Canva.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-violet-200 dark:border-violet-800 embed-container ${className}`}>
      {showHeader && (
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-violet-900 dark:text-violet-100">
                <Presentation className="h-5 w-5 text-violet-600" />
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="mt-2">
                  {description}
                </CardDescription>
              )}
              {author && (
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
                    {author}
                  </Badge>
                </div>
              )}
            </div>
            <a
              href={authorUrl || embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-200 transition-colors"
              aria-label="Abrir apresentação no Canva"
            >
              <ExternalLink className="h-4 w-4" />
              Ver no Canva
            </a>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        {/* Responsive iframe container with 16:9 aspect ratio */}
        <div 
          className="relative w-full overflow-hidden rounded-b-lg iframe-wrapper"
          style={{
            paddingTop: '56.25%', // 16:9 aspect ratio
            boxShadow: '0 2px 8px 0 rgba(139, 92, 246, 0.16)', // Violet shadow
            // Prevent hover state conflicts with iframe
            pointerEvents: 'none'
          }}
        >
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full border-0"
            loading="lazy"
            allow="fullscreen"
            title={title}
            style={{
              margin: 0,
              padding: 0,
              // Re-enable pointer events for the iframe itself
              pointerEvents: 'auto'
            }}
            // Sandbox the iframe to limit its capabilities and prevent excessive requests
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            // Add referrer policy to reduce tracking requests
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        
        {/* Footer with Canva branding (as required by Canva's terms) */}
        {author && authorUrl && (
          <div className="p-3 bg-violet-50 dark:bg-violet-950/30 border-t border-violet-200 dark:border-violet-800">
            <a
              href={authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-200 transition-colors"
            >
              {title} de {author}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CanvaEmbed