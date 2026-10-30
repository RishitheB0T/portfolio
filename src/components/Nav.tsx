import { useEffect, useMemo, useRef, useState } from 'react'
import { Command, CornerDownLeft, Menu, Search, X } from 'lucide-react'
import { useActiveSection, useScrollProgress } from '../lib/hooks'
import { links } from '../data/profile'

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'numbers', label: 'Numbers' },
  { id: 'builds', label: 'Builds' },
  { id: 'research', label: 'Research' },
  { id: 'journey', label: 'Journey' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
]

type PaletteItem = { label: string; hint: string; go: () => void }

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Nav() {
  const progress = useScrollProgress()
  const ids = useMemo(() => sections.map((s) => s.id), [])
  const active = useActiveSection(ids)
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />
      <header className="fixed inset-x-0 top-3 z-50 px-4">
        <nav
          className="glass frost mx-auto flex max-w-5xl bg-ink-950/60 items-center gap-2 rounded-full py-2 pr-2 pl-3 shadow-xl shadow-black/30"
          aria-label="Main"
        >
          <a href="#top" className="flex items-center gap-2.5 rounded-full pr-2" aria-label="Back to top">
            <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 font-display text-sm font-bold text-white">
              RK
            </span>
            <span className="hidden font-display text-sm font-semibold sm:inline">Rishikesh</span>
          </a>
          <ul className="mx-auto hidden items-center gap-1 lg:flex">
            {sections.slice(0, -1).map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`relative rounded-full px-3 py-1.5 text-sm transition ${
                    active === s.id ? 'bg-white/10 text-white' : 'text-fg-2 hover:text-white'
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setPaletteOpen(true)}
            className="ml-auto hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-fg-3 transition hover:border-white/25 hover:text-fg md:flex lg:ml-0"
            aria-label="Open quick search"
          >
            <Search className="size-3.5" /> Jump to
            <kbd className="flex items-center gap-0.5 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">
              <Command className="size-2.5" />K
            </kbd>
          </button>
          <a
            href="#contact"
            className="ml-auto rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-1.5 text-sm font-semibold text-white md:ml-0"
          >
            Contact
          </a>
          <button
            className="grid size-9 place-items-center rounded-full text-fg-2 hover:bg-white/10 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] bg-ink-950/95 backdrop-blur-xl lg:hidden" role="dialog" aria-modal="true">
          <button
            className="absolute top-5 right-5 grid size-10 place-items-center rounded-full bg-white/10"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
          <ul className="flex h-full flex-col justify-center gap-2 px-8">
            {sections.map((s, i) => (
              <li key={s.id} style={{ animation: `rise .45s ${i * 50}ms both` }}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline gap-4 py-2 font-display text-4xl font-bold"
                >
                  <span className="font-mono text-sm text-fuchsia-400">0{i + 1}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </>
  )
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const items: PaletteItem[] = useMemo(() => {
    const go = (id: string) => () => scrollTo(id)
    const open = (url: string) => () => window.open(url, '_blank', 'noreferrer')
    return [
      ...sections.map((s) => ({ label: s.label, hint: 'Section', go: go(s.id) })),
      { label: 'placement-prep: deep dive', hint: 'Project', go: go('placement-prep') },
      { label: 'product-catalog-service: deep dive', hint: 'Project', go: go('product-catalog') },
      { label: 'kestrel-rtos: deep dive', hint: 'Project', go: go('kestrel-rtos') },
      { label: 'EdgeMind and RL-PID', hint: 'Project', go: go('research') },
      { label: 'GitHub profile', hint: 'Link', go: open(links.github) },
      ...(links.linkedin ? [{ label: 'LinkedIn', hint: 'Link', go: open(links.linkedin) }] : []),
      ...(links.email ? [{ label: `Email ${links.email}`, hint: 'Link', go: () => (window.location.href = `mailto:${links.email}`) }] : []),
      { label: 'placement-prep source', hint: 'Link', go: open('https://github.com/RishitheB0T/placement-prep') },
      { label: 'product-catalog-service source', hint: 'Link', go: open('https://github.com/RishitheB0T/product-catalog-service') },
      { label: 'kestrel-rtos source', hint: 'Link', go: open('https://github.com/RishitheB0T/kestrel-rtos') },
    ]
  }, [])

  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()))

  useEffect(() => {
    inputRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const run = (item?: PaletteItem) => {
    if (!item) return
    onClose()
    setTimeout(item.go, 30)
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Quick search"
    >
      <div
        className="glass frost w-full max-w-lg overflow-hidden rounded-2xl bg-ink-900/90 shadow-2xl"
        style={{ animation: 'rise .2s both' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <Search className="size-4 text-fg-3" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setSel(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSel((s) => Math.min(s + 1, filtered.length - 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSel((s) => Math.max(s - 1, 0))
              } else if (e.key === 'Enter') run(filtered[sel])
              else if (e.key === 'Escape') onClose()
            }}
            placeholder="Jump to a section, project or link…"
            className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-fg-3"
            aria-label="Search"
          />
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-fg-3">ESC</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
          {filtered.map((item, i) => (
            <li key={item.label} role="option" aria-selected={i === sel}>
              <button
                onMouseEnter={() => setSel(i)}
                onClick={() => run(item)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm ${
                  i === sel ? 'bg-gradient-to-r from-violet-500/25 to-fuchsia-500/10 text-white' : 'text-fg-2'
                }`}
              >
                {item.label}
                <span className="flex items-center gap-2 text-xs text-fg-3">
                  {item.hint}
                  {i === sel && <CornerDownLeft className="size-3.5" />}
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-fg-3">Nothing matches “{q}”.</li>}
        </ul>
      </div>
    </div>
  )
}
