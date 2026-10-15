// Tekno Krraft 2026 - Web Audio Synthesizer
// Clean, tactile acoustic feedback using native AudioContext (zero external audio assets)

export class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isEnabled = false;
    this.toggleBtn = document.getElementById('soundToggleBtn');
    this.init();
  }

  init() {
    const saved = localStorage.getItem('tk26_sound');
    this.isEnabled = saved === 'true';
    this.updateIcon();

    // Store on window so sphere canvas and other tools can invoke sound
    window._soundSynth = this;

    this.toggleBtn?.addEventListener('click', () => {
      this.isEnabled = !this.isEnabled;
      localStorage.setItem('tk26_sound', String(this.isEnabled));
      this.updateIcon();
      if (this.isEnabled) {
        this.ensureContext();
        this.playChime();
      }
    });

    // Attach delegated acoustic feedback to interactive buttons
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, .nav-link, .day-tab-btn, .filter-chip, .track-nav-item, .sphere-mode-btn');
      if (target && this.isEnabled && target !== this.toggleBtn) {
        this.playClick();
      }
    });
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {}
  }

  playWhoosh() {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {}
  }

  playChime() {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
      frequencies.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.07, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {}
  }

  updateIcon() {
    if (!this.toggleBtn) return;
    if (this.isEnabled) {
      this.toggleBtn.innerHTML = `
        <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      `;
      this.toggleBtn.title = "Audio Feedback: ON (Click to mute)";
      this.toggleBtn.classList.add('active');
    } else {
      this.toggleBtn.innerHTML = `
        <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      `;
      this.toggleBtn.title = "Audio Feedback: OFF (Click to unmute)";
      this.toggleBtn.classList.remove('active');
    }
  }
}
