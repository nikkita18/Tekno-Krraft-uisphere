// Tekno Krraft 2026 - Interactive Digital Pass / Badge Generator
// Pure client-side SVG/Canvas generation with export capability

export class BadgeGenerator {
  constructor() {
    this.nameInput = document.getElementById('badgeNameInput');
    this.trackSelect = document.getElementById('badgeTrackSelect');
    this.roleSelect = document.getElementById('badgeRoleSelect');
    this.downloadBtn = document.getElementById('downloadBadgeBtn');
    this.shareBtn = document.getElementById('shareBadgeBtn');

    // Display elements
    this.dispName = document.getElementById('passNameDisplay');
    this.dispTrack = document.getElementById('passTrackDisplay');
    this.dispRole = document.getElementById('passRoleDisplay');
    this.dispAvatar = document.getElementById('passAvatarInitials');
    this.dispSeat = document.getElementById('passSeatDisplay');
    this.dispId = document.getElementById('passIdDisplay');
    this.barcodeArea = document.getElementById('passBarcodeLines');

    this.init();
  }

  init() {
    if (!this.nameInput) return;

    this.nameInput.addEventListener('input', () => this.updateBadge());
    this.trackSelect?.addEventListener('change', () => this.updateBadge());
    this.roleSelect?.addEventListener('change', () => this.updateBadge());

    this.downloadBtn?.addEventListener('click', () => this.downloadBadge());
    this.shareBtn?.addEventListener('click', () => this.copyShareLink());

    // Generate deterministic barcode
    this.renderBarcode();
    this.updateBadge();
  }

  updateBadge() {
    const rawName = this.nameInput ? this.nameInput.value.trim() : "";
    const name = rawName || "Aditya Sharma";
    const track = this.trackSelect ? this.trackSelect.value : "Generative AI & Machine Learning";
    const role = this.roleSelect ? this.roleSelect.value : "Delegate";

    // Update Initials
    const parts = name.split(/\s+/);
    let initials = "TK";
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts[0]) {
      initials = parts[0].slice(0, 2).toUpperCase();
    }

    if (this.dispName) this.dispName.textContent = name;
    if (this.dispTrack) this.dispTrack.textContent = track;
    if (this.dispRole) this.dispRole.textContent = role;
    if (this.dispAvatar) this.dispAvatar.textContent = initials;

