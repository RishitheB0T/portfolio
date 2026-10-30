import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, BookOpenText, Check, Database, HardDrive, RefreshCw, Send, ShieldAlert, TimerOff, Zap } from 'lucide-react'
import { Reveal, Spotlight } from '../components/ui'
import { ProjectHeader, SubHeading, TechRow } from '../components/project'
import { QueryDumbbell } from '../components/charts'
import { useInView, useReducedMotion } from '../lib/hooks'

const phases = [
  'Plan & architecture',
  'Spring Boot skeleton',
  'MySQL + Redis in Compose',
  'Schema, entity, repository',
  'CRUD API',
  'Search, sort, paginate',
  'Full-stack API tests',
  'Measured query optimization',
  'Redis detail cache',
  'Eviction + outage fallback',
  'Benchmarks & report',
  'React storefront',
  'Admin views & polish',
  'Containers & CI',
  'EC2 deployment',
  'Walkthrough & verified results',
]
const DONE = 10

function PhaseTracker() {
  return (
    <div className="glass rounded-3xl p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h5 className="font-display text-lg font-semibold">Built in 16 documented phases</h5>
        <span className="text-sm text-fg-2">
          <b className="text-white">{DONE}</b> of 16 complete · each phase is one commit with its own tests and docs
        </span>
      </div>
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {phases.map((p, i) => {
          const n = i + 1
          const state = n <= DONE ? 'done' : n === DONE + 1 ? 'next' : 'planned'
          return (
            <Reveal as="li" key={p} delay={i * 35}>
              <div
                className={`relative h-full rounded-xl border p-2.5 text-xs ${
                  state === 'done'
                    ? 'border-amber-300/25 bg-gradient-to-br from-amber-400/20 to-orange-500/10'
                    : state === 'next'
                      ? 'border-dashed border-amber-300/60 bg-amber-300/[0.04]'
                      : 'border-white/[0.07] bg-white/[0.015]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[11px] ${state === 'planned' ? 'text-fg-3' : 'text-amber-200'}`}>{String(n).padStart(2, '0')}</span>
                  {state === 'done' && <Check className="size-3.5 text-amber-200" />}
                  {state === 'next' && <span className="text-[10px] font-semibold text-amber-200">next</span>}
                </div>
                <div className={`mt-1 leading-snug ${state === 'planned' ? 'text-fg-3' : 'text-fg'}`}>{p}</div>
              </div>
            </Reveal>
          )
        })}
      </ol>
    </div>
  )
}

const indexes = [
  { name: 'ix_product_created_at', cols: '(created_at)', serves: 'Home page and name searches, newest first', why: 'Already in created_at DESC, id DESC order when read backwards, so MySQL stops after 20 entries.' },
  { name: 'ix_product_category_created_at', cols: '(category, created_at)', serves: 'A category page, newest first', why: 'Equality on the first column, order on the second: one direct lookup, 20 entries.' },
  { name: 'ix_product_category_price', cols: '(category, price)', serves: 'A category sorted by price, either direction; category counts', why: 'Same pattern; price DESC, id DESC is simply a backward read.' },
  { name: 'ix_product_price', cols: '(price)', serves: 'A price range across all categories, cheapest first', why: 'The range and the order are on the same column.' },
]

type Step = { icon: ReactNode; title: string; sub: string }
const flows: { key: string; label: string; steps: Step[]; note: string }[] = [
  {
    key: 'read',
    label: 'Read: cache-aside',
    steps: [
      { icon: <Send />, title: 'GET /products/{id}', sub: 'one product’s details' },
      { icon: <Zap />, title: 'Check Redis', sub: 'versioned key, JSON value' },
      { icon: <Database />, title: 'Miss: read MySQL', sub: 'the source of truth' },
      { icon: <HardDrive />, title: 'Store a copy', sub: '60-second TTL' },
      { icon: <Check />, title: '200 OK', sub: 'next read is a hit' },
    ],
    note: 'On a hit, the answer comes straight from Redis and MySQL is never touched. Searches always read MySQL, using the measured indexes.',
  },
  {
    key: 'write',
    label: 'Write: evict after commit',
    steps: [
      { icon: <Send />, title: 'PUT /products/{id}', sub: 'full product + the version you read' },
      { icon: <Database />, title: 'Transaction', sub: 'update row, version + 1' },
      { icon: <Check />, title: 'Commit', sub: 'outdated version → 409' },
      { icon: <RefreshCw />, title: 'Evict cached copy', sub: 'after-commit event' },
      { icon: <Zap />, title: 'Next read refills', sub: 'from MySQL' },
    ],
    note: 'Eviction only happens after the transaction commits, so a rolled-back update clears nothing. Both cases are tested.',
  },
  {
    key: 'outage',
    label: 'Redis outage',
    steps: [
      { icon: <Send />, title: 'GET /products/{id}', sub: 'Redis is down' },
      { icon: <TimerOff />, title: 'Redis times out', sub: 'after 200 ms, not forever' },
      { icon: <Database />, title: 'Fall back to MySQL', sub: 'same answer, a bit slower' },
      { icon: <ShieldAlert />, title: 'Count the error', sub: 'cache metrics' },
      { icon: <Check />, title: '200 OK', sub: 'the service keeps answering' },
    ],
    note: 'Proven by pausing the Redis container in a test: reads still answer within the timeouts, writes still succeed, and the cache recovers afterwards.',
  },
]

