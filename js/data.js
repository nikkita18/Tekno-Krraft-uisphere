// Tekno Krraft 2026 - Master Session & Event Data
// GDG @ SOA, ITER Chapter - October 16-18, 2026

export const FEST_METRICS = {
  attendees: "1,500+",
  sessions: "32",
  prizePool: "₹2,50,000",
  hackSprintHours: "24",
  colleges: "45+",
  industryMentors: "18"
};

export const TRACKS_DATA = [
  {
    id: "ai-ml",
    name: "Generative AI & Machine Learning",
    tag: "TK26-TRK-AI",
    level: "Intermediate",
    accentColor: "var(--accent-red)",
    lead: "Rohan Samal & Dr. Ananya Patnaik",
    duration: "14 Hours across 3 Days",
    icon: "✦",
    image: "assets/images/track_ai_core.jpg",
    pillLabel: "MOST POPULAR",
    summary: "From foundation models and Gemini API orchestration to production RAG architectures and multi-agent coordination systems.",
    prerequisites: ["Proficiency in Python 3.10+", "Core understanding of RESTful APIs", "Basic vector math & embeddings intuition"],
    modules: [
      {
        title: "Gemini 1.5 Pro & Multimodal Agent Architecture",
        desc: "Context caching, structured JSON outputs, function calling, and multimodal system prompts."
      },
      {
        title: "Production RAG with Vector Search & Vertex AI",
        desc: "Hybrid lexical/dense search, chunking strategies, reranking, and hallucination guardrails."
      },
      {
        title: "Agentic Workflows & Tool Execution",
        desc: "Autonomous reasoning loops, memory patterns, and production deployment with Vertex AI Studio."
      }
    ],
    tools: ["Gemini API", "Vertex AI", "LangChain", "ChromaDB", "Python", "Cloud Run"],
    deliverable: "Deploy an enterprise multi-document research analyst agent with grounded citations."
  },
  {
    id: "cloud-web",
    name: "Full-Stack Web & Cloud Architecture",
    tag: "TK26-TRK-WEB",
    level: "Beginner to Intermediate",
    accentColor: "var(--accent-blue)",
    lead: "Amitabh Swain",
    duration: "12 Hours across 3 Days",
    icon: "⬡",
    image: "assets/images/track_web_systems.jpg",
    pillLabel: "FULL-STACK SHIPPER",
    summary: "Architecting resilient, distributed web systems using modern reactive runtimes, serverless edge functions, and Google Cloud Run.",
    prerequisites: ["Modern JavaScript/TypeScript (ES2022+)", "Git workflow fundamentals", "HTTP/REST mental model"],
    modules: [
      {
        title: "Component Systems & Reactive State Architecture",
        desc: "Server components, optimistic UI mutations, and state machines for complex interfaces."
      },
      {
        title: "Cloud Run Containerization & Serverless Deployment",
        desc: "Multi-stage Docker builds, Cloud Build CI/CD pipelines, and zero-downtime canary rollouts."
      },
      {
        title: "Distributed Data & Cloud SQL Management",
        desc: "PostgreSQL connection pooling, database migrations, and Redis edge caching layers."
      }
    ],
    tools: ["TypeScript", "Google Cloud Run", "PostgreSQL", "Docker", "Cloud Build", "Redis"],
    deliverable: "Ship a real-time collaborative workspace deployed across regional Google Cloud clusters."
  },
  {
    id: "mobile-cross",
    name: "Mobile & Cross-Platform Systems",
    tag: "TK26-TRK-MOB",
    level: "All Levels",
    accentColor: "var(--accent-green)",
    lead: "Priyanka Mishra (GDE)",
    duration: "10 Hours across 3 Days",
    icon: "📱",
    image: "assets/images/track_flutter_mobile.jpg",
    pillLabel: "120FPS FLUTTER",
    summary: "Crafting fluid 120fps cross-platform mobile experiences with Flutter, declarative state, and Firebase serverless backends.",
    prerequisites: ["Object-oriented programming concepts", "Basic mobile UI paradigms", "Dart/Flutter IDE setup"],
    modules: [
      {
        title: "Flutter Deep Dive: Custom Renderers & Animations",
        desc: "Custom painters, implicit animations, and building signature interaction physics."
      },
      {
        title: "Robust State Management with Bloc & Riverpod",
        desc: "Clean architecture separation, dependency injection, and test-driven mobile development."
      },
      {
        title: "Offline-First Sync with Firebase & Cloud Firestore",
        desc: "Local persistence, optimistic local writes, conflict resolution, and background sync."
      }
    ],
    tools: ["Flutter 3.x", "Dart", "Firebase", "Bloc", "Android SDK", "iOS Simulator"],
    deliverable: "Build an offline-first event companion app with biometric security and live push sync."
  },
  {
    id: "devops-infra",
    name: "Cloud Infrastructure, Kubernetes & SRE",
    tag: "TK26-TRK-OPS",
    level: "Intermediate to Advanced",
    accentColor: "var(--accent-yellow)",
    lead: "Dr. Ananya Patnaik & Guest Leads",
    duration: "10 Hours across 3 Days",
    icon: "☸",
    image: "assets/images/track_cloud_infra.jpg",
    pillLabel: "GKE & CLOUD SRE",
    summary: "Automating cloud reliability: Google Kubernetes Engine (GKE), infrastructure as code with Terraform, and Prometheus/Grafana telemetry.",
    prerequisites: ["Linux CLI proficiency", "Basic container / Docker knowledge", "Basic networking (DNS, TLS, CIDR)"],
    modules: [
      {
        title: "Kubernetes on Google Cloud (GKE Autopilot)",
        desc: "Pods, services, ingress controllers, horizontal pod autoscaling, and rolling upgrades."
      },
      {
        title: "Infrastructure as Code with OpenTofu / Terraform",
        desc: "Modular VPC topologies, IAM principle of least privilege, and state locking."
      },
      {
        title: "Observability, SLOs & Chaos Engineering",
        desc: "Prometheus metrics scrapers, OpenTelemetry tracing, and simulating node failure scenarios."
      }
    ],
    tools: ["Kubernetes", "GKE", "Terraform", "OpenTelemetry", "Docker", "Prometheus"],
    deliverable: "Deploy an auto-healing microservice mesh with live telemetry dashboards."
  }
];

