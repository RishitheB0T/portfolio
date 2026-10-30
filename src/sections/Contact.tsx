import { ArrowUp, FileDown, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../components/brand'
import { links, profile } from '../data/profile'
import { LinkButton, Reveal } from '../components/ui'

export function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-4 pt-24 pb-10 sm:px-6 md:pt-32" style={{ ['--accent' as string]: '#a78bfa', ['--accent-2' as string]: '#d946ef' }}>
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900 px-6 py-16 text-center md:px-12 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(139,92,246,.35),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(40%_60%_at_85%_100%,rgba(34,211,238,.18),transparent_70%)]" />
          <div className="grid-bg absolute inset-0 opacity-60" />
          <div className="relative">
            <div className="font-mono text-xs tracking-[0.2em] text-fuchsia-300 uppercase">07 · Let’s talk</div>
            <h2 className="mx-auto mt-6 max-w-4xl text-4xl leading-[1.05] font-bold md:text-7xl">
              {profile.motto.map((m, i) => (
                <span key={m} className={`block ${i === 2 ? 'text-gradient' : ''}`}>
                  {m}
                </span>
              ))}
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-lg text-fg-2">
              Open to software engineering roles for placement season 2026–27: backend, full-stack, or anywhere the system has to be
              both fast and correct.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <LinkButton href={links.github} primary icon={<GithubIcon className="size-4" />}>
                github.com/{profile.handle}
              </LinkButton>
              {links.linkedin && (
                <LinkButton href={links.linkedin} icon={<LinkedinIcon className="size-4" />}>
                  LinkedIn
                </LinkButton>
              )}
              {links.email && (
                <LinkButton href={`mailto:${links.email}`} icon={<Mail className="size-4" />}>
                  {links.email}
                </LinkButton>
              )}
              {links.resume && (
                <LinkButton href={links.resume} icon={<FileDown className="size-4" />}>
                  Résumé
                </LinkButton>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      <footer className="mt-10 flex flex-col items-center justify-between gap-4 text-sm text-fg-3 md:flex-row">
        <p>
          © 2026 {profile.firstName} {profile.lastName}. Built with React 19, TypeScript, Vite and Tailwind CSS.
        </p>
        <div className="flex items-center gap-5">
          <a href={links.sourceOfThisSite} target="_blank" rel="noreferrer" className="hover:text-white">
            Source of this site
          </a>
          <a href="#top" className="inline-flex items-center gap-1 hover:text-white">
            Back to top <ArrowUp className="size-3.5" />
          </a>
        </div>
      </footer>
    </section>
  )
}
