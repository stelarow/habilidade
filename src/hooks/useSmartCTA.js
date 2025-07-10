import { useMemo } from 'react';
import { usePageContext } from './usePageContext';
import { useScrollAnimation } from './useScrollAnimation';

export const useSmartCTA = () => {
  const { pageType, currentCourse } = usePageContext();
  const { scrolled } = useScrollAnimation();

  const ctaConfig = useMemo(() => {
    if (pageType === 'home') {
      return {
        primary: {
          label: scrolled ? 'Falar Conosco' : 'Área do Aluno',
          href: scrolled ? '#contato' : 'https://ead.escolahabilidade.com/',
          style: scrolled ? 'compact' : 'full'
        }
      };
    }

    if (pageType === 'coursePage') {
      return {
        primary: {
          label: 'Quero me Matricular',
          href: 'https://wa.me/5548988559491',
          style: 'full'
        }
      };
    }

    return {
      primary: {
        label: 'Fale Conosco',
        href: 'https://wa.me/5548988559491',
        style: 'compact'
      }
    };
  }, [pageType, currentCourse, scrolled]);

  return ctaConfig;
}; 