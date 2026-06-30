import '../styles/hero.css';

export default function HeroSection() {
  const handleCtaClick = (e, targetId) => {
    e.preventDefault();
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop,
        behavior: 'auto'
      });
    }
  };

  return (
    <section className="hero-section" id="home">
      {/* Dark Background */}
      <div className="retro-skyline-bg"></div>

      {/* Hero Content */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-copy">
            <h1>VINCE AERHOL CABARDO</h1>
            <p>
              Crafting beautiful, responsive, and user-friendly web experiences with modern technologies.
            </p>
            <div className="hero-actions">
              <a href="#works" className="cta-button" onClick={(e) => handleCtaClick(e, 'works')}>View My Work</a>
              <a href="#contact" className="cta-button" onClick={(e) => handleCtaClick(e, 'contact')}>Get In Touch</a>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel at Footer - moves RIGHT */}
      <div className="hero-text-carousel" aria-hidden="true">
        <div className="carousel-track">
          {[...Array(8)].map((_, i) => (
            <span className="carousel-text" key={i}>
              FRONT-END DEVELOPER<span className="carousel-dot">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
