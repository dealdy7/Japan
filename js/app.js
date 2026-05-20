// Global variables and constants
const KURS_RATE = 105;

// Background images for different pages (high-quality Unsplash placeholders)
const BACKGROUNDS = {
  home: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=80', // Sakura park
  gems: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80', // Tokyo night streets
  weather: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1920&q=80', // Snowy/cloudy
  halal: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1920&q=80', // Warm ramen restaurant
  simulator: 'https://images.unsplash.com/photo-1580828369019-22204652c792?auto=format&fit=crop&w=1920&q=80', // Minimalist food
  budget: 'https://images.unsplash.com/photo-1621508654686-809f23efd60c?auto=format&fit=crop&w=1920&q=80', // Finance/minimalist
  calculator: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=1920&q=80', // Currency
  tips: 'https://images.unsplash.com/photo-1436491865332-7a61e109cc05?auto=format&fit=crop&w=1920&q=80' // Airport
};

// Format Rupiah
function formatRupiah(amount) {
  return "Rp " + Math.round(amount).toLocaleString('id-ID');
}

// Global router page switcher with transition classes and background change
function navigateToPage(pageId) {
  // Update Background
  const bgWrapper = document.getElementById('global-bg');
  if (bgWrapper && BACKGROUNDS[pageId]) {
    bgWrapper.style.backgroundImage = `url('${BACKGROUNDS[pageId]}')`;
  }

  // Hide all pages
  const pages = document.querySelectorAll('.page-content');
  pages.forEach(p => {
    p.classList.remove('active');
  });

  // Show selected page
  const selectedPage = document.getElementById('page-' + pageId);
  if (selectedPage) {
    selectedPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Deactivate all nav buttons
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
  });

  // Activate current nav button
  const currentNav = document.getElementById('nav-' + pageId);
  if (currentNav) {
    currentNav.classList.add('active');
  }
}

// View Mode Toggle
let isViewMode = false;
function toggleViewMode() {
  isViewMode = !isViewMode;
  const btn = document.getElementById('btn-view-mode');
  if (isViewMode) {
    document.body.classList.add('view-mode');
    btn.classList.add('active');
    btn.innerHTML = '🔒 View Mode: ON';
  } else {
    document.body.classList.remove('view-mode');
    btn.classList.remove('active');
    btn.innerHTML = '🔓 View Mode: OFF';
  }
}

// Initialization
window.onload = function () {
  // Start with home
  navigateToPage('home');
  
  // Initialize sakura canvas
  if (typeof initSakuraAnimation === 'function') {
    initSakuraAnimation();
    animateSakura();
  }
  
  // Load data
  if (typeof loadHiddenGems === 'function') loadHiddenGems();
  if (typeof loadHalalFood === 'function') loadHalalFood();

  // Tips Accordion Render (Assuming we keep accordion data in app.js or inline for now)
  if (typeof renderAccordion === 'function') renderAccordion();

  // Initial Simulator sync
  if (typeof syncAndCalculateAll === 'function') {
    syncAndCalculateAll('days', 7);
  }

  // Hide global loader after a short delay
  setTimeout(() => {
    const loader = document.getElementById('global-loader');
    if (loader) loader.classList.add('hidden');
  }, 800);
};
