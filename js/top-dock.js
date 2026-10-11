// ============================================================================
// Animated Top Dock - Authored Sable Proximity-Spring Menu
// DOM + CSS + WebGL + Three.js r128 Controller
// Source Revision: 5a736cd3c1f6f19802f61ebb10e1701b9f7aa26e
// ============================================================================

export class TopDockController {
  constructor(options = {}) {
    this.containerId = options.containerId || 'topDockContainer';
    this.proximity = options.proximity ?? 122; // authored 122 px proximity radius
    this.spring = options.spring ?? 0.19;      // authored spring 0.19
    this.fit = options.fit || 'horizontal';       // modern command bar by default
    this.variant = options.variant || 'modern';   // modern variant by default

    this.container = null;
    this.hostFrame = null;
    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.shaderMaterial = null;
    this.mesh = null;
    this.clock = null;

    this.items = [];
    this.pointerX = -9999;
    this.pointerY = -9999;
    this.isPointerInside = false;
    this.focusedIndex = -1;
    this.selectedIndex = 0;

    this.animationFrameId = null;
    this.resizeObserver = null;
    this.scrollSpyObserver = null;
    this.isAdaptiveMotion = true;
    this.isDestroyed = false;

    this.init();
  }

  /* ------------------------------------------------------------------------
     1. INITIALIZATION & DOM ASSEMBLY
     ------------------------------------------------------------------------ */
  init() {
    this.checkMotionCapabilities();
    this.buildDom();
    this.measureItems();
    this.initWebGL();
    this.bindEvents();
    this.initScrollSpy();
    this.startLoop();
  }

  checkMotionCapabilities() {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isNarrow = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isAdaptiveMotion = !isCoarse && !isNarrow && !prefersReducedMotion;
  }

