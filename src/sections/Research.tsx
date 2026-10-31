import { ArrowRight, Lock } from 'lucide-react'
import { Chip, IllustrationTag, Reveal, SectionHeading } from '../components/ui'

// Deterministic "vibration" signal for the illustration: two tones plus a little noise.
const wave = (() => {
  const pts: string[] = []
  for (let i = 0; i <= 240; i++) {
    const t = i / 240
    const y = 50 + 22 * Math.sin(t * Math.PI * 14) + 9 * Math.sin(t * Math.PI * 46 + 1) + 5 * Math.sin(i * 12.9898) * Math.cos(i * 4.1414)
    pts.push(`${i === 0 ? 'M' : 'L'}${(i * 1.25).toFixed(1)},${y.toFixed(1)}`)
  }
  return pts.join(' ')
})()
const spectrum = [10, 14, 22, 30, 92, 40, 18, 12, 16, 26, 70, 34, 14, 10, 8, 12]

function EdgeMindVisual() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-ink-900/70 p-4">
      <div className="mb-3 flex justify-end">
        <IllustrationTag />
      </div>
      <div className="grid grid-cols-[1.3fr_auto_1fr_auto_1fr] items-center gap-2" aria-hidden>
        <svg viewBox="0 0 300 100" className="h-20 w-full">
          <path d={wave} fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinejoin="round" strokeDasharray="900" style={{ animation: 'draw 4s linear infinite' }} />
        </svg>
        <ArrowRight className="size-4 text-fg-3" />
        <div className="flex h-20 items-end gap-[3px]">
          {spectrum.map((h, i) => (
            <span
              key={i}
              className="flex-1 origin-bottom rounded-t-[2px] bg-gradient-to-t from-indigo-500 to-sky-300"
              style={{ height: `${h}%`, animation: `eq ${1.4 + (i % 4) * 0.3}s ${i * 0.07}s ease-in-out infinite alternate` }}
            />
          ))}
        </div>
        <ArrowRight className="size-4 text-fg-3" />
        <svg viewBox="0 0 120 100" className="h-20 w-full">
          <g stroke="rgba(255,255,255,.25)" strokeWidth="2">
            <line x1="60" y1="16" x2="32" y2="50" />
            <line x1="60" y1="16" x2="88" y2="50" />
            <line x1="32" y1="50" x2="16" y2="86" />
            <line x1="32" y1="50" x2="48" y2="86" />
            <line x1="88" y1="50" x2="72" y2="86" />
            <line x1="88" y1="50" x2="104" y2="86" />
          </g>
          <g stroke="#818cf8" strokeWidth="3" style={{ animation: 'pulse-path 2.4s ease-in-out infinite' }}>
            <line x1="60" y1="16" x2="88" y2="50" />
            <line x1="88" y1="50" x2="104" y2="86" />
          </g>
          {[
            [60, 16],
            [32, 50],
            [88, 50],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="7" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
          ))}
          {[16, 48, 72, 104].map((x) => (
            <rect key={x} x={x - 7} y={80} width="14" height="12" rx="3" fill={x === 104 ? '#38bdf8' : '#1e1b4b'} stroke="#38bdf8" strokeWidth="1.5" />
          ))}
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] text-fg-3">
        <span>vibration signal</span>
        <span>256-point FFT</span>
        <span>decision tree → fault class</span>
      </div>
    </div>
  )
}

export function Research() {
  return (
    <section id="research" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32" style={{ ['--accent' as string]: '#38bdf8', ['--accent-2' as string]: '#818cf8' }}>
      <SectionHeading
        index="04"
        eyebrow="Edge ML"
        title={
          <>
            Signals and <span className="text-gradient">ML on the edge.</span>
          </>
        }
        sub="Machine learning that runs where the sensor is, on the microcontroller itself."
      />
      <Reveal>
        <div className="glass gradient-border grid grid-cols-1 items-center gap-8 rounded-3xl p-6 md:p-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Chip>May – July 2026</Chip>
              <Chip>Edge ML · STM32F407</Chip>
            </div>
            <h3 className="mt-5 text-3xl font-bold">EdgeMind</h3>
            <p className="mt-2 text-lg text-fg">Vibration fault detection on an STM32F407.</p>
            <p className="mt-3 leading-relaxed text-fg-2">
              A 256-point FFT from CMSIS-DSP turns raw vibration into a frequency spectrum on the microcontroller itself, and a decision
              tree, trained offline and exported to bare-metal C, classifies the fault there too. No cloud round trip: the model runs where
              the sensor is.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['C', 'STM32F407', 'CMSIS-DSP', '256-point FFT', 'Decision tree', 'Python ML'].map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-fg-3">
              <Lock className="size-3" /> Code not public yet
            </p>
          </div>
          <EdgeMindVisual />
        </div>
      </Reveal>
    </section>
  )
}
