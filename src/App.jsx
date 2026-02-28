import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { IoChevronDownOutline } from 'react-icons/io5'
import logo from './assets/Logo.svg'
import './App.css'

const ACCENT_WORDS = new Set(['Development', 'Properties', 'Construction'])

const HERO_TEXT =
  'Alcove is a forward-thinking company specializing in real estate Development management of Properties and Construction services in Erbil, Kurdistan Region. With a commitment to building modern, sustainable, and innovative spaces, Alcove is shaping the future of urban living in the region.'

function App() {
  const navbarRef = useRef(null)
  const wordRefs = useRef([])

  wordRefs.current = []

  useLayoutEffect(() => {
    const navbarElement = navbarRef.current
    const words = wordRefs.current.filter(Boolean)

    if (!navbarElement || !words.length) return

    const ctx = gsap.context(() => {
      gsap.set(navbarElement, { opacity: 0, y: 16 })
      gsap.set(words, { yPercent: 100 })

      const timeline = gsap.timeline()

      timeline.to(navbarElement, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      })

      timeline.to(
        words,
        {
          yPercent: 0,
          duration: 2,
          ease: 'power2.out',
        },
        '-=0.1'
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className="min-h-screen bg-[#161b2b] px-8 pb-12 pt-5 text-[#d6deea]">
      <header className="mb-[clamp(2rem,6vw,4.5rem)] flex justify-center">
        <nav
          ref={navbarRef}
          className="flex w-max items-center gap-6 rounded-[8px] border border-white/10 bg-[rgba(20,25,41,0.42)] px-[0.7rem] py-[0.45rem] backdrop-blur-[2px]"
          aria-label="Main navigation"
        >
          <a href="#" className="no-underline">
            <img src={logo} alt="Alcove" className="h-[12px] w-auto" />
          </a>

          <ul className="ml-[0.55rem] hidden list-none items-center gap-6 p-0 md:flex">
            <li>
              <a
                href="#"
                className="inline-flex items-center gap-[0.3rem] whitespace-nowrap font-['Akkurat_Mono',monospace] text-[10px] font-medium leading-none text-[#d5dee9] no-underline"
              >
                ABOUT
              </a>
            </li>
            <li>
              <a
                href="#"
                className="inline-flex items-center gap-[0.3rem] whitespace-nowrap font-['Akkurat_Mono',monospace] text-[10px] font-medium leading-none text-[#d5dee9] no-underline"
              >
                SUBSIDIARIES{' '}
                <IoChevronDownOutline
                  className="translate-y-[0.5px] text-[0.9em] leading-none"
                  aria-hidden="true"
                />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="inline-flex items-center gap-[0.3rem] whitespace-nowrap font-['Akkurat_Mono',monospace] text-[10px] font-medium leading-none text-[#d5dee9] no-underline"
              >
                PROJECTS{' '}
                <IoChevronDownOutline
                  className="translate-y-[0.5px] text-[0.9em] leading-none"
                  aria-hidden="true"
                />
              </a>
            </li>
          </ul>

          <a
            href="#"
            className="ml-auto whitespace-nowrap rounded-full bg-[#cfd7e1] px-3 py-[0.65rem] font-['Akkurat_Mono',monospace] text-[10px] font-medium leading-none tracking-[0] text-[#191f2f] no-underline md:px-4"
          >
            CONTACT
          </a>
        </nav>
      </header>

      <section className="mx-auto max-w-[1300px]" aria-label="Company introduction" id="hero-section">
        {(() => {
          const words = HERO_TEXT.split(' ')
          return (
            <p className="m-0 text-[clamp(2rem,8vw,58px)] font-normal not-italic leading-[120%] tracking-[-0.01em] md:text-[58px]">
              {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <span
                    ref={(el) => {
                      if (el) wordRefs.current.push(el)
                    }}
                    className={`inline-block ${ACCENT_WORDS.has(word.replace(/[.,]/g, '')) ? "text-[#ECD898] font-['Season_Mix-TRIAL',serif]" : ''}`}
                  >
                    {word}
                  </span>
                  {i < words.length - 1 && '\u00A0'}
                </span>
              ))}
            </p>
          )
        })()}
      </section>
    </main>
  )
}

export default App
