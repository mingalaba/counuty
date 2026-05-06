// ============================================================
// Counity Mycelium Network — Integrated Version
// Adapted from POC to work inside .mycelium-container
// Uses the deck specs: Foundation core, Co-Units, Lands, Nodos, Weave
// ============================================================

(function() {
  'use strict';

  const container = document.getElementById('myceliumContainer');
  if (!container) return;

  const canvas = document.getElementById('myceliumCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // --- DATA (updated to match foundation_mvp_deck Co-Units) ---
  const DATA = {
    foundation: {
      tag: "CORE", title: "Foundation",
      desc: "El espacio de coordinación global. Custodia la visión, articula decisiones estratégicas y mantiene la infraestructura común. El punto de anclaje de toda la red.",
      color: "#00e6b8"
    },
    coUnits: [
      { id:"co-gov", label:"Co-Gov", tag:"CO-UNIT", color:"#00bcd4",
        desc:"Gobernanza distribuida. Facilita decisiones colectivas, mecanismos de consenso y rendición de cuentas." },
      { id:"co-learn", label:"Co-Learn", tag:"CO-UNIT", color:"#00c9a7",
        desc:"Aprendizaje continuo. Diseña experiencias educativas, documentación viva y transferencia de conocimiento." },
      { id:"co-regen", label:"Co-Regen", tag:"CO-UNIT", color:"#26dea0",
        desc:"Regeneración territorial. Coordina restauración ecológica, permacultura y diseño bioclimático." },
      { id:"co-live", label:"Co-Live", tag:"CO-UNIT", color:"#d4a017",
        desc:"Hábitat y bioarquitectura. Diseña el espacio habitable con materiales locales e infraestructura sostenible." },
      { id:"co-care", label:"Co-Care", tag:"CO-UNIT", color:"#4dd0e1",
        desc:"Bienestar comunitario. Salud emocional, resolución de conflictos y cohesión social." },
      { id:"co-story", label:"Co-Story", tag:"CO-UNIT", color:"#FE84FB",
        desc:"Narrativa e identidad. Comunicación y memoria colectiva. La voz del ecosistema." },
      { id:"co-territory", label:"Co-Territory", tag:"CO-UNIT", color:"#00acc1",
        desc:"Justicia territorial, articulación intercultural, saberes locales y relación con el entorno." }
    ],
    lands: [
      { id:"land-1", label:"Land Alpha", tag:"LAND", color:"#d4a017",
        desc:"El primer laboratorio territorial. Regeneración y convivencia en escala real.",
        connectedCUs: [0,2,3,4] },
      { id:"land-2", label:"Land Beta", tag:"LAND", color:"#c49000",
        desc:"Nodo urbano experimental. El modelo Counity en contextos de alta densidad.",
        connectedCUs: [0,1,5,6] },
      { id:"land-3", label:"Land Gamma", tag:"LAND", color:"#b8860b",
        desc:"Hub de innovación regenerativa. Tecnología, agroecología y formación práctica.",
        connectedCUs: [1,2,3,5] }
    ],
    nodos: [
      { id:"n1", label:"Cooperativa Sol", tag:"NODO", connectedLand: 0, connectedCUs: [1,2,3],
        desc:"Cooperativa agrícola que adopta el protocolo Counity para integrarse a la red." },
      { id:"n2", label:"Red Semilla", tag:"NODO", connectedLand: 0, connectedCUs: [0,2,4],
        desc:"Banco de semillas comunitario conectado como nodo adherente." },
      { id:"n3", label:"Hub Urbano", tag:"NODO", connectedLand: 0, connectedCUs: [1,4,5],
        desc:"Espacio de coworking regenerativo en zona urbana." },
      { id:"n4", label:"EcoLab Sur", tag:"NODO", connectedLand: 1, connectedCUs: [2,3,6],
        desc:"Laboratorio de innovación ecosistémica aliado a la red." },
      { id:"n5", label:"Colectivo Raíz", tag:"NODO", connectedLand: 1, connectedCUs: [2,5,0],
        desc:"Colectivo de permacultura que comparte protocolos con la red." },
      { id:"n6", label:"Fundación Agua", tag:"NODO", connectedLand: 1, connectedCUs: [1,3,4],
        desc:"ONG de gestión hídrica integrada al ecosistema Counity." },
      { id:"n7", label:"Nodo Educativo", tag:"NODO", connectedLand: 2, connectedCUs: [1,0,6],
        desc:"Universidad aliada que investiga modelos de gobernanza distribuida." },
      { id:"n8", label:"Red Artesana", tag:"NODO", connectedLand: 2, connectedCUs: [3,5,2],
        desc:"Red de artesanos locales conectada para intercambio de valor." },
      { id:"n9", label:"BioHub Norte", tag:"NODO", connectedLand: 2, connectedCUs: [0,3,4],
        desc:"Centro de bioconstrucción que adopta estándares Counity." },
      { id:"n10", label:"Commune Digital", tag:"NODO", connectedLand: 0, connectedCUs: [0,4,5,6],
        desc:"Comunidad digital nómade adherente al protocolo de gobernanza." }
    ]
  };

  // --- STATE ---
  let W, H, cx, cy;
  let panX = 0, panY = 0, isDragging = false, dragStartX, dragStartY;
  let hoveredNode = null, selectedNode = null;
  let nodes = [], hyphae = [], particles = [], weavePoints = [];
  let time = 0;

  // --- Panel refs ---
  const panel = document.getElementById('myceliumPanel');
  const panelTag = document.getElementById('myceliumPanelTag');
  const panelTitle = document.getElementById('myceliumPanelTitle');
  const panelDesc = document.getElementById('myceliumPanelDesc');
  const panelClose = document.getElementById('myceliumPanelClose');

  function resize() {
    const rect = container.getBoundingClientRect();
    W = canvas.width = rect.width;
    H = canvas.height = rect.height;
    cx = W / 2;
    
    // Obtenemos la altura real del hero para que la red empiece justo después
    const heroBand = document.querySelector('.mycelium-hero-band');
    const heroHeight = heroBand ? heroBand.offsetHeight : (H * 0.25);
    
    // Detectamos si es mobile para ajustar la escala
    const isMobile = W < 768;
    
    // Calculamos un tamaño base para la red
    // En mobile, permitimos que la red ocupe un porcentaje del ancho de la pantalla para que no se recorte tanto
    const netR = isMobile ? Math.max(W * 0.95, 320) : Math.max(W, 650);
    const maxRadius = netR * 0.40; // El radio máximo de la red sumando distancias
    const maxRadiusY = maxRadius * 0.55; // Achatamiento elíptico
    
    // El nodo más alto (Co-Gov) debe quedar unos píxeles debajo del último elemento del hero
    const bottomElement = document.querySelector('.mycelium-hint') || document.querySelector('.mycelium-hero-scroll');
    let arrowBottom = heroHeight; // fallback
    if (bottomElement) {
      const arrowRect = bottomElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      arrowBottom = arrowRect.bottom - containerRect.top;
    }
    
    // cy menos maxRadiusY nos da la parte más alta de la red.
    // Posicionamos cy para que el nodo más alto quede justo debajo del hint text.
    cy = arrowBottom + maxRadiusY + 15;

    // Asegurar que el contenedor sea lo suficientemente alto para no cortar la red en la parte inferior
    // En mobile agregamos más padding para que no se corte el final de la red.
    const bottomPadding = isMobile ? 120 : 60;
    const requiredHeight = cy + maxRadiusY + bottomPadding; 
    const zone = document.getElementById('myceliumZone');
    
    // Ajustamos la altura siempre para que la zona se adapte exactamente a la red (ni más grande ni más chica)
    if (zone) {
      zone.style.height = requiredHeight + 'px';
      
      // Como cambiamos el alto del div padre, necesitamos releer el rect del canvas
      const newRect = container.getBoundingClientRect();
      W = canvas.width = newRect.width;
      H = canvas.height = newRect.height;
    }
  }

  // --- NODE ---
  class Node {
    constructor(x, y, r, data, type) {
      this.x = x; this.y = y; this.baseX = x; this.baseY = y;
      this.r = r; this.data = data; this.type = type;
      this.glow = 0; this.pulse = 0;
      this.visible = type === "foundation" ? 1 : 0;
    }
    screenX() { return this.x + panX; }
    screenY() { return this.y + panY; }
    draw() {
      if (this.visible < 0.01) return;
      const sx = this.screenX(), sy = this.screenY();
      const alpha = this.visible;
      const col = this.data.color || "#666";
      const glowStr = this.glow + (this.type === "foundation" ? 0.3 : 0);

      if (glowStr > 0.05) {
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, this.r * 4);
        g.addColorStop(0, hexAlpha(col, glowStr * 0.4 * alpha));
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(sx, sy, this.r * 4, 0, Math.PI * 2); ctx.fill();
      }

      const pulseR = this.r + Math.sin(time * 2 + this.pulse) * (this.type === "foundation" ? 3 : 1);
      ctx.beginPath(); ctx.arc(sx, sy, pulseR * alpha, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(col, 0.15 * alpha);
      ctx.fill();
      ctx.strokeStyle = hexAlpha(col, (0.5 + this.glow * 0.5) * alpha);
      ctx.lineWidth = this.type === "nodo" ? 1 : 1.5;
      ctx.stroke();

      ctx.beginPath(); ctx.arc(sx, sy, pulseR * 0.4 * alpha, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(col, (0.6 + this.glow * 0.4) * alpha);
      ctx.fill();

      // Why: All node types get labels now — nodos use smaller font
      if (alpha > 0.5) {
        const isNodo = this.type === "nodo";
        const fontSize = this.type === "foundation" ? 12 : (isNodo ? 9 : 10);
        const weight = this.type === "foundation" ? 600 : 400;
        ctx.font = `${weight} ${fontSize}px Graphik, Inter, sans-serif`;
        ctx.fillStyle = hexAlpha("#fff", ((isNodo ? 0.35 : 0.5) + this.glow * 0.5) * alpha);
        ctx.textAlign = "center";
        ctx.fillText(this.data.label || this.data.title, sx, sy + pulseR + 14);
      }
    }
    hitTest(mx, my) {
      const dx = mx - this.screenX(), dy = my - this.screenY();
      return Math.sqrt(dx*dx + dy*dy) < Math.max(this.r * 2.5, 20) && this.visible > 0.3;
    }
  }

  // --- HYPHA ---
  class Hypha {
    constructor(from, to, type) {
      this.from = from; this.to = to; this.type = type;
      this.highlight = 0; this.visible = 0;
      this.cpOff1 = { x: (Math.random()-0.5)*60, y: (Math.random()-0.5)*60 };
      this.cpOff2 = { x: (Math.random()-0.5)*60, y: (Math.random()-0.5)*60 };
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
      const v = Math.min(this.from.visible, this.to.visible, this.visible);
      if (v < 0.01) return;
      const c1 = this.cp1(), c2 = this.cp2();
      ctx.beginPath();
      ctx.moveTo(this.from.screenX(), this.from.screenY());
      ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, this.to.screenX(), this.to.screenY());
      const baseAlpha = 0.08 + this.highlight * 0.35;
      const col = this.highlight > 0.1 ? (this.from.data.color || this.to.data.color || "#00bcd4") : "#ffffff";
      ctx.strokeStyle = hexAlpha(col, baseAlpha * v);
      ctx.lineWidth = 0.5 + this.highlight * 1.5;
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
      const v = Math.min(this.hypha.from.visible, this.hypha.to.visible, this.hypha.visible);
      if (v < 0.3) return;
      const intensity = 0.15 + this.hypha.highlight * 0.7;
      if (intensity < 0.1) return;
      const p = this.hypha.pointAt(this.t);
      ctx.beginPath(); ctx.arc(p.x, p.y, this.size * v, 0, Math.PI*2);
      ctx.fillStyle = hexAlpha(this.hypha.from.data.color || "#00bcd4", intensity * v);
      ctx.fill();
    }
  }

  // --- BUILD ---
  function buildNetwork() {
    nodes = []; hyphae = []; particles = [];
    
    const netR = Math.max(W, 700);
    const coreR = netR * 0.15;
    const landR = netR * 0.28;

    const foundation = new Node(cx, cy, 22, { ...DATA.foundation, label: "Foundation" }, "foundation");
    foundation.visible = 1;
    nodes.push(foundation);

    const cuNodes = [];
    DATA.coUnits.forEach((cu, i) => {
      const angle = (i / DATA.coUnits.length) * Math.PI * 2 - Math.PI / 2;
      // Añadimos achatamiento en Y (x 0.55) para no ocupar tanta altura vertical
      const n = new Node(cx + Math.cos(angle)*coreR, cy + Math.sin(angle)*coreR * 0.55, 12, cu, "counit");
      n.pulse = i;
      nodes.push(n); cuNodes.push(n);
      const h = new Hypha(foundation, n, "core-cu");
      hyphae.push(h);
      particles.push(new Particle(h));
      particles.push(new Particle(h));
    });

    const landNodes = [];
    DATA.lands.forEach((land, i) => {
      // Distribuir más horizontalmente para no estirar tanto hacia abajo
      // 0: Derecha-abajo, 1: Izquierda-abajo (Beta), 2: Centro-abajo
      const landAngles = [Math.PI * 0.15, Math.PI * 0.85, Math.PI * 0.5];
      const scaleMods = [1.0, 0.85, 0.9]; // Beta está un poco más cerca del centro
      
      const angle = landAngles[i];
      const scale = scaleMods[i];
      const n = new Node(cx + Math.cos(angle)*landR*scale, cy + Math.sin(angle)*landR*scale * 0.55, 15, land, "land");
      n.pulse = i * 2;
      nodes.push(n); landNodes.push(n);
      land.connectedCUs.forEach(cuIdx => {
        const h = new Hypha(cuNodes[cuIdx], n, "cu-land");
        hyphae.push(h);
        particles.push(new Particle(h));
      });
    });

    // Why: Nodos are first-class — spread outward from lands with more distance
    const nodoColor = "#7c8594";
    const nodoNodes = [];
    DATA.nodos.forEach((nodo, i) => {
      const parentLand = landNodes[nodo.connectedLand];
      const angle = (i / DATA.nodos.length) * Math.PI * 2 + Math.PI / 4;
      const dist = netR * 0.08 + Math.random() * (netR * 0.04);
      const n = new Node(
        parentLand.baseX + Math.cos(angle) * dist,
        parentLand.baseY + Math.sin(angle) * dist * 0.55,
        8, { ...nodo, color: nodoColor }, "nodo"
      );
      n.pulse = i * 0.7;
      nodes.push(n); nodoNodes.push(n);
      const h = new Hypha(parentLand, n, "land-nodo");
      hyphae.push(h);
      particles.push(new Particle(h));

      // Why: Nodos also connect to co-units — shows cross-layer collaboration
      if (nodo.connectedCUs) {
        nodo.connectedCUs.forEach(cuIdx => {
          if (cuNodes[cuIdx]) {
            const hcu = new Hypha(cuNodes[cuIdx], n, "cu-nodo");
            hyphae.push(hcu);
          }
        });
      }
    });

    // Weave background
    weavePoints = [];
    const spacing = 70;
    for (let x = -100; x < W + 100; x += spacing) {
      for (let y = -100; y < H + 100; y += spacing) {
        weavePoints.push({ x: x + (Math.random()-0.5)*30, y: y + (Math.random()-0.5)*30 });
      }
    }

    // Peripheral filaments
    for (let i = 0; i < 20; i++) {
      const edge = Math.floor(Math.random()*4);
      let ex, ey;
      if (edge===0) { ex=-30; ey=Math.random()*H; }
      else if (edge===1) { ex=W+30; ey=Math.random()*H; }
      else if (edge===2) { ey=-30; ex=Math.random()*W; }
      else { ey=H+30; ex=Math.random()*W; }
      const ghostNode = new Node(ex, ey, 2, {color:"#222"}, "ghost");
      ghostNode.visible = 1;
      nodes.push(ghostNode);
      const target = [...cuNodes, ...landNodes][Math.floor(Math.random()*(cuNodes.length+landNodes.length))];
      const h = new Hypha(target, ghostNode, "peripheral");
      h.visible = 1;
      hyphae.push(h);
    }
  }

  // --- GROWTH ANIMATION ---
  function animateGrowth() {
    const tl = gsap.timeline();
    const coreH = hyphae.filter(h => h.type === "core-cu");
    const cuN = nodes.filter(n => n.type === "counit");
    tl.to(coreH, { visible: 1, duration: 1.2, stagger: 0.08, ease: "power2.out" }, 0);
    tl.to(cuN, { visible: 1, duration: 0.8, stagger: 0.08, ease: "power2.out" }, 0.4);

    const cuLandH = hyphae.filter(h => h.type === "cu-land");
    const landN = nodes.filter(n => n.type === "land");
    tl.to(cuLandH, { visible: 1, duration: 1, stagger: 0.06, ease: "power2.out" }, 1);
    tl.to(landN, { visible: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }, 1.3);

    const nodoH = hyphae.filter(h => h.type === "land-nodo");
    const nodoN = nodes.filter(n => n.type === "nodo");
    tl.to(nodoH, { visible: 1, duration: 0.6, stagger: 0.04 }, 1.8);
    tl.to(nodoN, { visible: 1, duration: 0.5, stagger: 0.04 }, 2);

    // Why: cu-nodo connections animate after nodos appear
    const cuNodoH = hyphae.filter(h => h.type === "cu-nodo");
    tl.to(cuNodoH, { visible: 1, duration: 0.8, stagger: 0.04 }, 2.2);

    tl.to(hyphae.filter(h => h.type === "peripheral"), { visible: 1, duration: 1.5, stagger: 0.03 }, 2.6);
  }

  // --- DRAW WEAVE ---
  // Why: Weave is Capa 5 — must be clearly visible as the connective tissue
  function drawWeave() {
    const maxDist = 80;
    const pulse = Math.sin(time * 0.5) * 0.5 + 0.5;
    const r = Math.round(10 + pulse * 50);
    const g = Math.round(170 - pulse * 60);
    const b = Math.round(251 - pulse * 40);
    // Why: Opacity raised to 0.08 base — user reported pattern was too dark
    const lineAlpha = 0.08 + Math.sin(time * 0.3) * 0.02;
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
      ctx.fillStyle = `rgba(${r},${g},${b},0.1)`;
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
      // Ola 2: Co-Units a Lands y Nodos (conexiones secundarias)
      hyphae.forEach(h => {
        if (h.type === "cu-land" || h.type === "cu-nodo") {
          gsap.to(h, { highlight: 0.5, duration: 0.6, delay: 0.5 });
          gsap.to(h.to, { glow: 0.5, duration: 0.6, delay: 0.7 });
        }
      });
      // Ola 3: Lands a Nodos (capa exterior sutil)
      hyphae.forEach(h => {
        if (h.type === "land-nodo") {
          gsap.to(h, { highlight: 0.2, duration: 0.8, delay: 1.0 });
          gsap.to(h.to, { glow: 0.3, duration: 0.8, delay: 1.2 });
        }
      });
    } else {
      // Comportamiento normal para otros nodos + retroceso a Foundation
      // Paso 1: iluminar las conexiones directas del nodo seleccionado
      const connectedCUs = new Set();
      const connectedLands = new Set();

      hyphae.forEach(h => {
        if (h.from === node || h.to === node) {
          gsap.to(h, { highlight: 1, duration: 0.3 });
          const other = h.from === node ? h.to : h.from;
          if (other.type !== "ghost") gsap.to(other, { glow: 0.6, duration: 0.3 });
          
          // Registrar para el retroceso
          if (other.type === "counit") connectedCUs.add(other);
          if (other.type === "land") connectedLands.add(other);
        }
      });

      // Paso 2: Retroceso (Iluminar de CUs y Lands hacia el centro)
      if (node.type === "land") {
        hyphae.forEach(h => {
          if (h.type === "cu-land" && h.to === node) {
            gsap.to(h, { highlight: 0.6, duration: 0.3 });
            gsap.to(h.from, { glow: 0.5, duration: 0.3 }); // Ilumina la CU
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

      // Paso 3: Iluminar de todas las CUs recolectadas hacia Foundation
      if (node.type !== "foundation") {
        hyphae.forEach(h => {
          if (h.type === "core-cu" && connectedCUs.has(h.to)) {
            gsap.to(h, { highlight: 0.3, duration: 0.3 });
            gsap.to(h.from, { glow: 0.3, duration: 0.3 }); // Ilumina Foundation
          }
        });
      }
    }
  }

  function showPanel(node, scrollToLayer) {
    if (!panel) return;
    panelTag.textContent = node.data.tag || node.type.toUpperCase();
    panelTag.style.color = node.data.color || "#aaa";
    panelTitle.textContent = node.data.label || node.data.title;
    panelTitle.style.color = node.data.color || "#fff";
    panelDesc.textContent = node.data.desc || "";
    panel.classList.add("visible");

    // Why: Only scroll to layer section on explicit click, never on hover
    if (scrollToLayer) {
      const layerMap = {
        'foundation': 'layer-foundation',
        'counit': 'layer-counits',
        'land': 'layer-lands',
        'nodo': 'layer-nodos',
        'weave': 'layer-weave'
      };
      const targetId = layerMap[node.type];
      if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 400);
        }
      }
    }
  }

  function closePanel() {
    if (panel) panel.classList.remove("visible");
    selectedNode = null;
    highlightConnections(null);
  }

  if (panelClose) panelClose.addEventListener('click', closePanel);

  // Why: After click-to-scroll, panel stays open and blocks hover.
  // Auto-close when the canvas scrolls out of view, restoring hover behavior.
  const panelScrollObserver = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting && selectedNode) {
      closePanel();
    }
  }, { threshold: 0.3 });
  panelScrollObserver.observe(container);

  // --- CANVAS EVENTS ---
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
      if (!selectedNode) {
        highlightConnections(node);
        if (node) showPanel(node, false);
        else panel.classList.remove("visible");
      }
    }
  });

  canvas.addEventListener("mousedown", e => {
    const { x, y } = getCanvasCoords(e);
    const node = getNodeAt(x, y);
    if (node) {
      selectedNode = node;
      highlightConnections(node);
      showPanel(node, true);
    } else {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    }
  });

  canvas.addEventListener("mouseup", () => { isDragging = false; });
  canvas.addEventListener("mouseleave", () => { isDragging = false; });

  // Touch
  canvas.addEventListener("touchstart", e => {
    const t = e.touches[0];
    isDragging = true; dragStartX = t.clientX; dragStartY = t.clientY;
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

    const vignette = ctx.createRadialGradient(W/2, H/2, W*0.1, W/2, H/2, W*0.7);
    vignette.addColorStop(0, "rgba(0,30,25,0.05)");
    vignette.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    drawWeave();
    hyphae.forEach(h => h.draw());
    particles.forEach(p => { p.update(); p.draw(); });
    nodes.forEach(n => { if (n.type !== "ghost") n.draw(); });

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

  // --- INIT ---
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      resize();
      buildNetwork();
      render();
      setTimeout(() => {
        animateGrowth();
        hasAnimated = true;
      }, 300);
      observer.disconnect();
    }
  }, { threshold: 0.1 });

  observer.observe(container);

  window.addEventListener("resize", () => {
    resize();
    buildNetwork();
    if (hasAnimated) {
      // Restore visibility so the network doesn't disappear on resize
      nodes.forEach(n => n.visible = 1);
      hyphae.forEach(h => h.visible = 1);
    }
  });

})();
