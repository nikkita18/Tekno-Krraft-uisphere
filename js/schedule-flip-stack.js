// ==========================================================================
// TEKNO KRRAFT 2026 - SCHEDULE 3D CASE STUDY FLIP STACK ENGINE
// Exact architectural implementation of Componentry Case Study Flip Stack:
// https://componentry.dev/docs/components/case-study-flip-stack
// Configured for Google Developer Group (GDG) @ SOA, ITER Chapter
// ==========================================================================

import { SPEAKERS_DATA } from './data.js';

export class ScheduleFlipStack {
  constructor(app, trackId = 'scheduleFlipTrack', stageId = 'scheduleFlipStage') {
    this.app = app;
    this.trackEl = document.getElementById(trackId);
    this.stageEl = document.getElementById(stageId);

    this.sessions = [];
    this.currentDay = 1;
    this.currentCategory = 'All';
    this.searchQuery = '';

    this.currentP = 0;
    this.targetP = 0;
    this.cards = [];
    this.activeIndex = 0;
    this.rafId = null;
    this.eventsBound = false;
    this.viewMode = 'stack'; // 'stack' | 'list'

    if (!this.trackEl || !this.stageEl) return;

    this.init();
  }

  init() {
    this.bindEvents();
    this.startLoop();
  }

  updateData(sessions, day = 1, category = 'All', query = '') {
    this.sessions = Array.isArray(sessions) ? sessions : [];
    this.currentDay = day;
    this.currentCategory = category;
    this.searchQuery = query;

    this.render();

    // Recalculate scroll
    const onScroll = this.getScrollProgress();
    this.currentP = onScroll;
    this.targetP = onScroll;
    this.updateCards(this.currentP);
  }

