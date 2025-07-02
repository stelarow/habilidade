/**
 * Sistema de limitação de FPS para backgrounds
 * Otimiza performance limitando taxa de atualização
 */

class FrameRateLimiter {
  constructor(targetFPS = 30) {
    this.targetFPS = targetFPS;
    this.frameInterval = 1000 / targetFPS;
    this.lastFrameTime = 0;
    this.rafId = null;
  }

  // Executar callback apenas quando FPS permitir
  execute(callback) {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    if (deltaTime >= this.frameInterval) {
      callback(currentTime, deltaTime);
      this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
    }

    this.rafId = requestAnimationFrame(() => this.execute(callback));
  }

  // Parar limitador
  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // Ajustar FPS dinamicamente
  setTargetFPS(fps) {
    this.targetFPS = fps;
    this.frameInterval = 1000 / fps;
  }

  // FPS adaptativos baseados em performance
  static getOptimalFPS(performanceLevel, isTabActive = true) {
    // Reduzir drasticamente FPS quando aba não está ativa
    if (!isTabActive) return 1;
    
    switch (performanceLevel) {
      case 'low': return 0; // Estático
      case 'medium': return 15; // FPS mais reduzido (era 20)
      case 'high': return 24; // FPS moderado (era 30)
      default: return 15;
    }
  }

  // Limitar FPS baseado na visibilidade da aba
  static createAdaptiveLimiter(performanceLevel) {
    const isTabActive = !document.hidden;
    const targetFPS = FrameRateLimiter.getOptimalFPS(performanceLevel, isTabActive);
    
    if (targetFPS === 0) return null; // Sem animação
    
    return new FrameRateLimiter(targetFPS);
  }
}

export default FrameRateLimiter; 