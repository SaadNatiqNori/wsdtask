import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cubicEase } from '../easings'
import { prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

// Section type: "statement"
// Large display paragraph where key phrases are emphasised. Copy is supplied
// as `segments: [{ text, emphasis? }]` (CMS-friendly rich-text marks) so the
// dim/emphasis colouring is data-driven, not hard-coded per project.
// Owns its own scroll-triggered fade-up.
function ProjectStatement({ segments = [] }) {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.3,
        ease: cubicEase,
        scrollTrigger: { trigger: rootRef.current, start: 'top 82%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="px-6 md:px-10 mt-[130px] md:mt-[200px] pb-[120px] md:pb-[180px]">
      <p
        ref={rootRef}
        className="m-0 max-w-[1040px] text-[32px] md:text-[60px] font-[420] leading-[1.15] tracking-[-0.02em] text-[#AAB2C0]"
        style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
      >
        {segments.map((seg, i) => (
          <span
            key={i}
            className={seg.emphasis ? 'text-[#1C1F2A]' : undefined}
            style={{ fontFamily: 'inherit' }}
          >
            {seg.text}
          </span>
        ))}
      </p>
    </section>
  )
}

export default ProjectStatement