  render() {
    const total = this.sessions.length;

    // Update HUD Day Label
    const dayLabelEl = document.getElementById('scheduleHudDayLabel');
    if (dayLabelEl) {
      dayLabelEl.textContent = `Day 0${this.currentDay} Sessions Deck`;
    }

    // Set Total Counter in HUD
    const totalEl = document.getElementById('scheduleTotalNum');
    if (totalEl) {
      totalEl.textContent = String(total).padStart(2, '0');
    }

    // Empty state
    if (total === 0) {
      this.trackEl.style.height = 'auto';
      this.stageEl.innerHTML = `
        <div class="schedule-empty-card">
          <h4>No sessions match your search or filter</h4>
          <p>Try switching category or searching for terms like 'AI', 'Cloud', 'Keynote'.</p>
        </div>
      `;
      this.cards = [];
      return;
    }

    // Set scroll track height: (total + 1) * 75vh for fluid scrolling
    this.trackEl.style.height = `${(total + 1) * 75}vh`;

    // Visual palettes matching Google Developer ecosystem
    const themes = [
      { accent: '#4285f4', bg: '#0d1527', lightBg: '#f2f6ff', tagClass: 'tag-blue' },
      { accent: '#ea4335', bg: '#200d12', lightBg: '#fff2f2', tagClass: 'tag-red' },
      { accent: '#34a853', bg: '#0b1d12', lightBg: '#f0fdf4', tagClass: 'tag-green' },
      { accent: '#fbbc04', bg: '#1f1908', lightBg: '#fefce8', tagClass: 'tag-yellow' },
      { accent: '#a142f4', bg: '#180d24', lightBg: '#fbf2ff', tagClass: 'tag-blue' },
      { accent: '#24c1e0', bg: '#091c24', lightBg: '#effcff', tagClass: 'tag-green' }
    ];

    // Fallback track images
    const trackImages = {
      'Keynote': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      'Workshop': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      'Hackathon': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      'Talk': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
      'Competition': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      'Gaming/Fun': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      'General': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    };

    // Render cards in reverse order so Card 0 has the highest natural DOM stacking order
    this.stageEl.innerHTML = [...this.sessions].reverse().map((sess, revIdx) => {
      const idx = total - revIdx - 1;
      const theme = themes[idx % themes.length];
      const isSaved = this.app.itineraryMgr?.hasSession(sess.id);

      // Find matching speaker data for rich avatar in footer
      const matchedSpeaker = SPEAKERS_DATA.find(s => 
        sess.speaker && (s.name.toLowerCase().includes(sess.speaker.toLowerCase()) || sess.speaker.toLowerCase().includes(s.name.toLowerCase()))
      );

      const mediaImg = this.getSessionVisual(sess);
      const initials = sess.speaker ? sess.speaker.split(' ').map(n => n[0]).slice(0, 2).join('') : 'TK';

      return `
        <article class="schedule-flip-card" id="schedule-card-${sess.id}" data-index="${idx}">
          <div class="schedule-card-inner" style="--sched-accent:${theme.accent};--sched-bg:${theme.bg};--sched-bg-light:${theme.lightBg};">
            <div class="schedule-card-body">
              <div class="schedule-card-top-row">
                <span class="schedule-card-num">${String(idx + 1).padStart(2, '0')}</span>
                <div class="schedule-card-badges">
                  <span class="tag ${theme.tagClass}">${sess.category}</span>
                  <span class="tag">${sess.level}</span>
                  <span class="tag tag-yellow">Day 0${sess.day}</span>
                </div>
              </div>

              <div class="schedule-card-middle">
                <span class="schedule-card-eyebrow">DAY 0${sess.day} • ${sess.time}</span>
                <h3 class="schedule-card-title">${sess.title}</h3>
                <p class="schedule-card-desc">${sess.desc}</p>
              </div>

              <div class="schedule-meta-strip">
                <span class="schedule-meta-item">
                  <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>${sess.time}</span>
                </span>
                <span class="schedule-meta-item">
                  <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>${sess.venue}</span>
                </span>
                <span class="schedule-meta-item">
                  <span style="opacity:0.6;">CODE:</span> <strong>${sess.code}</strong>
                </span>
              </div>

              <div class="schedule-card-footer">
                <div class="schedule-card-speaker" data-speaker="${sess.speaker}" title="Click to view speaker dossier">
                  ${matchedSpeaker 
                    ? `<img src="${matchedSpeaker.avatar}" alt="${sess.speaker}" class="schedule-speaker-avatar-img" />`
                    : `<div class="schedule-speaker-avatar">${initials}</div>`
                  }
                  <div class="schedule-speaker-info">
                    <span class="schedule-speaker-name">${sess.speaker}</span>
                    <span class="schedule-speaker-role">${sess.speakerRole}</span>
                  </div>
                </div>

                <button class="schedule-bookmark-btn ${isSaved ? 'saved' : ''}" data-id="${sess.id}">
                  ${isSaved 
                    ? `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Saved` 
                    : `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Add to Plan`}
                </button>
              </div>
            </div>

            <div class="schedule-card-media">
              <img src="${mediaImg}" alt="${sess.title}" class="schedule-card-img" loading="eager" />
              <div class="schedule-card-media-overlay"></div>
              <div class="schedule-card-badge-pill">
                <span class="badge-dot" style="background:${theme.accent};"></span>
                <span>${sess.category.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Generate HUD navigation dots
    const dotsContainer = document.getElementById('scheduleFlipDots');
    if (dotsContainer) {
      dotsContainer.innerHTML = this.sessions.map((_, dotIdx) => `
        <button class="flip-dot ${dotIdx === 0 ? 'active' : ''}" data-index="${dotIdx}" aria-label="Jump to session ${dotIdx + 1}" title="Session ${dotIdx + 1}"></button>
      `).join('');

      dotsContainer.querySelectorAll('.flip-dot').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetIdx = parseInt(btn.getAttribute('data-index'), 10);
          this.scrollToCard(targetIdx);
        });
      });
    }

    // Cache Card Elements in normal order (0..total-1)
    this.cards = this.sessions.map((sess, idx) => {
      const article = document.getElementById(`schedule-card-${sess.id}`);
      const inner = article ? article.querySelector('.schedule-card-inner') : null;

      article?.addEventListener('click', (e) => {
        if (e.target.closest('button, a, .schedule-card-speaker')) return;
        if (article.classList.contains('is-folded')) {
          this.scrollToCard(idx);
        }
      });

      return { article, inner, index: idx, session: sess };
    });

    // Wire Bookmark Buttons
    this.stageEl.querySelectorAll('.schedule-bookmark-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.app.itineraryMgr?.toggleSession(id);
        const isSavedNow = this.app.itineraryMgr?.hasSession(id);
        btn.classList.toggle('saved', isSavedNow);
        btn.innerHTML = isSavedNow
          ? `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Saved`
          : `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Add to Plan`;
        if (this.app.soundSynth?.isEnabled) {
          this.app.soundSynth.playTap();
        }
      });
    });

    // Wire Speaker dossier clicks
    this.stageEl.querySelectorAll('.schedule-card-speaker').forEach(spWrap => {
      spWrap.addEventListener('click', (e) => {
        e.stopPropagation();
        const spName = spWrap.getAttribute('data-speaker');
        const match = SPEAKERS_DATA.find(s => 
          s.name.toLowerCase().includes(spName.toLowerCase()) || spName.toLowerCase().includes(s.name.toLowerCase())
        );
        if (match) this.app.openSpeakerModal(match);
      });
    });

    // Initial update
    this.updateCards(0);
  }

  getSessionVisual(sess) {
    const code = (sess.code || '').toUpperCase();
    const cat = (sess.category || '').toLowerCase();
    const title = (sess.title || '').toLowerCase();

    // AI & Machine Learning Labs
    if (code.includes('AI') || title.includes('gemini') || title.includes('agent') || title.includes('multimodal')) {
      return 'assets/images/track_ai_core.jpg';
    }
    // Cloud Infrastructure, Kubernetes & Security
    if (code.includes('OPS') || code.includes('SEC') || title.includes('cloud') || title.includes('kubernetes') || title.includes('security') || title.includes('zero-trust')) {
      return 'assets/images/track_cloud_infra.jpg';
    }
    // Web Systems & Architecture
    if (code.includes('WEB') || code.includes('SYS') || title.includes('design systems') || title.includes('distributed')) {
      return 'assets/images/track_web_systems.jpg';
    }
    // Mobile & Flutter
    if (code.includes('MOB') || title.includes('flutter') || title.includes('mobile')) {
      return 'assets/images/track_flutter_mobile.jpg';
    }
    // Hackathon, Coding Sprint & Finale
    if (code.includes('HACK') || cat === 'hackathon' || title.includes('sprint') || title.includes('code freeze')) {
      return 'assets/images/hackathon_trophy_stage.jpg';
    }
    // Keynotes, Grand Opening & Valedictory
    if (cat === 'keynote' || title.includes('opening') || title.includes('valedictory') || title.includes('awards')) {
      return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
    }
    // Check-In, Registration & Labs
    if (code.includes('REG') || title.includes('check-in') || title.includes('badge')) {
      return 'assets/images/innovators_coding_lab.jpg';
    }
    // Algorithmic Battles / Coding Competition
    if (cat === 'competition' || title.includes('battleground')) {
      return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
    }
    // Gaming & Synthwave Chill
    if (cat.includes('fun') || cat.includes('gaming') || title.includes('synthwave')) {
      return 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80';
    }
    // General / Campus Panels & Mixers
    if (title.includes('panel') || title.includes('mixer')) {
      return 'assets/images/campus_isometric_map.jpg';
    }

    return 'assets/images/innovators_coding_lab.jpg';
  }

  getScrollProgress() {
    if (!this.trackEl || this.cards.length === 0) return 0;
    const rect = this.trackEl.getBoundingClientRect();
    const scrollable = this.trackEl.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;

    if (scrollable <= 0) return 0;
    if (scrolled <= 0) return 0;
    if (scrolled >= scrollable) return 1;
    return scrolled / scrollable;
  }

  bindEvents() {
    if (this.eventsBound) return;
    this.eventsBound = true;

    // Scroll progress handler
    const onScroll = () => {
      if (this.viewMode !== 'stack') return;
      this.targetP = this.getScrollProgress();
      this.currentP = this.targetP;
      this.updateCards(this.currentP);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // HUD Prev / Next buttons
    const prevBtn = document.getElementById('schedulePrevBtn');
    const nextBtn = document.getElementById('scheduleNextBtn');

    prevBtn?.addEventListener('click', () => {
      const prevIdx = Math.max(0, this.activeIndex - 1);
      this.scrollToCard(prevIdx);
    });

    nextBtn?.addEventListener('click', () => {
      const nextIdx = Math.min(this.cards.length - 1, this.activeIndex + 1);
      this.scrollToCard(nextIdx);
    });

    // Wheel scrub assist inside sticky frame
    const frame = this.trackEl.querySelector('.schedule-flip-sticky-frame');
    if (frame) {
      frame.addEventListener('wheel', (e) => {
        const rect = this.trackEl.getBoundingClientRect();
        if (rect.top <= 20 && rect.bottom >= window.innerHeight - 20) {
          window.scrollBy({ top: e.deltaY, behavior: 'auto' });
        }
      }, { passive: true });
    }

    // View Mode Toggle (3D Flip Stack vs Timeline List)
    const modeToggle = document.getElementById('scheduleViewModeToggle');
    if (modeToggle) {
      modeToggle.querySelectorAll('.view-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.getAttribute('data-mode');
          this.setViewMode(mode);
        });
      });
    }
  }

  setViewMode(mode) {
    this.viewMode = mode;
    const track = document.getElementById('scheduleFlipTrack');
    const listContainer = document.getElementById('scheduleTimelineContainer');
    const toggleBtns = document.querySelectorAll('#scheduleViewModeToggle .view-mode-btn');

    toggleBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-mode') === mode);
    });

    if (mode === 'list') {
      if (track) track.style.display = 'none';
      if (listContainer) listContainer.style.display = 'block';
    } else {
      if (track) track.style.display = 'block';
      if (listContainer) listContainer.style.display = 'none';
      this.updateCards(this.currentP);
    }
  }

  startLoop() {
    const loop = () => {
      if (this.viewMode === 'stack' && this.cards.length > 0) {
        this.currentP += (this.targetP - this.currentP) * 0.16;
        this.updateCards(this.currentP);
      }
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  updateCards(progress) {
    if (!this.cards || this.cards.length === 0) return;
    const p = (typeof progress === 'number' && !isNaN(progress)) ? Math.max(0, Math.min(progress, 1)) : 0;

    const total = this.cards.length;
    const segment = 1 / Math.max(total, 1);

    // Active Card index
    const activeIdx = Math.min(Math.floor(p / segment), total - 1);
    this.activeIndex = activeIdx;

    // Update HUD Counter & Fill
    const currentNumEl = document.getElementById('scheduleCurrentNum');
    const fillEl = document.getElementById('scheduleProgressFill');
    const dotsContainer = document.getElementById('scheduleFlipDots');

    if (currentNumEl) {
      currentNumEl.textContent = String(activeIdx + 1).padStart(2, '0');
    }
    if (fillEl) {
      fillEl.style.width = `${(p * 100).toFixed(1)}%`;
    }
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.flip-dot').forEach((dot, dIdx) => {
        dot.classList.toggle('active', dIdx === activeIdx);
      });
    }

    // Componentry Flip Stack Math
    this.cards.forEach((cardObj, index) => {
      const { article, inner } = cardObj;
      if (!article || !inner) return;

      const start = index * segment;
      const end = Math.min(start + segment, 1);
      const entryStart = Math.max(0, start - segment);
      const entryEnd = index === 0 ? 0.0001 : Math.min(start, entryStart + segment * 0.7);

      const exitStart = start;
      const exitEnd = end;
      const restingOffset = Math.min(index * 12, 30);
      const restingScale = 1 - Math.min(index * 0.012, 0.035);

      // Entry Transform (resting underneath until active)
      let entryY = 0;
      let entryScale = 1;

      if (index !== 0) {
        if (p <= entryStart) {
          entryY = restingOffset;
          entryScale = restingScale;
        } else if (p >= entryEnd) {
          entryY = 0;
          entryScale = 1;
        } else {
          const tEntry = (p - entryStart) / (entryEnd - entryStart);
          entryY = restingOffset * (1 - tEntry);
          entryScale = restingScale + tEntry * (1 - restingScale);
        }
      }

      // Exit Transform (3D upward flip fold: rotateX 0 -> 20deg, translateY 0 -> -105%, solid opaque fold)
      let exitYPercent = 0;
      let rotateX = 0;
      let opacity = 1;
      let visibility = 'visible';

      if (p <= exitStart) {
        exitYPercent = 0;
        rotateX = 0;
        opacity = 1;
        visibility = 'visible';
      } else if (p >= exitEnd) {
        exitYPercent = -105;
        rotateX = 20;
        opacity = 0;
        visibility = 'hidden';
      } else {
        const tExit = (p - exitStart) / (exitEnd - exitStart);
        // Smooth cubic ease: t * t * (3 - 2 * t)
        const tEase = tExit * tExit * (3 - 2 * tExit);
        exitYPercent = -105 * tEase;
        rotateX = 20 * tEase;
        opacity = 1;
        visibility = 'visible';
      }

      // Apply 3D matrix and depth styling (Independent 2D composite layers prevent depth slicing)
      article.style.transform = `translate3d(0, ${exitYPercent.toFixed(2)}%, 0) rotateX(${rotateX.toFixed(2)}deg)`;
      article.style.zIndex = total - index;
      article.style.opacity = opacity;
      article.style.visibility = visibility;
      article.style.pointerEvents = (opacity < 0.1) ? 'none' : 'auto';

      inner.style.transform = `translate3d(0, ${entryY.toFixed(1)}px, 0) scale(${entryScale.toFixed(4)})`;
    });
  }

  scrollToCard(index) {
    if (!this.trackEl || this.cards.length === 0) return;
    const segment = 1 / Math.max(this.cards.length, 1);
    const targetP = Math.min((index + 0.05) * segment, 1);

    const rect = this.trackEl.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const scrollable = this.trackEl.offsetHeight - window.innerHeight;
    const targetScrollY = trackTop + targetP * scrollable;

    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
