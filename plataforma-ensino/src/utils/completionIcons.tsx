import React from 'react'
import { Clock, FileText, ClipboardText, PuzzlePiece } from '@phosphor-icons/react'

export const getCompletionIcon = (
  type: 'time' | 'pdf' | 'exercises' | 'quiz',
  color: string,
  size: number = 20
): React.ReactNode => {
  const iconProps = {
    size,
    weight: 'duotone' as const,
    style: { color }
  }

  switch (type) {
    case 'time':
      return <Clock {...iconProps} />
    case 'pdf':
      return <FileText {...iconProps} />
    case 'exercises':
      return <ClipboardText {...iconProps} />
    case 'quiz':
      return <PuzzlePiece {...iconProps} />
    default:
      return null
  }
}