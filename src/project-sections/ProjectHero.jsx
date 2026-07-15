import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { cubicEase } from '../easings'
import { prefersReducedMotion } from './motion'
import ornamentSrc from '../assets/projectpagebreak.svg'

// Section type: "hero"
// Ornament page-break + serif title + centered lead paragraph.
// Owns its own on-mount entrance animation (above the fold, so no ScrollTrigger).
function ProjectHero({ title, description, ornament = true, project }) {
  const rootRef = useRef(null)
  // Use the project's uploaded icon (from the CMS) when set; otherwise the
  // built-in ornament page-break.
  const icon = project?.icon

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
        {/* Plain wrapper so the opening scale-reveal can drift the logo +
            title together, independently of the rest of the copy (its own
            transform channel — the children's y belongs to the entrance
            animation above). */}
        <div data-hero-title-wrap>
          {(ornament || icon) && (
            <img
              data-hero-item
              src={icon || ornamentSrc}
              alt=""
              aria-hidden="true"
              className={
                icon
                  ? 'mx-auto h-[46px] w-auto select-none object-contain'
                  : 'mx-auto h-[46px] w-[88px] select-none'
              }
              draggable="false"
            />
          )}
          <h1
            data-hero-item
            className="m-0 mt-9 text-[54px] md:text-[88px] font-normal leading-[1.15] tracking-[-0.03em] text-[#1C1F2A]"
            style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
          >
            {title}
          </h1>
        </div>
        {description && (
          <p
            data-hero-item
            className="m-0 mt-9 max-w-[631px] text-[15px] md:text-[16px] leading-[1.55] tracking-[0] text-[#5B6473]"
          >
            {description}
          </p>
        )}
      </div>
    </section>
  )
}

export default ProjectHero
