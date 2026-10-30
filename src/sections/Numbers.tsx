import { FileText, GitCommitHorizontal, Library, Network, ScrollText, TestTubes } from 'lucide-react'
import type { ReactNode } from 'react'
import { languages, totals } from '../data/profile'
import { GithubIcon } from '../components/brand'
import { Counter, Reveal, SectionHeading, Spotlight } from '../components/ui'
import { SegmentedBar } from '../components/charts'

const tiles: { icon: ReactNode; value: number; label: string; note: string }[] = [
  { icon: <TestTubes />, value: totals.tests.value, label: 'automated tests', note: '315 + 107 + 24 across three repos' },
  { icon: <GitCommitHorizontal />, value: totals.commits, label: 'commits', note: 'small, described steps' },
  { icon: <ScrollText />, value: totals.linesOfCode, label: 'lines of code', note: 'Java, TypeScript, C, Python, SQL' },
  { icon: <FileText />, value: totals.docsLines, label: 'lines of documentation', note: 'guides, flows, decisions, evidence' },
  { icon: <Network />, value: totals.endpoints, label: 'REST endpoints', note: 'in placement-prep alone' },
  { icon: <Library />, value: totals.decisions, label: 'written design decisions', note: 'each with its trade-off' },
]

const repos = [
  {
    name: 'placement-prep',
    url: 'https://github.com/RishitheB0T/placement-prep',
    span: 'Sep 11 – Oct 29, 2026',
    commits: 35,
    tests: 315,
    loc: 17594,
    docs: 1378,
    colors: 'from-violet-500 to-fuchsia-500',
  },
  {
    name: 'product-catalog-service',
    url: 'https://github.com/RishitheB0T/product-catalog-service',
    span: 'Oct 20 – Oct 29, 2026',
    commits: 11,
    tests: 107,
    loc: 4922,
    docs: 3735,
    colors: 'from-amber-400 to-orange-500',
  },
  {
    name: 'kestrel-rtos',
    url: 'https://github.com/RishitheB0T/kestrel-rtos',
    span: 'October 2026',
    commits: 59,
    tests: 24,
    loc: 5293,
    docs: 893,
    colors: 'from-cyan-400 to-emerald-400',
  },
]

export function Numbers() {
  return (
    <section id="numbers" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32" style={{ ['--accent' as string]: '#f472b6', ['--accent-2' as string]: '#a78bfa' }}>
      <SectionHeading
        index="02"
        eyebrow="Contributions"
        title={
          <>
            The work, <span className="text-gradient">counted.</span>
          </>
        }
        sub="Straight from the public repositories: what was written, how it was tested, and how much of it is explained."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {tiles.map((t, i) => (
          <Reveal key={t.label} delay={i * 60}>
            <Spotlight className="h-full p-5 md:p-6">
              <div className="mb-4 grid size-10 place-items-center rounded-xl bg-white/[0.06] text-fuchsia-300 [&>svg]:size-5">{t.icon}</div>
              <Counter value={t.value} className="block font-sans text-3xl font-semibold tracking-tight text-white md:text-5xl" />
              <div className="mt-1 text-sm font-medium text-fg">{t.label}</div>
              <div className="mt-0.5 text-xs text-fg-3">{t.note}</div>
            </Spotlight>
          </Reveal>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-3xl p-6">
            <SegmentedBar title="What I write: lines of code by language" unit="lines" parts={languages.map((l) => ({ name: l.name, value: l.lines, color: l.color }))} />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="glass h-full rounded-3xl p-6">
            <SegmentedBar
              title="Where the tests are"
              unit="tests"
              parts={[
                { name: 'placement-prep', value: totals.tests.parts[0], color: '#3987e5' },
                { name: 'product-catalog-service', value: totals.tests.parts[1], color: '#d95926' },
                { name: 'kestrel-rtos (on-target)', value: totals.tests.parts[2], color: '#199e70' },
              ]}
            />
          </div>
        </Reveal>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        {repos.map((r, i) => (
          <Reveal key={r.name} delay={i * 90}>
            <a href={r.url} target="_blank" rel="noreferrer" className="group block h-full">
              <Spotlight className="h-full p-6 transition group-hover:-translate-y-1">
                <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${r.colors}`} />
                <div className="mt-4 flex items-center justify-between gap-2">
                  <h3 className="font-mono text-base font-semibold">{r.name}</h3>
                  <GithubIcon className="size-4 text-fg-3 transition group-hover:text-white" />
                </div>
                <p className="mt-0.5 text-xs text-fg-3">{r.span}</p>
                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {[
                    ['commits', r.commits],
                    ['tests', r.tests],
                    ['lines of code', r.loc],
                    ['lines of docs', r.docs],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs text-fg-3">{k}</dt>
                      <dd className="font-semibold text-white">{(v as number).toLocaleString('en-US')}</dd>
                    </div>
                  ))}
                </dl>
              </Spotlight>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
