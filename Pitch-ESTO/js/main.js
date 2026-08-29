// ============================================================
// ESTO — Red Federada | Main Pitch Presentation Controller
// « Custodiar la tierra · Tejer la vida »
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar el canvas micelar de ESTO
  if (window.MyceliumCanvas) {
    window.MyceliumCanvas.init();
  }

  // 2. Generación dinámica de los dots de navegación lateral
  const slides = document.querySelectorAll('.slide');
  const progressNav = document.getElementById('progressNav');
  
  if (progressNav) {
    slides.forEach((slide, index) => {
      const dot = document.createElement('div');
      dot.classList.add('nav-dot');
      dot.dataset.index = index;
      dot.title = `Diapositiva ${index + 1}`;
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        slide.scrollIntoView({ behavior: 'smooth' });
      });
      progressNav.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll('.nav-dot');
  let currentSlideIndex = 0;

  // 3. IntersectionObserver para Scroll Snapping y Sincronización de Capas
  const observerOptions = {
    root: null,
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Desactivar diapositiva previa y activar la actual
        slides.forEach(s => s.classList.remove('active'));
        entry.target.classList.add('active');

        // Actualizar índice y dots de progreso
        const index = Array.from(slides).indexOf(entry.target);
        currentSlideIndex = index;
        dots.forEach(d => d.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');

        // Sincronizar capa en el Canvas
        const layer = entry.target.dataset.layer;
        if (window.MyceliumCanvas && layer) {
          window.MyceliumCanvas.setLayer(layer);
        }

        // Modos interactivos en el body
        if (layer && layer !== 'intro') {
          document.body.classList.add('interactive-mode');
        } else {
          document.body.classList.remove('interactive-mode');
        }

        // Modo Portada / Intro (Oculta header logo superior en Slide 1)
        if (entry.target.id === 'slide-1') {
          document.body.classList.add('on-intro');
        } else {
          document.body.classList.remove('on-intro');
        }
      }
    });
  }, observerOptions);

  slides.forEach(slide => observer.observe(slide));

  // 4. Navegación por Teclado (Flechas y Espacio)
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

  // 5. Navegación por Click (Avanzar al hacer click fuera de controles)
  document.addEventListener('click', (e) => {
    if (
      e.target.closest('a') || 
      e.target.closest('button') || 
      e.target.closest('.progress-nav') || 
      e.target.closest('#header-logo')
    ) {
      return;
    }
    
    if (currentSlideIndex < slides.length - 1) {
      slides[currentSlideIndex + 1].scrollIntoView({ behavior: 'smooth' });
    }
  });
});