export const SPEAKERS_DATA = [
  {
    id: "ananya-patnaik",
    name: "Dr. Ananya Patnaik",
    role: "Principal Cloud Architect",
    org: "GDSC Regional Mentor & Ex-Google Staff",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    initials: "AP",
    track: "Cloud & DevOps",
    badge: "Keynote Speaker",
    bio: "Ex-Google Senior Staff Engineer specializing in large-scale Kubernetes infrastructure and distributed reliability. Over 14 years architecting fault-tolerant clouds for global platforms. Mentored over 5,000 student engineers across eastern India.",
    sessions: ["Grand Opening & Keynote: The Future of Developer Ecosystems", "Architecting Multi-Cluster GKE Systems at Enterprise Scale"],
    links: { twitter: "#", linkedin: "#", github: "#" }
  },
  {
    id: "rohan-samal",
    name: "Rohan Samal",
    role: "Senior AI Research Engineer",
    org: "Google Cloud Ecosystem Partner",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    initials: "RS",
    track: "Generative AI",
    badge: "AI Track Lead",
    bio: "Pioneer in RAG systems, embedding representations, and LLM agent orchestration. Author of 'Building Production-Grade AI Agents'. Regularly leads deep-dive workshops on multimodal foundation models.",
    sessions: ["Building Multimodal AI Agents with Gemini 1.5", "Production Vector Pipelines: RAG Without the Hallucinations"],
    links: { twitter: "#", linkedin: "#", github: "#" }
  },
  {
    id: "priyanka-mishra",
    name: "Priyanka Mishra",
    role: "Google Developer Expert (GDE)",
    org: "Flutter & Mobile Ecosystem",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    initials: "PM",
    track: "Mobile Systems",
    badge: "GDE Mentor",
    bio: "Global tech speaker, active open-source maintainer, and Google Developer Expert in Flutter. Passionate about high-framerate graphic pipelines, accessible UI engineering, and mentoring students.",
    sessions: ["Cross-Platform Masterclass: High Performance Flutter Rendering", "Mobile System Architecture: Building Clean Offline-First Apps"],
    links: { twitter: "#", linkedin: "#", github: "#" }
  },
  {
    id: "amitabh-swain",
    name: "Amitabh Swain",
    role: "Staff Infrastructure Engineer",
    org: "Atlassian",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    initials: "AS",
    track: "Web & Systems",
    badge: "Systems Lead",
    bio: "Distributed systems specialist with 12+ years experience building fault-tolerant backend infrastructure serving 10M+ daily active requests. Alumnus of ITER SOA, championing regional developer ecosystems.",
    sessions: ["System Design at Scale: Handling 10M+ Concurrent Operations", "Event-Driven Distributed Microservices on GCP"],
    links: { twitter: "#", linkedin: "#", github: "#" }
  },
  {
    id: "debashis-mohanty",
    name: "Debashis Mohanty",
    role: "Lead Security Researcher",
    org: "Cloud Defense Labs",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    initials: "DM",
    track: "Cloud & DevOps",
    badge: "Security Specialist",
    bio: "Specialist in container runtime security, supply chain vulnerability management, and zero-trust perimeter enforcement for enterprise cloud infrastructure.",
    sessions: ["Zero-Trust DevSecOps: Hardening Container Deployments in 2026"],
    links: { twitter: "#", linkedin: "#", github: "#" }
  },
  {
    id: "tanvi-jena",
    name: "Tanvi Jena",
    role: "Staff UI/UX Systems Designer",
    org: "Stripe Alumni / Design Systems Fellow",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    initials: "TJ",
    track: "Web & Systems",
    badge: "Design Director",
    bio: "Design technologist focusing on accessibility-first token architectures, design-to-code pipelines, and high-performance micro-interactions.",
    sessions: ["Design Systems as Code: Bridge the Gap Between Figma and Production DOM"],
    links: { twitter: "#", linkedin: "#", github: "#" }
  }
];

