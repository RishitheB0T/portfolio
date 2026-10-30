import { useState } from 'react'
import { CheckCircle2, Layers, Lock, Microscope, Radio, ShieldCheck, Timer, Workflow, Zap } from 'lucide-react'
import { Reveal, Spotlight } from '../components/ui'
import { ProjectHeader, SubHeading, TechRow } from '../components/project'
import { PriorityTrace } from '../components/charts'
import { TypedTerminal, type TermLine } from '../components/TypedTerminal'

const sessions: { cmd: string; about: string; out: TermLine[] }[] = [
  {
    cmd: 'crash kernel',
    about: 'An unprivileged task touches kernel memory. The MPU stops it, the kernel kills only that task, and the shell lives on.',
    out: [
      { kind: 'cmd', text: 'crash kernel' },
      { kind: 'out', text: "[kernel] task 'crash' (id 3) killed: MPU: data access violation, pc=0x08003668 addr=0x20001540 cfsr=0x00000082", tone: 'err' },
      { kind: 'out', text: 'shell: still alive. crash task exit code -104, cfsr=0x00000082', tone: 'ok' },
    ],
  },
  {
    cmd: 'pi',
    about: 'The same priority-inversion scenario twice: without and with priority inheritance on the mutex.',
    out: [
      { kind: 'cmd', text: 'pi' },
      { kind: 'out', text: 'priority inheritance OFF: high-prio task waited 65719 us, low task ran at prio up to 3  (critical section 20 ms, mid task 50 ms)', tone: 'warn' },
      { kind: 'out', text: 'priority inheritance ON : high-prio task waited 15183 us, low task ran at prio up to 6  (critical section 20 ms, mid task 50 ms)', tone: 'ok' },
    ],
  },
  {
    cmd: 'ps',
    about: 'Per-task state, priority, stack high-water marks, CPU share and context-switch counts, straight from the scheduler.',
    out: [
      { kind: 'cmd', text: 'ps' },
      { kind: 'out', text: ' ID NAME         STATE    PRIO   STACK used/size   CPU%  SWITCHES  EXIT', tone: 'dim' },
      { kind: 'out', text: '  0 idle         ready        0       80/512     95.9        12  -' },
      { kind: 'out', text: '  1 init         RUN         10     1328/4096     0.0        12  -', tone: 'accent' },
      { kind: 'out', text: '  2 heartbeat    blocked      2       96/512      0.0         8  -' },
      { kind: 'out', text: '  3 crash        dead         9      248/1024     0.0         1  -104 (fault)', tone: 'err' },
      { kind: 'out', text: '  4 pi-low       dead         3      160/1024     0.5         5  0' },
    ],
  },
  {
    cmd: 'nn 1',
    about: 'The int8 CNN classifies a handwritten digit on the microcontroller, bit-exact with the Python reference.',
    out: [
      { kind: 'cmd', text: 'nn 1' },
      { kind: 'out', text: '  |    ==++##++    |' },
      { kind: 'out', text: '  |  **++----@@..  |' },
      { kind: 'out', text: '  |  ..    --##    |' },
      { kind: 'out', text: '  |        ++**    |   predicted 3 (label 3)', tone: 'ok' },
      { kind: 'out', text: '  |        ..@@    |   280 us at 168 MHz (QEMU virtual time)' },
      { kind: 'out', text: '  |          ==**  |' },
      { kind: 'out', text: '  |    ::  ..**++  |' },
      { kind: 'out', text: '  |    **@@##**::  |' },
    ],
  },
]

