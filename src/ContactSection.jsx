import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ArrowIcon from './ArrowIcon'
import logo from './assets/Logo.svg'
import { cubicEase } from './easings'
import { useContent } from './api'

gsap.registerPlugin(ScrollTrigger)

const CTA_FALLBACK = {
  title: "Let's talk",
  description:
    'Contact us to explore how Alcove can strengthen engagement, adherence, and between-visit support.',
  buttonLabel: 'GET IN TOUCH',
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

function ContactSection() {
  const scale = useScale()
  const footer = useContent('footer', { cta: CTA_FALLBACK })
  const cta = footer.cta ?? CTA_FALLBACK
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
      className="relative w-full h-screen overflow-hidden bg-navy"
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
        <main className="relative h-full max-w-[1440px] mx-auto flex flex-col bg-navy px-4 pb-[31px] pt-[150px] text-mist md:px-8">
          <div className="flex flex-col items-center text-center gap-[37px]">
            <div className="overflow-hidden">
              <h2
                ref={titleRef}
                className="m-0 text-[47px] font-[420] leading-[100%] tracking-[-0.04em] text-mist"
                style={{
                  fontFamily: "'Season Mix VF', serif",
                  // Figma spec: leading-trim CAP_HEIGHT — without it the 47px
                  // line box breaks the section's fixed vertical rhythm.
                  textBox: 'trim-both cap alphabetic',
                }}
              >
                {cta.title}
              </h2>
            </div>

            <div className="overflow-hidden">
              <p
                ref={descRef}
                className="m-0 max-w-[356px] text-[16px] leading-[100%] text-mist"
              >
                {cta.description}
              </p>
            </div>

            <div className="overflow-hidden">
              <Link
                ref={buttonRef}
                to="/contact"
                className="group inline-flex h-[46px] items-center gap-[5px] rounded-[48px] border border-mist bg-mist px-[14px] font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-navy no-underline transition-colors duration-300 ease-out hover:bg-navy hover:text-mist"
              >
                <span className="relative top-[0px]">{cta.buttonLabel}</span>
                <ArrowIcon
                  size={14}
                  className="transition-transform duration-300 ease-out group-hover:translate-x-[3px]"
                />
              </Link>
            </div>
          </div>

          <div className="relative mt-auto pt-[161px]">
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
                backgroundColor: 'var(--color-gold)',
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
