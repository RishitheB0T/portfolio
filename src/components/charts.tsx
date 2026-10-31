import { useRef, useState, type ReactNode } from 'react'
import { AlertTriangle, Table2 } from 'lucide-react'
import { useInView } from '../lib/hooks'

/* ---------- shared helpers ---------- */

function luminance(hex: string) {
  const c = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
/** White or near-black, whichever reads better on the fill. */
function ink(fill: string) {
  const L = luminance(fill)
  const onWhite = 1.05 / (L + 0.05)
  const onBlack = (L + 0.05) / (luminance('#111111') + 0.05)
  return onWhite >= onBlack ? '#ffffff' : '#111111'
}

const fmt = (n: number) => n.toLocaleString('en-US')

function Tip({ x, children, below = false }: { x: number; children: ReactNode; below?: boolean }) {
  const clamped = Math.min(88, Math.max(12, x))
  return (
    <div
      role="tooltip"
      className={`pointer-events-none absolute z-20 w-max max-w-[16rem] -translate-x-1/2 rounded-xl border border-white/10 bg-ink-800/95 px-3 py-2 text-xs shadow-xl backdrop-blur ${
        below ? 'top-full mt-2' : 'bottom-full mb-2'
      }`}
      style={{ left: `${clamped}%`, animation: 'rise .15s both' }}
    >
      {children}
    </div>
  )
}

function TableToggle({ children, label }: { children: ReactNode; label: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-fg-3 transition hover:border-white/25 hover:text-fg"
      >
        <Table2 className="size-3.5" /> {open ? 'Hide table' : `View ${label} as a table`}
      </button>
      {open && <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">{children}</div>}
    </div>
  )
}

const th = 'px-3 py-2 text-left font-medium text-fg-3'
const td = 'px-3 py-2 text-fg-2 tabular-nums'

/* ---------- segmented bar: one whole split into parts ---------- */

export function SegmentedBar({
  title,
  parts,
  unit,
}: {
  title: string
  parts: { name: string; value: number; color: string }[]
  unit: string
}) {
  const [hover, setHover] = useState<number | null>(null)
  const total = parts.reduce((s, p) => s + p.value, 0)
  let acc = 0
  const centers = parts.map((p) => {
    const c = (acc + p.value / 2) / total
    acc += p.value
    return c * 100
  })
  return (
    <figure>
      <figcaption className="mb-3 flex items-baseline justify-between gap-4 text-sm">
        <span className="font-medium text-fg">{title}</span>
        <span className="text-fg-3">
          {fmt(total)} {unit}
        </span>
      </figcaption>
      <div className="relative">
        <div className="flex h-7 w-full gap-[2px]" role="list" aria-label={title}>
          {parts.map((p, i) => {
            const share = p.value / total
            return (
              <div
                key={p.name}
                role="listitem"
                tabIndex={0}
                aria-label={`${p.name}: ${fmt(p.value)} ${unit}, ${(share * 100).toFixed(1)}%`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="relative h-full min-w-[3px] rounded-[4px] transition-[filter] outline-offset-2"
                style={{ flexGrow: p.value, flexBasis: 0, background: p.color, filter: hover === i ? 'brightness(1.2)' : undefined }}
              >
                {share >= 0.09 && (
                  <span
                    className="absolute top-1/2 left-2 -translate-y-1/2 text-[11px] font-semibold"
                    style={{ color: ink(p.color) }}
                  >
                    {Math.round(share * 100)}%
                  </span>
                )}
              </div>
            )
          })}
        </div>
        {hover !== null && (
          <Tip x={centers[hover]}>
            <div className="text-sm font-semibold text-white">
              {fmt(parts[hover].value)} {unit}
            </div>
            <div className="text-fg-3">
              {parts[hover].name} · {((parts[hover].value / total) * 100).toFixed(1)}%
            </div>
          </Tip>
        )}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-fg-2">
        {parts.map((p) => (
          <li key={p.name} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px]" style={{ background: p.color }} />
            {p.name}
          </li>
        ))}
      </ul>
      <TableToggle label="this breakdown">
        <table className="w-full text-xs">
          <thead className="bg-white/[0.03]">
            <tr>
              <th className={th}>Part</th>
              <th className={th}>{unit}</th>
              <th className={th}>Share</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((p) => (
              <tr key={p.name} className="border-t border-white/5">
                <td className={td}>{p.name}</td>
                <td className={td}>{fmt(p.value)}</td>
                <td className={td}>{((p.value / total) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableToggle>
    </figure>
  )
}

/* ---------- dumbbell: query time before vs after indexes (log scale) ---------- */

type QueryRow = { label: string; req: string; before: number; after: number; change: string; slower?: boolean }

export const queryRows: QueryRow[] = [
  { label: 'Home page, newest first', req: 'GET /api/v1/products', before: 42.2, after: 0.087, change: '483×' },
  { label: 'Category page, newest', req: '?category=HOME', before: 37.9, after: 0.136, change: '279×' },
  { label: 'Category by price, low → high', req: '&sort=price_asc', before: 37.8, after: 0.084, change: '451×' },
  { label: 'Category by price, high → low', req: '&sort=price_desc', before: 37.1, after: 0.117, change: '317×' },
  { label: 'Price range, in stock', req: '?minPrice=1000&maxPrice=2000&inStock=true', before: 41.3, after: 0.112, change: '369×' },
  { label: 'Name search, common word', req: '?q=linen', before: 48.6, after: 0.664, change: '73×' },
  { label: 'Name search, no match', req: '?q=zebra', before: 44.5, after: 193, change: '4.3× slower', slower: true },
]

const LOG_MIN = Math.log10(0.05)
const LOG_MAX = Math.log10(300)
const xLog = (v: number) => ((Math.log10(v) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100
const logTicks = [0.1, 1, 10, 100]

export function QueryDumbbell() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const [hover, setHover] = useState<number | null>(null)

  return (
    <figure ref={ref}>
      <figcaption className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-fg-2">
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-series-before ring-2 ring-ink-850" /> Before: no search indexes (V1)
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-series-after ring-2 ring-ink-850" /> After: four indexes from measured plans (V2)
        </span>
      </figcaption>

      <div className="space-y-1">
        {queryRows.map((r, i) => {
          const xb = xLog(r.before)
          const xa = inView ? xLog(r.after) : xb
          const lo = Math.min(xa, xb)
          const hi = Math.max(xa, xb)
          const delay = `${i * 90}ms`
          return (
            <div
              key={r.label}
              tabIndex={0}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${r.label}: ${r.before} ms before, ${r.after} ms after, ${r.slower ? r.change : `${r.change} faster`}`}
              className={`grid grid-cols-1 items-center gap-x-4 gap-y-1 rounded-xl px-2 py-2 transition md:grid-cols-[14.5rem_1fr_6.5rem] ${
                hover === i ? 'bg-white/[0.04]' : ''
              }`}
            >
              <div className="flex items-baseline justify-between gap-3 md:block">
                <div className="text-sm text-fg">{r.label}</div>
                <div className="hidden truncate font-mono text-[10.5px] text-fg-3 md:block">{r.req}</div>
                <ChangeTag row={r} className="md:hidden" />
              </div>
              <div className="relative h-8">
                {logTicks.map((t) => (
                  <span key={t} className="absolute inset-y-0 w-px bg-white/[0.07]" style={{ left: `${xLog(t)}%` }} />
                ))}
                <span
                  className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-series-after to-series-before transition-all duration-[1400ms] ease-out"
                  style={{
                    left: `${lo}%`,
                    width: `${hi - lo}%`,
                    transitionDelay: delay,
                    backgroundImage: r.slower ? 'linear-gradient(90deg, var(--color-series-before), var(--color-series-after))' : undefined,
                  }}
                />
                <span
                  className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-series-before ring-2 ring-ink-850"
                  style={{ left: `${xb}%` }}
                />
                <span
                  className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-series-after ring-2 ring-ink-850 transition-[left] duration-[1400ms] ease-out"
                  style={{ left: `${xa}%`, transitionDelay: delay }}
                />
                {hover === i && (
                  <Tip x={xLog(r.after)}>
                    <div className="text-sm font-semibold text-white">
                      {r.after} ms <span className="font-normal text-fg-3">after</span>
                    </div>
                    <div className="text-fg-2">
                      {r.before} ms before · {r.slower ? r.change : `${r.change} faster`}
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] text-fg-3">{r.req}</div>
                  </Tip>
                )}
              </div>
              <ChangeTag row={r} className="hidden md:flex" />
            </div>
          )
        })}
        <div className="grid grid-cols-1 gap-x-4 px-2 md:grid-cols-[14.5rem_1fr_6.5rem]">
          <span className="hidden md:block" />
          <div className="relative h-5 border-t border-white/10">
            {logTicks.map((t) => (
              <span
                key={t}
                className="absolute top-1 -translate-x-1/2 font-mono text-[10.5px] text-fg-3 tabular-nums"
                style={{ left: `${xLog(t)}%` }}
              >
                {t} ms
              </span>
            ))}
          </div>
        </div>
        <p className="px-2 pt-2 text-center text-[11px] text-fg-3 md:pl-[15.5rem] md:text-left">
          Time inside MySQL on 100,000 products, median of 3 warm <span className="font-mono">EXPLAIN ANALYZE</span> runs. Log scale: each gridline is 10× the last.
        </p>
      </div>

      <TableToggle label="the benchmark">
        <table className="w-full min-w-[34rem] text-xs">
          <thead className="bg-white/[0.03]">
            <tr>
              <th className={th}>Query</th>
              <th className={th}>Request</th>
              <th className={th}>Before</th>
              <th className={th}>After</th>
              <th className={th}>Change</th>
            </tr>
          </thead>
          <tbody>
            {queryRows.map((r) => (
              <tr key={r.label} className="border-t border-white/5">
                <td className={td}>{r.label}</td>
                <td className={`${td} font-mono text-[10.5px]`}>{r.req}</td>
                <td className={td}>{r.before} ms</td>
                <td className={td}>{r.after} ms</td>
                <td className={td}>{r.slower ? r.change : `${r.change} faster`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableToggle>
    </figure>
  )
}

function ChangeTag({ row, className = '' }: { row: QueryRow; className?: string }) {
  if (row.slower)
    return (
      <span
        className={`w-fit shrink-0 items-center gap-1 rounded-full border border-rose-400/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-200 ${className}`}
      >
        <AlertTriangle className="size-3" /> {row.change}
      </span>
    )
  return (
    <span className={`shrink-0 items-baseline gap-1 text-right ${className}`}>
      <span className="text-lg font-semibold text-white">{row.change}</span>
      <span className="text-[11px] text-fg-3">faster</span>
    </span>
  )
}

/* ---------- horizontal bars: one series, value at the tip ---------- */

type BarRow = { name: string; value: number; valueText?: string; tag: string; tip: string; cells: string[] }

export function HBarChart({
  title,
  note,
  rows,
  max,
  ticks,
  tickLabel,
  unit,
  tagWidth = '3.5rem',
  tableLabel,
  tableHead,
}: {
  title: string
  note: string
  rows: BarRow[]
  max: number
  ticks: number[]
  tickLabel: (t: number) => string
  unit: string
  tagWidth?: string
  tableLabel: string
  tableHead: string[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const [hover, setHover] = useState<number | null>(null)
  const cols = { ['--tag' as string]: tagWidth }
  return (
    <figure ref={ref}>
      <figcaption className="mb-4">
        <div className="text-sm font-medium text-fg">{title}</div>
        <div className="text-xs text-fg-3">{note}</div>
      </figcaption>
      <div className="space-y-3" style={cols}>
        {rows.map((k, i) => {
          const w = (k.value / max) * 100
          const shown = k.valueText ?? fmt(k.value)
          return (
            <div
              key={k.name}
              tabIndex={0}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${k.name}: ${shown} ${unit}, ${k.tip}`}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 rounded-lg md:grid-cols-[13rem_1fr_var(--tag)]"
            >
              <div className="text-sm text-fg-2">{k.name}</div>
              <div className="text-right text-base font-semibold whitespace-nowrap text-white md:order-last">{k.tag}</div>
              <div className="relative col-span-2 h-6 md:col-span-1">
                {ticks.map((t) => (
                  <span key={t} className="absolute inset-y-0 w-px bg-white/[0.07]" style={{ left: `${(t / max) * 100}%` }} />
                ))}
                <div
                  className="absolute inset-y-0 left-0 rounded-r-[4px] bg-bar transition-[width,filter] duration-[1200ms] ease-out"
                  style={{ width: inView ? `${w}%` : '0%', transitionDelay: `${i * 140}ms`, filter: hover === i ? 'brightness(1.2)' : undefined }}
                />
                <span
                  className="absolute top-1/2 -translate-y-1/2 px-2 font-mono text-[11px] tabular-nums transition-opacity duration-500"
                  style={{
                    ...(w > 55 ? { right: `${100 - w}%`, color: ink('#199e70') } : { left: `${w}%`, color: 'var(--color-fg-2)' }),
                    opacity: inView ? 1 : 0,
                    transitionDelay: `${900 + i * 140}ms`,
                  }}
                >
                  {shown}
                </span>
                {hover === i && (
                  <Tip x={w / 2}>
                    <div className="text-sm font-semibold text-white">
                      {shown} {unit}
                    </div>
                    <div className="text-fg-2">{k.tip}</div>
                  </Tip>
                )}
              </div>
            </div>
          )
        })}
        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-[13rem_1fr_var(--tag)]">
          <span className="hidden md:block" />
          <div className="relative h-5 border-t border-white/10">
            {ticks.map((t) => (
              <span key={t} className="absolute top-1 -translate-x-1/2 font-mono text-[10.5px] text-fg-3 tabular-nums" style={{ left: `${(t / max) * 100}%` }}>
                {tickLabel(t)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <TableToggle label={tableLabel}>
        <table className="w-full text-xs">
          <thead className="bg-white/[0.03]">
            <tr>
              {tableHead.map((h) => (
                <th key={h} className={th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((k) => (
              <tr key={k.name} className="border-t border-white/5">
                <td className={td}>{k.name}</td>
                {k.cells.map((c, ci) => (
                  <td key={ci} className={td}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </TableToggle>
    </figure>
  )
}

export function InstructionBars() {
  const kernels = [
    { name: 'Naive C (reference)', value: 1151529, perMac: 13.67, speed: '1.00×' },
    { name: 'DSP SIMD (SMLAD, SXTB16)', value: 479357, perMac: 5.69, speed: '2.40×' },
    { name: 'SIMD + 2×2 register tiling', value: 280089, perMac: 3.32, speed: '4.11×' },
  ]
  return (
    <HBarChart
      title="Instructions executed per CNN inference"
      note="Counted exactly in QEMU with -icount. Fewer is faster."
      rows={kernels.map((k) => ({
        name: k.name,
        value: k.value,
        tag: k.speed,
        tip: `${k.perMac} per multiply-accumulate · ${k.speed} vs naive`,
        cells: [fmt(k.value), String(k.perMac), k.speed],
      }))}
      max={1450000}
      ticks={[0, 400000, 800000, 1200000]}
      tickLabel={(t) => (t === 0 ? '0' : `${t / 1000}K`)}
      unit="instructions"
      tableLabel="the kernel numbers"
      tableHead={['Kernel', 'Instructions / inference', 'Per MAC', 'vs naive']}
    />
  )
}

/* ---------- scheduler trace: priority inversion, recorded by the kernel ---------- */

type Task = 'pi-high' | 'pi-mid' | 'pi-low' | 'idle'
type Seg = { task: Task; from: number; to: number; note: string; label?: string }
const taskColor: Record<Task, string> = {
  'pi-high': '#d55181',
  'pi-mid': '#c98500',
  'pi-low': '#3987e5',
  idle: '#5d5a78',
}
const TRACE_MS = 72
const tasks: Task[] = ['pi-high', 'pi-mid', 'pi-low', 'idle']

// Segment times read from the tracer's own export (docs/img/priority_inversion.svg in kestrel-rtos).
const traces: { title: string; result: string; wait: [number, number]; waitLabel: string; segs: Seg[] }[] = [
  {
    title: 'Priority inheritance OFF',
    result: 'pi-high waits ≈65 ms',
    wait: [4.95, 70.06],
    waitLabel: 'pi-high blocked on the mutex · ≈65 ms',
    segs: [
      { task: 'pi-low', from: 0, to: 4.95, note: 'pi-low takes the mutex and starts its critical section' },
      { task: 'pi-high', from: 4.95, to: 5.05, note: 'pi-high wakes, needs the mutex, and blocks' },
      { task: 'pi-low', from: 4.95, to: 7.95, note: 'pi-low keeps the mutex at its own low priority' },
      { task: 'pi-mid', from: 7.95, to: 57.95, note: 'pi-mid preempts pi-low and runs 50 ms: priority inversion', label: 'pi-mid runs 50 ms' },
      { task: 'pi-low', from: 57.96, to: 70.06, note: 'pi-low finally finishes its critical section' },
      { task: 'pi-high', from: 70.06, to: 70.16, note: 'pi-high gets the mutex at 70.1 ms' },
      { task: 'idle', from: 70.06, to: 72, note: 'Nothing left to run' },
    ],
  },
  {
    title: 'Priority inheritance ON',
    result: 'pi-high waits ≈15 ms',
    wait: [4.78, 20.05],
    waitLabel: '≈15 ms',
    segs: [
      { task: 'pi-low', from: 0, to: 4.78, note: 'pi-low takes the mutex and starts its critical section' },
      { task: 'pi-high', from: 4.78, to: 4.88, note: 'pi-high blocks on the mutex; pi-low inherits its priority' },
      { task: 'pi-low', from: 4.78, to: 20.05, note: 'pi-low, boosted to pi-high’s priority, cannot be preempted by pi-mid', label: 'boosted' },
      { task: 'pi-high', from: 20.05, to: 20.15, note: 'pi-high gets the mutex at 20.1 ms' },
      { task: 'pi-mid', from: 20.05, to: 70.05, note: 'pi-mid runs only after pi-high has been served', label: 'pi-mid runs 50 ms' },
      { task: 'idle', from: 70.06, to: 71.85, note: 'Nothing left to run' },
    ],
  },
]

export function PriorityTrace() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const [hover, setHover] = useState<string | null>(null)
  const pct = (ms: number) => (ms / TRACE_MS) * 100

  return (
    <figure ref={ref} className="space-y-8">
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-fg-2">
        {tasks.map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded-[3px]" style={{ background: taskColor[t] }} />
            <span className="font-mono">{t}</span>
            <span className="text-fg-3">{t === 'pi-high' ? 'high priority' : t === 'pi-mid' ? 'medium' : t === 'pi-low' ? 'low' : ''}</span>
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="hatch h-2.5 w-4 rounded-[3px] border border-white/10" /> waiting for the mutex
        </span>
      </figcaption>

      {traces.map((tr, ti) => (
        <div key={tr.title}>
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <div className="text-sm font-semibold text-fg">{tr.title}</div>
            <div className={`font-mono text-xs ${ti === 0 ? 'text-rose-200' : 'text-emerald-200'}`}>{tr.result}</div>
          </div>
          <div className="relative">
            <div
              className="space-y-1.5 transition-[clip-path] ease-linear"
              style={{
                clipPath: inView ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                transitionDuration: '2600ms',
                transitionDelay: `${ti * 700}ms`,
              }}
            >
              {tasks.map((task) => (
                <div key={task} className="grid grid-cols-[4.2rem_1fr] items-center gap-2">
                  <span className="text-right font-mono text-[11px] text-fg-3">{task}</span>
                  <div className="relative h-6 rounded-md bg-white/[0.03]">
                    {task === 'pi-high' && (
                      <div
                        className="hatch absolute inset-y-0 flex items-center justify-center overflow-hidden rounded-[3px] border border-[#d55181]/40"
                        style={{ left: `${pct(tr.wait[0])}%`, width: `${pct(tr.wait[1] - tr.wait[0])}%` }}
                      >
                        <span className="rounded bg-ink-850/90 px-1.5 text-[10.5px] whitespace-nowrap text-fg-2">{tr.waitLabel}</span>
                      </div>
                    )}
                    {tr.segs
                      .filter((s) => s.task === task)
                      .map((s) => {
                        const id = `${ti}-${s.task}-${s.from}`
                        return (
                          <div
                            key={id}
                            tabIndex={0}
                            aria-label={`${s.task}, ${s.from.toFixed(1)} to ${s.to.toFixed(1)} ms: ${s.note}`}
                            onMouseEnter={() => setHover(id)}
                            onMouseLeave={() => setHover(null)}
                            onFocus={() => setHover(id)}
                            onBlur={() => setHover(null)}
                            className="absolute inset-y-0 flex min-w-[3px] items-center overflow-visible rounded-[3px] transition-[filter]"
                            style={{
                              left: `${pct(s.from)}%`,
                              width: `${pct(s.to - s.from)}%`,
                              background: taskColor[s.task],
                              filter: hover === id ? 'brightness(1.25)' : undefined,
                            }}
                          >
                            {s.label && (
                              <span className="truncate px-2 text-[10.5px] font-semibold" style={{ color: ink(taskColor[s.task]) }}>
                                {s.label}
                              </span>
                            )}
                            {hover === id && (
                              <Tip x={50} below={s.task === 'pi-high'}>
                                <div className="font-semibold text-white">
                                  {s.from.toFixed(1)}–{s.to.toFixed(1)} ms
                                </div>
                                <div className="text-fg-2">{s.note}</div>
                              </Tip>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 left-[4.7rem]">
              <span
                className="absolute inset-y-[-4px] w-0.5 rounded bg-white shadow-[0_0_14px_2px_rgba(255,255,255,.6)] transition-[left,opacity] ease-linear"
                style={{
                  left: inView ? '100%' : '0%',
                  opacity: inView ? 0 : 1,
                  transitionDuration: '2600ms, 400ms',
                  transitionDelay: `${ti * 700}ms, ${ti * 700 + 2600}ms`,
                }}
              />
            </div>
          </div>
          <div className="mt-1 grid grid-cols-[4.2rem_1fr] gap-2">
            <span />
            <div className="relative h-4">
              {[0, 10, 20, 30, 40, 50, 60, 70].map((t) => (
                <span
                  key={t}
                  className="absolute -translate-x-1/2 font-mono text-[10px] text-fg-3 tabular-nums max-sm:[&:nth-child(even)]:hidden"
                  style={{ left: `${pct(t)}%` }}
                >
                  {t} ms
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
      <TableToggle label="the trace">
        <table className="w-full min-w-[30rem] text-xs">
          <thead className="bg-white/[0.03]">
            <tr>
              <th className={th}>Run</th>
              <th className={th}>Task</th>
              <th className={th}>From – to</th>
              <th className={th}>What happens</th>
            </tr>
          </thead>
          <tbody>
            {traces.flatMap((tr) =>
              tr.segs.map((s) => (
                <tr key={`${tr.title}-${s.task}-${s.from}`} className="border-t border-white/5">
                  <td className={td}>{tr.title.replace('Priority inheritance ', 'PI ')}</td>
                  <td className={`${td} font-mono`}>{s.task}</td>
                  <td className={td}>
                    {s.from.toFixed(1)}–{s.to.toFixed(1)} ms
                  </td>
                  <td className={td}>{s.note}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </TableToggle>
    </figure>
  )
}

/* ---------- paired bars: baseline vs mine, one small panel per metric ---------- */

type PairMetric = { name: string; unit: string; a: number; b: number; digits: number }

export function PairedBars({
  title,
  note,
  labels,
  metrics,
  tableLabel,
}: {
  title: string
  note: string
  labels: [string, string]
  metrics: PairMetric[]
  tableLabel: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const [hover, setHover] = useState<number | null>(null)
  const show = (v: number, m: PairMetric) => `${v.toFixed(m.digits)}${m.unit}`
  const change = (m: PairMetric) => ((m.b - m.a) / m.a) * 100
  const colors = ['var(--color-series-before)', 'var(--color-series-after)']

  return (
    <figure ref={ref}>
      <figcaption className="mb-4">
        <div className="text-sm font-medium text-fg">{title}</div>
        <div className="text-xs text-fg-3">{note}</div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-2">
          {labels.map((l, i) => (
            <span key={l} className="flex items-center gap-1.5">
              <span className="h-2.5 w-4 rounded-[3px]" style={{ background: colors[i] }} /> {l}
            </span>
          ))}
        </div>
      </figcaption>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        {metrics.map((m, mi) => {
          const max = Math.max(m.a, m.b) * 1.3
          const c = change(m)
          return (
            <div
              key={m.name}
              tabIndex={0}
              onMouseEnter={() => setHover(mi)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(mi)}
              onBlur={() => setHover(null)}
              aria-label={`${m.name}: ${labels[0]} ${show(m.a, m)}, ${labels[1]} ${show(m.b, m)}, ${c.toFixed(1)}%`}
              className="relative rounded-xl p-1"
            >
              <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
                <span className="font-medium text-fg">{m.name}</span>
                <span className={c < 0 ? 'text-fg-2' : 'flex items-center gap-1 text-rose-200'}>
                  {c >= 0 && <AlertTriangle className="size-3" />}
                  {c < 0 ? '−' : '+'}
                  {Math.abs(c).toFixed(1)}%
                </span>
              </div>
              <div className="space-y-[2px]">
                {[m.a, m.b].map((v, si) => {
                  const w = (v / max) * 100
                  return (
                    <div key={si} className="relative h-3.5">
                      <div
                        className="absolute inset-y-0 left-0 rounded-r-[4px] transition-[width,filter] duration-[1100ms] ease-out"
                        style={{
                          width: inView ? `${w}%` : '0%',
                          background: colors[si],
                          transitionDelay: `${mi * 90 + si * 120}ms`,
                          filter: hover === mi ? 'brightness(1.2)' : undefined,
                        }}
                      />
                      <span
                        className="absolute top-1/2 -translate-y-1/2 pl-1.5 font-mono text-[10.5px] text-fg-2 tabular-nums transition-opacity duration-500"
                        style={{ left: `${w}%`, opacity: inView ? 1 : 0, transitionDelay: `${700 + mi * 90}ms` }}
                      >
                        {show(v, m)}
                      </span>
                    </div>
                  )
                })}
              </div>
              {hover === mi && (
                <Tip x={50}>
                  <div className="text-sm font-semibold text-white">
                    {show(m.a, m)} → {show(m.b, m)}
                  </div>
                  <div className="text-fg-2">
                    {m.name}: {c < 0 ? `${Math.abs(c).toFixed(1)}% lower` : `${c.toFixed(1)}% higher`} · lower is better
                  </div>
                </Tip>
              )}
            </div>
          )
        })}
      </div>
      <TableToggle label={tableLabel}>
        <table className="w-full text-xs">
          <thead className="bg-white/[0.03]">
            <tr>
              <th className={th}>Metric</th>
              <th className={th}>{labels[0]}</th>
              <th className={th}>{labels[1]}</th>
              <th className={th}>Change</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.name} className="border-t border-white/5">
                <td className={td}>{m.name}</td>
                <td className={td}>{show(m.a, m)}</td>
                <td className={td}>{show(m.b, m)}</td>
                <td className={td}>
                  {change(m) < 0 ? '−' : '+'}
                  {Math.abs(change(m)).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableToggle>
    </figure>
  )
}
