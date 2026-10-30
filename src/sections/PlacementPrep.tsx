import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  BellRing,
  Blocks,
  Bot,
  Briefcase,
  ClipboardList,
  Clock,
  Container,
  Cpu,
  Database,
  FileText,
  Globe,
  GraduationCap,
  Inbox,
  KeyRound,
  Layers,
  Maximize2,
  Monitor,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
} from 'lucide-react'
import { BrowserFrame, Reveal, Spotlight } from '../components/ui'
import { Lightbox, type Shot } from '../components/Lightbox'
import { ProjectHeader, SubHeading, TechRow } from '../components/project'
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

const features: { icon: ReactNode; title: string; body: ReactNode }[] = [
  { icon: <Target />, title: 'Drives that fit you', body: <>Students see <b>only the drives their marks qualify for</b>: CGPA, 10th, 12th, branch and backlogs, checked by one SQL query against the stored profile.</> },
  { icon: <ClipboardList />, title: 'Applications, end to end', body: <>Apply, withdraw and follow every application from <b>applied → shortlisted → selected</b>. The hiring side leaves notes, sees live counts and exports CSV.</> },
  { icon: <BellRing />, title: 'Never miss a deadline', body: <>A scheduled job sends new-drive alerts and reminders <b>3 days and 1 day</b> before a drive closes, only to eligible students who have not applied.</> },
  { icon: <FileText />, title: 'AI resume feedback', body: <>Upload a PDF against a drive: <b>Claude reads it natively</b> and returns a score, strengths and fixes, judged against passages retrieved from that drive’s job description.</> },
  { icon: <Bot />, title: 'An assistant that acts', body: <>Ask in plain English. Through <b>Spring AI @Tool calling</b> the model invokes real backend methods, under the same rules as the buttons.</> },
  { icon: <Search />, title: 'Search by meaning (RAG)', body: <>Job-description PDFs are split, embedded by a <b>local model</b> and stored in pgvector. “Data pipelines with Spark” finds the right job with no word in common, and no API key.</> },
  { icon: <ShieldCheck />, title: 'Four roles, enforced twice', body: <>Student, coordinator, recruiter, admin. JWT auth with role rules in the security filter chain, <b>plus row-level ownership</b>.</> },
  { icon: <Blocks />, title: 'Built to be trusted', body: <>Flyway-owned schema, validation that mirrors every column, RFC 9457 errors, <b>226 backend tests on real PostgreSQL + pgvector</b>.</> },
  { icon: <Container />, title: 'One command to run', body: <><span className="font-mono text-[12.5px]">docker compose --profile app up</span> starts PostgreSQL, the API and the nginx-served React app together.</> },
]

const roles = [
  { icon: <GraduationCap />, role: 'Student', does: 'Builds a profile, sees eligible drives, applies, tracks applications, gets reminders, resume feedback and the assistant.' },
  { icon: <ClipboardList />, role: 'Coordinator', does: 'A student who helps run the cell: everything a student does, plus posting drives and reviewing every applicant.' },
  { icon: <Briefcase />, role: 'Recruiter', does: 'A company’s hiring contact, added by the admin. Posts drives and decides applications, for their own drives only.' },
  { icon: <Star />, role: 'Admin', does: 'Runs the placement cell: oversees everything, adds recruiters, promotes coordinators, resets passwords.' },
]

function DiagramNode({ icon, title, lines, color }: { icon: ReactNode; title: string; lines: string[]; color: string }) {
  return (
    <div className="glass relative z-10 rounded-2xl p-4">
      <div className={`mb-3 grid size-9 place-items-center rounded-xl bg-gradient-to-br ${color} text-white [&>svg]:size-4.5`}>{icon}</div>
      <div className="text-sm font-semibold">{title}</div>
      {lines.map((l) => (
        <div key={l} className="text-xs leading-relaxed text-fg-3">
          {l}
        </div>
      ))}
    </div>
  )
}

function Conn({ always = false }: { always?: boolean }) {
  return (
    <div className="flex items-center justify-center" aria-hidden>
      <div className={`connector ${always ? '' : 'md-h'}`} />
    </div>
  )
}

const modules = ['auth', 'drive', 'application', 'resume', 'knowledgebase', 'agent', 'notification']

