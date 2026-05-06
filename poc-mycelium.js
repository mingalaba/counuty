// ============================================================
// Counity Mycelium Network — POC
// Canvas-based interactive visualization
// ============================================================

// --- DATA ---
const DATA = {
  foundation: {
    tag: "CORE", title: "Foundation",
    desc: "El núcleo del ecosistema. Resguarda la visión fundacional, las reglas de gobernanza y el propósito común. Todo nace de aquí y todo vuelve aquí.",
    color: "#00e6b8"
  },
  coUnits: [
    { id:"co-gov", label:"Co-Gov", tag:"CO-UNIT", color:"#00bcd4",
      desc:"Gobernanza distribuida. Facilita decisiones colectivas, mecanismos de consenso y rendición de cuentas dentro del ecosistema." },
    { id:"co-learn", label:"Co-Learn", tag:"CO-UNIT", color:"#00c9a7",
      desc:"Aprendizaje continuo. Diseña experiencias educativas, documentación viva y transferencia de conocimiento entre nodos." },
    { id:"co-regen", label:"Co-Regen", tag:"CO-UNIT", color:"#26dea0",
      desc:"Regeneración territorial. Coordina proyectos de restauración ecológica, permacultura y diseño bioclimático en las Lands." },
    { id:"co-build", label:"Co-Build", tag:"CO-UNIT", color:"#0097a7",
      desc:"Infraestructura y construcción. Desarrolla tanto la infraestructura digital (plataformas, herramientas) como la física." },
    { id:"co-care", label:"Co-Care", tag:"CO-UNIT", color:"#4dd0e1",
      desc:"Bienestar comunitario. Facilita la salud emocional, resolución de conflictos y cohesión social dentro de cada Land." },
    { id:"co-create", label:"Co-Create", tag:"CO-UNIT", color:"#00acc1",
      desc:"Innovación y cultura. Impulsa proyectos artísticos, prototipos y experimentos que emergen de la creatividad colectiva." },
    { id:"co-steward", label:"Co-Steward", tag:"CO-UNIT", color:"#00838f",
      desc:"Custodia y sostenibilidad. Gestiona los recursos comunes, el treasury y asegura la viabilidad económica de largo plazo." }
  ],
  lands: [
    { id:"land-1", label:"Land Alpha", tag:"LAND", color:"#d4a017",
      desc:"El primer laboratorio territorial. Un espacio rural donde se testea gobernanza, regeneración y convivencia en escala real.",
      connectedCUs: [0,2,3,4] },
    { id:"land-2", label:"Land Beta", tag:"LAND", color:"#c49000",
      desc:"Nodo urbano experimental. Explora cómo el modelo Counity funciona en contextos de alta densidad y economía mixta.",
      connectedCUs: [0,1,5,6] },
    { id:"land-3", label:"Land Gamma", tag:"LAND", color:"#b8860b",
      desc:"Hub de innovación regenerativa. Integra tecnología, agroecología y formación práctica en un territorio costero.",
      connectedCUs: [1,2,3,5] }
  ],
  nodos: [
    { id:"nodo-1", label:"Nodo", connectedLand: 0 },
    { id:"nodo-2", label:"Nodo", connectedLand: 0 },
    { id:"nodo-3", label:"Nodo", connectedLand: 1 },
    { id:"nodo-4", label:"Nodo", connectedLand: 1 },
    { id:"nodo-5", label:"Nodo", connectedLand: 2 },
    { id:"nodo-6", label:"Nodo", connectedLand: 2 },
  ]
};

// --- SETUP ---
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
let W, H, cx, cy;
let panX = 0, panY = 0, isDragging = false, dragStartX, dragStartY;
let growthProgress = 0; // 0-1 animation
let hoveredNode = null;
let selectedNode = null;
let nodes = [];       // all interactive nodes
let hyphae = [];      // connections
let particles = [];   // nutrient flow
let weavePoints = []; // background micro-net
let time = 0;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  cx = W / 2; cy = H / 2;
}
window.addEventListener("resize", () => { resize(); buildNetwork(); });
resize();

