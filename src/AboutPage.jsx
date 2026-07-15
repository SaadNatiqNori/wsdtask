import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ContactSection from './ContactSection'
import avenueImage from './assets/AVENUE.jpg'
import { cubicEase } from './easings'
import { useContent } from './api'

gsap.registerPlugin(ScrollTrigger)

const ABOUT_FALLBACK = {
  hero: {
    badge: 'ABOUT',
    title: 'Get to Know Us',
    subtitle: 'Integrated real estate development focused on sustainability, value, and community.',
  },
  goals: {
    badge: 'GOALS',
    paragraphs: [
      { lead: 'Alcove is a development company delivering integrated projects across construction and sales.', muted: 'We create developments that combine strong execution, commercial value, and long-term performance.' },
      { lead: 'Our approach is built on a clear understanding of the full development cycle,', muted: 'Each project is developed with a focus on quality, efficiency, and market relevance, ensuring it performs both as a built environment and as a commercial asset.' },
    ],
  },
  why: {
    title: ['Why clients should', 'choose ALCOVE'],
    paragraphs: [
      { muted: 'ALCOVE delivers development', rest: 'through an integrated structure combining construction, facility management, sales, marketing, and activation in one unified approach. This ensures projects are managed with clarity, control, and a long-term vision.' },
      { muted: 'Projects are not treated as isolated builds,', rest: 'but as complete commercial and operational environments. From early planning to post-completion, decisions are guided by function, market performance, and long-term value.' },
      { muted: 'This model creates a strong advantage,', rest: 'construction aligns with operational needs, facility management is considered early, and sales and marketing develop alongside the project. The result is a controlled, efficient, and commercially focused approach.' },
      { muted: 'ALCOVE is defined not only by building projects,', rest: 'but by understanding how they succeed after completion, shaping every stage of development.' },
    ],
  },
  strengths: {
    eyebrow: 'Our Strengths',
    title: 'ALCOVE operates across the key disciplines that define successful developments, bringing them together in one structure to ensure consistency, quality, and long-term value.',
    items: [
      { title: 'Construction', description: 'Construction at ALCOVE is driven by precision, reliability, and attention to detail. Projects are delivered with strong execution standards, careful planning, and a clear focus on quality. The goal is not only to complete a project, but to deliver a development that performs well structurally and maintains its value over time.' },
      { title: 'Facility Management', description: 'ALCOVE developments are designed to perform beyond completion. Facility Management is not treated as a separate stage but as a core part of the development process. By understanding how a project will operate after delivery, ALCOVE ensures long-term efficiency, better maintenance standards, and stronger overall performance.' },
      { title: 'Sales', description: 'Sales is integrated into the development strategy from the beginning. Each project is positioned to attract the right audience and achieve strong commercial results. The focus is on understanding the market, presenting projects clearly, and ensuring that every development connects with the right buyers and tenants.' },
      { title: 'Marketing', description: 'Marketing at ALCOVE is focused on building presence, visibility, and strong market positioning. Every project is supported by clear communication strategies that highlight its strengths and create long-term recognition in the market. The objective is not only promotion, but strategic positioning.' },
      { title: 'Activation', description: "ALCOVE developments are supported by activation strategies that bring projects to life. Events, experiences, and engagement initiatives are designed to strengthen visibility, attract visitors, and support tenant performance. Activation is treated as an essential part of a project's success, not an additional feature." },
    ],
  },
}

function Strength({ title, description, index }) {
  return (
    <div className={`relative ${index > 0 ? "md:ml-[61px] md:pl-[61px] md:before:absolute md:before:left-0 md:before:top-0 md:before:h-[192px] md:before:w-[0.5px] md:before:bg-white md:before:content-['']" : ''}`}>
      <h3 className="m-0 text-[24px] md:text-[30px] font-normal leading-[1.15] tracking-[-0.6px] text-gold md:whitespace-nowrap">
        {title}
      </h3>
      <p className="mt-8 text-[15px] md:text-[16px] leading-normal tracking-[0] text-mist md:w-[356px]">
        {description}
      </p>
    </div>
  )
}

