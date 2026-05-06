// ============================================================
// Counity Ecosystem Companion & Scale Canvases
// Zona B: Mini sidebar that highlights the active layer on scroll
// Zona C: Expansive scale visualization at the bottom
// ============================================================

(function() {
  'use strict';

  // -------------------------------------------------------
  // SHARED DATA — must match mycelium.js
  // -------------------------------------------------------
  const COLORS = {
    foundation: '#00e6b8',
    counit: '#00bcd4',
    land: '#d4a017',
    nodo: '#7c8594',
    weave: '#01AAFB'
  };

  function hexAlpha(hex, a) {
    a = Math.max(0, Math.min(1, a));
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // -------------------------------------------------------
  // ZONA B: Companion Mini Canvas + Scroll Observer
  // -------------------------------------------------------
  const companionContainer = document.getElementById('companionContainer');
  const companionCanvas = document.getElementById('companionCanvas');
  const companionNav = document.getElementById('companionNav');

  if (companionCanvas && companionContainer) {
    const ctx = companionCanvas.getContext('2d');
    let W, H, cx, cy, activeLayer = 'foundation', time = 0;

    function resizeCompanion() {
      const rect = companionContainer.getBoundingClientRect();
      W = companionCanvas.width = rect.width;
      H = companionCanvas.height = rect.height;
      cx = W / 2;
      cy = H / 2;
    }

    // Why: Simplified node positions for the mini-canvas — no interactivity needed
    function getNodePositions() {
      const coreR = W * 0.15;
      const landR = W * 0.32;
      const nodoR = W * 0.42;

      const nodes = [];

      // Foundation
      nodes.push({ x: cx, y: cy, r: 8, type: 'foundation', color: COLORS.foundation, label: 'F' });

      // Co-Units (7)
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
        nodes.push({
          x: cx + Math.cos(angle) * coreR,
          y: cy + Math.sin(angle) * coreR,
          r: 5, type: 'counit', color: COLORS.counit
        });
      }

      // Lands (3)
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 - Math.PI / 6;
        nodes.push({
          x: cx + Math.cos(angle) * landR,
          y: cy + Math.sin(angle) * landR,
          r: 6, type: 'land', color: COLORS.land
        });
      }

      // Nodos (10)
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2 + Math.PI / 5;
        nodes.push({
          x: cx + Math.cos(angle) * nodoR,
          y: cy + Math.sin(angle) * nodoR,
          r: 3.5, type: 'nodo', color: COLORS.nodo
        });
      }

      return nodes;
    }

    function renderCompanion() {
      time += 0.01;
      ctx.clearRect(0, 0, W, H);

      // Weave background
      const wPulse = Math.sin(time * 0.5) * 0.5 + 0.5;
      ctx.strokeStyle = `rgba(1,170,251,${0.03 + wPulse * 0.02})`;
      ctx.lineWidth = 0.3;
      const spacing = 25;
      for (let x = 0; x < W; x += spacing) {
        for (let y = 0; y < H; y += spacing) {
          const nx = x + spacing;
          const ny = y + spacing;
          if (nx < W) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, y); ctx.stroke(); }
          if (ny < H) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, ny); ctx.stroke(); }
        }
      }

      // Why: Weave layer is "all connections" — highlight when active
      const weaveActive = activeLayer === 'weave';
      if (weaveActive) {
        ctx.strokeStyle = `rgba(1,170,251,${0.08 + wPulse * 0.05})`;
        ctx.lineWidth = 0.8;
        for (let x = 0; x < W; x += spacing) {
          for (let y = 0; y < H; y += spacing) {
            const nx = x + spacing;
            const ny = y + spacing;
            if (nx < W) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, y); ctx.stroke(); }
            if (ny < H) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, ny); ctx.stroke(); }
          }
        }
      }

      const nodes = getNodePositions();

      // Draw connections
      const foundation = nodes[0];
      ctx.lineWidth = 0.5;
      nodes.forEach(n => {
        if (n.type === 'counit') {
          const active = activeLayer === 'foundation' || activeLayer === 'counit';
          ctx.strokeStyle = hexAlpha(n.color, active ? 0.3 : 0.06);
          ctx.beginPath(); ctx.moveTo(foundation.x, foundation.y); ctx.lineTo(n.x, n.y); ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach(n => {
        const isActive = n.type === activeLayer || activeLayer === 'weave';
        const alpha = isActive ? 1 : 0.2;
        const glowR = isActive ? n.r * 3 : 0;

        if (glowR > 0) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
          g.addColorStop(0, hexAlpha(n.color, 0.25));
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2); ctx.fill();
        }

        const pulseR = n.r + (isActive ? Math.sin(time * 2) * 1.5 : 0);
        ctx.beginPath(); ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = hexAlpha(n.color, 0.15 * alpha);
        ctx.fill();
        ctx.strokeStyle = hexAlpha(n.color, 0.6 * alpha);
        ctx.lineWidth = isActive ? 1.5 : 0.5;
        ctx.stroke();

        ctx.beginPath(); ctx.arc(n.x, n.y, pulseR * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = hexAlpha(n.color, 0.7 * alpha);
        ctx.fill();
      });

      requestAnimationFrame(renderCompanion);
    }

    // Why: IntersectionObserver per layer-section drives the companion highlight
    const layerSections = document.querySelectorAll('.layer-section[data-layer]');
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeLayer = entry.target.dataset.layer;
          // Update nav
          if (companionNav) {
            companionNav.querySelectorAll('.companion-nav-item').forEach(item => {
              item.classList.toggle('active', item.dataset.layer === activeLayer);
            });
          }
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    layerSections.forEach(s => scrollObserver.observe(s));

    // Nav click
    if (companionNav) {
      companionNav.querySelectorAll('.companion-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById(item.getAttribute('href').slice(1));
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }

    // Init companion
    const companionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        resizeCompanion();
        renderCompanion();
        companionObserver.disconnect();
      }
    }, { threshold: 0.1 });
    companionObserver.observe(companionContainer);

    window.addEventListener('resize', resizeCompanion);
  }

  // -------------------------------------------------------
  // ZONA C: Scale Visualization
  // -------------------------------------------------------
  const scaleContainer = document.getElementById('scaleContainer');
  const scaleCanvas = document.getElementById('scaleCanvas');

  if (scaleCanvas && scaleContainer) {
    const ctx = scaleCanvas.getContext('2d');
    let W, H, cx, cy, time = 0;
    let scaleNodes = [];
    let started = false;

    function resizeScale() {
      const rect = scaleContainer.getBoundingClientRect();
      W = scaleCanvas.width = rect.width;
      H = scaleCanvas.height = rect.height;
      cx = W / 2;
      cy = H / 2;
      buildScaleNetwork();
    }

    function buildScaleNetwork() {
      scaleNodes = [];

      // Core
      scaleNodes.push({ x: cx, y: cy, r: 10, color: COLORS.foundation, type: 'core' });

      // Co-Units ring
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        scaleNodes.push({ x: cx + Math.cos(a) * 60, y: cy + Math.sin(a) * 60, r: 5, color: COLORS.counit, type: 'cu' });
      }

      // Lands ring
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + 0.3;
        scaleNodes.push({ x: cx + Math.cos(a) * 130, y: cy + Math.sin(a) * 130, r: 7, color: COLORS.land, type: 'land' });
      }

      // Nodos ring
      for (let i = 0; i < 15; i++) {
        const a = (i / 15) * Math.PI * 2 + 0.1;
        const dist = 180 + Math.random() * 30;
        scaleNodes.push({ x: cx + Math.cos(a) * dist, y: cy + Math.sin(a) * dist, r: 4, color: COLORS.nodo, type: 'nodo' });
      }

      // Why: Peripheral "potential" nodes show the network's expansive capacity
      const maxR = Math.max(W, H) * 0.45;
      for (let i = 0; i < 50; i++) {
        const a = (i / 50) * Math.PI * 2 + Math.random() * 0.3;
        const dist = 230 + Math.random() * (maxR - 230);
        scaleNodes.push({
          x: cx + Math.cos(a) * dist,
          y: cy + Math.sin(a) * dist,
          r: 1.5 + Math.random() * 1.5,
          color: '#333',
          type: 'potential'
        });
      }
    }

    function renderScale() {
      time += 0.008;
      ctx.clearRect(0, 0, W, H);

      // Weave background mesh
      const wPulse = Math.sin(time * 0.4) * 0.5 + 0.5;
      ctx.strokeStyle = `rgba(1,170,251,${0.015 + wPulse * 0.01})`;
      ctx.lineWidth = 0.3;
      const spacing = 50;
      for (let x = 0; x < W; x += spacing) {
        for (let y = 0; y < H; y += spacing) {
          if (x + spacing < W) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + spacing, y); ctx.stroke(); }
          if (y + spacing < H) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + spacing); ctx.stroke(); }
        }
      }

      // Connections from core outward
      const core = scaleNodes[0];
      scaleNodes.forEach((n, i) => {
        if (i === 0) return;
        const dx = n.x - core.x, dy = n.y - core.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = Math.max(0.01, 0.15 - dist / (W * 0.8));
        ctx.strokeStyle = hexAlpha(n.color, alpha);
        ctx.lineWidth = n.type === 'potential' ? 0.2 : 0.5;
        ctx.beginPath();
        ctx.moveTo(core.x, core.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      });

      // Nodes
      scaleNodes.forEach(n => {
        const pulse = n.r + Math.sin(time * 1.5 + n.x * 0.01) * 0.5;

        if (n.type !== 'potential') {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pulse * 3);
          g.addColorStop(0, hexAlpha(n.color, 0.15));
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(n.x, n.y, pulse * 3, 0, Math.PI * 2); ctx.fill();
        }

        ctx.beginPath(); ctx.arc(n.x, n.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = hexAlpha(n.color, n.type === 'potential' ? 0.15 : 0.2);
        ctx.fill();
        ctx.strokeStyle = hexAlpha(n.color, n.type === 'potential' ? 0.2 : 0.5);
        ctx.lineWidth = n.type === 'potential' ? 0.3 : 1;
        ctx.stroke();

        ctx.beginPath(); ctx.arc(n.x, n.y, pulse * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = hexAlpha(n.color, n.type === 'potential' ? 0.3 : 0.6);
        ctx.fill();
      });

      requestAnimationFrame(renderScale);
    }

    const scaleObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        resizeScale();
        renderScale();
        scaleObserver.disconnect();
      }
    }, { threshold: 0.1 });
    scaleObserver.observe(scaleContainer);

    window.addEventListener('resize', resizeScale);
  }

})();
