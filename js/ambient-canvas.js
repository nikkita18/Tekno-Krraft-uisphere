// Tekno Krraft 2026 - Ambient Cosmic Starfield Canvas
// Ultra-lightweight background 3D stardust & cybernetic grid parallax

export class AmbientCosmicCanvas {
  constructor(canvasId = 'ambientCosmicCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numParticles = 90;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.animId = null;

    // Palette: soft blue, coral red, golden amber, emerald green, and starry white
    this.colors = [
      'rgba(66, 133, 244, ',
      'rgba(234, 67, 53, ',
      'rgba(251, 188, 4, ',
      'rgba(52, 168, 83, ',
      'rgba(255, 255, 255, '
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    
    // Gentle mouse parallax
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX - this.width / 2) * 0.03;
      this.targetMouseY = (e.clientY - this.height / 2) * 0.03;
    }, { passive: true });

    this.initParticles();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 800 + 100,
        size: Math.random() * 1.8 + 0.6,
        colorBase: this.colors[i % this.colors.length],
        alpha: Math.random() * 0.45 + 0.1,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth mouse easing
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    const time = Date.now() * 0.001;

    for (const p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around bounds
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Parallax offset
      const posX = p.x + this.mouseX * (100 / p.z);
      const posY = p.y + this.mouseY * (100 / p.z);

      // Breathing twinkle
      const twinkle = Math.sin(time * 2 + p.phase) * 0.2 + 0.8;
      const currentAlpha = p.alpha * twinkle;

      this.ctx.fillStyle = `${p.colorBase}${currentAlpha})`;
      this.ctx.beginPath();
      this.ctx.arc(posX, posY, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
