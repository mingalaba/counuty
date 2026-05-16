document.addEventListener('DOMContentLoaded', () => {
  // Inicializamos el canvas
  if (window.MyceliumCanvas) {
    window.MyceliumCanvas.init();
  }

  // Generamos los dots de navegación
  const slides = document.querySelectorAll('.slide');
  const progressNav = document.getElementById('progressNav');
  
  slides.forEach((slide, index) => {
    const dot = document.createElement('div');
    dot.classList.add('nav-dot');
    dot.dataset.index = index;
    dot.addEventListener('click', () => {
      slide.scrollIntoView({ behavior: 'smooth' });
    });
    progressNav.appendChild(dot);
  });

  const dots = document.querySelectorAll('.nav-dot');

  // Observer para el scroll snapping
  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Trigger at the middle of the screen
    threshold: 0
  };

  let currentSlideIndex = 0;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Activate current slide
        slides.forEach(s => s.classList.remove('active'));
        entry.target.classList.add('active');

        // Update dots and index
        const index = Array.from(slides).indexOf(entry.target);
        currentSlideIndex = index;
        dots.forEach(d => d.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');

        // Change Canvas Layer
        const layer = entry.target.dataset.layer;
        if (window.MyceliumCanvas && layer) {
          window.MyceliumCanvas.setLayer(layer);
        }

        // Add interactive class to body if needed
        if (layer && layer !== 'intro') {
          document.body.classList.add('interactive-mode');
        } else {
          document.body.classList.remove('interactive-mode');
        }

        // Add on-intro class for the first slide
        if (entry.target.id === 'slide-1') {
          document.body.classList.add('on-intro');
        } else {
          document.body.classList.remove('on-intro');
        }
      }
    });
  }, observerOptions);

  slides.forEach(slide => observer.observe(slide));

  // Handle Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'ArrowDown') {
      e.preventDefault();
      if (currentSlideIndex < slides.length - 1) {
        slides[currentSlideIndex + 1].scrollIntoView({ behavior: 'smooth' });
      }
    } else if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
      e.preventDefault();
      if (currentSlideIndex > 0) {
        slides[currentSlideIndex - 1].scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Handle Click Navigation
  document.addEventListener('click', (e) => {
    // Evitar avanzar si hacen click en los puntitos de navegación o botones
    if (e.target.closest('a') || e.target.closest('.progress-nav')) return;
    
    if (currentSlideIndex < slides.length - 1) {
      slides[currentSlideIndex + 1].scrollIntoView({ behavior: 'smooth' });
    }
  });
});
