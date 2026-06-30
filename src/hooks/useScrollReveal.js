import { useEffect, useRef } from 'react';

export function useScrollReveal() {
  const observerRef = useRef(null);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal, .reveal-scale');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
}

export function useMousePosition() {
  useEffect(() => {
    let frameId = 0;
    let nextX = 50;
    let nextY = 50;

    const updateCursorVars = () => {
      document.body.style.setProperty('--cursor-x', `${nextX}%`);
      document.body.style.setProperty('--cursor-y', `${nextY}%`);
      frameId = 0;
    };

    const handleMouseMove = (e) => {
      nextX = (e.clientX / window.innerWidth) * 100;
      nextY = (e.clientY / window.innerHeight) * 100;

      if (!frameId) {
        frameId = requestAnimationFrame(updateCursorVars);
      }
    };

    window.addEventListener('pointermove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleMouseMove);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);
}
