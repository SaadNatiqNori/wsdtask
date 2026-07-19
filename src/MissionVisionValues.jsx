import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'
import { useContent } from './api'
import { useLenis } from './SmoothScroll'

gsap.registerPlugin(ScrollTrigger, Observer)

const MVV_FALLBACK = {
  mission: {
    title: 'Mission',
    body: 'To deliver high-quality, sustainable, and innovative real estate solutions that meet the evolving needs of our clients and communities. We aim to create enduring value by integrating excellence in design, construction, and property management, while fostering lasting relationships with stakeholders.',
  },
  vision: {
    title: 'Vision',
    body: "To be a leading force in the real estate and construction industry in the Kurdistan Region and beyond, recognized for our commitment to quality, sustainability, and community-driven development. We envision creating spaces that not only meet today's needs but also stand the test of time, contributing to the region's growth and prosperity.",
  },
  values: {
    title: 'Values',
    intro: 'At Alcove, we are guided by:',
    items: [
      { term: 'Excellence', description: 'Delivering premium quality in every detail.' },
      { term: 'Innovation', description: 'Embracing creativity and modern solutions.' },
      { term: 'Integrity', description: 'Building trust through transparency and professionalism.' },
    ],
  },
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

function MissionIllustration() {
  const stroke = '#1C2D4F'
  return (
    <svg viewBox="0 0 360 380" className="w-[280px] h-[300px]" aria-hidden="true">
      <g stroke={stroke} strokeWidth="0.6" fill="none" strokeDasharray="2 4" opacity="0.55">
        <line x1="40" y1="20" x2="40" y2="360" />
        <line x1="320" y1="20" x2="320" y2="360" />
        <line x1="20" y1="40" x2="340" y2="40" />
        <line x1="20" y1="350" x2="340" y2="350" />
      </g>
      <g stroke={stroke} strokeWidth="0.7" fill="none" strokeDasharray="2 3">
        <circle cx="180" cy="335" r="14" />
        <circle cx="180" cy="305" r="44" />
        <circle cx="180" cy="240" r="110" />
        <circle cx="180" cy="180" r="170" />
      </g>
      <g fill={stroke} fontSize="8" fontFamily="'Akkurat Mono', monospace">
        <text x="172" y="338">01</text>
        <text x="170" y="276">02</text>
        <text x="171" y="171">03</text>
        <text x="171" y="55">04</text>
      </g>
    </svg>
  )
}

function VisionIllustration() {
  const stroke = '#1C2D4F'
  return (
    <svg viewBox="0 0 540 280" className="w-[480px] h-[240px]" aria-hidden="true">
      <g stroke={stroke} strokeWidth="0.7" fill="none" strokeDasharray="2 3" opacity="0.85">
        <path d="M 40 140 Q 270 30 500 140 Q 270 250 40 140 Z" />
        <ellipse cx="270" cy="140" rx="180" ry="80" />
        <ellipse cx="270" cy="140" rx="120" ry="55" />
        <ellipse cx="270" cy="140" rx="60" ry="30" />
        <ellipse cx="270" cy="140" rx="18" ry="11" />
      </g>
      <g stroke={stroke} strokeWidth="0.5" fill="none" strokeDasharray="3 4" opacity="0.5">
        <line x1="270" y1="140" x2="520" y2="140" />
        <line x1="270" y1="140" x2="500" y2="40" />
        <line x1="270" y1="140" x2="500" y2="240" />
      </g>
      <g fill={stroke} fontSize="8" fontFamily="'Akkurat Mono', monospace">
        <text x="278" y="143">01</text>
        <text x="332" y="143">02</text>
        <text x="392" y="143">03</text>
      </g>
    </svg>
  )
}

function ValuesIllustration() {
  const stroke = '#1C2D4F'
  const centers = [180, 240, 300, 360, 420]
  return (
    <svg viewBox="0 0 600 400" className="w-[480px] h-[320px]" aria-hidden="true">
      <g stroke={stroke} strokeWidth="0.6" fill="none" strokeDasharray="2 3" opacity="0.7">
        {centers.map((cx, i) => (
          <circle key={i} cx={cx} cy="200" r="100" />
        ))}
      </g>
      <g stroke={stroke} strokeWidth="0.5" opacity="0.5">
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2
          const x1 = 300 + Math.cos(angle) * 130
          const y1 = 200 + Math.sin(angle) * 130
          const x2 = 300 + Math.cos(angle) * 150
          const y2 = 200 + Math.sin(angle) * 150
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </g>
      <g stroke={stroke} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.5">
        <line x1="300" y1="100" x2="300" y2="300" />
        <line x1="200" y1="200" x2="400" y2="200" />
      </g>
      <g fill={stroke} fontSize="8" fontFamily="'Akkurat Mono', monospace" textAnchor="middle">
        <text x={centers[0]} y="204">01</text>
        <text x={centers[1]} y="204">02</text>
        <text x={centers[2]} y="204">03</text>
        <text x={centers[3]} y="204">04</text>
        <text x={centers[4]} y="204">05</text>
      </g>
      <g stroke={stroke} strokeWidth="0.4" strokeDasharray="2 2" opacity="0.5">
        <line x1={centers[0] + 12} y1="200" x2={centers[1] - 12} y2="200" />
        <line x1={centers[1] + 12} y1="200" x2={centers[2] - 12} y2="200" />
        <line x1={centers[2] + 12} y1="200" x2={centers[3] - 12} y2="200" />
        <line x1={centers[3] + 12} y1="200" x2={centers[4] - 12} y2="200" />
      </g>
    </svg>
  )
}

function ValuesContent({ intro, items }) {
  return (
    <div className="text-[14px] leading-[150%] tracking-[0] max-w-[520px] text-[#1C2D4F]">
      <p className="m-0">{intro}</p>
      <ul className="mt-3 list-none p-0 m-0 space-y-1">
        {items.map((item) => (
          <li key={item.term} className="flex items-baseline gap-2">
            <span className="inline-block w-[5px] h-[5px] rounded-full bg-[#1C2D4F] translate-y-[-2px]" />
            <span>
              <strong className="font-semibold">{item.term}</strong> – {item.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Card({ refProp, illRef, title, description, isValues, values, illustration }) {
  return (
    <div
      ref={refProp}
      className="absolute inset-0 flex flex-col px-4 pt-[120px] md:px-8 md:pt-[128px]"
    >
      {/* Opaque only from the hairline down: when this card slides in as a
          tab, it covers the previous card's illustration while the previous
          header stays readable above the line. */}
      <div className="flex-1 flex flex-col bg-[#E6EBF0] -mx-4 px-4 pb-[40px] md:-mx-8 md:px-8 md:pb-[48px]">
        <div className="w-full h-[1px] bg-[#1C2D4F]/30" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[460px_1fr] gap-6 md:gap-16">
          <h3
            className="m-0 text-[42px] md:text-[58px] font-normal leading-none tracking-[-0.01em]"
            style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
          >
            {title}
          </h3>
          <div>
            {isValues ? (
              <ValuesContent intro={values.intro} items={values.items} />
            ) : (
              <p className="m-0 text-[14px] leading-[150%] tracking-[0] max-w-[520px] text-[#1C2D4F]">
                {description}
              </p>
            )}
            <div ref={illRef} className="mt-10">
              {illustration}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MissionVisionValues() {
  const scale = useScale()
  const lenis = useLenis()
  const home = useContent('home', { mvv: MVV_FALLBACK })
  const mvv = home.mvv ?? MVV_FALLBACK
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
  const missionRef = useRef(null)
  const missionIllRef = useRef(null)
  const visionRef = useRef(null)
  const valuesRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const mission = missionRef.current
    const vision = visionRef.current
    const values = valuesRef.current
    const ill = missionIllRef.current

    // Discrete snapshot per tab index, reusing the docked positions the old
    // scrubbed choreography landed on. Each entry is a self-contained state, so
    // stepping forward or back is just "tween every card to STATES[i]" — no
    // scrub, no intermediate reveal. `ill` = Mission's illustration visibility:
    // shown only on Mission, covered by the arriving tab thereafter.
    const STATES = [
      { m: 0, v: 100, va: 100, ill: true }, // Mission
      { m: -6, v: 12, va: 100, ill: false }, // Vision docked under Mission
      { m: -110, v: -8, va: 10, ill: false }, // Values docked, Mission gone
    ]
    const LAST = STATES.length - 1
    const DUR = 1.2 // lock window: input is ignored until a step finishes

    let index = 0
    let animating = false
    let armedBelow = false // exited downward into Contact, waiting to re-enter
    let releasing = false // mid exit-jump; suppress spurious re-engagement
    let onLenisScroll = null // Lenis 'scroll' handler, detached on cleanup

    const setInstant = (i) => {
      const s = STATES[i]
      gsap.set(mission, { yPercent: s.m })
      gsap.set(vision, { yPercent: s.v })
      gsap.set(values, { yPercent: s.va })
      gsap.set(ill, { autoAlpha: s.ill ? 1 : 0 })
      index = i
    }

    const animateTo = (i) => {
      const s = STATES[i]
      animating = true
      index = i
      const tl = gsap.timeline({
        defaults: { duration: DUR, ease: 'power2.inOut' },
        onComplete: () => {
          animating = false
        },
      })
      tl.to(mission, { yPercent: s.m }, 0)
      tl.to(vision, { yPercent: s.v }, 0)
      tl.to(values, { yPercent: s.va }, 0)
      // Reveal the illustration up front (so it's present as the covering tab
      // leaves); hide it only once the covering tab has fully docked over it.
      if (s.ill) tl.set(ill, { autoAlpha: 1 }, 0)
      else tl.set(ill, { autoAlpha: 0 }, DUR)
    }

    const ctx = gsap.context(() => {
      setInstant(0)

      // While pinned, the Observer swallows native scroll and turns each wheel
      // notch / swipe into exactly one step. wheelSpeed:-1 makes a natural
      // downward scroll (and an upward swipe) map to onUp = advance.
      const observer = Observer.create({
        target: window,
        type: 'wheel,touch',
        wheelSpeed: -1,
        tolerance: 10,
        preventDefault: true,
        onUp: () => tryStep(1),
        onDown: () => tryStep(-1),
      })
      observer.disable()

      let st // the pin ScrollTrigger, assigned below

      const scrollTo = (y) => {
        if (lenis) {
          lenis.start()
          lenis.scrollTo(y, { immediate: true })
        } else {
          window.scrollTo(0, y)
        }
      }

      // Hand the page back to Lenis at the ends.
      //  - Down (to the footer): a real smooth glide, like normal page scroll.
      //  - Up (back toward the hero): an instant jump clear of the pin, so the
      //    eye never travels back through the card's empty lower half (that
      //    slide is what read as the entrance "replaying").
      // The upward jump crosses the whole pin range; `releasing` suppresses the
      // spurious onEnterBack it would otherwise fire until the jump settles.
      const release = (dir) => {
        observer.disable()
        const vh = window.innerHeight
        armedBelow = false
        releasing = true
        setTimeout(() => {
          releasing = false
        }, 80)
        if (!lenis) {
          window.scrollTo(0, dir < 0 ? st.start - vh : st.end + vh)
          if (dir > 0) armedBelow = true
          return
        }
        lenis.start()
        if (dir < 0) {
          lenis.scrollTo(st.start - vh, { immediate: true })
        } else {
          // Glide down to Contact, then arm the re-entry watcher (arming only
          // after arrival avoids a settle-jitter snapping us back mid-glide).
          lenis.scrollTo(st.end + vh, {
            duration: 1,
            onComplete: () => {
              armedBelow = true
            },
          })
        }
      }

      const tryStep = (dir) => {
        if (animating) return
        const next = index + dir
        if (next < 0) return release(-1)
        if (next > LAST) return release(1)
        animateTo(next)
      }

      // Freeze Lenis so the page can't scroll past the pin while the Observer
      // owns the wheel; the stepper alone advances the tabs from here.
      const engage = (fromTop) => {
        if (releasing || observer.isEnabled) return
        armedBelow = false
        if (lenis) lenis.stop()
        setInstant(fromTop ? 0 : LAST)
        observer.enable()
      }

      // Pin the tab stack (position:fixed via ScrollTrigger, with a spacer) for
      // one viewport of travel. Stepping is jacked, so this range is never
      // actually scrolled through — it just holds the cards fixed with no dead
      // zone, and hands engagement off based on entry direction.
      st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => '+=' + window.innerHeight,
        pin: true,
        pinSpacing: true,
        onEnter: () => engage(true),
        onEnterBack: () => engage(false),
        onLeave: () => observer.disable(),
        onLeaveBack: () => observer.disable(),
      })

      // Re-entry from below: after exiting downward we sit at Contact (the last
      // section, so the only way out is up). The instant the user scrolls up,
      // snap straight to the docked last tab and re-lock — the section never
      // slides its empty lower half into view before the content arrives. A pin
      // ScrollTrigger can't catch this cleanly (the immediate jump-out never
      // registers an enter to leave back from), so we watch Lenis directly.
      if (lenis) {
        onLenisScroll = () => {
          if (!armedBelow) return
          // Only react to genuine upward intent, not the easing of the
          // downward exit jump that armed us in the first place.
          if (lenis.direction !== -1) return
          if (window.scrollY < st.end + window.innerHeight - 2) {
            armedBelow = false
            scrollTo(st.end)
            engage(false)
          }
        }
        lenis.on('scroll', onLenisScroll)
      }
    })

    return () => {
      ctx.revert()
      if (lenis && onLenisScroll) lenis.off('scroll', onLenisScroll)
      // Never leave the page frozen if we tear down mid-engagement.
      if (lenis) lenis.start()
    }
  }, [lenis])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#E6EBF0]"
      aria-label="Mission, vision, values"
    >
      <div
        ref={stickyRef}
        className="h-screen w-full overflow-hidden bg-[#E6EBF0]"
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
          <div className="relative h-full max-w-[1440px] mx-auto text-[#1C2D4F]">
            <Card
              refProp={missionRef}
              illRef={missionIllRef}
              title={mvv.mission.title}
              description={mvv.mission.body}
              illustration={
                mvv.mission.image ? (
                  <img src={mvv.mission.image} alt="" className="w-full max-w-[313px] h-auto" />
                ) : (
                  <MissionIllustration />
                )
              }
            />
            <Card
              refProp={visionRef}
              title={mvv.vision.title}
              description={mvv.vision.body}
              illustration={
                mvv.vision.image ? (
                  <img src={mvv.vision.image} alt="" className="w-full max-w-[313px] h-auto" />
                ) : (
                  <VisionIllustration />
                )
              }
            />
            <Card
              refProp={valuesRef}
              title={mvv.values.title}
              isValues
              values={mvv.values}
              illustration={
                mvv.values.image ? (
                  <img src={mvv.values.image} alt="" className="w-full max-w-[313px] h-auto" />
                ) : (
                  <ValuesIllustration />
                )
              }
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MissionVisionValues