    // Deterministic Pass ID based on name hash
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash) % 9000 + 1000;
    const passId = `TK26-${absHash}`;
    if (this.dispId) this.dispId.textContent = passId;
    const backAuth = document.getElementById('passBackAuthToken');
    if (backAuth) backAuth.textContent = `SHA256-TK26-SOA-${absHash}A`;

    // Room / Seat based on track
    let seat = "AUD-101 / ROW-C";
    if (track.includes("AI")) seat = "LAB-302 / D-12";
    else if (track.includes("Web")) seat = "HALL-2 / W-08";
    else if (track.includes("Mobile")) seat = "LAB-201 / M-15";
    else if (track.includes("Infra")) seat = "AUD-101 / GKE-4";
    if (this.dispSeat) this.dispSeat.textContent = seat;

    // Regenerate barcode pattern with pseudo random widths
    this.renderBarcode(absHash);
  }

  renderBarcode(seed = 4285) {
    if (!this.barcodeArea) return;
    this.barcodeArea.innerHTML = '';
    const heights = [100, 70, 90, 60, 100, 85, 75, 95, 60, 100, 80, 90, 70, 100, 85, 60, 95, 80];
    const widths = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 4, 2];

    for (let i = 0; i < widths.length; i++) {
      const bar = document.createElement('div');
      bar.className = 'barcode-bar';
      bar.style.width = `${widths[i]}px`;
      bar.style.height = `${heights[i % heights.length]}%`;
      this.barcodeArea.appendChild(bar);
    }
  }

  downloadBadge() {
    const card = document.getElementById('digitalPassCard');
    if (!card) return;

    // Generate high resolution SVG export
    const name = this.dispName?.textContent || "Aditya Sharma";
    const track = this.dispTrack?.textContent || "Generative AI";
    const role = this.dispRole?.textContent || "Delegate";
    const passId = this.dispId?.textContent || "TK26-4821";
    const seat = this.dispSeat?.textContent || "AUD-101";

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
        <rect width="600" height="380" fill="#0b0e14" rx="8" stroke="#2f3b56" stroke-width="2"/>
        <line x1="0" y1="90" x2="600" y2="90" stroke="#1f273b" stroke-width="1" stroke-dasharray="6 4"/>
        <line x1="0" y1="280" x2="600" y2="280" stroke="#1f273b" stroke-width="1"/>
        
        <!-- Header -->
        <text x="40" y="45" fill="#64738a" font-family="monospace" font-size="12" letter-spacing="2">GOOGLE DEVELOPER GROUP @ ITER CHAPTER</text>
        <text x="40" y="75" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="24">TEKNO KRRAFT <tspan fill="#3b82f6">2026</tspan></text>
        <rect x="470" y="45" width="90" height="26" fill="#1e293b" rx="4" stroke="#3b82f6" stroke-width="1"/>
        <text x="515" y="62" fill="#3b82f6" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">${role.toUpperCase()}</text>
        
        <!-- Identity -->
        <rect x="40" y="115" width="64" height="64" fill="#161c2b" rx="4" stroke="#2f3b56"/>
        <text x="72" y="154" fill="#3b82f6" font-family="monospace" font-weight="bold" font-size="22" text-anchor="middle">${this.dispAvatar?.textContent || "AS"}</text>
        
        <text x="125" y="142" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="22">${name}</text>
        <text x="125" y="165" fill="#f59e0b" font-family="monospace" font-size="13">${track}</text>
        
        <!-- Meta Details -->
        <text x="40" y="220" fill="#64738a" font-family="monospace" font-size="11">DATES</text>
        <text x="40" y="240" fill="#ffffff" font-family="monospace" font-weight="bold" font-size="13">OCT 16 - 18, 2026</text>
        
        <text x="210" y="220" fill="#64738a" font-family="monospace" font-size="11">VENUE</text>
        <text x="210" y="240" fill="#ffffff" font-family="monospace" font-weight="bold" font-size="13">ITER SOA CAMPUS</text>
        
        <text x="380" y="220" fill="#64738a" font-family="monospace" font-size="11">PASS ID</text>
        <text x="380" y="240" fill="#10b981" font-family="monospace" font-weight="bold" font-size="13">${passId}</text>
        
        <text x="490" y="220" fill="#64738a" font-family="monospace" font-size="11">ACCESS ZONE</text>
        <text x="490" y="240" fill="#ffffff" font-family="monospace" font-weight="bold" font-size="13">${seat}</text>
        
        <!-- Barcode simulation -->
        <text x="40" y="325" fill="#64738a" font-family="monospace" font-size="10">AUTH / REGISTRATION VERIFIED</text>
        <rect x="40" y="335" width="2" height="24" fill="#9aa7bc"/>
        <rect x="46" y="335" width="4" height="24" fill="#9aa7bc"/>
        <rect x="54" y="335" width="1" height="24" fill="#9aa7bc"/>
        <rect x="58" y="335" width="3" height="24" fill="#9aa7bc"/>
        <rect x="66" y="335" width="2" height="24" fill="#9aa7bc"/>
        <rect x="72" y="335" width="5" height="24" fill="#9aa7bc"/>
        <rect x="80" y="335" width="1" height="24" fill="#9aa7bc"/>
        <rect x="84" y="335" width="3" height="24" fill="#9aa7bc"/>
        <rect x="92" y="335" width="4" height="24" fill="#9aa7bc"/>
        <rect x="100" y="335" width="2" height="24" fill="#9aa7bc"/>
        <rect x="106" y="335" width="3" height="24" fill="#9aa7bc"/>
        <rect x="114" y="335" width="1" height="24" fill="#9aa7bc"/>
        <text x="135" y="352" fill="#64738a" font-family="monospace" font-size="11">SERIAL: 8829-SOA-TK26</text>
        
        <rect x="520" y="310" width="42" height="42" fill="#111520" stroke="#2f3b56"/>
        <rect x="526" y="316" width="12" height="12" fill="#3b82f6"/>
        <rect x="544" y="316" width="12" height="12" fill="#ffffff"/>
        <rect x="526" y="334" width="12" height="12" fill="#ffffff"/>
        <rect x="544" y="334" width="6" height="6" fill="#10b981"/>
      </svg>
    `;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tekno-Krraft-2026-Pass-${passId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  copyShareLink() {
    const name = encodeURIComponent(this.dispName?.textContent || "Delegate");
    const shareUrl = `${window.location.origin}${window.location.pathname}?attendee=${name}`;
    navigator.clipboard?.writeText(shareUrl).then(() => {
      const btn = this.shareBtn;
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span>Copied URL!</span>`;
        setTimeout(() => { btn.innerHTML = originalText; }, 2000);
      }
    }).catch(() => {
      alert("Pass URL copied: " + shareUrl);
    });
  }
}
