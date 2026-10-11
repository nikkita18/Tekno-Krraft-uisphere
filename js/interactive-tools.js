// Tekno Krraft 2026 - Interactive Tools Suite
// 1. Campus Architectural Blueprint Navigator
// 2. Hack Sprint Prize Calculator & Squad Simulator
// 3. Floating Developer CLI Terminal (TK-SHELL)

import { SCHEDULE_DATA, TRACKS_DATA, PRIZE_POOL_BREAKDOWN } from './data.js';

export class InteractiveToolsSuite {
  constructor(appInstance) {
    this.app = appInstance;
    this.initCampusMap();
    this.initPrizeCalculator();
    this.initDeveloperCli();
    this.initCardSpotlightHover();
    this.initHolographicPassTilt();
  }

  /* ------------------------------------------------------------------------
     1. 3D HOLOGRAPHIC PASS TILT & FLIP
     ------------------------------------------------------------------------ */
  initHolographicPassTilt() {
    const card = document.getElementById('digitalPassCard');
    const container = card?.parentElement;
    if (!card || !container) return;

    let isFlipped = false;

    // Flip button
    const flipBtn = document.getElementById('flipPassBtn');
    flipBtn?.addEventListener('click', () => {
      isFlipped = !isFlipped;
      card.classList.toggle('flipped', isFlipped);
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'perspective(850px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.setProperty('--glare-opacity', '0');
      flipBtn.innerHTML = isFlipped 
        ? `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg> Flip to Front`
        : `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg> Flip Pass (Backside)`;
    });

    // 3D Mouse Parallax & Holographic Foil (works seamlessly on Front and Flipped Back Face)
    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -14;
      const rotateY = ((x - centerX) / centerX) * 14;

      card.style.transition = 'transform 0.08s ease-out';
      card.style.transform = `perspective(850px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
      
      // Update holographic foil reflection gradient angle & spotlight coordinates
      const glareAngle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
      card.style.setProperty('--glare-angle', `${glareAngle.toFixed(1)}deg`);
      card.style.setProperty('--glare-opacity', '0.88');
      card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
      card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    };

    const handleEnter = () => {
      card.style.transition = 'transform 0.12s ease-out';
    };

    const handleLeave = () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      card.style.transform = 'perspective(850px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.setProperty('--glare-opacity', '0');
    };

    card.addEventListener('mouseenter', handleEnter);
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
  }

  /* ------------------------------------------------------------------------
     2. CARD SPOTLIGHT HOVER (Cursor-following radial highlight)
     ------------------------------------------------------------------------ */
  initCardSpotlightHover() {
    const cards = document.querySelectorAll('.session-card, .feature-box, .speaker-card, .prize-card, .track-workbench, .venue-guide-box, .digital-pass-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });

    // Global ambient cursor spotlight
    let spotlight = document.querySelector('.cursor-spotlight');
    if (!spotlight) {
      spotlight = document.createElement('div');
      spotlight.className = 'cursor-spotlight';
      document.body.appendChild(spotlight);
    }
    window.addEventListener('mousemove', (e) => {
      spotlight.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     3. INTERACTIVE CAMPUS BLUEPRINT NAVIGATOR
     ------------------------------------------------------------------------ */
  initCampusMap() {
    const rooms = {
      'aud-101': {
        name: 'Main Auditorium (Auditorium 101)',
        zone: 'Central Academic Block • Floor 1',
        capacity: '800 Seats',
        reserved: '91%',
        currentEvent: 'Grand Opening Keynotes & Top 5 Stage Pitch',
        features: ['Dual 4K Laser Projection', 'Dolby Atmos Acoustics', 'VIP Delegation Pods'],
        wifi: 'ITER_GDG_5G_AUD • 450 Mbps'
      },
      'lab-302': {
        name: 'Bansuri Guru CS Lab 3 (Lab 302)',
        zone: 'Computer Science Wing • Floor 3',
        capacity: '120 High-Perf Workstations',
        reserved: '98%',
        currentEvent: 'Gemini 1.5 Pro & Vertex AI Hands-On Lab',
        features: ['Gigabit Ethernet Drops', 'Dual Monitor Setups', 'Direct Cloud Shell Sandbox'],
        wifi: 'ITER_LABS_GIG • 950 Mbps'
      },
      'sac-arena': {
        name: 'Student Activity Center (SAC) Arena',
        zone: 'Student Center • Ground Floor',
        capacity: '450 Hackers',
        reserved: '84%',
        currentEvent: '24-Hour AI/ML Hack Sprint Development Arena',
        features: ['Continuous Power Railing', 'Midnight Dev Fuel Lounge', 'Mentor Desk Stations'],
        wifi: 'ITER_HACK_DEDICATED • 1000 Mbps'
      },
      'sem-hall2': {
        name: 'Seminar Hall 2 (Building 4)',
        zone: 'Engineering Quad • Floor 2',
        capacity: '220 Seats',
        reserved: '76%',
        currentEvent: 'Cloud Run & Zero-Trust DevSecOps Talks',
        features: ['Interactive Q&A Podiums', 'Acoustic Wall Paneling', 'Live Screen Recording'],
        wifi: 'ITER_GDG_GUEST • 300 Mbps'
      }
    };

    const zoneButtons = document.querySelectorAll('.map-zone-btn, .campus-radar-pin');
    const displayBox = document.getElementById('mapLiveInspector');
    if (!displayBox) return;

    const renderRoom = (roomId) => {
      const data = rooms[roomId] || rooms['aud-101'];
      zoneButtons.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-room') === roomId);
      });

      displayBox.innerHTML = `
        <div style="display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid var(--border-hairline);padding-bottom:12px;">
          <div>
            <span class="tag tag-blue">${data.zone}</span>
            <h4 style="font-size:1.15rem;font-weight:700;color:var(--text-primary);margin-top:6px;">${data.name}</h4>
          </div>
          <span class="tag tag-green">ACTIVE ZONE</span>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;">
          <div style="background:var(--bg-primary);border:1px solid var(--border-hairline);padding:10px;border-radius:var(--radius-xs);">
            <span class="meta-label">Current / Key Program</span>
            <div style="font-size:0.85rem;font-weight:600;color:var(--text-primary);margin-top:4px;">${data.currentEvent}</div>
          </div>
          <div style="background:var(--bg-primary);border:1px solid var(--border-hairline);padding:10px;border-radius:var(--radius-xs);">
            <span class="meta-label">Capacity & Booking</span>
            <div style="font-size:0.85rem;font-weight:600;color:var(--accent-yellow);margin-top:4px;">${data.capacity} (${data.reserved} Booked)</div>
          </div>
        </div>

        <div style="margin-top:12px;">
          <span class="meta-label">Facility Amenities</span>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
            ${data.features.map(f => `<span class="tag">${f}</span>`).join('')}
            <span class="tag tag-green">${data.wifi}</span>
          </div>
        </div>
      `;
    };

    zoneButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const roomId = btn.getAttribute('data-room');
        renderRoom(roomId);
      });
    });

    renderRoom('aud-101');
  }

  /* ------------------------------------------------------------------------
     4. HACK SPRINT PRIZE & BOUNTY CALCULATOR
     ------------------------------------------------------------------------ */
  initPrizeCalculator() {
    const trackSelect = document.getElementById('calcTrackSelect');
    const sizeSelect = document.getElementById('calcTeamSize');
    const sliderTech = document.getElementById('calcSliderTech');
    const sliderUi = document.getElementById('calcSliderUi');
    const sliderImpact = document.getElementById('calcSliderImpact');

    const dispScore = document.getElementById('calcScoreDisplay');
    const dispBounty = document.getElementById('calcBountyDisplay');
    const dispShare = document.getElementById('calcShareDisplay');
    const dispBadge = document.getElementById('calcTierBadge');

    if (!sliderTech || !dispScore) return;

    const calculate = () => {
      const tech = parseInt(sliderTech.value, 10);
      const ui = parseInt(sliderUi.value, 10);
      const impact = parseInt(sliderImpact.value, 10);
      const size = parseInt(sizeSelect ? sizeSelect.value : 4, 10);

      // Rubric formula: 40% Tech + 35% UI + 25% Impact
      const totalScore = Math.round(tech * 0.4 + ui * 0.35 + impact * 0.25);
      dispScore.textContent = `${totalScore}/100`;

      let prizeAmount = 0;
      let tier = "Participant / Mentorship";
      let badgeClass = "tag";

      if (totalScore >= 92) {
        prizeAmount = 100000;
        tier = "Grand Champion Target";
        badgeClass = "tag tag-yellow";
      } else if (totalScore >= 82) {
        prizeAmount = 60000;
        tier = "First Runner-Up Target";
        badgeClass = "tag tag-blue";
      } else if (totalScore >= 72) {
        prizeAmount = 35000;
        tier = "Second Runner-Up Target";
        badgeClass = "tag tag-green";
      } else if (totalScore >= 60) {
        prizeAmount = 25000;
        tier = "Track Innovation Bounty";
        badgeClass = "tag tag-red";
      }

      const sharePerMember = Math.round(prizeAmount / size);

      if (dispBounty) dispBounty.textContent = `₹${prizeAmount.toLocaleString('en-IN')}`;
      if (dispShare) dispShare.textContent = `₹${sharePerMember.toLocaleString('en-IN')} / member`;
      if (dispBadge) {
        dispBadge.className = badgeClass;
        dispBadge.textContent = tier;
      }
    };

    [sliderTech, sliderUi, sliderImpact, sizeSelect, trackSelect].forEach(el => {
      el?.addEventListener('input', calculate);
    });

    calculate();
  }

  /* ------------------------------------------------------------------------
     5. FLOATING DEVELOPER CLI TERMINAL (TK-SHELL)
     ------------------------------------------------------------------------ */
  initDeveloperCli() {
    const triggerBtn = document.getElementById('cliTerminalTrigger');
    const terminalDrawer = document.getElementById('cliTerminalDrawer');
    const closeBtn = document.getElementById('closeCliTerminalBtn');
    const cliInput = document.getElementById('cliTerminalInput');
    const cliOutput = document.getElementById('cliTerminalOutput');

    if (!triggerBtn || !terminalDrawer) return;

    triggerBtn.addEventListener('click', () => {
      terminalDrawer.classList.toggle('open');
      if (terminalDrawer.classList.contains('open')) {
        cliInput?.focus();
      }
    });

    closeBtn?.addEventListener('click', () => {
      terminalDrawer.classList.remove('open');
    });

    const printLine = (text, type = 'normal') => {
      if (!cliOutput) return;
      const line = document.createElement('div');
      line.className = `cli-line cli-${type}`;
      line.textContent = text;
      cliOutput.appendChild(line);
      cliOutput.scrollTop = cliOutput.scrollHeight;
    };

    const processCommand = (cmd) => {
      const clean = cmd.trim().toLowerCase();
      printLine(`> ${cmd}`, 'prompt');

      if (!clean) return;

      const args = clean.split(/\s+/);
      const action = args[0];

      switch (action) {
        case 'help':
          printLine('Available Commands:', 'info');
          printLine('  help              - List all available terminal commands');
          printLine('  tracks            - Display the 4 technical specialization tracks');
          printLine('  schedule [day]    - List sessions for Day 1, 2, or 3 (e.g. "schedule 2")');
          printLine('  speakers          - List keynote speakers and leaders');
          printLine('  prizes            - View ₹2,50,000 Hack Sprint prize pool breakdown');
          printLine('  pass <name>       - Customize delegate badge in hero (e.g. "pass Jane")');
          printLine('  theme <dark|light>- Toggle interface visual system');
          printLine('  register          - Launch delegate registration modal');
          printLine('  clear             - Clear terminal display buffer');
          break;

        case 'tracks':
          printLine('TEKNO KRRAFT 2026 TRACKS:', 'info');
          TRACKS_DATA.forEach(t => {
            printLine(`• [${t.tag}] ${t.name} (${t.level})`);
          });
          break;

        case 'schedule':
          const dayNum = args[1] ? parseInt(args[1], 10) : 1;
          const sessions = SCHEDULE_DATA.filter(s => s.day === dayNum);
          printLine(`SCHEDULE DAY 0${dayNum} (${sessions.length} sessions):`, 'info');
          sessions.forEach(s => {
            printLine(`  [${s.code}] ${s.time} - ${s.title}`);
          });
          break;

        case 'speakers':
          printLine('KEYNOTE SPEAKERS & MENTORS:', 'info');
          printLine('• Dr. Ananya Patnaik (Principal Cloud Architect)');
          printLine('• Rohan Samal (Senior AI Research Engineer)');
          printLine('• Priyanka Mishra (Google Developer Expert - Flutter)');
          printLine('• Amitabh Swain (Staff Engineer, Atlassian)');
          break;

        case 'prizes':
          printLine('HACK SPRINT PRIZE BREAKDOWN (₹2,50,000 Total):', 'info');
          PRIZE_POOL_BREAKDOWN.forEach(p => {
            printLine(`• ${p.title}: ${p.amount}`);
          });
          break;

        case 'pass':
          const newName = args.slice(1).join(' ') || 'Alex Chen';
          const nameInput = document.getElementById('badgeNameInput');
          if (nameInput) {
            nameInput.value = newName;
            this.app.badgeGen?.updateBadge();
            printLine(`✓ Delegate badge updated to: ${newName}`, 'success');
            document.getElementById('digitalPassCard')?.scrollIntoView({ behavior: 'smooth' });
          }
          break;

        case 'theme':
          const targetTheme = args[1] === 'light' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', targetTheme);
          localStorage.setItem('tk26_theme', targetTheme);
          this.app.updateThemeIcon(targetTheme);
          printLine(`✓ Theme switched to: ${targetTheme.toUpperCase()}`, 'success');
          break;

        case 'register':
          document.getElementById('regModalBackdrop')?.classList.add('open');
          printLine('✓ Opened registration modal', 'success');
          break;

        case 'clear':
          if (cliOutput) cliOutput.innerHTML = '';
          break;

        default:
          printLine(`Command not recognized: "${action}". Type "help" for valid commands.`, 'error');
          break;
      }
    };

    cliInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = cliInput.value;
        cliInput.value = '';
        processCommand(val);
      }
    });

    // Quick chips in terminal header
    document.querySelectorAll('.cli-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) processCommand(cmd);
      });
    });
  }
}
