// ===== CANVAS SAKURA ANIMATION SYSTEM =====
const canvas = document.getElementById('sakura-canvas');
let ctx = null;
if (canvas) {
  ctx = canvas.getContext('2d');
}
let petalsArray = [];

function resizeCanvas() {
  if (!canvas) return;
  // Make canvas cover the whole window instead of just parent to support global fixed canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class SakuraPetal {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * 8 + 6;
    this.speedX = Math.random() * 1.5 + 0.5;
    this.speedY = Math.random() * 1.2 + 0.8;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 1.5 - 0.75;
    this.opacity = Math.random() * 0.4 + 0.5;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;
    
    if (this.y > canvas.height) {
      this.y = -20;
      this.x = Math.random() * canvas.width;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 1.5 + 0.5;
    }
    if (this.x > canvas.width) {
      this.x = -10;
    }
  }
  draw() {
    if (!ctx) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size / 1.8, 0, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(244, 167, 185, ${this.opacity})`;
    ctx.fill();
    ctx.restore();
  }
}

function initSakuraAnimation() {
  if (!canvas) return;
  resizeCanvas();
  petalsArray = [];
  for (let i = 0; i < 40; i++) {
    petalsArray.push(new SakuraPetal());
  }
}

function animateSakura() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petalsArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateSakura);
}

window.addEventListener('resize', () => {
  resizeCanvas();
});
