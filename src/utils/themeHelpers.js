/**
 * Helpers para sistema de cores dinâmico por curso
 * Gerencia cores temáticas e aplicação de estilos
 */

/**
 * Extrai cores do curso e converte para formato utilizável
 * @param {Object} course - Dados do curso com themeColors
 * @returns {Object} - Cores processadas e estilos CSS
 */
export function getThemeColors(course) {
  if (!course?.themeColors) {
    return getDefaultTheme();
  }

  const { primary, secondary, accent, gradient } = course.themeColors;

  return {
    primary,
    secondary,
    accent,
    gradient,
    // Variações de opacidade
    primaryWithOpacity: (opacity = 0.1) => `${primary}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
    secondaryWithOpacity: (opacity = 0.1) => `${secondary}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
    accentWithOpacity: (opacity = 0.1) => `${accent}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
    
    // CSS Custom Properties
    cssVars: {
      '--course-primary': primary,
      '--course-secondary': secondary,
      '--course-accent': accent,
      '--course-gradient-from': gradient.from,
      '--course-gradient-to': gradient.to,
    },
    
    // Estilos inline prontos
    styles: {
      primaryText: { color: primary },
      secondaryText: { color: secondary },
      accentText: { color: accent },
      primaryBackground: { backgroundColor: primary },
      secondaryBackground: { backgroundColor: secondary },
      accentBackground: { backgroundColor: accent },
      gradient: { 
        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` 
      },
      gradientHover: { 
        background: `linear-gradient(135deg, ${gradient.from}dd, ${gradient.to}dd)` 
      },
    }
  };
}

/**
 * Gera variações de cores para hover effects
 * @param {string} color - Cor base em hex
 * @param {number} amount - Quantidade de escurecimento/clareamento (-100 a 100)
 * @returns {string} - Cor modificada
 */
export function adjustColorBrightness(color, amount) {
  const usePound = color[0] === "#";
  const col = usePound ? color.slice(1) : color;
  
  const num = parseInt(col, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

/**
 * Converte cor hex para RGB
 * @param {string} hex - Cor em formato hex
 * @returns {Object} - {r, g, b}
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Converte RGB para hex
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} - Cor em hex
 */
export function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Calcula se a cor é clara ou escura
 * @param {string} hex - Cor em hex
 * @returns {boolean} - true se for clara
 */
export function isLightColor(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128;
}

/**
 * Gera cor de texto contraste para uma cor de fundo
 * @param {string} backgroundColor - Cor de fundo em hex
 * @returns {string} - '#ffffff' ou '#000000'
 */
export function getContrastColor(backgroundColor) {
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
}

/**
 * Aplica tema do curso dinamicamente no DOM
 * @param {Object} course - Dados do curso
 */
export function applyDynamicTheme(course) {
  const theme = getThemeColors(course);
  const root = document.documentElement;
  
  // Aplica CSS custom properties
  Object.entries(theme.cssVars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Adiciona classes dinâmicas
  const body = document.body;
  body.classList.remove('theme-applied');
  body.classList.add('theme-applied');
  
  // Meta theme-color para mobile
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    document.head.appendChild(metaThemeColor);
  }
  metaThemeColor.content = theme.primary;
}

/**
 * Remove tema dinâmico aplicado
 */
export function removeDynamicTheme() {
  const root = document.documentElement;
  const themeVars = [
    '--course-primary',
    '--course-secondary', 
    '--course-accent',
    '--course-gradient-from',
    '--course-gradient-to'
  ];
  
  themeVars.forEach(varName => {
    root.style.removeProperty(varName);
  });
  
  document.body.classList.remove('theme-applied');
}

/**
 * Gera gradientes personalizados
 * @param {Object} colors - Cores do tema
 * @param {string} direction - Direção do gradiente
 * @returns {Object} - Estilos de gradiente
 */
export function generateGradients(colors, direction = '135deg') {
  return {
    primary: `linear-gradient(${direction}, ${colors.primary}, ${adjustColorBrightness(colors.primary, -20)})`,
    secondary: `linear-gradient(${direction}, ${colors.secondary}, ${adjustColorBrightness(colors.secondary, -20)})`,
    accent: `linear-gradient(${direction}, ${colors.accent}, ${adjustColorBrightness(colors.accent, -20)})`,
    theme: `linear-gradient(${direction}, ${colors.gradient.from}, ${colors.gradient.to})`,
    subtle: `linear-gradient(${direction}, ${colors.primary}10, ${colors.secondary}10)`,
  };
}

/**
 * Gera hover effects para cores
 * @param {Object} colors - Cores do tema
 * @returns {Object} - Estilos de hover
 */
export function generateHoverEffects(colors) {
  return {
    primary: {
      color: adjustColorBrightness(colors.primary, 20),
      transition: 'color 0.3s ease'
    },
    secondary: {
      color: adjustColorBrightness(colors.secondary, 20),
      transition: 'color 0.3s ease'
    },
    accent: {
      color: adjustColorBrightness(colors.accent, 20),
      transition: 'color 0.3s ease'
    },
    background: {
      backgroundColor: adjustColorBrightness(colors.primary, -10),
      transition: 'background-color 0.3s ease'
    }
  };
}

/**
 * Tema padrão caso o curso não tenha cores definidas
 * @returns {Object} - Tema padrão
 */
export function getDefaultTheme() {
  return {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#06B6D4',
    gradient: {
      from: '#3B82F6',
      to: '#8B5CF6',
    },
    primaryWithOpacity: (opacity = 0.1) => `#3B82F6${Math.round(opacity * 255).toString(16)}`,
    secondaryWithOpacity: (opacity = 0.1) => `#8B5CF6${Math.round(opacity * 255).toString(16)}`,
    accentWithOpacity: (opacity = 0.1) => `#06B6D4${Math.round(opacity * 255).toString(16)}`,
    cssVars: {
      '--course-primary': '#3B82F6',
      '--course-secondary': '#8B5CF6',
      '--course-accent': '#06B6D4',
      '--course-gradient-from': '#3B82F6',
      '--course-gradient-to': '#8B5CF6',
    },
    styles: {
      primaryText: { color: '#3B82F6' },
      secondaryText: { color: '#8B5CF6' },
      accentText: { color: '#06B6D4' },
      primaryBackground: { backgroundColor: '#3B82F6' },
      secondaryBackground: { backgroundColor: '#8B5CF6' },
      accentBackground: { backgroundColor: '#06B6D4' },
      gradient: { background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' },
      gradientHover: { background: 'linear-gradient(135deg, #3B82F6dd, #8B5CF6dd)' },
    }
  };
}

/**
 * Valida se as cores do tema estão no formato correto
 * @param {Object} themeColors - Cores do tema
 * @returns {boolean} - true se válidas
 */
export function validateThemeColors(themeColors) {
  if (!themeColors) return false;
  
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  
  const requiredColors = ['primary', 'secondary', 'accent'];
  const hasRequiredColors = requiredColors.every(color => 
    themeColors[color] && hexPattern.test(themeColors[color])
  );
  
  const hasValidGradient = themeColors.gradient && 
    themeColors.gradient.from && 
    themeColors.gradient.to &&
    hexPattern.test(themeColors.gradient.from) &&
    hexPattern.test(themeColors.gradient.to);
  
  return hasRequiredColors && hasValidGradient;
}

export default {
  getThemeColors,
  adjustColorBrightness,
  hexToRgb,
  rgbToHex,
  isLightColor,
  getContrastColor,
  applyDynamicTheme,
  removeDynamicTheme,
  generateGradients,
  generateHoverEffects,
  getDefaultTheme,
  validateThemeColors,
}; 