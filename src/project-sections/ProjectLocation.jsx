import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cubicEase } from '../easings'
import { prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

// Shared transition for the accordion body + the +/× icon (same feel).
const EASE = 'cubic-bezier(0.66, 0, 0.34, 1)'
const DURATION = '650ms'
const TRANSITION = (prop) => `${prop} ${DURATION} ${EASE}`

// Section type: "location"
// Split layout: gold title · per-tab image (slides through the section
// height, fading near the endpoints) · accordion.
function ProjectLocation({ title = 'Location', items = [] }) {
  const rootRef = useRef(null)
  const [open, setOpen] = useState(0)
  const didInit = useRef(false)

  // Entrance
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-loc-item]', {
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: cubicEase,
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Centre image: the active image rests at y:0; the others wait far above /
  // below — travelling across the whole section height — and fade only as they
  // approach the hide point (delayed fade-out) or the show point (fade-in).
  useLayoutEffect(() => {
    const slides = gsap.utils.toArray('[data-loc-slide]', rootRef.current)
    if (!slides.length) return
    const reduce = prefersReducedMotion()
    const travel = (typeof window !== 'undefined' ? window.innerHeight : 900) * 0.6
    slides.forEach((el, i) => {
      const y = (i - open) * travel
      const opacity = i === open ? 1 : 0
      if (reduce || !didInit.current) {
        gsap.set(el, { y, opacity })
      } else {
        gsap.killTweensOf(el)
        gsap.to(el, { y, duration: 0.9, ease: cubicEase })
        // Symmetric fade: the outgoing image fades out as it leaves and the
        // incoming one fades in as it arrives (same delayed feel), so it no
        // longer pops in suddenly while still low in the section.
        gsap.to(el, {
          opacity,
          duration: 0.5,
          delay: 0.3,
          ease: 'power2.out',
        })
      }
    })
    didInit.current = true
  }, [open])

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#161A24] text-mist"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="mx-auto flex w-full max-w-[1720px] flex-col items-center gap-16 px-6 py-24 md:flex-row md:justify-between md:gap-10 md:px-16 md:py-0">
        {/* Title */}
        <h2
          data-loc-item
          className="m-0 shrink-0 text-[40px] md:text-[52px] font-normal leading-[1] tracking-[-0.01em] text-[#ECD898]"
          style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
        >
          {title}
        </h2>

        {/* Centre image stage — not clipped here, so images can travel into the
            section's empty space above/below (the section itself clips). */}
        <div
          data-loc-item
          className="relative aspect-[4/5] w-[300px] shrink-0 md:w-[360px] 2xl:w-[440px]"
          aria-hidden="true"
        >
          {items.map((item, i) => (
            <div
              key={i}
              data-loc-slide
              className="absolute inset-0 overflow-hidden rounded-[10px] bg-navy will-change-transform"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  draggable="false"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: item.imagePosition ?? 'center' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Accordion */}
        <div className="w-full shrink-0 border-t border-white/12 md:w-[440px] 2xl:w-[560px]">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.label} data-loc-item className="border-b border-white/12">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-[22px] md:text-[26px] font-normal leading-tight text-[#E8ECF1]">
                    {item.label}
                  </span>
                  {/* Plus that rotates 45° into a cross — same transition as the tab */}
                  <span
                    className="relative block h-4 w-4 shrink-0 text-white/60"
                    style={{
                      transform: `rotate(${isOpen ? 45 : 0}deg)`,
                      transition: TRANSITION('transform'),
                    }}
                  >
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-current" />
                  </span>
                </button>
                <div
                  className="grid"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: TRANSITION('grid-template-rows'),
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="m-0 max-w-[420px] pb-7 text-[14px] md:text-[15px] leading-[1.6] text-[#98A2B2]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProjectLocation
