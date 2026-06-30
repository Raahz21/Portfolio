import '../styles/navbar.css';

export default function Navbar({ isLight, toggleTheme }) {
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      const targetPosition = targetSection.offsetTop;
      window.scrollTo({
        top: targetPosition,
        behavior: 'auto'
      });
    }
  };

  return (
    <nav>
      <div className="nav-brand">
        <div className="logo">Vince Aerhol Cabardo</div>
      </div>
      <div className="nav-links-row">
        <ul>
          <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
          <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a></li>
          <li><a href="#works" onClick={(e) => handleNavClick(e, 'works')}>Works</a></li>
          <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></li>
        </ul>
        <button
          type="button"
          className="theme-toggle"
          id="theme-toggle"
          aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          aria-pressed={isLight}
          onClick={toggleTheme}
        >
          <span className="theme-option">
            {/* Sun icon */}
            <svg className="theme-icon sun-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </span>
          <span className="theme-option">
            {/* Moon icon */}
            <svg className="theme-icon moon-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </span>
          <span className="theme-thumb"></span>
        </button>
      </div>
    </nav>
  );
}