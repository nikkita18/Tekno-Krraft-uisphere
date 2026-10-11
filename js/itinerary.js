// Tekno Krraft 2026 - Itinerary & Calendar Export System
// Manages local persistence and RFC 5545 compliant .ics export

export class ItineraryManager {
  constructor(allSessions) {
    this.allSessions = allSessions;
    this.storageKey = 'tk26_saved_sessions';
    this.savedIds = new Set(this.loadSavedIds());

    this.drawerBackdrop = document.getElementById('itineraryBackdrop');
    this.drawerEl = document.getElementById('itineraryDrawer');
    this.drawerBody = document.getElementById('itineraryDrawerBody');
    this.toggleBtns = document.querySelectorAll('.itinerary-toggle-btn');
    this.closeBtn = document.getElementById('closeItineraryBtn');
    this.clearBtn = document.getElementById('clearItineraryBtn');
    this.exportBtn = document.getElementById('exportIcsBtn');
    this.badgeCounts = document.querySelectorAll('.itinerary-btn-badge');

    this.init();
  }

  loadSavedIds() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.savedIds)));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }

  init() {
    this.updateBadges();

    this.toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => this.openDrawer());
    });

    this.closeBtn?.addEventListener('click', () => this.closeDrawer());
    this.drawerBackdrop?.addEventListener('click', () => this.closeDrawer());

    this.clearBtn?.addEventListener('click', () => {
      if (confirm("Remove all saved sessions from your itinerary?")) {
        this.savedIds.clear();
        this.saveToStorage();
        this.renderDrawer();
        this.updateBadges();
        this.syncSessionButtons();
      }
    });

    this.exportBtn?.addEventListener('click', () => this.exportIcsCalendar());
  }

  toggleSession(sessionId) {
    if (this.savedIds.has(sessionId)) {
      this.savedIds.delete(sessionId);
    } else {
      this.savedIds.add(sessionId);
    }
    this.saveToStorage();
    this.updateBadges();
    this.renderDrawer();
    this.syncSessionButtons();
  }

  hasSession(sessionId) {
    return this.savedIds.has(sessionId);
  }

  openDrawer() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
    this.renderDrawer();
    this.drawerEl?.classList.add('open');
    this.drawerBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeDrawer() {
    this.drawerEl?.classList.remove('open');
    this.drawerBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  updateBadges() {
    const count = this.savedIds.size;
    this.badgeCounts.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  syncSessionButtons() {
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
      const id = btn.getAttribute('data-id');
      if (this.savedIds.has(id)) {
        btn.classList.add('saved');
        btn.innerHTML = `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Saved`;
      } else {
        btn.classList.remove('saved');
        btn.innerHTML = `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Add to Plan`;
      }
    });
  }

  renderDrawer() {
    if (!this.drawerBody) return;
    const savedList = this.allSessions.filter(s => this.savedIds.has(s.id));

    if (savedList.length === 0) {
      this.drawerBody.innerHTML = `
        <div class="empty-itinerary-state">
          <svg class="svg-icon" style="width:40px;height:40px;color:var(--text-muted);" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p style="font-weight:600;color:var(--text-primary);font-size:0.95rem;">No sessions bookmarked yet</p>
          <p style="font-size:0.8rem;color:var(--text-muted);max-width:260px;">
            Browse the 3-day schedule and click "Add to Plan" to curate your festival calendar.
          </p>
        </div>
      `;
      if (this.exportBtn) this.exportBtn.disabled = true;
      if (this.clearBtn) this.clearBtn.disabled = true;
      return;
    }

    if (this.exportBtn) this.exportBtn.disabled = false;
    if (this.clearBtn) this.clearBtn.disabled = false;

    // Group by Day
    const days = [1, 2, 3];
    let html = '';

    days.forEach(dayNum => {
      const daySessions = savedList.filter(s => s.day === dayNum);
      if (daySessions.length === 0) return;

      const dateStr = dayNum === 1 ? 'Friday, Oct 16' : dayNum === 2 ? 'Saturday, Oct 17' : 'Sunday, Oct 18';

      html += `
        <div style="display:flex;align-items:center;gap:8px;margin-top:8px;border-bottom:1px solid var(--border-hairline);padding-bottom:4px;">
          <span class="tag tag-blue">DAY 0${dayNum}</span>
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);">${dateStr}</span>
        </div>
      `;

      daySessions.forEach(session => {
        html += `
          <div style="background:var(--bg-primary);border:1px solid var(--border-hairline);border-radius:var(--radius-xs);padding:12px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--accent-yellow);font-weight:600;">${session.time}</span>
              <button class="remove-session-btn" data-id="${session.id}" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:2px;" title="Remove session">
                <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style="font-size:0.88rem;font-weight:700;color:var(--text-primary);line-height:1.3;">${session.title}</div>
            <div style="display:flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:0.68rem;color:var(--text-muted);">
              <span>${session.venue}</span>
              <span>•</span>
              <span style="color:var(--text-secondary);">${session.speaker}</span>
            </div>
          </div>
        `;
      });
    });

    this.drawerBody.innerHTML = html;

    // Attach remove event listeners
    this.drawerBody.querySelectorAll('.remove-session-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.toggleSession(id);
      });
    });
  }

  // RFC 5545 iCalendar standard export
  exportIcsCalendar() {
    const savedList = this.allSessions.filter(s => this.savedIds.has(s.id));
    if (savedList.length === 0) return;

    let ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//GDG ITER//Tekno Krraft 2026//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Tekno Krraft 2026 - My Fest Schedule',
      'X-WR-TIMEZONE:Asia/Kolkata'
    ];

    savedList.forEach(item => {
      const startIso = item.startTime.replace(/[-:]/g, '').replace('.000', '').slice(0, 15);
      const endIso = item.endTime.replace(/[-:]/g, '').replace('.000', '').slice(0, 15);

      ics.push(
        'BEGIN:VEVENT',
        `UID:${item.id}-tk26@gdgiter.org`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
        `DTSTART;TZID=Asia/Kolkata:${startIso}`,
        `DTEND;TZID=Asia/Kolkata:${endIso}`,
        `SUMMARY:${item.title.replace(/[,;]/g, ' ')}`,
        `DESCRIPTION:${item.desc.replace(/[,;]/g, ' ')} | Speaker: ${item.speaker}`,
        `LOCATION:${item.venue.replace(/[,;]/g, ' ')}, ITER Campus, SOA University, Bhubaneswar`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });

    ics.push('END:VCALENDAR');

    const icsString = ics.join('\r\n');
    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Tekno-Krraft-2026-My-Schedule.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
