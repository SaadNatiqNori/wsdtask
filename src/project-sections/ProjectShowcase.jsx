import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cubicBezier, cubicEase } from '../easings'
import { prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

// Built-in line-art (front view) shown when a slide has no uploaded illustration.
// Stroke uses currentColor so the section's text colour drives it.
function CarIllustration({ className }) {
  return (
    <svg
      viewBox="0 0 520 340"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M170 150 Q178 96 230 92 L290 92 Q342 96 350 150" />
      <path
        d="M192 150 Q200 110 236 107 L284 107 Q320 110 328 150"
        strokeDasharray="2.5 3"
        opacity="0.55"
      />
      <path d="M70 250 Q70 175 120 165 L170 150 L350 150 L400 165 Q450 175 450 250" />
      <line x1="72" y1="206" x2="448" y2="206" opacity="0.45" />
      <path d="M92 180 Q110 176 130 183" />
      <path d="M390 183 Q410 176 428 180" />
      <g strokeDasharray="2.5 3" opacity="0.55">
        <line x1="236" y1="186" x2="236" y2="236" />
        <line x1="249" y1="186" x2="249" y2="236" />
        <line x1="262" y1="186" x2="262" y2="236" />
        <line x1="275" y1="186" x2="275" y2="236" />
        <line x1="288" y1="186" x2="288" y2="236" />
      </g>
      <path d="M170 150 L150 158" />
      <path d="M350 150 L370 158" />
      <line x1="70" y1="250" x2="450" y2="250" />
      <path d="M95 250 L95 286 Q95 293 102 293 L150 293 Q157 293 157 286 L157 250" />
      <path d="M363 250 L363 286 Q363 293 370 293 L418 293 Q425 293 425 286 L425 250" />
      <path
        d="M101 250 L101 283 Q101 288 106 288 L146 288 Q151 288 151 283 L151 250"
        strokeDasharray="2.5 3"
        opacity="0.45"
      />
      <path
        d="M369 250 L369 283 Q369 288 374 288 L414 288 Q419 288 419 283 L419 250"
        strokeDasharray="2.5 3"
        opacity="0.45"
      />
    </svg>
  )
}

// Every animatable piece sits inside its own `overflow-hidden` box, with the
// `data-anim` target as the inner content. On a slide change the inner content
// slides/fades within its own box (a masked reveal) — it never travels across
// the whole section.
function Slide({ heading, bodyLeft, bodyRight, image }) {
  return (
    <div className="w-full px-6 md:px-14">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Copy */}
        <div>
          <div className="overflow-hidden border-l border-white/40 pb-1 pl-6 md:pl-8">
            <h2
              data-anim
              className="m-0 whitespace-pre-line text-[34px] md:text-[52px] font-normal leading-[1.05] tracking-[-0.01em] text-mist"
              style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
            >
              {heading}
            </h2>
          </div>

          {(bodyLeft || bodyRight) && (
            <div className="mt-10 md:mt-14 grid max-w-[640px] grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10">
              {bodyLeft && (
                <div className="overflow-hidden">
                  <p
                    data-anim
                    className="m-0 text-[14px] md:text-[15px] leading-[1.7] tracking-[0] text-[#B7BEC9]"
                  >
                    {bodyLeft}
                  </p>
                </div>
              )}
              {bodyRight && (
                <div className="overflow-hidden">
                  <p
                    data-anim
                    className="m-0 text-[14px] md:text-[15px] leading-[1.7] tracking-[0] text-[#B7BEC9]"
                  >
                    {bodyRight}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Illustration */}
        <div className="flex justify-center overflow-hidden md:justify-end">
          <div data-anim className="w-full max-w-[520px]">
            {image ? (
              <img
                src={image}
                alt=""
                aria-hidden="true"
                className="w-full select-none"
                draggable="false"
              />
            ) : (
              <CarIllustration className="w-full text-mist" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const SHIFT = 80 // px each element travels (within its own box) on a slide change
const SHOWCASE_EASE = cubicBezier(1, 0.19, 0.76, 0.53)

// Section type: "showcase"
// Full-bleed black slider. Manual only (drag + dots). On a slide change the
// outgoing and incoming slides are rendered as two overlapping layers and
// animated in a single GSAP timeline that starts both together — so the exit and
// entry run as one continuous motion with no gap. Each element is clipped to its
// own box (masked reveal), eased with a shared cubic-bezier.
function ProjectShowcase({ slides = [] }) {
  const rootRef = useRef(null)
  const stageRef = useRef(null) // overlap container; height-locked across a swap
  const frontRef = useRef(null) // incoming layer
  const backRef = useRef(null) // outgoing layer (only mounted mid-transition)
  const drag = useRef({ x: 0, active: false })
  const dir = useRef(1) // 1 = forward (out-left / in-right), -1 = backward
  const lockH = useRef(0) // outgoing slide's height, captured before the swap
  const [current, setCurrent] = useState(0) // stable slide when idle
  const [transition, setTransition] = useState(null) // { from, to } while animating
  const count = slides.length

  // One-time scroll-in reveal for the whole section.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-showcase-reveal]', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: cubicEase,
        scrollTrigger: { trigger: rootRef.current, start: 'top 72%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Drive a slide change: outgoing elements slide out while the incoming ones
  // slide in — both tweens start at time 0 of one timeline, so there is no gap
  // between them. State resets from the timeline's onComplete.
  useLayoutEffect(() => {
    if (!transition || !frontRef.current) return
    const { to } = transition
    const reduce = prefersReducedMotion()
    const d = dir.current
    const stage = stageRef.current

    // Hold the stage at the taller of the two slides so the swap can't jump.
    if (stage) {
      stage.style.minHeight = `${Math.max(lockH.current, frontRef.current.offsetHeight)}px`
    }

    const inEls = gsap.utils.toArray('[data-anim]', frontRef.current)
    const outEls = backRef.current
      ? gsap.utils.toArray('[data-anim]', backRef.current)
      : []

    const tl = gsap.timeline({
      onComplete: () => {
        if (stage) stage.style.minHeight = ''
        setCurrent(to)
        setTransition(null)
      },
    })
    tl.to(
      outEls,
      {
        x: -SHIFT * d,
        autoAlpha: 0,
        duration: reduce ? 0 : 0.5,
        ease: SHOWCASE_EASE,
        stagger: reduce ? 0 : 0.06,
      },
      0
    )
    tl.fromTo(
      inEls,
      { x: reduce ? 0 : SHIFT * d, autoAlpha: reduce ? 1 : 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: reduce ? 0 : 0.6,
        ease: SHOWCASE_EASE,
        stagger: reduce ? 0 : 0.08,
      },
      0
    )
    return () => tl.kill()
  }, [transition])

  if (!count) return null

  const active = transition ? transition.to : current
  const shownFront = Math.max(0, Math.min(active, count - 1))

  const goTo = (i) => {
    const next = Math.min(count - 1, Math.max(0, i))
    if (transition || next === current) return
    dir.current = next > current ? 1 : -1
    lockH.current = stageRef.current ? stageRef.current.offsetHeight : 0
    setTransition({ from: current, to: next })
  }

  // Pointer drag to change slides.
  const onDown = (e) => {
    drag.current = { x: e.clientX, active: true }
  }
  const onUp = (e) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.x
    drag.current.active = false
    if (Math.abs(dx) > 60) goTo(current + (dx < 0 ? 1 : -1))
  }

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-mist"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div
        data-showcase-reveal
        className="w-full py-24 md:py-0"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        style={{ touchAction: 'pan-y', cursor: count > 1 ? 'grab' : 'default' }}
      >
        <div ref={stageRef} className="relative">
          {/* Incoming / stable layer */}
          <div ref={frontRef}>
            <Slide {...slides[shownFront]} />
          </div>
          {/* Outgoing layer — only present during a transition, overlaid on top. */}
          {transition && (
            <div ref={backRef} className="absolute inset-0" aria-hidden="true">
              <Slide {...slides[Math.max(0, Math.min(transition.from, count - 1))]} />
            </div>
          )}
        </div>
      </div>

      {/* Pagination mirrors the slide grid so the dots sit centered directly
          under the illustration column (right on desktop, centered when stacked). */}
      {count > 1 && (
        <div className="w-full px-6 md:px-14">
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            <div className="hidden md:block" aria-hidden="true" />
            <div className="flex justify-center md:justify-end">
              <div className="mt-10 flex w-full max-w-[520px] items-center justify-center gap-2.5 md:mt-14">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === active}
                    className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${i === active ? 'bg-mist' : 'bg-white/30'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProjectShowcase
