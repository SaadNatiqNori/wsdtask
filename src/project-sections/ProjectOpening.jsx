import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

// Opening screen for hero → banner layouts: a 300vh section whose sticky
// 100vh stage plays a scrubbed scale-reveal — the banner box grows upward
// from its resting size until it fills the viewport (radius → 0) while the
// building image scales up and slides to the vertical center, covering the
// hero copy on the way. The scrub is driven by the page's normal Lenis
// smooth scroll, so the reveal progresses continuously, in parallel with
// the browser scroll.
//
// On small screens or with reduced motion, renders the static composition
// (hero on top, banner pinned to the fold) with no scroll stage.
function ProjectOpening({ hero, banner }) {
  const rootRef = useRef(null)
  const heroWrapRef = useRef(null)

  const [cinematic, setCinematic] = useState(
    () => window.matchMedia('(min-width: 768px)').matches && !prefersReducedMotion()
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setCinematic(mq.matches && !prefersReducedMotion())
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useLayoutEffect(() => {
    if (!cinematic) return
    const ctx = gsap.context(() => {
      const root = rootRef.current
      const box = root.querySelector('[data-banner-box]')
      const img = root.querySelector('[data-banner-img]')
      if (!box) return
      const bannerSection = box.closest('section')

      const vw = () => window.innerWidth
      const vh = () => window.innerHeight
      // Target image size: large but still contained (art aspect from the
      // loaded file; falls back to the banner's 16/5-ish shape until then).
      const artAspect = () =>
        img && img.naturalWidth && img.naturalHeight
          ? img.naturalWidth / img.naturalHeight
          : 3.2
      const imgH = () => Math.min(vh() * 0.6, (vw() * 0.9) / artAspect())
      // Resting geometry, derived from the CSS rather than sampled from the
      // DOM: sampling would bake in mid-scrub inline values whenever a
      // ScrollTrigger refresh (resize, late image load) lands while the
      // page is part-way through the animation. Cinematic mode only runs
      // ≥768px, so the md: variants apply (px-10, mt-[68px]).
      const sidePad = 40
      const restBoxH = () => (Math.min(1200, vw() - sidePad * 2) * 5) / 16
      const midBoxH = () => vh() * 0.58

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // Choreography (timeline 0 → 1, scrubbed continuously; KF2 = 0.5 and
      // KF3 = 1). By KF2 the box is already full-bleed but only ~58% of the
      // viewport tall, so the title stays readable above its edge; by KF3
      // it owns the whole stage.
      // The box is w-full clamped by max-width; raising the clamp (rather
      // than setting an explicit width) grows it while keeping the resting
      // 1200px clamp intact when the scrub returns to 0. Every tween uses
      // fromTo with deterministic from-values (see note above).
      tl.fromTo(box, { maxWidth: 1200 }, { maxWidth: vw, duration: 0.5 }, 0)
      // Corners stay rounded through KF2; they only flatten while the box
      // takes over the full stage in the second half.
      tl.fromTo(
        box,
        { borderRadius: 8 },
        { borderRadius: 0, duration: 0.5, immediateRender: false },
        0.5
      )
      tl.fromTo(
        bannerSection,
        { paddingLeft: sidePad, paddingRight: sidePad, marginTop: 68 },
        { paddingLeft: 0, paddingRight: 0, marginTop: 0, duration: 0.5 },
        0
      )
      tl.fromTo(box, { height: restBoxH }, { height: midBoxH, duration: 0.5 }, 0)
      tl.fromTo(
        box,
        { height: midBoxH },
        { height: vh, duration: 0.5, immediateRender: false },
        0.5
      )
      // The copy never moves during the first half — the banner is an opaque
      // layer sliding over the resting description. Collapsing the hero
      // wrapper's layout footprint (its content keeps painting through the
      // collapsed box) is what lets the bottom-pinned banner rise through
      // the stage.
      const heroWrap = heroWrapRef.current
      tl.fromTo(
        heroWrap,
        { height: () => heroWrap.scrollHeight },
        { height: 0, duration: 1 },
        0
      )
      // Second half only: as the box scales to own the full screen, the
      // logo + title are pushed up with it and fade out ("fade-up" exit).
      const titleWrap = heroWrap.querySelector('[data-hero-title-wrap]')
      if (titleWrap) {
        tl.fromTo(
          titleWrap,
          { y: 0, autoAlpha: 1 },
          {
            y: () => -vh() * 0.35,
            autoAlpha: 0,
            duration: 0.5,
            immediateRender: false,
          },
          0.5
        )
      }
      // The title (and the logo above it) swell ~+8px-equivalent in parallel
      // with the banner's scale — done with a transform (GPU-composited)
      // rather than font-size, which re-rasterizes the glyphs every pixel
      // step and reads as stutter. The swell completes by KF2: during the
      // second-half push/fade they keep their size.
      const title = heroWrap.querySelector('h1')
      if (title) {
        const restSize = parseFloat(window.getComputedStyle(title).fontSize)
        const swell = (restSize + 8) / restSize
        tl.fromTo(
          title,
          { scale: 1, transformOrigin: '50% 100%' },
          { scale: swell, duration: 0.5 },
          0
        )
        const logo = heroWrap.querySelector('[data-hero-title-wrap] img')
        if (logo) {
          tl.fromTo(
            logo,
            { scale: 1, transformOrigin: '50% 100%' },
            { scale: swell, duration: 0.5 },
            0
          )
        }
        const lead = heroWrap.querySelector('p')
        if (lead) {
          tl.fromTo(
            lead,
            { scale: 1, transformOrigin: '50% 100%' },
            { scale: swell, duration: 0.5 },
            0
          )
          // The description also eases down a touch, meeting the rising
          // banner (yPercent — its plain y belongs to the entrance stagger).
          tl.fromTo(lead, { yPercent: 0 }, { yPercent: 30, duration: 0.5 }, 0)
        }
      }
      if (img) {
        // The art grows for the whole ride but stays seated on the banner's
        // bottom edge through KF2; it only lifts to the vertical center
        // during the second half, as the box takes over the full stage.
        tl.fromTo(img, { height: 250 }, { height: imgH, duration: 1 }, 0)
        tl.fromTo(
          img,
          { bottom: 0 },
          {
            bottom: () => (vh() - imgH()) / 2,
            duration: 0.5,
            immediateRender: false,
          },
          0.5
        )
      }

      // The art's natural size feeds the target math — refresh once loaded.
      if (img && !img.complete) {
        img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
      }
    }, rootRef)
    return () => ctx.revert()
  }, [cinematic])

  if (!cinematic) {
    return (
      <section className="flex min-h-screen flex-col">
        {hero}
        <div className="mt-auto">{banner}</div>
      </section>
    )
  }

  return (
    <section ref={rootRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div ref={heroWrapRef} className="overflow-visible">
          {hero}
        </div>
        <div className="mt-auto">{banner}</div>
      </div>
    </section>
  )
}

export default ProjectOpening
