import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { IoChevronDownOutline } from 'react-icons/io5'
import logo from './assets/Logo.svg'
import arrowRight from './assets/arrow-right.svg'
import { cubicEase } from './easings'
import { PROJECTS_DATA } from './projects'
import { useProjects, useContent } from './api'

const NAVBAR_FALLBACK = {
  links: [
    { label: 'ABOUT', to: '/about' },
    { label: 'SUBSIDIARIES', to: '/subsidiaries' },
  ],
  projectsLabel: 'PROJECTS',
  contactLabel: 'CONTACT',
  dropdownHeading: ['Projects', 'Portfolio'],
}

function ProjectsDropdown({ open, onClose, projects, heading, onMouseEnter, onMouseLeave }) {
  const panelRef = useRef(null)
  const [shouldRender, setShouldRender] = useState(open)
  const [hoveredItem, setHoveredItem] = useState(null)

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
      className="pointer-events-auto fixed left-1/2 -translate-x-1/2 top-[86px] w-[932px] max-w-[calc(100vw-48px)] rounded-[4px] border border-[#FFFFFF0F] bg-navy px-[45px] py-[55px] text-mist"
      style={{ fontFamily: "'Season Sans-TRIAL', sans-serif" }}
      role="dialog"
      aria-label="Projects portfolio"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col md:flex-row gap-[58px]">
        <div className="flex shrink-0 flex-col">
          <h3
            className="m-0 text-[27px] leading-[100%] tracking-[-0.02em] text-mist"
            style={{ fontFamily: "'Season Mix VF', serif", fontWeight: 420 }}
          >
            {heading[0]}
            <br />
            {heading[1]}
          </h3>
          <Link
            to="/projects"
            onClick={() => onClose()}
            className="mt-[18px] inline-flex h-[28px] w-[32px] shrink-0 self-start items-center justify-center rounded-[48px] border-[0.25px] border-solid border-mist/30 text-mist no-underline"
            aria-label="See all projects"
          >
            <img src={arrowRight} alt="" className="h-[10px] w-[10px]" aria-hidden="true" />
          </Link>
        </div>

        <div
          className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-[44px]"
          onMouseLeave={() => setHoveredItem(null)}
        >
          {projects.map((project, i) => (
            <Link
              key={`${project.slug}-${i}`}
              to={`/projects/${project.slug}`}
              onClick={() => onClose()}
              onMouseEnter={() => setHoveredItem(i)}
              className={`group flex flex-col text-inherit no-underline transition-opacity duration-200 ${
                hoveredItem !== null && hoveredItem !== i ? 'opacity-30' : ''
              }`}
            >
              <h4
                className="m-0 text-[16px] font-normal leading-[100%] tracking-[0] text-mist"
                style={{ fontFamily: "'Season Sans-TRIAL', sans-serif" }}
              >
                {project.title}
              </h4>
              <p className="mt-[15px] text-[10px] leading-[120%] tracking-[0] text-[#E2EAF280]">
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
  const [hoveredLink, setHoveredLink] = useState(null)
  const projectsTriggerRef = useRef(null)
  const closeTimerRef = useRef(null)

  const openProjects = () => {
    clearTimeout(closeTimerRef.current)
    setProjectsOpen(true)
  }
  // Delay closing so the pointer can cross the gap between the navbar and the panel.
  const scheduleCloseProjects = () => {
    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => setProjectsOpen(false), 180)
  }

  useEffect(() => () => clearTimeout(closeTimerRef.current), [])

  // An item stays full color while hovered (or while its dropdown is open); the rest mute.
  const isMuted = (key) =>
    hoveredLink ? hoveredLink !== key : projectsOpen && key !== 'projects'

  const allProjects = useProjects(PROJECTS_DATA)
  const nav = useContent('navbar', NAVBAR_FALLBACK)
  // The dropdown mirrors the home portfolio: the featured projects (fall back to
  // all so it's never empty).
  const featured = allProjects.filter((p) => p.featured)
  const dropdownProjects = (featured.length ? featured : allProjects)
    .slice(0, 6)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.short,
    }))

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
        className="pointer-events-auto flex min-w-[420px] h-[55px] w-full justify-between items-center gap-[5px] rounded-[4px] border border-[#FFFFFF0D] bg-navy p-2 md:w-max"
        aria-label="Main navigation"
      >
        <Link to="/" className="flex h-9 items-center justify-between p-2 no-underline">
          <img src={logo} alt="Alcove" className="h-[12px] w-auto" />
        </Link>

        <ul className="hidden list-none items-center gap-[5px] p-0 m-0 md:flex">
          {nav.links.map((link) => (
            <li
              key={link.to}
              onMouseEnter={() => setHoveredLink(link.to)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <Link
                to={link.to}
                className={`inline-flex h-[39px] items-center whitespace-nowrap rounded-[3px] px-3 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-[#d5dee9] no-underline transition-opacity duration-200 ${
                  isMuted(link.to) ? 'opacity-30' : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li
            ref={projectsTriggerRef}
            onMouseEnter={() => {
              setHoveredLink('projects')
              openProjects()
            }}
            onMouseLeave={() => {
              setHoveredLink(null)
              scheduleCloseProjects()
            }}
          >
            <button
              type="button"
              onClick={() => setProjectsOpen((v) => !v)}
              className={`inline-flex h-[39px] items-center gap-[5px] whitespace-nowrap rounded-[3px] px-3 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-[#d5dee9] no-underline bg-transparent border-0 cursor-pointer transition-opacity duration-200 ${
                isMuted('projects') ? 'opacity-30' : ''
              }`}
              aria-expanded={projectsOpen}
              aria-haspopup="dialog"
            >
              {nav.projectsLabel}{' '}
              <IoChevronDownOutline
                className={`translate-y-[-1px] text-[0.9em] leading-none transition-transform duration-200 ${
                  projectsOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
          </li>
        </ul>

        <Link
          to="/contact"
          onMouseEnter={() => setHoveredLink('contact')}
          onMouseLeave={() => setHoveredLink(null)}
          className="inline-flex h-9 items-center whitespace-nowrap rounded-[22px] border border-transparent bg-mist px-[10px] font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none tracking-[0] text-[#191f2f] no-underline gap-[10px] transition-colors duration-300 ease-out hover:bg-transparent hover:border-mist hover:text-mist"
        >
          <p className="m-0 font-['Akkurat_Mono',monospace] relative top-[1px]">{nav.contactLabel}</p>
        </Link>
      </nav>

      <ProjectsDropdown
        open={projectsOpen}
        onClose={() => setProjectsOpen(false)}
        projects={dropdownProjects}
        heading={nav.dropdownHeading}
        onMouseEnter={openProjects}
        onMouseLeave={scheduleCloseProjects}
      />
    </header>
  )
}

export default Navbar
