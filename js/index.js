// Loading animation
const siteLoader = document.getElementById('site-loader');

if (siteLoader) {
    const loaderStartedAt = performance.now();
    const minimumLoaderTime = 1800;

    window.addEventListener('load', () => {
        const elapsed = performance.now() - loaderStartedAt;
        const remaining = Math.max(0, minimumLoaderTime - elapsed);

        setTimeout(() => {
            siteLoader.classList.add('collapsing');

            setTimeout(() => {
                document.body.classList.remove('is-loading');
                document.body.classList.add('loader-finished');
                siteLoader.classList.add('hidden');

                setTimeout(() => {
                    siteLoader.remove();
                }, 700);
            }, 1050);
        }, remaining);
    });
}

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');

const setTheme = (theme) => {
    const isLight = theme === 'light';
    document.body.classList.toggle('light-mode', isLight);

    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', String(isLight));
        themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }
};

setTheme(savedTheme === 'light' ? 'light' : 'dark');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        localStorage.setItem('portfolio-theme', nextTheme);
        setTheme(nextTheme);
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Smooth scroll for CTA buttons
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation to sections when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// Initialize text scattering effect
const heroTitle = document.getElementById('hero-title');
const originalText = "Hi, I'm a Front-End Developer";
const alternateText = "Hi, I'm a UI/UX Designer";
let isScattered = false;
let isAnimating = false;
let currentText = 'original';

// Convert text to individual letter spans
function initializeLetters(text = originalText) {
    heroTitle.innerHTML = '';
    let letterIndex = 0;

    text.split(/(\s+)/).forEach(part => {
        if (part.trim() === '') {
            const space = document.createElement('span');
            space.className = 'letter space';
            space.dataset.index = letterIndex;
            heroTitle.appendChild(space);
            letterIndex += part.length;
            return;
        }

        const word = document.createElement('span');
        word.className = 'word';

        part.split('').forEach(char => {
            const letter = document.createElement('span');
            letter.className = 'letter';
            letter.dataset.index = letterIndex;
            letter.textContent = char;
            word.appendChild(letter);
            letterIndex += 1;
        });

        heroTitle.appendChild(word);
    });
}

// Initialize on load
initializeLetters();

// Toggle text animation on click
heroTitle.addEventListener('click', (e) => {
    if (isAnimating) return;

    if (!isScattered) {
        scatterText();
    } else {
        gatherText();
    }
});

// Scatter text animation
function scatterText() {
    if (isScattered || isAnimating) return;
    isAnimating = true;
    
    const letters = document.querySelectorAll('.hero h1 .letter');
    letters.forEach((letter, index) => {
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = 90 + Math.random() * 170;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const rotate = Math.random() * 360;
        
        letter.style.setProperty('--tx', `${tx}px`);
        letter.style.setProperty('--ty', `${ty}px`);
        letter.style.setProperty('--rotate', `${rotate}deg`);
        
        letter.classList.add('scattering');
        
    });
    
    setTimeout(() => {
        letters.forEach(letter => {
            letter.classList.remove('scattering');
            letter.classList.add('scattered');
        });
        isAnimating = false;
        isScattered = true;
    }, 600);
}

// Gather scattered text and switch to the other title
function gatherText() {
    if (!isScattered || isAnimating) return;
    isAnimating = true;
    
    const letters = document.querySelectorAll('.hero h1 .letter');
    letters.forEach((letter, index) => {
        letter.classList.remove('scattered');
        letter.classList.add('gathering');
        
    });
    
    setTimeout(() => {
        const nextText = currentText === 'original' ? alternateText : originalText;
        currentText = currentText === 'original' ? 'alternate' : 'original';
        initializeLetters(nextText);
        isScattered = false;
        isAnimating = false;
    }, 600);
}
        

// Tech Stack Carousel with Infinite Scroll and Drag
const techCarousel = document.querySelector('.tech-carousel');
const techItemsContainer = document.querySelector('.tech-items');

