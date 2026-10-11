// ============================================================================
// <AnimatedTopDock /> — ThreeUI Exact Component Source (ES Module Runtime)
// Authored Source Revision: 5a736cd3c1f6f19802f61ebb10e1701b9f7aa26e
// Variant: modern (Command Bar)
// Adapted for Tekno Krraft 2026 (GDG @ SOA, ITER Chapter)
// ============================================================================

import { createTopDockController } from "./topDockController.js";

export const ANIMATED_TOP_DOCK_DEFAULTS = {
  variant: "modern",
  proximity: 122,
  spring: 0.19,
  damping: 0.70,
  widthGrowth: 17,
  heightGrowth: 16,
  drop: 3.5,
  pixelSize: 4,
  speed: 1,
  noise: 1,
  levels: 7,
  scanlines: 0.32,
  particles: 22,
  thickness: 0.115,
  dispersion: 0.05,
  specular: 0.85,
  rim: 0.5,
  drift: 1,
};

// Google Developer Group Brand Mark & Emblem
const GDG_BRAND_MARK = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect width="24" height="24" rx="4.5" fill="#090b10" />
    <path d="M4 6.5h16v11H4z" fill="#141824" rx="2" />
    <text x="3.2" y="16.5" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" letter-spacing="-0.3px">
      <tspan fill="#4285f4">&lt;</tspan><tspan fill="#ea4335">G</tspan><tspan fill="#fbbc04">D</tspan><tspan fill="#34a853">G</tspan><tspan fill="#4285f4">&gt;</tspan>
    </text>
  </svg>
