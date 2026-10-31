import { useState, type ReactNode } from 'react'
import { AlertTriangle, BookOpen, Brain, CheckCircle2, Dumbbell, FileQuestion, Puzzle, Store, Type, Zap } from 'lucide-react'
import { Reveal, Spotlight } from '../components/ui'
import { ProjectHeader, SubHeading, TechRow } from '../components/project'
import { HBarChart, LevelDots } from '../components/charts'
import { TypedTerminal, type TermLine } from '../components/TypedTerminal'

// Worked answers exactly as the model writes them (from the project's README).
const samples: { kind: string; q: string; a: string }[] = [
  { kind: 'add', q: '347+586', a: '347+586:7+6+0=13|4+8+1=13|3+5+1=9|=933;<answer>933</answer>' },
  { kind: 'sub', q: '905-387', a: '905-387:5-7-0=8b1|0-8-1=1b1|9-3-1=5b0|=518;<answer>518</answer>' },
  { kind: 'mul', q: '347*6', a: '347*6:7*6+0=42|4*6+4=28|3*6+2=20|=2082;<answer>2082</answer>' },
  { kind: 'expr', q: '52+34-17', a: '52+34:2+4+0=6|5+3+0=8|=86;86-17:6-7-0=9b1|8-1-1=6b0|=69;<answer>69</answer>' },
  { kind: 'div', q: '947/4', a: '947/4:9/4=2r1|14/4=3r2|27/4=6r3|=236r3;<answer>236r3</answer>' },
]