export const SCHEDULE_DATA = [
  // DAY 1 - Friday, Oct 16
  {
    id: "tk-d1-01",
    day: 1,
    time: "08:30 AM - 09:30 AM",
    startTime: "2026-10-16T08:30:00+05:30",
    endTime: "2026-10-16T09:30:00+05:30",
    code: "TK26-REG-01",
    title: "Delegate Check-In & Physical Badge Issuance",
    desc: "Verify registration credentials, collect conference swag kits, badge lanyard, and breakfast networking in the Central Quad.",
    category: "General",
    level: "All Levels",
    venue: "Main Campus Foyer & Registration Desk",
    speaker: "GDG ITER Organizing Core",
    speakerRole: "Student Operations Lead",
    accent: "neutral"
  },
  {
    id: "tk-d1-02",
    day: 1,
    time: "09:30 AM - 11:00 AM",
    startTime: "2026-10-16T09:30:00+05:30",
    endTime: "2026-10-16T11:00:00+05:30",
    code: "TK26-KEY-01",
    title: "Grand Opening & Keynote: The Future of Developer Ecosystems",
    desc: "Formal inauguration by Dean of Engineering and GDG Chapter leads, followed by a visionary address on autonomous engineering, open-source leverage, and regional tech empowerment.",
    category: "Keynote",
    level: "All Levels",
    venue: "Main Auditorium (Auditorium 101)",
    speaker: "Dr. Ananya Patnaik",
    speakerRole: "Principal Cloud Architect & GDG Mentor",
    accent: "blue"
  },
  {
    id: "tk-d1-03",
    day: 1,
    time: "11:15 AM - 01:15 PM",
    startTime: "2026-10-16T11:15:00+05:30",
    endTime: "2026-10-16T13:15:00+05:30",
    code: "TK26-WS-AI1",
    title: "Hands-on Lab: Gemini 1.5 Multimodal API & Structured Output Engineering",
    desc: "Interactive deep-dive workshop. Build real-time document analyzers, image comprehension pipelines, and zero-shot schema extractors with Python and Vertex AI.",
    category: "Workshop",
    level: "Intermediate",
    venue: "Bansuri Guru CS Lab 3 (Lab 302)",
    speaker: "Rohan Samal",
    speakerRole: "Senior AI Engineer, Google Cloud Ecosystem",
    accent: "red"
  },
  {
    id: "tk-d1-04",
    day: 1,
    time: "11:15 AM - 01:15 PM",
    startTime: "2026-10-16T11:15:00+05:30",
    endTime: "2026-10-16T13:15:00+05:30",
    code: "TK26-WS-WEB1",
    title: "Full-Stack Cloud Run: Deploying Next-Gen Scalable Microservices",
    desc: "From local Docker containerization to automated Google Cloud Run rollout with custom domains, managed TLS, and concurrency tuning.",
    category: "Workshop",
    level: "Beginner",
    venue: "Seminar Hall 2 (Building 4)",
    speaker: "Amitabh Swain",
    speakerRole: "Staff Engineer, Atlassian",
    accent: "blue"
  },
  {
    id: "tk-d1-05",
    day: 1,
    time: "02:15 PM - 03:45 PM",
    startTime: "2026-10-16T14:15:00+05:30",
    endTime: "2026-10-16T15:45:00+05:30",
    code: "TK26-TLK-01",
    title: "Design Systems as Code: Bridge the Gap Between Figma & Production DOM",
    desc: "An architectural guide to design tokens, CSS custom properties, WCAG AAA contrast automation, and composable UI component primitives.",
    category: "Talk",
    level: "All Levels",
    venue: "Auditorium 101",
    speaker: "Tanvi Jena",
    speakerRole: "Staff UI/UX Systems Designer",
    accent: "yellow"
  },
  {
    id: "tk-d1-06",
    day: 1,
    time: "04:00 PM - 05:30 PM",
    startTime: "2026-10-16T16:00:00+05:30",
    endTime: "2026-10-16T17:30:00+05:30",
    code: "TK26-WS-MOB1",
    title: "Flutter 3.x Masterclass: Declarative Animations & Shader Pipelines",
    desc: "Master high-performance rendering on mobile: custom animation curves, Impeller rendering engine specifics, and reactive memory management.",
    category: "Workshop",
    level: "All Levels",
    venue: "Bansuri Guru CS Lab 2",
    speaker: "Priyanka Mishra",
    speakerRole: "Google Developer Expert (GDE)",
    accent: "green"
  },
  {
    id: "tk-d1-07",
    day: 1,
    time: "05:45 PM - 07:00 PM",
    startTime: "2026-10-16T17:45:00+05:30",
    endTime: "2026-10-16T19:00:00+05:30",
    code: "TK26-HACK-PRE",
    title: "24-Hour Hack Sprint: Problem Statement Reveal & Squad Formations",
    desc: "Official announcement of 5 real-world technical tracks, judging rubric briefing, mentor station assignments, and sandbox API key distribution.",
    category: "Hackathon",
    level: "All Levels",
    venue: "Auditorium 101 & SAC Arena",
    speaker: "Hackathon Technical Jury",
    speakerRole: "Industry Review Board",
    accent: "yellow"
  },

  // DAY 2 - Saturday, Oct 17
  {
    id: "tk-d2-01",
    day: 2,
    time: "09:00 AM - 10:00 AM",
    startTime: "2026-10-17T09:00:00+05:30",
    endTime: "2026-10-17T10:00:00+05:30",
    code: "TK26-HACK-GO",
    title: "HACK SPRINT TICK-OFF: 24-Hour Countdown Initiated",
    desc: "The clock starts for the ₹2,50,000 Hack Sprint! Teams occupy dedicated development pods with high-speed fiber drops, cloud credits, and mentor desks.",
    category: "Hackathon",
    level: "All Levels",
    venue: "Student Activity Center (SAC) Grand Arena",
    speaker: "Hackathon Operations Team",
    speakerRole: "GDG Technical Leads",
    accent: "yellow"
  },
  {
    id: "tk-d2-02",
    day: 2,
    time: "10:15 AM - 12:00 PM",
    startTime: "2026-10-17T10:15:00+05:30",
    endTime: "2026-10-17T12:00:00+05:30",
    code: "TK26-TLK-SYS",
    title: "System Design at Scale: Handling 10M+ Operations Without Downtime",
    desc: "Case studies in distributed data partitioning, eventual consistency tradeoffs, idempotency keys, and circuit breaker patterns.",
    category: "Talk",
    level: "Intermediate",
    venue: "Main Auditorium (Auditorium 101)",
    speaker: "Amitabh Swain",
    speakerRole: "Staff Engineer, Atlassian",
    accent: "blue"
  },
  {
    id: "tk-d2-03",
    day: 2,
    time: "12:15 PM - 01:45 PM",
    startTime: "2026-10-17T12:15:00+05:30",
    endTime: "2026-10-17T13:45:00+05:30",
    code: "TK26-WS-AI2",
    title: "Production RAG Architecture: Vector Databases, Chunking & Rerankers",
    desc: "Build an accurate contextual search pipeline. Avoid naive embeddings by implementing hybrid BM25 + dense search and cross-encoder reranking.",
    category: "Workshop",
    level: "Advanced",
    venue: "Bansuri Guru CS Lab 3",
    speaker: "Rohan Samal",
    speakerRole: "Senior AI Engineer, Google Cloud",
    accent: "red"
  },
  {
    id: "tk-d2-04",
    day: 2,
    time: "02:30 PM - 04:00 PM",
    startTime: "2026-10-17T14:30:00+05:30",
    endTime: "2026-10-17T16:00:00+05:30",
    code: "TK26-SEC-01",
    title: "Zero-Trust DevSecOps: Hardening Microservices & Supply Chains",
    desc: "Practical hands-on vulnerability scanning, Cosign cryptographic artifact signing, and policy enforcement via OPA Gatekeeper in Kubernetes.",
    category: "Talk",
    level: "Intermediate",
    venue: "Seminar Hall 2",
    speaker: "Debashis Mohanty",
    speakerRole: "Lead Security Researcher",
    accent: "yellow"
  },
  {
    id: "tk-d2-05",
    day: 2,
    time: "04:30 PM - 06:00 PM",
    startTime: "2026-10-17T16:30:00+05:30",
    endTime: "2026-10-17T18:00:00+05:30",
    code: "TK26-COMP-01",
    title: "Speed Coding Arena: Algorithmic Duel & Optimization Challenge",
    desc: "Fast-paced competitive programming showdown on custom judge platform with live leaderboard projecting onto the main auditorium screens.",
    category: "Competition",
    level: "All Levels",
    venue: "Main Auditorium & Lab 1",
    speaker: "CP Club Leads & Mentors",
    speakerRole: "Contest Coordinators",
    accent: "green"
  },
  {
    id: "tk-d2-06",
    day: 2,
    time: "07:30 PM - 09:30 PM",
    startTime: "2026-10-17T19:30:00+05:30",
    endTime: "2026-10-17T21:30:00+05:30",
    code: "TK26-MENTOR-CK",
    title: "Hack Sprint Checkpoint 1: 1-on-1 Mentor Architecture Reviews",
    desc: "Industry mentors visit every team table to critique database schemas, API architecture, UI/UX polish, and deployment feasibility.",
    category: "Hackathon",
    level: "All Levels",
    venue: "SAC Grand Arena",
    speaker: "18+ Assigned Technical Mentors",
    speakerRole: "Engineering Leads",
    accent: "yellow"
  },
  {
    id: "tk-d2-07",
    day: 2,
    time: "11:30 PM - 01:00 AM",
    startTime: "2026-10-17T23:30:00+05:30",
    endTime: "2026-10-18T01:00:00+05:30",
    code: "TK26-FUN-NIGHT",
    title: "Midnight Energizer: Lightning Trivia, Music & Dev Fuel Station",
    desc: "Late-night coffee, snacks, rapid-fire terminal trivia, mechanical keyboard testing station, and relaxing acoustic sets.",
    category: "Gaming/Fun",
    level: "All Levels",
    venue: "Central Courtyard & Food Lounge",
    speaker: "Student Welfare Committee",
    speakerRole: "Campus Community",
    accent: "neutral"
  },

  // DAY 3 - Sunday, Oct 18
  {
    id: "tk-d3-01",
    day: 3,
    time: "09:00 AM sharp",
    startTime: "2026-10-18T09:00:00+05:30",
    endTime: "2026-10-18T09:15:00+05:30",
    code: "TK26-HACK-END",
    title: "HACK SPRINT CODE FREEZE: Git Commit Lock",
    desc: "All repositories locked, PRs submitted, demo videos uploaded to Devfolio portal. 24 hours of non-stop building concludes.",
    category: "Hackathon",
    level: "All Levels",
    venue: "SAC Grand Arena & GitHub Portal",
    speaker: "Jury Coordination Panel",
    speakerRole: "Operations Lead",
    accent: "yellow"
  },
  {
    id: "tk-d3-02",
    day: 3,
    time: "09:30 AM - 12:30 PM",
    startTime: "2026-10-18T09:30:00+05:30",
    endTime: "2026-10-18T12:30:00+05:30",
    code: "TK26-DEMO-EXPO",
    title: "Interactive Demo Expo: Top 25 Projects Showcase",
    desc: "Open booth showcase where attendees, venture scouts, and judges walk the floor testing working prototypes and grading along 4 criteria.",
    category: "Hackathon",
    level: "All Levels",
    venue: "SAC Grand Exhibition Floor",
    speaker: "Top 25 Team Finalists",
    speakerRole: "Product Builders",
    accent: "yellow"
  },
  {
    id: "tk-d3-03",
    day: 3,
    time: "01:30 PM - 03:00 PM",
    startTime: "2026-10-18T13:30:00+05:30",
    endTime: "2026-10-18T15:00:00+05:30",
    code: "TK26-STAGE-TOP5",
    title: "Grand Stage Pitch: Top 5 Finalists Live Demo Before Grand Jury",
    desc: "Top 5 scoring teams pitch 5-minute live demonstrations followed by 3 minutes of rigorous technical Q&A by senior engineering leaders.",
    category: "Keynote",
    level: "All Levels",
    venue: "Main Auditorium (Auditorium 101)",
    speaker: "Finalist Teams & Grand Jury",
    speakerRole: "Judges & Builders",
    accent: "blue"
  },
  {
    id: "tk-d3-04",
    day: 3,
    time: "03:15 PM - 04:30 PM",
    startTime: "2026-10-18T15:15:00+05:30",
    endTime: "2026-10-18T16:30:00+05:30",
    code: "TK26-PANEL-FUT",
    title: "Executive Panel: Navigating Tech Careers in the Age of Generative Autonomy",
    desc: "Candid conversation between staff engineers, hiring managers, and founders on what actually sets junior engineers apart in 2026.",
    category: "Talk",
    level: "All Levels",
    venue: "Main Auditorium",
    speaker: "Full Speaker Delegation",
    speakerRole: "Industry Panelists",
    accent: "blue"
  },
  {
    id: "tk-d3-05",
    day: 3,
    time: "04:45 PM - 06:15 PM",
    startTime: "2026-10-18T16:45:00+05:30",
    endTime: "2026-10-18T18:15:00+05:30",
    code: "TK26-AWARDS-FIN",
    title: "Valedictory Ceremony, Trophy Presentation & Fellowship Announcements",
    desc: "Awarding the ₹2,50,000 cash prize pool, special category trophies, GDG community contributor fellowships, and official group photo.",
    category: "Keynote",
    level: "All Levels",
    venue: "Main Auditorium (Auditorium 101)",
    speaker: "Vice-Chancellor, SOA University & GDG Leads",
    speakerRole: "Dignitaries",
    accent: "red"
  }
];

