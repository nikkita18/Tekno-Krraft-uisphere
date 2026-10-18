// ==========================================================================
// TEKNO KRRAFT 2026 - MASTER 3D SCROLLABLE SPEAKERS & MENTORS CAROUSEL
// Authentic 3D Coverflow/Spatial Stage, Infinite Smooth Scrubbing,
// Momentum Physics, Wheel & Swipe Interaction, and Audio Synced Controls.
// ==========================================================================

export class Speakers3DScroller {
  constructor(app, containerId = 'speakersGrid') {
    this.app = app;
    this.container = document.getElementById(containerId);
    this.speakers = app.speakersData || [];

    if (!this.container || this.speakers.length === 0) return;

    // Scroll & Physics State
    this.currentScroll = 0;
    this.targetScroll = 0;
    this.velocity = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartScroll = 0;
    this.dragDistance = 0;
    this.lastPointerX = 0;
    this.lastPointerTime = 0;

    // Animation & Mode State
    this.animId = null;
    this.isOrbiting = true; // Auto-orbit enabled by default
    this.lastInteractionTime = 0;
    this.activeIndex = 0;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.reducedMotion) {
      this.isOrbiting = false;
    }

    this.init();
  }

  init() {
    this.buildMarkup();
    this.bindEvents();
    this.startRenderLoop();
  }

  /* ------------------------------------------------------------------------
     1. DOM GENERATION
     ------------------------------------------------------------------------ */
  buildMarkup() {
    this.container.classList.remove('speakers-grid');
    this.container.classList.add('speakers-3d-container');

    const total = this.speakers.length;
    const firstSpeaker = this.speakers[0];

    this.container.innerHTML = `
      <!-- HUD / Toolbar -->
      <div class="speakers-3d-hud" role="toolbar" aria-label="3D Speakers Navigation Toolbar">
        <div class="speakers-hud-left">
          <span class="speakers-badge-3d">
            <span class="pulse-dot"></span>
            <span>3D Spatial Stage</span>
          </span>
          <div class="speakers-counter-box">
            <span class="speakers-current-num" id="speakerCurrentNum">01</span>
            <span>/</span>
            <span>0${total}</span>
          </div>
          <span class="speakers-active-name" id="speakerActiveName">${firstSpeaker.name}</span>
        </div>

        <div class="speakers-hud-center">
          <div class="speakers-stepper-track" id="speakersStepperTrack" role="tablist" aria-label="Speaker navigation dots">
            ${this.speakers.map((sp, idx) => `
              <button class="speaker-step-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" title="${sp.name}" aria-label="Jump to ${sp.name}" role="tab">
                0${idx + 1}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="speakers-hud-right">
          <button class="speakers-orbit-toggle ${this.isOrbiting ? 'active' : ''}" id="speakersOrbitToggle" title="Toggle Auto-Orbit Continuous Rotation" aria-pressed="${this.isOrbiting}">
            <span class="orbit-status-dot"></span>
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span>Auto Orbit</span>
          </button>

          <button class="speakers-nav-btn" id="speakersPrevBtn" aria-label="Previous Speaker" title="Previous Speaker">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button class="speakers-nav-btn" id="speakersNextBtn" aria-label="Next Speaker" title="Next Speaker">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <!-- 3D Stage Viewport -->
      <div class="speakers-3d-stage" id="speakers3dStage" tabindex="0" role="region" aria-label="3D Cylindrical Speakers Stage">
        <div class="speakers-ambient-glow" id="speakersAmbientGlow"></div>
        <div class="speakers-floor-grid"></div>

        <div class="speakers-3d-track" id="speakers3dTrack">
          ${this.speakers.map((sp, idx) => this.renderSpeakerCard(sp, idx)).join('')}
        </div>
      </div>

      <!-- Interaction Cues -->
      <div class="speakers-interaction-hint">
        <span class="hint-icon">⟷</span>
        <span>Drag, swipe or wheel scroll to rotate 3D cards</span>
        <span class="pill-divider">•</span>
        <span class="hint-keys">
          <kbd>←</kbd>
          <kbd>→</kbd>
          <span>to navigate</span>
        </span>
      </div>
    `;

    // Cache elements
    this.stage = document.getElementById('speakers3dStage');
    this.track = document.getElementById('speakers3dTrack');
    this.cards = Array.from(this.track.querySelectorAll('.speaker-card-3d'));
    this.dots = Array.from(document.querySelectorAll('.speaker-step-dot'));
    this.currentNumEl = document.getElementById('speakerCurrentNum');
    this.activeNameEl = document.getElementById('speakerActiveName');
    this.ambientGlowEl = document.getElementById('speakersAmbientGlow');
    this.orbitToggleBtn = document.getElementById('speakersOrbitToggle');
    this.prevBtn = document.getElementById('speakersPrevBtn');
    this.nextBtn = document.getElementById('speakersNextBtn');
  }

  getTrackSlug(track) {
    const t = (track || '').toLowerCase();
    if (t.includes('cloud')) return 'cloud';
    if (t.includes('ai') || t.includes('generative')) return 'ai';
    if (t.includes('mobile') || t.includes('flutter')) return 'mobile';
    if (t.includes('security')) return 'security';
    return 'web';
  }

  getTrackColor(track) {
    const slug = this.getTrackSlug(track);
    switch (slug) {
      case 'cloud': return 'rgba(66, 133, 244, 0.28)';
      case 'ai': return 'rgba(251, 188, 4, 0.28)';
      case 'mobile': return 'rgba(52, 168, 83, 0.28)';
      case 'security': return 'rgba(234, 67, 53, 0.28)';
      default: return 'rgba(59, 130, 246, 0.28)';
    }
  }

  renderSpeakerCard(sp, idx) {
    const trackSlug = this.getTrackSlug(sp.track);
    const sessions = sp.sessions || [];

    return `
      <article class="speaker-card-3d ${idx === 0 ? 'is-active' : ''}" data-index="${idx}" data-speaker-id="${sp.id}" data-track-type="${trackSlug}" role="button" tabindex="0" aria-label="View dossier for ${sp.name}">
        <div class="speaker-card-accent-line"></div>
        <div class="speaker-card-glare"></div>

        <div class="speaker-3d-header">
          <div class="speaker-avatar-wrap">
            <img src="${sp.avatar}" alt="${sp.name}" class="speaker-avatar-img" loading="lazy" />
            <div class="speaker-avatar-ring"></div>
          </div>
          <div class="speaker-headings-3d">
            <h3 class="speaker-name-3d">${sp.name}</h3>
            <span class="speaker-role-3d">${sp.role}</span>
            <span class="speaker-org-3d">${sp.org}</span>
          </div>
        </div>

        <div class="speaker-tags-row-3d">
          <span class="tag tag-blue">${sp.track}</span>
          <span class="tag tag-yellow">${sp.badge}</span>
        </div>

        <p class="speaker-bio-3d">${sp.bio}</p>

        <div class="speaker-sessions-preview-3d">
          <div class="sessions-preview-label">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Lead Keynote & Session</span>
          </div>
          ${sessions.slice(0, 1).map(s => `
            <div class="session-chip-item" title="${s}">⚡ ${s}</div>
          `).join('')}
        </div>

        <div class="speaker-card-footer-3d">
          <span>Inspect Full Dossier</span>
          <div class="cta-arrow">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      </article>
    `;
  }

  /* ------------------------------------------------------------------------
     2. EVENT HANDLING (DRAG, WHEEL, TOUCH, KEYS)
     ------------------------------------------------------------------------ */
  bindEvents() {
    // Mouse / Touch Dragging
    const onPointerDown = (e) => {
      this.isDragging = true;
      this.lastInteractionTime = performance.now();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      this.dragStartX = clientX;
      this.lastPointerX = clientX;
      this.lastPointerTime = performance.now();
      this.dragStartScroll = this.targetScroll;
      this.dragDistance = 0;
      this.velocity = 0;
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      this.lastInteractionTime = performance.now();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - this.dragStartX;
      this.dragDistance += Math.abs(clientX - this.lastPointerX);

      const now = performance.now();
      const dt = Math.max(1, now - this.lastPointerTime);
      this.velocity = (this.lastPointerX - clientX) / dt;

      this.lastPointerX = clientX;
      this.lastPointerTime = now;

      // ~300px drag = 1 card advance
      this.targetScroll = this.dragStartScroll - (deltaX / 300);
    };

    const onPointerUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.lastInteractionTime = performance.now();

      // Add throw momentum
      if (Math.abs(this.velocity) > 0.12) {
        this.targetScroll += this.velocity * 3.5;
      }
      // Snap to nearest integer card
      this.targetScroll = Math.round(this.targetScroll);
    };

    this.stage.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);

    this.stage.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Mouse wheel over stage
    this.stage.addEventListener('wheel', (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 3) {
        e.preventDefault();
        this.lastInteractionTime = performance.now();
        this.targetScroll += delta * 0.0025;
      }
    }, { passive: false });

    // Card Hover Parallax Tilt & Click Interaction
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (this.isDragging) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const tiltX = (y - centerY) / centerY;
        const tiltY = (centerX - x) / centerX;

        card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
        card.setAttribute('data-tilt-x', (-tiltX * 6).toFixed(2));
        card.setAttribute('data-tilt-y', (-tiltY * 6).toFixed(2));
      });

      card.addEventListener('mouseleave', () => {
        card.removeAttribute('data-tilt-x');
        card.removeAttribute('data-tilt-y');
      });

      card.addEventListener('click', (e) => {
        // If user was dragging (> 8px movement), ignore click
        if (this.dragDistance > 8) {
          e.preventDefault();
          return;
        }

        const idx = parseInt(card.getAttribute('data-index'), 10);
        const count = this.speakers.length;
        let normScroll = ((this.currentScroll % count) + count) % count;
        let diff = idx - normScroll;
        if (diff > count / 2) diff -= count;
        if (diff < -count / 2) diff += count;

        // If card is not in center, click brings it to center
        if (Math.abs(diff) > 0.45) {
          this.navigateToIndex(idx);
          this.app.soundSynth?.playBlip();
          return;
        }

        // Card is already centered: open dossier modal
        const id = card.getAttribute('data-speaker-id');
        const sp = this.speakers.find(s => s.id === id);
        if (sp) {
          this.app.soundSynth?.playChime();
          this.app.openSpeakerModal(sp);
        }
      });
    });

    // Stepper dots
    this.dots.forEach(dot => {
      dot.addEventListener('click', () => {
        this.lastInteractionTime = performance.now();
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        this.navigateToIndex(idx);
        this.app.soundSynth?.playBlip();
      });
    });

    // Nav buttons
    this.prevBtn?.addEventListener('click', () => {
      this.lastInteractionTime = performance.now();
      this.targetScroll = Math.round(this.targetScroll) - 1;
      this.app.soundSynth?.playBlip();
    });

    this.nextBtn?.addEventListener('click', () => {
      this.lastInteractionTime = performance.now();
      this.targetScroll = Math.round(this.targetScroll) + 1;
      this.app.soundSynth?.playBlip();
    });

    // Orbit Toggle
    this.orbitToggleBtn?.addEventListener('click', () => {
      this.isOrbiting = !this.isOrbiting;
      this.orbitToggleBtn.classList.toggle('active', this.isOrbiting);
      this.orbitToggleBtn.setAttribute('aria-pressed', String(this.isOrbiting));
      this.lastInteractionTime = 0;
      this.app.soundSynth?.playBlip();
    });

    // Keyboard navigation when stage is focused
    this.stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.lastInteractionTime = performance.now();
        this.targetScroll = Math.round(this.targetScroll) - 1;
        this.app.soundSynth?.playBlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.lastInteractionTime = performance.now();
        this.targetScroll = Math.round(this.targetScroll) + 1;
        this.app.soundSynth?.playBlip();
      } else if (e.key === 'Enter' || e.key === ' ') {
        const activeSp = this.speakers[this.activeIndex];
        if (activeSp) {
          e.preventDefault();
          this.app.openSpeakerModal(activeSp);
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. NAVIGATION HELPERS
     ------------------------------------------------------------------------ */
  navigateToIndex(targetIdx) {
    const count = this.speakers.length;
    let norm = ((this.targetScroll % count) + count) % count;
    let diff = targetIdx - norm;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;

    this.targetScroll += diff;
  }

  /* ------------------------------------------------------------------------
     4. 3D SPATIAL RENDER LOOP
     ------------------------------------------------------------------------ */
  startRenderLoop() {
    const loop = () => {
      this.updatePhysics();
      this.render3dPositions();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  updatePhysics() {
    const now = performance.now();
    const isInteracting = this.isDragging || (now - this.lastInteractionTime < 2400);

    // Auto-orbit slowly advances when idle & enabled
    if (this.isOrbiting && !isInteracting) {
      this.targetScroll += 0.0035;
    }

    // Smooth Lerp
    const lerpFactor = this.isDragging ? 0.35 : 0.10;
    this.currentScroll += (this.targetScroll - this.currentScroll) * lerpFactor;

    // Active index determination (always matches center card)
    const count = this.speakers.length;
    const roundedIndex = ((Math.round(this.currentScroll) % count) + count) % count;

    if (roundedIndex !== this.activeIndex) {
      this.activeIndex = roundedIndex;
      this.updateHudState();
    }
  }

  updateHudState() {
    const sp = this.speakers[this.activeIndex];
    if (!sp) return;

    if (this.currentNumEl) {
      this.currentNumEl.textContent = `0${this.activeIndex + 1}`;
    }
    if (this.activeNameEl) {
      this.activeNameEl.textContent = sp.name;
    }

    // Active stepper dot
    this.dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.activeIndex);
    });

    // Update ambient glow color to match track
    if (this.ambientGlowEl) {
      const color = this.getTrackColor(sp.track);
      this.ambientGlowEl.style.background = `radial-gradient(circle, ${color} 0%, rgba(66, 133, 244, 0.05) 50%, transparent 70%)`;
    }
  }

  render3dPositions() {
    const count = this.speakers.length;
    let normScroll = ((this.currentScroll % count) + count) % count;

    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;
    const cardSpacing = isMobile ? 260 : (isTablet ? 290 : 330);

    this.cards.forEach((card, idx) => {
      let diff = idx - normScroll;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;

      const absDiff = Math.abs(diff);

      // 3D Coverflow Coordinates:
      // Center card has x=0, z=0, rotY=0
      // Adjacent cards translate horizontally, angle inward, and step back in Z
      const x = diff * cardSpacing;
      const z = -Math.pow(absDiff, 1.15) * (isMobile ? 80 : 110);
      const rotY = -Math.sign(diff) * Math.min(48, Math.pow(absDiff, 0.85) * (isMobile ? 24 : 32));
      const scale = Math.max(0.68, 1.02 - absDiff * 0.12);

      // Natural opacity falloff:
      // Center card is 1.0, direct neighbor (absDiff = 1) is 0.78
      // Beyond 1.0, it gracefully fades to 0 before absDiff reaches 1.8
      let opacity = 0;
      if (absDiff <= 1.0) {
        opacity = 1 - absDiff * 0.22;
      } else if (absDiff < 1.8) {
        const t = (absDiff - 1.0) / 0.8;
        opacity = 0.78 * (1 - t * t);
      }
      const isVisible = opacity > 0.01;
      const zIndex = Math.round(50 - absDiff * 10);

      // Parallax mouse tilt
      const tiltX = parseFloat(card.getAttribute('data-tilt-x') || 0);
      const tiltY = parseFloat(card.getAttribute('data-tilt-y') || 0);

      // Clean CSS transform without calc() inside translate3d
      card.style.transform = `
        translate(-50%, -50%)
        translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px)
        rotateY(${rotY.toFixed(1)}deg)
        rotateX(${tiltX}deg)
        rotateZ(${(tiltY * 0.25).toFixed(1)}deg)
        scale(${scale.toFixed(3)})
      `;
      card.style.left = '50%';
      card.style.top = '50%';
      card.style.opacity = opacity.toFixed(3);
      card.style.visibility = isVisible ? 'visible' : 'hidden';
      card.style.zIndex = zIndex;

      // Active state class (center focused card)
      const isActive = absDiff < 0.45;
      card.classList.toggle('is-active', isActive);

      // Depth of field blur on background cards
      const blurAmount = Math.max(0, absDiff * 2.0 - 0.7);
      card.style.filter = blurAmount > 0.3 ? `blur(${blurAmount.toFixed(1)}px)` : 'none';
      card.style.pointerEvents = (isActive || (absDiff < 1.15 && opacity > 0.4)) ? 'auto' : 'none';
    });
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
  }
}