function ModelReplay() {
  const [i, setI] = useState(0)
  const s = samples[i]
  const lines: TermLine[] = [
    { kind: 'cmd', text: `Q:${s.q}` },
    { kind: 'out', text: `A:${s.a}`, tone: 'ok' },
  ]
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2" role="tablist" aria-label="Problem kinds">
        {samples.map((x, n) => (
          <button
            key={x.kind}
            role="tab"
            aria-selected={i === n}
            onClick={() => setI(n)}
            className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition ${
              i === n ? 'bg-gradient-to-r from-lime-300 to-yellow-300 font-semibold text-ink-950' : 'border border-white/10 text-fg-2 hover:text-white'
            }`}
          >
            {x.kind} · {x.q}
          </button>
        ))}
      </div>
      <TypedTerminal key={i} lines={lines} title="tinyreasoner · greedy decoding" prompt="»" minHeight={96} />
      <p className="mt-3 text-sm text-fg-2">
        It works right to left like school maths, one column per step (<span className="font-mono">b1</span> = borrow 1,{' '}
        <span className="font-mono">r3</span> = remainder 3), and ends with the answer in tags so code can grade it.
        {s.kind === 'div' && ' Long division was never in the main training data: it is the new skill taught with LoRA.'}
      </p>
    </div>
  )
}

const pipeline: { icon: ReactNode; hook: string; what: string }[] = [
  { icon: <FileQuestion />, hook: 'Questions', what: 'code writes problems, so every answer is known' },
  { icon: <Type />, hook: 'Words', what: 'BPE tokenizer, one token per digit' },
  { icon: <Brain />, hook: 'Brain', what: 'Llama-style transformer, 4.3M parameters' },
  { icon: <BookOpen />, hook: 'School', what: 'SFT: copy worked solutions' },
  { icon: <Dumbbell />, hook: 'Practice', what: 'GRPO: 8 tries, learn from right / wrong' },
  { icon: <Puzzle />, hook: 'New skill', what: 'LoRA: long division, 5 % of the weights' },
  { icon: <Zap />, hook: 'Speed', what: 'KV cache, int8, speculative decoding' },
  { icon: <Store />, hook: 'Shop', what: 'FastAPI with streamed tokens' },
]

function Pipeline() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute top-[38px] right-[6%] left-[6%] hidden h-0.5 overflow-hidden rounded bg-white/10 lg:block">
        <div className="h-full w-1/4 bg-gradient-to-r from-transparent via-lime-300 to-transparent" style={{ animation: 'beam 3s linear infinite' }} />
      </div>
      <ol className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
        {pipeline.map((p, i) => (
          <Reveal as="li" key={p.hook} delay={i * 60}>
            <div className="glass h-full rounded-2xl p-3.5 text-center">
              <div className="relative mx-auto grid size-12 place-items-center rounded-2xl bg-ink-850 text-lime-200 ring-1 ring-lime-300/30 [&>svg]:size-5">
                {p.icon}
                <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-gradient-to-br from-lime-300 to-yellow-300 font-mono text-[10px] font-bold text-ink-950">
                  {i + 1}
                </span>
              </div>
              <div className="mt-3 text-sm font-semibold">{p.hook}</div>
              <div className="mt-1 text-[11px] leading-snug text-fg-3">{p.what}</div>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

const findings = [
  { title: 'RL works from a single bit of feedback', body: 'GRPO never saw a worked solution for its practice problems, only right or wrong, yet it took level 5 from 52 % to 96 %, and improved levels it never practised.' },
  { title: 'With perfect demonstrations, SFT is more efficient', body: 'SFT learns from every token of a correct solution; RL gets about one bit per attempt. RL earns its keep when answers can be checked but not written.' },
  { title: 'RL amplifies; it doesn’t create', body: 'On level 5 the RL model’s first try (97 %) beat the starting model’s best of 8 (67 %). On level 6, where no try ever succeeded, RL changed nothing.' },
  { title: 'Length generalization is hard', body: 'Trained on numbers up to 6 digits, the model can’t even copy a 7-digit number: 8444574-1207911 became 84449-120791.' },
]

const spec = [
  ['Layers', '6'],
  ['Width', '256'],
  ['Attention', 'GQA · 8 query, 2 key/value heads'],
  ['Positions', 'RoPE'],
  ['MLP', 'SwiGLU, 256 → 704 → 256'],
  ['Norm', 'RMSNorm'],
  ['Context', '256 tokens'],
  ['Vocabulary', '265 tokens'],
  ['Parameters', '4,298,240'],
]

export function TinyReasoner() {
  return (
    <article id="tiny-reasoner" className="relative" style={{ ['--accent' as string]: '#a3e635', ['--accent-2' as string]: '#fde047' }}>
      <ProjectHeader
        index="03.5"
        tags={['Machine learning from scratch', 'PyTorch · no pretrained weights', 'Trained on a 4-core CPU']}
        name="tiny-reasoner"
        tagline={
          <>
            A small language model built completely from scratch, taught to solve maths step by step, then{' '}
            <span className="text-accent font-semibold">made better with reinforcement learning (GRPO).</span>
          </>
        }
        links={[
          { href: 'https://github.com/RishitheB0T/tiny-reasoner', label: 'Source code', primary: true },
          { href: 'https://github.com/RishitheB0T/tiny-reasoner#-results', label: 'All results' },
          { href: 'https://github.com/RishitheB0T/tiny-reasoner#-the-build-step-by-step', label: 'The build, step by step' },
        ]}
        stats={[
          { value: 4.3, decimals: 1, suffix: 'M', label: 'parameters', note: 'trained from random weights' },
          { value: 96, suffix: '%', label: 'level 5 after GRPO', note: 'from 52%, in 33 min' },
          { value: 99.7, decimals: 1, suffix: '%', label: 'new skill with LoRA', note: 'training 5% of the weights' },
          { value: 16.3, decimals: 1, suffix: '×', label: 'faster with a KV cache', note: 'at batch 32' },
          { value: 3.7, decimals: 1, suffix: '×', label: 'smaller in int8', note: 'same accuracy' },
          { value: 41, label: 'tests', note: 'properties, in seconds' },
        ]}
      >
        <p>
          Every part is hand-written in PyTorch: the tokenizer, a Llama-style transformer, supervised fine-tuning, GRPO (the
          reinforcement-learning method behind DeepSeek-R1), LoRA, int8 quantization, speculative decoding, and a streaming API. No
          pretrained weights, no downloaded dataset, no GPU.
        </p>
      </ProjectHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr]">
        <Reveal>
          <ModelReplay />
        </Reveal>
        <Reveal delay={100}>
          <div className="glass h-full rounded-3xl p-5 md:p-6">
            <h5 className="font-display text-lg font-semibold">The idea in 30 seconds</h5>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-fg-2">
              {[
                ['Write practice questions with code.', 'Because code wrote them, the right answer is always known.'],
                ['School (SFT).', 'The model copies thousands of worked solutions and learns to show its working.'],
                ['Practice (GRPO).', 'It answers each question 8 times; code checks which are right, and it is nudged towards answers that beat their group’s average.'],
                ['Extras.', 'A new skill cheaply (LoRA), smaller and faster (int8, KV cache, speculative decoding), served as a streaming web app.'],
              ].map(([t, b], n) => (
                <li key={t} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-lime-300/15 font-mono text-[11px] font-semibold text-lime-200">{n + 1}</span>
                  <span>
                    <b className="text-white">{t}</b> {b}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>

      <div className="mt-24">
        <SubHeading kicker="The pipeline" title="Questions → Words → Brain → School → Practice → New skill → Speed → Shop" sub="The project’s own memory hook: data → tokenizer → model → SFT → GRPO → LoRA → speed-ups → API." />
        <Pipeline />
      </div>

      <div className="mt-24">
        <SubHeading
          kicker="Results"
          title="Reinforcement learning vs. more school"
          sub="All three models start from the same half-trained model. 300 held-out problems per level, greedy decoding."
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <div className="glass h-full rounded-3xl p-5 md:p-7">
              <LevelDots
                title="Test accuracy per difficulty level"
                note="Level 5 is only 3 % of the training data; level 6 is never trained on."
                series={['Start: SFT, 1,500 steps', '+ 300 GRPO steps (33 min)', '+ 1,500 more SFT steps (28 min)']}
                rows={[
                  { label: 'Level 1', values: [98.3, 100, 100] },
                  { label: 'Level 2', values: [98.3, 99.7, 100] },
                  { label: 'Level 3', values: [96.7, 99.0, 99.3] },
                  { label: 'Level 4', values: [94.0, 98.0, 98.7] },
                  { label: 'Level 5', note: '3 % of training data', values: [52.0, 96.0, 98.3] },
                  { label: 'Level 6', note: 'never trained on', values: [0, 0, 0] },
                ]}
                tableLabel="the accuracy results"
              />
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {findings.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <Spotlight className="h-full p-4">
                  <h5 className="text-sm font-semibold text-white">{f.title}</h5>
                  <p className="mt-1 text-xs leading-relaxed text-fg-2">{f.body}</p>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-24">
        <SubHeading kicker="Speed and size" title="Making a model fast is its own engineering" sub="All timings on one 4-core CPU." />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="glass h-full rounded-3xl p-5 md:p-7">
              <HBarChart
                title="KV cache: tokens per second"
                note="More is better. Speed-up over no cache at the same batch size on the right."
                rows={[
                  { name: 'Batch 1, no cache', value: 125.8, valueText: '125.8', tag: '1.00×', tip: 'every new token re-reads the whole sequence', cells: ['125.8', '1.00×'] },
                  { name: 'Batch 1, KV cache', value: 378.5, valueText: '378.5', tag: '3.01×', tip: '3.01× faster than no cache', cells: ['378.5', '3.01×'] },
                  { name: 'Batch 32, no cache', value: 263.0, valueText: '263.0', tag: '1.00×', tip: 'the waste grows with the batch', cells: ['263.0', '1.00×'] },
                  { name: 'Batch 32, KV cache', value: 4278.6, valueText: '4,278.6', tag: '16.27×', tip: '16.27× faster than no cache', cells: ['4,278.6', '16.27×'] },
                ]}
                max={5000}
                ticks={[0, 1000, 2000, 3000, 4000]}
                tickLabel={(t) => (t === 0 ? '0' : `${t / 1000}K`)}
                unit="tokens/s"
                tagWidth="4rem"
                tableLabel="the KV-cache runs"
                tableHead={['Run', 'Tokens/s', 'Speed-up']}
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="glass h-full rounded-3xl p-5 md:p-7">
              <HBarChart
                title="Speculative decoding: time for 60 prompts"
                note="Less is better. A 0.4M-parameter draft model guesses k tokens; output is identical to greedy on 60 / 60 prompts."
                rows={[
                  { name: 'Plain greedy', value: 11.33, valueText: '11.33 s', tag: '1.00×', tip: '1 token per big-model call', cells: ['11.33 s', '1.00', '1.00×'] },
                  { name: 'k = 2', value: 8.16, valueText: '8.16 s', tag: '1.39×', tip: '98.2 % of guesses accepted · 2.93 tokens per call', cells: ['8.16 s', '2.93', '1.39×'] },
                  { name: 'k = 4', value: 7.24, valueText: '7.24 s', tag: '1.54×', tip: '96.8 % of guesses accepted · 4.75 tokens per call', cells: ['7.24 s', '4.75', '1.54×'] },
                  { name: 'k = 6', value: 6.56, valueText: '6.56 s', tag: '1.87×', tip: '94.1 % of guesses accepted · 6.43 tokens per call', cells: ['6.56 s', '6.43', '1.87×'] },
                ]}
                max={14}
                ticks={[0, 4, 8, 12]}
                tickLabel={(t) => `${t} s`}
                unit=""
                tagWidth="4rem"
                tableLabel="the speculative-decoding runs"
                tableHead={['Setting', 'Time', 'Tokens per big-model call', 'Speed-up']}
              />
              <p className="mt-4 text-xs leading-relaxed text-fg-3">
                int8 weights are 3.7× smaller (4.6 MB vs 17.2 MB) with the same 99.8 % accuracy, but not faster here: a 4M-parameter
                model already fits in the CPU cache.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Reveal>
          <div className="glass h-full rounded-3xl p-6">
            <h5 className="font-display text-lg font-semibold">The model</h5>
            <dl className="mt-4 divide-y divide-white/[0.06] text-sm">
              {spec.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1.5">
                  <dt className="text-fg-3">{k}</dt>
                  <dd className="text-right font-mono text-[12.5px] text-fg">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-fg-3">
              The tokenizer is BPE written from scratch, with every digit its own token, so 347 is always 3, 4, 7.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="glass h-full rounded-3xl p-6">
            <h5 className="font-display text-lg font-semibold">LoRA and the forgetting trap</h5>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">
              Taught long division alone, both LoRA and full fine-tuning <b className="text-white">forgot the old skills completely</b>,
              and started writing division steps inside subtraction:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-[#0a0913] p-3 font-mono text-[11px] text-rose-200">326-247 → …=383;&lt;answer&gt;38r3&lt;/answer&gt;</pre>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">
              Mixing in 20 % old problems (replay) fixed it: new skill 99.7 %, old skills 99.2 %, with an adapter 19× smaller than the
              full model. Re-testing every level still found a hidden loss on level 5 (98.3 → 85.3 %), and the README says so.
            </p>
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div className="glass h-full rounded-3xl p-6">
            <h5 className="font-display text-lg font-semibold">Engineered like a service</h5>
            <ul className="mt-4 space-y-2 text-sm text-fg-2">
              {[
                'FastAPI app that streams tokens as Server-Sent Events, with a demo page',
                'Docker image and GitHub Actions CI',
                '41 tests that check properties on tiny random models, in seconds',
                'KV cache output equals no-cache output; speculative equals greedy',
                'One GRPO update makes a rewarded answer more likely',
                'Metrics logged for every training run',
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-lime-300" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-5">
        <p className="flex items-start gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-4 text-xs leading-relaxed text-fg-2">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-300" />
          Honest limits, as the README states them: a 4.3M-parameter learning project that knows only this arithmetic format, timed on
          one CPU, with the RL vs SFT comparison run once each.
        </p>
      </Reveal>

      <Reveal className="mt-10">
        <TechRow
          items={[
            { name: 'Python', icon: 'python' },
            { name: 'PyTorch (from scratch)' },
            { name: 'GRPO · SFT · LoRA' },
            { name: 'FastAPI + SSE' },
            { name: 'Docker', icon: 'docker' },
            { name: 'GitHub Actions', icon: 'githubactions' },
          ]}
        />
      </Reveal>
    </article>
  )
}
