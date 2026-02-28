import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { IoChevronDownOutline, IoArrowForward } from 'react-icons/io5'
import logo from './assets/Logo.svg'
import './App.css'

const ACCENT_WORDS = new Set(['Development', 'Properties', 'Construction'])

const HERO_TEXT =
  'Alcove is a forward-thinking company specializing in real estate Development management of Properties and Construction services in Erbil, Kurdistan Region. With a commitment to building modern, sustainable, and innovative spaces, Alcove is shaping the future of urban living in the region.'

const CARDS = [
  {
    title: 'Construction',
    description: 'Delivering innovative and high-quality construction',
  },
  {
    title: 'Development',
    description: 'Leading large-scale development projects to transform urban spaces.',
  },
  {
    title: 'Properties',
    description: 'Managing a diverse portfolio of residential and commercial properties.',
  },
]

function App() {
  const navbarRef = useRef(null)
  const wordRefs = useRef([])
  const accentWordMap = useRef({})
  const heroRef = useRef(null)
  const cardsSectionRef = useRef(null)
  const cardTitleRefs = useRef({})
  const cardContentRefs = useRef([])
  const cardLineRefs = useRef([])

  wordRefs.current = []
  accentWordMap.current = {}
  cardContentRefs.current = []
  cardLineRefs.current = []

  useLayoutEffect(() => {
    const navbarEl = navbarRef.current
    const heroEl = heroRef.current
    const cardsEl = cardsSectionRef.current
    const allWordEls = wordRefs.current.filter(Boolean)
    const accentEls = Object.values(accentWordMap.current).filter(Boolean)
    const nonAccentEls = allWordEls.filter((el) => !accentEls.includes(el))
    const contentEls = cardContentRefs.current.filter(Boolean)
    const lineEls = cardLineRefs.current.filter(Boolean)

    if (!navbarEl || !allWordEls.length) return

    const clones = []

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(navbarEl, { opacity: 0, y: 16 })
      gsap.set(allWordEls, { yPercent: 100 })
      gsap.set(cardsEl, { autoAlpha: 0 })

      const tl = gsap.timeline()

      // Phase 1: Navbar fade in
      tl.to(navbarEl, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      })

      // Phase 1b: All words reveal simultaneously
      tl.to(
        allWordEls,
        {
          yPercent: 0,
          duration: 2,
          ease: 'power2.out',
        },
        '-=0.1'
      )

      // Phase 2: After 500ms, non-accent words exit upward
      tl.to(
        nonAccentEls,
        {
          yPercent: -100,
          duration: 0.8,
          ease: 'power2.in',
        },
        '+=0.5'
      )

      // Phase 3: Hold 1s with only accent words visible
      tl.to({}, { duration: 1 })

      // Phase 4: Move accent words to card titles
      tl.call(() => {
        // Measure accent word positions while hero is visible
        const fromRects = {}
        CARDS.forEach((card) => {
          const el = accentWordMap.current[card.title]
          if (el) fromRects[card.title] = el.getBoundingClientRect()
        })

        // Hide hero
        gsap.set(heroEl, { opacity: 0 })

        // Show cards section (content hidden)
        gsap.set(cardsEl, { autoAlpha: 1 })
        Object.values(cardTitleRefs.current).forEach((el) => {
          if (el) gsap.set(el, { opacity: 0 })
        })
        gsap.set(contentEls, { autoAlpha: 0, y: 20 })
        gsap.set(lineEls, { scaleY: 0, transformOrigin: 'top' })

        // Measure card title target positions
        const toRects = {}
        CARDS.forEach((card) => {
          const el = cardTitleRefs.current[card.title]
          if (el) toRects[card.title] = el.getBoundingClientRect()
        })

        // Create floating clones and animate them
        const moveTl = gsap.timeline()

        CARDS.forEach((card) => {
          const from = fromRects[card.title]
          const to = toRects[card.title]
          if (!from || !to) return

          const accentEl = accentWordMap.current[card.title]
          const computedFontSize = window.getComputedStyle(accentEl).fontSize
          const targetEl = cardTitleRefs.current[card.title]
          const targetFontSize = window.getComputedStyle(targetEl).fontSize

          const clone = document.createElement('span')
          clone.textContent = card.title
          Object.assign(clone.style, {
            position: 'fixed',
            left: `${from.left}px`,
            top: `${from.top}px`,
            fontFamily: "'Season Mix-TRIAL', serif",
            color: '#ECD898',
            fontSize: computedFontSize,
            lineHeight: '120%',
            letterSpacing: '-0.01em',
            zIndex: '100',
            pointerEvents: 'none',
          })
          document.body.appendChild(clone)
          clones.push(clone)

          moveTl.to(
            clone,
            {
              left: to.left,
              top: to.top,
              fontSize: targetFontSize,
              duration: 1.2,
              ease: 'power2.inOut',
              onComplete: () => {
                clone.remove()
                if (targetEl) gsap.set(targetEl, { opacity: 1 })
              },
            },
            0
          )
        })

        // Phase 5: Fade in card content
        moveTl.to(
          contentEls,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.05,
          },
          '-=0.3'
        )

        // Phase 6: Animate left border lines from top to bottom
        moveTl.to(
          lineEls,
          {
            scaleY: 1,
            duration: 1.2,
            ease: 'power2.out',
          },
          '<'
        )
      })
    })

    return () => {
      ctx.revert()
      clones.forEach((c) => c.remove())
    }
  }, [])

  const words = HERO_TEXT.split(' ')

  return (
    <main className="relative min-h-screen bg-[#161b2b] px-4 pb-8 pt-4 text-[#d6deea] md:px-8 md:pb-12 md:pt-5">
      <span className="fixed bottom-4 left-4 z-50 text-[11px] text-white font-['Akkurat_Mono',monospace]">
        Designed with love by Saad Natiq Nori
      </span>
      <header className="mb-[clamp(2rem,6vw,4.5rem)] flex justify-center">
        <nav
          ref={navbarRef}
          className="flex w-full items-center gap-4 rounded-[8px] border border-white/10 bg-[rgba(20,25,41,0.42)] px-[0.7rem] py-[0.45rem] backdrop-blur-[2px] md:w-max md:gap-6"
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

      <div className="relative mx-auto max-w-[1300px]">
        {/* Hero Section */}
        <section ref={heroRef} aria-label="Company introduction" id="hero-section">
          <p className="m-0 text-[clamp(2rem,8vw,58px)] font-normal not-italic leading-[120%] tracking-[-0.01em] md:text-[58px]">
            {words.map((word, i) => {
              const cleanWord = word.replace(/[.,]/g, '')
              const isAccent = ACCENT_WORDS.has(cleanWord)
              return (
                <span key={i} className="inline-block overflow-hidden">
                  <span
                    ref={(el) => {
                      if (el) {
                        wordRefs.current.push(el)
                        if (isAccent) accentWordMap.current[cleanWord] = el
                      }
                    }}
                    className={`inline-block ${isAccent ? "text-[#ECD898] font-['Season_Mix-TRIAL',serif]" : ''}`}
                  >
                    {word}
                  </span>
                  {i < words.length - 1 && '\u00A0'}
                </span>
              )
            })}
          </p>
        </section>

        {/* Cards Section */}
        <section
          ref={cardsSectionRef}
          className="absolute inset-x-0 top-0 grid grid-cols-1 gap-6 md:gap-0 md:grid-cols-3"
          aria-label="Subsidiaries"
        >
          {CARDS.map((card) => (
            <div key={card.title} className="relative flex min-h-[40vh] flex-col py-0 pl-6 md:min-h-[60vh]">
              {/* Left border line */}
              <div
                ref={(el) => {
                  if (el) cardLineRefs.current.push(el)
                }}
                className="absolute left-0 top-0 h-full w-[0.5px] bg-[#ECD898]"
              />

              {/* ALCOVE label */}
              <p
                ref={(el) => {
                  if (el) cardContentRefs.current.push(el)
                }}
                className="mb-1 text-[clamp(1rem,2vw,1.4rem)] leading-none tracking-[-0.01em] text-[#ECD898]"
                style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
              >
                ALCOVE
              </p>

              {/* Card title (accent word destination) */}
              <h3
                ref={(el) => {
                  if (el) cardTitleRefs.current[card.title] = el
                }}
                className="m-0 text-[clamp(1.75rem,6vw,48px)] leading-[120%] text-[#ECD898] md:text-[clamp(2rem,4vw,48px)]"
                style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
              >
                {card.title}
              </h3>

              {/* Bottom content */}
              <div
                ref={(el) => {
                  if (el) cardContentRefs.current.push(el)
                }}
                className="mt-auto"
              >
                <p className="mb-4 text-[14px] font-normal leading-[140%] tracking-[0] text-[#d5dee9]/80 md:mb-6 md:text-[16px] md:leading-[100%]">
                  {card.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-[#d5dee9] no-underline"
                >
                  DISCOVER{' '}
                  <IoArrowForward className="text-sm" aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}

export default App
