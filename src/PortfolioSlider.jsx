import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IoArrowForward } from 'react-icons/io5'
import { cubicEase } from './easings'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    slug: 'erbil-avenue',
    title: 'Erbil Avenue',
    description:
      'Erbil Avenue is a premium mixed-use development, offering a unique blend of luxury living, world-class retail, gourmet dining, and diverse leisure experiences. This project sets a new benchmark for excellence in the region.',
    illustration: 0,
  },
  {
    slug: '2nd-avenue',
    title: '2nd Avenue',
    description:
      'Second Avenue is an elegant commercial development, designed as a destination for luxury shopping, premium dining, and lifestyle experiences. Featuring global trademarks and international restaurants, it sets a new standard for sophistication in Erbil.',
    illustration: 1,
  },
  {
    slug: 'youth-hub',
    title: 'Youth Hub',
    description:
      'Youth Hub is the largest and most advanced youth center in the Kurdistan Region and Iraq — an inclusive destination for youth and beyond. With modern facilities and diverse opportunities, it is a vibrant space that inspires creativity and sparks collaboration.',
    illustration: 2,
  },
  {
    slug: 'avenue-square',
    title: 'Avenue Square',
    description:
      'Avenue Square is a premium residential community, situated in one of the most exclusive and serene areas of Erbil. Designed for elegance, privacy, and comfort, it combines luxury villas with integrated retail and lifestyle amenities.',
    illustration: 3,
  },
]

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

function ProjectIllustration({ variant }) {
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
  const sectionRef = useRef(null)
  const scrollRef = useRef(null)
  const introRef = useRef(null)
  const cardRefs = useRef([])
  const [progress, setProgress] = useState(0)

  cardRefs.current = []

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      const max = el.scrollWidth - el.clientWidth
      setProgress(max > 0 ? el.scrollLeft / max : 0)
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    let isDown = false
    let startX = 0
    let startScrollLeft = 0
    let moved = false

    const onPointerDown = (e) => {
      isDown = true
      moved = false
      startX = e.clientX
      startScrollLeft = el.scrollLeft
      el.style.scrollSnapType = 'none'
      el.style.cursor = 'grabbing'
      el.setPointerCapture?.(e.pointerId)
    }

    const onPointerMove = (e) => {
      if (!isDown) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 3) moved = true
      el.scrollLeft = startScrollLeft - dx
    }

    const endDrag = (e) => {
      if (!isDown) return
      isDown = false
      el.style.cursor = ''
      el.style.scrollSnapType = ''
      if (e && e.pointerId != null) el.releasePointerCapture?.(e.pointerId)
    }

    const onClickCapture = (e) => {
      if (moved) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointercancel', endDrag)
    el.addEventListener('pointerleave', endDrag)
    el.addEventListener('click', onClickCapture, true)

    return () => {
      el.removeEventListener('scroll', handleScroll)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endDrag)
      el.removeEventListener('pointercancel', endDrag)
      el.removeEventListener('pointerleave', endDrag)
      el.removeEventListener('click', onClickCapture, true)
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
            className="overflow-x-auto overflow-y-hidden flex items-start gap-2 snap-x snap-mandatory cursor-grab select-none [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
          >
            <div
              ref={introRef}
              className="flex-shrink-0 w-[340px] snap-start flex flex-col pr-6 py-4"
            >
              <h2
                className="m-0 text-[58px] font-normal leading-[1.02] tracking-[-0.01em]"
                style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
              >
                Portfolio
                <br />
                Overview
              </h2>
              <p className="mt-8 text-[13px] leading-[160%] max-w-[280px] text-[#1C2D4F]">
                Our portfolio includes residential, commercial, and mixed-use properties,
                all designed to enhance quality of life and create long-term value for
                investors, residents, and communities.
              </p>
              <a
                href="#"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-[24px] bg-navy px-5 py-4 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-mist no-underline"
              >
                <span className="relative top-[1px]">CHECK ALL</span>
                <IoArrowForward className="text-sm" aria-hidden="true" />
              </a>
            </div>

            {PROJECTS.map((project) => (
              <article
                key={project.title}
                ref={(el) => {
                  if (el) cardRefs.current.push(el)
                }}
                className="flex-shrink-0 w-[600px] h-[460px] bg-navy p-8 snap-start flex flex-col text-[#d6deea]"
              >
                <div>
                  <h3
                    className="m-0 text-[36px] font-normal leading-[1.1] tracking-[-0.01em] text-mist"
                    style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
                  >
                    {project.title}
                  </h3>
                  <p className="mt-4 text-[13px] leading-[150%] max-w-[460px] text-[#A8B0BD]">
                    {project.description}
                  </p>
                </div>

                <div className="flex-1 flex items-end justify-center my-3 min-h-0">
                  <ProjectIllustration variant={project.illustration} />
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
              className="absolute top-0 h-full bg-[#1C2D4F] transition-[left] duration-150 ease-out"
              style={{
                width: '22%',
                left: `${progress * 78}%`,
              }}
            />
          </div>
        </main>
      </div>
    </section>
  )
}

export default PortfolioSlider
