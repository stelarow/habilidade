'use client'

import React from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

export interface TruncatedTextProps {
  /**
   * The text content to display
   */
  text: string
  /**
   * Maximum number of characters to display before truncation
   */
  maxLength: number
  /**
   * Additional CSS classes to apply to the text element
   */
  className?: string
  /**
   * Whether to show tooltip on hover when text is truncated
   * @default true
   */
  showTooltip?: boolean
  /**
   * Custom tooltip content (if different from full text)
   */
  tooltipContent?: string
  /**
   * HTML element to render as
   * @default 'span'
   */
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

/**
 * TruncatedText component that displays text with ellipsis when it exceeds maxLength
 * and shows a tooltip with the full text on hover
 */
export const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength,
  className,
  showTooltip = true,
  tooltipContent,
  as: Component = 'span'
}) => {
  // Handle edge cases for maxLength
  const normalizedMaxLength = Math.max(0, maxLength)
  
  // Check if text needs truncation
  const shouldTruncate = text.length > normalizedMaxLength
  const displayText = shouldTruncate ? `${text.slice(0, normalizedMaxLength)}...` : text
  const fullTooltipContent = tooltipContent || text

  // If no truncation needed or tooltip disabled, render simple text
  if (!shouldTruncate || !showTooltip) {
    return (
      <Component className={cn('inline-block', className)}>
        {displayText}
      </Component>
    )
  }

  // Render with tooltip for truncated text
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Component 
            className={cn(
              'inline-block cursor-help',
              className
            )}
          >
            {displayText}
          </Component>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={cn(
              'z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white shadow-md',
              'animate-in fade-in-0 zoom-in-95',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
              'max-w-xs break-words'
            )}
            sideOffset={4}
          >
            {fullTooltipContent}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export default TruncatedText