export const PRIZE_POOL_BREAKDOWN = [
  {
    title: "Grand Champion",
    rank: "1ST PLACE",
    icon: "🏆",
    badge: "TOP BOUNTY",
    amount: "₹1,00,000",
    currency: "INR",
    perks: ["Direct fast-track interview with hiring partners", "Google Cloud credits ($2,000 USD)", "Champion Trophy & Deluxe Swag Box", "GDG Mentor Fellowship (6 Months)"]
  },
  {
    title: "First Runner-Up",
    rank: "2ND PLACE",
    icon: "🥈",
    badge: "SILVER PODIUM",
    amount: "₹60,000",
    currency: "INR",
    perks: ["Cloud credits ($1,000 USD)", "Runner-Up Trophy", "Curated Dev kit & swag"]
  },
  {
    title: "Second Runner-Up",
    rank: "3RD PLACE",
    icon: "🥉",
    badge: "BRONZE PODIUM",
    amount: "₹35,000",
    currency: "INR",
    perks: ["Cloud credits ($500 USD)", "Bronze Trophy", "Developer kit"]
  },
  {
    title: "Best Multimodal AI Innovation",
    rank: "SPECIAL TRACK",
    icon: "🤖",
    badge: "AI SPECIALIST",
    amount: "₹25,000",
    currency: "INR",
    perks: ["Specialist AI Trophy", "Vertex AI feature spotlight", "Sponsored by AI Track"]
  },
  {
    title: "Best UI/UX Craft & Accessibility",
    rank: "SPECIAL TRACK",
    icon: "🎨",
    badge: "DESIGN EXCELLENCE",
    amount: "₹20,000",
    currency: "INR",
    perks: ["UI Sphere Design Excellence Citation", "Specialist Craft Trophy", "Figma Pro sponsorship"]
  },
  {
    title: "Best All-Women Engineering Team",
    rank: "SPECIAL TRACK",
    icon: "⭐",
    badge: "WTM CITATION",
    amount: "₹10,000",
    currency: "INR",
    perks: ["Women Techmakers Odisha Citation", "Mentorship access & incubation"]
  }
];

