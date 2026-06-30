import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [isLight, setIsLight] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme');
      return saved === 'light';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const body = document.body;
    
    if (isLight) {
      body.classList.add('light-mode');
      // Force GPU-composite layer creation before transitions
      requestAnimationFrame(() => {
        body.classList.add('theme-transitioning');
        setTimeout(() => body.classList.remove('theme-transitioning'), 400);
      });
    } else {
      body.classList.add('theme-transitioning');
      body.classList.remove('light-mode');
      setTimeout(() => body.classList.remove('theme-transitioning'), 400);
    }
    
    try {
      localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    } catch {
      // localStorage may not be available
    }
  }, [isLight]);

  const toggleTheme = useCallback(() => {
    setIsLight(prev => !prev);
  }, []);

  return { isLight, toggleTheme };
}