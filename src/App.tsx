import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Numbers } from './sections/Numbers'
import { Builds } from './sections/Builds'

function Backdrop() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-[20vh] -left-[15vw] size-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,.28),transparent_62%)]"
          style={{ animation: 'drift-a 28s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[25vh] -right-[25vw] size-[65vmax] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,.18),transparent_62%)]"
          style={{ animation: 'drift-b 34s ease-in-out infinite' }}
        />
        <div
          className="absolute -bottom-[30vh] left-[10vw] size-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,.13),transparent_62%)]"
          style={{ animation: 'drift-a 40s ease-in-out infinite reverse' }}
        />
      </div>
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[100]" />
    </>
  )
}

export default function App() {
  return (
    <>
      <a href="#about" className="sr-only z-[200] rounded-lg bg-white px-4 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Skip to content
      </a>
      <Backdrop />
      <Nav />
      <main className="overflow-x-clip">
        <Hero />
        <About />
        <Numbers />
        <Builds />
      </main>
    </>
  )
}
