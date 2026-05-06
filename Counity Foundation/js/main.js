/* ============================================
   COUNITY FOUNDATION — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Header scroll effect ---
  const header = document.getElementById('siteHeader');
  const scrollThreshold = 50;

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // --- Mobile menu ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (mobileOverlay) mobileOverlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll reveal animations ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Parallax for hero orbs ---
  const heroOrbs = document.querySelectorAll('.hero-orb');

  if (heroOrbs.length > 0) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          heroOrbs.forEach((orb, i) => {
            const speed = 0.05 + (i * 0.02);
            orb.style.transform = `translateY(${scrollY * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --- Co-Unit expandable cards ---
  // Why: Data-driven approach avoids hardcoding descriptions in HTML
  const counitData = {
    'co-gov': {
      title: 'Co-Gov — Gobernanza',
      desc: 'Gobernanza distribuida, protocolos de decisión, diseño de la DAO y mecanismos de consenso dentro del ecosistema.'
    },
    'co-learn': {
      title: 'Co-Learn — Aprendizaje',
      desc: 'Educación regenerativa, formación interna, documentación viva y transferencia de conocimiento entre nodos.'
    },
    'co-regen': {
      title: 'Co-Regen — Regeneración',
      desc: 'Regeneración territorial. Coordina proyectos de restauración ecológica, permacultura y diseño bioclimático.'
    },
    'co-live': {
      title: 'Co-Live — Hábitat',
      desc: 'Bioarquitectura, diseño del espacio habitable, materiales locales e infraestructura sostenible.'
    },
    'co-care': {
      title: 'Co-Care — Cuidado',
      desc: 'Bienestar comunitario, salud emocional, resolución de conflictos y cohesión social dentro de cada Land.'
    },
    'co-story': {
      title: 'Co-Story — Narrativa',
      desc: 'Narrativa, identidad, comunicación y memoria colectiva. La voz del ecosistema.'
    },
    'co-territory': {
      title: 'Co-Territory — Territorio',
      desc: 'Justicia territorial, articulación intercultural, saberes locales y relación con el entorno.'
    }
  };

  // Why: Scope per grid so home and como-funciona grids work independently
  document.querySelectorAll('.counits-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.counit-card');
    const detail = grid.querySelector('.counit-detail');
    if (!cards.length || !detail) return;

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.counit;
        const data = counitData[id];
        if (!data) return;

        const wasActive = card.classList.contains('active');
        cards.forEach(c => c.classList.remove('active'));

        if (wasActive) {
          detail.classList.remove('visible');
          return;
        }

        card.classList.add('active');
        detail.querySelector('h4').textContent = data.title;
        detail.querySelector('p').textContent = data.desc;
        detail.classList.add('visible');

        // Why: Insert detail panel after clicked card's row for natural reading flow
        card.parentNode.insertBefore(detail, card.nextSibling);
      });
    });
  });

  // --- Firma Simbólica (frontend-only) ---
  const firmaForm = document.getElementById('firmaForm');
  const firmaBox = firmaForm ? firmaForm.closest('.firma-box') : null;

  if (firmaForm && firmaBox) {
    firmaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = firmaForm.querySelector('input[name="email"]');
      if (!emailInput || !emailInput.value.trim()) return;

      // TODO: Connect to Supabase or backend endpoint when ready
      firmaBox.classList.add('signed');
    });
  }

  // --- Pink Paper form gate ---
  const ppForm = document.getElementById('ppForm');
  const ppGate = document.getElementById('ppGate');

  if (ppForm && ppGate) {
    ppForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = ppForm.querySelector('input[name="name"]');
      const email = ppForm.querySelector('input[name="email"]');

      // Why: Basic HTML5 validation is sufficient for MVP; backend validation happens later
      if (!name.value.trim() || !email.value.trim()) return;

      ppGate.classList.add('success');
    });
  }

  // --- Initialize Lucide Icons ---
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

});
