import { useScrollReveal } from '../hooks/useScrollReveal';

export default function ContactSection() {
  useScrollReveal();

  return (
    <section className="contact-section" id="contact">
      <h2 data-parallax="0.4">Get In Touch</h2>
      <p data-parallax="0.35">Feel free to reach out to me for any inquiries or collaboration opportunities. I'd love to hear from you!</p>
      <div className="contact-info" data-parallax="0.3">
        <div className="contact-item" data-parallax="0.35">
          <span>📧 Email:</span>
          <a href="mailto:your.email@example.com">your.email@example.com</a>
        </div>
        <div className="contact-item" data-parallax="0.4">
          <span>💼 LinkedIn:</span>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">linkedin.com/in/yourprofile</a>
        </div>
        <div className="contact-item" data-parallax="0.45">
          <span>🐙 GitHub:</span>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">github.com/yourprofile</a>
        </div>
        <div className="contact-item" data-parallax="0.5">
          <span>𝕏 Twitter:</span>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">@yourhandle</a>
        </div>
      </div>
    </section>
  );
}