import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from '../lib/hooks'
import { WindowBar } from './ui'

export type TermLine = { kind: 'cmd' | 'out'; text: string; tone?: 'ok' | 'warn' | 'err' | 'dim' | 'accent' }

const toneClass: Record<NonNullable<TermLine['tone']>, string> = {
  ok: 'text-emerald-300',
  warn: 'text-amber-300',
  err: 'text-rose-300',
  dim: 'text-fg-3',
  accent: 'text-fuchsia-300',
}

/**
 * A terminal that types each command, then prints its output.
 * It starts when scrolled into view; remount it (change `key`) to replay.
 */
export function TypedTerminal({
  lines,
  title,
  prompt = '$',
  className = '',
  minHeight = 0,
}: {
  lines: TermLine[]
  title: string
  prompt?: string
  className?: string
  minHeight?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const [li, setLi] = useState(0)
  const [ci, setCi] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setLi(lines.length)
      return
    }
    if (li >= lines.length) return
    const line = lines[li]
    let t: number
    if (line.kind === 'cmd') {
      if (ci < line.text.length) t = window.setTimeout(() => setCi(ci + 1), 26 + Math.random() * 45)
      else
        t = window.setTimeout(() => {
          setLi(li + 1)
          setCi(0)
        }, 380)
    } else {
      t = window.setTimeout(() => setLi(li + 1), 55)
    }
    return () => window.clearTimeout(t)
  }, [inView, reduced, li, ci, lines])

  const done = li >= lines.length
  const typing = !done && lines[li].kind === 'cmd'

  return (
    <div ref={ref} className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0a0913]/90 shadow-2xl shadow-black/50 ${className}`}>
      <WindowBar title={title} />
      <pre
        className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-fg-2 md:p-5 md:text-[13px]"
        style={{ minHeight }}
        aria-label={lines.map((l) => (l.kind === 'cmd' ? `${prompt} ${l.text}` : l.text)).join('\n')}
      >
        {lines.slice(0, li).map((l, i) =>
          l.kind === 'cmd' ? (
            <div key={i}>
              <span className="text-fuchsia-400">{prompt}</span> <span className="text-fg">{l.text}</span>
            </div>
          ) : (
            <div key={i} className={l.tone ? toneClass[l.tone] : ''}>
              {l.text || ' '}
            </div>
          ),
        )}
        {typing && (
          <div>
            <span className="text-fuchsia-400">{prompt}</span> <span className="text-fg">{lines[li].text.slice(0, ci)}</span>
            <span className="caret text-fuchsia-300" />
          </div>
        )}
        {done && (
          <div>
            <span className="text-fuchsia-400">{prompt}</span> <span className="caret text-fuchsia-300" />
          </div>
        )}
      </pre>
    </div>
  )
}
