import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IoArrowBack, IoArrowForward } from 'react-icons/io5'
import { cubicEase } from '../easings'
import { prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

// Section type: "gallery"
// Dark, full-bleed centered carousel: the active slide is centred and its
// neighbours peek on either side. Controlled by prev/next buttons.
// `images: [{ src, alt }]` is a CMS-shaped list. Owns its own scroll reveal.
function ProjectGallery({
  eyebrow = 'Gallery',
  title = 'Explore the project',
  images = [],
}) {
  const rootRef = useRef(null)
  const [index, setIndex] = useState(0)
  const last = Math.max(0, images.length - 1)

  const go = (dir) =>
    setIndex((i) => Math.min(last, Math.max(0, i + dir)))

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const items = rootRef.current?.querySelectorAll('[data-gallery-item]') ?? []
      gsap.from(items, {
        opacity: 0,
        y: 44,
        duration: 1.2,
        ease: cubicEase,
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0E0E0E] text-mist py-10"
    >
      <div className="px-6 md:px-10 flex flex-col items-center text-center">
        {/* Same pill as the Contact page badge, recoloured for the dark section
            (light ink + soft light border instead of the dark-on-light ink). */}
        <span
          data-gallery-item
          className="inline-flex h-[24px] items-center justify-center gap-[10px] rounded-[31px] border-[0.5px] border-mist/40 px-[9px] pb-[7px] pt-[10px] text-center font-['Akkurat_Mono',monospace] text-[14px] font-medium uppercase leading-[1.15] tracking-[-0.28px] text-mist"
        >
          {eyebrow}
        </span>
        <h2
          data-gallery-item
          className="m-0 mt-7 text-center text-[40px] md:text-[50px] font-[420] leading-[1] tracking-[-0.04em] text-mist"
          style={{
            fontFamily: "'Season Mix VF', serif",
            textBoxTrim: 'trim-both',
            textBoxEdge: 'cap alphabetic',
          }}
        >
          {title}
        </h2>
      </div>

      {/* Centered carousel — neighbours peek; clipped at the section edges. */}
      <div data-gallery-item className="mt-10 md:mt-12 w-full overflow-hidden">
        <div
          className="flex"
          style={{
            '--slw': 'min(1120px, 64vw)',
            '--gap': '20px',
            gap: 'var(--gap)',
            transform: `translateX(calc((100% - var(--slw)) / 2 - ${index} * (var(--slw) + var(--gap))))`,
            transition: 'transform 700ms cubic-bezier(0.66, 0, 0.34, 1)',
          }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="shrink-0 overflow-hidden rounded-[6px] bg-navy"
              style={{ width: 'var(--slw)' }}
              aria-hidden={i !== index}
            >
              <img
                src={img.src}
                alt={img.alt ?? ''}
                className="block w-full h-[440px] object-cover"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div
          data-gallery-item
          className="mt-8 md:mt-10 flex items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Previous image"
            className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/25 text-mist transition-colors duration-200 hover:border-white/70 disabled:opacity-30 disabled:hover:border-white/25"
          >
            <IoArrowBack className="text-[18px]" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index === last}
            aria-label="Next image"
            className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/25 text-mist transition-colors duration-200 hover:border-white/70 disabled:opacity-30 disabled:hover:border-white/25"
          >
            <IoArrowForward className="text-[18px]" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  )
}

export default ProjectGallery
