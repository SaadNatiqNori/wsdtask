import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from './api'

gsap.registerPlugin(ScrollTrigger)

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
      className="absolute inset-0 flex flex-col px-4 pt-[120px] pb-[40px] md:px-8 md:pt-[128px] md:pb-[48px]"
    >
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
  )
}

function MissionVisionValues() {
  const scale = useScale()
  const home = useContent('home', { mvv: MVV_FALLBACK })
  const mvv = home.mvv ?? MVV_FALLBACK
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
  const missionRef = useRef(null)
  const missionIllRef = useRef(null)
  const visionRef = useRef(null)
  const visionIllRef = useRef(null)
  const valuesRef = useRef(null)
  const valuesIllRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([visionRef.current, valuesRef.current], { yPercent: 100, opacity: 0 })
      gsap.set(
        [missionIllRef.current, visionIllRef.current, valuesIllRef.current],
        { autoAlpha: 1 }
      )

      // Mission reveal — scrubbed to the section's scroll-in (top bottom → top
      // top) so Mission's position is a pure function of scroll. This was a
      // toggleActions tween, but those callbacks don't fire on a page reload
      // that lands already scrolled into the pinned section, so Mission stayed
      // at yPercent:100 (off-screen) and the viewport went blank. Scrubbing,
      // like Vision/Values below, makes the state correct on load at any offset.
      gsap.fromTo(
        missionRef.current,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          // Same scrub smoothing and (default) ease as the Vision/Values
          // timeline below, so Mission enters at the same pace as the other
          // tabs instead of hard-locking to the snap.
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
          },
        }
      )

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      tl.to(missionIllRef.current, { autoAlpha: 0, duration: 1 }, 0)
      tl.to(visionRef.current, { yPercent: 22, opacity: 1, duration: 1 }, 0)

      tl.to(missionRef.current, { yPercent: -110, opacity: 0, duration: 1 }, 1)
      tl.to(visionRef.current, { yPercent: -12, duration: 1 }, 1)
      tl.to(visionIllRef.current, { autoAlpha: 0, duration: 1 }, 1)
      tl.to(valuesRef.current, { yPercent: 10, opacity: 1, duration: 1 }, 1)
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[300vh] bg-[#E6EBF0]"
      style={{ scrollSnapAlign: 'start' }}
      aria-label="Mission, vision, values"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#E6EBF0]"
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
              illRef={visionIllRef}
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
              illRef={valuesIllRef}
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
