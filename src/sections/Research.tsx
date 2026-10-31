import { ArrowDown, ArrowRight, Brain, Lock, Users } from 'lucide-react'
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

function LoopBox({ title, sub, accent = false }: { title: string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border px-3 py-2 text-center ${accent ? 'border-rose-300/40 bg-rose-400/10' : 'border-white/10 bg-white/[0.03]'}`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-[11px] text-fg-3">{sub}</div>
    </div>
  )
}

function RlPidVisual() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-ink-900/70 p-4">
      <div className="mb-3 flex justify-end">
        <IllustrationTag />
      </div>
      <div className="mx-auto flex max-w-xs flex-col items-center md:max-w-none">
        <div className="flex items-center gap-2 rounded-xl border border-pink-300/40 bg-gradient-to-r from-rose-500/20 to-pink-500/20 px-4 py-2">
          <Brain className="size-4 text-pink-200" />
          <span className="text-sm font-semibold">PPO agent</span>
          <span className="text-[11px] text-fg-3">trained from scratch</span>
        </div>
        <div className="flex flex-col items-center text-[11px] text-pink-200">
          <span className="connector" style={{ ['--accent' as string]: '#fb7185', ['--accent-2' as string]: '#f472b6', height: 22 }} />
          tunes Kp · Ki · Kd
        </div>
        <div className="mt-2 grid w-full grid-cols-1 items-center gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          <LoopBox title="Setpoint" sub="target value" />
          <ArrowRight className="mx-auto size-4 rotate-90 text-fg-3 md:rotate-0" />
          <LoopBox title="PID" sub="adaptive gains" accent />
          <ArrowRight className="mx-auto size-4 rotate-90 text-fg-3 md:rotate-0" />
          <LoopBox title="Unstable process" sub="the plant" />
          <ArrowRight className="mx-auto size-4 rotate-90 text-fg-3 md:rotate-0" />
          <LoopBox title="STM32F407" sub="where it will run" />
        </div>
        <div className="mt-3 flex w-full items-center gap-2 text-[11px] text-fg-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          measured output feeds back as error
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </div>
      </div>
    </div>
  )
}

export function Research() {
  return (
    <section id="research" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32" style={{ ['--accent' as string]: '#38bdf8', ['--accent-2' as string]: '#f472b6' }}>
      <SectionHeading
        index="04"
        eyebrow="Research & team work"
        title={
          <>
            Signals, control loops and <span className="text-gradient">ML on the edge.</span>
          </>
        }
        sub="ML-based fault detection running on a microcontroller, and a final-year control-systems project."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="glass gradient-border h-full rounded-3xl p-6 md:p-7" style={{ ['--accent' as string]: '#38bdf8', ['--accent-2' as string]: '#818cf8' }}>
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
            <div className="mt-6">
              <EdgeMindVisual />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {['C', 'STM32F407', 'CMSIS-DSP', '256-point FFT', 'Decision tree', 'Python ML'].map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-fg-3">
              <Lock className="size-3" /> Code not public yet
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="glass gradient-border h-full rounded-3xl p-6 md:p-7" style={{ ['--accent' as string]: '#fb7185', ['--accent-2' as string]: '#f472b6' }}>
            <div className="flex flex-wrap items-center gap-2">
              <Chip>
                <Users className="size-3" /> Team Viper · team of 4
              </Chip>
              <Chip>Final-year project · control systems</Chip>
              <Chip>
                <span className="size-1.5 rounded-full bg-amber-300" /> In progress
              </Chip>
            </div>
            <h3 className="mt-5 text-3xl font-bold">RL-PID controller</h3>
            <p className="mt-2 text-lg text-fg">Adaptive PID for unstable processes.</p>
            <p className="mt-3 leading-relaxed text-fg-2">
              A classic PID controller with fixed gains struggles when the process itself is unstable. Here the gains are tuned by a
              PPO reinforcement-learning agent trained from scratch, and the controller is headed for an STM32F407.
            </p>
            <div className="mt-6">
              <RlPidVisual />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Reinforcement learning (PPO)', 'Control systems', 'Python', 'STM32F407'].map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-fg-3">
              <ArrowDown className="size-3" /> Next: training the PPO agent for the STM32
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