if (techCarousel && techItemsContainer) {
    // Get all original tech items
    const originalItems = Array.from(techItemsContainer.querySelectorAll('.tech-item'));
    
    // Clear the container
    techItemsContainer.innerHTML = '';
    
    // Add original items back
    originalItems.forEach(item => {
        techItemsContainer.appendChild(item);
    });
    
    // Duplicate items multiple times for seamless infinite scroll (8 times for smooth loop)
    const duplicateCount = 8;
    for (let i = 0; i < duplicateCount; i++) {
        originalItems.forEach(item => {
            techItemsContainer.appendChild(item.cloneNode(true));
        });
    }

    // Add IDs for reference
    techCarousel.id = 'tech-carousel';
    techItemsContainer.id = 'tech-items';

    // Drag to scroll functionality
    let isDown = false;
    let startX;
    let scrollLeft;

    const startDrag = (e) => {
        isDown = true;
        techCarousel.classList.add('dragging');
        techItemsContainer.classList.add('paused');
        startX = e.pageX - techCarousel.offsetLeft;
        scrollLeft = techCarousel.scrollLeft;
    };

    const drag = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - techCarousel.offsetLeft;
        const walk = (x - startX) * 0.5;
        techCarousel.scrollLeft = scrollLeft - walk;
    };

    const stopDrag = () => {
        isDown = false;
        techCarousel.classList.remove('dragging');
        techItemsContainer.classList.remove('paused');
        // Resume animation
        setTimeout(() => {
            techItemsContainer.style.animation = 'none';
            setTimeout(() => {
                techItemsContainer.style.animation = '';
            }, 10);
        }, 100);
    };

    // Mouse events
    techCarousel.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    // Touch events for mobile
    techCarousel.addEventListener('touchstart', (e) => {
        isDown = true;
        techCarousel.classList.add('dragging');
        techItemsContainer.classList.add('paused');
        startX = e.touches[0].pageX - techCarousel.offsetLeft;
        scrollLeft = techCarousel.scrollLeft;
    });

    techCarousel.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - techCarousel.offsetLeft;
        const walk = (x - startX) * 0.5;
        techCarousel.scrollLeft = scrollLeft - walk;
    });

    techCarousel.addEventListener('touchend', () => {
        isDown = false;
        techCarousel.classList.remove('dragging');
        techItemsContainer.classList.remove('paused');
        setTimeout(() => {
            techItemsContainer.style.animation = 'none';
            setTimeout(() => {
                techItemsContainer.style.animation = '';
            }, 10);
        }, 100);
    });
}

// 3D draggable ID card tilt
const idCard = document.querySelector('.id-card');

if (idCard) {
    const maxTilt = 18;

    const setCardTilt = (clientX, clientY) => {
        const rect = idCard.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width;
        const y = (clientY - rect.top) / rect.height;
        const tiltY = (x - 0.5) * maxTilt * 2;
        const tiltX = (0.5 - y) * maxTilt * 2;

        idCard.style.setProperty('--tilt-x', `${tiltX}deg`);
        idCard.style.setProperty('--tilt-y', `${tiltY}deg`);
        idCard.style.setProperty('--glare-x', `${x * 100}%`);
        idCard.style.setProperty('--glare-y', `${y * 100}%`);
    };

    const resetCardTilt = () => {
        idCard.classList.remove('dragging');
        idCard.style.setProperty('--tilt-x', '0deg');
        idCard.style.setProperty('--tilt-y', '0deg');
        idCard.style.setProperty('--glare-x', '50%');
        idCard.style.setProperty('--glare-y', '20%');
    };

    idCard.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        idCard.classList.add('dragging');
        idCard.setPointerCapture(e.pointerId);
        setCardTilt(e.clientX, e.clientY);
    });

    idCard.addEventListener('pointermove', (e) => {
        if (!idCard.classList.contains('dragging')) return;
        setCardTilt(e.clientX, e.clientY);
    });

    idCard.addEventListener('pointerup', resetCardTilt);
    idCard.addEventListener('pointercancel', resetCardTilt);
    idCard.addEventListener('lostpointercapture', resetCardTilt);
}

// Works 3D cube controls
const worksCube = document.getElementById('works-cube');
const worksCubeStage = document.querySelector('.works-cube-stage');
const cubePrev = document.getElementById('cube-prev');
const cubeNext = document.getElementById('cube-next');

if (worksCube && worksCubeStage && cubePrev && cubeNext) {
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

    cubePrev.addEventListener('click', () => {
        rotateToFace(-1);
    });

    cubeNext.addEventListener('click', () => {
        rotateToFace(1);
    });

    worksCubeStage.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        isCubeDragging = true;
        worksCubeStage.classList.add('dragging');
        worksCubeStage.setPointerCapture(e.pointerId);
        startX = e.clientX;
        startY = e.clientY;
        startRotationY = cubeRotationY;
        startRotationX = cubeRotationX;
    });

    worksCubeStage.addEventListener('pointermove', (e) => {
        if (!isCubeDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        cubeRotationY = startRotationY + deltaX * 0.55;
        cubeRotationX = Math.max(-35, Math.min(22, startRotationX - deltaY * 0.25));
        updateCube();
    });

    const stopCubeDrag = () => {
        if (!isCubeDragging) return;
        isCubeDragging = false;
        worksCubeStage.classList.remove('dragging');
    };

    worksCubeStage.addEventListener('pointerup', stopCubeDrag);
    worksCubeStage.addEventListener('pointercancel', stopCubeDrag);
    worksCubeStage.addEventListener('lostpointercapture', stopCubeDrag);
}

// index.js
// ...
