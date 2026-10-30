import { useState } from 'react'
import { Bug, CheckCircle2, Layers, Lock, Microscope, Radio, ShieldCheck, Timer, Workflow, Wrench, Zap } from 'lucide-react'
import { Reveal, Spotlight } from '../components/ui'
import { ProjectHeader, SubHeading, TechRow } from '../components/project'
import { InstructionBars, PriorityTrace } from '../components/charts'
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

const layers = [
  { name: 'Input', dims: '8×8', h: 100 },
  { name: 'conv3×3 + ReLU', dims: '16 ch', h: 88 },
  { name: 'maxpool', dims: '', h: 64 },
  { name: 'conv3×3 + ReLU', dims: '32 ch', h: 72 },
  { name: 'maxpool', dims: '', h: 50 },
  { name: 'fully connected', dims: '10', h: 40 },
]

function Compare({ label, a, b, aLabel, bLabel }: { label: string; a: number; b: number; aLabel: string; bLabel: string }) {
  return (
    <div>
      <div className="mb-2 text-xs text-fg-3">{label}</div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <div className="h-3 rounded-r-[4px] bg-bar" style={{ width: `${(a / b) * 70}%` }} />
          <span className="text-xs whitespace-nowrap text-fg">{aLabel}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 rounded-r-[4px] bg-white/20" style={{ width: '70%' }} />
          <span className="text-xs whitespace-nowrap text-fg-3">{bLabel}</span>
        </div>
      </div>
    </div>
  )
}

const memory = [
  { addr: '0x2000C000', name: 'URAM', size: '16 KB', what: 'app .data / .bss', mpu: 'Region 1: read-write for all tasks, never executable', cls: 'from-emerald-400/30 to-emerald-400/10 border-emerald-300/30', h: 'min-h-14' },
  { addr: '0x20004000', name: 'STACKS', size: '32 KB', what: 'task stacks', mpu: 'Region 2: only the running task’s own stack', cls: 'from-cyan-400/30 to-cyan-400/10 border-cyan-300/30', h: 'min-h-24' },
  { addr: '0x20000000', name: 'KRAM', size: '16 KB', what: 'kernel data + MSP', mpu: 'No region: privileged only. Stacks overflow into it and fault at once.', cls: 'from-rose-400/30 to-rose-400/10 border-rose-300/30', h: 'min-h-14' },
  { addr: '0x08000000', name: 'FLASH', size: '256 KB', what: 'code + const data', mpu: 'Region 0: read-only, executable (region 3: an optional per-task MMIO grant)', cls: 'from-violet-400/30 to-violet-400/10 border-violet-300/30', h: 'min-h-16' },
]

const bugs = [
  {
    title: 'Lazy FPU stacking vs. killing a task',
    symptom: 'Innocent tasks, including init, were killed with “MPU blocked lazy FPU state save”, and the system hung.',
    cause: 'The CPU reserves room for s0–s15 on a task’s stack but saves them later. After the kernel killed an FPU-using task, that deferred save fired at the dead task’s freed stack, which the MPU (correctly) blocked.',
    fix: 'One line: cancel the pending save (FPCCR.LSPACT = 0) when discarding a context. Removing it makes context_switch_integrity fail.',
  },
  {
    title: '-ffreestanding silently de-optimized the SIMD kernel',
    symptom: 'The “fast” kernel ran 2× more instructions than the naive one.',
    cause: '-ffreestanding implies -fno-builtin, so the memcpy used for unaligned 32-bit loads became a real byte-by-byte call in the innermost loop.',
    fix: '__builtin_memcpy compiles to one LDR. The disassembly then showed 10 register spills per iteration; interleaving im2col rows and reordering statements took it from 3.67× to 4.1×.',
  },
]

