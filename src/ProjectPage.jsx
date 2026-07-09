import { useLayoutEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { IoArrowBack, IoArrowForward } from 'react-icons/io5'
import ContactSection from './ContactSection'
import ProjectSections from './project-sections'
import { getProjectBySlug } from './projects'
import { useProject } from './api'
import { cubicEase } from './easings'

function ProjectPage() {
  const { slug } = useParams()
  // Live project from the CMS; the matching static entry is the fallback.
  const project = useProject(slug, getProjectBySlug(slug) ?? null)
  const titleRef = useRef(null)
  const metaRef = useRef(null)
  const descriptionRef = useRef(null)

  // Project pages scroll like every other content page: the route-default
  // Lenis 'smooth' mode (continuous smooth wheel scrolling, no section snap).
  // Scroll-driven section animations (e.g. the opening scale reveal) are
  // ScrollTrigger scrubs, which the SmoothScrollProvider keeps in sync with
  // Lenis — so they progress in parallel with the browser scroll.

  useLayoutEffect(() => {
    // Legacy template animation only — section-based projects animate themselves.
    if (!project || project.sections) return
    const ctx = gsap.context(() => {
      gsap.set(
        [titleRef.current, metaRef.current, descriptionRef.current],
        { y: 60, opacity: 0 }
      )
      gsap.to(
        [titleRef.current, metaRef.current, descriptionRef.current],
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: cubicEase,
          stagger: 0.08,
          delay: 0.2,
        }
      )
    })
    return () => ctx.revert()
  }, [slug, project])

  if (!project) {
    return (
      <main className="min-h-screen bg-navy text-mist flex flex-col items-center justify-center px-4">
        <h1
          className="text-[42px] md:text-[58px] font-normal leading-none tracking-[-0.01em]"
          style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
        >
          Project not found
        </h1>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-[28px] bg-mist px-5 py-4 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-[#191f2f] no-underline"
        >
          <IoArrowBack className="text-sm" aria-hidden="true" />
          <span className="relative top-[1px]">BACK HOME</span>
        </Link>
      </main>
    )
  }

  // Dynamic, section-driven layout (the CMS-fed path).
  if (project.sections) {
    return (
      <>
        <main
          className="min-h-screen bg-[#E6EBF0] text-[#1C1F2A]"
          style={{ fontFamily: "'Season Sans-TRIAL', sans-serif" }}
        >
          <ProjectSections sections={project.sections} project={project} />
        </main>
        {/* Closing CTA — same "Let's Talk" section the About page uses. */}
        <ContactSection />
      </>
    )
  }

  // The project exists but has no page sections yet — a creative, on-brand
  // empty state instead of a bare fallback layout.
  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-navy text-mist px-4 pt-[140px] pb-24 md:px-8 md:pt-[180px] md:pb-32">
        {/* Blueprint-grid backdrop — a nod to the architecture/construction craft. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to right, #FFFFFF0A 0, #FFFFFF0A 1px, transparent 1px, transparent 72px), repeating-linear-gradient(to bottom, #FFFFFF0A 0, #FFFFFF0A 1px, transparent 1px, transparent 72px)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 40%, #000 0%, transparent 72%)',
            maskImage:
              'radial-gradient(circle at 50% 40%, #000 0%, transparent 72%)',
          }}
        />

        <div className="relative max-w-[1000px] mx-auto">
          <Link
            to="/projects"
            className="inline-flex items-center gap-[6px] font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-[#A8B0BD] no-underline hover:text-mist"
          >
            <IoArrowBack className="text-sm" aria-hidden="true" />
            <span className="relative top-[1px]">BACK TO PROJECTS</span>
          </Link>

          <div className="mt-[10vh] md:mt-[14vh] flex flex-col items-center text-center">
            <span
              ref={metaRef}
              className="inline-flex items-center gap-2 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase tracking-[0.18em] text-gold"
            >
              <span className="inline-block w-[6px] h-[6px] rounded-full bg-gold" />
              {project.status || 'Coming soon'}
            </span>

            <h1
              ref={titleRef}
              className="m-0 mt-7 text-[44px] md:text-[88px] font-normal leading-[0.98] tracking-[-0.02em] text-mist"
              style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
            >
              Still on the
              <br />
              drawing board
            </h1>

            <p
              ref={descriptionRef}
              className="m-0 mt-7 max-w-[440px] text-[15px] md:text-[16px] leading-[165%] tracking-[0] text-[#A8B0BD]"
            >
              We haven’t published the details for{' '}
              <span className="text-mist">{project.title}</span> yet. This one’s
              still taking shape — check back soon, or explore the developments
              that are ready now.
            </p>

            <Link
              to="/projects"
              className="mt-10 inline-flex items-center gap-2 rounded-[28px] bg-mist px-6 py-4 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-[#191f2f] no-underline"
            >
              <span className="relative top-[1px]">VIEW ALL PROJECTS</span>
              <IoArrowForward className="text-sm" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
      <ContactSection />
    </>
  )
}

export default ProjectPage
