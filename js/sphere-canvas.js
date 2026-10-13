// Tekno Krraft 2026 - 3D Interactive "UI Sphere" Particle System
// Mathematical 3D point cloud projected onto 2D canvas with mouse drag physics & orbital rings

export class UiSphereCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.points = [];
    this.numPoints = 320;
    this.radius = 190;
    this.rotX = 0.25;
    this.rotY = 0.35;
    this.targetRotX = 0.002;
    this.targetRotY = 0.003;
    this.velX = 0;
    this.velY = 0;
    this.isDragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.width = 0;
    this.height = 0;
    this.animId = null;
    this.mode = 'fibonacci'; // 'fibonacci' | 'constellation' | 'quantum'
    this.shockwave = 0;
    this.ringAngle = 0;

    // Authentic Google ecosystem vibrant palette
    this.colors = ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#a8c7fa'];

    this.tags = [
      { text: "Gemini 1.5", pIdx: 15, color: "#4285f4" },
      { text: "Cloud Run", pIdx: 52, color: "#ea4335" },
      { text: "Flutter 3.x", pIdx: 96, color: "#4285f4" },
      { text: "GKE / K8s", pIdx: 155, color: "#34a853" },
      { text: "RAG Vectors", pIdx: 210, color: "#fbbc04" },
      { text: "GDG ITER", pIdx: 265, color: "#34a853" }
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    this.generatePoints();
    this.setupInteractions();
    this.setupModeButtons();
    this.animate();
  }

  generatePoints() {
    this.points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < this.numPoints; i++) {
      const y = 1 - (i / (this.numPoints - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      this.points.push({
        x: x * this.radius,
        y: y * this.radius,
        z: z * this.radius,
        baseX: x * this.radius,
        baseY: y * this.radius,
        baseZ: z * this.radius,
        color: this.colors[i % this.colors.length],
        size: Math.random() * 2 + 1.4,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03
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
      if (!this.isDragging) {
        // Soft hover influence
        const rect = this.canvas.getBoundingClientRect();
        const normX = (x - rect.left - rect.width / 2) / rect.width;
        const normY = (y - rect.top - rect.height / 2) / rect.height;
        this.targetRotY = normX * 0.02;
        this.targetRotX = -normY * 0.02;
        return;
      }
      const dx = x - this.lastPointerX;
      const dy = y - this.lastPointerY;
      this.velY = dx * 0.005;
      this.velX = -dy * 0.005;
      this.rotY += this.velY;
      this.rotX += this.velX;
      this.lastPointerX = x;
      this.lastPointerY = y;
    };

    // End
    const endDrag = () => {
      this.isDragging = false;
    };

    // Mouse events
    container.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', endDrag);

    // Touch events for mobile
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchend', endDrag);

    // Click on canvas to trigger shockwave
    this.canvas.addEventListener('click', () => {
      this.shockwave = 1.0;
    });
  }

  setupModeButtons() {
    const buttons = document.querySelectorAll('.sphere-mode-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');
        this.setMode(mode);
      });
    });
  }

  setMode(mode) {
    this.mode = mode;
    this.shockwave = 1.0;
    if (mode === 'quantum') {
      this.targetRotY = 0.012;
      this.targetRotX = 0.006;
    } else {
      this.targetRotY = 0.003;
      this.targetRotX = 0.002;
    }
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const rect = parent?.getBoundingClientRect() || { width: 480, height: 480 };
    this.width = rect.width || 480;
    this.height = rect.height || 480;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.radius = Math.min(this.width, this.height) * 0.40;
    this.generatePoints();
  }

  rotatePoint(p, angleX, angleY) {
    // Rotate around Y axis
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    let x1 = p.x * cosY + p.z * sinY;
    let z1 = -p.x * sinY + p.z * cosY;

    // Rotate around X axis
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    let y1 = p.y * cosX - z1 * sinX;
    let z2 = p.y * sinX + z1 * cosX;

    return { x: x1, y: y1, z: z2 };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Friction & Inertia damping
    if (!this.isDragging) {
      this.velX *= 0.94;
      this.velY *= 0.94;
      this.rotX += this.velX + (this.targetRotX - this.velX) * 0.04;
      this.rotY += this.velY + (this.targetRotY - this.velY) * 0.04;
    }

    if (this.shockwave > 0.01) {
      this.shockwave *= 0.92;
    }

    this.ringAngle += 0.012;

    const cx = this.width / 2;
    const cy = this.height / 2;
    const fov = 440;

    // Render Orbital Gyroscope Ring in 3D
    this.renderOrbitalRings(cx, cy, fov);

    // Rotate all points
    const transformed = [];
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];

      // Quantum vibration mode or shockwave pulse
      let rOffset = 0;
      if (this.mode === 'quantum') {
        rOffset = Math.sin(p.phase + Date.now() * 0.003) * 16;
      }
      if (this.shockwave > 0.01) {
        rOffset += Math.sin(this.shockwave * Math.PI * 4) * (this.shockwave * 35);
      }

      const currentRadius = this.radius + rOffset;
      const baseDist = Math.sqrt(p.baseX * p.baseX + p.baseY * p.baseY + p.baseZ * p.baseZ) || 1;
      const curX = (p.baseX / baseDist) * currentRadius;
      const curY = (p.baseY / baseDist) * currentRadius;
      const curZ = (p.baseZ / baseDist) * currentRadius;

      const rotated = this.rotatePoint({ x: curX, y: curY, z: curZ }, this.rotX, this.rotY);
      p.x = rotated.x;
      p.y = rotated.y;
      p.z = rotated.z;

      // 3D perspective projection
      const scale = fov / (fov + p.z);
      const px = cx + p.x * scale;
      const py = cy + p.y * scale;
      const alpha = Math.max(0.15, Math.min(1, (p.z + this.radius) / (2 * this.radius)));

      transformed.push({ x: px, y: py, z: p.z, scale, alpha, color: p.color, size: p.size, origIdx: i });
    }

    // Sort by depth
    transformed.sort((a, b) => a.z - b.z);

    // Constellation lines linking near neighbors
    const lineDistThreshold = this.mode === 'constellation' ? 68 : 48;
    this.ctx.lineWidth = 0.75;
    for (let i = 0; i < transformed.length; i += 2) {
      for (let j = i + 1; j < Math.min(i + 6, transformed.length); j++) {
        const p1 = transformed[i];
        const p2 = transformed[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < lineDistThreshold && p1.z > -40) {
          const lineAlpha = (1 - dist / lineDistThreshold) * 0.28 * p1.alpha;
          this.ctx.strokeStyle = `rgba(66, 133, 244, ${lineAlpha})`;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    // Render glowing nodes
    for (let i = 0; i < transformed.length; i++) {
      const p = transformed[i];
      const r = Math.max(1, p.size * p.scale);

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;

      // Foreground glowing halo
      if (p.z > 20) {
        const glowRad = r * 2.8;
        const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRad);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, glowRad, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }

    // Render floating constellation labels
    this.ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    this.ctx.textBaseline = 'middle';

    for (const tag of this.tags) {
      const p = transformed.find(pt => pt.origIdx === tag.pIdx);
      if (p && p.z > 40) {
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0.6, p.alpha);
        
        const textWidth = this.ctx.measureText(tag.text).width;
        const pillW = textWidth + 18;
        const pillH = 22;
        const pillX = p.x + 12;
        const pillY = p.y - 11;

        const isLight = document.documentElement.getAttribute('data-theme') === 'light';

        // Floating glass pill badge
        this.ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(14, 21, 38, 0.92)';
        this.ctx.strokeStyle = tag.color;
        this.ctx.lineWidth = 1.2;
        this.roundRect(pillX, pillY, pillW, pillH, 11);
        this.ctx.fill();
        this.ctx.stroke();

        // Pin line to node
        this.ctx.strokeStyle = tag.color;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(pillX, pillY + 11);
        this.ctx.stroke();

        // Text
        this.ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
        this.ctx.fillText(tag.text, pillX + 9, pillY + 11);
        this.ctx.restore();
      }
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }

  renderOrbitalRings(cx, cy, fov) {
    this.ctx.save();
    const ringRadius = this.radius * 1.15;
    const numRingPts = 48;
    const ringPoints = [];

    for (let i = 0; i <= numRingPts; i++) {
      const angle = (i / numRingPts) * Math.PI * 2;
      const rx = Math.cos(angle) * ringRadius;
      const ry = Math.sin(angle) * ringRadius * 0.35; // Tilted ellipse
      const rz = Math.sin(angle) * ringRadius * 0.65;

      const rot = this.rotatePoint({ x: rx, y: ry, z: rz }, this.rotX * 0.5, this.rotY + this.ringAngle);
      const scale = fov / (fov + rot.z);
      ringPoints.push({
        x: cx + rot.x * scale,
        y: cy + rot.y * scale,
        z: rot.z,
        alpha: Math.max(0.08, Math.min(0.4, (rot.z + ringRadius) / (2 * ringRadius)))
      });
    }

    // Draw dashed glowing ring
    this.ctx.setLineDash([4, 6]);
    this.ctx.lineWidth = 1.2;
    for (let i = 0; i < ringPoints.length - 1; i++) {
      const p1 = ringPoints[i];
      const p2 = ringPoints[i + 1];
      if (p1.z > -this.radius * 0.8) {
        this.ctx.strokeStyle = `rgba(66, 133, 244, ${p1.alpha * 0.7})`;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
      }
    }
    this.ctx.restore();
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
