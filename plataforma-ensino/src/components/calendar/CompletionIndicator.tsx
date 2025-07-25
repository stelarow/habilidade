/**
 * CompletionIndicator Component
 * Story 2.2: Teacher Calendar Visual Enhancements
 * 
 * Visual indicator component for displaying course completion status
 * in the teacher calendar interface
 */

'use client';

import { Clock, Calendar, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  CompletionIndicatorProps, 
  CompletionIndicatorType 
} from '@/types/completion-status';
import { getCompletionIndicatorClasses } from '@/utils/completionStatus';

/**
 * Get icon for completion indicator type
 */
function getIndicatorIcon(type: CompletionIndicatorType) {
  switch (type) {
    case 'one_month_remaining':
      return <Clock className="h-3 w-3" />;
    case 'last_class':
      return <AlertTriangle className="h-3 w-3" />;
    default:
      return <Calendar className="h-3 w-3" />;
  }
}

/**
 * CompletionIndicator component for displaying course completion status
 */
export function CompletionIndicator({ 
  type, 
  label, 
  daysRemaining, 
  className 
}: CompletionIndicatorProps) {
  // Don't render if no indicator type
  if (type === 'none' || !label) {
    return null;
  }

  const baseClasses = getCompletionIndicatorClasses(type);
  const icon = getIndicatorIcon(type);

  return (
    <div className={cn(
      "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200",
      "shadow-sm hover:shadow-md",
      baseClasses,
      className
    )}>
      {icon}
      <span className="truncate">{label}</span>
      {daysRemaining !== undefined && daysRemaining > 0 && type === 'one_month_remaining' && (
        <span className="text-xs opacity-75">
          ({daysRemaining}d)
        </span>
      )}
    </div>
  );
}

/**
 * Compact version of completion indicator for tight spaces
 */
export function CompletionIndicatorCompact({ 
  type, 
  label, 
  daysRemaining, 
  className 
}: CompletionIndicatorProps) {
  if (type === 'none' || !label) {
    return null;
  }

  const baseClasses = getCompletionIndicatorClasses(type);
  const icon = getIndicatorIcon(type);

  return (
    <div className={cn(
      "inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-xs font-medium",
      "transition-all duration-200",
      baseClasses,
      className
    )} 
    title={`${label}${daysRemaining ? ` (${daysRemaining} dias restantes)` : ''}`}>
      {icon}
      <span className="hidden sm:inline truncate">{label}</span>
      {daysRemaining !== undefined && daysRemaining > 0 && (
        <span className="text-xs font-bold">
          {daysRemaining}
        </span>
      )}
    </div>
  );
}

/**
 * Badge version of completion indicator
 */
export function CompletionIndicatorBadge({ 
  type, 
  label, 
  daysRemaining, 
  className 
}: CompletionIndicatorProps) {
  if (type === 'none' || !label) {
    return null;
  }

  const baseClasses = getCompletionIndicatorClasses(type);

  return (
    <div className={cn(
      "inline-block px-2 py-1 rounded-full text-xs font-semibold text-center",
      "transition-all duration-200 hover:scale-105",
      baseClasses,
      className
    )}>
      {type === 'last_class' ? '🎓' : '⏰'} {label}
    </div>
  );
}

/**
 * List of completion indicators for multiple students
 */
interface CompletionIndicatorListProps {
  indicators: Array<{
    type: CompletionIndicatorType;
    label: string;
    daysRemaining?: number;
    studentName: string;
  }>;
  maxDisplay?: number;
  className?: string;
}

export function CompletionIndicatorList({ 
  indicators, 
  maxDisplay = 3, 
  className 
}: CompletionIndicatorListProps) {
  if (!indicators.length) {
    return null;
  }

  const visibleIndicators = indicators.slice(0, maxDisplay);
  const hiddenCount = indicators.length - maxDisplay;

  return (
    <div className={cn("space-y-1", className)}>
      {visibleIndicators.map((indicator, index) => (
        <div key={index} className="flex items-center justify-between space-x-2">
          <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {indicator.studentName}
          </span>
          <CompletionIndicatorCompact
            type={indicator.type}
            label={indicator.label}
            daysRemaining={indicator.daysRemaining}
          />
        </div>
      ))}
      {hiddenCount > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
          +{hiddenCount} mais
        </div>
      )}
    </div>
  );
}

export default CompletionIndicator;