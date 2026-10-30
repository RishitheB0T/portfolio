import { useState } from 'react'
import { MousePointerClick } from 'lucide-react'
import { layers, projectColors, projectNames, type ProjectKey } from '../data/stack'
import { Reveal, SectionHeading, TechIcon } from '../components/ui'

type Focus = { kind: 'project'; key: ProjectKey } | { kind: 'tech'; name: string; usedIn: ProjectKey[] } | null

const keys = Object.keys(projectNames) as ProjectKey[]

export function Stack() {
  const [focus, setFocus] = useState<Focus>(null)
  const [pinned, setPinned] = useState<ProjectKey | null>(null)
  const active: Focus = focus ?? (pinned ? { kind: 'project', key: pinned } : null)

  const projectLit = (k: ProjectKey) => !active || (active.kind === 'project' ? active.key === k : active.usedIn.includes(k))
  const techLit = (usedIn: ProjectKey[], name: string) =>
    !active || (active.kind === 'project' ? usedIn.includes(active.key) : active.name === name)

  return (
    <section id="stack" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32" style={{ ['--accent' as string]: '#22d3ee', ['--accent-2' as string]: '#a78bfa' }}>
      <SectionHeading
        index="06"
        eyebrow="The stack"
        title={
          <>
            What I reach for, <span className="text-gradient">layer by layer.</span>
          </>
        }
        sub="Every tool here is used in at least one project above. Pick a project to light up its stack, or hover a tool to see where it’s used."
      />

      <Reveal className="sticky top-20 z-20 mb-8">
        <div className="glass frost flex flex-wrap items-center gap-2 rounded-2xl bg-ink-950/60 p-2.5">
          <span className="hidden items-center gap-1.5 px-2 text-xs text-fg-3 sm:flex">
            <MousePointerClick className="size-3.5" /> Projects
          </span>
          {keys.map((k) => {
            const [a, b] = projectColors[k]
            const lit = projectLit(k)
            return (
              <button
                key={k}
                onMouseEnter={() => setFocus({ kind: 'project', key: k })}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus({ kind: 'project', key: k })}
                onBlur={() => setFocus(null)}
                onClick={() => setPinned((p) => (p === k ? null : k))}
                aria-pressed={pinned === k}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition duration-300 ${
                  lit ? 'border-transparent text-ink-950' : 'border-white/10 text-fg-3 opacity-50'
                }`}
                style={lit ? { backgroundImage: `linear-gradient(90deg, ${a}, ${b})` } : undefined}
              >
                {projectNames[k]}
              </button>
            )
          })}
          {pinned && (
            <button onClick={() => setPinned(null)} className="ml-auto px-2 text-xs text-fg-3 hover:text-white">
              clear
            </button>
          )}
        </div>
      </Reveal>

      <div className="space-y-4">
        {layers.map((layer, li) => (
          <Reveal key={layer.name} delay={li * 70}>
            <div className="glass grid grid-cols-1 gap-4 rounded-3xl p-5 md:grid-cols-[14rem_1fr] md:p-6">
              <div>
                <div className="font-mono text-[11px] text-fg-3">layer {String(li + 1).padStart(2, '0')}</div>
                <h3 className="mt-1 text-xl font-semibold">{layer.name}</h3>
                <p className="mt-1 text-sm text-fg-3">{layer.blurb}</p>
              </div>
              <ul className="flex flex-wrap content-start gap-2">
                {layer.items.map((t) => {
                  const lit = techLit(t.usedIn, t.name)
                  return (
                    <li key={t.name}>
                      <span
                        tabIndex={0}
                        onMouseEnter={() => setFocus({ kind: 'tech', name: t.name, usedIn: t.usedIn })}
                        onMouseLeave={() => setFocus(null)}
                        onFocus={() => setFocus({ kind: 'tech', name: t.name, usedIn: t.usedIn })}
                        onBlur={() => setFocus(null)}
                        title={t.usedIn.length ? `Used in ${t.usedIn.map((k) => projectNames[k]).join(', ')}` : 'Fundamentals'}
                        className={`inline-flex cursor-default items-center gap-2 rounded-xl border px-3 py-2 text-sm transition duration-300 ${
                          lit
                            ? active
                              ? 'border-cyan-300/40 bg-cyan-300/10 text-white shadow-[0_0_24px_-8px_rgba(34,211,238,.7)]'
                              : 'border-white/10 bg-white/[0.04] text-fg-2 hover:border-white/25 hover:text-white'
                            : 'border-white/[0.05] bg-transparent text-fg-3 opacity-35'
                        }`}
                      >
                        {t.icon && <TechIcon name={t.icon} className="size-4.5" />}
                        {t.name}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
