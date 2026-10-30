import { useCallback, useEffect, useRef, useState } from 'react'
import { Maximize2, Star } from 'lucide-react'
import { BrowserFrame, Reveal } from '../components/ui'
import { Lightbox, type Shot } from '../components/Lightbox'
import { ProjectHeader, TechRow } from '../components/project'
import { useInView, useReducedMotion } from '../lib/hooks'

const img = (n: string) => `./images/placement-prep/${n}.webp`
const thumb = (n: string) => `./images/placement-prep/${n}-thumb.webp`
const shot = (n: string, title: string, caption: string, path: string): Shot => ({ src: img(n), thumb: thumb(n), title, caption, path })

const shots: Shot[] = [
  shot('student-dashboard', 'Student dashboard', 'the season at a glance and what to do next', '/dashboard'),
  shot('drives-all', 'Drives board', 'apply only where you qualify, with live deadlines', '/drives'),
  shot('assistant', 'Assistant + semantic search', 'job descriptions matched by meaning via pgvector', '/assistant'),
  shot('applications', 'My applications', 'every status, with the recruiter’s notes', '/applications'),
  shot('notifications', 'Notifications', 'new drives, deadlines and decisions in one bell', '/notifications'),
  shot('admin-dashboard', 'Admin dashboard', 'the whole cell: people, promotions, oversight', '/admin'),
  shot('applicants', 'Reviewing applicants', 'decide in a click, export as CSV', '/drives/applicants'),
  shot('recruiter-dashboard', 'Recruiter dashboard', 'scoped to the company’s own drives', '/recruiter'),
  shot('post-drive', 'Posting a drive', 'cutoffs, branches and the deadline', '/drives/new'),
  shot('drives', 'Eligible for me', 'computed from the stored profile', '/drives?eligible'),
  shot('login', 'Sign in', 'one form, a tab per kind of account', '/login'),
]

function Showcase() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!inView || paused || reduced || open !== null) return
    const t = window.setTimeout(() => setI((x) => (x + 1) % shots.length), 5200)
    return () => window.clearTimeout(t)
  }, [i, inView, paused, reduced, open])

  useEffect(() => {
    const el = stripRef.current?.children[i] as HTMLElement | undefined
    const strip = stripRef.current
    if (el && strip) strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' })
  }, [i])

  const onIndex = useCallback((n: number) => setI(n), [])
  const s = shots[i]

  return (
    <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Reveal>
        <div className="relative">
          <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-tr from-violet-600/30 via-fuchsia-500/20 to-cyan-400/10 blur-3xl" />
          <button onClick={() => setOpen(i)} className="group block w-full text-left" aria-label={`Open ${s.title} full size`}>
            <BrowserFrame url={`placement-prep${s.path}`}>
              <div className="relative aspect-[16/10] overflow-hidden bg-ink-900">
                <img key={s.src} src={s.src} alt={`${s.title}: ${s.caption}`} width={1440} height={900} className="h-full w-full object-cover object-top" style={{ animation: 'rise .5s both' }} />
                <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <Maximize2 className="size-3.5" /> View full size
                </span>
              </div>
            </BrowserFrame>
          </button>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <p className="text-sm">
            <b className="text-white">{s.title}</b> <span className="text-fg-2">· {s.caption}</span>
          </p>
          <span className="shrink-0 font-mono text-xs text-fg-3">
            {String(i + 1).padStart(2, '0')} / {shots.length}
          </span>
        </div>
      </Reveal>
      <div ref={stripRef} className="no-scrollbar relative mt-4 flex snap-x gap-3 overflow-x-auto pb-2">
        {shots.map((sh, n) => (
          <button
            key={sh.src}
            onClick={() => setI(n)}
            aria-label={`Show ${sh.title}`}
            aria-current={n === i}
            className={`relative w-36 shrink-0 snap-center overflow-hidden rounded-lg border transition md:w-44 ${
              n === i ? 'border-fuchsia-400/70 opacity-100' : 'border-white/10 opacity-55 hover:opacity-90'
            }`}
          >
            <img src={sh.thumb} alt="" loading="lazy" width={640} height={400} className="block aspect-[16/10] w-full object-cover object-top" />
            {n === i && !paused && !reduced && (
              <span key={`p${i}`} className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400" style={{ animation: 'grow 5.2s linear both' }} />
            )}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-fg-3">Screenshots use fictional companies and students.</p>
      {open !== null && <Lightbox shots={shots} index={open} onIndex={(n) => { setOpen(n); onIndex(n) }} onClose={() => setOpen(null)} />}
    </div>
  )
}

export function PlacementPrep() {
  return (
    <article id="placement-prep" className="relative" style={{ ['--accent' as string]: '#a78bfa', ['--accent-2' as string]: '#f0abfc' }}>
      <ProjectHeader
        index="03.1"
        tags={[
          <><Star className="size-3 text-amber-300" /> Flagship</>,
          'Full stack + applied AI',
          <><span className="size-1.5 rounded-full bg-emerald-400" /> Active build</>,
        ]}
        name="placement-prep"
        tagline="The campus placement platform for students, recruiters and the training & placement cell."
        links={[
          { href: 'https://github.com/RishitheB0T/placement-prep', label: 'Source code', primary: true },
          { href: 'https://github.com/RishitheB0T/placement-prep/blob/main/docs/ARCHITECTURE.md', label: 'Architecture deep dive' },
          { href: 'https://github.com/RishitheB0T/placement-prep/blob/main/docs/API.md', label: 'API reference' },
        ]}
        stats={[
          { value: 315, label: 'tests passing', note: '226 backend · 89 frontend' },
          { value: 35, label: 'REST endpoints' },
          { value: 4, label: 'roles' },
          { value: 85, label: 'Postman requests', note: '114 assertions' },
          { value: 15, label: 'Flyway migrations' },
          { value: 0, label: 'lint warnings', note: 'oxlint' },
        ]}
      >
        <p>
          The placement cell posts drives, students see only the ones they qualify for, and AI helps them prepare. It covers
          the whole season: eligibility, applications from apply to offer, deadline reminders, resume feedback grounded in the real
          job description, and an assistant that can act on a student’s behalf.
        </p>
      </ProjectHeader>

      <Showcase />

      <Reveal className="mt-8">
        <TechRow
          items={[
            { name: 'Java 21', icon: 'java' },
            { name: 'Spring Boot 4.1', icon: 'spring' },
            { name: 'Spring Security 7 + JWT', icon: 'spring' },
            { name: 'Spring AI 2.0', icon: 'claude' },
            { name: 'PostgreSQL 16 + pgvector', icon: 'postgresql' },
            { name: 'Flyway', icon: 'flyway' },
            { name: 'React 19', icon: 'react' },
            { name: 'TypeScript', icon: 'typescript' },
            { name: 'Tailwind CSS 4', icon: 'tailwindcss' },
            { name: 'Vite', icon: 'vitejs' },
            { name: 'Docker', icon: 'docker' },
            { name: 'nginx', icon: 'nginx' },
            { name: 'GitHub Actions', icon: 'githubactions' },
            { name: 'Postman', icon: 'postman' },
          ]}
        />
      </Reveal>
    </article>
  )
}
