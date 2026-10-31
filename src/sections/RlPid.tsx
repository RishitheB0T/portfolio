import { useEffect, useRef } from 'react'
import { AlertTriangle, ArrowRight, Brain, CheckCircle2, Cpu, Flag, Skull, Users } from 'lucide-react'
import { Reveal, WindowBar } from '../components/ui'
import { ProjectHeader, SubHeading, TechRow } from '../components/project'
import { PairedBars } from '../components/charts'
import { useInView, useReducedMotion } from '../lib/hooks'

function DemoVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (inView && !reduced) v.play().catch(() => {})
    else v.pause()
  }, [inView, reduced])
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/60">
      <div className="bg-ink-900">
        <WindowBar title="live_demo.py cs1 improved_v4n2_seed0" />
      </div>
      <video
        ref={ref}
        src="./images/rl-pid/demo.mp4"
        poster="./images/rl-pid/demo-poster.webp"
        width={800}
        height={600}
        muted
        loop
        playsInline
        controls={reduced}
        preload="none"
        aria-label="The trained agent tracks a setpoint step from 0 to 1 and back to 0.5. The panels show the output, the control input, and the gains the agent picks."
        className="block h-auto w-full"
      />
    </div>
  )
}

function Box({ title, sub, accent = false }: { title: string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border px-3 py-2 text-center ${accent ? 'border-rose-300/40 bg-rose-400/10' : 'border-white/10 bg-white/[0.03]'}`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-[11px] text-fg-3">{sub}</div>
    </div>
  )
}

function ControlLoop() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-ink-900/70 p-4" role="img" aria-label="Control loop: every 0.2 seconds the PPO agent, seeing the setpoint and the last two outputs, picks Kp, tau i and tau d for the PID, which drives the unstable process G of s equals 1 over s minus 1. The output is fed back.">
      <div className="mx-auto flex max-w-xs flex-col items-center md:max-w-none">
        <div className="flex items-center gap-2 rounded-xl border border-pink-300/40 bg-gradient-to-r from-rose-500/20 to-pink-500/20 px-4 py-2">
          <Brain className="size-4 text-pink-200" />
          <span className="text-sm font-semibold">PPO agent</span>
          <span className="text-[11px] text-fg-3">3 → 64 → 64 → 3, tanh</span>
        </div>
        <div className="flex flex-col items-center text-[11px] text-pink-200">
          <span className="connector" style={{ ['--accent' as string]: '#fb7185', ['--accent-2' as string]: '#f472b6', height: 22 }} />
          new Kp · τi · τd every 0.2 s
        </div>
        <div className="mt-2 grid w-full grid-cols-1 items-center gap-2 md:grid-cols-[1fr_auto_1fr_auto_1.2fr]">
          <Box title="Setpoint r" sub="error e = r − y" />
          <ArrowRight className="mx-auto size-4 rotate-90 text-fg-3 md:rotate-0" />
          <Box title="PID" sub="anti-windup, D on y" accent />
          <ArrowRight className="mx-auto size-4 rotate-90 text-fg-3 md:rotate-0" />
          <Box title="G(s) = 1/(s − 1)" sub="open-loop unstable" />
        </div>
        <div className="mt-3 flex w-full items-center gap-2 text-[11px] text-fg-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          the agent sees r, y now and y one sample ago
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </div>
      </div>
    </div>
  )
}

type Version = { name: string; change: string; result: string; kind?: 'crash' | 'final' | 'cs2' }
const versions: Version[] = [
  { name: 'paper', change: 'The authors’ reward', result: '55.4 % / 2.23 s / 0.143 / 0.291: behaves like the authors’ agent' },
  { name: 'improved', change: 'Error penalty 10e², cap 5000', result: 'Seeds 0 and 1 good. Seed 2 learned to crash on purpose.', kind: 'crash' },
  { name: 'improved_v2', change: 'Crashing costs −5000 for every step left', result: 'No seed collapsed. 13.7 % overshoot, but slow: 3.43 s' },
  { name: 'improved_v3', change: 'Setpoint weight b as a 4th slider', result: 'Seeds inconsistent: 13.5 % / 3.80 s' },
  { name: 'improved_v4', change: 'v2 + overshoot penalty 100·ov²', result: '1 seed: 16.0 % / 3.70 s' },
  { name: 'improved_v4n', change: 'τi limited to 0.05–1.0, τd to 0–0.2', result: 'Beats the authors on 2 of 4 metrics' },
  { name: 'improved_v4n2', change: 'τi limited to 0.05–0.5', result: '32.0 % / 1.37 s / 0.127 / 0.256: beats the authors on all four', kind: 'final' },
  { name: 'improved_v5', change: 'Gain ranges chosen per case study', result: 'The only version that controls case study 2', kind: 'cs2' },
]

function VersionCard({ v, i }: { v: Version; i: number }) {
  const ring =
    v.kind === 'final'
      ? 'border-amber-300/50 bg-amber-300/[0.06]'
      : v.kind === 'crash'
        ? 'border-rose-300/40 bg-rose-400/[0.05]'
        : v.kind === 'cs2'
          ? 'border-sky-300/40 bg-sky-400/[0.05]'
          : 'border-white/[0.07] bg-white/[0.02]'
  return (
    <div className={`relative h-full rounded-2xl border p-4 ${ring}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-fg-3">{i + 1} of 8</span>
        {v.kind === 'final' && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-200">
            <Flag className="size-3" /> final for CS1
          </span>
        )}
        {v.kind === 'crash' && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-200">
            <Skull className="size-3" /> loophole
          </span>
        )}
        {v.kind === 'cs2' && <span className="text-[10px] font-semibold text-sky-200">case study 2</span>}
      </div>
      <div className="mt-1.5 font-mono text-sm font-semibold break-all text-white">{v.name}</div>
      <div className="mt-1 text-xs text-fg-2">{v.change}</div>
      <div className="mt-2 text-xs leading-relaxed text-fg-3">{v.result}</div>
    </div>
  )
}

