import { Activity, ArrowRight, GraduationCap } from 'lucide-react'
import { edgemind, education, now, principles } from '../data/profile'
import { Reveal, SectionHeading, Spotlight } from '../components/ui'
import { TypedTerminal, type TermLine } from '../components/TypedTerminal'

const whoami: TermLine[] = [
  { kind: 'cmd', text: 'whoami' },
  { kind: 'out', text: 'Rishikesh Kallapally · EIE undergrad @ NIT Silchar, class of 2027', tone: 'accent' },
  { kind: 'cmd', text: 'cat focus.txt' },
  { kind: 'out', text: 'backend     Java 21 · Spring Boot · Spring Security (JWT) · JPA · Flyway' },
  { kind: 'out', text: 'frontend    React 19 · TypeScript · Vite · Tailwind CSS · Vitest' },
  { kind: 'out', text: 'data + AI   PostgreSQL/pgvector · MySQL · Redis · Spring AI · RAG' },
  { kind: 'out', text: 'embedded    C · Thumb-2 assembly · Cortex-M4 (STM32F4) · CMSIS-DSP' },
  { kind: 'cmd', text: 'ls ~/projects' },
  { kind: 'out', text: 'placement-prep/  product-catalog-service/  kestrel-rtos/  RL_PID/  edgemind/', tone: 'ok' },
  { kind: 'cmd', text: 'echo $STATUS' },
  { kind: 'out', text: 'open to software engineering roles · placement season 2026–27', tone: 'warn' },
]

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32" style={{ ['--accent' as string]: '#c084fc', ['--accent-2' as string]: '#22d3ee' }}>
      <SectionHeading
        index="01"
        eyebrow="whoami"
        title={
          <>
            Software first. Hardware-curious. <span className="text-gradient">Evidence always.</span>
          </>
        }
        sub="I build backends and full-stack apps, add AI where it earns its place, and write firmware on the side. Every project here was started from an empty folder, and every number on this page was measured."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <TypedTerminal lines={whoami} title="~/rishikesh — zsh" minHeight={330} className="h-full" />
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Reveal delay={80} className="sm:col-span-2">
            <Spotlight className="h-full p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/30">
                  <GraduationCap className="size-5 text-white" />
                </div>
                <span className="font-mono text-xs text-fg-3">{education.years}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{education.degree}</h3>
              <p className="mt-1 text-sm text-fg-2">{education.school}</p>
              <a
                href="#rl-pid"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-rose-300/20 bg-gradient-to-r from-rose-400/15 to-fuchsia-500/10 px-4 py-2.5 text-sm text-fg-2 transition hover:border-rose-300/40 hover:text-white"
              >
                Final-year project: <b className="font-mono text-white">RL_PID</b>, a PPO-tuned PID controller <ArrowRight className="size-3.5" />
              </a>
            </Spotlight>
          </Reveal>

          <Reveal delay={160}>
            <Spotlight className="h-full p-6" style={{ ['--accent' as string]: '#38bdf8' }}>
              <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg shadow-sky-500/30">
                <Activity className="size-5 text-white" />
              </div>
              <h3 className="mt-5 text-lg leading-snug font-semibold">{edgemind.title}</h3>
              <p className="mt-1 text-sm text-fg-2">
                {edgemind.what} · {edgemind.when}
              </p>
              <a href="#research" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sky-300 hover:text-sky-200">
                See how it works <ArrowRight className="size-3.5" />
              </a>
            </Spotlight>
          </Reveal>

          <Reveal delay={240}>
            <Spotlight className="h-full p-6" style={{ ['--accent' as string]: '#34d399' }}>
              <div className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-widest text-emerald-300 uppercase">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 rounded-full bg-emerald-400" style={{ animation: 'ping-soft 1.8s infinite' }} />
                  <span className="relative size-2 rounded-full bg-emerald-400" />
                </span>
                Building now
              </div>
              <ul className="space-y-2.5">
                {now.map((n) => (
                  <li key={n.project} className="text-sm leading-snug">
                    <span className="font-mono text-xs text-fg-3">{n.project}</span>
                    <div className="text-fg-2">{n.next}</div>
                  </li>
                ))}
              </ul>
            </Spotlight>
          </Reveal>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        {principles.map((p, i) => (
          <Reveal key={p.title} delay={i * 90}>
            <Spotlight className="gradient-border h-full p-6">
              <div className="font-mono text-5xl font-bold text-white/[0.07]">0{i + 1}</div>
              <h3 className="-mt-4 text-xl font-semibold">{p.title}.</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-2">{p.body}</p>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
