import { ArrowDown } from 'lucide-react'
import { Reveal, SectionHeading } from '../components/ui'
import { PlacementPrep } from './PlacementPrep'
import { ProductCatalog } from './ProductCatalog'
import { Kestrel } from './Kestrel'
import { RlPid } from './RlPid'

const cards = [
  {
    id: 'placement-prep',
    name: 'placement-prep',
    kind: 'Full stack + applied AI',
    line: 'Drives, eligibility, applications, reminders, AI resume feedback, a streaming tool-calling assistant and hybrid RAG search.',
    metric: '342',
    metricLabel: 'tests passing',
    grad: 'from-violet-500 via-fuchsia-500 to-pink-500',
    glow: 'shadow-fuchsia-500/20',
    img: './images/placement-prep/drives-all-thumb.webp',
  },
  {
    id: 'product-catalog',
    name: 'product-catalog-service',
    kind: 'Backend performance',
    line: 'Spring Boot over MySQL and Redis with a React storefront: indexes from measured plans, a cache load-tested with k6.',
    metric: '483×',
    metricLabel: 'faster storefront query',
    grad: 'from-amber-300 via-orange-400 to-rose-500',
    glow: 'shadow-amber-500/20',
    img: './images/catalog/storefront.webp',
  },
  {
    id: 'kestrel-rtos',
    name: 'kestrel-rtos',
    kind: 'Embedded systems',
    line: 'A from-scratch RTOS for Cortex-M4 with MPU isolation, priority inheritance and an int8 CNN on SIMD kernels.',
    metric: '4.11×',
    metricLabel: 'fewer instructions',
    grad: 'from-cyan-300 via-teal-400 to-emerald-400',
    glow: 'shadow-cyan-500/20',
  },
  {
    id: 'rl-pid',
    name: 'RL_PID',
    kind: 'Reinforcement learning + control',
    line: 'A PPO agent that retunes a PID every 0.2 s to control an unstable process, ported to C for an STM32F407.',
    metric: '4/4',
    metricLabel: 'metrics better than the published agent',
    grad: 'from-rose-300 via-pink-400 to-fuchsia-500',
    glow: 'shadow-rose-500/20',
    img: './images/rl-pid/demo-poster.webp',
  },
]

export function Builds() {
  return (
    <section id="builds" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32" style={{ ['--accent' as string]: '#a78bfa', ['--accent-2' as string]: '#f472b6' }}>
      <SectionHeading
        index="03"
        eyebrow="Featured builds"
        title={
          <>
            Four systems, <span className="text-gradient">built from an empty folder.</span>
          </>
        }
        sub="A full-stack platform with applied AI, a performance-focused backend, an operating system for a microcontroller, and a reinforcement-learning controller. Each one below is a deep dive: what it does, how it’s built, and the evidence."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.id} delay={i * 100}>
            <a href={`#${c.id}`} className={`group relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900 p-6 shadow-2xl ${c.glow} transition duration-300 hover:-translate-y-1.5`}>
              <div className={`absolute -top-24 -right-24 size-64 rounded-full bg-gradient-to-br ${c.grad} opacity-25 blur-3xl transition group-hover:opacity-40`} />
              {c.img && (
                <img
                  src={c.img}
                  alt=""
                  loading="lazy"
                  className="absolute -right-10 -bottom-6 w-64 rotate-[-8deg] rounded-xl border border-white/10 opacity-25 transition duration-500 group-hover:rotate-[-4deg] group-hover:opacity-40"
                />
              )}
              <div className="relative">
                <div className="font-mono text-xs text-fg-3">
                  03.{i + 1} · {c.kind}
                </div>
                <h3 className="mt-3 font-mono text-2xl font-bold">{c.name}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-2">{c.line}</p>
                <div className={`mt-8 bg-gradient-to-r bg-clip-text text-6xl font-semibold tracking-tight text-transparent ${c.grad}`}>{c.metric}</div>
                <div className="text-sm text-fg-2">{c.metricLabel}</div>
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                  Deep dive <ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mt-28 space-y-36">
        <PlacementPrep />
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <ProductCatalog />
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <Kestrel />
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <RlPid />
      </div>
    </section>
  )
}