function AboutPage() {
  const about = useContent('about', ABOUT_FALLBACK)
  const hero = about.hero ?? ABOUT_FALLBACK.hero
  const goals = about.goals ?? ABOUT_FALLBACK.goals
  const why = about.why ?? ABOUT_FALLBACK.why
  const strengths = about.strengths ?? ABOUT_FALLBACK.strengths
  const strengthItems = strengths.items ?? ABOUT_FALLBACK.strengths.items
  const goalsSectionRef = useRef(null)
  const overlayRef = useRef(null)
  const heroBadgeRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroSubtitleRef = useRef(null)

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
      <main className="bg-mist text-navy">
        <section className="flex flex-col items-center pt-[140px] md:pt-[180px] pb-16 md:pb-24 px-4 w-full max-w-[1440px] mx-auto">
          <span
            ref={heroBadgeRef}
            className="inline-flex items-center justify-center gap-[10px] rounded-[31px] border-[0.5px] border-deep px-[9px] pb-[7px] pt-[10px] font-['Akkurat_Mono',monospace] text-[14px] font-medium leading-[1.15] tracking-[-0.28px] text-center uppercase text-navy h-[24px]"
          >
            {hero.badge}
          </span>
          <h1
            ref={heroTitleRef}
            className="m-0 mt-[22px] text-center text-[40px] md:text-[50px] font-normal leading-[1.05] tracking-[-1px] text-navy"
            style={{ fontFamily: "'Season Mix VF', 'Season Mix-TRIAL', serif" }}
          >
            {hero.title}
          </h1>
          <p
            ref={heroSubtitleRef}
            className="m-0 mt-[22px] text-center text-[16px] leading-[1.15] tracking-[-0.16px] max-w-[374px] text-navy"
          >
            {hero.subtitle}
          </p>
        </section>

        <section
          ref={goalsSectionRef}
          className="relative h-[200vh] bg-navy"
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <img
              src={hero.image || avenueImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex flex-col">
            <div className="h-screen shrink-0" />

            <div className="relative flex-1">
              <div
                ref={overlayRef}
                className="absolute left-0 right-0 bottom-0 -top-[70vh] pointer-events-none"
                style={{
                  backdropFilter: 'blur(32px) brightness(0.55)',
                  WebkitBackdropFilter: 'blur(32px) brightness(0.55)',
                  // Smoothstep (S-curve) mask: many stops with no slope kinks so the
                  // blur/darkening eases in continuously and avoids Mach-band "lines".
                  WebkitMaskImage:
                    'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.03) 4%, rgba(0,0,0,0.1) 8%, rgba(0,0,0,0.22) 12%, rgba(0,0,0,0.35) 16%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.65) 24%, rgba(0,0,0,0.78) 28%, rgba(0,0,0,0.9) 32%, rgba(0,0,0,0.97) 36%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 100%)',
                  maskImage:
                    'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.03) 4%, rgba(0,0,0,0.1) 8%, rgba(0,0,0,0.22) 12%, rgba(0,0,0,0.35) 16%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.65) 24%, rgba(0,0,0,0.78) 28%, rgba(0,0,0,0.9) 32%, rgba(0,0,0,0.97) 36%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 100%)',
                }}
              />

              <div className="relative px-4 pt-40 md:pt-52 pb-12 md:pb-16">
                <div className="max-w-[720px] mx-auto">
                  <div className="flex flex-col items-start gap-[56px]">
                    <span className="pointer-events-auto inline-flex items-center justify-center gap-[10px] rounded-[31px] border-[0.5px] border-mist/40 px-[9px] pb-[7px] pt-[10px] font-['Akkurat_Mono',monospace] text-[14px] font-medium leading-[1.15] tracking-[-0.28px] text-center uppercase text-mist bg-transparent h-[24px]">
                      {goals.badge}
                    </span>
                    {goals.paragraphs.map((p, i) => (
                      <p
                        key={i}
                        className="m-0 text-[30px] md:text-[42px] font-normal leading-[1.2] tracking-[-0.84px] text-white"
                      >
                        {p.lead}{' '}
                        <span className="text-white/60">{p.muted}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#D7DEE6] px-[38px] pt-24 md:pt-[195px] pb-24 md:pb-32">
          <div className="flex flex-col gap-10 md:flex-row md:gap-[208px] max-w-[1440px] mx-auto">
            <div className="shrink-0 md:sticky md:top-[140px] md:self-start md:w-[259px]">
              <h2
                className="m-0 text-[24px] md:text-[28px] leading-none tracking-[-1.12px] text-navy"
                style={{ fontFamily: "'Season Sans-TRIAL', sans-serif", fontWeight: 550 }}
              >
                {why.title[0]}
                <br />
                {why.title[1]}
              </h2>
            </div>
            <div className="space-y-12 md:w-[780px] md:space-y-16">
              {why.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="m-0 text-[24px] md:text-[34px] font-normal leading-[110%] tracking-[-1.36px] text-navy"
                >
                  <span className="text-[#8A8FA0]">{p.muted}</span>{' '}
                  {p.rest}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy text-mist px-[38px] pt-24 md:pt-[95px] pb-24 md:pb-32">
          <div className="max-w-[1440px] mx-auto">
            <p
              className="m-0 text-[18px] md:text-[22px] leading-none tracking-[-0.88px] text-mist"
              style={{ fontFamily: "'Season Sans-TRIAL', sans-serif", fontWeight: 550 }}
            >
              {strengths.eyebrow}
            </p>
            <h2
              className="m-0 mt-[30px] text-[28px] md:text-[36px] font-normal leading-normal tracking-[-1.44px] text-mist md:w-[780px]"
            >
              {strengths.title}
            </h2>

            <div className="mt-16 md:mt-[104px] flex flex-col gap-y-12 md:flex-row md:gap-y-0">
              {strengthItems.slice(0, 3).map((s, i) => (
                <Strength key={s.title} index={i} {...s} />
              ))}
            </div>
            <div className="mt-16 md:mt-[138px] flex flex-col gap-y-12 md:flex-row md:gap-y-0">
              {strengthItems.slice(3, 5).map((s, i) => (
                <Strength key={s.title} index={i} {...s} />
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
