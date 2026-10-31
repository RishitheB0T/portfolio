import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Cpu, FlaskConical, GraduationCap, Rocket, Sparkles } from 'lucide-react'
import { Reveal, SectionHeading } from '../components/ui'

const steps: { when: string; title: string; body: ReactNode; icon: ReactNode; now?: boolean }[] = [
  {
    when: '2023',
    title: 'Joined NIT Silchar',
    body: 'B.Tech in Electronics & Instrumentation Engineering: signals, control and embedded systems, with software growing alongside.',
    icon: <GraduationCap />,
  },
  {
    when: 'May – July 2026',
    title: 'Started EdgeMind',
    body: 'ML-based vibration fault detection on an STM32F407: a CMSIS-DSP FFT and a decision tree exported to bare-metal C.',
    icon: <FlaskConical />,
  },
  {
    when: 'September 2026',
    title: 'Shipping software: placement-prep',
    body: 'From an empty folder on Sep 11 to a four-role platform with AI resume feedback, a tool-calling assistant, RAG search and 315 tests.',
    icon: <Rocket />,
  },
  {
    when: 'October 2026',
    title: 'product-catalog-service and kestrel-rtos',
    body: 'A measured, documented Spring Boot + MySQL + Redis backend in 16 phases, and a from-scratch RTOS with an int8 NN runtime. RL-PID with Team Viper in parallel.',
    icon: <Cpu />,
  },
  {
    when: 'Now',
    title: 'Placement season 2026–27',
    body: 'Open to software engineering roles. Next up: AI mock interviews, k6 benchmarks, real-board cycle counts and the PPO agent.',
    icon: <Sparkles />,
    now: true,
  },
]

export function Journey() {
  const ref = useRef<HTMLOListElement>(null)
  const [fill, setFill] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const mid = window.innerHeight * 0.6
        setFill(Math.min(1, Math.max(0, (mid - r.top) / r.height)))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="journey" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32" style={{ ['--accent' as string]: '#34d399', ['--accent-2' as string]: '#a78bfa' }}>
      <SectionHeading
        index="05"
        eyebrow="Journey"
        title={
          <>
            How I got here, <span className="text-gradient">and what’s next.</span>
          </>
        }
      />
      <ol ref={ref} className="relative mx-auto max-w-4xl">
        <span className="absolute top-0 bottom-0 left-[19px] w-0.5 rounded bg-white/[0.08] md:left-1/2 md:-ml-px" aria-hidden />
        <span
          className="absolute top-0 left-[19px] w-0.5 rounded bg-gradient-to-b from-violet-400 via-fuchsia-400 to-emerald-300 shadow-[0_0_16px_rgba(217,70,239,.7)] md:left-1/2 md:-ml-px"
          style={{ height: `${fill * 100}%` }}
          aria-hidden
        />
        {steps.map((s, i) => {
          const right = i % 2 === 1
          return (
            <li key={s.title} className="relative grid grid-cols-[40px_1fr] gap-5 pb-12 last:pb-0 md:grid-cols-[1fr_40px_1fr] md:gap-8">
              {right && <div className="hidden md:order-1 md:block" />}
              <div className="relative z-10 md:order-2">
                <span
                  className={`grid size-10 place-items-center rounded-full border-2 [&>svg]:size-4.5 ${
                    s.now
                      ? 'border-emerald-300 bg-emerald-400 text-ink-950 shadow-[0_0_24px_rgba(52,211,153,.6)]'
                      : 'border-white/15 bg-ink-850 text-fuchsia-200'
                  }`}
                >
                  {s.icon}
                </span>
              </div>
              <Reveal className={right ? 'md:order-3' : 'md:order-1 md:text-right'}>
                <div className={`font-mono text-xs tracking-wider uppercase ${s.now ? 'text-emerald-300' : 'text-fuchsia-300'}`}>{s.when}</div>
                <h3 className="mt-1.5 text-xl font-semibold md:text-2xl">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-fg-2">{s.body}</p>
              </Reveal>
              {!right && <div className="hidden md:order-3 md:block" />}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
