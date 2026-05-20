// Use global halalDataCache from data/halal-food-data.js

function loadHalalFood() {
  renderHalal();
}

function renderHalal() {
  if (!halalDataCache) return;
  const { halalRestaurants, konbiniData, souvenirs } = halalDataCache;

  // Halal Restaurants Grid
  const container = document.getElementById('city-food-grids');
  if (container) {
    const cities = ['tokyo', 'osaka', 'kyoto', 'hokkaido'];
    container.innerHTML = cities.map(city => `
      <div class="city-food-grid ${city === 'tokyo' ? 'active' : ''}" id="grid-${city}">
        ${(halalRestaurants[city] || []).map(r => `
          <div class="food-card" onclick="openFoodModal('${city}', '${r.id}')">
            <div class="food-card-media">
              <img src="${r.img}" class="food-card-img" alt="${r.name}">
            </div>
            <div class="food-card-body">
              <div class="food-card-header">
                <div>
                  <div class="food-card-name">🍽️ ${r.name}</div>
                  <span class="halal-cert ${r.cert}">☪️ ${r.certLabel}</span>
                </div>
                <div class="food-card-price-container">
                  <span class="food-card-price">${r.price}</span>
                  <span class="food-card-price-idr">${formatRupiah(r.priceRaw * KURS_RATE)}</span>
                </div>
              </div>
              <div class="food-menu">📋 ${r.menu}</div>
              <div class="food-distance">📍 ${r.location}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  // Konbini
  const kg = document.getElementById('konbiniGrid');
  if (kg) {
    kg.innerHTML = konbiniData.map(k => `
      <div class="konbini-card">
        <div class="konbini-header">
          <span class="konbini-logo">${k.logo}</span>
          <span class="konbini-name">${k.name}</span>
        </div>
        <div class="konbini-items">${k.items.map(i => `• ${i}`).join('<br>')}</div>
      </div>
    `).join('');
  }

  // Souvenir
  const sg = document.getElementById('souvenirGrid');
  if (sg) {
    sg.innerHTML = souvenirs.map(s => `
      <div class="souvenir-card">
        <div class="souvenir-emoji">${s.emoji}</div>
        <div class="souvenir-name">${s.name}</div>
        <div class="souvenir-prices">
          <span class="souvenir-price">${s.price}</span>
          <span class="souvenir-price-idr">≈ ${formatRupiah(s.priceRaw * KURS_RATE)}</span>
        </div>
        <div class="souvenir-place">📍 Cari di: ${s.place}</div>
        <div class="souvenir-tags" style="margin-top:0.75rem;">
          ${s.taxFree ? '<span class="tax-free-badge">Bebas Cukai ✓</span>' : ''}
          ${s.tags.map(t => `<span class="souvenir-tag">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }
}

// Modal Logic
window.openFoodModal = function(city, id) {
  if (!halalDataCache) return;
  const restaurant = halalDataCache.halalRestaurants[city].find(r => r.id === id);
  if (!restaurant) return;

  const modal = document.getElementById('food-detail-modal');
  if (!modal) return;

  // Build gallery
  const galleryHtml = (restaurant.gallery || [restaurant.img]).map(img => `
    <img src="${img}" alt="${restaurant.name} gallery image">
  `).join('');

  // Build spicy level
  const spicyIcons = [];
  for(let i=1; i<=5; i++) {
    spicyIcons.push(`<span class="spicy-icon ${i <= restaurant.spicyLevel ? 'active' : ''}">🌶️</span>`);
  }

  document.getElementById('modal-gallery').innerHTML = galleryHtml;
  document.getElementById('modal-title').textContent = restaurant.name;
  document.getElementById('modal-cert').className = `halal-cert ${restaurant.cert}`;
  document.getElementById('modal-cert').innerHTML = `☪️ ${restaurant.certLabel}`;
  document.getElementById('modal-desc').textContent = restaurant.menu;
  
  document.getElementById('modal-price').textContent = `${restaurant.price} (${formatRupiah(restaurant.priceRaw * KURS_RATE)})`;
  document.getElementById('modal-hours').textContent = restaurant.hours || '10:00 - 22:00';
  document.getElementById('modal-spicy').innerHTML = spicyIcons.join('');
  
  const mapBtn = document.getElementById('modal-map-link');
  mapBtn.href = `https://maps.google.com/?q=${encodeURIComponent(restaurant.mapQ)}`;

  modal.classList.add('active');
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

window.closeFoodModal = function() {
  const modal = document.getElementById('food-detail-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Tab Switching
window.switchHalalTab = function(tab) {
  document.querySelectorAll('.halal-tab').forEach(t => t.classList.remove('active'));
  const btn = document.getElementById(`btn-tab-${tab}`);
  if (btn) btn.classList.add('active');
  
  document.querySelectorAll('.halal-content').forEach(c => c.classList.remove('active'));
  const content = document.getElementById('tab-' + tab);
  if (content) content.classList.add('active');
}

window.switchCity = function(city) {
  document.querySelectorAll('.city-tab').forEach(t => t.classList.remove('active'));
  const btn = document.getElementById(`city-btn-${city}`);
  if (btn) btn.classList.add('active');
  
  document.querySelectorAll('.city-food-grid').forEach(g => g.classList.remove('active'));
  const el = document.getElementById('grid-' + city);
  if (el) el.classList.add('active');
}
