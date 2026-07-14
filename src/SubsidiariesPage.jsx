import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IoArrowBack } from 'react-icons/io5'
import ContactSection from './ContactSection'
import logoYellow from './assets/LogoYellow.svg'
import { cubicEase } from './easings'
import { useContent } from './api'

const SUBS_FALLBACK = {
  title: 'Subsidiaries',
  intro: 'Alcove operates through three distinct subsidiaries:',
  items: [
    { icon: 'construction', title: 'Construction', description: 'Delivering innovative and high-quality construction' },
    { icon: 'development', title: 'Development', description: 'Leading large-scale development projects to transform urban spaces.' },
    { icon: 'properties', title: 'Properties', description: 'Managing a diverse portfolio of residential and commercial properties.' },
  ],
  what: {
    title: ['What', 'ALCOVE does'],
    left: [
      { text: 'ALCOVE is a development company focused on construction and sales. We work on creating projects that are carefully planned, well executed, and positioned to meet both practical and commercial goals. Our role is to turn ideas into developed spaces that offer ' },
      { text: 'quality, function, and value.', variant: 'gold' },
      { text: ' Our work is built on a combination of development expertise and market understanding.' },
    ],
    right: 'On the construction side, we focus on delivering strong, reliable, and high-standard projects. On the sales side, we work to ensure that each development is presented in a way that connects with the market and attracts the right audience. This balanced approach allows us to support the success of a project from the beginning of construction through to final delivery and beyond.',
  },
}

gsap.registerPlugin(ScrollTrigger)

function ConstructionIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="w-[44px] h-[44px] md:w-[52px] md:h-[52px]"
      fill="none"
      stroke="var(--color-gold)"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 54 Q12 32 40 32 Q68 32 68 54" />
      <line x1="8" y1="54" x2="72" y2="54" />
      <path d="M12 54 L12 60 L68 60 L68 54" />
      <rect x="34" y="20" width="12" height="14" />
      <line x1="40" y1="20" x2="40" y2="32" strokeDasharray="2 2" opacity="0.6" />
      <line x1="22" y1="54" x2="22" y2="60" />
      <line x1="58" y1="54" x2="58" y2="60" />
    </svg>
  )
}

function DevelopmentIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="w-[44px] h-[44px] md:w-[52px] md:h-[52px]"
      fill="none"
      stroke="var(--color-gold)"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="18" y="14" width="28" height="56" />
      <rect x="46" y="30" width="20" height="40" />
      <rect x="23" y="22" width="4" height="4" />
      <rect x="30" y="22" width="4" height="4" />
      <rect x="37" y="22" width="4" height="4" />
      <rect x="23" y="32" width="4" height="4" />
      <rect x="30" y="32" width="4" height="4" />
      <rect x="37" y="32" width="4" height="4" />
      <rect x="23" y="42" width="4" height="4" />
      <rect x="30" y="42" width="4" height="4" />
      <rect x="37" y="42" width="4" height="4" />
      <rect x="23" y="52" width="4" height="4" />
      <rect x="30" y="52" width="4" height="4" />
      <rect x="37" y="52" width="4" height="4" />
      <rect x="50" y="38" width="4" height="4" />
      <rect x="57" y="38" width="4" height="4" />
      <rect x="50" y="48" width="4" height="4" />
      <rect x="57" y="48" width="4" height="4" />
      <rect x="50" y="58" width="4" height="4" />
      <rect x="57" y="58" width="4" height="4" />
    </svg>
  )
}

function PropertiesIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="w-[44px] h-[44px] md:w-[52px] md:h-[52px]"
      fill="none"
      stroke="var(--color-gold)"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 22 L60 22" />
      <path d="M22 28 L58 28" />
      <line x1="26" y1="28" x2="26" y2="62" />
      <line x1="33" y1="28" x2="33" y2="62" />
      <line x1="40" y1="28" x2="40" y2="62" />
      <line x1="47" y1="28" x2="47" y2="62" />
      <line x1="54" y1="28" x2="54" y2="62" />
      <path d="M18 62 L62 62" />
    </svg>
  )
}

function SubsidiaryCard({ icon, title, description }) {
  return (
    <div className="bg-[#22252E] border border-[#FFFFFF0A] p-8 md:p-10 rounded-[6px]">
      {icon}
      <img
        src={logoYellow}
        alt="Alcove"
        className="mt-6 h-[18px] md:h-[20px] w-auto"
      />
      <h3
        className="m-0 mt-2 text-[36px] md:text-[48px] font-normal leading-[1.05] tracking-[-0.02em] text-gold"
        style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
      >
        {title}
      </h3>
      <p className="mt-6 text-[14px] md:text-[15px] leading-[150%] tracking-[0] max-w-[320px] text-mist/85">
        {description}
      </p>
    </div>
  )
}

const ICON_COMPONENTS = {
  construction: ConstructionIcon,
  development: DevelopmentIcon,
  properties: PropertiesIcon,
}

