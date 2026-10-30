import { useRef, type CSSProperties, type ElementType, type MouseEvent, type ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useCountUp, useInView } from '../lib/hooks'

/** Fades and lifts its children in when they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: ElementType
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref)
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

/** A card whose border area glows where the pointer is. */
export function Spotlight({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div onMouseMove={onMove} className={`spotlight glass rounded-3xl ${className}`} style={style}>
      {children}
    </div>
  )
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  sub,
}: {
  index: string
  eyebrow: string
  title: ReactNode
  sub?: ReactNode
}) {
  return (
    <Reveal className="mb-12 max-w-3xl md:mb-16">
      <div className="mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-fg-3 uppercase">
        <span className="text-accent font-semibold">{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-[var(--accent)] to-transparent" />
        {eyebrow}
      </div>
      <h2 className="text-4xl leading-[1.05] font-bold text-balance md:text-6xl">{title}</h2>
      {sub && <p className="mt-5 text-lg leading-relaxed text-fg-2 text-pretty">{sub}</p>}
    </Reveal>
  )
}

export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-fg-2 ${className}`}
    >
      {children}
    </span>
  )
}

export function TechIcon({ name, className = 'size-5' }: { name: string; className?: string }) {
  return (
    <img
      src={`./icons/${name}.svg`}
      alt=""
      loading="lazy"
      className={`${className} ${name === 'github' || name === 'nginx' || name === 'flyway' ? 'brightness-0 invert' : ''}`}
    />
  )
}

export function LinkButton({
  href,
  children,
  primary = false,
  icon,
}: {
  href: string
  children: ReactNode
  primary?: boolean
  icon?: ReactNode
}) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={
        primary
          ? 'group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_var(--accent)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-8px_var(--accent)]'
          : 'group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-fg transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08]'
      }
    >
      {icon}
      {children}
      {external && <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
    </a>
  )
}

/** A number that counts up when it scrolls into view. */
export function Counter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref)
  const v = useCountUp(value, inView)
  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value.toLocaleString('en-US')}${suffix}`}>
      {prefix}
      {v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

export function Stat({
  value,
  label,
  decimals,
  prefix,
  suffix,
  note,
}: {
  value: number
  label: string
  decimals?: number
  prefix?: string
  suffix?: string
  note?: string
}) {
  return (
    <div className="glass rounded-2xl p-4 md:p-5">
      <Counter
        value={value}
        decimals={decimals}
        prefix={prefix}
        suffix={suffix}
        className="text-accent block font-sans text-3xl font-semibold tracking-tight md:text-4xl"
      />
      <div className="mt-1.5 text-sm text-fg-2">{label}</div>
      {note && <div className="mt-0.5 text-xs text-fg-3">{note}</div>}
    </div>
  )
}

export function BrowserFrame({ url, children, className = '' }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-2xl shadow-black/60 ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/[0.07] bg-ink-800/80 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-auto max-w-[60%] truncate rounded-md bg-white/[0.05] px-3 py-0.5 font-mono text-[11px] text-fg-3">
          {url}
        </div>
        <span className="w-10" />
      </div>
      {children}
    </div>
  )
}

export function WindowBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
      <span className="size-2.5 rounded-full bg-[#ff5f57]" />
      <span className="size-2.5 rounded-full bg-[#febc2e]" />
      <span className="size-2.5 rounded-full bg-[#28c840]" />
      <span className="ml-2 font-mono text-[11px] text-fg-3">{title}</span>
    </div>
  )
}

/** Small label used on visuals that illustrate a concept rather than show measured data. */
export function IllustrationTag() {
  return (
    <span className="rounded-full border border-white/10 bg-ink-900/80 px-2 py-0.5 font-mono text-[10px] tracking-wider text-fg-3 uppercase">
      illustration
    </span>
  )
}
