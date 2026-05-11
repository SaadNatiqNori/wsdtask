import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IoArrowForward } from 'react-icons/io5'
import { cubicEase } from './easings'

gsap.registerPlugin(ScrollTrigger)

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

function HeroSustainable() {
  const scale = useScale()
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const descriptionRef = useRef(null)
  const alcoveRef = useRef(null)
  const cardRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const targets = [
        headlineRef.current,
        descriptionRef.current,
        alcoveRef.current,
        cardRef.current,
      ]

      const resetInitial = () => {
        gsap.set(
          [headlineRef.current, descriptionRef.current, cardRef.current],
          { y: 80, opacity: 0 }
        )
        gsap.set(alcoveRef.current, { y: 220, opacity: 0 })
      }

      const playIn = () => {
        resetInitial()
        gsap.to(targets, {
          y: 0,
          opacity: 1,
          duration: 1.3,
          ease: cubicEase,
          delay: 0.2,
          overwrite: 'auto',
        })
      }

      playIn()

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnterBack: playIn,
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-[#E6EBF0]"
      style={{ scrollSnapAlign: 'start' }}
      aria-label="Hero"
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
        <main className="relative h-full max-w-[1440px] mx-auto flex flex-col bg-[#E6EBF0] px-4 pb-0 pt-[88px] text-[#1C2D4F] md:px-8 md:pt-[128px]">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 md:gap-8">
            <h1
              ref={headlineRef}
              className="m-0 text-[36px] font-normal not-italic leading-[108%] tracking-[-0.01em] md:text-[58px]"
              style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
            >
              Shaping the Future
              <br />
              Of Sustainable Spaces
            </h1>

            <div className="max-w-full md:max-w-[230px] md:mr-[48px]">
              <p
                ref={descriptionRef}
                className="m-0 text-[13px] leading-[140%] tracking-[0] text-[#1C2D4F]"
              >
                Innovative real estate developments designed with sustainability in mind,
                creating lasting value and vibrant communities across the Kurdistan Region.
              </p>
            </div>
          </div>

          <div className="relative mt-auto">
            <div className="leading-none">
              <h2
                ref={alcoveRef}
                className="m-0 text-[140px] md:text-[400px] font-normal leading-[0.85] tracking-[-0.04em] text-[#1C2D4F] text-center whitespace-nowrap"
                style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
              >
                ALCOVE
              </h2>
            </div>

            <div
              ref={cardRef}
              className="absolute right-4 md:right-[48px] -top-2 md:top-[-12px] w-[180px] md:w-[230px] rounded-[8px] p-4 shadow-[0_10px_30px_rgba(28,45,79,0.12)]"
              style={{
                background:
                  'linear-gradient(135deg, #DCE2EA 0%, #C6CFDC 60%, #B7C2D1 100%)',
              }}
            >
              <div className="flex justify-between items-start">
                <p className="m-0 inline-flex items-center gap-[6px] font-['Akkurat_Mono',monospace] text-[9px] font-medium leading-none text-[#1C2D4F]">
                  <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#1C2D4F]" />
                  RECENT PROJECTS
                </p>
                <div className="w-[22px] h-[22px] rounded-full border border-[#1C2D4F66] flex items-center justify-center">
                  <IoArrowForward className="text-[10px] text-[#1C2D4F]" aria-hidden="true" />
                </div>
              </div>

              <h3
                className="m-0 mt-3 text-[28px] md:text-[32px] font-normal leading-none tracking-[-0.01em] text-[#1C2D4F]"
                style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
              >
                YouthHub
              </h3>

              <svg
                viewBox="0 0 200 70"
                className="mt-3 w-full h-auto"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <g stroke="#1C2D4F" strokeWidth="0.4" fill="none" opacity="0.75">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const y = 12 + i * 3
                    return (
                      <path
                        key={i}
                        d={`M 0 ${y} Q 50 ${y - 5} 100 ${y - 2} T 200 ${y - 4}`}
                      />
                    )
                  })}
                </g>
                <circle cx="100" cy="34" r="2.5" fill="#1C2D4F" />
                <text
                  x="100"
                  y="46"
                  textAnchor="middle"
                  fontSize="6"
                  fill="#1C2D4F"
                  fontFamily="'Akkurat_Mono', monospace"
                  fontWeight="500"
                >
                  YouthHub
                </text>
              </svg>
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}

export default HeroSustainable
