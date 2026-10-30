import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { ArrowDown, CheckCircle2, Command, Cpu, Gauge, Sparkles } from 'lucide-react'
import { profile, links, totals } from '../data/profile'
import { marquee } from '../data/stack'
import { useReducedMotion } from '../lib/hooks'
import { GithubIcon, LinkedinIcon } from '../components/brand'
import { ParticleField } from '../components/ParticleField'
import { BrowserFrame, Counter, LinkButton, TechIcon } from '../components/ui'

function RoleTyper() {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const word = profile.roles[i]

  useEffect(() => {
    if (reduced) return
    let t: number
    if (!deleting && n < word.length) t = window.setTimeout(() => setN(n + 1), 45)
    else if (!deleting) t = window.setTimeout(() => setDeleting(true), 2200)
    else if (n > 0) t = window.setTimeout(() => setN(n - 1), 22)
    else {
      setDeleting(false)
      setI((i + 1) % profile.roles.length)
    }
    return () => window.clearTimeout(t)
  }, [n, deleting, word, i, reduced])

  return (
    <p className="mt-6 min-h-[2lh] font-display text-xl text-fg-2 sm:min-h-0 md:text-2xl" aria-label={`I build ${profile.roles.join(' ')}`}>
      I build{' '}
      <span className="font-semibold text-white">
        {reduced ? profile.roles[0] : word.slice(0, n)}
        <span className="caret bg-fuchsia-400" />
      </span>
    </p>
  )
}

