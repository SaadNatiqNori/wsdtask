import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logoYellow from './assets/LogoYellow.svg'
import { cubicEase } from './easings'
import { useContent } from './api'

gsap.registerPlugin(ScrollTrigger)

const INTRO_FALLBACK = {
  text: 'Alcove is a forward-thinking company specializing in real estate Development management of Properties and Construction services in Erbil, Kurdistan Region. With a commitment to building modern, sustainable, and innovative spaces, Alcove is shaping the future of urban living in the region.',
  accentWords: ['Development', 'Properties', 'Construction'],
  cards: [
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
  ],
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

function CardsSection() {
  const scale = useScale()
  const home = useContent('home', { intro: INTRO_FALLBACK })
  const intro = home.intro ?? INTRO_FALLBACK
  // Treat empty/blank API values as "not provided" so incomplete CMS data
  // (e.g. an unseeded intro that returns { cards: [] }) falls back to the full
  // hardcoded content instead of wiping the section and breaking its animation.
  const CARDS = intro.cards?.length ? intro.cards : INTRO_FALLBACK.cards
  const ACCENT_WORDS = new Set(
    intro.accentWords?.length ? intro.accentWords : INTRO_FALLBACK.accentWords
  )
  const HERO_TEXT = intro.text?.trim() ? intro.text : INTRO_FALLBACK.text
  // Stable, content-derived keys so the animation re-initializes (against the
  // freshly rendered DOM) whenever the CMS content changes the words or cards.
  // Identical content yields identical keys, so no needless re-runs.
  const cardsKey = CARDS.map((c) => c.title).join('|')
  const accentKey = [...ACCENT_WORDS].join('|')
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
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

  // Choreography: the word-rise entrance plays once as the section scrolls in,
  // so the description is readable the moment the user arrives. A tall outer
  // section then holds a `sticky top-0 h-screen` wrapper in place while the
  // rest — non-accent dissolve, accent words flying into the card titles,
  // lines/descriptions growing in — is scrubbed by scroll. Scrolling back
  // rewinds it; the flying words are absolutely-positioned clones inside the
  // sticky wrapper (which stays in the viewport, not the scrolling outer
  // section), so they can never be stranded over a neighboring section.
  useLayoutEffect(() => {
    const sectionEl = sectionRef.current
    const stickyEl = stickyRef.current
    const allWordEls = wordRefs.current.filter(Boolean)
    const accentEls = Object.values(accentWordMap.current).filter(Boolean)
    const nonAccentEls = allWordEls.filter((el) => !accentEls.includes(el))
    const heroEl = heroTextRef.current
    const cardsEl = cardsContainerRef.current
    const titleEls = Object.values(cardTitleRefs.current).filter(Boolean)
    const contentEls = cardContentRefs.current.filter(Boolean)
    const lineEls = cardLineRefs.current.filter(Boolean)

    if (!sectionEl || !stickyEl || !allWordEls.length) return

    let cancelled = false
    let mm = null
    let resizeTimer = null

    const teardown = () => {
      if (mm) {
        mm.revert()
        mm = null
      }
    }

    const build = () => {
      teardown()
      if (cancelled) return
      mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const clones = []

        gsap.set(allWordEls, { yPercent: 100 })
        gsap.set(cardsEl, { autoAlpha: 0 })
        gsap.set(titleEls, { opacity: 0 })
        gsap.set(contentEls, { autoAlpha: 0, y: 20 })
        gsap.set(lineEls, { scaleY: 0, transformOrigin: 'top' })

        const entrance = gsap.to(allWordEls, {
          yPercent: 0,
          duration: 2,
          ease: cubicEase,
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top bottom',
            toggleActions: 'play none none none',
          },
        })

        // Flight geometry, measured up front (fonts are loaded by now). The
        // overflow wrappers are untransformed, so their rects give the words'
        // settled positions even while the entrance still holds them shifted.
        // Offsets are relative to the sticky wrapper (where the clones live),
        // so they stay valid as it sticks — the outer section scrolls past.
        const stickyRect = stickyEl.getBoundingClientRect()
        const flights = CARDS.map((card) => {
          const accentEl = accentWordMap.current[card.title]
          const targetEl = cardTitleRefs.current[card.title]
          if (!accentEl || !targetEl) return null

          const from = accentEl.parentElement.getBoundingClientRect()
          const to = targetEl.getBoundingClientRect()
          const fromSize = parseFloat(window.getComputedStyle(accentEl).fontSize)
          const toSize = parseFloat(window.getComputedStyle(targetEl).fontSize)

          const clone = document.createElement('span')
          clone.textContent = card.title
          Object.assign(clone.style, {
            position: 'absolute',
            left: `${from.left - stickyRect.left}px`,
            top: `${from.top - stickyRect.top}px`,
            fontFamily: "'Season Mix-TRIAL', serif",
            color: 'var(--color-gold)',
            fontSize: `${fromSize}px`,
            fontWeight: '400',
            lineHeight: '120%',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            zIndex: '100',
            pointerEvents: 'none',
            willChange: 'transform',
          })
          stickyEl.appendChild(clone)
          clones.push(clone)
          // The clone lives outside the scale wrapper; mirror its scale so the
          // rendered size matches the word it replaces.
          gsap.set(clone, { scale, transformOrigin: 'top left', autoAlpha: 0 })

          return {
            accentEl,
            targetEl,
            clone,
            dx: to.left - from.left,
            dy: to.top - from.top,
            scaleTo: (toSize / fromSize) * scale,
          }
        }).filter(Boolean)

        const FLY = 0.8

        // The white words dissolve on their own clock, not the scroll's —
        // scrubbing them shows half-clipped glyphs tracking the wheel. The
        // first scroll inside the sticky range dissolves them; returning to
        // its start brings them back. Explicit to-tweens with overwrite (rather
        // than one reversed tween) because fully reversing a from/fromTo
        // reverts to pre-tween inline values — the entrance's offscreen state.
        let dissolved = false
        const setDissolved = (on) => {
          if (on === dissolved) return
          dissolved = on
          gsap.to(nonAccentEls, {
            yPercent: on ? -100 : 0,
            duration: 0.8,
            ease: cubicEase,
            overwrite: true,
          })
        }

        const tl = gsap.timeline({
          defaults: { ease: cubicEase },
          scrollTrigger: {
            // The outer section is taller than the viewport, so the sticky
            // wrapper stays put from 'top top' until 'bottom bottom' — the
            // scrub spans that travel (250vh - 100vh = 150vh desktop, 100vh
            // mobile). The section height carries the desktop/mobile split.
            trigger: sectionEl,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            // A fast scroller can reach the sticky range mid-entrance; hand the words
            // over to the scrub settled so the two tweens don't fight.
            onEnter: () => entrance.progress(1),
            onUpdate: (self) => {
              // How far into the sticky range (0..1) the user scrolls before
              // the description starts to dissolve.
              if (self.progress > 0.13) {
                // The entrance must be settled before the dissolve touches
                // the same words, or the two tweens trade renders.
                entrance.progress(1)
                setDissolved(true)
              } else {
                setDissolved(false)
              }
            },
          },
        })

        tl.set(cardsEl, { autoAlpha: 1 }, FLY)

        flights.forEach(({ accentEl, targetEl, clone, dx, dy, scaleTo }, i) => {
          const start = FLY + i * 0.08
          tl.set(accentEl, { opacity: 0 }, start)
          tl.set(clone, { autoAlpha: 1 }, start)
          tl.to(clone, { x: dx, y: dy, scale: scaleTo, duration: 1.4 }, start)
          tl.to(targetEl, { opacity: 1, duration: 0.15 }, start + 1.3)
          tl.to(clone, { autoAlpha: 0, duration: 0.15 }, start + 1.4)
        })

        // Titles with no matching accent word (CMS mismatch) still reveal.
        const flown = new Set(flights.map((f) => f.targetEl))
        const unflown = titleEls.filter((el) => !flown.has(el))
        if (unflown.length) tl.to(unflown, { opacity: 1, duration: 0.3 }, FLY + 1.3)

        tl.to(contentEls, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, FLY + 0.9)
        tl.to(lineEls, { scaleY: 1, duration: 1.4 }, FLY + 0.9)
        // Hold the finished layout for a beat of scroll before unpinning.
        tl.to({}, { duration: 0.5 })

        return () => clones.forEach((c) => c.remove())
      })

      // Reduced motion: no pin, no flight — a plain opacity handoff.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(allWordEls, { yPercent: 0 })
        gsap.set(cardsEl, { autoAlpha: 0 })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 25%',
            toggleActions: 'play none none reverse',
          },
        })
        tl.to(heroEl, { autoAlpha: 0, duration: 0.4, ease: 'none' })
        tl.to(cardsEl, { autoAlpha: 1, duration: 0.4, ease: 'none' }, '<')
      })

      // Built async (after fonts.ready), i.e. AFTER the later sections created
      // their triggers, so re-measure everything now that the clones/timeline
      // exist. The section's height is static CSS (present from first render),
      // so unlike the old pin spacer it needs no sort() to offset triggers
      // below — they already measured the tall section.
      ScrollTrigger.refresh()
    }

    // Flight geometry is measured once per build. Width changes re-run this
    // effect via `scale`; height changes move the vertically-centered cards,
    // so rebuild for those here.
    let lastHeight = window.innerHeight
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (window.innerHeight !== lastHeight) {
          lastHeight = window.innerHeight
          build()
        }
      }, 200)
    }
    window.addEventListener('resize', onResize)

    // Rect measurements are only trustworthy once the display fonts are in.
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    fontsReady.then(() => {
      if (!cancelled) build()
    })

    return () => {
      cancelled = true
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      teardown()
    }
  }, [scale, HERO_TEXT, cardsKey, accentKey])

  const words = HERO_TEXT.split(' ')

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[200vh] md:h-[250vh] bg-navy"
      aria-label="Subsidiaries"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-navy"
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
          <main className="relative h-full max-w-[1440px] mx-auto flex flex-col bg-navy px-4 pb-8 pt-[88px] text-[#d6deea] md:px-8 md:py-12">
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
              className="absolute inset-x-0 top-0 grid grid-cols-1 gap-6 md:top-1/2 md:translate-y-[calc(-50%+48px)] md:gap-0 md:grid-cols-3 mt-4 md:mt-0"
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
                    <p className=" w-[80%] pe-4 text-[14px] font-normal leading-[140%] tracking-[0] text-mist md:text-[16px] md:leading-[120%]">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </main>
        </div>
      </div>
    </section>
  )
}

export default CardsSection
