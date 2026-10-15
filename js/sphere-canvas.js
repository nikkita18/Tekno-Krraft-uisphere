// Tekno Krraft 2026 - Master 3D Interactive "UI Sphere" Particle Engine
// Authentic 3D mathematical geometry, dynamic mode morphing, multi-axis gyro rings,
// neural constellation photon packets, and mouse-reactive physics.

export class UiSphereCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.points = [];
    this.numPoints = 380;
    this.radius = 195;
    
    // Rotation & momentum physics
    this.rotX = 0.22;
    this.rotY = 0.35;
    this.targetRotX = 0.002;
    this.targetRotY = 0.0035;
    this.velX = 0;
    this.velY = 0;
    this.isDragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    
    // Viewport & dimensions
    this.width = 0;
    this.height = 0;
    this.animId = null;
    
    // Modes: 'fibonacci' | 'constellation' | 'quantum' | 'singularity'
    this.mode = 'fibonacci';
    this.targetMode = 'fibonacci';
    this.morphProgress = 1.0;
    this.shockwave = 0;
    this.ringAngle1 = 0;
    this.ringAngle2 = 0;
    this.ringAngle3 = 0;
    this.corePulse = 0;
    
    // Mouse magnetic ripple
    this.mouseCanvasX = -9999;
    this.mouseCanvasY = -9999;
    this.mouseHoverActive = false;

    // Authentic Google ecosystem vibrant palette
    this.colors = ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#8ab4f8', '#f28b82', '#81c995'];

    // Interactive 3D Technology Tags attached to specific nodes
    this.tags = [
      { text: "Gemini 1.5 Flash", pIdx: 12, color: "#4285f4", category: "AI & ML" },
      { text: "Cloud Run", pIdx: 64, color: "#ea4335", category: "Cloud" },
      { text: "Flutter 3.x", pIdx: 128, color: "#4285f4", category: "Mobile" },
      { text: "GKE / K8s", pIdx: 195, color: "#34a853", category: "DevOps" },
      { text: "RAG Vectors", pIdx: 260, color: "#fbbc04", category: "Search" },
      { text: "GDG ITER", pIdx: 320, color: "#34a853", category: "Community" }
    ];

    // Constellation photon packets (traveling energy pulses)
    this.photons = [];
    this.initPhotons();

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    this.generateAllGeometryTargets();
    this.setupInteractions();
    this.setupModeButtons();
    this.animate();
  }

  initPhotons() {
    this.photons = [];
    for (let i = 0; i < 14; i++) {
      this.photons.push({
        fromIdx: Math.floor(Math.random() * this.numPoints),
        toIdx: Math.floor(Math.random() * this.numPoints),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.014,
        color: this.colors[i % this.colors.length]
      });
    }
  }

  generateAllGeometryTargets() {
    this.points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < this.numPoints; i++) {
      // 1. Fibonacci Sphere Target
      const yNorm = 1 - (i / (this.numPoints - 1)) * 2;
      const rY = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
      const theta = phi * i;
      const fibX = Math.cos(theta) * rY * this.radius;
      const fibY = yNorm * this.radius;
      const fibZ = Math.sin(theta) * rY * this.radius;

      // 2. Constellation Web Target (Spherical with slight volumetric shell variation)
      const shellVar = 0.85 + 0.3 * Math.sin(i * 0.4);
      const conX = fibX * shellVar;
      const conY = fibY * shellVar;
      const conZ = fibZ * shellVar;

      // 3. Quantum Torus Target (Dual swirling donut rings)
      const u = (i / this.numPoints) * Math.PI * 4;
      const v = i * 2.4;
      const R_torus = this.radius * 0.72;
      const r_torus = this.radius * 0.38;
      const qX = (R_torus + r_torus * Math.cos(v)) * Math.cos(u);
      const qY = (R_torus + r_torus * Math.cos(v)) * Math.sin(u) * 0.65;
      const qZ = r_torus * Math.sin(v) * 1.3;

      // 4. Singularity Galactic Spiral Disc Target
      const arm = i % 3;
      const distRatio = Math.pow(i / this.numPoints, 0.75);
      const armAngle = distRatio * Math.PI * 4 + (arm * (Math.PI * 2 / 3));
      const sRadius = distRatio * this.radius * 1.15;
      const sX = Math.cos(armAngle) * sRadius;
      const sY = (Math.random() - 0.5) * 36 * (1 - distRatio * 0.5);
      const sZ = Math.sin(armAngle) * sRadius;

      this.points.push({
        x: fibX,
        y: fibY,
        z: fibZ,
        curX: fibX,
        curY: fibY,
        curZ: fibZ,
        targetX: fibX,
        targetY: fibY,
        targetZ: fibZ,
        // Preset coordinates
        modes: {
          fibonacci: { x: fibX, y: fibY, z: fibZ },
          constellation: { x: conX, y: conY, z: conZ },
          quantum: { x: qX, y: qY, z: qZ },
          singularity: { x: sX, y: sY, z: sZ }
        },
        color: this.colors[i % this.colors.length],
        size: Math.random() * 2.2 + 1.2,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.018 + Math.random() * 0.035,
        energy: Math.random()
      });
    }
  }

  setupInteractions() {
    const container = this.canvas.parentElement;
    if (!container) return;

    // Mouse Down / Touch Start
    const startDrag = (x, y) => {
      this.isDragging = true;
      this.lastPointerX = x;
      this.lastPointerY = y;
      this.velX = 0;
      this.velY = 0;
    };

    // Move
    const moveDrag = (x, y) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseCanvasX = x - rect.left;
      this.mouseCanvasY = y - rect.top;
      this.mouseHoverActive = true;

      if (!this.isDragging) {
        // Soft hover influence
        const normX = (this.mouseCanvasX - rect.width / 2) / (rect.width / 2);
        const normY = (this.mouseCanvasY - rect.height / 2) / (rect.height / 2);
        this.targetRotY = normX * 0.015;
        this.targetRotX = -normY * 0.015;
        return;
      }

      const dx = x - this.lastPointerX;
      const dy = y - this.lastPointerY;
      this.velY = dx * 0.006;
      this.velX = -dy * 0.006;
      this.rotY += this.velY;
      this.rotX += this.velX;
      this.lastPointerX = x;
      this.lastPointerY = y;
    };

    const endDrag = () => {
      this.isDragging = false;
    };

    const leaveCanvas = () => {
      this.mouseHoverActive = false;
      this.mouseCanvasX = -9999;
      this.mouseCanvasY = -9999;
      this.targetRotY = 0.0035;
      this.targetRotX = 0.002;
    };

    // Mouse events
    container.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', endDrag);
    container.addEventListener('mouseleave', leaveCanvas);

    // Touch events for mobile
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchend', endDrag);

    // Click on canvas to trigger shockwave
    this.canvas.addEventListener('click', (e) => {
      this.triggerShockwave();
    });
  }

  triggerShockwave() {
    this.shockwave = 1.0;
    // Play sound if available in window
    if (window._soundSynth?.isEnabled) {
      window._soundSynth.playWhoosh?.();
    }
  }

  setupModeButtons() {
    const buttons = document.querySelectorAll('.sphere-mode-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode') || 'fibonacci';
        this.setMode(mode);
        if (window._soundSynth?.isEnabled) {
          window._soundSynth.playClick?.();
        }
      });
    });
  }

  setMode(newMode) {
    if (this.mode === newMode) return;
    this.mode = newMode;
    this.morphProgress = 0;
    this.shockwave = 0.75;

    // Apply new target coordinates
    for (const p of this.points) {
      if (p.modes && p.modes[newMode]) {
        p.targetX = p.modes[newMode].x;
        p.targetY = p.modes[newMode].y;
        p.targetZ = p.modes[newMode].z;
      }
    }

    if (newMode === 'quantum') {
      this.targetRotY = 0.015;
      this.targetRotX = 0.007;
    } else if (newMode === 'singularity') {
      this.targetRotY = 0.02;
      this.targetRotX = 0.004;
    } else {
      this.targetRotY = 0.0035;
      this.targetRotX = 0.002;
    }
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const rect = parent?.getBoundingClientRect() || { width: 500, height: 500 };
    this.width = rect.width || 500;
    this.height = rect.height || 500;
    
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.radius = Math.min(this.width, this.height) * 0.40;
    
    this.generateAllGeometryTargets();
  }

  rotatePoint(p, angleX, angleY) {
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const x1 = p.x * cosY + p.z * sinY;
    const z1 = -p.x * sinY + p.z * cosY;

    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    const y1 = p.y * cosX - z1 * sinX;
    const z2 = p.y * sinX + z1 * cosX;

    return { x: x1, y: y1, z: z2 };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Friction & Inertia damping
    if (!this.isDragging) {
      this.velX *= 0.93;
      this.velY *= 0.93;
      this.rotX += this.velX + (this.targetRotX - this.velX) * 0.04;
      this.rotY += this.velY + (this.targetRotY - this.velY) * 0.04;
    }

    if (this.shockwave > 0.005) {
      this.shockwave *= 0.91;
    }

    // Advance ring rotation angles
    this.ringAngle1 += 0.014;
    this.ringAngle2 -= 0.009;
    this.ringAngle3 += 0.018;
    this.corePulse += 0.035;

    const cx = this.width / 2;
    const cy = this.height / 2;
    const fov = 460;

    // Render Inner Volumetric Plasma Glow
    this.renderCorePlasma(cx, cy);

    // Render 3D Multi-Axis Gyroscope Rings (Background passes)
    this.renderGyroscopeRings(cx, cy, fov, true);

    // Morph coordinates smoothly towards targets
    const morphSpeed = 0.08;
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      p.curX += (p.targetX - p.curX) * morphSpeed;
      p.curY += (p.targetY - p.curY) * morphSpeed;
      p.curZ += (p.targetZ - p.curZ) * morphSpeed;
    }

    // Project points into 3D camera space
    const transformed = [];
    const timeNow = Date.now() * 0.003;

    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];

      // Quantum fluctuation or shockwave offset
      let curX = p.curX;
      let curY = p.curY;
      let curZ = p.curZ;

      if (this.mode === 'quantum') {
        const vib = Math.sin(p.phase + timeNow * 2) * 14;
        curX += (p.curX / (this.radius || 1)) * vib;
        curY += (p.curY / (this.radius || 1)) * vib;
        curZ += (p.curZ / (this.radius || 1)) * vib;
      }

      if (this.shockwave > 0.01) {
        const shock = Math.sin(this.shockwave * Math.PI * 4) * (this.shockwave * 42);
        curX += (p.curX / (this.radius || 1)) * shock;
        curY += (p.curY / (this.radius || 1)) * shock;
        curZ += (p.curZ / (this.radius || 1)) * shock;
      }

      const rotated = this.rotatePoint({ x: curX, y: curY, z: curZ }, this.rotX, this.rotY);
      p.x = rotated.x;
      p.y = rotated.y;
      p.z = rotated.z;

      // 3D perspective projection
      const scale = fov / (fov + p.z);
      let px = cx + p.x * scale;
      let py = cy + p.y * scale;

      // Interactive mouse ripple magnetic push
      if (this.mouseHoverActive) {
        const mdx = px - this.mouseCanvasX;
        const mdy = py - this.mouseCanvasY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 110 && mdist > 1) {
          const push = (1 - mdist / 110) * 22;
          px += (mdx / mdist) * push;
          py += (mdy / mdist) * push;
        }
      }

      const alpha = Math.max(0.12, Math.min(1, (p.z + this.radius) / (2 * this.radius)));
      transformed.push({
        x: px,
        y: py,
        z: p.z,
        scale,
        alpha,
        color: p.color,
        size: p.size,
        origIdx: i
      });
    }

    // Sort by depth (back to front)
    transformed.sort((a, b) => a.z - b.z);

    // Render Constellation Synapse Lines
    this.renderConstellations(transformed);

    // Render Constellation Traveling Photons
    this.renderPhotons(transformed);

    // Render Glowing Nodes with Optical Halos
    this.renderNodes(transformed);

    // Render 3D Multi-Axis Gyroscope Rings (Foreground passes)
    this.renderGyroscopeRings(cx, cy, fov, false);

    // Render 3D Interactive Tags
    this.renderTags(transformed, cx, cy);

    this.animId = requestAnimationFrame(() => this.animate());
  }

  renderCorePlasma(cx, cy) {
    this.ctx.save();
    const pulseFactor = 1 + Math.sin(this.corePulse) * 0.12;
    const coreRad = this.radius * 0.65 * pulseFactor;
    const grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRad);
    
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      grad.addColorStop(0, 'rgba(66, 133, 244, 0.14)');
      grad.addColorStop(0.45, 'rgba(234, 67, 53, 0.05)');
      grad.addColorStop(0.8, 'rgba(251, 188, 4, 0.02)');
      grad.addColorStop(1, 'transparent');
    } else {
      grad.addColorStop(0, 'rgba(66, 133, 244, 0.28)');
      grad.addColorStop(0.35, 'rgba(234, 67, 53, 0.12)');
      grad.addColorStop(0.7, 'rgba(52, 168, 83, 0.06)');
      grad.addColorStop(1, 'transparent');
    }

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, coreRad, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  renderGyroscopeRings(cx, cy, fov, backOnly) {
    this.ctx.save();
    const rings = [
      { r: this.radius * 1.18, tiltX: 0.35, tiltY: this.ringAngle1, color: '#4285f4', dash: [4, 6], width: 1.2 },
      { r: this.radius * 1.30, tiltX: -0.55, tiltY: this.ringAngle2, color: '#34a853', dash: [2, 8], width: 1.0 },
      { r: this.radius * 1.06, tiltX: 0.75, tiltY: this.ringAngle3, color: '#fbbc04', dash: [6, 6], width: 1.1 }
    ];

    for (const ring of rings) {
      const numPts = 42;
      const ringPts = [];
      for (let i = 0; i <= numPts; i++) {
        const theta = (i / numPts) * Math.PI * 2;
        const rx = Math.cos(theta) * ring.r;
        const ry = Math.sin(theta) * ring.r * 0.38;
        const rz = Math.sin(theta) * ring.r * 0.75;

        const rot = this.rotatePoint({ x: rx, y: ry, z: rz }, ring.tiltX + this.rotX * 0.4, ring.tiltY + this.rotY);
        const scale = fov / (fov + rot.z);
        ringPts.push({
          x: cx + rot.x * scale,
          y: cy + rot.y * scale,
          z: rot.z,
          scale
        });
      }

      this.ctx.setLineDash(ring.dash);
      this.ctx.lineWidth = ring.width;

      for (let i = 0; i < ringPts.length - 1; i++) {
        const p1 = ringPts[i];
        const p2 = ringPts[i + 1];
        const isBack = p1.z < 0;

        if (backOnly === isBack) {
          const depthAlpha = Math.max(0.06, Math.min(0.48, (p1.z + ring.r) / (2 * ring.r)));
          this.ctx.strokeStyle = ring.color.replace(')', `, ${depthAlpha})`).replace('rgb', 'rgba').replace('#', '');
          // Hex to rgba helper
          this.ctx.strokeStyle = this.hexToRgba(ring.color, depthAlpha);
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }

      // Orbiting satellite bead on foreground
      if (!backOnly) {
        const beadPt = ringPts[Math.floor((Date.now() * 0.03) % ringPts.length)];
        if (beadPt && beadPt.z > 0) {
          this.ctx.setLineDash([]);
          this.ctx.fillStyle = ring.color;
          this.ctx.shadowColor = ring.color;
          this.ctx.shadowBlur = 10;
          this.ctx.beginPath();
          this.ctx.arc(beadPt.x, beadPt.y, 3 * beadPt.scale, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.shadowBlur = 0;
        }
      }
    }
    this.ctx.restore();
  }

  renderConstellations(transformed) {
    const lineThreshold = this.mode === 'constellation' ? 76 : (this.mode === 'singularity' ? 52 : 46);
    this.ctx.lineWidth = 0.85;

    for (let i = 0; i < transformed.length; i += 2) {
      const p1 = transformed[i];
      if (p1.z < -60) continue; // Skip far-back lines for clarity

      for (let j = i + 1; j < Math.min(i + 5, transformed.length); j++) {
        const p2 = transformed[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < lineThreshold) {
          const alpha = (1 - dist / lineThreshold) * 0.35 * Math.min(p1.alpha, p2.alpha);
          this.ctx.strokeStyle = `rgba(66, 133, 244, ${alpha})`;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
  }

  renderPhotons(transformed) {
    if (this.mode !== 'constellation') return;

    for (const ph of this.photons) {
      ph.progress += ph.speed;
      if (ph.progress >= 1) {
        ph.progress = 0;
        ph.fromIdx = Math.floor(Math.random() * transformed.length);
        ph.toIdx = Math.floor(Math.random() * transformed.length);
      }

      const pA = transformed[ph.fromIdx];
      const pB = transformed[ph.toIdx];
      if (!pA || !pB || pA.z < 0 || pB.z < 0) continue;

      const px = pA.x + (pB.x - pA.x) * ph.progress;
      const py = pA.y + (pB.y - pA.y) * ph.progress;

      this.ctx.save();
      this.ctx.fillStyle = ph.color;
      this.ctx.shadowColor = ph.color;
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  renderNodes(transformed) {
    for (let i = 0; i < transformed.length; i++) {
      const p = transformed[i];
      const r = Math.max(0.8, p.size * p.scale);

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;

      // Foreground Optical Bloom Halo
      if (p.z > 25) {
        const glowRad = r * 3.4;
        const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRad);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, glowRad, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Center Node
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      this.ctx.fill();

      // Specular hot center for near nodes
      if (p.z > 80) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, r * 0.45, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }

  renderTags(transformed, cx, cy) {
    this.ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    this.ctx.textBaseline = 'middle';
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    for (const tag of this.tags) {
      const p = transformed.find(pt => pt.origIdx === tag.pIdx);
      if (p && p.z > 30) {
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0.7, p.alpha);

        const textWidth = this.ctx.measureText(tag.text).width;
        const pillW = textWidth + 20;
        const pillH = 24;
        const pillX = p.x + 14;
        const pillY = p.y - 12;

        // Frosted Glass Pill
        this.ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(11, 14, 20, 0.88)';
        this.ctx.strokeStyle = tag.color;
        this.ctx.lineWidth = 1.3;
        this.ctx.shadowColor = tag.color;
        this.ctx.shadowBlur = 10;
        this.roundRect(pillX, pillY, pillW, pillH, 12);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        this.ctx.stroke();

        // Pin Connector Line
        this.ctx.strokeStyle = tag.color;
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(pillX, pillY + 12);
        this.ctx.stroke();

        // Pin Node Dot
        this.ctx.fillStyle = tag.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        this.ctx.fill();

        // Label Text
        this.ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
        this.ctx.fillText(tag.text, pillX + 10, pillY + 12);
        this.ctx.restore();
      }
    }
  }

  hexToRgba(hex, alpha) {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  roundRect(x, y, w, h, r) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.arcTo(x + w, y, x + w, y + h, r);
    this.ctx.arcTo(x + w, y + h, x, y + h, r);
    this.ctx.arcTo(x, y + h, x, y, r);
    this.ctx.arcTo(x, y, x + w, y, r);
    this.ctx.closePath();
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