function SubsidiariesPage() {
  const subs = useContent('subsidiaries', SUBS_FALLBACK)
  const items = subs.items ?? SUBS_FALLBACK.items
  const what = subs.what ?? SUBS_FALLBACK.what
  // Guard against a non-string intro (see the documented data.intro collision)
  // so it can never render as [object Object].
  const intro = typeof subs.intro === 'string' ? subs.intro : SUBS_FALLBACK.intro
  const iconFor = (item) => {
    if (item.image) {
      return (
        <img
          src={item.image}
          alt=""
          className="w-[44px] h-[44px] md:w-[52px] md:h-[52px] object-contain"
        />
      )
    }
    const Icon = ICON_COMPONENTS[item.icon] ?? ConstructionIcon
    return <Icon />
  }
  const titleRef = useRef(null)
  const introRef = useRef(null)
  const cardRefs = useRef([])
  const whatTitleRef = useRef(null)
  const whatLeftRef = useRef(null)
  const whatRightRef = useRef(null)

  cardRefs.current = []

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, introRef.current], { y: 60, opacity: 0 })
      gsap.to([titleRef.current, introRef.current], {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: cubicEase,
        stagger: 0.08,
        delay: 0.2,
      })

      const cards = cardRefs.current.filter(Boolean)
      if (cards.length > 0) {
        gsap.set(cards, { y: 60, opacity: 0 })
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: cubicEase,
          stagger: 0.12,
          scrollTrigger: {
            trigger: cards[0],
            start: 'top 85%',
            toggleActions: 'restart none restart reset',
          },
        })
      }

      const whatTargets = [
        whatTitleRef.current,
        whatLeftRef.current,
        whatRightRef.current,
      ]
      gsap.set(whatTargets, { y: 60, opacity: 0 })
      gsap.to(whatTargets, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: cubicEase,
        stagger: 0.1,
        scrollTrigger: {
          trigger: whatTitleRef.current,
          start: 'top 85%',
          toggleActions: 'restart none restart reset',
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <main className="relative min-h-screen bg-navy text-mist px-4 pt-[140px] pb-24 md:px-8 md:pt-[180px] md:pb-32">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center">
            <h1
              ref={titleRef}
              className="m-0 text-[36px] md:text-[48px] font-normal leading-[0.95] tracking-[-0.02em] text-gold"
              style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
            >
              {subs.title}
            </h1>
            <p
              ref={introRef}
              className="m-0 mt-3 text-[20px] md:text-[36px] leading-[1.3] tracking-[-0.01em] text-mist"
              style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
            >
              {intro}
            </p>
          </div>

          <div className="relative mt-24 md:mt-32">
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, #FFFFFF40 0, #FFFFFF40 6px, transparent 6px, transparent 12px)',
              }}
            />

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-[260px] gap-y-[60px] md:gap-y-[80px]">
              <div
                ref={(el) => {
                  if (el) cardRefs.current.push(el)
                }}
                className="relative md:col-start-1 md:row-start-1"
              >
                <SubsidiaryCard
                  icon={iconFor(items[0])}
                  title={items[0].title}
                  description={items[0].description}
                />
                <div
                  aria-hidden="true"
                  className="hidden md:block absolute top-1/2 left-full w-[130px] h-[1px]"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(to right, #FFFFFF40 0, #FFFFFF40 6px, transparent 6px, transparent 12px)',
                  }}
                />
              </div>

              <div
                ref={(el) => {
                  if (el) cardRefs.current.push(el)
                }}
                className="relative md:col-start-2 md:row-start-2"
              >
                <SubsidiaryCard
                  icon={iconFor(items[1])}
                  title={items[1].title}
                  description={items[1].description}
                />
                <div
                  aria-hidden="true"
                  className="hidden md:block absolute top-1/2 right-full w-[130px] h-[1px]"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(to right, #FFFFFF40 0, #FFFFFF40 6px, transparent 6px, transparent 12px)',
                  }}
                />
              </div>

              <div
                ref={(el) => {
                  if (el) cardRefs.current.push(el)
                }}
                className="relative md:col-start-1 md:row-start-3"
              >
                <SubsidiaryCard
                  icon={iconFor(items[2])}
                  title={items[2].title}
                  description={items[2].description}
                />
                <div
                  aria-hidden="true"
                  className="hidden md:block absolute top-1/2 left-full w-[130px] h-[1px]"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(to right, #FFFFFF40 0, #FFFFFF40 6px, transparent 6px, transparent 12px)',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-24 md:mt-[180px] bg-[#22252E] border border-[#FFFFFF0A] p-8 md:p-16 rounded-[6px]">
            <div className="border-l-2 border-gold pl-6 md:pl-8">
              <h2
                ref={whatTitleRef}
                className="m-0 text-[44px] md:text-[64px] font-normal leading-[1.0] tracking-[-0.02em] text-gold"
                style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
              >
                {what.title[0]}
                <br />
                {what.title[1]}
              </h2>
            </div>
            <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <p
                ref={whatLeftRef}
                className="m-0 text-[17px] md:text-[22px] leading-[155%] tracking-[0] text-mist"
              >
                {(what.left ?? []).map((seg, i) =>
                  seg.variant === 'gold' ? (
                    <span key={i} className="text-gold">{seg.text}</span>
                  ) : (
                    <span key={i}>{seg.text}</span>
                  )
                )}
              </p>
              <p
                ref={whatRightRef}
                className="m-0 text-[17px] md:text-[22px] leading-[155%] tracking-[0] text-mist"
              >
                {what.right}
              </p>
            </div>
          </div>
        </div>
      </main>
      <ContactSection />
    </>
  )
}

export default SubsidiariesPage
