import { useLayoutEffect, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { IoArrowBack, IoArrowForward } from 'react-icons/io5'
import ContactSection from './ContactSection'
import { getProjectBySlug, PROJECTS_DATA } from './projects'
import { cubicEase } from './easings'

function ProjectPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  const titleRef = useRef(null)
  const metaRef = useRef(null)
  const descriptionRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useLayoutEffect(() => {
    if (!project) return
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

  const relatedProjects = PROJECTS_DATA.filter(
    (p) => p.slug !== project.slug
  ).slice(0, 3)

  return (
    <>
      <main className="relative min-h-screen bg-navy text-mist px-4 pt-[140px] pb-24 md:px-8 md:pt-[180px] md:pb-32">
        <div className="max-w-[1440px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-[6px] font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-[#A8B0BD] no-underline hover:text-mist"
          >
            <IoArrowBack className="text-sm" aria-hidden="true" />
            <span className="relative top-[1px]">BACK</span>
          </Link>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">
            <h1
              ref={titleRef}
              className="m-0 text-[56px] md:text-[120px] font-normal leading-[0.95] tracking-[-0.02em] text-mist"
              style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
            >
              {project.title}
            </h1>
            <p
              ref={metaRef}
              className="m-0 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-[180%] text-[#A8B0BD]"
            >
              <span className="block">{project.category}</span>
              <span className="block">{project.location}</span>
              <span className="block">
                {project.year} · {project.status}
              </span>
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-20">
            <h2
              className="m-0 text-[20px] md:text-[26px] font-normal leading-[1.2] tracking-[-0.01em] text-mist"
              style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
            >
              About the project
            </h2>
            <p
              ref={descriptionRef}
              className="m-0 text-[15px] md:text-[16px] leading-[160%] tracking-[0] text-[#A8B0BD]"
            >
              {project.description}
            </p>
          </div>

          <div className="mt-16 aspect-[16/9] w-full rounded-[6px] overflow-hidden bg-gradient-to-br from-[#252830] via-[#1f2229] to-[#161922] border border-[#FFFFFF0F] flex items-center justify-center">
            <span className="font-['Akkurat_Mono',monospace] text-[11px] uppercase tracking-[0.1em] text-[#5A6377]">
              {project.title} — visual
            </span>
          </div>

          <div className="mt-24 border-t border-[#FFFFFF14] pt-12">
            <p className="m-0 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase tracking-[0.05em] text-[#A8B0BD]">
              Other projects
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
              {relatedProjects.map((p) => (
                <Link
                  key={p.slug}
                  to={`/projects/${p.slug}`}
                  className="group flex flex-col text-inherit no-underline"
                >
                  <div className="flex justify-between items-center">
                    <h3
                      className="m-0 text-[24px] md:text-[28px] font-normal leading-[1.15] tracking-[-0.01em] text-mist"
                      style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
                    >
                      {p.title}
                    </h3>
                    <span className="inline-flex w-[34px] h-[34px] items-center justify-center rounded-full border border-mist/30 text-mist transition-colors duration-200 group-hover:border-mist">
                      <IoArrowForward className="text-[12px]" aria-hidden="true" />
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] leading-[150%] tracking-[0] text-[#9AA3B2]">
                    {p.short}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <ContactSection />
    </>
  )
}

export default ProjectPage
