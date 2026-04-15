/**
 * Lazy-loaded Framer Motion wrapper
 * Importa framer-motion apenas quando necessário para reduzir bundle inicial
 */
import React from 'react';

let motionModule = null;
let loadingPromise = null;

/**
 * Carrega Framer Motion dinamicamente
 */
const loadFramerMotion = () => {
  if (motionModule) return Promise.resolve(motionModule);
  if (loadingPromise) return loadingPromise;

  loadingPromise = import('framer-motion')
    .then(module => {
      motionModule = module;
      loadingPromise = null;
      return module;
    })
    .catch(error => {
      console.error('Failed to load framer-motion:', error);
      loadingPromise = null;
      return null;
    });

  return loadingPromise;
};

/**
 * Wrapper para motion que carrega dinamicamente
 * Usa div estática enquanto carrega
 */
export const motion = new Proxy(
  {},
  {
    get: (target, property) => {
      // Retorna componente que carrega motion dinamicamente
      return (properties) => {
        const [MotionComponent, setMotionComponent] = React.useState(null);

        React.useEffect(() => {
          loadFramerMotion().then(module => {
            if (module && module.motion && module.motion[property]) {
              setMotionComponent(() => module.motion[property]);
            }
          });
        }, []);

        // Fallback para elemento estático enquanto carrega
        if (!MotionComponent) {
          const { initial, animate, exit, variants, transition, whileHover, whileInView, whileTap, whileDrag, whileFocus, ...restProperties } = properties;
          return React.createElement(property, restProperties);
        }

        return React.createElement(MotionComponent, properties);
      };
    }
  }
);

/**
 * AnimatePresence wrapper
 */
export const AnimatePresence = ({ children, ...properties }) => {
  const [Component, setComponent] = React.useState(null);

  React.useEffect(() => {
    loadFramerMotion().then(module => {
      if (module && module.AnimatePresence) {
        setComponent(() => module.AnimatePresence);
      }
    });
  }, []);

  // Renderiza children diretamente enquanto não carrega
  if (!Component) {
    return children;
  }

  return React.createElement(Component, properties, children);
};

// Para compatibilidade com código existente
export default motion;


// Hook para pré-carregar framer motion
export const usePreloadMotion = () => {
  React.useEffect(() => {
    loadFramerMotion();
  }, []);
};