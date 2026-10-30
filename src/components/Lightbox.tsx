import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export type Shot = { src: string; thumb: string; title: string; caption: string; path: string }

export function Lightbox({
  shots,
  index,
  onIndex,
  onClose,
}: {
  shots: Shot[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const next = () => onIndex((index + 1) % shots.length)
  const prev = () => onIndex((index - 1 + shots.length) % shots.length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % shots.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + shots.length) % shots.length)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [index, shots.length, onIndex, onClose])

  const s = shots[index]
  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={s.title}
    >
      <button className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close">
        <X className="size-5" />
      </button>
      <figure className="w-full max-w-6xl" onClick={(e) => e.stopPropagation()} style={{ animation: 'rise .25s both' }} key={s.src}>
        <img src={s.src} alt={s.title} className="w-full rounded-xl border border-white/10 shadow-2xl" />
        <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm">
          <span>
            <b className="text-white">{s.title}</b> <span className="text-fg-2">· {s.caption}</span>
          </span>
          <span className="font-mono text-xs text-fg-3">
            {index + 1} / {shots.length}
          </span>
        </figcaption>
      </figure>
      <button
        onClick={(e) => {
          e.stopPropagation()
          prev()
        }}
        className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20"
        aria-label="Previous screenshot"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          next()
        }}
        className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20"
        aria-label="Next screenshot"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}
