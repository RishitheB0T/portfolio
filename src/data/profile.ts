// Everything about you that appears on the site lives in this folder.
// Edit text here; the components only decide how it looks.

export const profile = {
  firstName: 'Rishikesh',
  lastName: 'Kallapally',
  handle: 'RishitheB0T',
  tagline: 'Building ideas into working systems.',
  // The hero types these one after another after "I build" (the same lines as the GitHub profile header).
  roles: [
    'Spring Boot APIs.',
    'full-stack React apps.',
    'LLM tools in Java.',
    'caches, then measure them.',
    'a tiny RTOS from scratch.',
    'a tiny language model from scratch.',
  ],
  // The speech bubble next to the photo cycles through these.
  quips: ['it works on my machine', 'git commit final_v2_FINAL', 'talk is cheap, show me the code', 'sleep(0), placement season'],
  intro:
    'EIE undergrad at NIT Silchar, class of 2027. Java and Spring Boot first, React and TypeScript on top, and C with Thumb-2 assembly when the hardware calls. I measure what I build and write down why.',
  availability: 'Open to software engineering roles · placement season 2026–27',
  motto: ['Design the flow.', 'Build the system.', 'Show the evidence.'],
}

// Leave a link empty ('') to hide its button. Add yours when ready.
export const links = {
  github: 'https://github.com/RishitheB0T',
  linkedin: 'https://www.linkedin.com/in/rishikesh-kallapally-b2683428a/',
  email: 'rishikeshkallapally@gmail.com',
  resume: '',
  sourceOfThisSite: 'https://github.com/RishitheB0T/portfolio',
}

export const education = {
  degree: 'B.Tech, Electronics & Instrumentation Engineering',
  school: 'National Institute of Technology Silchar',
  years: '2023 – 2027',
}

export const edgemind = {
  title: 'EdgeMind',
  what: 'ML-based vibration fault detection on an STM32',
  when: 'May – July 2026',
}

// What is being built right now (from each project's roadmap).
export const now = [
  { project: 'placement-prep', next: 'Adding company-wise AI mock interviews' },
  { project: 'product-catalog', next: 'Phase 14: production containers and CI' },
  { project: 'kestrel-rtos', next: 'Real-board cycle counts on an STM32F4' },
  { project: 'RL_PID', next: 'Running the controller on a real STM32F407 board' },
]

export const principles = [
  {
    title: 'Design the flow',
    body: 'Plan in phases, diagram every request path, and record each decision with its trade-off. One repo alone has 53 written decisions.',
  },
  {
    title: 'Build the system',
    body: 'From an empty folder: schema, API, security, UI, containers and CI. No starter kits, and no vendor HAL or libc in the RTOS.',
  },
  {
    title: 'Show the evidence',
    body: 'Measured numbers, tests on real databases, and honest write-ups, including the query that got slower.',
  },
]

// Counted from the public repositories (October 2026).
export const totals = {
  tests: { value: 502, parts: [342, 125, 24, 11] },
  commits: 162,
  linesOfCode: 33134,
  docsLines: 7667,
  endpoints: 36,
  decisions: 53,
}

// Lines of code by language across placement-prep, product-catalog-service, kestrel-rtos and RL_PID
// (source and tests; generated model files, vendor config headers and lockfiles excluded).
export const languages = [
  { name: 'Java', lines: 16170, color: '#3987e5' },
  { name: 'TypeScript', lines: 7604, color: '#d95926' },
  { name: 'C', lines: 4715, color: '#199e70' },
  { name: 'Python', lines: 2337, color: '#c98500' },
  { name: 'JavaScript', lines: 1566, color: '#d55181' },
  { name: 'SQL', lines: 544, color: '#008300' },
  { name: 'Assembly', lines: 198, color: '#9085e9' },
]
