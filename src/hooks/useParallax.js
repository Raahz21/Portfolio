import { useEffect, useRef } from 'react';

export function useParallaxScroll() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const sections = document.querySelectorAll('section');
    if (sections.length === 0) return;
    sectionsRef.current = sections;

    let ticking = false;
    let lastScrollY = window.scrollY;

    function updateParallax() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      lastScrollY = scrollY;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const distanceFromCenter = (sectionCenter - viewportCenter) / windowHeight;
        const clampedDistance = Math.max(-1.5, Math.min(1.5, distanceFromCenter));

        let translateY = 0;
        let scale = 1;
        let opacity = 1;
        let rotateX = 0;

        if (clampedDistance < 0) {
          const progress = Math.abs(clampedDistance);
          translateY = progress * 80;
          scale = Math.max(0.85, 1 - progress * 0.1);
          opacity = Math.max(0.4, 1 - progress * 0.35);
          rotateX = progress * 3;
        } else if (clampedDistance > 0) {
          const progress = clampedDistance;
          translateY = -progress * 50;
          scale = Math.max(0.9, 1 - progress * 0.06);
          opacity = Math.max(0.5, 1 - progress * 0.3);
          rotateX = -progress * 2;
        }

        section.style.transform = `
          perspective(1000px)
          translateY(${translateY}px)
          scale(${scale})
          rotateX(${rotateX}deg)
        `;
        section.style.opacity = opacity;
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();

    const handleResize = () => {
      updateParallax();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}

export function useParallaxTilt(ref, options = {}) {
  const { maxTilt = 18 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handlePointerDown = (e) => {
      el.classList.add('dragging');
      el.setPointerCapture(e.pointerId);
      setTilt(e.clientX, e.clientY);
    };

    const handlePointerMove = (e) => {
      if (!el.classList.contains('dragging')) return;
      setTilt(e.clientX, e.clientY);
    };

    const handlePointerUp = () => {
      el.classList.remove('dragging');
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
      el.style.setProperty('--glare-x', '50%');
      el.style.setProperty('--glare-y', '20%');
    };

    function setTilt(clientX, clientY) {
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      const tiltY = (x - 0.5) * maxTilt * 2;
      const tiltX = (0.5 - y) * maxTilt * 2;

      el.style.setProperty('--tilt-x', `${tiltX}deg`);
      el.style.setProperty('--tilt-y', `${tiltY}deg`);
      el.style.setProperty('--glare-x', `${x * 100}%`);
      el.style.setProperty('--glare-y', `${y * 100}%`);
    }

    el.addEventListener('pointerdown', handlePointerDown);
    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerup', handlePointerUp);
    el.addEventListener('pointercancel', handlePointerUp);
    el.addEventListener('lostpointercapture', handlePointerUp);

    return () => {
      el.removeEventListener('pointerdown', handlePointerDown);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerup', handlePointerUp);
      el.removeEventListener('pointercancel', handlePointerUp);
      el.removeEventListener('lostpointercapture', handlePointerUp);
    };
  }, [ref, maxTilt]);
}