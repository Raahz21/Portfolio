import { useEffect, useRef } from 'react';
import '../styles/works.css';

const works = [
  {
    index: '01',
    title: 'E-Commerce Platform',
    description: 'A fully responsive e-commerce website built with React and Redux, featuring product filtering, cart management, and smooth checkout experience.',
    link: 'https://raahz21.github.io/E-commerce-Project/'
  },
  {
    index: '02',
    title: 'Task Management App',
    description: 'An interactive task management application with real-time updates, user authentication, and a modern dark UI design.'
  },
  {
    index: '03',
    title: 'Portfolio Website',
    description: 'A stunning personal portfolio showcasing my skills, projects, and experience with smooth animations and modern design patterns.'
  },
  {
    index: '04',
    title: 'Weather Dashboard',
    description: 'A responsive weather application that displays real-time weather data with beautiful visualizations and location-based features.'
  }
];

export default function WorksSection() {
  const cubeRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const worksCube = cubeRef.current;
    const worksCubeStage = stageRef.current;
    if (!worksCube || !worksCubeStage) return;

    let cubeRotationY = 0;
    let cubeRotationX = -8;
    let startX = 0;
    let startY = 0;
    let startRotationY = 0;
    let startRotationX = 0;
    let isCubeDragging = false;

    const updateCube = () => {
      worksCube.style.setProperty('--cube-rotation-y', `${cubeRotationY}deg`);
      worksCube.style.setProperty('--cube-rotation-x', `${cubeRotationX}deg`);
    };

    const rotateToFace = (direction) => {
      cubeRotationY += direction * -90;
      cubeRotationX = -8;
      updateCube();
    };

    const handlePrev = () => rotateToFace(-1);
    const handleNext = () => rotateToFace(1);

    const prevBtn = document.getElementById('cube-prev');
    const nextBtn = document.getElementById('cube-next');

    if (prevBtn) prevBtn.addEventListener('click', handlePrev);
    if (nextBtn) nextBtn.addEventListener('click', handleNext);

    const handlePointerDown = (e) => {
      e.preventDefault();
      isCubeDragging = true;
      worksCubeStage.classList.add('dragging');
      worksCubeStage.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      startRotationY = cubeRotationY;
      startRotationX = cubeRotationX;
    };

    const handlePointerMove = (e) => {
      if (!isCubeDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      cubeRotationY = startRotationY + deltaX * 0.55;
      cubeRotationX = Math.max(-35, Math.min(22, startRotationX - deltaY * 0.25));
      updateCube();
    };

    const handlePointerUp = () => {
      if (!isCubeDragging) return;
      isCubeDragging = false;
      worksCubeStage.classList.remove('dragging');
    };

    worksCubeStage.addEventListener('pointerdown', handlePointerDown);
    worksCubeStage.addEventListener('pointermove', handlePointerMove);
    worksCubeStage.addEventListener('pointerup', handlePointerUp);
    worksCubeStage.addEventListener('pointercancel', handlePointerUp);
    worksCubeStage.addEventListener('lostpointercapture', handlePointerUp);

    return () => {
      if (prevBtn) prevBtn.removeEventListener('click', handlePrev);
      if (nextBtn) nextBtn.removeEventListener('click', handleNext);
      worksCubeStage.removeEventListener('pointerdown', handlePointerDown);
      worksCubeStage.removeEventListener('pointermove', handlePointerMove);
      worksCubeStage.removeEventListener('pointerup', handlePointerUp);
      worksCubeStage.removeEventListener('pointercancel', handlePointerUp);
      worksCubeStage.removeEventListener('lostpointercapture', handlePointerUp);
    };
  }, []);

  return (
    <section className="works-section" id="works">
      <h2 data-parallax="0.4">My Works</h2>
      <div className="works-cube-stage" ref={stageRef} data-parallax="0.35">
        <div className="works-cube" id="works-cube" ref={cubeRef}>
          <div className={`work-card cube-face cube-face-front`}>
            {works[0].link ? (
              <a href={works[0].link} target="_blank" rel="noopener noreferrer">
                <span className="work-index">{works[0].index}</span>
                <h3>{works[0].title}</h3>
                <p>{works[0].description}</p>
              </a>
            ) : (
              <>
                <span className="work-index">{works[0].index}</span>
                <h3>{works[0].title}</h3>
                <p>{works[0].description}</p>
              </>
            )}
          </div>
          <div className="work-card cube-face cube-face-right">
            <span className="work-index">{works[1].index}</span>
            <h3>{works[1].title}</h3>
            <p>{works[1].description}</p>
          </div>
          <div className="work-card cube-face cube-face-back">
            <span className="work-index">{works[2].index}</span>
            <h3>{works[2].title}</h3>
            <p>{works[2].description}</p>
          </div>
          <div className="work-card cube-face cube-face-left">
            <span className="work-index">{works[3].index}</span>
            <h3>{works[3].title}</h3>
            <p>{works[3].description}</p>
          </div>
          <div className="cube-cap cube-face-top" aria-hidden="true"></div>
          <div className="cube-cap cube-face-bottom" aria-hidden="true"></div>
        </div>
      </div>
      <div className="works-cube-controls" aria-label="Rotate works cube" data-parallax="0.3">
        <button type="button" className="cube-control" id="cube-prev" aria-label="Previous work">Prev</button>
        <button type="button" className="cube-control" id="cube-next" aria-label="Next work">Next</button>
      </div>
    </section>
  );
}