import type { ReactNode } from 'react'
import { GithubIcon } from './brand'
import { Chip, LinkButton, Reveal, Stat, TechIcon } from './ui'

export function ProjectHeader({
  index,
  tags,
  name,
  tagline,
  children,
  links,
  stats,
}: {
  index: string
  tags: ReactNode[]
  name: string
  tagline: ReactNode
  children: ReactNode
  links: { href: string; label: string; primary?: boolean }[]
  stats: { value: number; label: string; decimals?: number; suffix?: string; prefix?: string; note?: string }[]
}) {
  return (
    <div className="mb-14">
      <Reveal>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-accent mr-1 font-mono text-sm font-semibold">{index}</span>
          {tags.map((t, i) => (
            <Chip key={i}>{t}</Chip>
          ))}
        </div>
        <h3 className="text-accent mt-5 w-fit pb-1 font-mono text-4xl font-bold tracking-tight md:text-6xl">{name}</h3>
        <p className="mt-4 max-w-3xl font-display text-xl leading-snug text-fg md:text-2xl">{tagline}</p>
        <div className="mt-4 max-w-3xl space-y-3 leading-relaxed text-fg-2">{children}</div>
        <div className="mt-7 flex flex-wrap gap-3">
          {links.map((l) => (
            <LinkButton key={l.href} href={l.href} primary={l.primary} icon={l.primary ? <GithubIcon className="size-4" /> : undefined}>
              {l.label}
            </LinkButton>
          ))}
        </div>
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 60}>
            <Stat {...s} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export function SubHeading({ kicker, title, sub }: { kicker: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <Reveal className="mb-6 max-w-2xl">
      <div className="text-accent font-mono text-xs font-semibold tracking-[0.18em] uppercase">{kicker}</div>
      <h4 className="mt-2 text-2xl font-semibold md:text-3xl">{title}</h4>
      {sub && <p className="mt-2 text-fg-2">{sub}</p>}
    </Reveal>
  )
}

export function TechRow({ items }: { items: { name: string; icon?: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t.name} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-fg-2">
          {t.icon && <TechIcon name={t.icon} className="size-4" />}
          {t.name}
        </span>
      ))}
    </div>
  )
}
