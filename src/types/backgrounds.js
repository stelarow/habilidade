/**
 * Configurações de performance para cada background
 */
export const PERFORMANCE_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high'
};

/**
 * Configuração de um background de curso
 * @typedef {Object} CourseBackground
 * @property {string} slug - Slug único do curso
 * @property {string} title - Nome do curso para debug
 * @property {React.LazyExoticComponent} component - Componente lazy-loaded
 * @property {string[]} preloadAssets - Assets para precarregar
 * @property {Object} performanceConfig - Configurações por nível de performance
 * @property {boolean} requiresWebGL - Se precisa de WebGL
 * @property {number} estimatedMemoryUsage - Uso estimado de memória em MB
 * @property {string[]} fallbackColors - Cores para fallback estático
 */

/**
 * Configurações específicas de performance
 * @typedef {Object} PerformanceConfig
 * @property {boolean} enabled - Se está habilitado neste nível
 * @property {number} particleCount - Número de partículas
 * @property {number} animationDuration - Duração das animações (ms)
 * @property {boolean} useWebGL - Se deve usar WebGL
 * @property {number} frameRate - FPS alvo
 * @property {boolean} complexShaders - Se usa shaders complexos
 */

/**
 * Slugs dos cursos disponíveis
 */
export const COURSE_SLUGS = {
  PROJETISTA_3D: 'projetista-3d',
  EDICAO_VIDEO: 'edicao-video',
  INFORMATICA: 'informatica',
  DESIGN_GRAFICO: 'design-grafico',
  PROGRAMACAO: 'programacao',
  MARKETING_DIGITAL: 'marketing-digital',
  INTELIGENCIA_ARTIFICIAL: 'inteligencia-artificial',
  BUSINESS_INTELLIGENCE: 'business-intelligence',
  ADMINISTRACAO: 'administracao'
};

/**
 * Configurações padrão para cada nível de performance
 */
export const DEFAULT_PERFORMANCE_CONFIG = {
  [PERFORMANCE_LEVELS.LOW]: {
    enabled: true,
    particleCount: 0,
    animationDuration: 0,
    useWebGL: false,
    frameRate: 30,
    complexShaders: false,
    staticFallback: true
  },
  [PERFORMANCE_LEVELS.MEDIUM]: {
    enabled: true,
    particleCount: 50,
    animationDuration: 2000,
    useWebGL: false,
    frameRate: 60,
    complexShaders: false,
    staticFallback: false
  },
  [PERFORMANCE_LEVELS.HIGH]: {
    enabled: true,
    particleCount: 150,
    animationDuration: 3000,
    useWebGL: true,
    frameRate: 60,
    complexShaders: true,
    staticFallback: false
  }
};

/**
 * Cores base para fallbacks estáticos de cada curso
 */
export const COURSE_FALLBACK_COLORS = {
  [COURSE_SLUGS.PROJETISTA_3D]: ['#FF6B35', '#F7931E', '#FFD23F'],
  [COURSE_SLUGS.EDICAO_VIDEO]: ['#FF4757', '#FF3838', '#FF6B9D'],
  [COURSE_SLUGS.INFORMATICA]: ['#3742FA', '#2F3542', '#57606F'],
  [COURSE_SLUGS.DESIGN_GRAFICO]: ['#FF6B9D', '#C44569', '#F8B500'],
  [COURSE_SLUGS.PROGRAMACAO]: ['#2ED573', '#1E90FF', '#70A1FF'],
  [COURSE_SLUGS.MARKETING_DIGITAL]: ['#FF9FF3', '#54A0FF', '#5F27CD'],
  [COURSE_SLUGS.INTELIGENCIA_ARTIFICIAL]: ['#00D2D3', '#FF9F43', '#54A0FF'],
  [COURSE_SLUGS.BUSINESS_INTELLIGENCE]: ['#FF6348', '#FF9F43', '#FFDD59'],
  [COURSE_SLUGS.ADMINISTRACAO]: ['#6366F1', '#8B5CF6', '#A78BFA']
};

/**
 * Métricas de performance para monitoramento
 * @typedef {Object} PerformanceMetrics
 * @property {number} renderTime - Tempo de renderização (ms)
 * @property {number} memoryUsage - Uso de memória (MB)
 * @property {number} fps - FPS médio
 * @property {number} loadTime - Tempo de carregamento (ms)
 * @property {boolean} webGLAvailable - Se WebGL está disponível
 * @property {string} deviceType - Tipo do dispositivo
 */

export default {
  PERFORMANCE_LEVELS,
  COURSE_SLUGS,
  DEFAULT_PERFORMANCE_CONFIG,
  COURSE_FALLBACK_COLORS
}; 