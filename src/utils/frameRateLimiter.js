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
  static getOptimalFPS(performanceLevel) {
    switch (performanceLevel) {
      case 'LOW': return 0; // Estático
      case 'MEDIUM': return 20; // FPS reduzido
      case 'HIGH': return 30; // FPS otimizado (era 60)
      default: return 20;
    }
  }
}

export default FrameRateLimiter; 