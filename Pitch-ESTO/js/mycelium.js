// ============================================================
// ESTO Mycelium & Federated Network Simulator — Pitch Edition
// « Custodiar la tierra · Tejer la vida »
// ============================================================

(function() {
  'use strict';

  const container = document.getElementById('canvas-container');
  if (!container) return;

  const canvas = document.getElementById('myceliumCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // --- DATA DE LA RED FEDERADA ESTO ---
  const DATA = {
    foundation: {
      tag: "CORE",
      title: "Fundación & Custodia",
      desc: "Núcleo Común de la Red",
      color: "#00E6B8" // 01 Suelo & Custodia
    },
    coUnits: [
      { id: "estoma-gov", label: "Estoma Gobernanza", tag: "ESTOMA", color: "#00BCD4" },
      { id: "estoma-learn", label: "Estoma Saberes", tag: "ESTOMA", color: "#00C9A7" },
      { id: "estoma-regen", label: "Estoma Regeneración", tag: "ESTOMA", color: "#26DEA0" },
      { id: "estoma-live", label: "Estoma Hábitat", tag: "ESTOMA", color: "#D4A017" },
      { id: "estoma-care", label: "Estoma Cuidados", tag: "ESTOMA", color: "#4DD0E1" },
      { id: "estoma-story", label: "Estoma Narrativas", tag: "ESTOMA", color: "#FE84FB" },
      { id: "estoma-territory", label: "Estoma Territorio", tag: "ESTOMA", color: "#00ACC1" }
    ],
    lands: [
      { id: "delta-lab", label: "Delta & Humedales", tag: "BIOMA HUMEDAL", color: "#00E6B8", connectedCUs: [0, 2, 3, 4, 6] },
      { id: "costa-pampa", label: "Costa & Pampa", tag: "BIOMA PAMPEANO", color: "#D4A017", connectedCUs: [0, 1, 5, 6] },
      { id: "agro-valle", label: "Agroecología & Valles", tag: "BIOMA PRODUCTIVO", color: "#FE84FB", connectedCUs: [1, 2, 3, 5] },
      { id: "urbano-cohousing", label: "Manzanas Urbanas", tag: "BIOMA URBANO", color: "#01AAFB", connectedCUs: [0, 1, 4, 6] }
    ],
    nodos: [
      { id: "n-productores", label: "Red Agroalimentaria", tag: "NODO", connectedLand: 3, connectedCUs: [1, 2, 6] },
      { id: "n-micelio", label: "Hub de Formación", tag: "NODO", connectedLand: 1, connectedCUs: [0, 1, 5] },
      { id: "n-counity", label: "Protocolo Wave", tag: "NODO", connectedLand: 0, connectedCUs: [0, 5, 6] },
      { id: "n-ecolab", label: "Laboratorio Vivo", tag: "NODO", connectedLand: 0, connectedCUs: [2, 3, 6] },
      { id: "n-semilla", label: "Red Semillas Nativas", tag: "NODO", connectedLand: 2, connectedCUs: [2, 5, 0] },
      { id: "n-biohub", label: "BioHub Tecnológico", tag: "NODO", connectedLand: 1, connectedCUs: [1, 3, 4] },
      { id: "n-coopsol", label: "Cooperativa Energética", tag: "NODO", connectedLand: 2, connectedCUs: [1, 0, 6] },
      { id: "n-commune", label: "Red Vecinal Urbana", tag: "NODO", connectedLand: 3, connectedCUs: [0, 4, 5] }
    ]
  };

  // --- ESTADO Y VARIABLES DE CONTROL ---
  let W, H, cx, cy;
  let panX = 0, panY = 0, isDragging = false, dragStartX, dragStartY;
  let hoveredNode = null, selectedNode = null;
  let nodes = [], hyphae = [], particles = [], weavePoints = [];
  let time = 0;
  let currentActiveLayer = "intro";

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Ajuste espacial: en desktop se desplaza suavemente al lado derecho para dejar lugar al texto
    cx = W / 2 + (W > 768 ? Math.min(W * 0.16, 220) : 0);
    cy = W > 768 ? H / 2 : H * 0.38;
  }

  // --- CLASE NODE ---
  class Node {
    constructor(x, y, r, data, type) {
      this.x = x; this.y = y; this.baseX = x; this.baseY = y;
      this.r = r; this.data = data; this.type = type;
      this.glow = 0; this.pulse = 0;
      this.visible = 1;
      this.highlighted = false;
    }
    screenX() { return this.x + panX; }
    screenY() { return this.y + panY; }
    draw() {
      if (this.visible < 0.01) return;
      const sx = this.screenX(), sy = this.screenY();

      // Cálculo de visibilidad / transparencia según la capa activa del slide
      let alpha = 0.18;
      if (currentActiveLayer === "all" || currentActiveLayer === "weave" || currentActiveLayer === this.type ||
         (currentActiveLayer === "counit" && this.type === "foundation") ||
         (currentActiveLayer === "land" && (this.type === "counit" || this.type === "foundation")) ||
         (currentActiveLayer === "nodo" && (this.type === "land" || this.type === "counit" || this.type === "foundation"))) {
        alpha = 1;
      }

      if (currentActiveLayer === "intro") alpha = 0.12;

      const col = this.data.color || "#00E6B8";
      const glowStr = this.glow + (this.type === "foundation" ? 0.35 : 0);

      // Resplandor radial
      if (glowStr > 0.05 && alpha > 0.4) {
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, this.r * 4.2);
        g.addColorStop(0, hexAlpha(col, glowStr * 0.45 * alpha));
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(sx, sy, this.r * 4.2, 0, Math.PI * 2); ctx.fill();
      }

      // Pulso orgánico
      const pulseR = this.r + Math.sin(time * 2.2 + this.pulse) * (this.type === "foundation" ? 3.5 : 1.2);
      ctx.beginPath(); ctx.arc(sx, sy, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(col, 0.18 * alpha);
      ctx.fill();
      ctx.strokeStyle = hexAlpha(col, (0.55 + this.glow * 0.45) * alpha);
      ctx.lineWidth = this.type === "nodo" ? 1.2 : 1.8;
      ctx.stroke();

      // Núcleo sólido interior
      ctx.beginPath(); ctx.arc(sx, sy, pulseR * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(col, (0.7 + this.glow * 0.3) * alpha);
      ctx.fill();

      // Etiqueta de texto
      if (alpha > 0.45) {
        const isNodo = this.type === "nodo";
        const fontSize = this.type === "foundation" ? 14 : (isNodo ? 10.5 : 12);
        const weight = this.type === "foundation" ? 700 : 500;
        ctx.font = `${weight} ${fontSize}px 'Graphik', 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = hexAlpha("#FFFFFF", ((isNodo ? 0.4 : 0.85) + this.glow * 0.4) * alpha);
        ctx.textAlign = "center";
        ctx.fillText(this.data.label || this.data.title, sx, sy + pulseR + 18);
      }
    }
    hitTest(mx, my) {
      const dx = mx - this.screenX(), dy = my - this.screenY();
      return Math.sqrt(dx*dx + dy*dy) < Math.max(this.r * 2.6, 22);
    }
  }

  // --- CLASE HYPHA (Conexión micelar) ---
  class Hypha {
    constructor(from, to, type) {
      this.from = from; this.to = to; this.type = type;
      this.highlight = 0; this.visible = 1;
      this.cpOff1 = { x: (Math.random()-0.5)*80, y: (Math.random()-0.5)*80 };
      this.cpOff2 = { x: (Math.random()-0.5)*80, y: (Math.random()-0.5)*80 };
    }
    cp1() {
      const mx = (this.from.x + this.to.x)/2, my = (this.from.y + this.to.y)/2;
      return { x: mx + this.cpOff1.x + panX, y: my + this.cpOff1.y + panY };
    }
    cp2() {
      const mx = (this.from.x + this.to.x)/2, my = (this.from.y + this.to.y)/2;
      return { x: mx + this.cpOff2.x + panX, y: my + this.cpOff2.y + panY };
    }
    draw() {
      let v = 0.1;
      if (currentActiveLayer === "intro") v = 0.04;
      if (currentActiveLayer === "all" || currentActiveLayer === "weave") v = 1;
      if (currentActiveLayer === "counit" && this.type === "core-cu") v = 1;
      if (currentActiveLayer === "land" && (this.type === "cu-land" || this.type === "core-cu")) v = 1;
      if (currentActiveLayer === "nodo" && (this.type === "land-nodo" || this.type === "cu-land" || this.type === "core-cu")) v = 1;

      const c1 = this.cp1(), c2 = this.cp2();
      ctx.beginPath();
      ctx.moveTo(this.from.screenX(), this.from.screenY());
      ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, this.to.screenX(), this.to.screenY());

      const baseAlpha = 0.12 + this.highlight * 0.45;
      const col = this.highlight > 0.1 || v === 1 ? (this.from.data.color || this.to.data.color || "#01AAFB") : "#FFFFFF";

      ctx.strokeStyle = hexAlpha(col, baseAlpha * v);
      ctx.lineWidth = 1 + this.highlight * 2.2;
      ctx.stroke();
    }
    pointAt(t) {
      const fx = this.from.x + panX, fy = this.from.y + panY;
      const tx = this.to.x + panX, ty = this.to.y + panY;
      const c1 = this.cp1(), c2 = this.cp2();
      const u = 1 - t;
      return {
        x: u*u*u*fx + 3*u*u*t*c1.x + 3*u*t*t*c2.x + t*t*t*tx,
        y: u*u*u*fy + 3*u*u*t*c1.y + 3*u*t*t*c2.y + t*t*t*ty
      };
    }
  }

  // --- CLASE PARTICLE ---
  class Particle {
    constructor(hypha) {
      this.hypha = hypha;
      this.t = Math.random();
      this.speed = 0.002 + Math.random() * 0.0035;
      this.size = 1.6 + Math.random() * 1.6;
    }
    update() { this.t += this.speed; if (this.t > 1) this.t = 0; }
    draw() {
      let v = 0;
      if (currentActiveLayer === "all") v = 1;
      if (currentActiveLayer === "counit" && this.hypha.type === "core-cu") v = 1;
      if (currentActiveLayer === "land" && (this.hypha.type === "cu-land" || this.hypha.type === "core-cu")) v = 1;
      if (currentActiveLayer === "nodo") v = 1;

      if (v < 0.1) return;
      const p = this.hypha.pointAt(this.t);
      ctx.beginPath(); ctx.arc(p.x, p.y, this.size * v, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(this.hypha.from.data.color || "#00E6B8", 0.65 * v);
      ctx.fill();
    }
  }

  // --- CONSTRUCCIÓN DE LA RED ---
  function buildNetwork() {
    nodes = []; hyphae = []; particles = [];

    let netR;
    if (W > 768) {
      netR = Math.min(Math.max(W * 0.42, 540), 880);
    } else {
      netR = Math.min(Math.max(W * 0.75, 260), 380);
    }

    const coreR = netR * 0.26;
    const landR = netR * 0.52;

    // Nodo 1: Fundación Central (ESTO DAO Madre)
    const foundation = new Node(cx, cy, 28, { ...DATA.foundation, label: "ESTO Foundation" }, "foundation");
    nodes.push(foundation);

    // Nodos Capa 2: Círculos / Co-Units
    const cuNodes = [];
    DATA.coUnits.forEach((cu, i) => {
      const angle = (i / DATA.coUnits.length) * Math.PI * 2 - Math.PI / 2;
      const n = new Node(cx + Math.cos(angle)*coreR, cy + Math.sin(angle)*coreR, 15, cu, "counit");
      n.pulse = i;
      nodes.push(n); cuNodes.push(n);
      const h = new Hypha(foundation, n, "core-cu");
      hyphae.push(h);
      particles.push(new Particle(h));
      particles.push(new Particle(h));
    });

    // Nodos Capa 3: Lands Federadas en Territorio
    const landNodes = [];
    DATA.lands.forEach((land, i) => {
      const landAngles = [Math.PI * 0.15, Math.PI * 0.85, Math.PI * 0.48, Math.PI * 1.25];
      const angle = landAngles[i % landAngles.length];
      const n = new Node(cx + Math.cos(angle)*landR, cy + Math.sin(angle)*landR, 19, land, "land");
      n.pulse = i * 2;
      nodes.push(n); landNodes.push(n);
      land.connectedCUs.forEach(cuIdx => {
        if (cuNodes[cuIdx]) {
          const h = new Hypha(cuNodes[cuIdx], n, "cu-land");
          hyphae.push(h);
          particles.push(new Particle(h));
        }
      });
    });

    // Nodos Capa 4: Nodos y Alianzas
    const nodoColor = "#7c8594";
    DATA.nodos.forEach((nodo, i) => {
      const parentLand = landNodes[nodo.connectedLand] || landNodes[0];
      const angle = (i / DATA.nodos.length) * Math.PI * 2 + Math.PI / 4;
      const dist = netR * 0.16 + Math.random() * (netR * 0.1);
      const n = new Node(
        parentLand.baseX + Math.cos(angle) * dist,
        parentLand.baseY + Math.sin(angle) * dist,
        11, { ...nodo, color: nodoColor }, "nodo"
      );
      n.pulse = i * 0.7;
      nodes.push(n);
      const h = new Hypha(parentLand, n, "land-nodo");
      hyphae.push(h);
      particles.push(new Particle(h));
    });

    // Capa 5: Wave Grid Points
    weavePoints = [];
    const spacing = 95;
    for (let x = -100; x < W + 100; x += spacing) {
      for (let y = -100; y < H + 100; y += spacing) {
        weavePoints.push({ x: x + (Math.random()-0.5)*40, y: y + (Math.random()-0.5)*40 });
      }
    }
  }

  // --- DIBUJADO DE LA MALLA WAVE ---
  function drawWeave() {
    if (currentActiveLayer === "intro") return;

    let alphaMultiplier = currentActiveLayer === "all" || currentActiveLayer === "weave" || currentActiveLayer === "nodo" ? 1 : 0.35;
    const maxDist = 125;
    const pulse = Math.sin(time * 0.5) * 0.5 + 0.5;
    const r = Math.round(1 + pulse * 40);
    const g = Math.round(170 + pulse * 30);
    const b = Math.round(251 - pulse * 30);
    const lineAlpha = (0.07 + Math.sin(time * 0.3) * 0.02) * alphaMultiplier;

    ctx.strokeStyle = `rgba(${r},${g},${b},${lineAlpha})`;
    ctx.lineWidth = 0.6;

    for (let i = 0; i < weavePoints.length; i++) {
      const a = weavePoints[i];
      const ax = a.x + panX, ay = a.y + panY;
      if (ax < -80 || ax > W+80 || ay < -80 || ay > H+80) continue;
      for (let j = i+1; j < weavePoints.length; j++) {
        const b = weavePoints[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        if (Math.abs(dx) > maxDist || Math.abs(dy) > maxDist) continue;
        if (Math.sqrt(dx*dx + dy*dy) < maxDist) {
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(b.x + panX, b.y + panY);
          ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${r},${g},${b},${0.1 * alphaMultiplier})`;
      ctx.beginPath(); ctx.arc(ax, ay, 1.5, 0, Math.PI*2); ctx.fill();
    }
  }

  // --- INTERACCIÓN Y PROPAGACIÓN DE ONDAS ---
  function getNodeAt(mx, my) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (nodes[i].hitTest(mx, my)) return nodes[i];
    }
    return null;
  }

  function highlightConnections(node) {
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(nodes);
      gsap.killTweensOf(hyphae);
      nodes.forEach(n => { gsap.to(n, { glow: 0, duration: 0.3 }); });
      hyphae.forEach(h => { gsap.to(h, { highlight: 0, duration: 0.3 }); });
    }

    if (!node) return;

    if (typeof gsap !== 'undefined') {
      gsap.to(node, { glow: 1, duration: 0.3 });

      if (node.type === "foundation") {
        hyphae.forEach(h => {
          if (h.type === "core-cu") {
            gsap.to(h, { highlight: 1, duration: 0.4 });
            gsap.to(h.to, { glow: 0.8, duration: 0.4, delay: 0.15 });
          }
        });
        hyphae.forEach(h => {
          if (h.type === "cu-land") {
            gsap.to(h, { highlight: 0.6, duration: 0.6, delay: 0.4 });
            gsap.to(h.to, { glow: 0.6, duration: 0.6, delay: 0.6 });
          }
        });
      } else {
        hyphae.forEach(h => {
          if (h.from === node || h.to === node) {
            gsap.to(h, { highlight: 1, duration: 0.3 });
            const other = h.from === node ? h.to : h.from;
            gsap.to(other, { glow: 0.7, duration: 0.3 });
          }
        });
      }
    }
  }

  // --- EVENTOS DEL MOUSE Y TOUCH ---
  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  canvas.addEventListener("mousemove", e => {
    const { x, y } = getCanvasCoords(e);
    if (isDragging) {
      panX += e.clientX - dragStartX;
      panY += e.clientY - dragStartY;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      return;
    }
    const node = getNodeAt(x, y);
    if (node !== hoveredNode) {
      hoveredNode = node;
      canvas.style.cursor = node ? "pointer" : "grab";
      highlightConnections(node);
    }
  });

  canvas.addEventListener("mousedown", e => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  });

  canvas.addEventListener("mouseup", () => { isDragging = false; });
  canvas.addEventListener("mouseleave", () => { isDragging = false; hoveredNode = null; highlightConnections(null); });

  canvas.addEventListener("touchstart", e => {
    const t = e.touches[0];
    isDragging = true; dragStartX = t.clientX; dragStartY = t.clientY;
    const { x, y } = getCanvasCoords(t);
    const node = getNodeAt(x, y);
    if (node !== hoveredNode) {
      hoveredNode = node;
      highlightConnections(node);
    }
  }, { passive: true });

  canvas.addEventListener("touchmove", e => {
    if (!isDragging) return;
    const t = e.touches[0];
    panX += t.clientX - dragStartX; panY += t.clientY - dragStartY;
    dragStartX = t.clientX; dragStartY = t.clientY;
  }, { passive: true });

  canvas.addEventListener("touchend", () => { isDragging = false; });

  // --- LOOP PRINCIPAL DE RENDER ---
  function render() {
    time += 0.01;
    ctx.clearRect(0, 0, W, H);

    drawWeave();
    hyphae.forEach(h => h.draw());
    particles.forEach(p => { p.update(); p.draw(); });
    nodes.forEach(n => n.draw());

    requestAnimationFrame(render);
  }

  // --- UTILIDADES ---
  function hexAlpha(hex, a) {
    a = Math.max(0, Math.min(1, a));
    if (hex.startsWith("#")) {
      const r = parseInt(hex.slice(1,3), 16);
      const g = parseInt(hex.slice(3,5), 16);
      const b = parseInt(hex.slice(5,7), 16);
      return `rgba(${r},${g},${b},${a})`;
    }
    return hex;
  }

  // --- API EXPUESTA ---
  window.MyceliumCanvas = {
    init: () => {
      resize();
      buildNetwork();
      render();
      window.addEventListener('resize', () => { resize(); buildNetwork(); });
    },
    setLayer: (layer) => {
      currentActiveLayer = layer;
    }
  };

})();
