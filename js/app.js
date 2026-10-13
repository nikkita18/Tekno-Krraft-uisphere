// Tekno Krraft 2026 - Master Application Controller
// Google Developer Group (GDG) @ SOA, ITER Chapter

import { FEST_METRICS, TRACKS_DATA, SPEAKERS_DATA, SCHEDULE_DATA, PRIZE_POOL_BREAKDOWN, FAQS_DATA, SPONSORS_DATA } from './data.js';
import { BadgeGenerator } from './badge-generator.js';
import { ItineraryManager } from './itinerary.js';
import { UiSphereCanvas } from './sphere-canvas.js';
import { SoundSynthesizer } from './sound-effects.js';
import { InteractiveToolsSuite } from './interactive-tools.js?v=2.8';
import { RadiantAssistant } from './radiant-assistant.js';
import { AnimatedTopDock } from '../src/shaders/animated-top-dock/AnimatedTopDock.js';

class TeknoKrraftApp {
  constructor() {
    this.currentDay = 1;
    this.currentCategory = 'All';
    this.searchQuery = '';
    this.selectedTrackId = 'ai-ml';

    this.badgeGen = null;
    this.itineraryMgr = null;
    this.sphereCanvas = null;
    this.soundSynth = null;
    this.toolsSuite = null;
    this.radiantAssistant = null;
    this.topDock = null;

    this.init();
  }

  init() {
    // 0. Animated Top Dock (ThreeUI Command Bar Modern Variant - Exact Authored Source)
    this.topDock = new AnimatedTopDock('#topDockHost', {
      variant: 'modern',
      proximity: 122,
      spring: 0.19,
      damping: 0.70,
      widthGrowth: 17,
      heightGrowth: 16,
      drop: 3.5,
    });

    // 1. Theme Manager
    this.initTheme();

    // 2. Event Launch Countdown Timer (Oct 16, 2026, 09:30 AM IST)
    this.initCountdown();

    // 3. Audio Synthesizer & 3D Interactive Canvas
    this.soundSynth = new SoundSynthesizer();
    this.sphereCanvas = new UiSphereCanvas('uiSphereHeroCanvas');

    // 4. Radiant Gemini Prompt Input Assistant
    this.radiantAssistant = new RadiantAssistant();

    // 5. Delegate Pass Customizer & Itinerary Manager
    this.badgeGen = new BadgeGenerator();
    this.itineraryMgr = new ItineraryManager(SCHEDULE_DATA);

    // 6. Dynamic Festival Sections
    this.renderTracksWorkbench();
    this.renderSchedule();
    this.renderSpeakers();
    this.renderPrizes();
    this.renderFaqs();
    this.renderSponsors();

    // 7. Interactive Tools (3D Pass Tilt, Card Spotlight, Campus Blueprint, Prize Calculator, CLI Shell)
    this.toolsSuite = new InteractiveToolsSuite(this);

    // 8. Navigation & Modal Listeners
    this.setupNavigation();
    this.setupScheduleControls();
    this.setupModals();
    this.setupRegistrationFlow();

    // Sync saved session states
    this.itineraryMgr.syncSessionButtons();
  }

