/**
 * A/B Testing Infrastructure for Blog Components
 * 
 * Sistema para testar diferentes layouts e componentes do blog
 * com feature flags e análise de significância estatística
 */

// Configurações de experimentos disponíveis
const EXPERIMENT_CONFIGS = {
  blogCardLayout: {
    name: 'Blog Card Layout Test',
    description: 'Testa diferentes layouts de cards de blog',
    variants: {
      control: { 
        name: 'Grid Layout (Controle)', 
        layout: 'grid',
        cardVariant: 'standard'
      },
      list: { 
        name: 'List Layout', 
        layout: 'list',
        cardVariant: 'compact'
      },
      masonry: {
        name: 'Masonry Layout',
        layout: 'masonry',
        cardVariant: 'featured'
      }
    },
    metrics: ['clickRate', 'timeOnPage', 'engagementRate'],
    minSampleSize: 100,
    significance: 0.05
  },

  ctaPlacement: {
    name: 'CTA Placement Test',
    description: 'Testa diferentes posições para CTAs nos artigos',
    variants: {
      control: { 
        name: 'CTA no Final (Controle)', 
        placement: 'bottom',
        style: 'standard'
      },
      inline: { 
        name: 'CTA Inline', 
        placement: 'inline',
        style: 'subtle'
      },
      sidebar: {
        name: 'CTA na Sidebar',
        placement: 'sidebar',
        style: 'prominent'
      },
      floating: {
        name: 'CTA Flutuante',
        placement: 'floating',
        style: 'minimal'
      }
    },
    metrics: ['conversionRate', 'clickRate', 'scrollDepth'],
    minSampleSize: 200,
    significance: 0.05
  },

  searchBarPosition: {
    name: 'Search Bar Position Test',
    description: 'Testa diferentes posições da barra de pesquisa',
    variants: {
      control: { 
        name: 'Sidebar (Controle)', 
        position: 'sidebar',
        style: 'default'
      },
      header: { 
        name: 'Header', 
        position: 'header',
        style: 'prominent'
      },
      floating: {
        name: 'Flutuante',
        position: 'floating',
        style: 'minimal'
      }
    },
    metrics: ['searchUsage', 'findabilityScore', 'sessionDuration'],
    minSampleSize: 150,
    significance: 0.05
  },

  categoryNavigation: {
    name: 'Category Navigation Style Test',
    description: 'Testa diferentes estilos de navegação por categorias',
    variants: {
      control: { 
        name: 'Lista Vertical (Controle)', 
        style: 'vertical-list',
        layout: 'sidebar'
      },
      tabs: { 
        name: 'Tabs Horizontais', 
        style: 'horizontal-tabs',
        layout: 'header'
      },
      dropdown: {
        name: 'Dropdown',
        style: 'dropdown',
        layout: 'compact'
      },
      pills: {
        name: 'Pills',
        style: 'pills',
        layout: 'inline'
      }
    },
    metrics: ['categoryEngagement', 'navigationClicks', 'contentDiscovery'],
    minSampleSize: 120,
    significance: 0.05
  }
};

// Storage keys
const STORAGE_KEYS = {
  experiments: 'blog_ab_experiments',
  metrics: 'blog_ab_metrics',
  assignments: 'blog_ab_assignments'
};

/**
 * Classe principal para gerenciar A/B Testing
 */
class ABTestingManager {
  constructor() {
    this.experiments = this.loadExperiments();
    this.assignments = this.loadAssignments();
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
  }

  /**
   * Gera um ID único para a sessão
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtém ou gera um ID único para o usuário (LGPD compliant)
   */
  getUserId() {
    let userId = localStorage.getItem('blog_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('blog_user_id', userId);
    }
    return userId;
  }

