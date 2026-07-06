import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { cubicEase } from './easings'
import ContactSection from './ContactSection'
import avenueDark from './assets/avenuesvgdark.svg'

const CARD_WIDTH = 520

const PROJECTS = [
  {
    slug: 'erbil-avenue',
    label: 'Erbil Avenue',
    title: 'Erbil Avenue',
    description:
      'Erbil Avenue is a premium mixed-use development, offering a unique blend of luxury living, world-class retail, gourmet dining, and diverse leisure experiences. This project sets a new benchmark for excellence in the region.',
  },
  {
    slug: '2nd-avenue',
    label: 'Second Avenue',
    title: '2nd Avenue',
    description:
      'Second Avenue is an elegant commercial development, designed as a destination for luxury shopping, premium dining, and lifestyle experiences. Featuring global trademarks and international restaurants, it sets a new standard for sophistication in Erbil.',
  },
  {
    slug: 'nice-village',
    label: 'Nice Village',
    title: 'Nice Village',
    description:
      'Nice Village is a premium residential community in a serene area of Erbil, offering luxury villas with integrated retail and lifestyle amenities.',
  },
  {
    slug: 'nni',
    label: 'New North Industrial',
    title: 'New North Industrial',
    description:
      'The NNI Project is a flagship industrial development by Alcove Company, designed to meet the growing demand for high-quality, modern industrial spaces in Erbil.',
  },
]

