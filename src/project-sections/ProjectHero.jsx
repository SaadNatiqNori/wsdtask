import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { cubicEase } from '../easings'
import { prefersReducedMotion } from './motion'
import ornamentSrc from '../assets/projectpagebreak.svg'

// Section type: "hero"
// Ornament page-break + serif title + centered lead paragraph.
// Owns its own on-mount entrance animation (above the fold, so no ScrollTrigger).
function ProjectHero({ title, description, ornament = true }) {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const items = rootRef.current?.querySelectorAll('[data-hero-item]') ?? []
      gsap.set(items, { y: 40, opacity: 0 })
      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: cubicEase,
        stagger: 0.12,
        delay: 0.15,
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="px-6 md:px-10 pt-[150px] md:pt-[188px]"
      aria-label={title}
    >
      <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
        {ornament && (
          <img
            data-hero-item
            src={ornamentSrc}
            alt=""
            aria-hidden="true"
            className="h-[46px] w-[88px] select-none"
            draggable="false"
          />
        )}
        <h1
          data-hero-item
          className="m-0 mt-9 text-[54px] md:text-[84px] font-normal leading-[0.98] tracking-[-0.02em] text-[#1C1F2A]"
          style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
        >
          {title}
        </h1>
        {description && (
          <p
            data-hero-item
            className="m-0 mt-7 max-w-[640px] text-[15px] md:text-[16px] leading-[1.55] tracking-[0] text-[#5B6473]"
          >
            {description}
          </p>
        )}
      </div>
    </section>
  )
}

export default ProjectHero
