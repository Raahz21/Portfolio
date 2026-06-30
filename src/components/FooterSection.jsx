import { useScrollReveal } from '../hooks/useScrollReveal';

export default function FooterSection() {
  useScrollReveal();

  return (
    <footer className="footer-section">
      <p>&copy; 2026 Front-End Developer. All rights reserved.</p>
    </footer>
  );
}