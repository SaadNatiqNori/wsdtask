import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import ContactSection from './ContactSection'
import { cubicEase } from './easings'
import { useContent } from './api'

// Rendered while the CMS content loads (and if the API is unreachable). Mirrors
// the seeded starter copy so the page is never blank.
const PRIVACY_FALLBACK = {
  title: 'Privacy Policy',
  lastUpdated: '',
  body:
    '<p>We respect your privacy. This policy explains what information we collect ' +
    'when you use our website or contact us, and how we use it.</p>',
}

// The CMS stores `lastUpdated` as an ISO date (Y-m-d); present it as "15 July 2026".
// Falls back to the raw value if it isn't a parseable date.
function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function PrivacyPolicyPage() {
  const content = useContent('privacy', PRIVACY_FALLBACK)
  const title = content.title ?? PRIVACY_FALLBACK.title
  const body = content.body ?? PRIVACY_FALLBACK.body
  const lastUpdated = formatDate(content.lastUpdated)

  const headerRef = useRef(null)
  const bodyRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children ?? [], {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: cubicEase,
        stagger: 0.1,
        delay: 0.15,
      })
      gsap.from(bodyRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: cubicEase,
        delay: 0.35,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <main
        className="bg-[#E6EBF0] text-[#1C2D4F]"
        style={{ fontFamily: "'Season Sans-TRIAL', sans-serif" }}
      >
        {/* Top padding matches the fixed navbar offset used on the other light
            pages so the header clears it on first paint. */}
        <section className="relative px-4 pt-[128px] md:pt-[140px] pb-[12vh]">
          <div ref={headerRef} className="mx-auto max-w-[820px] text-center">
            <span className="inline-flex items-center justify-center gap-[10px] rounded-[31px] border-[0.5px] border-[#1C2D4F] px-[9px] pb-[7px] pt-[10px] font-['Akkurat_Mono',monospace] text-[14px] font-medium leading-[1.15] tracking-[-0.28px] text-center uppercase text-[#1C2D4F] h-[24px]">
              Privacy
            </span>
            <h1
              className="m-0 mt-[22px] text-[40px] md:text-[50px] font-normal leading-[1.05] tracking-[-1px] text-[#1C2D4F]"
              style={{ fontFamily: "'Season Mix VF', 'Season Mix-TRIAL', serif" }}
            >
              {title}
            </h1>
            {lastUpdated && (
              <p className="m-0 mt-[18px] font-['Akkurat_Mono',monospace] text-[12px] font-medium uppercase tracking-[0.02em] text-[#1C2D4F]/55">
                Last updated {lastUpdated}
              </p>
            )}
          </div>

          <article
            ref={bodyRef}
            className="privacy-prose mx-auto mt-[56px] md:mt-[72px] w-full max-w-[760px] rounded-[8px] bg-[#D7E0E8] px-6 py-10 md:px-[72px] md:py-[64px]"
            // Body is authored by admins in the CMS rich-text editor and stored as
            // HTML, so it is trusted content.
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </section>
      </main>

      <ContactSection />

      {/* Scoped prose styling for the CMS HTML. Kept local to this page (no
          Tailwind typography plugin is installed) so it's easy to find and
          remove with the feature. */}
      <style>{`
        .privacy-prose { color: #1C2D4F; font-size: 17px; line-height: 1.7; }
        .privacy-prose > :first-child { margin-top: 0; }
        .privacy-prose h2 {
          font-family: 'Season Mix VF', 'Season Mix-TRIAL', serif;
          font-size: 26px; line-height: 1.15; letter-spacing: -0.4px;
          margin: 40px 0 14px; color: #1C2D4F;
        }
        .privacy-prose h3 {
          font-family: 'Season Mix VF', 'Season Mix-TRIAL', serif;
          font-size: 20px; line-height: 1.2; margin: 28px 0 10px; color: #1C2D4F;
        }
        .privacy-prose p { margin: 0 0 18px; color: rgba(28, 45, 79, 0.85); }
        .privacy-prose ul, .privacy-prose ol {
          margin: 0 0 18px; padding-left: 22px; color: rgba(28, 45, 79, 0.85);
        }
        .privacy-prose li { margin: 0 0 8px; }
        .privacy-prose ul { list-style: disc; }
        .privacy-prose ol { list-style: decimal; }
        .privacy-prose a {
          color: #1C2D4F; text-decoration: underline; text-underline-offset: 2px;
        }
        .privacy-prose strong { font-weight: 600; color: #1C2D4F; }
        .privacy-prose blockquote {
          margin: 0 0 18px; padding-left: 16px;
          border-left: 2px solid rgba(28, 45, 79, 0.25); color: rgba(28, 45, 79, 0.7);
        }
      `}</style>
    </>
  )
}

export default PrivacyPolicyPage
