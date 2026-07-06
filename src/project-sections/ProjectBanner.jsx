import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cubicEase } from '../easings'
import { prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

// Section type: "banner"
// Full-width media block with a dark overlay (premium/moody treatment).
// `image` is a resolved URL (CMS field); renders a plain dark block if absent.
// Owns its own scroll-triggered reveal.
function ProjectBanner({
  image,
  alt = '',
  aspect = '16 / 5',
  overlay = 0.72,
}) {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current, {
        opacity: 0,
        y: 48,
        duration: 1.3,
        ease: cubicEase,
        scrollTrigger: { trigger: rootRef.current, start: 'top 88%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="px-6 md:px-10 mt-[52px] md:mt-[68px]">
      <div
        ref={rootRef}
        className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-[8px] bg-navy"
        style={{ aspectRatio: aspect }}
      >
        {image && (
          <img
            src={image}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 55%' }}
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#12151D]"
          style={{ opacity: overlay }}
        />
      </div>
    </section>
  )
}

export default ProjectBanner