function Arrow({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3.5 12h16M13 5.5l6.5 6.5-6.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProjectsListPage() {
  const headingRef = useRef(null)
  const listRef = useRef(null)
  const rowsRef = useRef([])

  // Preview card refs
  const cardWrapRef = useRef(null) // positioned via gsap.quickTo (translate)
  const cardInnerRef = useRef(null) // fade-up animation (opacity + translateY)
  const xTo = useRef(null)
  const yTo = useRef(null)
  const hasPos = useRef(false)

  const [active, setActive] = useState(null) // hovered row index
  const [display, setDisplay] = useState(0) // last shown project (kept during fade-out)

  rowsRef.current = []

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Entrance animation for heading + rows
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const rows = rowsRef.current.filter(Boolean)
      gsap.set([headingRef.current, ...rows], { y: 60, opacity: 0 })
      gsap.to([headingRef.current, ...rows], {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: cubicEase,
        stagger: 0.08,
        delay: 0.15,
      })
    })
    return () => ctx.revert()
  }, [])

  // Position follower setup + hidden initial state for the card
  useLayoutEffect(() => {
    gsap.set(cardInnerRef.current, { autoAlpha: 0, y: 24 })
    xTo.current = gsap.quickTo(cardWrapRef.current, 'x', {
      duration: 0.5,
      ease: 'power3.out',
    })
    yTo.current = gsap.quickTo(cardWrapRef.current, 'y', {
      duration: 0.5,
      ease: 'power3.out',
    })
  }, [])

  // Fade-up in / out when the hovered row changes
  useEffect(() => {
    if (active !== null) {
      setDisplay(active)
      gsap.killTweensOf(cardInnerRef.current)
      gsap.fromTo(
        cardInnerRef.current,
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.55, ease: cubicEase }
      )
    } else {
      gsap.killTweensOf(cardInnerRef.current)
      gsap.to(cardInnerRef.current, {
        y: 16,
        autoAlpha: 0,
        duration: 0.4,
        ease: cubicEase,
      })
      hasPos.current = false
    }
  }, [active])

  const handleMove = (e) => {
    const inner = cardInnerRef.current
    const wrap = cardWrapRef.current
    if (!inner || !wrap) return

    const margin = 24
    const h = inner.offsetHeight || 360
    const w = CARD_WIDTH

    let x = e.clientX + 44
    let y = e.clientY - h / 2
    x = Math.min(Math.max(x, margin), window.innerWidth - w - margin)
    y = Math.min(Math.max(y, margin), window.innerHeight - h - margin)

    if (!hasPos.current) {
      gsap.set(wrap, { x, y })
      hasPos.current = true
    } else {
      xTo.current(x)
      yTo.current(y)
    }
  }

  const project = PROJECTS[display]

  return (
    <>
    <main className="relative min-h-screen bg-[#E6EBF0] px-6 md:px-12 pb-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto pt-[150px] md:pt-[190px]">
        {/* Heading */}
        <div ref={headingRef} className="md:pl-[13%]">
          <p
            className="m-0 text-[24px] md:text-[32px] font-[420] leading-[1] tracking-[-0.04em] text-[#7E8798]"
            style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
          >
            Our Projects
          </p>
          <h1
            className="mt-5 md:mt-6 max-w-[860px] text-[32px] md:text-[46px] font-[420] leading-[1.15] tracking-[-0.02em] text-[#1B2436]"
            style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
          >
            Building the Future of Urban Living Developments crafted to elevate
            quality of life and create sustainable value across Erbil and beyond.
          </h1>
        </div>

        {/* Project list */}
        <ul
          ref={listRef}
          onMouseMove={handleMove}
          onMouseLeave={() => setActive(null)}
          className="mt-[80px] md:mt-[110px] list-none p-0 m-0"
        >
          {PROJECTS.map((p, i) => {
            const dim = active !== null && active !== i
            // Top line of this row is dark when nothing is hovered, or when this
            // row or the row directly above it is hovered (shared edge).
            const topDark = active === null || active === i || active === i - 1
            return (
              <li
                key={p.slug}
                ref={(el) => {
                  if (el) rowsRef.current.push(el)
                }}
                className="list-none"
              >
                <div
                  className={`h-px w-full transition-colors duration-[450ms] ease-out ${
                    topDark ? 'bg-[#1C1F2A]' : 'bg-[#AAB2C0]'
                  }`}
                />
                <Link
                  to={`/projects/${p.slug}`}
                  onMouseEnter={() => setActive(i)}
                  className="group flex items-center justify-between gap-6 py-[34px] md:py-[42px] no-underline"
                >
                  <span
                    className={`block text-[30px] md:text-[42px] font-[420] leading-[1] tracking-[-0.04em] transition-colors duration-[450ms] ease-out ${
                      dim ? 'text-[#AAB2C0]' : 'text-[#1B2436]'
                    }`}
                    style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
                  >
                    {p.label}
                  </span>
                  <Arrow
                    className={`shrink-0 w-[30px] h-[30px] md:w-[36px] md:h-[36px] transition-colors duration-[450ms] ease-out ${
                      dim ? 'text-[#AAB2C0]' : 'text-[#1C1F2A]'
                    }`}
                  />
                </Link>
              </li>
            )
          })}
          {/* Closing bottom line — dark when nothing hovered or the last row is hovered */}
          <div
            className={`h-px w-full transition-colors duration-[450ms] ease-out ${
              active === null || active === PROJECTS.length - 1
                ? 'bg-[#1C1F2A]'
                : 'bg-[#AAB2C0]'
            }`}
          />
        </ul>
      </div>

      {/* Mouse-following preview card */}
      <div
        ref={cardWrapRef}
        className="pointer-events-none fixed left-0 top-0 z-40 will-change-transform"
        style={{ width: CARD_WIDTH }}
      >
        <div
          ref={cardInnerRef}
          className="rounded-[10px] border border-[#FFFFFF12] bg-navy p-9 text-mist shadow-[0_30px_80px_-24px_rgba(10,14,24,0.55)] will-change-transform"
        >
          <h2
            className="m-0 text-[26px] md:text-[28px] font-[420] leading-[1.1] tracking-[-0.02em] text-mist"
            style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
          >
            {project.title}
          </h2>
          <p className="mt-[10px] max-w-[420px] text-[14px] leading-[1.55] tracking-[0] text-white">
            {project.description}
          </p>
          <div className="mt-8 flex justify-center">
            <img
              src={avenueDark}
              alt=""
              aria-hidden="true"
              className="w-[80%] h-auto opacity-90"
            />
          </div>
        </div>
      </div>
    </main>
    <ContactSection />
    </>
  )
}

export default ProjectsListPage