function HeroCollage() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMove = (e: MouseEvent) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative mx-auto w-full max-w-xl [perspective:1400px]"
      aria-hidden
    >
      <div
        className="relative transition-transform duration-300 ease-out [transform-style:preserve-3d]"
        style={{ transform: `rotateY(${-10 + tilt.x * 14}deg) rotateX(${6 - tilt.y * 10}deg)` }}
      >
        <div className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-tr from-violet-600/40 via-fuchsia-500/25 to-cyan-400/30 blur-3xl" />
        <BrowserFrame url="placement-prep · student dashboard" className="[transform:translateZ(0px)]">
          <img
            src="./images/placement-prep/student-dashboard.webp"
            alt=""
            width={1440}
            height={900}
            className="block w-full"
            fetchPriority="high"
          />
        </BrowserFrame>

        <div className="absolute -bottom-10 -left-6 w-[62%] overflow-hidden rounded-xl border border-white/10 bg-[#0a0913]/95 shadow-2xl shadow-black/70 [transform:translateZ(70px)] sm:-left-12">
          <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-3 py-1.5">
            <span className="size-2 rounded-full bg-[#ff5f57]" />
            <span className="size-2 rounded-full bg-[#febc2e]" />
            <span className="size-2 rounded-full bg-[#28c840]" />
            <span className="ml-1 font-mono text-[9px] text-fg-3">kestrel-rtos · qemu</span>
          </div>
          <pre className="p-3 font-mono text-[9.5px] leading-relaxed text-fg-2 sm:text-[10.5px]">
            <span className="text-fuchsia-400">kestrel&gt;</span> pi{'\n'}
            <span className="text-rose-300">PI OFF: high-prio waited 65719 us</span>
            {'\n'}
            <span className="text-emerald-300">PI ON : high-prio waited 15183 us</span>
            {'\n'}
            <span className="text-fuchsia-400">kestrel&gt;</span> <span className="caret text-fuchsia-300" />
          </pre>
        </div>

        <div className="absolute -top-6 -right-3 flex border border-white/10 bg-ink-900/90 backdrop-blur items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm shadow-xl [transform:translateZ(110px)] sm:-right-8">
          <div className="animate-float flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-300" />
            <span>
              <b>315</b> tests passing
            </span>
          </div>
        </div>
        <div className="absolute top-[38%] -left-4 hidden border border-white/10 bg-ink-900/90 backdrop-blur items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm shadow-xl [transform:translateZ(90px)] sm:flex md:-left-14">
          <div className="animate-float-slow flex items-center gap-2">
            <Gauge className="size-4 text-amber-300" />
            <span>
              <b>483×</b> faster query
            </span>
          </div>
        </div>
        <div className="absolute -right-2 -bottom-6 flex border border-white/10 bg-ink-900/90 backdrop-blur items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm shadow-xl [transform:translateZ(130px)] sm:-right-10">
          <div className="animate-float flex items-center gap-2 [animation-delay:-3s]">
            <Cpu className="size-4 text-cyan-300" />
            <span>
              <b>98.33%</b> int8 CNN
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 md:pt-36" style={{ ['--accent' as string]: '#a78bfa', ['--accent-2' as string]: '#22d3ee' }}>
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <ParticleField className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />

      <div className="relative mx-auto grid grid-cols-1 max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div style={{ animation: 'rise .9s both' }}>
          <a
            href="#contact"
            className="glass frost inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-fg-2 transition hover:text-white"
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400" style={{ animation: 'ping-soft 1.8s infinite' }} />
              <span className="relative size-2 rounded-full bg-emerald-400" />
            </span>
            {profile.availability}
          </a>

          <h1 className="mt-7 text-[clamp(3.2rem,9vw,7rem)] leading-[0.92] font-bold tracking-tight">
            <span className="block">{profile.firstName}</span>
            <span className="text-gradient block pb-2">{profile.lastName}</span>
          </h1>

          <RoleTyper />

          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-2 md:text-lg">{profile.intro}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <LinkButton href="#builds" primary icon={<Sparkles className="size-4" />}>
              Explore the builds
            </LinkButton>
            <LinkButton href={links.github} icon={<GithubIcon className="size-4" />}>
              github.com/{profile.handle}
            </LinkButton>
            {links.linkedin && (
              <LinkButton href={links.linkedin} icon={<LinkedinIcon className="size-4" />}>
                LinkedIn
              </LinkButton>
            )}
          </div>
          <p className="mt-6 hidden items-center gap-1.5 text-xs text-fg-3 md:flex">
            Tip: press
            <kbd className="inline-flex items-center gap-0.5 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">
              <Command className="size-2.5" />K
            </kbd>
            or
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">Ctrl K</kbd>
            to jump anywhere.
          </p>
        </div>

        <div style={{ animation: 'rise 1.1s .15s both' }} className="pb-10 lg:pb-0">
          <HeroCollage />
        </div>
      </div>

      <div className="relative mx-auto mt-20 grid max-w-7xl grid-cols-2 gap-3 px-4 sm:px-6 md:mt-28 md:grid-cols-4">
        {[
          { v: totals.tests.value, label: 'automated tests across 3 repos', suffix: '' },
          { v: 483, label: 'fastest measured query speed-up', suffix: '×' },
          { v: 4.11, label: 'fewer instructions with SIMD kernels', suffix: '×', d: 2 },
          { v: 2, label: 'department rank, EIE · NIT Silchar', prefix: '#' },
        ].map((s, i) => (
          <div key={i} className="glass rounded-2xl p-4 md:p-5" style={{ animation: `rise .8s ${0.3 + i * 0.08}s both` }}>
            <Counter
              value={s.v}
              decimals={s.d ?? 0}
              prefix={s.prefix}
              suffix={s.suffix}
              className="text-gradient block text-3xl font-semibold tracking-tight md:text-4xl"
            />
            <div className="mt-1 text-xs text-fg-2 md:text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="relative mt-16 border-y border-white/[0.06] bg-white/[0.015] py-5 md:mt-20">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent" />
        <div className="overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-12 hover:[animation-play-state:paused]">
            {[...marquee, ...marquee].map((m, i) => (
              <TechIcon key={i} name={m} className="size-9 opacity-80 grayscale-[30%] transition hover:scale-110 hover:opacity-100 hover:grayscale-0" />
            ))}
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="mx-auto mt-10 mb-4 flex w-fit flex-col items-center gap-1 text-xs text-fg-3 transition hover:text-fg"
        aria-label="Scroll to About"
      >
        scroll
        <ArrowDown className="size-4 animate-bounce" />
      </a>
    </section>
  )
}
