import { useLayoutEffect, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ContactSection from './ContactSection'
import avenueImage from './assets/AVENUE.jpg'
import { cubicEase } from './easings'

gsap.registerPlugin(ScrollTrigger)

const STRENGTHS = [
  {
    title: 'Construction',
    description:
      'Construction at ALCOVE is driven by precision, reliability, and attention to detail. Projects are delivered with strong execution standards, careful planning, and a clear focus on quality. The goal is not only to complete a project, but to deliver a development that performs well structurally and maintains its value over time.',
  },
  {
    title: 'Facility Management',
    description:
      'ALCOVE developments are designed to perform beyond completion. Facility Management is not treated as a separate stage but as a core part of the development process. By understanding how a project will operate after delivery, ALCOVE ensures long-term efficiency, better maintenance standards, and stronger overall performance.',
  },
  {
    title: 'Sales',
    description:
      'Sales is integrated into the development strategy from the beginning. Each project is positioned to attract the right audience and achieve strong commercial results. The focus is on understanding the market, presenting projects clearly, and ensuring that every development connects with the right buyers and tenants.',
  },
  {
    title: 'Marketing',
    description:
      'Marketing at ALCOVE is focused on building presence, visibility, and strong market positioning. Every project is supported by clear communication strategies that highlight its strengths and create long-term recognition in the market. The objective is not only promotion, but strategic positioning.',
  },
  {
    title: 'Activation',
    description:
      "ALCOVE developments are supported by activation strategies that bring projects to life. Events, experiences, and engagement initiatives are designed to strengthen visibility, attract visitors, and support tenant performance. Activation is treated as an essential part of a project's success, not an additional feature.",
  },
]

function Strength({ title, description }) {
  return (
    <div className="border-l border-[#FFFFFF1A] pl-6">
      <h3
        className="m-0 text-[26px] md:text-[34px] font-normal leading-[1.15] tracking-[-0.01em] text-gold"
        style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
      >
        {title}
      </h3>
      <p className="mt-6 text-[14px] md:text-[15px] leading-[160%] tracking-[0] text-[#A8B0BD]">
        {description}
      </p>
    </div>
  )
}

function AboutPage() {
  const goalsSectionRef = useRef(null)
  const overlayRef = useRef(null)
  const heroBadgeRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroSubtitleRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [heroBadgeRef.current, heroTitleRef.current, heroSubtitleRef.current],
        { y: 60, opacity: 0 }
      )
      gsap.to(
        [heroBadgeRef.current, heroTitleRef.current, heroSubtitleRef.current],
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
  }, [])

  return (
    <>
      <main className="bg-[#E6EBF0] text-[#1C2D4F]">
        <section className="flex flex-col items-center pt-[140px] md:pt-[180px] pb-16 md:pb-24 px-4">
          <span
            ref={heroBadgeRef}
            className="inline-flex items-center rounded-full border border-[#1C2D4F]/35 px-5 py-2 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase tracking-[0.12em] text-[#1C2D4F]"
          >
            ABOUT
          </span>
          <h1
            ref={heroTitleRef}
            className="m-0 mt-8 text-center text-[56px] md:text-[112px] font-normal leading-[0.95] tracking-[-0.02em] text-[#1C2D4F]"
            style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
          >
            Get to Know Us
          </h1>
          <p
            ref={heroSubtitleRef}
            className="m-0 mt-4 text-center text-[15px] md:text-[18px] leading-[140%] tracking-[0] max-w-[460px] text-[#1C2D4F]"
          >
            Integrated real estate development focused on sustainability, value, and community.
          </p>
        </section>

        <section
          ref={goalsSectionRef}
          className="relative h-[200vh] bg-navy"
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <img
              src={avenueImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex flex-col">
            <div className="h-screen shrink-0" />

            <div className="relative flex-1">
              <div
                ref={overlayRef}
                className="absolute left-0 right-0 bottom-0 -top-[30vh] pointer-events-none"
                style={{
                  backdropFilter: 'blur(32px) brightness(0.55)',
                  WebkitBackdropFilter: 'blur(32px) brightness(0.55)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 12%, rgba(0,0,0,1) 26%, rgba(0,0,0,1) 100%)',
                  maskImage:
                    'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 12%, rgba(0,0,0,1) 26%, rgba(0,0,0,1) 100%)',
                }}
              />

              <div className="relative px-4 pt-16 md:pt-20 pb-12 md:pb-16">
                <div className="max-w-[720px] mx-auto">
                  <span className="pointer-events-auto inline-flex items-center rounded-full border border-mist/40 px-5 py-2 font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase tracking-[0.12em] text-mist bg-transparent">
                    GOALS
                  </span>
                  <br />
                  <br />
                  <p
                    className="m-0 text-[24px] md:text-[40px] font-normal leading-[1.2] tracking-[-0.01em] text-mist"
                    style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
                  >
                    Alcove is a development company delivering integrated
                    projects across construction and sales.{' '}
                    <span className="text-[#A8B0BD]">
                      We create developments that combine strong execution,
                      commercial value, and long-term performance.
                    </span>
                  </p>
                  <p
                    className="m-0 mt-12 md:mt-16 text-[24px] md:text-[40px] font-normal leading-[1.2] tracking-[-0.01em] text-mist"
                    style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
                  >
                    Our approach is built on a clear understanding of the full
                    development cycle,{' '}
                    <span className="text-[#A8B0BD]">
                      Each project is developed with a focus on quality,
                      efficiency, and market relevance, ensuring it performs
                      both as a built environment and as a commercial asset.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#D8DDE5] py-24 md:py-32 px-4 md:px-12">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20">
            <div className="md:sticky md:top-[140px] md:self-start">
              <h2
                className="m-0 text-[26px] md:text-[34px] font-normal leading-[1.2] tracking-[-0.01em] text-[#1C2D4F]"
                style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
              >
                Why clients should
                <br />
                choose ALCOVE
              </h2>
            </div>
            <div className="space-y-12 md:space-y-16">
              <p className="m-0 text-[20px] md:text-[26px] leading-[1.4] tracking-[-0.005em] text-[#1C2D4F]">
                <span className="text-[#1C2D4F]/45">
                  ALCOVE delivers development
                </span>{' '}
                through an integrated structure combining construction, facility
                management, sales, marketing, and activation in one unified
                approach. This ensures projects are managed with clarity,
                control, and a long-term vision.
              </p>
              <p className="m-0 text-[20px] md:text-[26px] leading-[1.4] tracking-[-0.005em] text-[#1C2D4F]">
                <span className="text-[#1C2D4F]/45">
                  Projects are not treated as isolated builds,
                </span>{' '}
                but as complete commercial and operational environments. From
                early planning to post-completion, decisions are guided by
                function, market performance, and long-term value.
              </p>
              <p className="m-0 text-[20px] md:text-[26px] leading-[1.4] tracking-[-0.005em] text-[#1C2D4F]">
                <span className="text-[#1C2D4F]/45">
                  This model creates a strong advantage,
                </span>{' '}
                construction aligns with operational needs, facility management
                is considered early, and sales and marketing develop alongside
                the project. The result is a controlled, efficient, and
                commercially focused approach.
              </p>
              <p className="m-0 text-[20px] md:text-[26px] leading-[1.4] tracking-[-0.005em] text-[#1C2D4F]">
                <span className="text-[#1C2D4F]/45">
                  ALCOVE is defined not only by building projects,
                </span>{' '}
                but by understanding how they succeed after completion, shaping
                every stage of development.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-navy text-mist py-24 md:py-32 px-4 md:px-12">
          <div className="max-w-[1440px] mx-auto">
            <p className="m-0 text-[13px] md:text-[15px] tracking-[0] text-mist">
              Our Strengths
            </p>
            <h2
              className="m-0 mt-6 text-[28px] md:text-[42px] font-normal leading-[1.25] tracking-[-0.01em] text-mist max-w-[1100px]"
              style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
            >
              ALCOVE operates across the key disciplines that define successful
              developments, bringing them together in one structure to ensure
              consistency, quality, and long-term value.
            </h2>

            <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {STRENGTHS.slice(0, 3).map((s) => (
                <Strength key={s.title} {...s} />
              ))}
            </div>
            <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {STRENGTHS.slice(3, 5).map((s) => (
                <Strength key={s.title} {...s} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <ContactSection />
    </>
  )
}

export default AboutPage
