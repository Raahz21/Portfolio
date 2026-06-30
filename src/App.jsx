import { useTheme } from './hooks/useTheme';
import { useParallaxScroll } from './hooks/useParallax';
import { useMousePosition } from './hooks/useScrollReveal';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import WorksSection from './components/WorksSection';
import ContactSection from './components/ContactSection';
import FooterSection from './components/FooterSection';
import './styles/index.css';

export default function App() {
  const { isLight, toggleTheme } = useTheme();
  
  useParallaxScroll();
  useMousePosition();

  return (
    <>
      <Loader />
      <Navbar isLight={isLight} toggleTheme={toggleTheme} />
      <main>
        <HeroSection />
        <AboutSection />
        <WorksSection />
        <ContactSection />
        <FooterSection />
      </main>
    </>
  );
}