export const FAQS_DATA = [
  {
    q: "Who is eligible to attend Tekno Krraft 2026?",
    a: "Tekno Krraft 2026 is open to undergraduate and postgraduate students from any recognized university or college across India, as well as early-career developers. Attendance is not limited to ITER / SOA students."
  },
  {
    q: "Is there any registration fee for the workshops or sessions?",
    a: "No. In accordance with Google Developer Groups community principles, admission to keynotes, technical tracks, workshops, and the hackathon is completely free of charge. Due to physical lab seating constraints (e.g. Bansuri Guru CS Labs), hands-on workshops require seat reservation through the portal."
  },
  {
    q: "What are the rules and team sizes for the 24-Hour Hack Sprint?",
    a: "Teams can consist of 2 to 4 members. Inter-college and inter-departmental teams are explicitly welcomed. All code must be authored during the official 24-hour hack period (October 17, 09:00 AM to October 18, 09:00 AM). Open-source libraries and APIs are fully permissible with proper attribution."
  },
  {
    q: "What hardware or software requirements should I prepare?",
    a: "Bring your personal laptop, power charger, and valid college/government photo identification. High-speed Wi-Fi, Ethernet drops in the hack arena, power strips, meals, late-night snacks, and beverage stations will be provided throughout the 3-day duration."
  },
  {
    q: "Will attendees receive certificates and swag?",
    a: "Yes. All verified attendees who check in and attend at least one core track will receive an official verifiable digital credential issued by GDG ITER Chapter. Shortlisted hackathon teams and workshop participants will also receive official Google Developer swag bags."
  },
  {
    q: "Where is the venue and how do I reach it?",
    a: "The festival takes place at the ITER Main Campus, Siksha 'O' Anusandhan (Deemed to be University), Khandagiri Square, Bhubaneswar, Odisha 751030. It is located approximately 15 minutes (7.5 km) from Bhubaneswar Biju Patnaik International Airport (BBI) and 20 minutes (9.5 km) from Bhubaneswar Railway Station (BBS)."
  }
];

export const SPONSORS_DATA = [
  { name: "Google Developers", tier: "Community Partner", logoText: "Google Developers", role: "Official Platform Ecosystem" },
  { name: "Google Cloud", tier: "Infrastructure Sponsor", logoText: "Google Cloud", role: "Compute & Vertex AI Credits" },
  { name: "Siksha 'O' Anusandhan", tier: "Host University", logoText: "SOA University", role: "Campus & Labs Host" },
  { name: "GitHub", tier: "Developer Tools Partner", logoText: "GitHub Education", role: "Student Developer Pack" },
  { name: "Devfolio", tier: "Hackathon Platform Partner", logoText: "Devfolio", role: "Submissions & Judging Portal" },
  { name: "Postman", tier: "API Partner", logoText: "Postman", role: "API Testing Suite & Swag" }
];
