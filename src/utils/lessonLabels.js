export const LESSON_LABELS = {
  'informatica': {
    video: 'Digital',
    text: 'Teoria',
    exercise: 'Prática',
    project: 'Projeto'
  },
  'design-grafico': {
    video: 'Criação',
    text: 'Teoria',
    exercise: 'Exercício',
    project: 'Projeto'
  },
  'programacao': {
    video: 'Código',
    text: 'Teoria',
    exercise: 'Exercício',
    project: 'Projeto'
  },
  'marketing-digital': {
    video: 'Campanha',
    text: 'Teoria',
    exercise: 'Exercício',
    project: 'Projeto'
  },
  'inteligencia-artificial': {
    video: 'Automação',
    text: 'Teoria',
    exercise: 'Exercício',
    project: 'Projeto'
  },
  'business-intelligence': {
    video: 'Análise',
    text: 'Teoria',
    exercise: 'Exercício',
    project: 'Projeto'
  },
  'projetista-3d': {
    video: 'Modelagem',
    text: 'Teoria',
    exercise: 'Exercício',
    project: 'Projeto'
  }
};

export const getLessonLabel = (courseSlug, lessonType) => {
  const areaLabels = LESSON_LABELS[courseSlug];
  
  if (!areaLabels) {
    // Fallback para labels genéricos
    switch (lessonType) {
      case 'video': return 'Aula';
      case 'text': return 'Teoria';
      case 'exercise': return 'Exercício';
      case 'project': return 'Projeto';
      default: return 'Aula';
    }
  }
  
  return areaLabels[lessonType] || 'Aula';
}; 