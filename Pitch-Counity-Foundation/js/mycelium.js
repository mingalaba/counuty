// ============================================================
// Counity Mycelium Network — Pitch Edition
// ============================================================

(function() {
  'use strict';

  const container = document.getElementById('canvas-container');
  if (!container) return;

  const canvas = document.getElementById('myceliumCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // --- DATA ---
  const DATA = {
    foundation: {
      tag: "CORE", title: "Foundation",
      desc: "El espacio de coordinación global.",
      color: "#00e6b8"
    },
    coUnits: [
      { id:"co-gov", label:"Co-Gov", tag:"CO-UNIT", color:"#00bcd4" },
      { id:"co-learn", label:"Co-Learn", tag:"CO-UNIT", color:"#00c9a7" },
      { id:"co-regen", label:"Co-Regen", tag:"CO-UNIT", color:"#26dea0" },
      { id:"co-live", label:"Co-Live", tag:"CO-UNIT", color:"#d4a017" },
      { id:"co-care", label:"Co-Care", tag:"CO-UNIT", color:"#4dd0e1" },
      { id:"co-story", label:"Co-Story", tag:"CO-UNIT", color:"#FE84FB" },
      { id:"co-territory", label:"Co-Territory", tag:"CO-UNIT", color:"#00acc1" }
    ],
    lands: [
      { id:"land-1", label:"Land Alpha", tag:"LAND", color:"#d4a017", connectedCUs: [0,2,3,4] },
      { id:"land-2", label:"Land Beta", tag:"LAND", color:"#c49000", connectedCUs: [0,1,5,6] },
      { id:"land-3", label:"Land Gamma", tag:"LAND", color:"#b8860b", connectedCUs: [1,2,3,5] }
    ],
    nodos: [
      { id:"n1", label:"Coop Sol", tag:"NODO", connectedLand: 0, connectedCUs: [1,2,3] },
      { id:"n2", label:"Red Semilla", tag:"NODO", connectedLand: 0, connectedCUs: [0,2,4] },
      { id:"n3", label:"Hub Urbano", tag:"NODO", connectedLand: 0, connectedCUs: [1,4,5] },
      { id:"n4", label:"EcoLab", tag:"NODO", connectedLand: 1, connectedCUs: [2,3,6] },
      { id:"n5", label:"Raíz", tag:"NODO", connectedLand: 1, connectedCUs: [2,5,0] },
      { id:"n6", label:"Agua", tag:"NODO", connectedLand: 1, connectedCUs: [1,3,4] },
      { id:"n7", label:"UniNodo", tag:"NODO", connectedLand: 2, connectedCUs: [1,0,6] },
      { id:"n8", label:"Artesanos", tag:"NODO", connectedLand: 2, connectedCUs: [3,5,2] },
      { id:"n9", label:"BioHub", tag:"NODO", connectedLand: 2, connectedCUs: [0,3,4] },
      { id:"n10", label:"Commune", tag:"NODO", connectedLand: 0, connectedCUs: [0,4,5,6] }
    ]
  };

  // --- STATE ---
  let W, H, cx, cy;
  let panX = 0, panY = 0, isDragging = false, dragStartX, dragStartY;
  let hoveredNode = null, selectedNode = null;
  let nodes = [], hyphae = [], particles = [], weavePoints = [];
  let time = 0;
  let currentActiveLayer = "intro";

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cx = W / 2 + (W > 768 ? 200 : 0); // Offset to the right to leave space for text
    cy = H / 2;
  }

  // --- NODE ---
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
      
      // Determine alpha based on active layer
      let alpha = 0.2; // Base dim alpha
      if (currentActiveLayer === "all" || currentActiveLayer === "weave" || currentActiveLayer === this.type || 
         (currentActiveLayer === "counit" && this.type === "foundation") ||
         (currentActiveLayer === "land" && (this.type === "counit" || this.type === "foundation")) ||
         (currentActiveLayer === "nodo" && (this.type === "land" || this.type === "counit" || this.type === "foundation"))) {
        alpha = 1; // Full brightness for active layer
      }

      if (currentActiveLayer === "intro") alpha = 0.15; // Very dim initially

      const col = this.data.color || "#666";
      const glowStr = this.glow + (this.type === "foundation" ? 0.3 : 0);

      if (glowStr > 0.05 && alpha > 0.5) {
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, this.r * 4);
        g.addColorStop(0, hexAlpha(col, glowStr * 0.4 * alpha));
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(sx, sy, this.r * 4, 0, Math.PI * 2); ctx.fill();
      }

      const pulseR = this.r + Math.sin(time * 2 + this.pulse) * (this.type === "foundation" ? 3 : 1);
      ctx.beginPath(); ctx.arc(sx, sy, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(col, 0.15 * alpha);
      ctx.fill();
      ctx.strokeStyle = hexAlpha(col, (0.5 + this.glow * 0.5) * alpha);
      ctx.lineWidth = this.type === "nodo" ? 1 : 1.5;
      ctx.stroke();

      ctx.beginPath(); ctx.arc(sx, sy, pulseR * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(col, (0.6 + this.glow * 0.4) * alpha);
      ctx.fill();

      if (alpha > 0.5) {
        const isNodo = this.type === "nodo";
        const fontSize = this.type === "foundation" ? 14 : (isNodo ? 10 : 12);
        const weight = this.type === "foundation" ? 600 : 400;
        ctx.font = `${weight} ${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = hexAlpha("#fff", ((isNodo ? 0.35 : 0.8) + this.glow * 0.5) * alpha);
        ctx.textAlign = "center";
        ctx.fillText(this.data.label || this.data.title, sx, sy + pulseR + 18);
      }
    }
    hitTest(mx, my) {
      const dx = mx - this.screenX(), dy = my - this.screenY();
      // Increase hit area slightly for easier hovering
      return Math.sqrt(dx*dx + dy*dy) < Math.max(this.r * 2.5, 20);
    }
  }

  // --- HYPHA ---
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
      
      if (currentActiveLayer === "intro") v = 0.05;
      if (currentActiveLayer === "all" || currentActiveLayer === "weave") v = 1;
      
      // Highlight specific connections based on layer
      if (currentActiveLayer === "counit" && this.type === "core-cu") v = 1;
      if (currentActiveLayer === "land" && (this.type === "cu-land" || this.type === "core-cu")) v = 1;
      if (currentActiveLayer === "nodo" && (this.type === "land-nodo" || this.type === "cu-land" || this.type === "core-cu")) v = 1;

      const c1 = this.cp1(), c2 = this.cp2();
      ctx.beginPath();
      ctx.moveTo(this.from.screenX(), this.from.screenY());
      ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, this.to.screenX(), this.to.screenY());
      
      const baseAlpha = 0.1 + this.highlight * 0.4;
      const col = this.highlight > 0.1 || v === 1 ? (this.from.data.color || this.to.data.color || "#00bcd4") : "#ffffff";
      
      ctx.strokeStyle = hexAlpha(col, baseAlpha * v);
      ctx.lineWidth = 1 + this.highlight * 2;
      ctx.stroke();
    }
    pointAt(t) {
      const fx=this.from.x+panX, fy=this.from.y+panY;
      const tx=this.to.x+panX, ty=this.to.y+panY;
      const c1=this.cp1(), c2=this.cp2();
      const u=1-t;
      return {
        x: u*u*u*fx + 3*u*u*t*c1.x + 3*u*t*t*c2.x + t*t*t*tx,
        y: u*u*u*fy + 3*u*u*t*c1.y + 3*u*t*t*c2.y + t*t*t*ty
      };
    }
  }

  // --- PARTICLE ---
  class Particle {
    constructor(hypha) {
      this.hypha = hypha;
      this.t = Math.random();
      this.speed = 0.002 + Math.random() * 0.003;
      this.size = 1.5 + Math.random() * 1.5;
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
      ctx.beginPath(); ctx.arc(p.x, p.y, this.size * v, 0, Math.PI*2);
      ctx.fillStyle = hexAlpha(this.hypha.from.data.color || "#00bcd4", 0.6 * v);
      ctx.fill();
    }
  }

  // --- BUILD ---
  function buildNetwork() {
    nodes = []; hyphae = []; particles = [];
    
    const netR = Math.max(W * 0.6, 500); // Scale based on screen
    const coreR = netR * 0.25;
    const landR = netR * 0.5;

    const foundation = new Node(cx, cy, 26, { ...DATA.foundation, label: "Foundation" }, "foundation");
    nodes.push(foundation);

    const cuNodes = [];
    DATA.coUnits.forEach((cu, i) => {
      const angle = (i / DATA.coUnits.length) * Math.PI * 2 - Math.PI / 2;
      const n = new Node(cx + Math.cos(angle)*coreR, cy + Math.sin(angle)*coreR, 14, cu, "counit");
      n.pulse = i;
      nodes.push(n); cuNodes.push(n);
      const h = new Hypha(foundation, n, "core-cu");
      hyphae.push(h);
      particles.push(new Particle(h));
      particles.push(new Particle(h));
    });

    const landNodes = [];
    DATA.lands.forEach((land, i) => {
      const landAngles = [Math.PI * 0.15, Math.PI * 0.85, Math.PI * 0.5];
      const angle = landAngles[i];
      const n = new Node(cx + Math.cos(angle)*landR, cy + Math.sin(angle)*landR, 18, land, "land");
      n.pulse = i * 2;
      nodes.push(n); landNodes.push(n);
      land.connectedCUs.forEach(cuIdx => {
        const h = new Hypha(cuNodes[cuIdx], n, "cu-land");
        hyphae.push(h);
        particles.push(new Particle(h));
      });
    });

    const nodoColor = "#7c8594";
    const nodoNodes = [];
    DATA.nodos.forEach((nodo, i) => {
      const parentLand = landNodes[nodo.connectedLand];
      const angle = (i / DATA.nodos.length) * Math.PI * 2 + Math.PI / 4;
      const dist = netR * 0.15 + Math.random() * (netR * 0.1);
      const n = new Node(
        parentLand.baseX + Math.cos(angle) * dist,
        parentLand.baseY + Math.sin(angle) * dist,
        10, { ...nodo, color: nodoColor }, "nodo"
      );
      n.pulse = i * 0.7;
      nodes.push(n); nodoNodes.push(n);
      const h = new Hypha(parentLand, n, "land-nodo");
      hyphae.push(h);
      particles.push(new Particle(h));
    });

    // Weave background
    weavePoints = [];
    const spacing = 90;
    for (let x = -100; x < W + 100; x += spacing) {
      for (let y = -100; y < H + 100; y += spacing) {
        weavePoints.push({ x: x + (Math.random()-0.5)*40, y: y + (Math.random()-0.5)*40 });
      }
    }
  }

  // --- DRAW WEAVE ---
  function drawWeave() {
    if (currentActiveLayer === "intro") return; // Hidden on first slides
    
    let alphaMultiplier = currentActiveLayer === "all" || currentActiveLayer === "nodo" ? 1 : 0.3;

    const maxDist = 120;
    const pulse = Math.sin(time * 0.5) * 0.5 + 0.5;
    const r = Math.round(10 + pulse * 50);
    const g = Math.round(170 - pulse * 60);
    const b = Math.round(251 - pulse * 40);
    const lineAlpha = (0.08 + Math.sin(time * 0.3) * 0.02) * alphaMultiplier;
    
    ctx.strokeStyle = `rgba(${r},${g},${b},${lineAlpha})`;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < weavePoints.length; i++) {
      const a = weavePoints[i];
      const ax = a.x + panX, ay = a.y + panY;
      if (ax < -80 || ax > W+80 || ay < -80 || ay > H+80) continue;
      for (let j = i+1; j < weavePoints.length; j++) {
        const b = weavePoints[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        if (Math.abs(dx) > maxDist || Math.abs(dy) > maxDist) continue;
        if (Math.sqrt(dx*dx+dy*dy) < maxDist) {
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(b.x+panX, b.y+panY);
          ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${r},${g},${b},${0.1 * alphaMultiplier})`;
      ctx.beginPath(); ctx.arc(ax, ay, 1.5, 0, Math.PI*2); ctx.fill();
    }
  }

  // --- INTERACTION ---
  function getNodeAt(mx, my) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (nodes[i].type === "ghost") continue;
      if (nodes[i].hitTest(mx, my)) return nodes[i];
    }
    return null;
  }

  function highlightConnections(node) {
    gsap.killTweensOf(nodes);
    gsap.killTweensOf(hyphae);
    nodes.forEach(n => { gsap.to(n, { glow: 0, duration: 0.3 }); });
    hyphae.forEach(h => { gsap.to(h, { highlight: 0, duration: 0.3 }); });
    if (!node) return;
    
    gsap.to(node, { glow: 1, duration: 0.3 });

    if (node.type === "foundation") {
      // Ola 1: Foundation a Co-Units
      hyphae.forEach(h => {
        if (h.type === "core-cu") {
          gsap.to(h, { highlight: 1, duration: 0.4 });
          gsap.to(h.to, { glow: 0.8, duration: 0.4, delay: 0.2 });
        }
      });
      // Ola 2: Co-Units a Lands y Nodos
      hyphae.forEach(h => {
        if (h.type === "cu-land" || h.type === "cu-nodo") {
          gsap.to(h, { highlight: 0.5, duration: 0.6, delay: 0.5 });
          gsap.to(h.to, { glow: 0.5, duration: 0.6, delay: 0.7 });
        }
      });
      // Ola 3: Lands a Nodos
      hyphae.forEach(h => {
        if (h.type === "land-nodo") {
          gsap.to(h, { highlight: 0.2, duration: 0.8, delay: 1.0 });
          gsap.to(h.to, { glow: 0.3, duration: 0.8, delay: 1.2 });
        }
      });
    } else {
      // Comportamiento normal para otros nodos + retroceso a Foundation
      const connectedCUs = new Set();
      const connectedLands = new Set();

      hyphae.forEach(h => {
        if (h.from === node || h.to === node) {
          gsap.to(h, { highlight: 1, duration: 0.3 });
          const other = h.from === node ? h.to : h.from;
          if (other.type !== "ghost") gsap.to(other, { glow: 0.6, duration: 0.3 });
          
          if (other.type === "counit") connectedCUs.add(other);
          if (other.type === "land") connectedLands.add(other);
        }
      });

      // Retroceso (Iluminar de CUs y Lands hacia el centro)
      if (node.type === "land") {
        hyphae.forEach(h => {
          if (h.type === "cu-land" && h.to === node) {
            gsap.to(h, { highlight: 0.6, duration: 0.3 });
            gsap.to(h.from, { glow: 0.5, duration: 0.3 });
            connectedCUs.add(h.from);
          }
        });
      } else if (node.type === "nodo") {
        hyphae.forEach(h => {
          if (h.type === "cu-land" && connectedLands.has(h.to)) {
            gsap.to(h, { highlight: 0.4, duration: 0.3 });
            gsap.to(h.from, { glow: 0.4, duration: 0.3 });
            connectedCUs.add(h.from);
          }
        });
      }

      // Iluminar de todas las CUs recolectadas hacia Foundation
      if (node.type !== "foundation") {
        hyphae.forEach(h => {
          if (h.type === "core-cu" && connectedCUs.has(h.to)) {
            gsap.to(h, { highlight: 0.3, duration: 0.3 });
            gsap.to(h.from, { glow: 0.3, duration: 0.3 });
          }
        });
      }
    }
  }

  // --- CANVAS EVENTS ---
  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  canvas.addEventListener("mousemove", e => {
    // Only allow interactions when the network is fully visible (or semi-visible on architecture slides)
    // If it's intro, we can ignore or let it be subtle.
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

  // Touch
  canvas.addEventListener("touchstart", e => {
    const t = e.touches[0];
    isDragging = true; dragStartX = t.clientX; dragStartY = t.clientY;
    
    // Simulate hover for touch
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

  // --- RENDER ---
  function render() {
    time += 0.01;
    ctx.clearRect(0, 0, W, H);

    drawWeave();
    hyphae.forEach(h => h.draw());
    particles.forEach(p => { p.update(); p.draw(); });
    nodes.forEach(n => n.draw());

    requestAnimationFrame(render);
  }

  // --- UTILS ---
  function hexAlpha(hex, a) {
    a = Math.max(0, Math.min(1, a));
    if (hex.startsWith("#")) {
      const r = parseInt(hex.slice(1,3),16);
      const g = parseInt(hex.slice(3,5),16);
      const b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${a})`;
    }
    return hex;
  }

  // --- EXPOSED API ---
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