  /* ------------------------------------------------------------------------
     1. THEME MANAGER
     ------------------------------------------------------------------------ */
  initTheme() {
    const savedTheme = localStorage.getItem('tk26_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    toggleBtn?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('tk26_theme', next);
      this.updateThemeIcon(next);
      if (this.soundSynth?.isEnabled) {
        this.soundSynth.playChime();
      }
    });
  }

  updateThemeIcon(theme) {
    const toggleBtn = document.getElementById('themeToggleBtn');
    if (!toggleBtn) return;
    if (theme === 'light') {
      toggleBtn.innerHTML = `
        <svg class="svg-icon" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      `;
      toggleBtn.setAttribute('title', 'Switch to Obsidian Dark Mode');
    } else {
      toggleBtn.innerHTML = `
        <svg class="svg-icon" viewBox="0 0 24 24">
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
      `;
      toggleBtn.setAttribute('title', 'Switch to Gallery Light Mode');
    }
  }

  /* ------------------------------------------------------------------------
     2. COUNTDOWN TIMER
     ------------------------------------------------------------------------ */
  initCountdown() {
    const eventDate = new Date('2026-10-16T09:30:00+05:30').getTime();

    const elDays = document.getElementById('cdDays');
    const elHours = document.getElementById('cdHours');
    const elMins = document.getElementById('cdMins');
    const elSecs = document.getElementById('cdSecs');

    const tick = () => {
      const now = new Date().getTime();
      let diff = eventDate - now;

      if (diff <= 0) {
        if (elDays) elDays.textContent = "00";
        if (elHours) elHours.textContent = "00";
        if (elMins) elMins.textContent = "00";
        if (elSecs) elSecs.textContent = "00";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n) => String(n).padStart(2, '0');

      if (elDays) elDays.textContent = pad(days);
      if (elHours) elHours.textContent = pad(hours);
      if (elMins) elMins.textContent = pad(minutes);
      if (elSecs) elSecs.textContent = pad(seconds);
    };

    tick();
    setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------------
     3. NAVIGATION & MOBILE DRAWER
     ------------------------------------------------------------------------ */
  setupNavigation() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');

    mobileBtn?.addEventListener('click', () => {
      mobileDrawer?.classList.toggle('open');
      const isOpen = mobileDrawer?.classList.contains('open');
      mobileBtn.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer?.classList.remove('open');
        mobileBtn?.setAttribute('aria-expanded', 'false');
      });
    });

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const link = document.querySelector(`.desktop-nav a[href*="${sectionId}"]`);
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link?.classList.add('active');
        } else {
          link?.classList.remove('active');
        }
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     4. SPECIALIZATION TRACKS WORKBENCH
     ------------------------------------------------------------------------ */
  renderTracksWorkbench() {
    const navContainer = document.getElementById('trackNavList');
    const detailContainer = document.getElementById('trackDetailPanel');
    if (!navContainer || !detailContainer) return;

    navContainer.innerHTML = TRACKS_DATA.map(trk => `
      <button class="track-nav-item ${trk.id === this.selectedTrackId ? 'active' : ''}" data-id="${trk.id}" style="--track-accent:${trk.accentColor};">
        <div class="track-nav-icon-badge">${trk.icon}</div>
        <div class="track-nav-meta">
          <div class="track-nav-tags-row">
            <span class="track-item-code">${trk.tag}</span>
            <span class="track-item-badge">${trk.pillLabel}</span>
          </div>
          <span class="track-item-name">${trk.name}</span>
        </div>
      </button>
    `).join('');

    navContainer.querySelectorAll('.track-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.selectedTrackId = id;
        this.renderTracksWorkbench();
      });
    });

    const activeTrack = TRACKS_DATA.find(t => t.id === this.selectedTrackId) || TRACKS_DATA[0];

    detailContainer.innerHTML = `
      <!-- Hero Visual Track Banner with 3D Artwork -->
      <div class="track-hero-visual-card">
        <div class="track-hero-img-wrap">
          <img src="${activeTrack.image}" alt="${activeTrack.name}" class="track-hero-cover-img" loading="lazy" />
          <div class="track-hero-gradient-overlay"></div>
        </div>
        <div class="track-hero-content">
          <div class="track-hero-badges-row">
            <span class="tag tag-glow-blue">${activeTrack.tag}</span>
            <span class="tag tag-glow-yellow">${activeTrack.level}</span>
            <span class="tag tag-glass">⏱ ${activeTrack.duration}</span>
          </div>
          <h3 class="track-hero-title">${activeTrack.name}</h3>
          <div class="track-hero-lead-bar">
            <span class="lead-avatar-icon">${activeTrack.icon}</span>
            <span>Curated & Mentored by: <strong>${activeTrack.lead}</strong></span>
          </div>
        </div>
      </div>

      <div class="track-summary-highlight">
        <p class="track-detail-summary">${activeTrack.summary}</p>
      </div>

      <div class="track-curriculum-section">
        <div class="section-subheading-row">
          <span class="meta-label">CURRICULUM MODULES & PRACTICAL SESSIONS</span>
          <span class="track-modules-count">3 Intensive Modules</span>
        </div>
        <div class="track-modules-visual-grid">
          ${activeTrack.modules.map((m, i) => `
            <div class="track-module-card">
              <div class="module-card-header">
                <span class="module-number-pill">0${i + 1}</span>
                <h4 class="module-card-title">${m.title}</h4>
              </div>
              <p class="module-card-desc">${m.desc}</p>
              <div class="module-status-chip">
                <span class="module-live-dot"></span>
                <span>Production Lab & Hands-on Sandbox</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="track-meta-two-column">
        <div class="track-deliverable-card">
          <div class="deliverable-header">
            <span class="deliverable-icon">🚀</span>
            <div>
              <span class="meta-label">CAPSTONE LAB DELIVERABLE</span>
              <h4 class="deliverable-title">Verified Production Shipment</h4>
            </div>
          </div>
          <p class="deliverable-desc">${activeTrack.deliverable}</p>
          <div class="deliverable-badge-strip">
            <span class="tag tag-green">✓ Evaluated by Google Mentors</span>
            <span class="tag tag-blue">✓ Cloud Deployed</span>
          </div>
        </div>

        <div class="track-stack-card">
          <div class="stack-header">
            <span class="stack-icon">⚡</span>
            <div>
              <span class="meta-label">TOOLCHAIN & ECOSYSTEM</span>
              <h4 class="stack-title">Technologies Mastered</h4>
            </div>
          </div>
          <div class="tools-pills-wrap">
            ${activeTrack.tools.map(tool => `
              <span class="tech-chip">
                <span class="tech-dot" style="background:${activeTrack.accentColor};"></span>
                <span>${tool}</span>
              </span>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="track-prereqs-box">
        <span class="track-prereqs-title">Prerequisites & Recommended Background</span>
        <div class="prereq-pill-group">
          ${activeTrack.prerequisites.map(p => `
            <span class="prereq-pill"><span style="color:var(--accent-blue);margin-right:4px;">▸</span>${p}</span>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ------------------------------------------------------------------------
     5. 3-DAY INTERACTIVE SCHEDULE
     ------------------------------------------------------------------------ */
  setupScheduleControls() {
    document.querySelectorAll('.day-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.day-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentDay = parseInt(btn.getAttribute('data-day'), 10);
        this.renderSchedule();
      });
    });

    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentCategory = chip.getAttribute('data-category');
        this.renderSchedule();
      });
    });

    const searchInput = document.getElementById('scheduleSearchInput');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderSchedule();
    });
  }

  renderSchedule() {
    const listEl = document.getElementById('scheduleTimelineList');
    const counterEl = document.getElementById('scheduleCountMeta');
    if (!listEl) return;

    const filtered = SCHEDULE_DATA.filter(item => {
      const matchDay = item.day === this.currentDay;
      const matchCategory = this.currentCategory === 'All' || item.category === this.currentCategory;
      const matchSearch = !this.searchQuery || 
        item.title.toLowerCase().includes(this.searchQuery) ||
        item.desc.toLowerCase().includes(this.searchQuery) ||
        item.speaker.toLowerCase().includes(this.searchQuery) ||
        item.venue.toLowerCase().includes(this.searchQuery) ||
        item.code.toLowerCase().includes(this.searchQuery);

      return matchDay && matchCategory && matchSearch;
    });

    if (counterEl) {
      counterEl.textContent = `Displaying ${filtered.length} session${filtered.length === 1 ? '' : 's'} on Day 0${this.currentDay}`;
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="background:var(--bg-surface);border:1px solid var(--border-hairline);border-radius:var(--radius-sm);padding:40px 20px;text-align:center;">
          <p style="font-family:var(--font-mono);font-size:0.9rem;color:var(--text-primary);font-weight:600;">No sessions match your search or filter</p>
          <p style="font-size:0.8rem;color:var(--text-muted);margin-top:6px;">Try adjusting the category filter or searching for another term like 'AI', 'Cloud', 'Keynote'.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(s => {
      const isSaved = this.itineraryMgr?.hasSession(s.id);
      const tagClass = s.accent === 'blue' ? 'tag-blue' : s.accent === 'red' ? 'tag-red' : s.accent === 'yellow' ? 'tag-yellow' : s.accent === 'green' ? 'tag-green' : '';

      return `
        <div class="session-card" id="card-${s.id}">
          <div class="session-time-block">
            <span class="session-code">${s.code}</span>
            <span class="session-time">${s.time}</span>
            <div class="session-venue">
              <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${s.venue}</span>
            </div>
          </div>

          <div class="session-main-body">
            <div class="session-badges-row">
              <span class="tag ${tagClass}">${s.category}</span>
              <span class="tag">${s.level}</span>
            </div>
            <h4 class="session-title">${s.title}</h4>
            <p class="session-desc">${s.desc}</p>
            <div class="session-speaker-info">
              <span class="speaker-avatar-dot">${s.speaker.split(' ').map(n=>n[0]).slice(0,2).join('')}</span>
              <span class="speaker-name-clickable" data-speaker="${s.speaker}">${s.speaker}</span>
              <span class="speaker-role-tag">• ${s.speakerRole}</span>
            </div>
          </div>

          <div class="session-actions">
            <button class="bookmark-btn ${isSaved ? 'saved' : ''}" data-id="${s.id}">
              ${isSaved 
                ? `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Saved` 
                : `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Add to Plan`}
            </button>
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.itineraryMgr?.toggleSession(id);
      });
    });

    listEl.querySelectorAll('.speaker-name-clickable').forEach(el => {
      el.addEventListener('click', () => {
        const speakerName = el.getAttribute('data-speaker');
        const match = SPEAKERS_DATA.find(s => s.name.toLowerCase().includes(speakerName.toLowerCase()) || speakerName.toLowerCase().includes(s.name.toLowerCase()));
        if (match) this.openSpeakerModal(match);
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. SPEAKERS DIRECTORY
     ------------------------------------------------------------------------ */
  renderSpeakers() {
    const grid = document.getElementById('speakersGrid');
    if (!grid) return;

    grid.innerHTML = SPEAKERS_DATA.map(sp => `
      <div class="speaker-card" data-speaker-id="${sp.id}">
        <div class="speaker-card-header">
          <img src="${sp.avatar}" alt="${sp.name}" class="speaker-img" loading="lazy" />
          <div class="speaker-headings">
            <h4 class="speaker-name">${sp.name}</h4>
            <span class="speaker-role">${sp.role}</span>
            <span class="speaker-org">${sp.org}</span>
          </div>
        </div>
        <div style="display:flex;gap:6px;">
          <span class="tag tag-blue">${sp.track}</span>
          <span class="tag tag-yellow">${sp.badge}</span>
        </div>
        <p class="speaker-bio-preview">${sp.bio}</p>
        <div class="speaker-card-footer">
          <span>View Dossier & Sessions</span>
          <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.speaker-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-speaker-id');
        const sp = SPEAKERS_DATA.find(s => s.id === id);
        if (sp) this.openSpeakerModal(sp);
      });
    });
  }

  openSpeakerModal(sp) {
    const backdrop = document.getElementById('speakerModalBackdrop');
    const content = document.getElementById('speakerModalContent');
    if (!backdrop || !content) return;

    content.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:18px;">
        <img src="${sp.avatar}" alt="${sp.name}" style="width:72px;height:72px;border-radius:var(--radius-xs);object-fit:cover;border:1px solid var(--border-hairline);" />
        <div style="display:flex;flex-direction:column;gap:3px;">
          <h3 style="font-size:1.3rem;font-weight:800;color:var(--text-primary);">${sp.name}</h3>
          <span style="font-family:var(--font-mono);font-size:0.78rem;color:var(--accent-blue);font-weight:600;">${sp.role}</span>
          <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);">${sp.org}</span>
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-top:4px;">
        <span class="tag tag-blue">${sp.track}</span>
        <span class="tag tag-yellow">${sp.badge}</span>
      </div>

      <div>
        <span class="meta-label">Biography</span>
        <p style="font-size:0.88rem;color:var(--text-secondary);line-height:1.65;margin-top:4px;">${sp.bio}</p>
      </div>

      <div>
        <span class="meta-label">Scheduled Keynotes & Sessions</span>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px;">
          ${sp.sessions.map(sTitle => `
            <div style="background:var(--bg-primary);border:1px solid var(--border-hairline);border-radius:var(--radius-xs);padding:12px;font-size:0.85rem;color:var(--text-primary);font-weight:600;">
              ${sTitle}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /* ------------------------------------------------------------------------
     7. HACK SPRINT PRIZES
     ------------------------------------------------------------------------ */
  renderPrizes() {
    const container = document.getElementById('prizesGrid');
    if (!container) return;

    container.innerHTML = PRIZE_POOL_BREAKDOWN.map((p, i) => `
      <div class="prize-card ${i === 0 ? 'grand-champ' : ''} ${i < 3 ? 'podium-tier' : 'specialist-tier'}">
        <div class="prize-podium-header">
          <span class="prize-rank-chip">${p.rank}</span>
          <span class="prize-trophy-emoji">${p.icon}</span>
        </div>
        <div class="prize-body">
          <div class="prize-title-wrap">
            <h3 class="prize-title">${p.title}</h3>
            <span class="prize-badge-tag">${p.badge}</span>
          </div>
          <div class="prize-amount-wrap">
            <span class="prize-amount">${p.amount}</span>
            <span class="prize-currency-sub">Guaranteed Bounty</span>
          </div>
          <div class="prize-perks-list">
            ${p.perks.map(perk => `
              <div class="prize-perk-item">
                <svg class="perk-check-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${perk}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ------------------------------------------------------------------------
     8. FAQS & SPONSORS
     ------------------------------------------------------------------------ */
  renderFaqs() {
    const list = document.getElementById('faqList');
    if (!list) return;

    list.innerHTML = FAQS_DATA.map(item => `
      <details class="faq-item">
        <summary class="faq-summary">
          <span>${item.q}</span>
          <span class="faq-indicator">+</span>
        </summary>
        <div class="faq-content">${item.a}</div>
      </details>
    `).join('');
  }

  renderSponsors() {
    const grid = document.getElementById('sponsorsGrid');
    if (!grid) return;

    grid.innerHTML = SPONSORS_DATA.map(s => `
      <div class="sponsor-box">
        <span class="sponsor-name">${s.name}</span>
        <span class="sponsor-tier">${s.tier}</span>
      </div>
    `).join('');
  }

  /* ------------------------------------------------------------------------
     9. MODALS & REGISTRATION FLOW
     ------------------------------------------------------------------------ */
  setupModals() {
    const speakerBackdrop = document.getElementById('speakerModalBackdrop');
    const closeSpeakerBtn = document.getElementById('closeSpeakerModalBtn');
    const regBackdrop = document.getElementById('regModalBackdrop');

    const closeAllModals = () => {
      speakerBackdrop?.classList.remove('open');
      regBackdrop?.classList.remove('open');
      document.body.style.overflow = '';
    };

    closeSpeakerBtn?.addEventListener('click', closeAllModals);

    speakerBackdrop?.addEventListener('click', (e) => {
      if (e.target === speakerBackdrop) closeAllModals();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
        this.itineraryMgr?.closeDrawer();
      }
    });
  }

  setupRegistrationFlow() {
    const regBackdrop = document.getElementById('regModalBackdrop');
    const regOpenBtns = document.querySelectorAll('.open-reg-modal-btn');
    const regCloseBtn = document.getElementById('closeRegModalBtn');

    regOpenBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.itineraryMgr?.closeDrawer();
        regBackdrop?.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    regCloseBtn?.addEventListener('click', () => {
      regBackdrop?.classList.remove('open');
      document.body.style.overflow = '';
    });

    regBackdrop?.addEventListener('click', (e) => {
      if (e.target === regBackdrop) {
        regBackdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    const step1 = document.getElementById('regStep1');
    const step2 = document.getElementById('regStep2');
    const step3 = document.getElementById('regStep3');
    const nextBtn1 = document.getElementById('regNextBtn1');
    const backBtn2 = document.getElementById('regBackBtn2');
    const form = document.getElementById('registrationForm');

    nextBtn1?.addEventListener('click', () => {
      step1.style.display = 'none';
      step2.style.display = 'flex';
      document.getElementById('stepInd1')?.classList.replace('active', 'done');
      document.getElementById('stepInd2')?.classList.add('active');
    });

    backBtn2?.addEventListener('click', () => {
      step2.style.display = 'none';
      step1.style.display = 'flex';
      document.getElementById('stepInd1')?.classList.replace('done', 'active');
      document.getElementById('stepInd2')?.classList.remove('active');
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regNameInput')?.value || "Aditya Sharma";
      
      const badgeInput = document.getElementById('badgeNameInput');
      if (badgeInput) {
        badgeInput.value = name;
        this.badgeGen?.updateBadge();
      }

      step2.style.display = 'none';
      step3.style.display = 'flex';
      document.getElementById('stepInd2')?.classList.replace('active', 'done');
      document.getElementById('stepInd3')?.classList.add('active');

      const confirmedName = document.getElementById('regConfirmedName');
      if (confirmedName) confirmedName.textContent = name;
    });

    document.getElementById('regDoneBtn')?.addEventListener('click', () => {
      regBackdrop?.classList.remove('open');
      document.body.style.overflow = '';
      document.getElementById('digitalPassCard')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TeknoKrraftApp();
});
