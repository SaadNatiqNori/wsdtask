import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IoArrowForward } from 'react-icons/io5'
import { cubicEase } from './easings'
import { useProjects, useContent } from './api'
import { PROJECTS_DATA } from './projects'

gsap.registerPlugin(ScrollTrigger)

// Section-level copy only — the project cards come from the Projects CRUD
// (the `featured` ones), so this slider stays in sync with /projects.
const PORTFOLIO_FALLBACK = {
  heading: ['Portfolio', 'Overview'],
  description:
    'Our portfolio includes residential, commercial, and mixed-use properties, all designed to enhance quality of life and create long-term value for investors, residents, and communities.',
  ctaLabel: 'CHECK ALL',
}

function useScale(referenceWidth = 1440) {
  const [state, setState] = useState(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      const dpr = window.devicePixelRatio || 1
      return {
        scale: width >= 768 ? width / referenceWidth : 1,
        initialDPR: dpr,
      }
    }
    return { scale: 1, initialDPR: 1 }
  })

  useEffect(() => {
    const setScale = (s) => setState((prev) => ({ ...prev, scale: s }))
    const handleResize = () => {
      const width = window.innerWidth
      const currentDPR = window.devicePixelRatio || 1
      const virtualWidth = width * (currentDPR / state.initialDPR)
      if (virtualWidth >= 768) setScale(width / referenceWidth)
      else setScale(1)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [referenceWidth, state.initialDPR])

  return state.scale
}

export function ProjectIllustration({ variant }) {
  const stroke = '#3A3E4A'
  const fill = '#252830'

  if (variant === 0) {
    return (
      <svg viewBox="0 0 600 180" className="w-full max-w-[520px] h-auto" aria-hidden="true">
        <path
          d="M 40 150 Q 240 30 560 80 L 560 160 L 40 160 Z"
          fill={fill}
          stroke="#4A4E5A"
          strokeWidth="0.6"
        />
        <rect x="470" y="105" width="65" height="55" fill={fill} stroke="#4A4E5A" strokeWidth="0.6" />
        <line x1="40" y1="162" x2="600" y2="162" stroke="#4A4E5A" strokeWidth="0.6" />
        <text
          x="195"
          y="125"
          fill="#9DA5B4"
          fontSize="8"
          fontFamily="'Akkurat_Mono', monospace"
          fontWeight="500"
        >
          ERBIL AVENUE
        </text>
      </svg>
    )
  }

  if (variant === 1) {
    return (
      <svg viewBox="0 0 600 180" className="w-full max-w-[540px] h-auto" aria-hidden="true">
        <line x1="0" y1="160" x2="600" y2="160" stroke="#4A4E5A" strokeWidth="0.6" />
        <line x1="0" y1="95" x2="600" y2="95" stroke="#4A4E5A" strokeWidth="0.4" />
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 30 + i * 65
          return (
            <g key={i}>
              <path
                d={`M ${x} 160 L ${x} 70 Q ${x + 20} 40 ${x + 40} 70 L ${x + 40} 160 Z`}
                fill={fill}
                stroke="#4A4E5A"
                strokeWidth="0.5"
              />
              <line x1={x + 20} y1="70" x2={x + 20} y2="160" stroke="#4A4E5A" strokeWidth="0.3" />
            </g>
          )
        })}
        <circle cx="300" cy="118" r="14" fill={fill} stroke="#7A8090" strokeWidth="0.5" />
        <text
          x="300"
          y="120"
          textAnchor="middle"
          fill="#9DA5B4"
          fontSize="5"
          fontFamily="'Akkurat_Mono', monospace"
          fontWeight="500"
        >
          2ND AVENUE
        </text>
      </svg>
    )
  }

  if (variant === 2) {
    return (
      <svg viewBox="0 0 600 180" className="w-full max-w-[520px] h-auto" aria-hidden="true">
        <path
          d="M 30 60 Q 200 20 400 50 T 580 70 L 580 160 L 30 160 Z"
          fill={fill}
          stroke="#4A4E5A"
          strokeWidth="0.6"
        />
        <line x1="0" y1="162" x2="600" y2="162" stroke="#4A4E5A" strokeWidth="0.6" />
        <g stroke="#4A4E5A" strokeWidth="0.3" fill="none">
          {Array.from({ length: 10 }).map((_, i) => {
            const y = 70 + i * 9
            return (
              <path
                key={i}
                d={`M 30 ${y + 5} Q 200 ${y - 3} 400 ${y + 2} T 580 ${y + 6}`}
              />
            )
          })}
        </g>
        <text
          x="380"
          y="100"
          fill="#9DA5B4"
          fontSize="7"
          fontFamily="'Akkurat_Mono', monospace"
          fontWeight="500"
        >
          YouthHub
        </text>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 600 180" className="w-full max-w-[540px] h-auto" aria-hidden="true">
      <line x1="0" y1="160" x2="600" y2="160" stroke="#4A4E5A" strokeWidth="0.6" />
      <line x1="0" y1="105" x2="600" y2="105" stroke="#4A4E5A" strokeWidth="0.4" />
      <rect x="40" y="85" width="220" height="75" fill={fill} stroke="#4A4E5A" strokeWidth="0.5" />
      <rect x="340" y="85" width="220" height="75" fill={fill} stroke="#4A4E5A" strokeWidth="0.5" />
      <rect x="278" y="55" width="44" height="105" fill={fill} stroke="#7A8090" strokeWidth="0.6" />
      <g stroke="#4A4E5A" strokeWidth="0.25">
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`l${i}`} x1={40 + i * 16} y1="85" x2={40 + i * 16} y2="160" />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`r${i}`} x1={340 + i * 16} y1="85" x2={340 + i * 16} y2="160" />
        ))}
      </g>
      <text
        x="300"
        y="115"
        textAnchor="middle"
        fill="#9DA5B4"
        fontSize="5"
        fontFamily="'Akkurat_Mono', monospace"
        fontWeight="500"
      >
        AVENUE
      </text>
      <text
        x="300"
        y="123"
        textAnchor="middle"
        fill="#9DA5B4"
        fontSize="5"
        fontFamily="'Akkurat_Mono', monospace"
        fontWeight="500"
      >
        SQUARE
      </text>
    </svg>
  )
}

