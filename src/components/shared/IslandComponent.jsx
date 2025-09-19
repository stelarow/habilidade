/**
 * Island Component - Progressive Hydration Wrapper
 * Enables selective hydration for React 19
 */

import { useState, useEffect, useRef, Suspense } from 'react';

/**
 * Island wrapper for progressive hydration
 * @param {Object} props
 * @param {React.ComponentType} props.component - Component to hydrate
 * @param {string} props.name - Component name for scheduling
 * @param {boolean} props.critical - Whether component is critical (hydrate immediately)
 * @param {React.ReactNode} props.fallback - Loading fallback
 * @param {Object} props.componentProps - Props to pass to wrapped component
 * @param {React.ReactNode} props.children - Children elements
 */
export function IslandComponent({
  component: Component,
  name,
  critical = false,
  fallback = null,
  componentProps = {},
  children,
  ...props
}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [shouldHydrate, setShouldHydrate] = useState(critical);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!shouldHydrate || isHydrated) return;

    const hydrateFn = (element) => {
      setIsHydrated(true);
      console.log(`🏝️ Island hydrated: ${name}`);
    };

    // Use global progressive hydration scheduler
    if (window.__scheduleHydration__) {
      window.__scheduleHydration__(name, elementRef.current, hydrateFn);
    } else {
      // Fallback for immediate hydration
      hydrateFn(elementRef.current);
    }
  }, [shouldHydrate, isHydrated, name]);

  // For non-critical components, use intersection observer
  useEffect(() => {
    if (critical || shouldHydrate) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldHydrate(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [critical, shouldHydrate]);

  // During SSG, always render the component
  if (typeof window === 'undefined') {
    return (
      <div ref={elementRef} data-island={name} {...props}>
        <Component {...componentProps}>
          {children}
        </Component>
      </div>
    );
  }

  // Client-side progressive hydration
  return (
    <div ref={elementRef} data-island={name} {...props}>
      {shouldHydrate ? (
        <Suspense fallback={fallback}>
          <Component {...componentProps}>
            {children}
          </Component>
        </Suspense>
      ) : (
        // Render static placeholder during SSG/before hydration
        <div data-island-placeholder={name}>
          {fallback || children}
        </div>
      )}
    </div>
  );
}

/**
 * HOC for creating island components
 */
export function withIslandHydration(Component, options = {}) {
  const {
    name = Component.displayName || Component.name || 'Anonymous',
    critical = false,
    fallback = null
  } = options;

  const WrappedComponent = (props) => (
    <IslandComponent
      component={Component}
      name={name}
      critical={critical}
      fallback={fallback}
      componentProps={props}
    />
  );

  WrappedComponent.displayName = `Island(${name})`;
  return WrappedComponent;
}