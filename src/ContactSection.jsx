import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IoArrowForward } from 'react-icons/io5'
import logo from './assets/Logo.svg'
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

function ContactSection() {
  const scale = useScale()
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const buttonRef = useRef(null)
  const alcoveRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [
          titleRef.current,
          descRef.current,
          buttonRef.current,
          alcoveRef.current,
        ],
        { y: 80, opacity: 0 }
      )

      gsap.to(
        [
          titleRef.current,
          descRef.current,
          buttonRef.current,
          alcoveRef.current,
        ],
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: cubicEase,
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'restart none restart reset',
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-[#1C1F2A]"
      style={{ scrollSnapAlign: 'start' }}
      aria-label="Contact"
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
        <main className="relative h-full max-w-[1440px] mx-auto flex flex-col bg-[#1C1F2A] px-4 pb-[40px] pt-[140px] text-[#E2EAF2] md:px-8 md:pb-[64px] md:pt-[180px]">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="overflow-hidden">
              <h2
                ref={titleRef}
                className="m-0 text-[58px] md:text-[80px] font-normal leading-none tracking-[-0.01em] text-[#E2EAF2]"
                style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
              >
                Let's talk
              </h2>
            </div>

            <div className="overflow-hidden">
              <p
                ref={descRef}
                className="m-0 text-[14px] md:text-[15px] max-w-[420px] leading-[150%] text-[#A8B0BD]"
              >
                Contact us to explore how Alcove can strengthen engagement,
                adherence, and between-visit support.
              </p>
            </div>

            <div className="overflow-hidden">
              <a
                ref={buttonRef}
                href="#"
                className="inline-flex items-center gap-2 rounded-[28px] bg-[#E2EAF2] px-5 py-4 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-[#191f2f] no-underline"
              >
                <span className="relative top-[1px]">GET IN TOUCH</span>
                <IoArrowForward className="text-sm" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="relative mt-auto">
            <div
              ref={alcoveRef}
              className="w-full aspect-[64/13]"
              style={{
                WebkitMaskImage: `url(${logo})`,
                maskImage: `url(${logo})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                backgroundColor: '#ECD898',
              }}
              role="img"
              aria-label="Alcove"
            />
          </div>
        </main>
      </div>
    </section>
  )
}

export default ContactSection
