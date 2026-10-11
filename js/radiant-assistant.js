// Tekno Krraft 2026 - Radiant Gemini AI Prompt Input Manager
// Interactive festival assistant with live answering, prompt chip insertion & search jump

export class RadiantAssistant {
  constructor() {
    this.input = document.getElementById('radiantQueryInput');
    this.submitBtn = document.getElementById('radiantSubmitBtn');
    this.plusBtn = document.getElementById('radiantPlusBtn');
    this.micBtn = document.getElementById('radiantMicBtn');
    this.chips = document.querySelectorAll('.radiant-chip');
    this.responseCard = document.getElementById('radiantResponseCard');
    this.responseText = document.getElementById('radiantResponseText');
    this.statusTag = document.getElementById('radiantStatusTag');

    this.knowledge = [
      {
        keys: ['gemini', 'ai', 'machine learning', 'track', 'rag', 'llm'],
        response: "The Generative AI & ML Track is led by Rohan Samal & Dr. Ananya Patnaik. It covers Gemini 1.5 Pro Multimodal, Structured JSON, Production RAG with Vector Search, and autonomous Vertex AI agents. Prerequisites: Python 3.10+ and REST fundamentals."
      },
      {
        keys: ['prize', 'bounty', 'cash', 'money', '2.5', '250000', 'win'],
        response: "The ₹2,50,000 Prize Pool features: Grand Champion (₹1,00,000 + $2k Cloud Credits), First Runner-Up (₹60,000), Second Runner-Up (₹35,000), Best AI Innovation (₹25,000), and Best UI/UX Craft (₹20,000)."
      },
      {
        keys: ['hackathon', 'sprint', 'hack', 'team', 'squad', 'hours'],
        response: "The 24-Hour AI/ML Hack Sprint runs from Saturday, Oct 17 at 09:00 AM to Sunday, Oct 18 at 09:00 AM in the SAC Grand Arena. Teams of 2 to 4 members are allowed. High-speed fiber drops, power rails, and late-night dev fuel are provided."
      },
      {
        keys: ['speaker', 'ananya', 'patnaik', 'rohan', 'priyanka', 'amitabh'],
        response: "Keynote speakers include Dr. Ananya Patnaik (Ex-Google Senior Staff, Principal Cloud Architect), Rohan Samal (Google Cloud Ecosystem Partner), Priyanka Mishra (Google Developer Expert in Flutter), and Amitabh Swain (Staff Engineer, Atlassian)."
      },
      {
        keys: ['schedule', 'agenda', 'calendar', 'day 1', 'day 2', 'day 3', 'ics'],
        response: "The 3-day schedule features 32 sessions across 4 tracks. You can filter by domain, search in real-time, and click 'Export iCalendar (.ics)' to automatically sync all bookmarked sessions with Google Calendar."
      },
      {
        keys: ['venue', 'location', 'reach', 'airport', 'iter', 'bhubaneswar'],
        response: "Tekno Krraft 2026 takes place at the ITER SOA Main Campus, Khandagiri Square, Bhubaneswar (20°15'N 85°47'E). 15 minutes (7.5 km) from Biju Patnaik International Airport (BBI) and 20 minutes from Master Canteen Railway Station."
      },
      {
        keys: ['register', 'free', 'cost', 'fee', 'ticket', 'pass'],
        response: "Admission is 100% FREE in accordance with Google Developer Groups principles. Hands-on workshop seats in computer laboratories (Lab 302, Hall 2) are allocated on verified check-in. Use the 'Register Now' button above to provision your pass."
      }
    ];

    this.samplePrompts = [
      "What are the AI track prerequisites?",
      "How is the ₹2,50,000 prize pool distributed?",
      "When does the 24-hour hack sprint start?",
      "Tell me about Dr. Ananya Patnaik's keynote",
      "Where is the ITER campus located?"
    ];
    this.promptIdx = 0;

    this.init();
  }

  init() {
    if (!this.input) return;

    this.submitBtn?.addEventListener('click', () => this.handleQuery());

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleQuery();
      }
    });

    this.chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-query') || chip.textContent.trim();
        this.input.value = text;
        this.handleQuery();
      });
    });

    this.plusBtn?.addEventListener('click', () => {
      this.input.value = this.samplePrompts[this.promptIdx % this.samplePrompts.length];
      this.promptIdx++;
      this.input.focus();
    });

    this.micBtn?.addEventListener('click', () => {
      this.input.value = "Tell me about the 24-hour hack sprint";
      this.handleQuery();
    });
  }

  handleQuery() {
    const raw = this.input.value.trim();
    if (!raw) return;

    const query = raw.toLowerCase();
    let match = this.knowledge.find(k => k.keys.some(key => query.includes(key)));

    let answer = match 
      ? match.response 
      : `Here's what our Gemini assistant found for "${raw}": Explore the 4 specialization tracks or check the 3-day schedule below. You can also join us at the delegate registration desk on October 16 at 08:30 AM IST in ITER Foyer.`;

    if (this.responseCard && this.responseText) {
      this.responseCard.classList.add('active');
      if (this.statusTag) this.statusTag.textContent = "SYNTHESIZED FROM GDG CORPUS";

      // Clear any previous streaming timer to prevent interleaving
      if (this.streamTimer) clearInterval(this.streamTimer);

      this.responseText.textContent = "";
      let charIdx = 0;
      this.streamTimer = setInterval(() => {
        if (charIdx < answer.length) {
          this.responseText.textContent += answer[charIdx];
          charIdx++;
        } else {
          clearInterval(this.streamTimer);
          this.streamTimer = null;
        }
      }, 12);
    }

    // If query matches schedule or speakers, gently scroll
    if (query.includes('schedule') || query.includes('session')) {
      document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' });
    } else if (query.includes('prize') || query.includes('hackathon')) {
      document.getElementById('hackathon')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
