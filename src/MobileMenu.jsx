import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import arrowRight from './assets/arrow-right.svg'
import arrowDown from './assets/arrow-down.svg'
import { cubicEase } from './easings'
import { ProjectIllustration } from './PortfolioSlider'

// Horizontal, scroll-snapping strip of project cards. Native touch scroll does
// the dragging on mobile (Lenis runs syncTouch:false, so the browser owns touch
// scroll). The wrapper (-mx-6) bleeds the strip to both screen edges so cards
// scroll flush to the left and right symmetrically; the flex row's px-6 restores
// a first- and last-card inset so they align with the menu's left margin at rest
// while still scrolling clean to the edge mid-strip. The row needs w-max: without
// it the row stays scrollport-wide and the cards overflow past its right edge, so
// its right padding lands mid-strip instead of after the last card; w-max sizes
// the row to its content so the trailing inset actually follows the last card.
// scroll-pl-6 pairs with the left inset: without it, snap-mandatory/snap-start
// would snap the first card flush to the scrollport edge and eat the inset. Each
// card shows the project's cover image, or the same line-art illustration the
// home portfolio uses as a fallback.
function ProjectSlider({ projects, onNavigate }) {
  return (
    <div className="no-scrollbar snap-x snap-mandatory scroll-pl-6 overflow-x-auto pb-6">
      <div className="flex w-max gap-4 px-6">
        {projects.map((project, i) => (
          <Link
            key={`${project.slug}-${i}`}
            to={`/projects/${project.slug}`}
            onClick={onNavigate}
            className="flex w-fit shrink-0 snap-start flex-col rounded-[4px] border border-[#ffffff24] bg-transparent py-5 px-4 text-mist no-underline"
          >
            <h4
              className="m-0 text-[16px] font-normal leading-[110%] text-mist text-center"
              style={{ fontFamily: "'Season Sans-TRIAL', sans-serif" }}
            >
              {project.title}
            </h4>
            {/* <p className="mt-[12px] line-clamp-3 text-[11px] leading-[130%] text-[#E2EAF280]">
              {project.description}
            </p> */}
            <div className="mt-4 flex justify-center overflow-hidden">
              {project.coverImage ? (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  draggable={false}
                  className="h-[70px] w-auto object-contain"
                />
              ) : (
                <ProjectIllustration variant={i % 4} />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Full-screen slide-down navigation for mobile. Rendered only below md; the
// desktop navbar is untouched. Mounts on open, slides down; on close it slides
// up and then unmounts (same shouldRender pattern as the desktop dropdown).
function MobileMenu({ open, onClose, links, projects, projectsLabel, contactLabel }) {
  const panelRef = useRef(null)
  const projectsBodyRef = useRef(null)
  const [shouldRender, setShouldRender] = useState(open)
  const [projectsExpanded, setProjectsExpanded] = useState(false)

  // Mount on open; on close, slide up then unmount and reset the accordion.
  useEffect(() => {
    if (open) {
      setShouldRender(true)
      return
    }
    if (!panelRef.current) {
      setShouldRender(false)
      return
    }
    const tween = gsap.to(panelRef.current, {
      yPercent: -100,
      duration: 0.5,
      ease: cubicEase,
      onComplete: () => {
        setShouldRender(false)
        setProjectsExpanded(false)
      },
    })
    return () => tween.kill()
  }, [open])

  // Slide down on enter.
  useLayoutEffect(() => {
    if (!shouldRender || !open || !panelRef.current) return
    const tween = gsap.fromTo(
      panelRef.current,
      { yPercent: -100 },
      { yPercent: 0, duration: 0.5, ease: cubicEase }
    )
    return () => tween.kill()
  }, [shouldRender, open])

  // Lock the page behind the overlay while it is mounted.
  useEffect(() => {
    if (!shouldRender) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [shouldRender])

  // Escape closes the menu.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Smoothly expand/collapse the PROJECTS body. Measure the natural height,
  // tween from/to 0, then release to auto so it stays responsive.
  useLayoutEffect(() => {
    const el = projectsBodyRef.current
    if (!el) return
    gsap.killTweensOf(el)
    if (projectsExpanded) {
      // The wrapper carries -mr-6 so its clip box already reaches the screen
      // edge; overflow-hidden stays on throughout and only clips the growing
      // height, so the card strip's right bleed never pops in/out.
      gsap.set(el, { height: 'auto' })
      const target = el.offsetHeight
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: target,
          opacity: 1,
          duration: 0.45,
          ease: cubicEase,
          onComplete: () => gsap.set(el, { height: 'auto' }),
        }
      )
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.35, ease: cubicEase })
    }
  }, [projectsExpanded])

  if (!shouldRender) return null

  return (
    <div
      ref={panelRef}
      className="pointer-events-auto fixed inset-0 z-40 bg-navy text-mist md:hidden"
      style={{ fontFamily: "'Season Sans-TRIAL', sans-serif" }}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden px-[16px] pb-28 pt-[105px]">
        <nav aria-label="Mobile navigation" className="flex flex-col">
          {links.map((link) => (
            <div key={link.to}>
              <Link
                to={link.to}
                onClick={onClose}
                className="flex items-center justify-between py-[34px] font-['Akkurat_Mono',monospace] text-[22px] uppercase leading-none tracking-[0.02em] text-mist no-underline"
              >
                <span>{link.label}</span>
                <img src={arrowRight} alt="" className="h-[20px] w-[20px]" aria-hidden="true" />
              </Link>
              <div className="h-px w-full bg-[#FFFFFF1A]" />
            </div>
          ))}

          <div>
            <button
              type="button"
              onClick={() => setProjectsExpanded((v) => !v)}
              className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent py-[34px] font-['Akkurat_Mono',monospace] text-[22px] uppercase leading-none tracking-[0.02em] text-mist"
              aria-expanded={projectsExpanded}
            >
              <span>{projectsLabel}</span>
              <img
                src={arrowDown}
                alt=""
                className={`w-[20px] transition-transform duration-300 ${projectsExpanded ? 'rotate-180' : ''
                  }`}
                aria-hidden="true"
              />
            </button>

            <div ref={projectsBodyRef} className="-mx-6 overflow-hidden" style={{ height: 0 }}>
              <ProjectSlider projects={projects} onNavigate={onClose} />
              <Link
                to="/projects"
                onClick={onClose}
                className="mb-6 ml-6 inline-flex items-center gap-3 font-['Akkurat_Mono',monospace] text-[11px] uppercase leading-none tracking-normal text-mist no-underline"
                aria-label="See all projects"
              >
                <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border-[0.5px] border-solid border-mist">
                  <img src={arrowRight} alt="" className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="relative top-[0.5px] text-[15px]">Check all</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      <Link
        to="/contact"
        onClick={onClose}
        className="pointer-events-auto fixed bottom-[5svh] left-4 z-50 inline-flex h-[42px] w-[81px] items-center justify-center gap-[10px] rounded-[22px] bg-mist px-[10px] pb-4 pt-[20px] font-['Akkurat_Mono',monospace] text-[14px] font-medium uppercase leading-none tracking-[0] text-[#191f2f] no-underline "
      >
        {contactLabel}
      </Link>
    </div>
  )
}

export default MobileMenu
