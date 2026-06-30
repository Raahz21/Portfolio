import { useEffect, useRef, useCallback } from 'react';
import '../styles/techstack.css';

const techItems = [
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', label: 'HTML5' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', label: 'CSS3' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', label: 'JavaScript' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', label: 'React' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', label: 'Next.js' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', label: 'TypeScript' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', label: 'Tailwind' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', label: 'MySQL' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg', label: 'Prisma' },
  { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/github.svg', label: 'GitHub', isMono: true },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', label: 'Figma' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', label: 'VS Code' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', label: 'Git' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', label: 'Node.js' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', label: 'Python' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', label: 'Vue.js' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', label: 'Docker' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', label: 'Linux' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg', label: 'npm' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yarn/yarn-original.svg', label: 'Yarn' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg', label: 'Webpack' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg', label: 'Jest' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', label: 'MongoDB' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', label: 'PostgreSQL' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg', label: 'SASS' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg', label: 'ESLint' },
];

export default function TechStackSection() {
  const carouselRef = useRef(null);
  const itemsContainerRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    const container = itemsContainerRef.current;
    if (!carousel || !container) return;

    const originalItems = Array.from(container.querySelectorAll('.tech-item'));
    if (originalItems.length === 0) return;

    // Setup: clear and re-add with clones
    container.innerHTML = '';
    originalItems.forEach(item => container.appendChild(item));

    // Clone 6 times for seamless loop
    for (let i = 0; i < 6; i++) {
      originalItems.forEach(item => {
        container.appendChild(item.cloneNode(true));
      });
    }

    // Physics variables
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let rafId = null;
    let lastMoveX = 0;
    let lastMoveTime = 0;
    let autoScrollSpeed = 0.15; // very slow auto scroll per frame
    let isDragging = false;

    // Auto-scroll using requestAnimationFrame for smooth motion
    function autoScroll() {
      if (!isDown && !isDragging) {
        container.scrollLeft += autoScrollSpeed;
        
        // Reset for infinite loop when reaching the end
        const halfScroll = container.scrollWidth / 2;
        if (container.scrollLeft >= halfScroll) {
          container.scrollLeft = 0;
        }
      }
      rafId = requestAnimationFrame(autoScroll);
    }

    // Start auto-scroll
    rafId = requestAnimationFrame(autoScroll);

    // Drag handlers
    function startDrag(clientX) {
      isDown = true;
      carousel.classList.add('dragging');
      container.classList.add('paused');
      startX = clientX - carousel.offsetLeft;
      scrollLeft = container.scrollLeft;
      velocity = 0;
    }

    function doDrag(clientX) {
      if (!isDown) return;
      const x = clientX - carousel.offsetLeft;
      const walk = (x - startX) * 0.6; // smooth 0.6 multiplier
      const prevScrollLeft = container.scrollLeft;
      container.scrollLeft = scrollLeft - walk;
      
      // Calculate velocity based on actual movement
      velocity = container.scrollLeft - prevScrollLeft;
    }

    function endDrag() {
      if (!isDown) return;
      isDown = false;
      isDragging = true;
      carousel.classList.remove('dragging');
      container.classList.remove('paused');

      // Apply momentum with decay
      function applyMomentum() {
        velocity *= 0.92; // decay
        if (Math.abs(velocity) < 0.05) {
          isDragging = false;
          return;
        }
        container.scrollLeft += velocity;

        // Loop when reaching end
        const halfScroll = container.scrollWidth / 2;
        if (container.scrollLeft >= halfScroll) {
          container.scrollLeft -= halfScroll;
        } else if (container.scrollLeft < 0) {
          container.scrollLeft = 0;
        }

        requestAnimationFrame(applyMomentum);
      }
      
      if (Math.abs(velocity) > 0.1) {
        requestAnimationFrame(applyMomentum);
      } else {
        isDragging = false;
      }
    }

    // Mouse events
    const handleMouseDown = (e) => startDrag(e.pageX);
    const handleMouseMove = (e) => doDrag(e.pageX);
    const handleMouseUp = () => endDrag();

    // Touch events
    const handleTouchStart = (e) => startDrag(e.touches[0].pageX);
    const handleTouchMove = (e) => doDrag(e.touches[0].pageX);
    const handleTouchEnd = () => endDrag();

    carousel.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      carousel.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchmove', handleTouchMove);
      carousel.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <section className="tech-stack-section">
      <div className="tech-stack">
        <h3>Tech Stack</h3>
        <div className="tech-carousel" ref={carouselRef}>
          <div className="tech-items" ref={itemsContainerRef}>
            {techItems.map((item, index) => (
              <div className="tech-item" key={index}>
                <div className="tech-icon-box">
                  <img
                    src={item.src}
                    alt={item.label}
                    className={item.isMono ? 'mono-icon' : ''}
                  />
                </div>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}