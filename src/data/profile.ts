// Everything about you that appears on the site lives in this folder.
// Edit text here; the components only decide how it looks.

export const profile = {
  firstName: 'Rishikesh',
  lastName: 'Kallapally',
  handle: 'RishitheB0T',
  tagline: 'Building ideas into working systems.',
  // The hero types these one after another after "I build".
  roles: [
    'backends that prove their numbers.',
    'full-stack apps with applied AI.',
    'firmware down to the registers.',
  ],
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
  { project: 'product-catalog', next: 'Phase 11: k6 benchmarks and a performance report' },
  { project: 'kestrel-rtos', next: 'Real-board cycle counts on an STM32F4' },
  { project: 'rl-pid', next: 'Training a PPO agent from scratch for an STM32' },
]

export const principles = [
  {
    title: 'Design the flow',
    body: 'Plan in phases, diagram every request path, and record each decision with its trade-off. One repo alone has 47 written decisions.',
  },
  {
    title: 'Build the system',
    body: 'From an empty folder: schema, API, security, UI, containers and CI. No starter kits, no vendor HAL on the firmware side.',
  },
  {
    title: 'Show the evidence',
    body: 'Measured numbers, tests on real databases, and honest write-ups, including the query that got slower.',
  },
]

// Counted from the public repositories (October 2026).
export const totals = {
  tests: { value: 446, parts: [315, 107, 24] },
  commits: 105,
  linesOfCode: 27809,
  docsLines: 6006,
  endpoints: 35,
  decisions: 47,
}

// Lines of code by language across placement-prep, product-catalog-service and kestrel-rtos
// (source and tests; generated model files and lockfiles excluded).
export const languages = [
  { name: 'Java', lines: 14780, color: '#3987e5' },
  { name: 'TypeScript', lines: 7208, color: '#d95926' },
  { name: 'C', lines: 4190, color: '#199e70' },
  { name: 'Python', lines: 905, color: '#c98500' },
  { name: 'SQL', lines: 528, color: '#d55181' },
  { name: 'Assembly', lines: 198, color: '#008300' },
]
