import { content } from "../content/content";

// ── Level 1: Timeline ─────────────────────────────────────────
// Education is game-only; the jobs come from the shared content.json, oldest first.
const EDUCATION = {
  id: "tut",
  year: "2016–2019",
  title: "Tshwane University of Technology",
  role: "National Diploma: Information Technology",
  detail: "Specialised in Intelligent Industrial Systems: software development, OOP, data structures and systems.",
  icon: "🎓",
  xp: 40,
};

// Keeps the quest IDs that returning players already have in their saved progress.
const JOB_QUESTS: Record<string, { id: string; icon: string; xp: number }> = {
  "Tshwane University of Technology": { id: "tut_assistant", icon: "👨‍🏫", xp: 40 },
  "The Digital Academy": { id: "digital_academy", icon: "🚀", xp: 50 },
  "Digital Solution Foundry": { id: "dsf", icon: "🏢", xp: 70 },
};

export const TIMELINE = [
  EDUCATION,
  ...[...content.experience].reverse().map((job) => {
    const quest = JOB_QUESTS[job.company] ?? {
      id: `${job.company}-${job.start}`.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
      icon: "💼",
      xp: 50,
    };
    return {
      id: quest.id,
      year: job.period,
      title: job.company,
      role: job.role,
      detail: `${job.points.join(". ")}.`,
      icon: quest.icon,
      xp: quest.xp,
    };
  }),
];

// ── Level 2: Skill Tree ───────────────────────────────────────
export const SKILL_TREE = [
  {
    id: "csharp",    label: "C#",           icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    proficiency: 80, category: "backend",   years: "3+",
    detail: "Primary enterprise language. Used daily at DSF for .NET Core APIs, background services, Azure Functions.",
    unlocks: ["dotnet", "azure_functions"],
  },
  {
    id: "dotnet",    label: ".NET Core",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg",
    proficiency: 80, category: "backend",   years: "3+",
    detail: "REST APIs, Web APIs, Worker Services, Blazor WASM. Production systems at DSF.",
    unlocks: ["blazor"],
  },
  {
    id: "typescript",label: "TypeScript",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    proficiency: 85, category: "frontend",  years: "3+",
    detail: "Across every JS framework — Vue 3, React, Next.js, Angular. Strict mode, generics, utility types.",
    unlocks: ["vue", "react", "nextjs", "angular"],
  },
  {
    id: "vue",       label: "Vue.js 3",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    proficiency: 80, category: "frontend",  years: "3+",
    detail: "Composition API, Pinia, Vue Router. Primary frontend at DSF for enterprise UIs.",
    unlocks: [],
  },
  {
    id: "react",     label: "React",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    proficiency: 85, category: "frontend",  years: "2+",
    detail: "Hooks, Zustand, React Query, Framer Motion. Used across personal projects and this very site.",
    unlocks: ["nextjs"],
  },
  {
    id: "nextjs",    label: "Next.js",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    proficiency: 80, category: "frontend",  years: "2+",
    detail: "App Router, SSR, ISR, API routes. The main portfolio at www.jaykimsly.co.za and the portfolio hub are built on it.",
    unlocks: [],
  },
  {
    id: "angular",   label: "Angular",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    proficiency: 75, category: "frontend",  years: "1+",
    detail: "Signals, standalone components, RxJS. Trained at The Digital Academy.",
    unlocks: [],
  },
  {
    id: "azure",     label: "Azure",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
    proficiency: 75, category: "devops",    years: "2+",
    detail: "Azure Portal, Azure DevOps Server, Function Apps, Blob Storage, CI/CD pipelines.",
    unlocks: ["azure_functions", "docker"],
  },
  {
    id: "azure_functions", label: "Azure Functions", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
    proficiency: 70, category: "devops",    years: "2+",
    detail: "Production Speech-to-Text pipeline, scheduled jobs, HTTP triggers at DSF.",
    unlocks: [],
  },
  {
    id: "docker",    label: "Docker",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    proficiency: 70, category: "devops",    years: "2+",
    detail: "Containerised deployments, Compose, Dockerfile optimisation.",
    unlocks: [],
  },
  {
    id: "blazor",    label: "Blazor WASM", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg",
    proficiency: 72, category: "frontend",  years: "1+",
    detail: "C# in the browser. Built the Blazor portfolio as a full WASM SPA.",
    unlocks: [],
  },
  {
    id: "sqlserver", label: "SQL Server",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
    proficiency: 80, category: "database",  years: "3+",
    detail: "Complex queries, stored procedures, Power BI data models, performance tuning.",
    unlocks: [],
  },
  {
    id: "flutter",   label: "Flutter",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
    proficiency: 70, category: "mobile",    years: "2+",
    detail: "Cross-platform mobile apps. Used at DSF alongside the web stack.",
    unlocks: [],
  },
];

