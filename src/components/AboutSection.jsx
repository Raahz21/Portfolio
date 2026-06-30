import { useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import '../styles/about.css';

const techIcons = [
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', alt: 'HTML5' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', alt: 'CSS3' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', alt: 'JS' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', alt: 'React' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', alt: 'Next.js' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', alt: 'TS' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', alt: 'Tailwind' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', alt: 'MySQL' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg', alt: 'Prisma' },
  { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/github.svg', alt: 'GitHub', isMono: true },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', alt: 'Figma' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', alt: 'VS Code' },
];

const languages = ['HTML5', 'CSS3', 'JavaScript', 'TypeScript'];
const frameworks = ['React', 'Next.js', 'Tailwind', 'MySQL', 'Prisma'];
const tools = ['Git', 'GitHub', 'VS Code', 'Figma', 'MySQL Workbench', 'Postman', 'Vercel', 'Netlify', 'npm', 'Vite', 'Webpack'];

export default function AboutSection() {
  useScrollReveal();

  const trackRef = useRef(null);
  const railRef = useRef(null);

  // Vertical tech rail - physics-based smooth scrolling
  useEffect(() => {
    const track = trackRef.current;
    const rail = railRef.current;
    if (!track || !rail) return;

    const items = Array.from(track.querySelectorAll('.tech-rail-icon'));
    if (items.length === 0) return;

    // Clone items for seamless infinite loop
    for (let i = 0; i < 10; i++) {
      items.forEach(item => {
        track.appendChild(item.cloneNode(true));
      });
    }

    // Physics state
    let position = 0;
    let velocity = 0;
    let isDown = false;
    let isDragging = false;
    let lastY = 0;
    let rafId = null;
    let autoScrollPaused = false;
    let autoTimeout = null;
    let setHeight = 0;

    // Calculate one set height
    function calcHeight() {
      const allIcons = track.querySelectorAll('.tech-rail-icon');
      const count = items.length;
      if (!allIcons.length || !count) return;
      let h = 0;
      for (let i = 0; i < count && i < allIcons.length; i++) {
        h += allIcons[i].offsetHeight || 0;
      }
      h += 16 * (count - 1);
      setHeight = h;
    }

    requestAnimationFrame(calcHeight);

    // Loop position within bounds
    function normalizePos() {
      if (setHeight <= 0) return;
      while (position > 0) position -= setHeight;
      while (position < -setHeight) position += setHeight;
    }

    function applyTransform() {
      normalizePos();
      track.style.transform = `translateY(${position}px)`;
    }

    // Auto-scroll tick
    const AUTO_SPEED = 0.5; // pixels per frame (smooth medium speed)
    
    function tick() {
      if (!isDown && !isDragging && !autoScrollPaused) {
        position -= AUTO_SPEED;
        applyTransform();
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    // Mouse drag
    function handleMouseDown(e) {
      isDown = true;
      lastY = e.clientY;
      velocity = 0;
      rail.style.cursor = 'grabbing';
      if (autoTimeout) { clearTimeout(autoTimeout); autoTimeout = null; }
    }

    function handleMouseMove(e) {
      if (!isDown) return;
      const delta = e.clientY - lastY;
      position += delta * 0.7; // 0.7 sensitivity - responsive drag
      velocity = delta * 0.7;
      lastY = e.clientY;
      applyTransform();
    }

    function handleMouseUp() {
      if (!isDown) return;
      isDown = false;
      isDragging = true;
      rail.style.cursor = 'grab';

      // Momentum phase
      function momentum() {
        velocity *= 0.95; // decay
        if (Math.abs(velocity) < 0.05) {
          isDragging = false;
          // Resume auto after idle
          if (autoTimeout) clearTimeout(autoTimeout);
          autoTimeout = setTimeout(() => {
            autoScrollPaused = false;
            autoTimeout = null;
          }, 3000);
          return;
        }
        position += velocity;
        applyTransform();
        requestAnimationFrame(momentum);
      }

      if (Math.abs(velocity) > 0.05) {
        requestAnimationFrame(momentum);
      } else {
        isDragging = false;
        if (autoTimeout) clearTimeout(autoTimeout);
        autoTimeout = setTimeout(() => {
          autoScrollPaused = false;
          autoTimeout = null;
        }, 3000);
      }
    }

    // Wheel scroll
    function handleWheel(e) {
      e.preventDefault();
      autoScrollPaused = true;
      position -= e.deltaY * 0.5; // smooth scroll
      applyTransform();
      if (autoTimeout) { clearTimeout(autoTimeout); }
      autoTimeout = setTimeout(() => {
        autoScrollPaused = false;
        autoTimeout = null;
      }, 3000);
    }

    rail.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    rail.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (autoTimeout) clearTimeout(autoTimeout);
      rail.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      rail.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Vertical carousel text duplication
  useEffect(() => {
    const track = document.getElementById('vertical-carousel-track');
    if (!track) return;
    const items = Array.from(track.querySelectorAll('.vertical-carousel-text-item'));
    if (!items.length) return;
    items.forEach(item => track.appendChild(item.cloneNode(true)));
  }, []);

  // Flip cards
  useEffect(() => {
    const flipCards = document.querySelectorAll('.flip-card');
    if (!flipCards.length) return;

    const handleClick = (e) => {
      e.currentTarget.classList.toggle('flipped');
    };

    flipCards.forEach(card => {
      card.addEventListener('click', handleClick);
    });

    return () => {
      flipCards.forEach(card => {
        card.removeEventListener('click', handleClick);
      });
    };
  }, []);

  return (
    <section className="about-section" id="about">
      <div className="about-deco-circle about-deco-1"></div>
      <div className="about-deco-circle about-deco-2"></div>
      <div className="about-deco-dots"></div>
      <div className="about-deco-line"></div>

      <div className="about-inner">
        <div className="about-left">
          <div className="about-header reveal">
            <span className="about-section-label">About</span>
            <h2>Behind the Code</h2>
            <div className="about-divider">
              <span className="about-divider-line"></span>
              <span className="about-divider-diamond"></span>
              <span className="about-divider-line"></span>
            </div>
          </div>

          <div className="about-intro reveal">
            <p className="about-bio">
              I'm a passionate front-end developer with a love for creating elegant and intuitive digital experiences.
              With expertise in HTML, CSS, JavaScript, and modern frameworks, I specialize in building responsive websites
              that not only look great but also perform exceptionally well.
            </p>
            <p className="about-bio">
              My journey in web development is driven by a commitment to clean code, best practices, and continuous learning.
              I believe in creating interfaces that users love to interact with.
            </p>
          </div>

          <div className="about-subsection reveal">
            <h3 className="about-subsection-title">
              <span className="subsection-icon">🎓</span>
              Education
            </h3>
            <div className="about-timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-year">2022 — 2026</span>
                  <h4>Bachelor of Science in Computer Engineering</h4>
                  <p>Cebu Technological University – Danao Campus</p>
                  <span className="timeline-honor">Cum Laude</span>
                </div>
              </div>
            </div>
          </div>

          <div className="about-subsection reveal">
            <h3 className="about-subsection-title">
              <span className="subsection-icon">💼</span>
              Experience
            </h3>
            <div className="about-timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <p>Built responsive and interactive web applications using modern frontend technologies.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <p>Developed personal and academic full-stack projects focused on performance, UI/UX, and scalability.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <p>Experienced in integrating REST APIs, responsive design principles, and modern development workflows using Git and GitHub.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-right">
          <div className="about-photo-stack">
            <div className="photo-main reveal-scale">
              <div className="photo-frame">
                <img src="/images/MainID.jpg" alt="Vince Aerhol Cabardo" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="photo-caption">
                <span className="photo-name">Vince Aerhol Cabardo</span>
                <span className="photo-role">Front-End Developer</span>
              </div>
            </div>

            <div className="flip-card flip-card-1 reveal-scale">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="/images/IDmini.jpg" alt="Vince Aerhol" onError={(e) => { e.target.style.display = 'none'; }} />
                  <span className="flip-card-label">Front</span>
                </div>
                <div className="flip-card-back">
                  <div className="flip-card-back-content">
                    <span className="flip-card-back-icon">✦</span>
                    <span className="flip-card-back-text">Design</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-sticker about-sticker-1">✦</div>
            <div className="about-sticker about-sticker-2">◆</div>
            <div className="about-sticker about-sticker-3">●</div>
          </div>

          <div className="about-vertical-carousel">
            <div className="vertical-carousel-track" id="vertical-carousel-track">
              {[...Array(10)].map((_, i) => (
                <div className="vertical-carousel-text-item" key={i}>Behind the code</div>
              ))}
            </div>
          </div>

          <div className="about-skills reveal">
            <div className="skills-columns">
              <div className="skills-column">
                <h3 className="about-subsection-title">
                  <span className="subsection-icon">💻</span>
                  Languages
                </h3>
                <div className="skills-group">
                  {languages.map((lang, i) => (
                    <span className="skill-badge" key={i}>{lang}</span>
                  ))}
                </div>
              </div>

              <div className="skills-column">
                <h3 className="about-subsection-title">
                  <span className="subsection-icon">⚛️</span>
                  Frameworks
                </h3>
                <div className="skills-group">
                  {frameworks.map((fw, i) => (
                    <span className="skill-badge" key={i}>{fw}</span>
                  ))}
                </div>
              </div>

              <div className="skills-column">
                <h3 className="about-subsection-title about-subsection-title-alt">
                  <span className="subsection-icon">🧰</span>
                  Tools
                </h3>
                <div className="skills-group">
                  {tools.map((tool, i) => (
                    <span className="skill-badge skill-badge-alt" key={i}>{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-tech-rail reveal-scale" ref={railRef} aria-label="Technology stack">
        <div className="tech-rail-track" id="tech-rail-track" ref={trackRef}>
          {techIcons.map((icon, i) => (
            <div className="tech-rail-icon" key={i}>
              <img
                src={icon.src}
                alt={icon.alt}
                className={icon.isMono ? 'mono-icon' : ''}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