// --- NODE CLASS ---
class Node {
  constructor(x, y, r, data, type) {
    this.x = x; this.y = y; this.baseX = x; this.baseY = y;
    this.r = r; this.data = data; this.type = type;
    this.glow = 0; this.pulse = 0;
    this.visible = type === "foundation" ? 1 : 0; // grow-in
  }
  screenX() { return this.x + panX; }
  screenY() { return this.y + panY; }
  draw() {
    if (this.visible < 0.01) return;
    const sx = this.screenX(), sy = this.screenY();
    const alpha = this.visible;
    const col = this.data.color || "#666";

    // Glow
    const glowStr = this.glow + (this.type === "foundation" ? 0.3 : 0);
    if (glowStr > 0.05) {
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, this.r * 4);
      g.addColorStop(0, hexAlpha(col, glowStr * 0.4 * alpha));
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(sx, sy, this.r * 4, 0, Math.PI * 2); ctx.fill();
    }

    // Core circle
    const pulseR = this.r + Math.sin(time * 2 + this.pulse) * (this.type === "foundation" ? 3 : 1);
    ctx.beginPath(); ctx.arc(sx, sy, pulseR * alpha, 0, Math.PI * 2);
    ctx.fillStyle = hexAlpha(col, 0.15 * alpha);
    ctx.fill();
    ctx.strokeStyle = hexAlpha(col, (0.5 + this.glow * 0.5) * alpha);
    ctx.lineWidth = this.type === "nodo" ? 0.5 : 1.5;
    ctx.stroke();

    // Inner dot
    ctx.beginPath(); ctx.arc(sx, sy, pulseR * 0.4 * alpha, 0, Math.PI * 2);
    ctx.fillStyle = hexAlpha(col, (0.6 + this.glow * 0.4) * alpha);
    ctx.fill();

    // Label
    if (this.type !== "nodo" && alpha > 0.5) {
      ctx.font = `${this.type === "foundation" ? 600 : 400} ${this.type === "foundation" ? 13 : 11}px Inter`;
      ctx.fillStyle = hexAlpha("#fff", (0.5 + this.glow * 0.5) * alpha);
      ctx.textAlign = "center";
      ctx.fillText(this.data.label || this.data.title, sx, sy + pulseR + 18);
    }
  }
  hitTest(mx, my) {
    const dx = mx - this.screenX(), dy = my - this.screenY();
    return Math.sqrt(dx*dx + dy*dy) < Math.max(this.r * 2.5, 25) && this.visible > 0.3;
  }
}

// --- HYPHA (CONNECTION) ---
class Hypha {
  constructor(from, to, type) {
    this.from = from; this.to = to; this.type = type;
    this.highlight = 0;
    this.visible = 0;
    // Random control point offsets for Bézier
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
    const v = Math.min(this.from.visible, this.to.visible, this.visible);
    if (v < 0.01) return;
    const c1 = this.cp1(), c2 = this.cp2();
    const fx = this.from.screenX(), fy = this.from.screenY();
    const tx = this.to.screenX(), ty = this.to.screenY();

    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, tx, ty);

    const baseAlpha = 0.08 + this.highlight * 0.35;
    const col = this.highlight > 0.1 ? (this.from.data.color || this.to.data.color || "#00bcd4") : "#ffffff";
    ctx.strokeStyle = hexAlpha(col, baseAlpha * v);
    ctx.lineWidth = 0.5 + this.highlight * 1.5;
    ctx.stroke();
  }
  // Get point along bezier at t (0-1)
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

// --- PARTICLE (NUTRIENT FLOW) ---
class Particle {
  constructor(hypha) {
    this.hypha = hypha;
    this.t = Math.random();
    this.speed = 0.002 + Math.random() * 0.003;
    this.size = 1.5 + Math.random() * 1.5;
  }
  update() {
    this.t += this.speed;
    if (this.t > 1) this.t = 0;
  }
  draw() {
    const v = Math.min(this.hypha.from.visible, this.hypha.to.visible, this.hypha.visible);
    if (v < 0.3) return;
    const intensity = 0.15 + this.hypha.highlight * 0.7;
    if (intensity < 0.1) return;
    const p = this.hypha.pointAt(this.t);
    const col = this.hypha.from.data.color || "#00bcd4";
    ctx.beginPath(); ctx.arc(p.x, p.y, this.size * v, 0, Math.PI*2);
    ctx.fillStyle = hexAlpha(col, intensity * v);
    ctx.fill();
  }
}

