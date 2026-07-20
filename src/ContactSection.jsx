import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ContactFooterPanel from './ContactFooterPanel'
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
        <ContactFooterPanel
          cta={cta}
          titleRef={titleRef}
          descRef={descRef}
          buttonRef={buttonRef}
          alcoveRef={alcoveRef}
        />
      </div>
    </section>
  )
}

export default ContactSection