export type SkillCategory = "backend" | "frontend" | "devops" | "database" | "mobile";
export const CATEGORY_COLORS: Record<SkillCategory, string> = {
  backend:  "#3B82F6",
  frontend: "#10B981",
  devops:   "#F59E0B",
  database: "#8B5CF6",
  mobile:   "#EC4899",
};

// ── Level 3: Boss Projects ────────────────────────────────────
export const BOSS_PROJECTS = [
  {
    id: "portfolio_gateway",
    name: "Portfolio Hub",
    emoji: "🌐",
    hp: 400,
    difficulty: "LEGENDARY",
    stack: ["Next.js", "TypeScript", "Supabase", "Framer Motion"],
    description: "Hub for five focused portfolios, each built in a different framework, with private visitor analytics.",
    url: "https://hub.jaykimsly.co.za",
    github: "https://github.com/jaykimsly/portfolio-gateway",
    attacks: [
      { id: "architecture", label: "View Architecture",  damage: 100, xp: 80 },
      { id: "onboarding",   label: "Browse the Portfolios", damage: 100, xp: 60 },
      { id: "analytics",    label: "Check Analytics",    damage: 100, xp: 60 },
      { id: "live",         label: "Visit Live Site",    damage: 100, xp: 80 },
    ],
  },
  {
    id: "dsf_enterprise",
    name: "Enterprise Case Management",
    emoji: "🐉",
    hp: 500,
    difficulty: "BOSS",
    stack: [".NET Core", "C#", "Vue.js 3", "SQL Server", "Azure"],
    description: "Production enterprise systems at DSF: case management and workflow platforms, Azure Function Apps, a speech-to-text pipeline and Power BI reporting.",
    url: null,
    github: null,
    attacks: [
      { id: "backend",   label: "Study Backend Design",  damage: 125, xp: 100 },
      { id: "azure",     label: "Review Azure Setup",    damage: 125, xp: 100 },
      { id: "frontend",  label: "Inspect Vue Frontend",  damage: 125, xp: 80  },
      { id: "reporting", label: "Check Power BI Models", damage: 125, xp: 80  },
    ],
  },
  {
    id: "magobholi",
    name: "Magobholi",
    emoji: "🦁",
    hp: 300,
    difficulty: "ELITE",
    stack: ["React", "TypeScript"],
    description: "Responsive business website presenting the brand, its services and how to get in touch.",
    url: "https://www.magobholi.co.za",
    github: "https://github.com/jaykimsly/magobholi",
    attacks: [
      { id: "ecommerce", label: "Explore the Site",      damage: 100, xp: 70 },
      { id: "payments",  label: "Check Responsive Layout", damage: 100, xp: 80 },
      { id: "admin",     label: "Review the Brand",  damage: 100, xp: 70 },
    ],
  },
  {
    id: "hospital",
    name: "Hospital Management System",
    emoji: "🏥",
    hp: 300,
    difficulty: "ELITE",
    stack: ["React", "Node.js", "PostgreSQL", "Express"],
    description: "Full-stack hospital management with patient records, scheduling, and admin dashboards.",
    url: "https://hospital-management-system-phi.vercel.app",
    github: "https://github.com/jaykimsly/Hospital-Management-System",
    attacks: [
      { id: "patients",   label: "Patient Records",   damage: 100, xp: 70 },
      { id: "scheduling", label: "Scheduling System", damage: 100, xp: 70 },
      { id: "live",       label: "Visit Live Demo",   damage: 100, xp: 80 },
    ],
  },
];

// ── Level 4: Bug Hunt ─────────────────────────────────────────
export const BUGS = [
  { id: "null_ref",     emoji: "👻", name: "NullReference Beast",  hint: "Hiding in the top-left corner",      xp: 75,  desc: "Unhandled null access — the classic." },
  { id: "memory_leak",  emoji: "🧠", name: "Memory Leak Monster",  hint: "Lurking near the skill tree",         xp: 100, desc: "Unreleased event listener from Level 2." },
  { id: "off_by_one",   emoji: "🔢", name: "Off-By-One Goblin",    hint: "Somewhere in the timeline",           xp: 75,  desc: "Array index out of bounds — starts at 0, not 1." },
  { id: "race_cond",    emoji: "🏎️", name: "Race Condition Demon",  hint: "Appears when you click very fast",   xp: 150, desc: "Async state update collision — forgot to debounce." },
  { id: "cors_error",   emoji: "🚫", name: "CORS Goblin",          hint: "Near the contact section",            xp: 75,  desc: "Missing Access-Control header on the API." },
  { id: "css_glitch",   emoji: "👾", name: "CSS Phantom",          hint: "Check the bottom-right area",         xp: 75,  desc: "z-index conflict — element hidden behind overlay." },
  { id: "404_goblin",   emoji: "🕳️", name: "404 Goblin",           hint: "Follow the broken link...",           xp: 100, desc: "Route exists in code but not in the router config." },
];