function CacheFlow() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const [tab, setTab] = useState(0)
  const [step, setStep] = useState(0)
  const flow = flows[tab]

  useEffect(() => {
    if (!inView || reduced) return
    const t = window.setInterval(() => setStep((s) => (s + 1) % (flow.steps.length + 2)), 900)
    return () => window.clearInterval(t)
  }, [inView, reduced, flow.steps.length])

  const active = reduced ? flow.steps.length : step

  return (
    <div ref={ref} className="glass rounded-3xl p-5 md:p-7">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Cache flows">
        {flows.map((f, i) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={tab === i}
            onClick={() => {
              setTab(i)
              setStep(0)
            }}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              tab === i ? 'bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-ink-950' : 'border border-white/10 text-fg-2 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ol className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-5" role="tabpanel">
        {flow.steps.map((s, i) => {
          const lit = i < active
          return (
            <li key={`${flow.key}-${i}`} className="relative">
              <div
                className={`h-full rounded-2xl border p-4 transition duration-500 ${
                  lit ? 'border-amber-300/40 bg-amber-300/[0.07] shadow-[0_0_30px_-10px_rgba(251,191,36,.6)]' : 'border-white/[0.07] bg-white/[0.02]'
                }`}
              >
                <div className={`grid size-9 place-items-center rounded-xl transition [&>svg]:size-4.5 ${lit ? 'bg-amber-300 text-ink-950' : 'bg-white/[0.06] text-fg-3'}`}>{s.icon}</div>
                <div className="mt-3 font-mono text-[12.5px] font-semibold text-fg">{s.title}</div>
                <div className="mt-0.5 text-xs text-fg-3">{s.sub}</div>
              </div>
              {i < flow.steps.length - 1 && (
                <ArrowRight className={`absolute top-1/2 -right-3 z-10 hidden size-4 -translate-y-1/2 transition md:block ${i < active - 1 ? 'text-amber-300' : 'text-white/20'}`} />
              )}
            </li>
          )
        })}
      </ol>
      <p className="mt-5 text-sm leading-relaxed text-fg-2">{flow.note}</p>
    </div>
  )
}

function RaceProof() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const rows = [
    { title: '10 simultaneous updates of the same version', win: '200', lose: '409', winner: 3 },
    { title: '10 simultaneous creates with one SKU', win: '201', lose: '409', winner: 7 },
  ]
  return (
    <div ref={ref} className="glass h-full rounded-3xl p-6">
      <h5 className="font-display text-lg font-semibold">Concurrency, proven over real HTTP</h5>
      <p className="mt-1 text-sm text-fg-2">Optimistic locking and a unique SKU: exactly one request wins, the rest get a clear conflict.</p>
      <div className="mt-5 space-y-5">
        {rows.map((r, ri) => (
          <div key={r.title}>
            <div className="mb-2 text-xs text-fg-3">{r.title}</div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 10 }, (_, i) => {
                const won = i === r.winner
                return (
                  <span
                    key={i}
                    className={`grid h-9 w-11 place-items-center rounded-lg border font-mono text-[11px] font-semibold transition-all duration-500 ${
                      !inView
                        ? 'border-white/10 bg-white/[0.03] text-fg-3'
                        : won
                          ? 'border-emerald-300/50 bg-emerald-400/20 text-emerald-100'
                          : 'border-amber-300/30 bg-amber-400/10 text-amber-100'
                    }`}
                    style={{ transitionDelay: `${ri * 500 + i * 70}ms` }}
                  >
                    {inView ? (won ? r.win : r.lose) : '···'}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-fg-2">
        <span className="flex items-center gap-1.5">
          <Check className="size-3.5 text-emerald-300" /> 1 success
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="size-3.5 text-amber-300" /> 9 × 409 Conflict
        </span>
      </div>
    </div>
  )
}

function ProblemJson() {
  const k = (s: string) => <span className="text-sky-300">"{s}"</span>
  const v = (s: string) => <span className="text-amber-200">"{s}"</span>
  return (
    <div className="h-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a0913]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
        <span className="font-mono text-xs text-fg-3">400 · application/problem+json</span>
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-fg-2">RFC 9457</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-relaxed text-fg-2">
        {'{\n  '}
        {k('type')}: {v('https://catalog.example/problems/validation-failed')},{'\n  '}
        {k('title')}: {v('Validation failed')},{'\n  '}
        {k('status')}: <span className="text-fuchsia-300">400</span>,{'\n  '}
        {k('detail')}: {v('2 fields are invalid.')},{'\n  '}
        {k('errors')}: [{'\n    { '}
        {k('field')}: {v('price')}, {k('message')}: {v('must be greater than or equal to 0.00')}
        {' },\n    { '}
        {k('field')}: {v('sku')}, {k('message')}: {v('must use only upper-case letters, digits…')}
        {' }\n  ]\n}'}
      </pre>
      <p className="border-t border-white/[0.07] px-5 py-3 text-xs text-fg-3">
        One error format for every failure: validation, 404, duplicate SKU, version conflict, and 403 on the read-only public deployment.
      </p>
    </div>
  )
}

const decisions = [
  ['D-007', 'The public deployment is read-only, enforced by the server'],
  ['D-008', 'Cache only product details first; search stays on MySQL'],
  ['D-025', 'Errors as RFC 9457 Problem Details'],
  ['D-027', 'Optimistic locking: version in the PUT body, 409 on conflict'],
  ['D-032', 'A sort allowlist that always ends with id'],
  ['D-038', 'Generated, fingerprinted benchmark data'],
  ['D-040', 'Four search indexes, chosen from measured plans'],
  ['D-046', 'Evict after commit, through a transactional event'],
  ['D-047', '200 ms Redis timeouts, and MySQL as the fallback'],
]

export function ProductCatalog() {
  return (
    <article id="product-catalog" className="relative" style={{ ['--accent' as string]: '#fbbf24', ['--accent-2' as string]: '#fb923c' }}>
      <ProjectHeader
        index="03.2"
        tags={['Backend · performance', 'Spring Boot + MySQL + Redis', <><span className="size-1.5 rounded-full bg-amber-300" /> Phase 10 of 16</>]}
        name="product-catalog-service"
        tagline={
          <>
            A product catalog API built from an empty folder, where <span className="text-accent font-semibold">every index was chosen from a measured query plan.</span>
          </>
        }
        links={[
          { href: 'https://github.com/RishitheB0T/product-catalog-service', label: 'Source code', primary: true },
          { href: 'https://github.com/RishitheB0T/product-catalog-service/blob/main/docs/QUERY_OPTIMIZATION.md', label: 'Query-optimization write-up' },
          { href: 'https://github.com/RishitheB0T/product-catalog-service/blob/main/docs/DECISIONS.md', label: 'Design decisions' },
        ]}
        stats={[
          { value: 483, suffix: '×', label: 'fastest query speed-up' },
          { value: 100000, label: 'products benchmarked' },
          { value: 107, label: 'tests', note: '14 classes, real MySQL + Redis' },
          { value: 47, label: 'written decisions' },
          { value: 200, suffix: ' ms', label: 'Redis timeout', note: 'then MySQL answers' },
          { value: 16, label: 'documented phases' },
        ]}
      >
        <p>
          A layered Spring Boot REST API over MySQL, with Redis caching for product details, for a storefront called “FORM — The
          Everyday Edit”. Search filters, sorts and paginates; writes use optimistic locking; every error is one standard format;
          and the public deployment is read-only, enforced by the server itself. The README always describes what actually works,
          and labels plans as plans.
        </p>
      </ProjectHeader>

      <Reveal>
        <PhaseTracker />
      </Reveal>

      <div className="mt-24">
        <SubHeading
          kicker="Measured, then indexed"
          title="From ~40 ms to under 1 ms, and one honest trade-off"
          sub="Search queries were measured with EXPLAIN ANALYZE on 100,000 generated products, before and after the four indexes of migration V2. Every query returned exactly the same rows."
        />
        <Reveal>
          <div className="glass rounded-3xl p-5 md:p-7">
            <QueryDumbbell />
          </div>
        </Reveal>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <Reveal>
            <div className="h-full rounded-2xl border border-rose-300/20 bg-rose-400/[0.05] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-100">
                <ShieldAlert className="size-4" /> What got slower, on purpose
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fg-2">
                A search for a word that matches nothing now walks all 100,000 entries of the newest-first index: 44.5 → 193 ms. A
                leading-wildcard LIKE can’t seek, so this was documented and accepted rather than hidden.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="h-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="text-sm font-semibold">What the indexes cost</div>
              <p className="mt-2 text-sm leading-relaxed text-fg-2">
                12–18 MB of index space on a 20.5 MB table. Built online in 3.4 s while reads and writes continued. Every insert now
                updates six indexes instead of two, which a read-heavy catalog can afford.
              </p>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="h-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="text-sm font-semibold">What didn’t change</div>
              <p className="mt-2 text-sm leading-relaxed text-fg-2">
                Counts that must visit most rows and the deepest page (page 4,999) kept the same plan. The numbers say so, so the
                write-up says so.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-24">
        <SubHeading kicker="The four indexes" title="Equality first, then the range or the sort" sub="InnoDB appends the primary key to every secondary index, so (created_at) is really sorted by (created_at, id): exactly the API’s newest-first order with its tie-breaker." />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {indexes.map((ix, i) => (
            <Reveal key={ix.name} delay={(i % 2) * 80}>
              <Spotlight className="h-full p-5">
                <code className="font-mono text-sm font-semibold break-all text-amber-200">
                  {ix.name} <span className="text-fg-3">{ix.cols}</span>
                </code>
                <div className="mt-3 text-sm text-fg">{ix.serves}</div>
                <div className="mt-1 text-sm leading-relaxed text-fg-3">{ix.why}</div>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <SubHeading kicker="Redis caching" title="Fast when Redis is up. Correct when it isn’t." sub="Product details are cached with the cache-aside pattern, cleared after every committed write, and MySQL takes over when Redis fails." />
        <Reveal>
          <CacheFlow />
        </Reveal>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Reveal>
          <RaceProof />
        </Reveal>
        <Reveal delay={100}>
          <ProblemJson />
        </Reveal>
      </div>

      <div className="mt-24">
        <SubHeading
          kicker="Decision log"
          title="47 decisions, each with its trade-off"
          sub="Every choice is written down with the alternatives and why they lost. A few of them:"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {decisions.map(([id, text], i) => (
            <Reveal key={id} delay={(i % 3) * 60}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                <span className="shrink-0 rounded-md bg-amber-300/15 px-2 py-0.5 font-mono whitespace-nowrap text-[11px] font-semibold text-amber-200">{id}</span>
                <span className="text-sm leading-snug text-fg-2">{text}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-4">
          <a
            href="https://github.com/RishitheB0T/product-catalog-service/blob/main/docs/DECISIONS.md"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-200 hover:text-amber-100"
          >
            <BookOpenText className="size-4" /> Read all 47 in DECISIONS.md <ArrowRight className="size-3.5" />
          </a>
        </Reveal>
      </div>

      <Reveal className="mt-10">
        <TechRow
          items={[
            { name: 'Java 21', icon: 'java' },
            { name: 'Spring Boot 4.1', icon: 'spring' },
            { name: 'Spring Data JPA (Hibernate 7)', icon: 'hibernate' },
            { name: 'MySQL 8.4 LTS', icon: 'mysql' },
            { name: 'Redis 8.10', icon: 'redis' },
            { name: 'Flyway 12', icon: 'flyway' },
            { name: 'Testcontainers 2', icon: 'docker' },
            { name: 'Docker Compose', icon: 'docker' },
            { name: 'JUnit + Mockito', icon: 'junit' },
            { name: 'Maven', icon: 'maven' },
          ]}
        />
      </Reveal>
    </article>
  )
}
