// ==========================================================================
// TEKNO KRRAFT 2026 - SILKY FLUID AURORA WAVES & SHIMMER PARTICLES ENGINE
// Inspired by Stripe, Linear & Apple Flagship Interfaces.
// Multi-layered organic liquid wave ribbons, dynamic gradient chromatic flow,
// elastic cursor fluid distortion, click ripples, and floating celestial shimmer.
// ==========================================================================

export class AmbientCosmicCanvas {
  constructor(canvasId = 'ambientCosmicCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // Mouse & Pointer Physics
    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.45,
      targetX: this.width * 0.5,
      targetY: this.height * 0.45,
      vx: 0,
      vy: 0,
      radius: 260,
      isHovering: false,
      speed: 0
    };

    // Scroll Reactive Acceleration
    this.lastScrollY = window.pageYOffset || 0;
    this.scrollVelocity = 0;
    this.scrollImpulse = 0;

    // Fluid Ripples from Clicks
    this.ripples = [];

    // Aurora Wave Band Definitions
    this.waves = [];
    this.shimmerParticles = [];
    this.numShimmer = 55;

    // Animation & State
    this.animId = null;
    this.time = 0;
    this.theme = document.documentElement.getAttribute('data-theme') || 'dark';
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.resize();
    this.initWaves();
    this.initShimmer();
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.resize(), 100);
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.mouse.isHovering = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouse.isHovering = false;
      this.mouse.targetX = this.width * 0.5;
      this.mouse.targetY = this.height * 0.45;
    });

    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        this.mouse.targetX = e.touches[0].clientX;
        this.mouse.targetY = e.touches[0].clientY;
        this.mouse.isHovering = true;
        this.triggerRipple(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.mouse.targetX = e.touches[0].clientX;
        this.mouse.targetY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('pointerdown', (e) => {
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA' || target.closest('button'))) {
        return;
      }
      this.triggerRipple(e.clientX, e.clientY);
    });

    window.addEventListener('scroll', () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const delta = currentScrollY - this.lastScrollY;
      this.scrollVelocity = delta * 0.12;
      this.scrollImpulse += Math.abs(delta) * 0.05;
      this.lastScrollY = currentScrollY;
    }, { passive: true });

    const observer = new MutationObserver(() => {
      this.theme = document.documentElement.getAttribute('data-theme') || 'dark';
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  triggerRipple(x, y) {
    if (this.ripples.length > 4) this.ripples.shift();
    this.ripples.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.max(this.width, this.height) * 0.65,
      speed: 12,
      strength: 42,
      decay: 0.965
    });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.resetTransform?.();
    this.ctx.scale(this.dpr, this.dpr);

    this.initWaves();
  }

  /* ------------------------------------------------------------------------
     1. SILKY AURORA WAVE DEFINITIONS
     ------------------------------------------------------------------------ */
  initWaves() {
    // 4 Distinct Harmonious Flowing Liquid Ribbons across the Viewport
    this.waves = [
      // Wave 1: Deep Cyan & Electric Blue Swell (Upper/Mid Flow)
      {
        baseY: this.height * 0.38,
        thickness: this.height * 0.38,
        speed: 0.00065,
        freqX: 0.0016,
        freq2: 0.0032,
        amp1: 75,
        amp2: 45,
        phase: 0,
        colors: {
          dark: [
            { stop: 0, color: 'rgba(6, 182, 212, 0.28)' },    // Neon Cyan
            { stop: 0.5, color: 'rgba(66, 133, 244, 0.24)' },  // Electric Google Blue
            { stop: 1, color: 'rgba(99, 102, 241, 0)' }       // Soft Indigo Fade
          ],
          light: [
            { stop: 0, color: 'rgba(6, 182, 212, 0.16)' },
            { stop: 0.5, color: 'rgba(66, 133, 244, 0.14)' },
            { stop: 1, color: 'rgba(99, 102, 241, 0)' }
          ]
        }
      },

      // Wave 2: Gemini Violet & Radiant Magenta Ribbon (Diagonal Swirl)
      {
        baseY: this.height * 0.52,
        thickness: this.height * 0.42,
        speed: 0.00085,
        freqX: 0.0014,
        freq2: 0.0028,
        amp1: 85,
        amp2: 55,
        phase: 1.8,
        colors: {
          dark: [
            { stop: 0, color: 'rgba(168, 85, 247, 0.26)' },   // Gemini Violet
            { stop: 0.5, color: 'rgba(217, 70, 239, 0.20)' },  // Magenta Glow
            { stop: 1, color: 'rgba(66, 133, 244, 0)' }       // Blue Fade
          ],
          light: [
            { stop: 0, color: 'rgba(168, 85, 247, 0.15)' },
            { stop: 0.5, color: 'rgba(217, 70, 239, 0.12)' },
            { stop: 1, color: 'rgba(66, 133, 244, 0)' }
          ]
        }
      },

      // Wave 3: Solar Amber & Emerald Crest (Lower Fluid Stream)
      {
        baseY: this.height * 0.68,
        thickness: this.height * 0.45,
        speed: 0.00055,
        freqX: 0.0018,
        freq2: 0.0036,
        amp1: 65,
        amp2: 38,
        phase: 3.4,
        colors: {
          dark: [
            { stop: 0, color: 'rgba(52, 168, 83, 0.22)' },    // Emerald Green
            { stop: 0.45, color: 'rgba(251, 188, 4, 0.22)' }, // Google Amber
            { stop: 1, color: 'rgba(234, 67, 53, 0)' }        // Coral Red Fade
          ],
          light: [
            { stop: 0, color: 'rgba(52, 168, 83, 0.14)' },
            { stop: 0.45, color: 'rgba(251, 188, 4, 0.14)' },
            { stop: 1, color: 'rgba(234, 67, 53, 0)' }
          ]
        }
      },

      // Wave 4: Ultra-Fine Ambient Luminous Beam (Drifting Highlight)
      {
        baseY: this.height * 0.45,
        thickness: this.height * 0.26,
        speed: 0.0011,
        freqX: 0.0022,
        freq2: 0.0044,
        amp1: 50,
        amp2: 30,
        phase: 5.2,
        colors: {
          dark: [
            { stop: 0, color: 'rgba(56, 189, 248, 0.22)' },   // Sky Blue
            { stop: 0.6, color: 'rgba(129, 140, 248, 0.18)' }, // Soft Lavender
            { stop: 1, color: 'rgba(0, 0, 0, 0)' }
          ],
          light: [
            { stop: 0, color: 'rgba(56, 189, 248, 0.12)' },
            { stop: 0.6, color: 'rgba(129, 140, 248, 0.10)' },
            { stop: 1, color: 'rgba(0, 0, 0, 0)' }
          ]
        }
      }
    ];
  }

  /* ------------------------------------------------------------------------
     2. FLOATING CELESTIAL SHIMMER PARTICLES
     ------------------------------------------------------------------------ */
  initShimmer() {
    this.shimmerParticles = [];
    const colors = [
      'rgba(66, 133, 244, ',   // Blue
      'rgba(6, 182, 212, ',    // Cyan
      'rgba(168, 85, 247, ',   // Violet
      'rgba(251, 188, 4, ',    // Amber
      'rgba(52, 168, 83, ',    // Green
      'rgba(255, 255, 255, '   // Pure White
    ];

    for (let i = 0; i < this.numShimmer; i++) {
      this.shimmerParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2.2 + 0.8,
        colorBase: colors[i % colors.length],
        alpha: Math.random() * 0.55 + 0.15,
        pulseSpeed: 0.018 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  /* ------------------------------------------------------------------------
     3. ANIMATION & FLUID RENDER LOOP
     ------------------------------------------------------------------------ */
  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const isDark = this.theme === 'dark';

    // Time advancement
    const baseSpeed = this.reducedMotion ? 0.4 : 1.0;
    this.time += (16 * baseSpeed) + (this.scrollImpulse * 0.4);
    this.scrollImpulse *= 0.93;

    // Smooth Mouse Spring Lerp
    this.mouse.vx = (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.vy = (this.mouse.targetY - this.mouse.y) * 0.06;
    this.mouse.x += this.mouse.vx;
    this.mouse.y += this.mouse.vy;
    this.mouse.speed = Math.sqrt(this.mouse.vx * this.mouse.vx + this.mouse.vy * this.mouse.vy);

    // Update Ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rip = this.ripples[i];
      rip.radius += rip.speed;
      rip.strength *= rip.decay;
      if (rip.radius > rip.maxRadius || rip.strength < 0.6) {
        this.ripples.splice(i, 1);
      }
    }

    // Set Blend Mode for Ethereal Glow
    this.ctx.globalCompositeOperation = isDark ? 'screen' : 'source-over';

    // 1. Render Interactive Ambient Cursor Aura
    this.renderCursorAura(isDark);

    // 2. Render Silky Fluid Aurora Waves (with soft optical diffusion)
    try {
      this.ctx.filter = 'blur(28px)';
    } catch {}
    this.renderAuroraWaves(isDark);
    try {
      this.ctx.filter = 'none';
    } catch {}

    // 3. Render Shimmer Sparkles (crisp, glowing celestial specks)
    this.renderShimmerParticles(isDark);

    this.ctx.globalCompositeOperation = 'source-over';

    this.animId = requestAnimationFrame(() => this.animate());
  }

  /* ------------------------------------------------------------------------
     4. CURSOR AURA GLOW
     ------------------------------------------------------------------------ */
  renderCursorAura(isDark) {
    if (!this.mouse.isHovering) return;

    const auraRadius = 240 + Math.min(60, this.mouse.speed * 2);
    const grad = this.ctx.createRadialGradient(
      this.mouse.x, this.mouse.y, 0,
      this.mouse.x, this.mouse.y, auraRadius
    );

    if (isDark) {
      grad.addColorStop(0, 'rgba(66, 133, 244, 0.16)');
      grad.addColorStop(0.35, 'rgba(168, 85, 247, 0.09)');
      grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.04)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      grad.addColorStop(0, 'rgba(66, 133, 244, 0.10)');
      grad.addColorStop(0.4, 'rgba(168, 85, 247, 0.06)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x, this.mouse.y, auraRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /* ------------------------------------------------------------------------
     5. SILKY FLUID AURORA WAVES RENDERING
     ------------------------------------------------------------------------ */
  renderAuroraWaves(isDark) {
    const step = 20; // Fine-grained sampling for buttery curves
    const totalPoints = Math.ceil(this.width / step) + 2;

    this.waves.forEach((wave, waveIdx) => {
      const topPoints = [];
      const bottomPoints = [];

      for (let i = 0; i <= totalPoints; i++) {
        const x = i * step;

        // Compound sine wave formula
        const t = this.time * wave.speed + wave.phase;
        const sin1 = Math.sin(x * wave.freqX + t) * wave.amp1;
        const cos2 = Math.cos(x * wave.freq2 - t * 0.8) * wave.amp2;
        const sin3 = Math.sin(x * 0.0008 + t * 0.5) * 20;

        let y = wave.baseY + sin1 + cos2 + sin3;

        // Interactive Mouse Deflection (Fluid Elastic Depression/Elevation)
        const dx = x - this.mouse.x;
        const dy = y - this.mouse.y;
        const distSq = dx * dx + dy * dy;
        const mouseRangeSq = this.mouse.radius * this.mouse.radius;

        if (distSq < mouseRangeSq) {
          const dist = Math.sqrt(distSq);
          const factor = 1 - (dist / this.mouse.radius);
          // Smooth gaussian fluid distortion
          const push = Math.pow(factor, 2) * 55;
          y += (dy > 0 ? push : -push);
        }

        // Click Ripple Distortions
        for (const rip of this.ripples) {
          const rdx = x - rip.x;
          const rdy = y - rip.y;
          const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
          const waveDist = Math.abs(rDist - rip.radius);
          if (waveDist < 60) {
            const wavePhase = (waveDist / 60) * Math.PI;
            y += Math.cos(wavePhase) * rip.strength;
          }
        }

        topPoints.push({ x, y });
        bottomPoints.push({ x, y: y + wave.thickness });
      }

      // Draw Fluid Ribbon Polygon
      this.ctx.beginPath();
      this.ctx.moveTo(topPoints[0].x, topPoints[0].y);

      // Smooth cubic bezier spline along top points
      for (let i = 0; i < topPoints.length - 1; i++) {
        const xc = (topPoints[i].x + topPoints[i + 1].x) / 2;
        const yc = (topPoints[i].y + topPoints[i + 1].y) / 2;
        this.ctx.quadraticCurveTo(topPoints[i].x, topPoints[i].y, xc, yc);
      }
      this.ctx.lineTo(topPoints[topPoints.length - 1].x, topPoints[topPoints.length - 1].y);

      // Connect to bottom and spline backward
      this.ctx.lineTo(bottomPoints[bottomPoints.length - 1].x, bottomPoints[bottomPoints.length - 1].y);

      for (let i = bottomPoints.length - 1; i > 0; i--) {
        const xc = (bottomPoints[i].x + bottomPoints[i - 1].x) / 2;
        const yc = (bottomPoints[i].y + bottomPoints[i - 1].y) / 2;
        this.ctx.quadraticCurveTo(bottomPoints[i].x, bottomPoints[i].y, xc, yc);
      }
      this.ctx.lineTo(bottomPoints[0].x, bottomPoints[0].y);
      this.ctx.closePath();

      // Multi-Stop Gradient Fill
      const grad = this.ctx.createLinearGradient(0, wave.baseY - wave.amp1, this.width, wave.baseY + wave.thickness);
      const stops = isDark ? wave.colors.dark : wave.colors.light;

      stops.forEach(st => {
        grad.addColorStop(st.stop, st.color);
      });

      this.ctx.fillStyle = grad;
      this.ctx.fill();
    });
  }

  /* ------------------------------------------------------------------------
     6. CELESTIAL SHIMMER PARTICLES RENDERING
     ------------------------------------------------------------------------ */
  renderShimmerParticles(isDark) {
    const tSeconds = this.time * 0.001;

    for (const p of this.shimmerParticles) {
      // Drifting along subtle cosmic currents
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse Parallax & Gentle Repulsion
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let offsetX = 0;
      let offsetY = 0;
      let proximityGlow = 0;

      if (dist < 180 && dist > 1) {
        const force = (1 - dist / 180) * 16;
        offsetX = (dx / dist) * force;
        offsetY = (dy / dist) * force;
        proximityGlow = (1 - dist / 180) * 0.4;
      }

      const drawX = p.x + offsetX;
      const drawY = p.y + offsetY;

      // Twinkle pulsation
      const twinkle = Math.sin(tSeconds * 3 + p.phase) * 0.35 + 0.65;
      const alpha = Math.min(1, (p.alpha * twinkle + proximityGlow) * (isDark ? 0.9 : 0.6));

      // Core Particle
      this.ctx.fillStyle = `${p.colorBase}${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Soft Glow Halo on brighter particles
      if (p.size > 1.6) {
        this.ctx.fillStyle = `${p.colorBase}${alpha * 0.3})`;
        this.ctx.beginPath();
        this.ctx.arc(drawX, drawY, p.size * 2.4, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