  buildDom() {
    let host = document.getElementById('topDockHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'topDockHost';
      host.className = 'top-dock-host-frame';
      document.body.prepend(host);
    }
    this.hostFrame = host;

    let dockEl = document.getElementById(this.containerId);
    if (!dockEl) {
      dockEl = document.createElement('nav');
      dockEl.id = this.containerId;
      host.appendChild(dockEl);
    }
    this.container = dockEl;
    this.container.className = `top-dock-container fit-${this.fit} variant-${this.variant}`;
    this.container.setAttribute('aria-label', 'Main Dock Navigation');

    // WebGL Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'top-dock-webgl-canvas';
    this.container.appendChild(this.canvas);

    // 1 Brand Logo Control + 5 Authored Menu Items
    this.container.innerHTML = `
      <canvas class="top-dock-webgl-canvas" id="dockShaderCanvas"></canvas>

      <!-- Logo Control -->
      <a href="#hero" class="top-dock-brand" aria-label="Tekno Krraft 2026 Home">
        <span class="dock-brand-symbol">
          <span style="color:#4285f4;">&lt;</span><span style="color:#ea4335;">G</span><span style="color:#fbbc04;">D</span><span style="color:#34a853;">G</span><span style="color:#4285f4;">&gt;</span>
        </span>
        <span class="dock-brand-name">TK'26</span>
      </a>

      <!-- 5 Authored Items: SYSTEM, METHOD, WORK, ACCESS, NOTES -->
      <ul class="top-dock-menu" role="menubar">
        <li role="none">
          <a href="#oracle" class="top-dock-item" role="menuitem" data-index="0" data-anchor="oracle" data-selected="false">
            <svg viewBox="0 0 24 24" class="dock-icon-svg" fill="none" stroke="currentColor">
              <rect x="5" y="5" width="14" height="14" rx="2" stroke-width="1.6"/>
              <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
              <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            <span class="top-dock-label">SYSTEM</span>
            <span class="top-dock-tooltip">Ask Gemini AI // Intelligence Hub</span>
          </a>
        </li>

        <li role="none">
          <a href="#tracks" class="top-dock-item" role="menuitem" data-index="1" data-anchor="tracks" data-selected="false">
            <svg viewBox="0 0 24 24" class="dock-icon-svg" fill="none" stroke="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke-width="1.6" stroke-linejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke-width="1.6" stroke-linejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke-width="1.6" stroke-linejoin="round"/>
            </svg>
            <span class="top-dock-label">METHOD</span>
            <span class="top-dock-tooltip">Curriculum & 4 Specialization Tracks</span>
          </a>
        </li>

        <li role="none">
          <a href="#schedule" class="top-dock-item" role="menuitem" data-index="2" data-anchor="schedule" data-selected="false">
            <svg viewBox="0 0 24 24" class="dock-icon-svg" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="16" rx="2" stroke-width="1.6"/>
              <path d="M7 9l3 3-3 3M13 15h4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="top-dock-label">WORK</span>
            <span class="top-dock-tooltip">3-Day Interactive Schedule & Keynotes</span>
          </a>
        </li>

        <li role="none">
          <a href="#pass" class="top-dock-item" role="menuitem" data-index="3" data-anchor="pass" data-selected="false">
            <svg viewBox="0 0 24 24" class="dock-icon-svg" fill="none" stroke="currentColor">
              <rect x="4" y="3" width="16" height="18" rx="3" stroke-width="1.6"/>
              <circle cx="12" cy="9" r="2.5" stroke-width="1.6"/>
              <path d="M8 17h8M9 13.5h6" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            <span class="top-dock-label">ACCESS</span>
            <span class="top-dock-tooltip">Delegate Pass & Digital Accreditation</span>
          </a>
        </li>

        <li role="none">
          <a href="#hackathon" class="top-dock-item" role="menuitem" data-index="4" data-anchor="hackathon" data-selected="false">
            <svg viewBox="0 0 24 24" class="dock-icon-svg" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="1.6" stroke-linejoin="round"/>
              <polyline points="14 2 14 8 20 8" stroke-width="1.6" stroke-linejoin="round"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke-width="1.6" stroke-linecap="round"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke-width="1.6" stroke-linecap="round"/>
              <line x1="10" y1="9" x2="8" y2="9" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            <span class="top-dock-label">NOTES</span>
            <span class="top-dock-tooltip">₹2.5L Hack Sprint & Problem Sets</span>
          </a>
        </li>
      </ul>

      <!-- Quick Actions & Mode Switcher -->
      <div class="top-dock-actions">
        <!-- Audio Feedback Toggle -->
        <button type="button" id="soundToggleBtn" class="dock-icon-chip" aria-label="Toggle Sound Effects" title="Tactile Sound Feedback">
          <svg class="dock-util-svg" viewBox="0 0 24 24">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        </button>

        <!-- Itinerary Plan Toggle -->
        <button type="button" class="dock-pill-chip itinerary-toggle-btn" title="View Saved Itinerary">
          <svg class="dock-util-svg" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span class="dock-chip-text">PLAN</span>
          <span class="itinerary-btn-badge" style="display:none;">0</span>
        </button>

        <!-- Theme Toggle -->
        <button type="button" id="themeToggleBtn" class="dock-icon-chip" aria-label="Toggle visual theme" title="Toggle theme">
          <svg class="dock-util-svg" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>

        <!-- Fit Toggle -->
        <button type="button" class="dock-chip-btn" id="dockFitToggleBtn" title="Toggle Dock Fit (centred / horizontal / vertical)">
          <span id="dockFitLabel">${this.fit.toUpperCase()}</span>
        </button>

        <!-- Variant Toggle -->
        <button type="button" class="dock-chip-btn" id="dockVariantToggleBtn" title="Toggle Dock Variant (sable / modern / retro / glass)">
          <span id="dockVariantLabel">${this.variant.toUpperCase()}</span>
        </button>

        <!-- Register CTA -->
        <button type="button" class="dock-cta-register open-reg-modal-btn" aria-label="Register Now">
          <span>JOIN FEST</span>
          <span class="dock-cta-arrow">→</span>
        </button>

        <!-- Mobile Menu Trigger -->
        <button type="button" id="mobileMenuBtn" class="dock-icon-chip dock-mobile-menu-btn" aria-label="Open mobile menu" aria-expanded="false">
          <svg class="dock-util-svg" viewBox="0 0 24 24">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    `;

    this.canvas = this.container.querySelector('#dockShaderCanvas');
  }

