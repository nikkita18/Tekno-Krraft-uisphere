// Tekno Krraft 2026 - Maker Motion & Radiant Oracle Engine
// Implements:
// 1. The Travelling Product scroll interpolation
// 2. Spread Wordmark letter tracking physics
// 3. Self-drawing SVG demonstration with getTotalLength() & variant picker
// 4. Radiant Prompt Input interactive AI concierge

export class MakerMotionEngine {
  constructor() {
    this.travellingEl = document.getElementById('travellingProduct');
    this.spreadWordmark = document.getElementById('heroSpreadWordmark');
    this.demoPath = document.getElementById('demoSvgPath');
    this.variantButtons = document.querySelectorAll('.variant-btn');

    // Radiant Input elements
    this.radiantInput = document.getElementById('radiantQueryInput');
    this.radiantSubmit = document.getElementById('radiantSubmitBtn');
    this.radiantPlus = document.getElementById('radiantPlusBtn');
    this.radiantMic = document.getElementById('radiantMicBtn');
    this.oracleOutput = document.getElementById('oracleResponseArea');
    this.oracleAnswerText = document.getElementById('oracleAnswerText');

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.initTravellingProduct();
    this.initSpreadWordmark();
    this.initSelfDrawingDemo();
    this.initRadiantInput();
  }

  /* ------------------------------------------------------------------------
     1. THE TRAVELLING PRODUCT SCROLL INTERPOLATION
     Path coordinates:
     Stop 0 (scroll 0px): x: 62%, y: 22%, rot: -4deg, scale: 1.0, opacity: 1
     Stop 1 (scroll 500px): x: 74%, y: 35%, rot: 6deg, scale: 0.92, opacity: 1
     Stop 2 (scroll 1200px): x: 50%, y: 50%, rot: 0deg, scale: 0.85, opacity: 1
     Stop 3 (scroll 1800px): x: 28%, y: 65%, rot: -8deg, scale: 0.75, opacity: 0.7
     Stop 4 (scroll 2400px+): x: 10%, y: 80%, rot: -15deg, scale: 0.6, opacity: 0
     ------------------------------------------------------------------------ */
  initTravellingProduct() {
    if (!this.travellingEl || this.reducedMotion) return;

    const stops = [
      { scroll: 0, x: 64, y: 18, rot: -4, scale: 1.0, opacity: 1 },
      { scroll: 400, x: 72, y: 26, rot: 5, scale: 0.94, opacity: 1 },
      { scroll: 950, x: 55, y: 38, rot: -2, scale: 0.88, opacity: 0.95 },
      { scroll: 1550, x: 42, y: 48, rot: 4, scale: 0.82, opacity: 0.8 },
      { scroll: 2150, x: 25, y: 58, rot: -10, scale: 0.7, opacity: 0.4 },
      { scroll: 2600, x: 15, y: 68, rot: -18, scale: 0.55, opacity: 0 }
    ];

    const updateTravel = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // Find surrounding stops
      let p0 = stops[0];
      let p1 = stops[stops.length - 1];

      for (let i = 0; i < stops.length - 1; i++) {
        if (scrollY >= stops[i].scroll && scrollY <= stops[i + 1].scroll) {
          p0 = stops[i];
          p1 = stops[i + 1];
          break;
        }
      }

      if (scrollY > stops[stops.length - 1].scroll) {
        this.travellingEl.style.opacity = '0';
        this.travellingEl.style.visibility = 'hidden';
        return;
      }

      this.travellingEl.style.visibility = 'visible';

      const range = p1.scroll - p0.scroll;
      const progress = range > 0 ? (scrollY - p0.scroll) / range : 0;
      // Smooth ease
      const ease = progress * progress * (3 - 2 * progress);

      const x = p0.x + (p1.x - p0.x) * ease;
      const y = p0.y + (p1.y - p0.y) * ease;
      const rot = p0.rot + (p1.rot - p0.rot) * ease;
      const scale = p0.scale + (p1.scale - p0.scale) * ease;
      const opacity = p0.opacity + (p1.opacity - p0.opacity) * ease;

      this.travellingEl.style.left = `${x}vw`;
      this.travellingEl.style.top = `${y}vh`;
      this.travellingEl.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;
      this.travellingEl.style.opacity = String(opacity);
    };

