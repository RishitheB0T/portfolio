import { Check, ShieldAlert } from 'lucide-react'
import { Reveal, Spotlight } from '../components/ui'
import { ProjectHeader, SubHeading, TechRow } from '../components/project'
import { QueryDumbbell } from '../components/charts'

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