  /* ------------------------------------------------------------------------
     2. ITEM MEASUREMENT AT REST
     ------------------------------------------------------------------------ */
  measureItems() {
    const itemEls = this.container.querySelectorAll('.top-dock-item');
    this.items = [];

    itemEls.forEach((el, index) => {
      // Clear dynamic inline styling for pure rest measurement
      el.style.width = '';
      el.style.height = '';
      el.style.transform = '';

      const rect = el.getBoundingClientRect();
      this.items.push({
        element: el,
        index,
        baseWidth: rect.width || 86,
        baseHeight: rect.height || 46,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        value: 0,
        velocity: 0,
        target: 0
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. WEBGL + THREE.JS R128 INTEGRATION
     ------------------------------------------------------------------------ */
  initWebGL() {
    if (!this.canvas || typeof window.THREE === 'undefined') {
      return;
    }

    try {
      const THREE = window.THREE;
      const width = this.container.clientWidth || 600;
      const height = this.container.clientHeight || 56;

      this.clock = new THREE.Clock();
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'low-power'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Shaders for glass and retro variants
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uPointer;
        uniform float uHover;
        uniform int uVariant; // 0: sable, 1: modern, 2: retro, 3: glass
        varying vec2 vUv;

        void main() {
          vec2 st = gl_FragCoord.xy / uResolution.xy;
          vec2 ptr = uPointer / uResolution.xy;
          float dist = distance(st, ptr);

          if (uVariant == 2) {
            // Retro Phosphor Terminal Scanlines
            float scanline = sin(st.y * 180.0 + uTime * 4.0) * 0.15;
            float glow = smoothstep(0.35, 0.0, dist) * uHover * 0.45;
            vec3 col = vec3(0.1, 0.65, 0.25) * (0.2 + scanline + glow);
            gl_FragColor = vec4(col, 0.4);
          } else if (uVariant == 3) {
            // Glass Chromatic Dispersion Rail
            float ripple = sin(dist * 24.0 - uTime * 3.0) * 0.05 * uHover;
            float spec = smoothstep(0.4, 0.0, dist) * uHover * 0.6;
            vec3 col = vec3(0.2, 0.5, 1.0) * spec + vec3(0.8, 0.3, 0.9) * ripple;
            gl_FragColor = vec4(col, 0.5);
          } else {
            // Subtle ambient specular sheen
            float sheen = smoothstep(0.5, 0.0, dist) * uHover * 0.25;
            gl_FragColor = vec4(vec3(1.0), sheen * 0.2);
          }
        }
      `;

      this.shaderMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(width, height) },
          uPointer: { value: new THREE.Vector2(-9999, -9999) },
          uHover: { value: 0.0 },
          uVariant: { value: this.getVariantCode(this.variant) }
        },
        transparent: true,
        depthTest: false
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      this.mesh = new THREE.Mesh(geometry, this.shaderMaterial);
      this.scene.add(this.mesh);

      // Context Loss Handling
      this.canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
      }, false);

      this.canvas.addEventListener('webglcontextrestored', () => {
        this.initWebGL();
      }, false);
    } catch (err) {
      console.warn('TopDock WebGL layer fallback:', err);
    }
  }

  getVariantCode(v) {
    if (v === 'retro') return 2;
    if (v === 'glass') return 3;
    if (v === 'modern') return 1;
    return 0; // sable
  }

  updateShaderDimensions() {
    if (!this.renderer || !this.shaderMaterial) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.renderer.setSize(width, height);
    this.shaderMaterial.uniforms.uResolution.value.set(width, height);
  }

  /* ------------------------------------------------------------------------
     4. EVENT BINDING & INTERACTION
     ------------------------------------------------------------------------ */
  bindEvents() {
    // Pointer proximity tracking
    this.container.addEventListener('pointerenter', (e) => {
      this.isPointerInside = true;
      this.container.setAttribute('data-dock-state', 'active');
      this.updatePointer(e);
    });

    this.container.addEventListener('pointermove', (e) => {
      this.isPointerInside = true;
      this.container.setAttribute('data-dock-state', 'active');
      this.updatePointer(e);
    });

    this.container.addEventListener('pointerleave', () => {
      this.isPointerInside = false;
      this.pointerX = -9999;
      this.pointerY = -9999;
      this.container.setAttribute('data-dock-state', 'idle');
      if (this.focusedIndex === -1) {
        this.items.forEach(item => {
          item.target = 0;
          item.element.setAttribute('data-dock-near', 'false');
        });
      }
    });

    // Keyboard Focus Tracking
    this.items.forEach((item, idx) => {
      item.element.addEventListener('focus', () => {
        this.focusedIndex = idx;
        const rect = item.element.getBoundingClientRect();
        this.pointerX = rect.left + rect.width / 2;
        this.pointerY = rect.top + rect.height / 2;
      });

      item.element.addEventListener('blur', () => {
        this.focusedIndex = -1;
        if (!this.isPointerInside) {
          this.pointerX = -9999;
          this.pointerY = -9999;
          this.items.forEach(it => { it.target = 0; });
        }
      });

      item.element.addEventListener('click', (e) => {
        this.setSelectedItem(idx);
      });
    });

    // ResizeObserver for dynamic rest positions
    this.resizeObserver = new ResizeObserver(() => {
      this.checkMotionCapabilities();
      this.measureItems();
      this.updateShaderDimensions();
    });
    this.resizeObserver.observe(this.container);

    // Fit & Variant Switcher Buttons
    const fitBtn = this.container.querySelector('#dockFitToggleBtn');
    fitBtn?.addEventListener('click', () => {
      const fits = ['centred', 'horizontal', 'vertical'];
      const nextIdx = (fits.indexOf(this.fit) + 1) % fits.length;
      this.setFit(fits[nextIdx]);
    });

    const variantBtn = this.container.querySelector('#dockVariantToggleBtn');
    variantBtn?.addEventListener('click', () => {
      const vars = ['sable', 'modern', 'retro', 'glass'];
      const nextIdx = (vars.indexOf(this.variant) + 1) % vars.length;
      this.setVariant(vars[nextIdx]);
    });
  }

  updatePointer(e) {
    this.pointerX = e.clientX;
    this.pointerY = e.clientY;

    if (this.shaderMaterial) {
      const rect = this.canvas.getBoundingClientRect();
      this.shaderMaterial.uniforms.uPointer.value.set(e.clientX - rect.left, rect.bottom - e.clientY);
      this.shaderMaterial.uniforms.uHover.value = 1.0;
    }
  }

  setSelectedItem(index) {
    this.selectedIndex = index;
    this.items.forEach((item, idx) => {
      item.element.setAttribute('data-selected', idx === index ? 'true' : 'false');
    });
  }

  setFit(fitName) {
    this.fit = fitName;
    this.container.classList.remove('fit-centred', 'fit-horizontal', 'fit-vertical');
    this.container.classList.add(`fit-${fitName}`);
    this.hostFrame.classList.toggle('fit-vertical-host', fitName === 'vertical');

    const lbl = this.container.querySelector('#dockFitLabel');
    if (lbl) lbl.textContent = fitName.toUpperCase();

    setTimeout(() => {
      this.measureItems();
      this.updateShaderDimensions();
    }, 50);
  }

  setVariant(variantName) {
    this.variant = variantName;
    this.container.classList.remove('variant-sable', 'variant-modern', 'variant-retro', 'variant-glass');
    this.container.classList.add(`variant-${variantName}`);

    const lbl = this.container.querySelector('#dockVariantLabel');
    if (lbl) lbl.textContent = variantName.toUpperCase();

    if (this.shaderMaterial) {
      this.shaderMaterial.uniforms.uVariant.value = this.getVariantCode(variantName);
    }
  }

  /* ------------------------------------------------------------------------
     5. SCROLL SPY FOR ACTIVE ITEM STATE
     ------------------------------------------------------------------------ */
  initScrollSpy() {
    const anchors = ['oracle', 'tracks', 'schedule', 'pass', 'hackathon'];
    const sections = anchors.map(id => document.getElementById(id)).filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const idx = anchors.indexOf(id);
          if (idx !== -1) {
            this.setSelectedItem(idx);
          }
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(s => observer.observe(s));
    this.scrollSpyObserver = observer;
  }

  /* ------------------------------------------------------------------------
     6. PER-ITEM SPRING INTEGRATION LOOP
     ------------------------------------------------------------------------ */
  startLoop() {
    const loop = () => {
      if (this.isDestroyed) return;

      this.updatePhysics();
      this.renderShader();

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  updatePhysics() {
    const isVertical = this.fit === 'vertical';

    this.items.forEach(item => {
      if (this.isAdaptiveMotion) {
        // Compute proximity distance
        const itemPos = isVertical ? item.centerY : item.centerX;
        const pointerPos = isVertical ? this.pointerY : this.pointerX;
        const distance = Math.abs(pointerPos - itemPos);

        // Smoothstep Hermite influence
        const t = Math.max(0, Math.min(1, 1 - distance / this.proximity));
        const influence = t * t * (3 - 2 * t);
        item.target = influence;

        // Spring integration: velocity += (target - value) * spring; velocity *= damping; value += velocity;
        const force = (item.target - item.value) * this.spring;
        item.velocity += force;
        item.velocity *= this.damping;
        item.value += item.velocity;

        // Apply authored maximum growth: 17px width, 16px height, 3.5px downward growth
        const wGrowth = item.value * 17;
        const hGrowth = item.value * 16;
        const yShift = item.value * 3.5;

        item.element.style.width = `${item.baseWidth + wGrowth}px`;
        item.element.style.height = `${item.baseHeight + hGrowth}px`;

        if (isVertical) {
          item.element.style.transform = `translateX(${yShift}px)`;
        } else {
          item.element.style.transform = `translateY(${yShift}px)`;
        }

        // ThreeUI Proximity Near attribute flag
        item.element.setAttribute('data-dock-near', item.value > 0.04 ? 'true' : 'false');
      } else {
        // Static adaptive fallback for coarse pointers / reduced motion
        item.element.style.width = '';
        item.element.style.height = '';
        item.element.style.transform = '';
        item.element.setAttribute('data-dock-near', 'false');
      }
    });
  }

  renderShader() {
    if (this.renderer && this.shaderMaterial && this.clock) {
      this.shaderMaterial.uniforms.uTime.value = this.clock.getElapsedTime();
      if (!this.isPointerInside && this.shaderMaterial.uniforms.uHover.value > 0) {
        this.shaderMaterial.uniforms.uHover.value = Math.max(0, this.shaderMaterial.uniforms.uHover.value - 0.05);
      }
      this.renderer.render(this.scene, this.camera);
    }
  }

  /* ------------------------------------------------------------------------
     7. TEARDOWN LIFECYCLE
     ------------------------------------------------------------------------ */
  destroy() {
    this.isDestroyed = true;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.scrollSpyObserver) {
      this.scrollSpyObserver.disconnect();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.mesh && this.mesh.geometry) {
      this.mesh.geometry.dispose();
    }
    if (this.shaderMaterial) {
      this.shaderMaterial.dispose();
    }
    if (this.hostFrame && this.hostFrame.parentNode) {
      this.hostFrame.parentNode.removeChild(this.hostFrame);
    }
  }
}