const tests = [
  'syscall_basics', 'preemption', 'round_robin', 'sleep_accuracy', 'semaphore_ping_pong', 'queue_fifo', 'queue_timeout', 'priority_inheritance',
  'pi_chain_transitive', 'deadlock_detection', 'robust_mutex', 'context_switch_integrity', 'mpu_kernel_memory', 'mpu_stack_overflow', 'mpu_null_pointer', 'mpu_peripheral_isolation',
  'ppb_privileged_only', 'div_by_zero_trap', 'mpu_other_task_stack', 'syscall_pointer_checks', 'stack_pool_reuse', 'cpu_accounting', 'trace_capture', 'nn_inference_bitexact',
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

      <div className="mt-24">
        <SubHeading
          kicker="Neural network on a microcontroller"
          title="Train in Python, run bit-exact in int8 C"
          sub="A small model compiler turns a trained network into C: per-channel int8 quantization, a static memory plan, and generated code that calls the SIMD kernels."
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="glass h-full rounded-3xl p-5 md:p-7">
              <InstructionBars />
              <p className="mt-5 rounded-2xl bg-white/[0.03] p-4 text-sm leading-relaxed text-fg-2">
                <b className="text-white">The lane trick.</b> SXTB16 unpacks bytes (0,2) and (1,3) of a weight word. Instead of
                reshuffling weights per channel, im2col stores inputs once per pixel in the order x0 x2 x1 x3, so the lanes line up for free.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="glass h-full rounded-3xl p-5 md:p-7">
              <div className="text-sm font-medium">The model: 8×8 handwritten digits</div>
              <div className="mt-1 text-xs text-fg-3">6,090 parameters · 84,224 multiply-accumulates per inference · 359 held-out test images</div>
              <div className="mt-5 flex items-end gap-1.5 overflow-x-auto pb-1 sm:gap-2" role="img" aria-label="Layers: input 8 by 8, conv 3 by 3 with 16 channels and ReLU, maxpool, conv 3 by 3 with 32 channels and ReLU, maxpool, fully connected to 10 outputs.">
                {layers.map((l) => (
                  <div key={l.name + l.h} className="flex min-w-[2.8rem] flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-lg border border-cyan-300/30 bg-gradient-to-b from-cyan-400/30 to-emerald-400/10"
                      style={{ height: `${l.h}px` }}
                    />
                    <div className="text-center text-[10.5px] leading-tight text-fg-2">
                      {l.name}
                      {l.dims && <div className="font-mono text-fg-3">{l.dims}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Compare label="Weights in flash" a={6.6} b={24.4} aLabel="6.6 KB int8" bLabel="24.4 KB float32" />
                <Compare label="Activation RAM" a={1344} b={3056} aLabel="1,344 B planned (−56%)" bLabel="3,056 B unplanned" />
              </div>
              <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ['Train', 'NumPy, float32'],
                  ['Quantize', 'per-channel int8'],
                  ['Plan memory', 'greedy, static'],
                  ['Generate C', 'ahead of time'],
                ].map(([t, s], i) => (
                  <li key={t} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <div className="font-mono text-[10px] text-cyan-300">step {i + 1}</div>
                    <div className="text-sm font-semibold">{t}</div>
                    <div className="text-[11px] text-fg-3">{s}</div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs leading-relaxed text-fg-3">
                Zero-point folding: Σ(x − zₓ)·w = Σx·w − zₓ·Σw, and zₓ·Σw is constant per channel, so it moves into the bias offline.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <SubHeading kicker="Memory map" title="64 KB of SRAM, carved up by the MPU" />
          <Reveal>
            <div className="glass rounded-3xl p-5" role="img" aria-label="Memory map from top: URAM 16 KB at 0x2000C000, task stacks 32 KB at 0x20004000, kernel RAM 16 KB at 0x20000000, and 256 KB of flash at 0x08000000, each with its MPU rule.">
              <div className="space-y-2">
                {memory.map((m) => (
                  <div key={m.name} className="grid grid-cols-[4.4rem_1fr] items-stretch gap-2 sm:grid-cols-[5.6rem_1fr] sm:gap-3">
                    <span className="self-end pb-1 text-right font-mono text-[9.5px] text-fg-3 sm:text-[10.5px]">{m.addr}</span>
                    <div className={`flex flex-col justify-center rounded-xl border bg-gradient-to-r px-4 py-2 ${m.cls} ${m.h}`}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                        <span className="font-mono text-sm font-semibold">{m.name}</span>
                        <span className="font-mono text-xs text-fg-2">
                          {m.size} · {m.what}
                        </span>
                      </div>
                      <div className="text-[11px] leading-snug text-fg-2">{m.mpu}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-fg-3">
                The linker script places every object file from kernel/ into KRAM by file name, so a kernel variable can never land in
                task-writable memory by accident.
              </p>
            </div>
          </Reveal>
        </div>
        <div>
          <SubHeading kicker="Debugging stories" title="Two bugs worth telling" />
          <div className="space-y-4">
            {bugs.map((b, i) => (
              <Reveal key={b.title} delay={i * 100}>
                <div className="glass rounded-3xl p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-lg bg-rose-400/15 text-rose-200">
                      <Bug className="size-4" />
                    </span>
                    <h5 className="font-mono text-sm font-semibold">{b.title}</h5>
                  </div>
                  <dl className="mt-3 space-y-2 text-sm leading-relaxed">
                    <div>
                      <dt className="inline font-semibold text-rose-200">Symptom. </dt>
                      <dd className="inline text-fg-2">{b.symptom}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-amber-200">Cause. </dt>
                      <dd className="inline text-fg-2">{b.cause}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-emerald-200">
                        <Wrench className="mr-1 inline size-3.5" />
                        Fix.{' '}
                      </dt>
                      <dd className="inline text-fg-2">{b.fix}</dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-24">
        <SubHeading kicker="make test" title="24 on-target tests, every push" sub="Booted in QEMU in instruction-counting mode so timings repeat. context_switch_integrity fills r4–r11 and s0–s31 with known values in three tasks that preempt each other, then checks every register." />
        <Reveal>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {tests.map((t, i) => (
              <li
                key={t}
                className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 font-mono text-[11.5px] text-fg-2"
                style={{ animation: `rise .4s ${i * 30}ms both` }}
              >
                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-300" />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
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
