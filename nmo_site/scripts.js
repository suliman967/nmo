// scripts.js - small helpers for the NMO landing

document.addEventListener('DOMContentLoaded', function() {
  // Set current year in copyright
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Accessibility: focus first input when tabbing into form
  const firstInput = document.querySelector('.formkit-input');
  if (firstInput) firstInput.setAttribute('aria-label', 'Your email address');
});

// Flame particle animation for background
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('flame-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth, h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;

  // Responsive resize
  window.addEventListener('resize', () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  });

  // Particle settings
  const FLAME_COLORS = [
    'rgba(255, 126, 44, 0.18)',
    'rgba(255, 239, 176, 0.12)',
    'rgba(193, 27, 27, 0.10)'
  ];
  const particles = [];
  const NUM_PARTICLES = Math.max(12, Math.floor(w / 120)); // keep it subtle

  function randomFlameColor() {
    return FLAME_COLORS[Math.floor(Math.random() * FLAME_COLORS.length)];
  }

  class FlameParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.radius = 18 + Math.random() * 12;
      this.x = w / 2 + (Math.random() - 0.5) * w * 0.32;
      this.y = h * 0.72 + (Math.random() - 0.5) * h * 0.18;
      this.color = randomFlameColor();
      this.speed = 0.12 + Math.random() * 0.08;
      this.float = 0.8 + Math.random() * 0.6;
      this.alpha = 0.18 + Math.random() * 0.12;
      this.offset = Math.random() * Math.PI * 2;
    }

    update(t) {
      // Slow floating upward and gentle side sway
      this.y -= this.speed * (0.5 + Math.sin(t / 1200 + this.offset) * 0.5) * this.float;
      this.x += Math.sin(t / 900 + this.offset) * 0.18;
      // Fade out and respawn
      this.alpha -= 0.0005 + Math.random() * 0.0008;
      if (this.y < h * 0.32 || this.alpha < 0.03) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.shadowColor = '#ff7b2c';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();
    }
  }

  // Initialize particles
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new FlameParticle());
  }

  // Animation loop
  function animateFlames(t) {
    ctx.clearRect(0, 0, w, h);
    for (let p of particles) {
      p.update(t);
      p.draw(ctx);
    }
    requestAnimationFrame(animateFlames);
  }
  requestAnimationFrame(animateFlames);
});

// flames + parallax - replace existing flame block with this
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('flame-canvas');
  const layers = Array.from(document.querySelectorAll('.parallax-layer'));
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let w = window.innerWidth, h = window.innerHeight;
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = Math.round(w * DPR);
  canvas.height = Math.round(h * DPR);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(DPR, DPR);

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * DPR);
    canvas.height = Math.round(h * DPR);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);

  // Performance: reduce particles on smaller screens
  const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 720;
  const NUM_PARTICLES = isMobile ? Math.max(6, Math.floor(w / 240)) : Math.max(12, Math.floor(w / 120));

  const FLAME_COLORS = [
    'rgba(255, 126, 44, 0.18)',
    'rgba(255, 239, 176, 0.12)',
    'rgba(193, 27, 27, 0.10)'
  ];
  const particles = [];

  function randomFlameColor() {
    return FLAME_COLORS[Math.floor(Math.random() * FLAME_COLORS.length)];
  }

  class FlameParticle {
    constructor() { this.reset(true); }
    reset(initial=false) {
      this.radius = 14 + Math.random() * (isMobile ? 10 : 18);
      this.x = w / 2 + (Math.random() - 0.5) * w * 0.36;
      this.y = h * 0.72 + (Math.random() - 0.5) * h * 0.16;
      this.color = randomFlameColor();
      this.speed = 0.08 + Math.random() * 0.14;
      this.float = 0.8 + Math.random() * 0.8;
      this.alpha = initial ? 0.02 + Math.random() * 0.16 : 0.18 + Math.random() * 0.12;
      this.offset = Math.random() * Math.PI * 2;
    }
    update(t) {
      this.y -= this.speed * (0.5 + Math.sin(t / 900 + this.offset) * 0.55) * this.float;
      this.x += Math.sin(t / 850 + this.offset) * 0.24;
      this.alpha -= 0.0006 + Math.random() * 0.001;
      if (this.y < h * 0.28 || this.alpha < 0.02) this.reset();
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.radius * 1.2, this.radius, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = '#ff7b2c';
      ctx.shadowBlur = Math.max(8, this.radius);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < NUM_PARTICLES; i++) particles.push(new FlameParticle());

  // Animation loop
  let last = performance.now();
  function animate(t) {
    const dt = t - last;
    last = t;
    ctx.clearRect(0, 0, w, h);
    for (let p of particles) {
      p.update(t);
      p.draw(ctx);
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Parallax on mouse/touch for .parallax-layer elements
  let px = 0, py = 0, tx = 0, ty = 0;
  function applyParallax() {
    tx += (px - tx) * 0.08;
    ty += (py - ty) * 0.08;
    layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth || '0.1');
      const x = (tx * depth * -1).toFixed(2);
      const y = (ty * depth * -1).toFixed(2);
      layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    requestAnimationFrame(applyParallax);
  }
  applyParallax();

  // pointer move
  function onPointerMove(e) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
    px = (clientX - cx) / cx; // -1 to 1
    py = (clientY - cy) / cy;
  }
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  // Respect reduced motion preference
  const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaReduced.matches) {
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('touchmove', onPointerMove);
  }
})