function ShellReplay() {
  const [i, setI] = useState(0)
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2" role="tablist" aria-label="Shell commands">
        {sessions.map((s, n) => (
          <button
            key={s.cmd}
            role="tab"
            aria-selected={i === n}
            onClick={() => setI(n)}
            className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition ${
              i === n ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 font-semibold text-ink-950' : 'border border-white/10 text-fg-2 hover:text-white'
            }`}
          >
            kestrel&gt; {s.cmd}
          </button>
        ))}
      </div>
      <TypedTerminal key={i} lines={sessions[i].out} title="kestrel-rtos · UART @ 115200 · QEMU" prompt="kestrel>" minHeight={250} />
      <p className="mt-3 text-sm text-fg-2">{sessions[i].about}</p>
    </div>
  )
}

const highlights = [
  { icon: <Timer />, title: 'Scheduler', body: 'Fixed-priority preemptive, 32 levels, O(1) pick via a ready bitmap and CLZ, round-robin slices, tick-based sleep and timeouts.' },
  { icon: <Workflow />, title: 'Context switch', body: 'PendSV in assembly. Saves r4–r11 always, s16–s31 only if the task used the FPU, working with the CPU’s lazy FP stacking.' },
  { icon: <ShieldCheck />, title: 'Isolation', body: 'Tasks run unprivileged; kernel RAM, other stacks and peripherals are MPU-protected. 7 kinds of illegal access are caught.' },
  { icon: <Radio />, title: 'System calls', body: 'svc trap, table dispatch, every user pointer validated, capability-style MMIO grants that can be delegated but never widened.' },
  { icon: <Lock />, title: 'Synchronization', body: 'Semaphores, zero-copy queues, mutexes with transitive priority inheritance, deadlock detection and robust owner-died recovery.' },
  { icon: <Microscope />, title: 'Observability', body: 'Interrupt-driven UART, cycle-accurate timestamps, per-task CPU accounting, stack high-water marks, an event tracer → Perfetto.' },
  { icon: <Layers />, title: 'NN runtime', body: 'Per-channel int8 quantization, zero-point folding, fixed-point requantization, fused conv+bias+ReLU, ahead-of-time C codegen.' },
  { icon: <Zap />, title: 'NN kernels', body: 'Naive → SMLAD/SXTB16 SIMD → SIMD + 2×2 register tiling: 4.1× fewer instructions, all bit-exact against Python.' },
  { icon: <CheckCircle2 />, title: 'Testing', body: '24 on-target tests in QEMU on every push, host tests under ASan/UBSan, and a property-tested memory planner.' },
]

export function Kestrel() {
  return (
    <article id="kestrel-rtos" className="relative" style={{ ['--accent' as string]: '#22d3ee', ['--accent-2' as string]: '#34d399' }}>
      <ProjectHeader
        index="03.3"
        tags={['Embedded systems', 'C + Thumb-2 assembly', 'No HAL · no CMSIS · no libc']}
        name="kestrel-rtos"
        tagline={
          <>
            A from-scratch RTOS and <span className="text-accent font-semibold">int8 neural-network runtime</span> for ARM Cortex-M4.
          </>
        }
        links={[
          { href: 'https://github.com/RishitheB0T/kestrel-rtos', label: 'Source code', primary: true },
          { href: 'https://github.com/RishitheB0T/kestrel-rtos/blob/main/docs/LEARNING_GUIDE.md', label: 'From-zero learning guide' },
          { href: 'https://github.com/RishitheB0T/kestrel-rtos/blob/main/docs/HARDWARE.md', label: 'Run it on an STM32F4' },
        ]}
        stats={[
          { value: 4.11, decimals: 2, suffix: '×', label: 'fewer instructions', note: 'SIMD + register tiling' },
          { value: 98.33, decimals: 2, suffix: '%', label: 'int8 CNN accuracy', note: '100% agreement with float' },
          { value: 15, suffix: ' ms', label: 'high-priority wait', note: 'down from 65 ms' },
          { value: 24, label: 'on-target tests', note: 'QEMU in CI' },
          { value: 6.6, decimals: 1, suffix: ' KB', label: 'model weights', note: 'float32 would be 24.4 KB' },
          { value: 684, label: 'instructions', note: 'semaphore round trip' },
        ]}
      >
        <p>
          A small operating system for STM32F4 microcontrollers. It runs untrusted application tasks unprivileged and isolated by
          the MPU, survives their crashes, and runs an int8 CNN produced by its own model compiler (train → quantize → plan memory
          → generate C) on hand-optimized DSP-SIMD kernels. It’s a scaled-down version of what an OS and an inference stack do on a
          GPU-class SoC.
        </p>
      </ProjectHeader>

      <div className="grid grid-cols-1 gap-6">
        <Reveal>
          <ShellReplay />
        </Reveal>
        <Reveal delay={100}>
          <div className="glass h-full rounded-3xl p-5 md:p-6">
            <h5 className="font-display text-lg font-semibold">Priority inversion, recorded by the kernel’s own tracer</h5>
            <p className="mt-1 mb-6 text-sm text-fg-2">
              A low task holds a mutex the high task needs; a medium task gets in the way. Hover a bar to see what happens.
            </p>
            <PriorityTrace />
          </div>
        </Reveal>
      </div>

      <div className="mt-24">
        <SubHeading kicker="Inside the kernel" title="Scheduling, isolation and recovery" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={(i % 3) * 70}>
              <Spotlight className="h-full p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/25 to-emerald-400/20 text-cyan-200 ring-1 ring-cyan-300/20 [&>svg]:size-4.5">{h.icon}</span>
                  <h5 className="font-display font-semibold">{h.title}</h5>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-fg-2">{h.body}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="mt-10">
        <TechRow
          items={[
            { name: 'C (freestanding)', icon: 'c' },
            { name: 'Thumb-2 assembly' },
            { name: 'ARM Cortex-M4F' },
            { name: 'STM32F4' },
            { name: 'QEMU' },
            { name: 'Python + NumPy', icon: 'numpy' },
            { name: 'Perfetto traces' },
            { name: 'GitHub Actions', icon: 'githubactions' },
            { name: 'Make' },
          ]}
        />
      </Reveal>
    </article>
  )
}