// --- BUILD NETWORK ---
function buildNetwork() {
  nodes = []; hyphae = []; particles = [];
  const coreR = Math.min(W, H) * 0.18;
  const landR = Math.min(W, H) * 0.38;

  // Foundation
  const foundation = new Node(cx, cy, 28, { ...DATA.foundation, label: "Foundation" }, "foundation");
  foundation.visible = 1; foundation.pulse = 0;
  nodes.push(foundation);

  // Co-Units in circle around core
  const cuNodes = [];
  DATA.coUnits.forEach((cu, i) => {
    const angle = (i / DATA.coUnits.length) * Math.PI * 2 - Math.PI / 2;
    const n = new Node(cx + Math.cos(angle)*coreR, cy + Math.sin(angle)*coreR, 14, cu, "counit");
    n.pulse = i;
    nodes.push(n);
    cuNodes.push(n);
    // Hypha from foundation to co-unit
    const h = new Hypha(foundation, n, "core-cu");
    hyphae.push(h);
    particles.push(new Particle(h));
    particles.push(new Particle(h));
  });

  // Lands
  const landNodes = [];
  DATA.lands.forEach((land, i) => {
    const angle = (i / DATA.lands.length) * Math.PI * 2 - Math.PI / 6;
    const n = new Node(cx + Math.cos(angle)*landR, cy + Math.sin(angle)*landR, 18, land, "land");
    n.pulse = i * 2;
    nodes.push(n);
    landNodes.push(n);
    // Hyphae from connected co-units to land
    land.connectedCUs.forEach(cuIdx => {
      const h = new Hypha(cuNodes[cuIdx], n, "cu-land");
      hyphae.push(h);
      particles.push(new Particle(h));
    });
  });

  // Nodos
  DATA.nodos.forEach((nodo, i) => {
    const parentLand = landNodes[nodo.connectedLand];
    const angle = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 40;
    const n = new Node(parentLand.baseX + Math.cos(angle)*dist, parentLand.baseY + Math.sin(angle)*dist, 5,
      { ...nodo, color: "#555" }, "nodo");
    nodes.push(n);
    hyphae.push(new Hypha(parentLand, n, "land-nodo"));
  });

  // Weave background points
  weavePoints = [];
  const spacing = 80;
  for (let x = -200; x < W + 200; x += spacing) {
    for (let y = -200; y < H + 200; y += spacing) {
      weavePoints.push({ x: x + (Math.random()-0.5)*40, y: y + (Math.random()-0.5)*40 });
    }
  }

  // Peripheral "infinity" filaments
  for (let i = 0; i < 30; i++) {
    const edge = Math.floor(Math.random()*4);
    let ex, ey;
    if (edge===0) { ex=-50; ey=Math.random()*H; }
    else if (edge===1) { ex=W+50; ey=Math.random()*H; }
    else if (edge===2) { ey=-50; ex=Math.random()*W; }
    else { ey=H+50; ex=Math.random()*W; }
    const ghostNode = new Node(ex, ey, 3, {color:"#222"}, "ghost");
    ghostNode.visible = 1;
    nodes.push(ghostNode);
    // Connect to nearest land or co-unit
    const target = [...cuNodes, ...landNodes][Math.floor(Math.random()*(cuNodes.length+landNodes.length))];
    const h = new Hypha(target, ghostNode, "peripheral");
    h.visible = 1;
    hyphae.push(h);
  }
}

// --- GROWTH ANIMATION ---
function animateGrowth() {
  const tl = gsap.timeline();
  // Foundation already visible
  // Phase 1: Grow hyphae to Co-Units (0-1s)
  const coreHyphae = hyphae.filter(h => h.type === "core-cu");
  const cuNodes = nodes.filter(n => n.type === "counit");
  tl.to(coreHyphae.map(h => h), { visible: 1, duration: 1.2, stagger: 0.08, ease: "power2.out" }, 0);
  tl.to(cuNodes, { visible: 1, duration: 0.8, stagger: 0.08, ease: "power2.out" }, 0.4);

  // Phase 2: Grow hyphae to Lands
  const cuLandHyphae = hyphae.filter(h => h.type === "cu-land");
  const landN = nodes.filter(n => n.type === "land");
  tl.to(cuLandHyphae, { visible: 1, duration: 1, stagger: 0.06, ease: "power2.out" }, 1);
  tl.to(landN, { visible: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }, 1.3);

  // Phase 3: Nodos
  const nodoHyphae = hyphae.filter(h => h.type === "land-nodo");
  const nodoN = nodes.filter(n => n.type === "nodo");
  tl.to(nodoHyphae, { visible: 1, duration: 0.6, stagger: 0.04 }, 1.8);
  tl.to(nodoN, { visible: 1, duration: 0.5, stagger: 0.04 }, 2);

  // Peripherals
  const periph = hyphae.filter(h => h.type === "peripheral");
  tl.to(periph, { visible: 1, duration: 1.5, stagger: 0.03 }, 2.2);
}

// --- DRAW WEAVE ---
function drawWeave() {
  const maxDist = 100;
  ctx.strokeStyle = "rgba(255,255,255,0.015)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < weavePoints.length; i++) {
    const a = weavePoints[i];
    const ax = a.x + panX, ay = a.y + panY;
    if (ax < -100 || ax > W+100 || ay < -100 || ay > H+100) continue;
    for (let j = i+1; j < weavePoints.length; j++) {
      const b = weavePoints[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      if (Math.abs(dx) > maxDist || Math.abs(dy) > maxDist) continue;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if (dist < maxDist) {
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(b.x+panX, b.y+panY);
        ctx.stroke();
      }
    }
    // Tiny dots
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.beginPath(); ctx.arc(ax, ay, 1, 0, Math.PI*2); ctx.fill();
  }
}

// --- HOVER/INTERACTION ---
function getNodeAt(mx, my) {
  // Check in reverse so top-drawn nodes get priority
  for (let i = nodes.length - 1; i >= 0; i--) {
    if (nodes[i].type === "ghost") continue;
    if (nodes[i].hitTest(mx, my)) return nodes[i];
  }
  return null;
}

function highlightConnections(node) {
  // Reset all
  nodes.forEach(n => { gsap.to(n, { glow: 0, duration: 0.3 }); });
  hyphae.forEach(h => { gsap.to(h, { highlight: 0, duration: 0.3 }); });

  if (!node) return;
  gsap.to(node, { glow: 1, duration: 0.3 });

  hyphae.forEach(h => {
    if (h.from === node || h.to === node) {
      gsap.to(h, { highlight: 1, duration: 0.3 });
      const other = h.from === node ? h.to : h.from;
      if (other.type !== "ghost") gsap.to(other, { glow: 0.6, duration: 0.3 });
    }
  });
}

function showPanel(node) {
  const panel = document.getElementById("info-panel");
  document.getElementById("panel-tag").textContent = node.data.tag || node.type.toUpperCase();
  document.getElementById("panel-tag").style.color = node.data.color || "#aaa";
  document.getElementById("panel-title").textContent = node.data.label || node.data.title;
  document.getElementById("panel-title").style.color = node.data.color || "#fff";
  document.getElementById("panel-desc").textContent = node.data.desc || "";
  panel.classList.add("visible");
}

function closePanel() {
  document.getElementById("info-panel").classList.remove("visible");
  selectedNode = null;
  highlightConnections(null);
}

// --- EVENTS ---
canvas.addEventListener("mousemove", e => {
  if (isDragging) {
    panX += e.clientX - dragStartX;
    panY += e.clientY - dragStartY;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    return;
  }
  const node = getNodeAt(e.clientX, e.clientY);
  if (node !== hoveredNode) {
    hoveredNode = node;
    canvas.style.cursor = node ? "pointer" : "grab";
    if (!selectedNode) {
      highlightConnections(node);
      if (node && node.type !== "nodo") {
        showPanel(node);
      } else if (!node) {
        document.getElementById("info-panel").classList.remove("visible");
      }
    }
  }
});

canvas.addEventListener("mousedown", e => {
  const node = getNodeAt(e.clientX, e.clientY);
  if (node && node.type !== "nodo") {
    selectedNode = node;
    highlightConnections(node);
    showPanel(node);
  } else {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    document.body.classList.add("dragging");
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.classList.remove("dragging");
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
  document.body.classList.remove("dragging");
});

// Touch support
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

// --- RENDER LOOP ---
function render() {
  time += 0.01;
  ctx.clearRect(0, 0, W, H);

  // Subtle radial vignette
  const vignette = ctx.createRadialGradient(W/2, H/2, W*0.1, W/2, H/2, W*0.7);
  vignette.addColorStop(0, "rgba(0,30,25,0.05)");
  vignette.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  drawWeave();

  // Draw hyphae
  hyphae.forEach(h => h.draw());

  // Update & draw particles
  particles.forEach(p => { p.update(); p.draw(); });

  // Draw nodes
  nodes.forEach(n => {
    if (n.type !== "ghost") n.draw();
  });

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
buildNetwork();
render();
setTimeout(animateGrowth, 300);