  /**
   * Carrega experimentos do localStorage
   */
  loadExperiments() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.experiments);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Erro ao carregar experimentos A/B:', error);
      return {};
    }
  }

  /**
   * Carrega atribuições de variantes do localStorage
   */
  loadAssignments() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.assignments);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Erro ao carregar atribuições A/B:', error);
      return {};
    }
  }

  /**
   * Salva experimentos no localStorage
   */
  saveExperiments() {
    try {
      localStorage.setItem(STORAGE_KEYS.experiments, JSON.stringify(this.experiments));
    } catch (error) {
      console.warn('Erro ao salvar experimentos A/B:', error);
    }
  }

  /**
   * Salva atribuições no localStorage
   */
  saveAssignments() {
    try {
      localStorage.setItem(STORAGE_KEYS.assignments, JSON.stringify(this.assignments));
    } catch (error) {
      console.warn('Erro ao salvar atribuições A/B:', error);
    }
  }

  /**
   * Inicia um experimento
   */
  startExperiment(experimentKey, config = {}) {
    if (!EXPERIMENT_CONFIGS[experimentKey]) {
      console.warn(`Experimento não configurado: ${experimentKey}`);
      return false;
    }

    const experimentConfig = {
      ...EXPERIMENT_CONFIGS[experimentKey],
      ...config,
      status: 'active',
      startDate: new Date().toISOString(),
      participants: 0,
      results: {}
    };

    this.experiments[experimentKey] = experimentConfig;
    this.saveExperiments();

    console.log(`Experimento iniciado: ${experimentConfig.name}`);
    return true;
  }

  /**
   * Para um experimento
   */
  stopExperiment(experimentKey) {
    if (!this.experiments[experimentKey]) {
      console.warn(`Experimento não encontrado: ${experimentKey}`);
      return false;
    }

    this.experiments[experimentKey].status = 'stopped';
    this.experiments[experimentKey].endDate = new Date().toISOString();
    this.saveExperiments();

    console.log(`Experimento parado: ${experimentKey}`);
    return true;
  }

  /**
   * Obtém a variante para um usuário em um experimento específico
   */
  getVariant(experimentKey) {
    // Verifica se o experimento existe e está ativo
    if (!this.experiments[experimentKey] || this.experiments[experimentKey].status !== 'active') {
      // Retorna variante de controle por padrão
      const config = EXPERIMENT_CONFIGS[experimentKey];
      return config ? config.variants.control : null;
    }

    // Verifica se o usuário já tem uma atribuição
    if (this.assignments[experimentKey]) {
      const assignment = this.assignments[experimentKey];
      const config = EXPERIMENT_CONFIGS[experimentKey];
      return config.variants[assignment.variant];
    }

    // Atribui uma nova variante usando hash do userId para consistência
    const variant = this.assignVariant(experimentKey);
    return variant;
  }

  /**
   * Atribui uma variante de forma consistente baseada no userId
   */
  assignVariant(experimentKey) {
    const config = EXPERIMENT_CONFIGS[experimentKey];
    if (!config) return null;

    // Usa hash simples do userId + experimentKey para determinismo
    const hash = this.simpleHash(this.userId + experimentKey);
    const variants = Object.keys(config.variants);
    const variantIndex = hash % variants.length;
    const selectedVariant = variants[variantIndex];

    // Salva a atribuição
    this.assignments[experimentKey] = {
      variant: selectedVariant,
      assignedAt: new Date().toISOString(),
      sessionId: this.sessionId
    };
    this.saveAssignments();

    // Incrementa contador de participantes
    this.experiments[experimentKey].participants++;
    this.saveExperiments();

    return config.variants[selectedVariant];
  }

  /**
   * Hash simples para distribuição consistente
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Registra uma métrica para um experimento
   */
  trackMetric(experimentKey, metricName, value, metadata = {}) {
    if (!this.experiments[experimentKey] || !this.assignments[experimentKey]) {
      return;
    }

    const assignment = this.assignments[experimentKey];
    const timestamp = new Date().toISOString();

    // Estrutura da métrica
    const metricData = {
      experimentKey,
      variant: assignment.variant,
      metricName,
      value,
      timestamp,
      sessionId: this.sessionId,
      userId: this.userId,
      metadata
    };

    // Salva no localStorage (em produção, enviaria para analytics)
    this.saveMetric(metricData);

    // Atualiza resultados do experimento
    this.updateExperimentResults(experimentKey, assignment.variant, metricName, value);
  }

  /**
   * Salva métrica no localStorage
   */
  saveMetric(metricData) {
    try {
      const metrics = JSON.parse(localStorage.getItem(STORAGE_KEYS.metrics) || '[]');
      metrics.push(metricData);
      
      // Mantém apenas as últimas 1000 métricas para evitar excesso de dados
      if (metrics.length > 1000) {
        metrics.splice(0, metrics.length - 1000);
      }
      
      localStorage.setItem(STORAGE_KEYS.metrics, JSON.stringify(metrics));
    } catch (error) {
      console.warn('Erro ao salvar métrica A/B:', error);
    }
  }

  /**
   * Atualiza resultados agregados do experimento
   */
  updateExperimentResults(experimentKey, variant, metricName, value) {
    const experiment = this.experiments[experimentKey];
    if (!experiment.results[variant]) {
      experiment.results[variant] = {};
    }
    if (!experiment.results[variant][metricName]) {
      experiment.results[variant][metricName] = {
        count: 0,
        sum: 0,
        average: 0,
        values: []
      };
    }

    const metric = experiment.results[variant][metricName];
    metric.count++;
    metric.sum += value;
    metric.average = metric.sum / metric.count;
    metric.values.push(value);

    // Mantém apenas as últimas 100 medições para calcular estatísticas
    if (metric.values.length > 100) {
      metric.values.shift();
    }

    this.saveExperiments();
  }

  /**
   * Calcula significância estatística entre variantes
   */
  calculateSignificance(experimentKey, metricName) {
    const experiment = this.experiments[experimentKey];
    if (!experiment || !experiment.results) {
      return null;
    }

    const variants = Object.keys(experiment.results);
    if (variants.length < 2) {
      return null;
    }

    const results = {};
    for (const variant of variants) {
      const metric = experiment.results[variant][metricName];
      if (metric && metric.count >= experiment.minSampleSize) {
        results[variant] = {
          mean: metric.average,
          count: metric.count,
          variance: this.calculateVariance(metric.values, metric.average)
        };
      }
    }

    // Calcula teste t entre controle e outras variantes
    const control = results.control;
    if (!control) return null;

    const comparisons = {};
    for (const [variant, data] of Object.entries(results)) {
      if (variant === 'control') continue;

      const tStat = this.calculateTStatistic(control, data);
      const pValue = this.calculatePValue(tStat, control.count + data.count - 2);
      
      comparisons[variant] = {
        tStatistic: tStat,
        pValue: pValue,
        significant: pValue < experiment.significance,
        improvement: ((data.mean - control.mean) / control.mean) * 100
      };
    }

    return comparisons;
  }

  /**
   * Calcula variância amostral
   */
  calculateVariance(values, mean) {
    if (values.length <= 1) return 0;
    
    const sumSquaredDiffs = values.reduce((sum, value) => {
      return sum + Math.pow(value - mean, 2);
    }, 0);
    
    return sumSquaredDiffs / (values.length - 1);
  }

  /**
   * Calcula estatística t para teste t de duas amostras
   */
  calculateTStatistic(sample1, sample2) {
    const pooledVariance = ((sample1.count - 1) * sample1.variance + 
                           (sample2.count - 1) * sample2.variance) / 
                          (sample1.count + sample2.count - 2);
    
    const standardError = Math.sqrt(pooledVariance * (1/sample1.count + 1/sample2.count));
    
    return (sample2.mean - sample1.mean) / standardError;
  }

  /**
   * Aproximação simples do p-value para teste t bicaudal
   */
  calculatePValue(tStat, degreesOfFreedom) {
    // Aproximação simples - em produção usaria biblioteca estatística mais robusta
    const absTStat = Math.abs(tStat);
    
    if (absTStat > 2.576) return 0.01;   // 99% confiança
    if (absTStat > 1.96) return 0.05;    // 95% confiança
    if (absTStat > 1.645) return 0.10;   // 90% confiança
    
    return 0.20; // Não significativo
  }

  /**
   * Obtém relatório completo de um experimento
   */
  getExperimentReport(experimentKey) {
    const experiment = this.experiments[experimentKey];
    if (!experiment) return null;

    const report = {
      ...experiment,
      duration: experiment.endDate 
        ? new Date(experiment.endDate) - new Date(experiment.startDate)
        : new Date() - new Date(experiment.startDate),
      status: experiment.status,
      significance: {}
    };

    // Calcula significância para cada métrica
    for (const metric of experiment.metrics) {
      report.significance[metric] = this.calculateSignificance(experimentKey, metric);
    }

    return report;
  }

  /**
   * Lista todos os experimentos ativos
   */
  getActiveExperiments() {
    return Object.entries(this.experiments)
      .filter(([_, experiment]) => experiment.status === 'active')
      .map(([key, experiment]) => ({ key, ...experiment }));
  }

  /**
   * Limpa dados antigos (LGPD compliance)
   */
  cleanupOldData(daysToKeep = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    try {
      // Limpa métricas antigas
      const metrics = JSON.parse(localStorage.getItem(STORAGE_KEYS.metrics) || '[]');
      const recentMetrics = metrics.filter(metric => 
        new Date(metric.timestamp) > cutoffDate
      );
      localStorage.setItem(STORAGE_KEYS.metrics, JSON.stringify(recentMetrics));

      // Limpa experimentos finalizados antigos
      const cleanedExperiments = {};
      for (const [key, experiment] of Object.entries(this.experiments)) {
        if (experiment.status === 'active' || 
            (experiment.endDate && new Date(experiment.endDate) > cutoffDate)) {
          cleanedExperiments[key] = experiment;
        }
      }
      this.experiments = cleanedExperiments;
      this.saveExperiments();

      console.log('Dados antigos de A/B testing limpos');
    } catch (error) {
      console.warn('Erro ao limpar dados antigos:', error);
    }
  }
}

// Instância singleton
const abTesting = new ABTestingManager();

// Funções de conveniência para uso nos componentes
export const useABTest = (experimentKey) => {
  const variant = abTesting.getVariant(experimentKey);
  const trackMetric = (metricName, value, metadata) => 
    abTesting.trackMetric(experimentKey, metricName, value, metadata);
  
  return { variant, trackMetric };
};

export const startExperiment = (experimentKey, config) => 
  abTesting.startExperiment(experimentKey, config);

export const stopExperiment = (experimentKey) => 
  abTesting.stopExperiment(experimentKey);

export const getExperimentReport = (experimentKey) => 
  abTesting.getExperimentReport(experimentKey);

export const getActiveExperiments = () => 
  abTesting.getActiveExperiments();

// Auto-limpeza de dados antigos na inicialização
if (typeof window !== 'undefined') {
  // Executa limpeza uma vez por dia
  const lastCleanup = localStorage.getItem('ab_last_cleanup');
  const today = new Date().toDateString();
  
  if (lastCleanup !== today) {
    abTesting.cleanupOldData();
    localStorage.setItem('ab_last_cleanup', today);
  }
}

export default abTesting;