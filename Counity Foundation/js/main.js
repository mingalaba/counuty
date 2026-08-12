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

  // --- Pink Paper form gate & Network Graph ---
  const ppForm = document.getElementById('ppForm');
  const ppGate = document.getElementById('ppGate');
  const ppSuccess = document.getElementById('ppSuccess');
  const referralBar = document.getElementById('referralBar');
  const referrerName = document.getElementById('referrerName');
  const referrerIdInput = document.getElementById('referrerId');
  const refFieldGroup = document.getElementById('refFieldGroup');
  const stepProgressFill = document.getElementById('stepProgressFill');

  // --- Step 1: Detect Referral URL ---
  // Why: Robust, simple client-side parsing of query params for MVP
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');

  if (refCode && referralBar && referrerName) {
    // Extract a readable name from the slug if possible (e.g., 'martin.c.9a2f' -> 'Martin C.')
    const parts = refCode.split('.');
    let displayName = refCode;
    if (parts.length >= 2) {
      const namePart = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      const initialPart = parts[1].toUpperCase();
      displayName = `${namePart} ${initialPart}.`;
    }
    
    referrerName.textContent = displayName;
    referralBar.style.display = 'flex';
    
    if (referrerIdInput && refFieldGroup) {
      referrerIdInput.value = refCode;
      refFieldGroup.style.display = 'block';
    }
  }

  // --- Step 2: Step Navigation Controller ---
  const steps = document.querySelectorAll('.form-step');
  const dots = document.querySelectorAll('.step-dot');
  const btnNextStep1 = document.getElementById('btnNextStep1');
  const btnPrevStep2 = document.getElementById('btnPrevStep2');

  function updateSteps(activeStep) {
    steps.forEach(step => {
      if (parseInt(step.dataset.step) === activeStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    dots.forEach(dot => {
      const stepNum = parseInt(dot.dataset.step);
      if (stepNum < activeStep) {
        dot.className = 'step-dot completed';
        dot.innerHTML = '✓';
      } else if (stepNum === activeStep) {
        dot.className = 'step-dot active';
        dot.innerHTML = stepNum;
      } else {
        dot.className = 'step-dot';
        dot.innerHTML = stepNum;
      }
    });

    if (stepProgressFill) {
      const fillPercentage = activeStep === 1 ? 0 : activeStep === 2 ? 50 : 100;
      stepProgressFill.style.width = `${fillPercentage}%`;
    }
  }

  if (btnNextStep1) {
    btnNextStep1.addEventListener('click', () => {
      const name = document.getElementById('userName');
      const email = document.getElementById('userEmail');
      
      // Basic HTML5 validation trigger
      if (!name.value.trim()) {
        name.reportValidity();
        return;
      }
      if (!email.value.trim() || !email.validity.valid) {
        email.reportValidity();
        return;
      }
      
      updateSteps(2);
    });
  }

  if (btnPrevStep2) {
    btnPrevStep2.addEventListener('click', () => {
      updateSteps(1);
    });
  }

  // --- Step 3: Form Submit & Dynamic Referral Generator ---
  if (ppForm && ppGate && ppSuccess) {
    ppForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameVal = document.getElementById('userName').value.trim();
      const emailVal = document.getElementById('userEmail').value.trim();
      const locationVal = document.getElementById('userLocation').value.trim();
      const projectVal = document.getElementById('userProject').value.trim();
      const focusVal = ppForm.querySelector('input[name="focus"]:checked').value;
      const refVal = referrerIdInput ? referrerIdInput.value : '';

      // Why: Generate a unique ID (slug) combining name + surname initial + random 4-char hash
      // Ensures no colisions and maintains clean, legible link format
      const nameParts = nameVal.toLowerCase().split(' ');
      const firstName = nameParts[0].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // strip accents
      const initial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : 'x';
      const hash = Math.random().toString(36).substring(2, 6);
      const generatedId = `${firstName}.${initial}.${hash}`;

      // Set user network ID
      const userNetworkIdEl = document.getElementById('userNetworkId');
      if (userNetworkIdEl) userNetworkIdEl.textContent = generatedId;

      // Set referral link
      const referralUrlEl = document.getElementById('referralUrl');
      if (referralUrlEl) {
        const baseUrl = window.location.origin + window.location.pathname;
        referralUrlEl.value = `${baseUrl}?ref=${generatedId}`;
      }

      // Transition to Step 3 (Success)
      ppForm.style.display = 'none';
      ppSuccess.classList.add('success');
      ppGate.classList.add('success');
      updateSteps(3);

      // Start Mycelial Net Canvas Animation
      initNetworkCanvas();
      
      // TODO: Submit this data to Supabase relational/vector DB API
      console.log('Registering Node:', {
        network_id: generatedId,
        name: nameVal,
        email: emailVal,
        country: locationVal,
        project_name: projectVal,
        focus_area: focusVal,
        referred_by: refVal
      });
    });
  }

  // --- Step 4: Clipboard copying with UI feedback ---
  const copyBtn = document.getElementById('copyReferralBtn');
  const referralInput = document.getElementById('referralUrl');
  if (copyBtn && referralInput) {
    copyBtn.addEventListener('click', () => {
      referralInput.select();
      referralInput.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(referralInput.value).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '¡Copiado!';
        copyBtn.style.background = 'var(--cyan)';
        copyBtn.style.color = 'var(--bg-primary)';
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2000);
      });
    });
  }

  // --- Step 5: Mycelial Network Canvas Animation ---
  // Why: Micro-animation of nodes connecting to show system is alive
  function initNetworkCanvas() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Fit canvas size to container
    const resizeCanvas = () => {
      const rect = canvas.parentNode.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 160;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const numParticles = 25;
    const maxDistance = 75;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#01AAFB' : '#FE84FB'; // Cyan or Pink
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Boundary bounce
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    // Add Central User Node (larger and fixed)
    const centralNode = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 4,
      color: '#01AAFB'
    };

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    // Interactive mouse node
    let mouse = { x: null, y: null };
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Keep central node centered
      centralNode.x = canvas.width / 2;
      centralNode.y = canvas.height / 2;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Connect to central node
        const distToCenter = Math.hypot(p1.x - centralNode.x, p1.y - centralNode.y);
        if (distToCenter < maxDistance + 30) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(centralNode.x, centralNode.y);
          ctx.strokeStyle = `rgba(1, 170, 251, ${1 - distToCenter / (maxDistance + 30)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Connect to other nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 * (1 - dist / maxDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouse.x !== null) {
          const distToMouse = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
          if (distToMouse < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(254, 132, 251, ${0.4 * (1 - distToMouse / maxDistance)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        p1.update();
        p1.draw();
      }

      // Draw Central Node glow
      ctx.beginPath();
      ctx.arc(centralNode.x, centralNode.y, centralNode.radius, 0, Math.PI * 2);
      ctx.fillStyle = centralNode.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = centralNode.color;
      ctx.fill();
      ctx.shadowBlur = 0;

      requestAnimationFrame(animate);
    }
    
    animate();
  }

  // --- Initialize Lucide Icons ---
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

});
