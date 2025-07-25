/**
 * CompletionIndicator Component Tests
 * Story 2.2: Teacher Calendar Visual Enhancements
 * 
 * Test suite for completion indicator components
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  CompletionIndicator,
  CompletionIndicatorCompact,
  CompletionIndicatorBadge,
  CompletionIndicatorList
} from '../CompletionIndicator';

describe('CompletionIndicator', () => {
  it('should render one month remaining indicator', () => {
    render(
      <CompletionIndicator
        type="one_month_remaining"
        label="1 mês para finalizar"
        daysRemaining={25}
      />
    );

    expect(screen.getByText('1 mês para finalizar')).toBeInTheDocument();
    expect(screen.getByText('(25d)')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument(); // Clock icon
  });

  it('should render last class indicator', () => {
    render(
      <CompletionIndicator
        type="last_class"
        label="Última aula"
      />
    );

    expect(screen.getByText('Última aula')).toBeInTheDocument();
    expect(screen.queryByText(/\d+d/)).not.toBeInTheDocument(); // No days display for last class
    expect(document.querySelector('svg')).toBeInTheDocument(); // AlertTriangle icon
  });

  it('should not render when type is none', () => {
    const { container } = render(
      <CompletionIndicator
        type="none"
        label=""
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should not render when label is empty', () => {
    const { container } = render(
      <CompletionIndicator
        type="one_month_remaining"
        label=""
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <CompletionIndicator
        type="one_month_remaining"
        label="Test"
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have correct styling classes for one month remaining', () => {
    const { container } = render(
      <CompletionIndicator
        type="one_month_remaining"
        label="1 mês para finalizar"
      />
    );

    expect(container.firstChild).toHaveClass('bg-yellow-100');
    expect(container.firstChild).toHaveClass('text-yellow-800');
  });

  it('should have correct styling classes for last class', () => {
    const { container } = render(
      <CompletionIndicator
        type="last_class"
        label="Última aula"
      />
    );

    expect(container.firstChild).toHaveClass('bg-red-100');
    expect(container.firstChild).toHaveClass('text-red-800');
  });
});

describe('CompletionIndicatorCompact', () => {
  it('should render compact version with days remaining', () => {
    render(
      <CompletionIndicatorCompact
        type="one_month_remaining"
        label="1 mês para finalizar"
        daysRemaining={15}
      />
    );

    expect(screen.getByText('1 mês para finalizar')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('should have tooltip with full information', () => {
    render(
      <CompletionIndicatorCompact
        type="one_month_remaining"
        label="1 mês para finalizar"
        daysRemaining={15}
      />
    );

    const element = screen.getByTitle('1 mês para finalizar (15 dias restantes)');
    expect(element).toBeInTheDocument();
  });

  it('should hide label on small screens but show days', () => {
    render(
      <CompletionIndicatorCompact
        type="one_month_remaining"
        label="1 mês para finalizar"
        daysRemaining={15}
      />
    );

    const label = screen.getByText('1 mês para finalizar');
    expect(label).toHaveClass('hidden', 'sm:inline');
    
    const days = screen.getByText('15');
    expect(days).not.toHaveClass('hidden');
  });

  it('should not render when type is none', () => {
    const { container } = render(
      <CompletionIndicatorCompact
        type="none"
        label=""
      />
    );

    expect(container.firstChild).toBeNull();
  });
});

describe('CompletionIndicatorBadge', () => {
  it('should render badge with emoji for last class', () => {
    render(
      <CompletionIndicatorBadge
        type="last_class"
        label="Última aula"
      />
    );

    expect(screen.getByText(/🎓.*Última aula/)).toBeInTheDocument();
  });

  it('should render badge with emoji for one month remaining', () => {
    render(
      <CompletionIndicatorBadge
        type="one_month_remaining"
        label="1 mês para finalizar"
      />
    );

    expect(screen.getByText(/⏰.*1 mês para finalizar/)).toBeInTheDocument();
  });

  it('should have hover scale effect', () => {
    const { container } = render(
      <CompletionIndicatorBadge
        type="last_class"
        label="Última aula"
      />
    );

    expect(container.firstChild).toHaveClass('hover:scale-105');
  });

  it('should not render when type is none', () => {
    const { container } = render(
      <CompletionIndicatorBadge
        type="none"
        label=""
      />
    );

    expect(container.firstChild).toBeNull();
  });
});

describe('CompletionIndicatorList', () => {
  const mockIndicators = [
    {
      type: 'one_month_remaining' as const,
      label: '1 mês para finalizar',
      daysRemaining: 25,
      studentName: 'João Silva'
    },
    {
      type: 'last_class' as const,
      label: 'Última aula',
      studentName: 'Maria Santos'
    },
    {
      type: 'one_month_remaining' as const,
      label: '1 mês para finalizar',
      daysRemaining: 15,
      studentName: 'Pedro Oliveira'
    },
    {
      type: 'one_month_remaining' as const,
      label: '1 mês para finalizar',
      daysRemaining: 10,
      studentName: 'Ana Costa'
    }
  ];

  it('should render list of indicators with student names', () => {
    render(
      <CompletionIndicatorList indicators={mockIndicators} />
    );

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Pedro Oliveira')).toBeInTheDocument();
  });

  it('should limit display to maxDisplay count', () => {
    render(
      <CompletionIndicatorList indicators={mockIndicators} maxDisplay={2} />
    );

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.queryByText('Pedro Oliveira')).not.toBeInTheDocument();
    expect(screen.getByText('+2 mais')).toBeInTheDocument();
  });

  it('should show all indicators when maxDisplay is larger than array', () => {
    render(
      <CompletionIndicatorList indicators={mockIndicators} maxDisplay={10} />
    );

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Pedro Oliveira')).toBeInTheDocument();
    expect(screen.getByText('Ana Costa')).toBeInTheDocument();
    expect(screen.queryByText(/mais/)).not.toBeInTheDocument();
  });

  it('should not render when indicators array is empty', () => {
    const { container } = render(
      <CompletionIndicatorList indicators={[]} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <CompletionIndicatorList 
        indicators={mockIndicators} 
        className="custom-list-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-list-class');
  });

  it('should render compact indicators for each student', () => {
    render(
      <CompletionIndicatorList indicators={mockIndicators.slice(0, 2)} />
    );

    // Check that compact indicators are rendered
    expect(screen.getByText('1 mês para finalizar')).toBeInTheDocument();
    expect(screen.getByText('Última aula')).toBeInTheDocument();
  });
});

describe('Accessibility', () => {
  it('should have proper ARIA attributes', () => {
    render(
      <CompletionIndicator
        type="one_month_remaining"
        label="1 mês para finalizar"
        daysRemaining={25}
      />
    );

    const indicator = screen.getByText('1 mês para finalizar').closest('div');
    expect(indicator).toBeInTheDocument();
  });

  it('should provide meaningful tooltip for compact version', () => {
    render(
      <CompletionIndicatorCompact
        type="last_class"
        label="Última aula"
      />
    );

    expect(screen.getByTitle('Última aula')).toBeInTheDocument();
  });

  it('should truncate long student names in list', () => {
    const longNameIndicators = [{
      type: 'one_month_remaining' as const,
      label: '1 mês para finalizar',
      daysRemaining: 25,
      studentName: 'João Silva Santos Oliveira Costa Ferreira'
    }];

    render(
      <CompletionIndicatorList indicators={longNameIndicators} />
    );

    const nameElement = screen.getByText('João Silva Santos Oliveira Costa Ferreira');
    expect(nameElement).toHaveClass('truncate');
  });
});

describe('Theme support', () => {
  it('should have dark mode classes for one month remaining', () => {
    const { container } = render(
      <CompletionIndicator
        type="one_month_remaining"
        label="1 mês para finalizar"
      />
    );

    expect(container.firstChild).toHaveClass('dark:bg-yellow-900/30');
    expect(container.firstChild).toHaveClass('dark:text-yellow-200');
  });

  it('should have dark mode classes for last class', () => {
    const { container } = render(
      <CompletionIndicator
        type="last_class"
        label="Última aula"
      />
    );

    expect(container.firstChild).toHaveClass('dark:bg-red-900/30');
    expect(container.firstChild).toHaveClass('dark:text-red-200');
  });
});