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
            const targetPosition = targetSection.offsetTop;
            window.scrollTo({
                top: targetPosition,
                behavior: 'auto'
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
            const targetPosition = targetSection.offsetTop;
            window.scrollTo({
                top: targetPosition,
                behavior: 'auto'
            });
        }
    });
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

// Parallax Scroll Effect - Sections zoom out and move down when scrolling past
function initParallaxScroll() {
    // Check if mobile device - disable parallax for performance
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    const sections = document.querySelectorAll('section');
    if (sections.length === 0) return;

    let ticking = false;
    let lastScrollY = window.scrollY;

    function updateParallax() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = scrollY;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const viewportCenter = windowHeight / 2;
            
            // Calculate how far the section center is from viewport center
            // Negative = above center, Positive = below center
            const distanceFromCenter = (sectionCenter - viewportCenter) / windowHeight;
            
            // Clamp the distance to prevent extreme values
            const clampedDistance = Math.max(-1.5, Math.min(1.5, distanceFromCenter));
            
            // Calculate transform values based on scroll position
            // When section is above center (scrolling down): zoom out, move down
            // When section is below center (scrolling up): zoom in, move up
            
            let translateY = 0;
            let scale = 1;
            let opacity = 1;
            let rotateX = 0;
            
            if (clampedDistance < 0) {
                // Section is above center - moving away (zoom out effect)
                const progress = Math.abs(clampedDistance); // 0 to 1.5
                translateY = progress * 80; // Move down
                scale = Math.max(0.85, 1 - progress * 0.1); // Zoom out
                opacity = Math.max(0.4, 1 - progress * 0.35); // Fade out
                rotateX = progress * 3; // Slight tilt
            } else if (clampedDistance > 0) {
                // Section is below center - coming into view (zoom in effect)
                const progress = clampedDistance; // 0 to 1.5
                translateY = -progress * 50; // Move up
                scale = Math.max(0.9, 1 - progress * 0.06); // Slight zoom
                opacity = Math.max(0.5, 1 - progress * 0.3); // Slight fade
                rotateX = -progress * 2; // Slight reverse tilt
            }
            
            // Apply transforms
            section.style.transform = `
                perspective(1000px)
                translateY(${translateY}px)
                scale(${scale})
                rotateX(${rotateX}deg)
            `;
            section.style.opacity = opacity;
        });

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Listen for scroll events
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial call
    updateParallax();
    
    // Update on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            // Reset transforms on mobile
            sections.forEach(section => {
                section.style.transform = 'none';
                section.style.opacity = '1';
            });
        } else {
            updateParallax();
        }
    });
}

// Initialize parallax scroll effect after DOM is loaded
document.addEventListener('DOMContentLoaded', initParallaxScroll);
// Also initialize if the DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallaxScroll);
} else {
    initParallaxScroll();
}

// =============================================
// VERTICAL TECH RAIL — Infinite Scroll + Wheel/Drag Control
// =============================================
function initTechRail() {
    const track = document.getElementById('tech-rail-track');
    const rail = document.querySelector('.about-tech-rail');
    if (!track || !rail) return;

    const items = Array.from(track.querySelectorAll('.tech-rail-icon'));
    if (items.length === 0) return;

    const CSS_ANIMATION = 'techRailScroll 60s linear infinite';

    // Clone items many times for plenty of scroll buffer (10 copies = 11x total)
    for (let i = 0; i < 10; i++) {
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });
    }

    // Calculate height of one original set (for snap-based looping)
    let setHeight = 0;
    function calcSetHeight() {
        const allIcons = track.querySelectorAll('.tech-rail-icon');
        const count = items.length;
        if (allIcons.length === 0 || count === 0) return;
        let h = 0;
        for (let i = 0; i < count && i < allIcons.length; i++) {
            h += allIcons[i].offsetHeight || 0;
        }
        // Add gap between items (16px from CSS * (count-1))
        h += 16 * (count - 1);
        setHeight = h;
    }

    // Calculate on next frame after layout
    requestAnimationFrame(() => calcSetHeight());

    let scrollTimeout = null;
    let offset = 0; // cumulative scroll/drag offset (always negative or 0 for downward scroll)

    function syncTransform() {
        // Snap: when offset exceeds setHeight in either direction, jump by one setHeight
        // Keep offset within [-setHeight, 0] range for seamless looping
        const snapThreshold = setHeight > 0 ? setHeight : Infinity;
        
        if (snapThreshold !== Infinity) {
            // Snap forward (too far down)
            while (offset < -snapThreshold) {
                offset += snapThreshold;
            }
            // Snap backward (too far up)
            while (offset > 0) {
                offset -= snapThreshold;
            }
        }
        
        track.style.transition = 'none';
        track.style.transform = `translateY(${offset}px)`;
    }

    function enableManual() {
        track.style.animation = 'none';
        syncTransform();
    }

    function resumeAuto() {
        track.style.transition = 'transform 0.5s ease-out';
        track.style.transform = 'translateY(0)';
        offset = 0;

        setTimeout(() => {
            track.style.transition = '';
            track.style.transform = '';
            track.style.animation = CSS_ANIMATION;
        }, 500);
    }

    // ---- WHEEL SCROLL ----
    rail.addEventListener('wheel', (e) => {
        e.preventDefault();
        enableManual();
        offset -= e.deltaY;
        syncTransform();
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => { resumeAuto(); scrollTimeout = null; }, 2000);
    }, { passive: false });

    // ---- DRAG TO SCROLL ----
    let isDragging = false;
    let dragPrevY = 0;

    rail.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragPrevY = e.clientY;
        rail.style.cursor = 'grabbing';
        enableManual();
        if (scrollTimeout) clearTimeout(scrollTimeout);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        offset += e.clientY - dragPrevY;
        dragPrevY = e.clientY;
        syncTransform();
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        rail.style.cursor = '';
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => { resumeAuto(); scrollTimeout = null; }, 2000);
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTechRail);
} else {
    initTechRail();
}

// =============================================
// ABOUT SECTION — Scroll Reveal Animations
// =============================================
function initAboutReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-scale');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index for children
                const parent = entry.target.closest('.about-left, .about-photo-stack, .about-right');
                if (parent) {
                    const siblings = parent.querySelectorAll('.reveal, .reveal-scale');
                    const index = Array.from(siblings).indexOf(entry.target);
                    // Use the CSS transition-delay already defined in styles
                }
                
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutReveal);
} else {
    initAboutReveal();
}

// Flip cards in the about photo stack
(function initFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    if (!flipCards.length) return;

    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
})();

// =============================================
// VERTICAL CAROUSEL — Infinite Scroll Duplication
// =============================================
function initVerticalCarousel() {
    const track = document.getElementById('vertical-carousel-track');
    if (!track) return;

    const items = Array.from(track.querySelectorAll('.vertical-carousel-text-item'));
    if (items.length === 0) return;

    // Clone all items for seamless loop
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVerticalCarousel);
} else {
    initVerticalCarousel();
}
