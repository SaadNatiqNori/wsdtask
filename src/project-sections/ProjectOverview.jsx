import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cubicEase } from '../easings'
import { prefersReducedMotion } from './motion'
import logoYellow from '../assets/LogoYellow.svg'

gsap.registerPlugin(ScrollTrigger)

// Section type: "overview"
// Full-height (100vh) dark intro block: eyebrow + a large statement pinned to the
// top, then a rule with the project logo (bottom-left) and a supporting paragraph
// (bottom-right) pinned to the bottom. Owns its own reveal.
function ProjectOverview({ eyebrow = 'Project Overview', heading, body, image }) {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-ov-item]', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: cubicEase,
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: 'top 74%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="bg-[#161A24] text-mist h-screen px-6 md:px-14"
      style={{ fontFamily: "'Season Sans-TRIAL', sans-serif" }}
    >
      <div className="mx-auto flex h-full max-w-[1440px] flex-col justify-center py-20 md:py-24">
        <div className="mb-10 md:mb-14">
          <p
            data-ov-item
            className="m-0 text-[18px] md:text-[22px] font-normal leading-none tracking-[-0.04em] text-[#A8B0BD]"
          >
            {eyebrow}
          </p>

          <h2
            data-ov-item
            className="m-0 mt-6 md:mt-8 max-w-[780px] whitespace-pre-line text-[34px] md:text-[56px] font-normal leading-none tracking-[-0.04em] text-mist"
          >
            {heading}
          </h2>
        </div>

        <div>
          <div className="h-px w-full bg-white/20" />

          <div className="mt-10 md:mt-14 grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16">
            <div data-ov-item>
              <img
                src={image || logoYellow}
                alt=""
                className="h-[40px] md:h-[44px] w-auto object-contain"
                draggable="false"
              />
            </div>

            {body && (
              <p
                data-ov-item
                className="m-0 max-w-[430px] text-[15px] md:text-[18px] font-normal leading-6 tracking-[-0.04em] text-[#98A2B2] md:justify-self-end"
              >
                {body}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectOverview
