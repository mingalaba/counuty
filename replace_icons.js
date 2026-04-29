const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'como-funciona.html',
  'las-lands.html',
  'pink-paper.html',
  'que-es.html',
  'sumate.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace pillar emojis
  content = content.replace(/<span class="pillar-emoji">🌱<\/span>/g, '<span class="pillar-emoji"><i data-lucide="leaf" class="lucide-cyan" style="width: 40px; height: 40px;"></i></span>');
  content = content.replace(/<span class="pillar-emoji">🧑‍🤝‍🧑<\/span>/g, '<span class="pillar-emoji"><i data-lucide="users" class="lucide-pink" style="width: 40px; height: 40px;"></i></span>');
  content = content.replace(/<span class="pillar-emoji">🧩<\/span>/g, '<span class="pillar-emoji"><i data-lucide="blocks" class="lucide-yellow" style="width: 40px; height: 40px;"></i></span>');
  content = content.replace(/<span class="pillar-emoji">🪙<\/span>/g, '<span class="pillar-emoji"><i data-lucide="coins" class="lucide-cyan" style="width: 40px; height: 40px;"></i></span>');
  content = content.replace(/<span class="pillar-emoji">🕸<\/span>/g, '<span class="pillar-emoji"><i data-lucide="network" class="lucide-pink" style="width: 40px; height: 40px;"></i></span>');

  // Replace card icons
  content = content.replace(/<div class="card-icon">🏡<\/div>/g, '<div class="card-icon"><i data-lucide="home" class="lucide-cyan" style="width: 48px; height: 48px;"></i></div>');
  content = content.replace(/<div class="card-icon">🌿<\/div>/g, '<div class="card-icon"><i data-lucide="leaf" class="lucide-pink" style="width: 48px; height: 48px;"></i></div>');
  content = content.replace(/<div class="card-icon">🤝<\/div>/g, '<div class="card-icon"><i data-lucide="users" class="lucide-yellow" style="width: 48px; height: 48px;"></i></div>');
  content = content.replace(/<div class="card-icon">⚡<\/div>/g, '<div class="card-icon"><i data-lucide="zap" class="lucide-cyan" style="width: 48px; height: 48px;"></i></div>');
  content = content.replace(/<div class="card-icon">💻<\/div>/g, '<div class="card-icon"><i data-lucide="laptop" class="lucide-pink" style="width: 48px; height: 48px;"></i></div>');
  content = content.replace(/<div class="card-icon">🌐<\/div>/g, '<div class="card-icon"><i data-lucide="globe" class="lucide-yellow" style="width: 48px; height: 48px;"></i></div>');
  
  content = content.replace(/<div class="card-icon">🌍<\/div>/g, '<div class="card-icon"><i data-lucide="globe" class="lucide-cyan" style="width: 48px; height: 48px;"></i></div>');
  content = content.replace(/<div class="card-icon">🧩<\/div>/g, '<div class="card-icon"><i data-lucide="blocks" class="lucide-pink" style="width: 48px; height: 48px;"></i></div>');
  content = content.replace(/<div class="card-icon">🔍<\/div>/g, '<div class="card-icon"><i data-lucide="search" class="lucide-cyan" style="width: 48px; height: 48px;"></i></div>');

  content = content.replace(/<div class="card-icon">🏛️<\/div>/g, '<div class="card-icon"><i data-lucide="landmark" class="lucide-yellow" style="width: 48px; height: 48px;"></i></div>');
  content = content.replace(/<div class="card-icon">🪙<\/div>/g, '<div class="card-icon"><i data-lucide="coins" class="lucide-cyan" style="width: 48px; height: 48px;"></i></div>');
  content = content.replace(/<div class="card-icon">🕸️<\/div>/g, '<div class="card-icon"><i data-lucide="network" class="lucide-pink" style="width: 48px; height: 48px;"></i></div>');

  // And the paradigm arrows
  content = content.replace(/<span class="paradigm-arrow">→<\/span>/g, '<span class="paradigm-arrow"><i data-lucide="arrow-right" class="lucide-yellow"></i></span>');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