function PortfolioSlider() {
  const scale = useScale()
  const home = useContent('home', { portfolio: PORTFOLIO_FALLBACK })
  const portfolio = home.portfolio ?? PORTFOLIO_FALLBACK
  // Cards are the CRUD projects flagged "Show on home portfolio". Fall back to
  // all projects if none are flagged, so the section is never empty.
  const allProjects = useProjects(PROJECTS_DATA)
  const featured = allProjects.filter((p) => p.featured)
  const projects = featured.length ? featured : allProjects
  const sectionRef = useRef(null)
  const scrollRef = useRef(null)
  const introRef = useRef(null)
  const cardRefs = useRef([])
  const progressFillRef = useRef(null)

  cardRefs.current = []

  // Size each card to hug its own cover image: draw the image at a fixed height
  // so its width is the natural aspect, then set the card width to that image
  // width plus the horizontal padding (the "x margin"). The title/description
  // then wrap to the image width instead of stretching the card wider.
  const IMG_HEIGHT = 150
  const CARD_PAD_X = 32 // matches the card's px-8 (both sides = 64)
  const fitCardToImage = (img) => {
    if (!img) return
    const apply = () => {
      const { naturalWidth: nw, naturalHeight: nh } = img
      if (!nw || !nh) return
      const imgW = IMG_HEIGHT * (nw / nh)
      const card = img.closest('article')
      if (card) card.style.width = `${Math.round(Math.max(imgW, 340)) + CARD_PAD_X * 2}px`
    }
    if (img.complete && img.naturalWidth) apply()
    else img.addEventListener('load', apply, { once: true })
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    // Update the progress indicator off the scroll event, but write straight to
    // the DOM inside a rAF so we don't re-render the whole slider every frame
    // (that was the main source of the "glitchy" feel while dragging).
    let rafId = 0
    const paint = () => {
      rafId = 0
      const fill = progressFillRef.current
      if (!fill) return
      const max = el.scrollWidth - el.clientWidth
      const p = max > 0 ? el.scrollLeft / max : 0
      fill.style.left = `${p * 78}%`
    }
    const handleScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(paint)
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    paint()

    // Drag-to-scroll (mouse) with inertia. Touch/trackpad keep native scrolling.
    let isDown = false
    let moved = false
    let dragScale = 1
    let startX = 0
    let startScrollLeft = 0
    let lastX = 0
    let lastT = 0
    let velocity = 0 // local px per ms; scrollLeft moves opposite the cursor
    let momentumId = 0

    const stopMomentum = () => {
      if (momentumId) cancelAnimationFrame(momentumId)
      momentumId = 0
    }

    const onPointerDown = (e) => {
      if (e.pointerType !== 'mouse') return
      stopMomentum()
      isDown = true
      moved = false
      startX = lastX = e.clientX
      startScrollLeft = el.scrollLeft
      lastT = e.timeStamp
      velocity = 0
      // The section is CSS-scaled (.scale-wrapper); convert cursor pixels into
      // the element's own pixels so the cards track the cursor 1:1.
      dragScale = el.getBoundingClientRect().width / el.offsetWidth || 1
      el.style.cursor = 'grabbing'
      // Stop the browser starting a native image/text drag mid-swipe.
      e.preventDefault()
    }

    const onPointerMove = (e) => {
      if (!isDown) return
      const dxTotal = (e.clientX - startX) / dragScale
      if (Math.abs(dxTotal) > 4) moved = true
      el.scrollLeft = startScrollLeft - dxTotal
      const dt = e.timeStamp - lastT
      if (dt > 0) {
        velocity = -((e.clientX - lastX) / dragScale) / dt
        lastX = e.clientX
        lastT = e.timeStamp
      }
    }

    const endDrag = () => {
      if (!isDown) return
      isDown = false
      el.style.cursor = ''
      // Glide on release, decaying the velocity, instead of stopping dead — this
      // is what makes the release feel smooth rather than abrupt/janky.
      const maxScroll = el.scrollWidth - el.clientWidth
      let prev = performance.now()
      const glide = (now) => {
        const dt = now - prev
        prev = now
        velocity *= Math.pow(0.95, dt / 16) // frame-rate independent friction
        el.scrollLeft += velocity * dt
        if (el.scrollLeft <= 0 || el.scrollLeft >= maxScroll) velocity = 0
        momentumId = Math.abs(velocity) > 0.02 ? requestAnimationFrame(glide) : 0
      }
      if (Math.abs(velocity) > 0.02) momentumId = requestAnimationFrame(glide)
    }

    // Horizontal wheel / trackpad swipe: keep it as a native horizontal scroll
    // and stop the page's full-screen section navigation from hijacking it.
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        stopMomentum()
        e.stopPropagation()
      }
    }

    // Swallow the click that ends a drag so it doesn't trigger the card's Link,
    // but let a genuine click (no movement) through so DISCOVER navigates.
    const onClickCapture = (e) => {
      if (moved) {
        e.preventDefault()
        e.stopPropagation()
        moved = false
      }
    }

    // Listen on window (not via pointer capture) so the drag keeps tracking
    // outside the element AND the click still reaches the Link — pointer capture
    // retargets the click to the container, which was blocking navigation.
    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', endDrag)
    el.addEventListener('wheel', onWheel, { passive: true })
    el.addEventListener('click', onClickCapture, true)

    return () => {
      stopMomentum()
      el.removeEventListener('scroll', handleScroll)
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endDrag)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('click', onClickCapture, true)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  useLayoutEffect(() => {
    const sectionEl = sectionRef.current
    const cards = cardRefs.current.filter(Boolean)

    const ctx = gsap.context(() => {
      gsap.set([introRef.current, ...cards], { y: 80, opacity: 0 })

      gsap.to([introRef.current, ...cards], {
        y: 0,
        opacity: 1,
        duration: 1.4,
        ease: cubicEase,
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 80%',
          toggleActions: 'restart none restart reset',
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-[#E6EBF0]"
      style={{ scrollSnapAlign: 'start' }}
      aria-label="Portfolio overview"
    >
      <div
        className="scale-wrapper"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: scale >= 1 ? '100%' : `${100 / scale}%`,
          marginLeft: scale >= 1 ? '0' : `${(100 - 100 / scale) / 2}%`,
          height: `${100 / scale}vh`,
        }}
      >
        <main className="relative h-full max-w-[1440px] mx-auto flex flex-col justify-center bg-[#E6EBF0] px-4 pt-[88px] pb-8 text-[#1C2D4F] md:px-8 md:pt-[120px] md:pb-10">
          <div
            ref={scrollRef}
            data-horizontal-scroll
            className="overflow-x-auto overflow-y-hidden flex items-start gap-2 cursor-grab select-none [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x',
              overscrollBehavior: 'contain',
            }}
          >
            <div
              ref={introRef}
              className="flex-shrink-0 w-[340px] flex flex-col pr-6 py-4"
            >
              <h2
                className="m-0 text-[58px] font-normal leading-[1.02] tracking-[-0.01em]"
                style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
              >
                {portfolio.heading[0]}
                <br />
                {portfolio.heading[1]}
              </h2>
              <p className="mt-8 text-[13px] leading-[160%] max-w-[280px] text-[#1C2D4F]">
                {portfolio.description}
              </p>
              <Link
                to="/projects"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-[24px] bg-navy px-5 py-4 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-mist no-underline"
              >
                <span className="relative top-[1px]">{portfolio.ctaLabel}</span>
                <IoArrowForward className="text-sm" aria-hidden="true" />
              </Link>
            </div>

            {projects.map((project, i) => (
              <article
                key={project.slug}
                ref={(el) => {
                  if (el) cardRefs.current.push(el)
                }}
                className="flex-shrink-0 w-[496px] h-[493px] bg-navy p-8 flex flex-col text-[#d6deea]"
              >
                <div>
                  <h3
                    className="m-0 text-[36px] font-normal leading-[1.1] tracking-[-0.01em] text-mist"
                    style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
                  >
                    {project.title}
                  </h3>
                  <p className="mt-4 text-[13px] leading-[150%] text-[#A8B0BD]">
                    {project.short || project.description}
                  </p>
                </div>

                <div className="flex-1 flex items-end justify-center my-12 min-h-0">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      draggable={false}
                      ref={fitCardToImage}
                      className="h-[150px] w-auto max-w-none object-contain"
                    />
                  ) : (
                    <ProjectIllustration variant={i % 4} />
                  )}
                </div>

                <Link
                  to={`/projects/${project.slug}`}
                  className="inline-flex w-fit items-center gap-[5px] rounded-[48px] border-[0.5px] border-mist px-[14px] py-[14px] font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-[#d5dee9] no-underline"
                >
                  <span className="relative top-[0.5px]">DISCOVER</span>
                  <IoArrowForward className="text-sm relative top-[0.5px]" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-8 mx-auto w-full max-w-[280px] h-[2px] bg-[#1C2D4F]/15 relative">
            <div
              ref={progressFillRef}
              className="absolute top-0 h-full bg-[#1C2D4F] transition-[left] duration-150 ease-out"
              style={{
                width: '22%',
                left: '0%',
              }}
            />
          </div>
        </main>
      </div>
    </section>
  )
}

export default PortfolioSlider
