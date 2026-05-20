// Use global gemsData from data/hidden-gems-data.js

function loadHiddenGems() {
  renderGems();
}

// Switch seasonal image of specific card
window.switchGemImage = function(gemId, season) {
  const gem = gemsData.find(g => g.id === gemId);
  if (!gem) return;
  
  const imgElement = document.getElementById(`img-el-${gemId}`);
  const springBtn = document.getElementById(`btn-spring-${gemId}`);
  const winterBtn = document.getElementById(`btn-winter-${gemId}`);
  
  if (season === 'spring') {
    imgElement.src = gem.imgSpring;
    springBtn.classList.add('active');
    winterBtn.classList.remove('active');
  } else {
    imgElement.src = gem.imgWinter;
    winterBtn.classList.add('active');
    springBtn.classList.remove('active');
  }
}

function renderGems() {
  const grid = document.getElementById('gemsGrid');
  if (!grid) return;
  
  grid.innerHTML = gemsData.map(gem => `
    <div class="gem-card">
      <div class="gem-img-container">
        <div class="season-overlay-switch">
          <button class="season-toggle-btn active" id="btn-spring-${gem.id}" onclick="switchGemImage('${gem.id}', 'spring')">Musim Sakura 🌸</button>
          <button class="season-toggle-btn" id="btn-winter-${gem.id}" onclick="switchGemImage('${gem.id}', 'winter')">Musim Salju ❄️</button>
        </div>
        
        <img src="${gem.imgSpring}" id="img-el-${gem.id}" class="gem-img-element" alt="Visualisasi ${gem.name}">
        
        <div class="gem-badges">
          ${gem.budget ? '<span class="badge badge-budget">💰 Budget Friendly</span>' : ''}
          <span class="badge badge-crowd-${gem.crowd}">${gem.crowd === 'low' ? '🟢 Sepi & Nyaman' : gem.crowd === 'med' ? '🟡 Kepadatan Sederhana' : '🔴 Sangat Ramai'}</span>
        </div>
      </div>
      <div class="gem-body">
        <div class="gem-name">${gem.emoji} ${gem.name}</div>
        <div class="gem-desc">${gem.desc}</div>
        <div class="gem-info-grid">
          <div class="gem-info-item">
            <div class="gem-info-label">💴 Anggaran Biaya</div>
            <div class="gem-info-value">${gem.cost}</div>
            <div class="gem-info-sub">≈ ${formatRupiah(gem.costRaw * KURS_RATE)}</div>
          </div>
          <div class="gem-info-item">
            <div class="gem-info-label">📅 Musim Terbaik</div>
            <div class="gem-info-value" style="font-size:0.85rem;">${gem.season}</div>
          </div>
        </div>
        <div class="gem-activities">
          <h4>🎯 Aktivitas Rekomendasi</h4>
          <div class="gem-tags">${gem.activities.map(a => `<span class="gem-tag">${a}</span>`).join('')}</div>
        </div>
        <div class="gem-food">
          <h4>🍽️ Hidangan Unik Setempat</h4>
          ${gem.food.map(f => `<div class="gem-food-item"><span class="gem-food-icon">${f.icon}</span><span>${f.name}</span></div>`).join('')}
        </div>
        <button class="gem-map-btn" onclick="window.open('${gem.mapUrl}', '_blank')">
          📍 Buka Navigasi Peta → ${gem.name}
        </button>
      </div>
    </div>
  `).join('');
}
