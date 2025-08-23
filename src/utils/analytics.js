/**
 * Sistema de Analytics para Escola Habilidade
 * Tracking de eventos do Teste Vocacional e conversões
 */

// Verificar se gtag está disponível
const isGtagAvailable = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Enviar evento para Google Analytics
export const trackEvent = (eventName, parameters = {}) => {
  if (!isGtagAvailable()) {
    console.log('[Analytics Dev]', eventName, parameters);
    return;
  }

  window.gtag('event', eventName, {
    ...parameters,
    timestamp: new Date().toISOString(),
  });
};

// Eventos específicos do Teste Vocacional
export const analytics = {
  // Hero CTA
  trackHeroTestClick: () => {
    trackEvent('teste_vocacional_hero_click', {
      event_category: 'Teste Vocacional',
      event_label: 'Hero CTA',
      page_location: 'homepage_hero',
    });
  },

  // Página do Teste
  trackTestPageView: () => {
    trackEvent('page_view', {
      page_title: 'Teste Vocacional',
      page_path: '/teste-vocacional',
      event_category: 'Teste Vocacional',
    });
  },

  trackTestStart: (userName = 'Anônimo') => {
    trackEvent('teste_vocacional_inicio', {
      event_category: 'Teste Vocacional',
      event_label: 'Início do Teste',
      user_name: userName,
    });
  },

  trackQuestionAnswered: (questionNumber, questionText, answer) => {
    trackEvent('teste_vocacional_resposta', {
      event_category: 'Teste Vocacional',
      event_label: `Pergunta ${questionNumber}`,
      question: questionText,
      answer: answer,
      question_number: questionNumber,
    });
  },

  trackTestProgress: (currentQuestion, totalQuestions) => {
    const progressPercentage = Math.round((currentQuestion / totalQuestions) * 100);
    trackEvent('teste_vocacional_progresso', {
      event_category: 'Teste Vocacional',
      event_label: `Progresso ${progressPercentage}%`,
      current_question: currentQuestion,
      total_questions: totalQuestions,
      progress: progressPercentage,
    });
  },

  trackTestCompleted: (results, timeSpent) => {
    trackEvent('teste_vocacional_concluido', {
      event_category: 'Teste Vocacional',
      event_label: 'Teste Concluído',
      primary_area: results.primaryArea || 'Não identificado',
      secondary_area: results.secondaryArea || 'Não identificado',
      time_spent_seconds: timeSpent,
      value: 1, // Para contagem de conversões
    });
  },

  // Novo: Rastreamento de perfil combinado
  trackCombinedProfile: (topAreas, profileType = 'unknown') => {
    trackEvent('teste_vocacional_perfil_combinado', {
      event_category: 'Teste Vocacional',
      event_label: 'Perfil Combinado Identificado',
      primary_area: topAreas[0]?.area || 'desconhecido',
      secondary_area: topAreas[1]?.area || 'desconhecido',
      tertiary_area: topAreas[2]?.area || 'desconhecido',
      primary_score: topAreas[0]?.score || 0,
      secondary_score: topAreas[1]?.score || 0,
      tertiary_score: topAreas[2]?.score || 0,
      profile_type: profileType,
      combined_profile_key: `${topAreas[0]?.area || 'unknown'}-${topAreas[1]?.area || 'unknown'}`,
    });
  },

  // Novo: Rastreamento de compatibilidade de cursos
  trackCourseCompatibility: (recommendedCourses, userProfile) => {
    recommendedCourses.forEach((course, index) => {
      trackEvent('curso_compatibilidade_calculada', {
        event_category: 'Teste Vocacional',
        event_label: 'Compatibilidade de Curso',
        course_name: course.name,
        course_id: course.id,
        compatibility_score: course.compatibilityScore,
        compatibility_percentage: course.compatibilityPercentage,
        ranking_position: index + 1,
        user_primary_area: userProfile.primaryArea,
        user_secondary_area: userProfile.secondaryArea,
      });
    });
  },

  trackResultShared: (platform) => {
    trackEvent('share', {
      event_category: 'Teste Vocacional',
      event_label: 'Resultado Compartilhado',
      method: platform,
      content_type: 'teste_vocacional_resultado',
    });
  },

  trackPDFDownloaded: (resultArea) => {
    trackEvent('file_download', {
      event_category: 'Teste Vocacional',
      event_label: 'PDF Baixado',
      file_extension: 'pdf',
      file_name: 'resultado_teste_vocacional',
      result_area: resultArea,
    });
  },

  trackTestAbandoned: (questionNumber, timeSpent) => {
    trackEvent('teste_vocacional_abandonado', {
      event_category: 'Teste Vocacional',
      event_label: `Abandonado na pergunta ${questionNumber}`,
      question_number: questionNumber,
      time_spent_seconds: timeSpent,
    });
  },

  trackCourseClicked: (courseName, fromResult = false) => {
    trackEvent('teste_vocacional_curso_click', {
      event_category: 'Teste Vocacional',
      event_label: courseName,
      from_result_page: fromResult,
      course_name: courseName,
    });
  },

  trackContactFromTest: (contactMethod) => {
    trackEvent('teste_vocacional_contato', {
      event_category: 'Teste Vocacional',
      event_label: 'Contato Iniciado',
      contact_method: contactMethod, // whatsapp, email, phone
    });
  },

  trackTestRestart: () => {
    trackEvent('teste_vocacional_reiniciar', {
      event_category: 'Teste Vocacional',
      event_label: 'Teste Reiniciado',
    });
  },

  // Métricas de Performance
  trackPerformance: (metric, value) => {
    trackEvent('performance_metric', {
      event_category: 'Performance',
      event_label: metric,
      value: value,
      metric_name: metric,
    });
  },

  // User Timing API para medir tempo
  measureTestDuration: {
    start: () => {
      if (typeof window !== 'undefined' && window.performance) {
        window.performance.mark('teste_vocacional_start');
      }
    },
    end: () => {
      if (typeof window !== 'undefined' && window.performance) {
        window.performance.mark('teste_vocacional_end');
        window.performance.measure(
          'teste_vocacional_duration',
          'teste_vocacional_start',
          'teste_vocacional_end'
        );
        
        const measure = window.performance.getEntriesByName('teste_vocacional_duration')[0];
        if (measure) {
          const durationInSeconds = Math.round(measure.duration / 1000);
          return durationInSeconds;
        }
      }
      return 0;
    },
  },
};

// Funções auxiliares para dashboard
export const getAnalyticsData = () => {
  // Em produção, isso viria do Google Analytics API
  // Por enquanto, retorna dados mockados para desenvolvimento
  return {
    totalTests: 0,
    completionRate: 0,
    avgTimeSpent: 0,
    topAreas: [],
    conversionRate: 0,
  };
};

// Auto-track page views
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const path = window.location.pathname;
    if (path === '/teste-vocacional') {
      analytics.trackTestPageView();
    }
  });
}

export default analytics;