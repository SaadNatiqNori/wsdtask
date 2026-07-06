import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IoArrowForward } from 'react-icons/io5'
import logo from './assets/Logo.svg'
import avenueViz from './assets/avenuesvg.svg'
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
        <main className="relative h-full max-w-[1440px] mx-auto flex flex-col bg-[#E6EBF0] px-4 pb-[24px] pt-[88px] text-[#1C2D4F] md:px-8 md:pb-[40px] md:pt-[128px]">
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

            <div className="max-w-full md:max-w-[200px] md:mr-[114px]">
              <p
                ref={descriptionRef}
                className="m-0 text-[14px] font-normal leading-5 tracking-normal text-[#1C2D4F]"
                style={{ fontFamily: "'Season Sans-TRIAL', sans-serif" }}
              >
                Innovative real estate developments designed with sustainability in mind,
                creating lasting value and vibrant communities across the Kurdistan Region.
              </p>
            </div>
          </div>

          <div className="relative mt-auto">
            <div
              ref={alcoveRef}
              className="w-full aspect-[64/13]"
              style={{
                WebkitMaskImage: `url("${logo}")`,
                maskImage: `url("${logo}")`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                backgroundColor: '#1C2D4F',
              }}
              role="img"
              aria-label="Alcove"
            />

            <div
              ref={cardRef}
              className="absolute left-4 right-[52px] bottom-[calc(100%-16px)] max-md:[@media(max-height:700px)]:bottom-4 top-auto md:left-auto md:right-[9%] md:bottom-auto md:top-[-80px] w-auto md:w-[195px] flex flex-col gap-6 rounded-[4px] px-3 py-[17px] bg-[#13294B]/10 backdrop-blur-[50px]"
            >
              <div className="flex justify-between items-start">
               <div>
                  <p className="m-0 inline-flex items-center gap-[6px] font-['Akkurat_Mono',monospace] text-[8px] font-medium uppercase leading-none tracking-normal text-[#13294B]">
                    <span className="inline-block w-[8px] h-[8px] rounded-full bg-[#13294B]" />
                    RECENT PROJECTS
                  </p>
                  <h3
                    className="m-0 text-[20px] font-[420] leading-[115%] tracking-[-0.02em] text-[#13294B]"
                    style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
                  >
                    2nd Avenue
                  </h3>
               </div>
                <div className="w-4 h-4 relative top-1.5 gap-[5px] p-1 rounded-[35px] border-[0.5px] border-[#1C2D4F66] flex items-center justify-center shrink-0">
                  <IoArrowForward className=" text-[#1C2D4F]" aria-hidden="true" />
                </div>
              </div>

             

              <img
                src={avenueViz}
                alt=""
                aria-hidden="true"
                className="w-full h-auto"
              />
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}

export default HeroSustainable
