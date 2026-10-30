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