export function RlPid() {
  return (
    <article id="rl-pid" className="relative" style={{ ['--accent' as string]: '#fb7185', ['--accent-2' as string]: '#f472b6' }}>
      <ProjectHeader
        index="03.4"
        tags={[
          'Reinforcement learning + control',
          'Python → C on an STM32F407',
          <>
            <Users className="size-3" /> Final-year project · Team Viper
          </>,
        ]}
        name="RL_PID"
        tagline={
          <>
            A PPO agent that retunes a PID controller every 0.2 s, and{' '}
            <span className="text-accent font-semibold">beats the published agent it set out to reproduce.</span>
          </>
        }
        links={[
          { href: 'https://github.com/RishitheB0T/RL_PID', label: 'Source code', primary: true },
          { href: 'https://github.com/RishitheB0T/RL_PID/blob/main/REPORT.md', label: 'Full results report' },
          { href: 'https://github.com/RishitheB0T/RL_PID/blob/main/stm32/README.md', label: 'STM32 port' },
        ]}
        stats={[
          { value: 4, suffix: '/4', label: 'metrics beat the paper', note: 'on every training seed' },
          { value: 32, decimals: 1, suffix: '%', label: 'overshoot', note: 'published agent: 57.8%' },
          { value: 1.37, decimals: 2, suffix: ' s', label: 'settling time', note: 'published agent: 1.70 s' },
          { value: 8, label: 'reward versions', note: 'each with its reason' },
          { value: 43, suffix: ' KB', label: 'STM32 firmware', note: 'builds with no warnings' },
          { value: 11, label: 'automated checks', note: 'including C = Python' },
        ]}
      >
        <p>
          The process G(s) = 1/(s − 1) is open-loop unstable: left alone, its output runs away. The project reproduces the m-PPO
          RL-PID of Shuprajhaa, Sujit and Srinivasan (Applied Soft Computing, 2022), then improves on it through eight reward
          versions, each one written down with what changed, why, and what it did.
        </p>
      </ProjectHeader>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <DemoVideo />
          <p className="mt-3 text-sm text-fg-2">
            The trained agent live: it follows setpoint steps, and the bottom panel shows the gains it picks as it goes.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="glass h-full rounded-3xl p-5 md:p-6">
            <h5 className="font-display text-lg font-semibold">How it works</h5>
            <div className="mt-4">
              <ControlLoop />
            </div>
            <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-fg-2">
              {[
                'The PID itself is classic: anti-windup on the integral, derivative on the measurement, output limited to ±100.',
                'The agent only chooses the gains. It was trained with PPO (Stable-Baselines3) for 500,000 steps on random setpoints.',
                'The reward punishes tracking error, extra-punishes overshoot, and makes running away the worst possible outcome.',
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-rose-300" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="mt-24">
        <SubHeading
          kicker="Results"
          title="Better than the published agent on all four metrics"
          sub="Step test from 0 to 1, averaged over 3 training seeds. The seeds sit close together: overshoot 31.5–32.5 %, settling 1.30–1.40 s."
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="glass h-full rounded-3xl p-5 md:p-7">
              <PairedBars
                title="Case study 1: G(s) = 1/(s − 1)"
                note="Lower is better on every metric."
                labels={['Authors’ agent', 'improved_v4n2 (mine)']}
                metrics={[
                  { name: 'Overshoot', unit: ' %', a: 57.8, b: 32.0, digits: 1 },
                  { name: 'Settling (2 %)', unit: ' s', a: 1.7, b: 1.37, digits: 2 },
                  { name: 'ISE', unit: '', a: 0.142, b: 0.127, digits: 3 },
                  { name: 'IAE', unit: '', a: 0.266, b: 0.256, digits: 3 },
                ]}
                tableLabel="case study 1"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="glass h-full rounded-3xl p-5 md:p-7">
              <PairedBars
                title="Case study 2: the same process with a 0.4 s dead time"
                note="Every version tuned on case study 1 fails here. improved_v5 is the only one that controls it."
                labels={['Best fixed PID (grid search)', 'improved_v5 (mine)']}
                metrics={[
                  { name: 'Overshoot', unit: ' %', a: 142.4, b: 103.4, digits: 1 },
                  { name: 'Settling (2 %)', unit: ' s', a: 9.2, b: 7.37, digits: 2 },
                  { name: 'ISE', unit: '', a: 1.98, b: 1.795, digits: 3 },
                  { name: 'IAE', unit: '', a: 2.587, b: 2.763, digits: 3 },
                ]}
                tableLabel="case study 2"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-24">
        <SubHeading
          kicker="Eight reward versions"
          title="How the agent got there"
          sub="Each version changed one thing for a written reason. Results are overshoot / settling / ISE / IAE, averaged over 3 seeds unless noted."
        />
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {versions.map((v, i) => (
            <Reveal as="li" key={v.name} delay={(i % 4) * 60}>
              <VersionCard v={v} i={i} />
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-5">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 text-sm leading-relaxed text-fg-2">
            <b className="text-white">What made the difference:</b> closing the crash loophole, penalising overshoot, and most of all
            limiting the integral time τi to 0.05–0.5 s. Earlier agents pushed τi to the top of its range, and a fixed-gain check
            showed that with τi = 1.0 the response never settles within 1.70 s, while τi = 0.5 does.
          </div>
        </Reveal>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-3xl p-6">
            <h5 className="font-display text-lg font-semibold">Robust without retraining</h5>
            <p className="mt-1 text-sm text-fg-3">Sensor noise, extra dead time and ±20 % model mismatch, with no re-training or re-tuning.</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-fg-2">
              <li className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                <span>Case study 1: improved_v4n2 keeps its fast settling under ±20 % model mismatch.</span>
              </li>
              <li className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                <span>
                  Case study 2: the fixed PID breaks down at gain K = 1.2 (overshoot 2,132 %, ISE 836.6) and at 0.5 s dead time (ISE
                  10.2). improved_v5 stays bounded in both (ISE 2.47 and 3.84).
                </span>
              </li>
              <li className="flex gap-2.5">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
                <span>
                  Honest limit: a fixed 2-DOF PID tuned on this test still has lower overshoot and ISE than improved_v5 in every
                  scenario, and the report says so.
                </span>
              </li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="glass h-full rounded-3xl p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-rose-400/25 to-pink-500/20 text-rose-200 ring-1 ring-rose-300/20">
                <Cpu className="size-4.5" />
              </span>
              <h5 className="font-display text-lg font-semibold">From Python to C on an STM32F407</h5>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">
              The network, the gain mapping, the PID and a simulated process all run on the microcontroller in single-precision C. A
              real process can be connected through the DAC (PA4) and ADC (PA1).
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ['Same results', 'C (float) and Python (double) give identical step-test metrics'],
                ['7.6 × 10⁻⁸', 'largest output difference, case study 1'],
                ['42,696 B', 'code, plus 468 B of data and 3,664 B of RAM'],
                ['0 warnings', 'arm-none-eabi-gcc 13.3 with STM32CubeF4'],
              ].map(([v, d]) => (
                <div key={v} className="rounded-2xl bg-white/[0.03] p-4">
                  <div className="text-lg font-semibold text-white">{v}</div>
                  <div className="mt-1 text-[11px] leading-relaxed text-fg-3">{d}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-fg-3">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-300" />
              Not yet run on a board: none was connected when the firmware was built, so on-chip timing is still to be measured.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-10">
        <TechRow
          items={[
            { name: 'Python', icon: 'python' },
            { name: 'PyTorch' },
            { name: 'Stable-Baselines3 (PPO)' },
            { name: 'Gymnasium' },
            { name: 'NumPy', icon: 'numpy' },
            { name: 'Matplotlib' },
            { name: 'C', icon: 'c' },
            { name: 'STM32F407 · STM32CubeF4' },
            { name: 'unittest' },
          ]}
        />
      </Reveal>
    </article>
  )
}
