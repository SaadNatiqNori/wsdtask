import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { IoChevronDownOutline, IoArrowForward } from 'react-icons/io5'
import logo from './assets/Logo.svg'
import { cubicEase } from './easings'
import { PROJECTS_DATA } from './projects'

const PROJECTS = PROJECTS_DATA.slice(0, 5).map((p) => ({
  slug: p.slug,
  title: p.title,
  description: p.short,
}))

function ProjectsDropdown({ open, onClose }) {
  const panelRef = useRef(null)
  const [shouldRender, setShouldRender] = useState(open)

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
      y: -20,
      opacity: 0,
      duration: 0.45,
      ease: cubicEase,
      onComplete: () => setShouldRender(false),
    })
    return () => tween.kill()
  }, [open])

  useLayoutEffect(() => {
    if (!shouldRender || !open || !panelRef.current) return
    const tween = gsap.fromTo(
      panelRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: cubicEase }
    )
    return () => tween.kill()
  }, [shouldRender, open])

  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!shouldRender) return null

  return (
    <div
      ref={panelRef}
      className="pointer-events-auto fixed left-1/2 -translate-x-1/2 top-[80px] w-[calc(100vw-96px)] max-w-[1320px] rounded-[4px] border border-[#FFFFFF0F] bg-[#1C1F2A] px-8 py-12 md:px-14 md:py-14 text-[#E2EAF2]"
      style={{ fontFamily: "'Season Sans-TRIAL', sans-serif" }}
      role="dialog"
      aria-label="Projects portfolio"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
        <div className="flex flex-col">
          <h3
            className="m-0 text-[44px] md:text-[58px] font-normal leading-[1.02] tracking-[-0.01em] text-[#E2EAF2]"
            style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
          >
            Projects
            <br />
            Portfolio
          </h3>
          <Link
            to={`/projects/${PROJECTS[0]?.slug ?? ''}`}
            onClick={() => onClose()}
            className="mt-10 inline-flex w-fit self-start items-center justify-center rounded-full border border-[#E2EAF2]/30 text-[#E2EAF2] no-underline px-6 py-4"
            aria-label="See all projects"
          >
            <IoArrowForward className="text-[14px]" aria-hidden="true" />
          </Link>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12">
          {PROJECTS.map((project, i) => (
            <Link
              key={`${project.slug}-${i}`}
              to={`/projects/${project.slug}`}
              onClick={() => onClose()}
              className="group flex flex-col text-inherit no-underline"
            >
              <h4
                className="m-0 text-[26px] md:text-[30px] font-normal leading-[1.15] tracking-[-0.01em] text-[#E2EAF2]"
                style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
              >
                {project.title}
              </h4>
              <p className="mt-4 text-[13px] leading-[150%] tracking-[0] text-[#9AA3B2]">
                {project.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function Navbar() {
  const navbarRef = useRef(null)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const projectsTriggerRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(navbarRef.current, { y: -30, opacity: 0 })
      gsap.to(navbarRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.3,
        ease: cubicEase,
        delay: 0.2,
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!projectsOpen) return
    const handleClick = (e) => {
      const trigger = projectsTriggerRef.current
      if (trigger && trigger.contains(e.target)) return
      const panel = document.querySelector('[role="dialog"][aria-label="Projects portfolio"]')
      if (panel && panel.contains(e.target)) return
      setProjectsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [projectsOpen])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center px-4 pt-4 md:px-8 md:pt-5 pointer-events-none"
      aria-label="Site header"
    >
      <nav
        ref={navbarRef}
        className="pointer-events-auto flex h-[52px] w-full justify-between items-center gap-[5px] rounded-[4px] border border-[#FFFFFF0D] bg-[#1C1F2A] px-2 md:w-max"
        aria-label="Main navigation"
      >
        <Link to="/" className="flex items-center justify-between p-2 no-underline">
          <img src={logo} alt="Alcove" className="h-[12px] w-auto" />
        </Link>

        <ul className="ml-[0.55rem] hidden list-none items-center gap-6 p-0 md:flex relative -top-[2px]">
          <li>
            <Link
              to="/about"
              className={`inline-flex items-center whitespace-nowrap font-['Akkurat_Mono',monospace] text-[10px] font-medium leading-none no-underline transition-opacity duration-200 ${
                projectsOpen ? 'text-[#d5dee9] opacity-30' : 'text-[#d5dee9]'
              }`}
            >
              ABOUT
            </Link>
          </li>
          <li>
            <Link
              to="/subsidiaries"
              className={`inline-flex items-center whitespace-nowrap font-['Akkurat_Mono',monospace] text-[10px] font-medium leading-none no-underline transition-opacity duration-200 ${
                projectsOpen ? 'text-[#d5dee9] opacity-30' : 'text-[#d5dee9]'
              }`}
            >
              SUBSIDIARIES
            </Link>
          </li>
          <li ref={projectsTriggerRef}>
            <button
              type="button"
              onClick={() => setProjectsOpen((v) => !v)}
              className="inline-flex items-center gap-[0.3rem] whitespace-nowrap font-['Akkurat_Mono',monospace] text-[10px] font-medium leading-none text-[#d5dee9] no-underline bg-transparent border-0 p-0 cursor-pointer"
              aria-expanded={projectsOpen}
              aria-haspopup="dialog"
            >
              PROJECTS{' '}
              <IoChevronDownOutline
                className={`translate-y-[-1px] text-[0.9em] leading-none transition-transform duration-200 ${
                  projectsOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
          </li>
        </ul>

        <a
          href="#"
          className="ml-3 whitespace-nowrap rounded-[22px] bg-[#E2EAF2] px-3 py-4 font-['Akkurat_Mono',monospace] text-[10px] font-medium leading-none tracking-[0] text-[#191f2f] no-underline gap-[10px]"
        >
          <p className="font-['Akkurat_Mono',monospace] relative top-[1px]">CONTACT</p>
        </a>
      </nav>

      <ProjectsDropdown
        open={projectsOpen}
        onClose={() => setProjectsOpen(false)}
      />
    </header>
  )
}

export default Navbar
