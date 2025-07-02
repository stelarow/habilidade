// Mapeamento de ícones por área e tipo de aula
import {
  // Ícones atuais (manter)
  Article, PuzzlePiece, RocketLaunch,
  // Novos ícones por área
  Monitor, Gear,           // Informática
  PenNib, MagicWand,       // Design Gráfico
  Code, Lightning,         // Programação
  Megaphone, Target,       // Marketing Digital
  Robot, Sparkle,          // Inteligência Artificial
  ChartBar, ChartLine,     // Business Intelligence
  Cube, Buildings          // Projetista
} from 'phosphor-react';

export const AREA_ICONS = {
  'informatica': {
    normal: Monitor,
    special: Gear
  },
  'design-grafico': {
    normal: PenNib,
    special: MagicWand
  },
  'programacao': {
    normal: Code,
    special: Lightning
  },
  'marketing-digital': {
    normal: Megaphone,
    special: Target
  },
  'inteligencia-artificial': {
    normal: Robot,
    special: Sparkle
  },
  'business-intelligence': {
    normal: ChartBar,
    special: ChartLine
  },
  'projetista-3d': {
    normal: Cube,
    special: Buildings
  }
};

export const getLessonIconByArea = (courseSlug, lessonType) => {
  const areaIcons = AREA_ICONS[courseSlug];
  
  if (!areaIcons) {
    // Fallback para ícones genéricos atuais
    switch (lessonType) {
      case 'text': return Article;
      case 'exercise': return PuzzlePiece;
      case 'project': return RocketLaunch;
      default: return Monitor; // Fallback melhor que Play
    }
  }

  switch (lessonType) {
    case 'video': return areaIcons.normal;
    case 'text': return Article;
    case 'exercise': return areaIcons.special;
    case 'project': return areaIcons.special;
    default: return areaIcons.normal;
  }
}; 