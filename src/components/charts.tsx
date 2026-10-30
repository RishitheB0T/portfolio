import { useState, type ReactNode } from 'react'
import { Table2 } from 'lucide-react'

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