    window.addEventListener('scroll', updateTravel, { passive: true });
    updateTravel();
  }

  /* ------------------------------------------------------------------------
     2. SPREAD WORDMARK LETTER SINKING & SEPARATION
     ------------------------------------------------------------------------ */
  initSpreadWordmark() {
    if (!this.spreadWordmark || this.reducedMotion) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY <= 600) {
        const factor = scrollY / 600;
        const sinkY = 14 + factor * 28; // Translate down from 14% to 42%
        const letterSpacing = factor * 0.18; // Spreading outward
        this.spreadWordmark.style.transform = `translateY(${sinkY}%)`;
        this.spreadWordmark.style.letterSpacing = `${letterSpacing}em`;
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     3. SELF-DRAWING SVG DEMONSTRATION WITH getTotalLength()
     ------------------------------------------------------------------------ */
  initSelfDrawingDemo() {
    if (!this.demoPath) return;

    // Variant SVG path definitions
    const variants = {
      hull: {
        d: "M 40,160 C 90,40 180,30 260,70 C 340,110 420,170 520,110 C 620,50 710,140 760,150",
        fact1: "O(N LOG N)",
        fact2: "45 ITERATIONS",
        fact3: "ZERO HEAP LEAK"
      },
      rag: {
        d: "M 40,140 L 140,70 L 240,150 L 340,80 L 440,160 L 540,60 L 640,130 L 760,80",
        fact1: "768-DIM DENSE",
        fact2: "COSINE SIM 0.94",
        fact3: "12ms LATENCY"
      },
      mesh: {
        d: "M 40,100 Q 180,20 320,110 T 600,100 T 760,110",
        fact1: "MULTI-REGION",
        fact2: "99.99% UP SLO",
        fact3: "AUTOPILOT GKE"
      }
    };

    const drawPath = (dString, strokeWidth = 2) => {
      this.demoPath.setAttribute('d', dString);
      this.demoPath.setAttribute('stroke-width', String(strokeWidth));

      const length = this.demoPath.getTotalLength();
      this.demoPath.style.transition = 'none';
      this.demoPath.style.strokeDasharray = `${length}`;
      this.demoPath.style.strokeDashoffset = `${length}`;

      // Trigger reflow then transition to 0
      this.demoPath.getBoundingClientRect();
      this.demoPath.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)';
      this.demoPath.style.strokeDashoffset = '0';
    };

    // Intersection observer to draw on entry
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          drawPath(variants.hull.d, 2.2);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const panel = document.getElementById('demonstrationPanel');
    if (panel) observer.observe(panel);

    // Variant buttons handler
    this.variantButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.variantButtons.forEach(b => {
          b.setAttribute('aria-pressed', 'false');
          b.classList.remove('active');
        });
        btn.setAttribute('aria-pressed', 'true');
        btn.classList.add('active');

        const vKey = btn.getAttribute('data-variant') || 'hull';
        const vData = variants[vKey];
        if (vData) {
          drawPath(vData.d, vKey === 'mesh' ? 2.5 : 2);
          const f1 = document.getElementById('demoFact1');
          const f2 = document.getElementById('demoFact2');
          const f3 = document.getElementById('demoFact3');
          if (f1) f1.textContent = vData.fact1;
          if (f2) f2.textContent = vData.fact2;
          if (f3) f3.textContent = vData.fact3;
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. RADIANT PROMPT INPUT - THE TECHNICAL ORACLE
     ------------------------------------------------------------------------ */
  initRadiantInput() {
    if (!this.radiantInput) return;

    const queryKnowledge = [
      {
        triggers: ['prerequisite', 'requirement', 'python', 'prepare'],
        answer: "Tracks have calibrated prerequisites: AI/ML requires Python 3.10+ & REST fundamentals. Full-Stack Web requires modern JavaScript (ES2022+) & Git. Mobile requires basic OOP/Dart. All workshops provide pre-configured Cloud Shell environments."
      },
      {
        triggers: ['ananya', 'patnaik', 'keynote', 'speaker'],
        answer: "Dr. Ananya Patnaik (Principal Cloud Architect & GDG Mentor, Ex-Google Staff) opens Tekno Krraft on Day 01 (09:30 AM) with 'The Future of Developer Ecosystems' in Auditorium 101."
      },
      {
        triggers: ['prize', 'bounty', 'cash', 'money', '250000', '2.5'],
        answer: "Total cash prize pool is ₹2,50,000 across 24 hours: Grand Champion takes ₹1,00,000 + $2k Cloud Credits. First Runner-Up takes ₹60,000. Second Runner-Up ₹35,000. Specialist AI & UI Craft bounties take ₹25,000 & ₹20,000."
      },
      {
        triggers: ['hackathon', 'sprint', 'hack', 'team', 'squad'],
        answer: "The 24-Hour AI/ML Hack Sprint kicks off on Saturday, Oct 17 at 09:00 AM sharp in the SAC Grand Arena. Teams of 2 to 4 members are permitted. Inter-college teams are welcomed. Code freeze is Sunday, Oct 18 at 09:00 AM."
      },
      {
        triggers: ['venue', 'location', 'reach', 'airport', 'bhubaneswar'],
        answer: "Held at ITER Campus, Siksha 'O' Anusandhan, Khandagiri Square, Bhubaneswar (20°15'N 85°47'E). 15 mins (7.5 km) from BBI Airport and 20 mins (9.5 km) from Master Canteen Railway Station."
      },
      {
        triggers: ['schedule', 'agenda', 'calendar', 'ics'],
        answer: "3-Day schedule covers 32 sessions: Day 01 Kickoff & Cloud/Web3, Day 02 AI Hack & System Design, Day 03 Demos & Valedictory. You can bookmark any session and click 'Export iCalendar (.ics)' in the top nav to sync with your phone."
      }
    ];

    const answerQuery = (userQuery) => {
      const q = userQuery.toLowerCase().trim();
      if (!q) return;

      let found = queryKnowledge.find(k => k.triggers.some(t => q.includes(t)));
      let response = found ? found.answer : `Regarding "${userQuery}": Explore our 3-Day interactive schedule or visit the registration desk in the main foyer on Oct 16 at 08:30 AM IST.`;

      if (this.oracleOutput && this.oracleAnswerText) {
        this.oracleOutput.classList.add('active');
        this.oracleAnswerText.textContent = "Synthesizing...";
        
        // Typewriter reveal effect
        let idx = 0;
        this.oracleAnswerText.textContent = "";
        const interval = setInterval(() => {
          if (idx < response.length) {
            this.oracleAnswerText.textContent += response[idx];
            idx++;
          } else {
            clearInterval(interval);
          }
        }, 12);
      }
    };

    const submit = () => {
      const val = this.radiantInput.value;
      if (val) {
        answerQuery(val);
        this.radiantInput.value = "";
      }
    };

    this.radiantSubmit?.addEventListener('click', submit);

    this.radiantInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    });

    // Suggested questions on Plus button click
    const samplePrompts = [
      "What are the AI track prerequisites?",
      "When is the ₹2.5L hackathon code freeze?",
      "Where is Dr. Ananya Patnaik speaking?",
      "How do I reach ITER campus from the airport?"
    ];

    let promptIdx = 0;
    this.radiantPlus?.addEventListener('click', () => {
      this.radiantInput.value = samplePrompts[promptIdx % samplePrompts.length];
      promptIdx++;
      this.radiantInput.focus();
    });

    this.radiantMic?.addEventListener('click', () => {
      this.radiantInput.value = "Tell me about the ₹2,50,000 prize pool";
      submit();
    });
  }
}