function Architecture() {
  return (
    <div className="glass rounded-3xl p-5 md:p-8" role="img" aria-label="Architecture: a React 19 single-page app talks through nginx to a Spring Boot 4 modular monolith. A JWT filter with role rules guards seven feature modules, alongside scheduled jobs and local embeddings. The API stores data and vectors in PostgreSQL 16 with pgvector, and calls Claude through Spring AI for tool calls and PDF review.">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_44px_0.9fr_44px_2.3fr_44px_1fr]">
        <DiagramNode icon={<Monitor />} title="React 19 SPA" lines={['role-aware pages', 'Axios + JWT']} color="from-sky-400 to-blue-600" />
        <Conn />
        <DiagramNode icon={<Globe />} title="nginx" lines={['one origin', 'no CORS']} color="from-amber-400 to-orange-500" />
        <Conn />
        <div className="gradient-border relative z-10 rounded-2xl bg-white/[0.03] p-4" style={{ ['--accent' as string]: '#22c55e', ['--accent-2' as string]: '#a78bfa' }}>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 text-white">
              <Layers className="size-4" />
            </span>
            Spring Boot 4 · modular monolith
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1.5 text-xs text-emerald-200">
            <KeyRound className="size-3.5" /> JWT filter + role rules
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {modules.map((m) => (
              <span key={m} className="rounded-md bg-white/[0.06] px-2 py-1 font-mono text-[11px] text-fg-2">
                {m}
              </span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px] text-fg-3">
            <span className="flex items-center gap-1.5 rounded-md bg-white/[0.04] px-2 py-1">
              <Clock className="size-3" /> review queue · reminders
            </span>
            <span className="flex items-center gap-1.5 rounded-md bg-white/[0.04] px-2 py-1">
              <Cpu className="size-3" /> MiniLM embeddings
            </span>
          </div>
        </div>
        <Conn />
        <DiagramNode icon={<Database />} title="PostgreSQL 16" lines={['+ pgvector', '15 Flyway migrations']} color="from-indigo-400 to-violet-600" />
      </div>
      <div className="md:grid md:grid-cols-[1fr_44px_0.9fr_44px_2.3fr_44px_1fr]">
        <div className="flex flex-col items-center md:col-start-5">
          <div className="relative">
            <div className="connector" style={{ ['--accent' as string]: '#a78bfa', ['--accent-2' as string]: '#f472b6' }} />
            <span className="absolute top-1/2 left-4 -translate-y-1/2 font-mono text-[10px] whitespace-nowrap text-fg-3">tool calls · PDF review</span>
          </div>
          <div className="w-full max-w-xs">
            <DiagramNode icon={<Sparkles />} title="Claude via Spring AI" lines={['chat · tool calling · native PDF reading']} color="from-fuchsia-500 to-pink-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

const highlights = [
  { icon: <KeyRound />, title: 'Stateless JWT, role re-read on every request', body: 'A promotion takes effect immediately, and the browser refreshes its token to match.' },
  { icon: <Layers />, title: 'Controllers speak HTTP, services speak the domain', body: 'Services return Optional or throw a reason-carrying exception, so scheduled jobs reuse them untouched.' },
  { icon: <ShieldCheck />, title: 'Two layers of access control', body: 'Role rules in the filter chain answer 403; ownership lookups answer 404, so nobody can confirm another person’s records exist.' },
  { icon: <Inbox />, title: 'A database table as a job queue', body: 'Resume reviews survive restarts with no message broker, and no connection is held during the slow model call.' },
  { icon: <RotateCcw />, title: 'At-most-once reminders', body: 'A partial unique index makes “never send the same reminder twice” a database rule, not a hope.' },
]

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

      <div className="mt-24">
        <SubHeading kicker="Features" title="Everything a placement season needs" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <Spotlight className="h-full p-6">
                <div className="mb-4 grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500/25 to-fuchsia-500/25 text-fuchsia-200 ring-1 ring-fuchsia-300/20 [&>svg]:size-5">{f.icon}</div>
                <h5 className="font-display text-lg font-semibold">{f.title}</h5>
                <p className="mt-2 text-sm leading-relaxed text-fg-2 [&_b]:font-semibold [&_b]:text-fg">{f.body}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <SubHeading kicker="Who uses it" title="Built for four roles" sub="Each role gets exactly the controls it should, and the server checks again on every request." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r, i) => (
            <Reveal key={r.role} delay={i * 70}>
              <div className="glass h-full rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-white/[0.07] text-violet-200 [&>svg]:size-4.5">{r.icon}</span>
                  <span className="font-display text-lg font-semibold">{r.role}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-fg-2">{r.does}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <SubHeading kicker="Architecture" title="One API, one app, one database" sub="A modular monolith: a Spring Boot API split into feature modules, a React single-page app, and one PostgreSQL database that also stores the vector embeddings." />
        <Reveal>
          <Architecture />
        </Reveal>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 70}>
              <div className="h-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                <span className="text-violet-300 [&>svg]:size-5">{h.icon}</span>
                <h5 className="mt-3 text-sm leading-snug font-semibold">{h.title}</h5>
                <p className="mt-1.5 text-xs leading-relaxed text-fg-3">{h.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

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
