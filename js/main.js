/* ============================================
   COUNITY — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Header scroll effect ---
  const header = document.getElementById('siteHeader');
  const scrollThreshold = 50;

  function updateHeader() {
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

    // Close nav on link click (mobile)
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
        // Don't unobserve — keeps animation for re-scrolling
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

  // --- Parallax for hero orbs (subtle) ---
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

  // --- Active nav link highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a:not(.btn)');

  function highlightNav() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinksAll.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--text-primary)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // --- Counits interactive hover ---
  const counitTags = document.querySelectorAll('.counit-tag');
  const counitDescriptions = {
    'Co-Gov': 'Gobernanza distribuida, protocolos de decisión, diseño de la DAO',
    'Co-Learn': 'Educación regenerativa, formación interna, transferencia de conocimiento',
    'Co-Regen': 'Regeneración ecosocial, restauración de suelos y ecosistemas',
    'Co-Live': 'Hábitat, bioarquitectura, diseño del espacio habitable',
    'Co-Care': 'Cultura del cuidado, vínculos sanos, bienestar integral',
    'Co-Story': 'Narrativa, identidad, comunicación y memoria colectiva',
    'Co-Territory': 'Justicia territorial, articulación intercultural, saberes locales'
  };

  counitTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      const name = tag.textContent.trim();
      const desc = counitDescriptions[name];
      if (desc) {
        tag.setAttribute('title', desc);
        tag.style.borderColor = 'rgba(139, 92, 246, 0.5)';
        tag.style.background = 'rgba(139, 92, 246, 0.1)';
      }
    });

    tag.addEventListener('mouseleave', () => {
      tag.style.borderColor = '';
      tag.style.background = '';
    });
  });

});