`;

// Festival Navigation Items mapped to real sections:
// 1. Oracle (Gemini AI assistant) -> #oracle
// 2. Tracks (4 Curriculum Tracks) -> #tracks
// 3. Schedule (3-Day Timeline) -> #schedule
// 4. Pass (3D Delegate Credential) -> #pass
// 5. Hackathon (₹2.5L Hack Sprint) -> #hackathon
export const FESTIVAL_ITEMS = [
  {
    id: "oracle",
    label: "Oracle",
    altLabel: "SYSTEM",
    anchor: "#oracle",
    icon: `<path d="M8 1.5 9.8 6.2 14.5 8 9.8 9.8 8 14.5 6.2 9.8 1.5 8 6.2 6.2z"/>`,
  },
  {
    id: "tracks",
    label: "Tracks",
    altLabel: "METHOD",
    anchor: "#tracks",
    icon: `<path d="M8 1.9 14.4 5.6 8 9.3 1.6 5.6z"/><path d="m2.6 8 5.4 3.1L13.4 8M2.6 10.7 8 13.8l5.4-3.1"/>`,
  },
  {
    id: "schedule",
    label: "Schedule",
    altLabel: "WORK",
    anchor: "#schedule",
    icon: `<rect x="2.5" y="3.5" width="11" height="10" rx="1.8"/><path d="M2.5 6.8h11M5.5 2v3M10.5 2v3"/>`,
  },
  {
    id: "pass",
    label: "Pass",
    altLabel: "ACCESS",
    anchor: "#pass",
    icon: `<rect x="3.2" y="2.2" width="9.6" height="11.6" rx="2"/><circle cx="8" cy="6.2" r="1.6"/><path d="M5.5 11.2h5"/>`,
  },
  {
    id: "hackathon",
    label: "Hackathon",
    altLabel: "NOTES",
    anchor: "#hackathon",
    icon: `<path d="m4.8 5.5-2.8 2.5 2.8 2.5M11.2 5.5l2.8 2.5-2.8 2.5M9.2 3.8 6.8 12.2"/>`,
  },
];

export class AnimatedTopDock {
  constructor(container, props = {}) {
    this.container = typeof container === "string" ? document.querySelector(container) : container;
    this.props = { ...ANIMATED_TOP_DOCK_DEFAULTS, ...props };
    this.items = this.props.useCodenames
      ? FESTIVAL_ITEMS.map((item) => ({ ...item, label: item.altLabel }))
      : FESTIVAL_ITEMS;
    this.cleanupController = null;
    this.scrollObserver = null;
    this.activeId = this.items[0].id;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindController();
    this.bindInteractions();
  }

  render() {
    this.container.innerHTML = `
      <div class="animated-top-dock-component atd-modern">
        <div class="atd-modern__aurora" aria-hidden="true"></div>
        <header class="atd-modern__bar">
          <!-- Tekno Krraft Brand Emblem -->
          <a class="atd-modern__brand" href="#hero" aria-label="Tekno Krraft 2026 Home">
            <span class="atd-modern__mark" aria-hidden="true">${GDG_BRAND_MARK}</span>
            <span class="atd-modern__word">
              <span style="font-weight:700;letter-spacing:-0.02em;">Tekno</span><span style="font-weight:400;color:#9b9fae;margin-left:2px;">Krraft</span>
              <span style="font-size:10px;padding:2px 5px;border-radius:4px;background:rgba(66,133,244,0.18);color:#6ba1ff;margin-left:5px;font-family:'JetBrains Mono',monospace;vertical-align:middle;">'26</span>
            </span>
          </a>

          <!-- Proximity Spring Dock Navigation -->
          <nav class="atd-modern__dock" aria-label="Primary" data-dock-state="idle" data-dock-max="0.00">
            ${this.items.map(
              (item, idx) => `
              <button
                class="atd-modern__item"
                data-dock-item
                type="button"
                data-item-id="${item.id}"
                data-anchor="${item.anchor}"
                aria-pressed="${idx === 0 ? "true" : "false"}"
                title="${item.label} Section"
              >
                <span class="atd-modern__icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16">${item.icon}</svg>
                </span>
                <span>${item.label}</span>
              </button>
            `
            ).join("")}
          </nav>

          <!-- Actions Group: Audio, Theme, Itinerary Plan, Join Fest -->
          <div class="atd-modern__actions">
            <!-- Audio Feedback Toggle -->
            <button id="soundToggleBtn" class="atd-modern__ghost atd-icon-chip" type="button" aria-label="Toggle Sound Effects" title="Tactile Sound Feedback">
              <svg viewBox="0 0 24 24" class="svg-icon" style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2;">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            </button>

            <!-- Theme Toggle -->
            <button id="themeToggleBtn" class="atd-modern__ghost atd-icon-chip" type="button" aria-label="Toggle visual theme" title="Toggle theme">
              <svg viewBox="0 0 24 24" class="svg-icon" style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2;">
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

            <!-- Itinerary Planner Ghost Trigger -->
            <button class="atd-modern__ghost itinerary-toggle-btn" type="button" aria-label="My Plan" title="View Saved Itinerary">
              <span>My Plan</span>
              <span class="itinerary-btn-badge" style="display:none;margin-left:4px;">0</span>
            </button>

            <!-- Registration Gradient CTA -->
            <button class="atd-modern__cta open-reg-modal-btn" type="button" aria-label="Join Fest">
              <span>Join Fest</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3.2 8h9.1M8.6 4.3 12.4 8l-3.8 3.7" />
              </svg>
            </button>
          </div>
        </header>
      </div>
    `;
  }

  bindController() {
    const dockNav = this.container.querySelector(".atd-modern__dock");
    if (!dockNav) return;

    this.cleanupController = createTopDockController(dockNav, () => ({
      proximity: this.props.proximity,
      spring: this.props.spring,
      damping: this.props.damping,
      widthGrowth: this.props.widthGrowth,
      heightGrowth: this.props.heightGrowth,
      drop: this.props.drop,
      axis: "x",
      distribute: false,
      lockTrack: true,
    }));
  }

  bindInteractions() {
    const items = this.container.querySelectorAll(".atd-modern__item");
    items.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-item-id");
        const anchor = btn.getAttribute("data-anchor");
        this.setActive(id);
        if (anchor) {
          const target = document.querySelector(anchor);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });

    // Smooth scroll for brand link
    const brand = this.container.querySelector(".atd-modern__brand");
    brand?.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Modals connection for My Plan and Join Fest
    const planBtn = this.container.querySelector(".itinerary-toggle-btn");
    planBtn?.addEventListener("click", () => {
      const itineraryModal = document.getElementById("itineraryModal");
      if (itineraryModal) {
        itineraryModal.classList.add("active");
        itineraryModal.setAttribute("aria-hidden", "false");
      }
    });

    const ctaBtn = this.container.querySelector(".open-reg-modal-btn");
    ctaBtn?.addEventListener("click", () => {
      const regModal = document.getElementById("regModal");
      if (regModal) {
        regModal.classList.add("active");
        regModal.setAttribute("aria-hidden", "false");
      }
    });

    // Scroll spy across sections
    const anchors = this.items
      .map((item) => ({
        id: item.id,
        el: document.querySelector(item.anchor),
      }))
      .filter((a) => a.el);

    if (anchors.length > 0) {
      this.scrollObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const matched = anchors.find((a) => a.el === entry.target);
              if (matched) {
                this.setActive(matched.id);
              }
            }
          });
        },
        { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
      );
      anchors.forEach((a) => this.scrollObserver.observe(a.el));
    }
  }

  setActive(id) {
    this.activeId = id;
    const items = this.container.querySelectorAll(".atd-modern__item");
    items.forEach((btn) => {
      const match = btn.getAttribute("data-item-id") === id;
      btn.setAttribute("aria-pressed", match ? "true" : "false");
    });
  }

  destroy() {
    if (this.cleanupController) {
      this.cleanupController();
      this.cleanupController = null;
    }
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
      this.scrollObserver = null;
    }
  }
}
