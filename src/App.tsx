
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
      <Backdrop />
      <main className="overflow-x-clip">
      </main>
    </>
  )
}
