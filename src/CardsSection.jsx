import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IoArrowForward } from 'react-icons/io5'
import logoYellow from './assets/LogoYellow.svg'
import { cubicEase } from './easings'

gsap.registerPlugin(ScrollTrigger)

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

function CardsSection() {
  const scale = useScale()
  const sectionRef = useRef(null)
  const wordRefs = useRef([])
  const accentWordMap = useRef({})
  const heroTextRef = useRef(null)
  const cardsContainerRef = useRef(null)
  const cardTitleRefs = useRef({})
  const cardContentRefs = useRef([])
  const cardLineRefs = useRef([])

  wordRefs.current = []
  accentWordMap.current = {}
  cardContentRefs.current = []
  cardLineRefs.current = []

  useLayoutEffect(() => {
    const sectionEl = sectionRef.current
    const allWordEls = wordRefs.current.filter(Boolean)
    const accentEls = Object.values(accentWordMap.current).filter(Boolean)
    const nonAccentEls = allWordEls.filter((el) => !accentEls.includes(el))
    const heroEl = heroTextRef.current
    const cardsEl = cardsContainerRef.current
    const contentEls = cardContentRefs.current.filter(Boolean)
    const lineEls = cardLineRefs.current.filter(Boolean)

    if (!sectionEl || !allWordEls.length) return

    const clones = []

    const ctx = gsap.context(() => {
      gsap.set(allWordEls, { yPercent: 100 })
      gsap.set(cardsEl, { autoAlpha: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top bottom',
          toggleActions: 'restart none restart reset',
        },
      })

      tl.to(allWordEls, {
        yPercent: 0,
        duration: 2,
        ease: cubicEase,
      })

      tl.to(
        nonAccentEls,
        {
          yPercent: -100,
          duration: 0.8,
          ease: cubicEase,
        },
        '+=0.5'
      )

      tl.call(() => {
        const fromRects = {}
        CARDS.forEach((card) => {
          const el = accentWordMap.current[card.title]
          if (el) fromRects[card.title] = el.getBoundingClientRect()
        })

        gsap.to(heroEl, { opacity: 0, duration: 0.5, ease: cubicEase })

        gsap.set(cardsEl, { autoAlpha: 1 })
        Object.values(cardTitleRefs.current).forEach((el) => {
          if (el) gsap.set(el, { opacity: 0 })
        })
        gsap.set(contentEls, { autoAlpha: 0, y: 20 })
        gsap.set(lineEls, { scaleY: 0, transformOrigin: 'top' })

        const toRects = {}
        CARDS.forEach((card) => {
          const el = cardTitleRefs.current[card.title]
          if (el) toRects[card.title] = el.getBoundingClientRect()
        })

        const moveTl = gsap.timeline()

        CARDS.forEach((card, index) => {
          const from = fromRects[card.title]
          const to = toRects[card.title]
          if (!from || !to) return

          const accentEl = accentWordMap.current[card.title]
          const computedFontSize = parseFloat(
            window.getComputedStyle(accentEl).fontSize
          )
          const targetEl = cardTitleRefs.current[card.title]
          const targetFontSize = parseFloat(
            window.getComputedStyle(targetEl).fontSize
          )
          const fontScale = targetFontSize / computedFontSize

          const dx = to.left - from.left
          const dy = to.top - from.top

          const clone = document.createElement('span')
          clone.textContent = card.title
          Object.assign(clone.style, {
            position: 'fixed',
            left: `${from.left}px`,
            top: `${from.top}px`,
            fontFamily: "'Season Mix-TRIAL', serif",
            color: 'var(--color-gold)',
            fontSize: `${computedFontSize}px`,
            fontWeight: '400',
            lineHeight: '120%',
            letterSpacing: '-0.01em',
            zIndex: '100',
            pointerEvents: 'none',
            willChange: 'transform',
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
          })
          document.body.appendChild(clone)
          clones.push(clone)

          moveTl.to(
            clone,
            {
              x: dx,
              y: dy,
              scale: fontScale * scale,
              duration: 1.4,
              ease: cubicEase,
              onComplete: () => {
                if (targetEl) gsap.set(targetEl, { opacity: 1 })
                gsap.to(clone, {
                  opacity: 0,
                  duration: 0.15,
                  onComplete: () => clone.remove(),
                })
              },
            },
            index * 0.08
          )
        })

        moveTl.to(
          contentEls,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: cubicEase,
            stagger: 0.08,
          },
          '-=0.5'
        )

        moveTl.to(
          lineEls,
          {
            scaleY: 1,
            duration: 1.4,
            ease: cubicEase,
          },
          '<'
        )
      })
    })

    return () => {
      ctx.revert()
      clones.forEach((c) => c.remove())
    }
  }, [scale])

  const words = HERO_TEXT.split(' ')

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-navy"
      style={{ scrollSnapAlign: 'start' }}
      aria-label="Subsidiaries"
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
        <main className="relative h-full max-w-[1440px] mx-auto flex flex-col bg-navy px-4 pb-8 pt-[88px] text-[#d6deea] md:px-8 md:pb-12 md:pt-[128px]">
          <div className="relative mx-auto flex flex-1 items-center max-w-[1440px] w-full">
            <section ref={heroTextRef} aria-label="Company introduction">
              <p className="m-0 text-[32px] font-normal not-italic leading-[120%] tracking-[-0.01em] md:text-[58px]">
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
                        className={`inline-block ${
                          isAccent
                            ? "text-gold font-['Season_Mix-TRIAL',serif] font-normal tracking-[-0.01em]"
                            : ''
                        }`}
                      >
                        {word}
                      </span>
                      {i < words.length - 1 && ' '}
                    </span>
                  )
                })}
              </p>
            </section>

            <section
              ref={cardsContainerRef}
              className="absolute inset-x-0 top-0 grid grid-cols-1 gap-6 md:top-1/2 md:-translate-y-1/2 md:gap-0 md:grid-cols-3 mt-4 md:mt-14"
              aria-label="Subsidiaries"
            >
              {CARDS.map((card) => (
                <div
                  key={card.title}
                  className="relative flex h-[30vh] flex-col py-0 pl-6 md:h-[534px]"
                >
                  <div
                    ref={(el) => {
                      if (el) cardLineRefs.current.push(el)
                    }}
                    className="absolute left-0 top-0 h-full w-[0.5px] bg-gold"
                  />

                  <p
                    ref={(el) => {
                      if (el) cardContentRefs.current.push(el)
                    }}
                    className="mb-3 text-[16px] leading-none tracking-[-0.01em] text-gold md:text-[22.4px]"
                    style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
                  >
                    <img src={logoYellow} alt="Alcove" className="w-auto h-[14px] md:h-[24px]" />
                  </p>

                  <h3
                    ref={(el) => {
                      if (el) cardTitleRefs.current[card.title] = el
                    }}
                    className="m-0 text-[28px] font-normal tracking-[-0.01em] leading-[120%] text-gold md:text-[58px]"
                    style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
                  >
                    {card.title}
                  </h3>

                  <div
                    ref={(el) => {
                      if (el) cardContentRefs.current.push(el)
                    }}
                    className="mt-auto"
                  >
                    <p className="mb-4 w-[80%] pe-4 text-[14px] font-normal leading-[140%] tracking-[0] text-mist md:mb-6 md:text-[16px] md:leading-[120%]">
                      {card.description}
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-[5px] rounded-[48px] border-[0.25px] border-mist px-[14px] py-4 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-[#d5dee9] no-underline"
                    >
                      <p className="relative top-[0.5px]">DISCOVER</p>{' '}
                      <IoArrowForward className="text-sm relative top-[0.5px]" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </main>
      </div>
    </section>
  )
}

export default CardsSection
