export type ProjectKey = 'placement' | 'catalog' | 'kestrel' | 'edgemind' | 'rlpid'

export const projectNames: Record<ProjectKey, string> = {
  placement: 'placement-prep',
  catalog: 'product-catalog',
  kestrel: 'kestrel-rtos',
  edgemind: 'EdgeMind',
  rlpid: 'RL-PID',
}

export const projectColors: Record<ProjectKey, [string, string]> = {
  placement: ['#8b5cf6', '#d946ef'],
  catalog: ['#f59e0b', '#f97316'],
  kestrel: ['#22d3ee', '#34d399'],
  edgemind: ['#38bdf8', '#818cf8'],
  rlpid: ['#fb7185', '#f472b6'],
}

export type Tech = { name: string; icon?: string; usedIn: ProjectKey[] }
export type Layer = { name: string; blurb: string; items: Tech[] }

// icon = file name in public/icons (without .svg)
export const layers: Layer[] = [
  {
    name: 'Frontend',
    blurb: 'Role-aware single-page apps, tested like the backend.',
    items: [
      { name: 'React 19', icon: 'react', usedIn: ['placement'] },
      { name: 'TypeScript', icon: 'typescript', usedIn: ['placement'] },
      { name: 'Vite', icon: 'vitejs', usedIn: ['placement'] },
      { name: 'Tailwind CSS 4', icon: 'tailwindcss', usedIn: ['placement'] },
      { name: 'React Router 7', icon: 'reactrouter', usedIn: ['placement'] },
      { name: 'Axios', icon: 'axios', usedIn: ['placement'] },
      { name: 'Vitest + Testing Library', icon: 'vitest', usedIn: ['placement'] },
    ],
  },
  {
    name: 'Backend',
    blurb: 'Layered Spring services: controllers speak HTTP, services speak the domain.',
    items: [
      { name: 'Java 21', icon: 'java', usedIn: ['placement', 'catalog'] },
      { name: 'Spring Boot 4', icon: 'spring', usedIn: ['placement', 'catalog'] },
      { name: 'Spring Security + JWT', icon: 'spring', usedIn: ['placement'] },
      { name: 'Spring Data JPA', icon: 'hibernate', usedIn: ['placement', 'catalog'] },
      { name: 'Spring AI (RAG, tool calling)', icon: 'claude', usedIn: ['placement'] },
      { name: 'Bean Validation', usedIn: ['placement', 'catalog'] },
      { name: 'Maven', icon: 'maven', usedIn: ['placement', 'catalog'] },
      { name: 'JUnit + Mockito', icon: 'junit', usedIn: ['placement', 'catalog'] },
    ],
  },
  {
    name: 'Data & infrastructure',
    blurb: 'Schemas owned by migrations, tests on real containers, CI on every push.',
    items: [
      { name: 'PostgreSQL 16 + pgvector', icon: 'postgresql', usedIn: ['placement'] },
      { name: 'MySQL 8.4', icon: 'mysql', usedIn: ['catalog'] },
      { name: 'Redis', icon: 'redis', usedIn: ['catalog'] },
      { name: 'Flyway', icon: 'flyway', usedIn: ['placement', 'catalog'] },
      { name: 'Docker Compose', icon: 'docker', usedIn: ['placement', 'catalog'] },
      { name: 'Testcontainers', icon: 'docker', usedIn: ['placement', 'catalog'] },
      { name: 'GitHub Actions', icon: 'githubactions', usedIn: ['placement', 'kestrel'] },
      { name: 'nginx', icon: 'nginx', usedIn: ['placement'] },
      { name: 'Postman', icon: 'postman', usedIn: ['placement'] },
    ],
  },
  {
    name: 'Beyond the web',
    blurb: 'Bare-metal C, assembly and ML on microcontrollers.',
    items: [
      { name: 'C (freestanding)', icon: 'c', usedIn: ['kestrel', 'edgemind'] },
      { name: 'Thumb-2 assembly', usedIn: ['kestrel'] },
      { name: 'ARM Cortex-M4 / STM32F4', usedIn: ['kestrel', 'edgemind', 'rlpid'] },
      { name: 'CMSIS-DSP', usedIn: ['edgemind'] },
      { name: 'QEMU', usedIn: ['kestrel'] },
      { name: 'Python + NumPy', icon: 'numpy', usedIn: ['kestrel', 'edgemind', 'rlpid'] },
      { name: 'Reinforcement learning (PPO)', icon: 'python', usedIn: ['rlpid'] },
      { name: 'Control systems', usedIn: ['rlpid'] },
    ],
  },
  {
    name: 'Foundations',
    blurb: 'The fundamentals underneath all of it.',
    items: [
      { name: 'DSA in Java', icon: 'java', usedIn: [] },
      { name: 'OOP', usedIn: [] },
      { name: 'DBMS & SQL', usedIn: ['placement', 'catalog'] },
      { name: 'Computer networks', usedIn: [] },
      { name: 'Operating systems', usedIn: ['kestrel'] },
      { name: 'Git', icon: 'git', usedIn: ['placement', 'catalog', 'kestrel'] },
    ],
  },
]

// Logos for the scrolling strip under the hero.
export const marquee = [
  'java', 'spring', 'react', 'typescript', 'tailwindcss', 'vitejs', 'postgresql', 'mysql', 'redis',
  'docker', 'nginx', 'githubactions', 'git', 'python', 'c', 'maven', 'postman', 'junit', 'flyway', 'numpy',
]