// ── Level 5: DevOps Pipeline ──────────────────────────────────
export const PIPELINE_STAGES = [
  { id: "code",     label: "Write Code",         icon: "💻", desc: "Feature branch on GitHub" },
  { id: "commit",   label: "Commit & Push",       icon: "📤", desc: "Git push triggers CI" },
  { id: "ci",       label: "CI Pipeline",          icon: "⚙️", desc: "Tests, lint, build check" },
  { id: "docker",   label: "Docker Build",         icon: "🐳", desc: "Containerise the app" },
  { id: "registry", label: "Push to Registry",     icon: "📦", desc: "Azure Container Registry" },
  { id: "staging",  label: "Deploy to Staging",    icon: "🧪", desc: "Review app on staging URL" },
  { id: "approve",  label: "Manual Approval",      icon: "✅", desc: "Senior engineer signs off" },
  { id: "prod",     label: "Deploy to Production", icon: "🚀", desc: "Azure App Service / Static Web App" },
];

// ── Level 6: Architecture Challenge ──────────────────────────
export const ARCH_QUESTIONS = [
  {
    id: "scale_100k",
    scenario: "Your app suddenly needs to handle 100k concurrent users. Current stack is a single .NET monolith + SQL Server.",
    question: "What's your first move?",
    options: [
      { id: "a", label: "Vertical scale — upgrade the server",               correct: false, feedback: "Buys time but hits a ceiling fast. Not sustainable." },
      { id: "b", label: "Add a load balancer + horizontal scaling",          correct: true,  feedback: "Correct. Stateless API + load balancer + connection pooling handles horizontal scale cleanly before microservices." },
      { id: "c", label: "Rewrite to microservices immediately",              correct: false, feedback: "Premature. Microservices add operational complexity before you've exhausted simpler options." },
      { id: "d", label: "Cache everything with Redis",                       correct: false, feedback: "Caching helps but doesn't solve the compute bottleneck." },
    ],
    xp: 200,
    jmAnswer: "Load balancer + horizontal scaling first. Then introduce caching (Redis), async queues for heavy operations, and read replicas for the DB. Microservices only if a specific domain needs independent scaling.",
  },
  {
    id: "azure_function",
    scenario: "You need to process 10,000 audio files per day — transcribe each one to text (Speech-to-Text). Files arrive unpredictably in batches.",
    question: "Which Azure architecture fits best?",
    options: [
      { id: "a", label: "Azure App Service with a background thread",        correct: false, feedback: "Works but wastes compute when idle and may timeout on large batches." },
      { id: "b", label: "Azure Function App triggered by Blob Storage",      correct: true,  feedback: "Correct. Each file upload triggers a Function — event-driven, auto-scales, pay-per-execution. Exactly how it runs at DSF." },
      { id: "c", label: "A VM running a Node.js cron job every 5 minutes",   correct: false, feedback: "Polling waste. You'd either miss files or process them late." },
      { id: "d", label: "Kubernetes cluster with a queue consumer",          correct: false, feedback: "Overkill for this volume — K8s adds management overhead you don't need." },
    ],
    xp: 200,
    jmAnswer: "Azure Function App with Blob Storage trigger. File lands in storage → Function fires → Speech-to-Text API processes it → result stored. Zero idle compute cost, auto-scales with burst, and I've shipped exactly this in production.",
  },
  {
    id: "db_choice",
    scenario: "New SaaS product: multi-tenant, complex relational data (users, orgs, permissions, billing), but also needs JSON flexibility for custom fields per tenant.",
    question: "Which database strategy do you use?",
    options: [
      { id: "a", label: "Pure MongoDB — schema-less for flexibility",        correct: false, feedback: "Loses referential integrity. Complex relations in NoSQL become painful quickly." },
      { id: "b", label: "SQL Server with JSONB columns for custom fields",   correct: true,  feedback: "Correct. Relational integrity where it matters, JSON flexibility where needed. Best of both worlds." },
      { id: "c", label: "Two separate DBs — PostgreSQL + MongoDB",           correct: false, feedback: "Dual-DB adds sync complexity and transaction boundaries become a nightmare." },
      { id: "d", label: "Pure PostgreSQL with EAV pattern for custom fields",correct: false, feedback: "EAV is a query performance trap. JSONB columns are cleaner." },
    ],
    xp: 200,
    jmAnswer: "PostgreSQL or SQL Server with JSONB/JSON columns. Core domain stays relational (foreign keys, constraints, transactions), custom fields live in a JSON column. One DB, clean architecture.",
  },
];
