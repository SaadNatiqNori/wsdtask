import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IoArrowForward } from 'react-icons/io5'
import ContactSection from './ContactSection'
import { cubicEase } from './easings'
import { useContent, useSettings, postContact } from './api'

gsap.registerPlugin(ScrollTrigger)

// Brand blue used across the light pages (About, Hero) for text on light bg.
const INK = '#1C2D4F'

const CONTACT_FALLBACK = {
  header: {
    badge: 'Contact',
    title: "Let's Talk",
    subtitle: 'Connect with ALCOVE to explore opportunities, partnerships, and more.',
  },
  form: {
    nameLabel: 'Name',
    emailLabel: 'Email',
    messageLabel: 'Message',
    submitLabel: 'Send message',
    sentLabel: 'Message sent',
  },
}

const DETAILS_FALLBACK = [
  {
    label: 'Location',
    lines: ['Erbil Avenue, Baharka', 'Road, Erbil, Kurdistan', 'Region of Iraq'],
  },
  { label: 'Working Hours', lines: ['9:00 AM – 5:00 PM'] },
  { label: 'Follow Us', lines: ['Instagram', 'Facebook'] },
  { label: 'Phone Number', lines: ['+964 750 123 4567'] },
  {
    label: 'Email Address',
    lines: ['info@alcove', 'sales@alcove', 'partnerships@alcove', 'marketing@alcove'],
  },
]

const DIVIDERS = [0, 20, 40, 60, 80, 100]

// Exact dashed stroke from the design: 1px line, 2px dash, 2px gap.
// CSS `border-dashed` can't set dash length, so paint it with a gradient.
const DASH_V =
  'repeating-linear-gradient(to bottom, #AEB8C8 0, #AEB8C8 2px, transparent 2px, transparent 4px)'
const DASH_H =
  'repeating-linear-gradient(to right, #AEB8C8 0, #AEB8C8 2px, transparent 2px, transparent 4px)'

function Field({ label, type = 'text', value, onChange, trailing, error }) {
  return (
    <div>
      <label
        className={`group relative block border-b pb-3 transition-colors ${
          error
            ? 'border-red-500/70 focus-within:border-red-500'
            : 'border-[#1C2D4F]/25 focus-within:border-[#1C2D4F]'
        }`}
      >
        <span className="sr-only">{label}</span>
        <div className="flex items-end justify-between gap-3">
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={label}
            aria-invalid={error ? 'true' : undefined}
            className="min-w-0 flex-1 bg-transparent text-[18px] md:text-[19px] leading-none text-[#1C2D4F] outline-none placeholder:text-[#1C2D4F]/45"
          />
          {trailing}
        </div>
      </label>
      {error && <p className="mt-2 text-[13px] leading-tight text-red-600">{error}</p>}
    </div>
  )
}

function ContactPage() {
  const content = useContent('contact', CONTACT_FALLBACK)
  const header = content.header ?? CONTACT_FALLBACK.header
  const formLabels = content.form ?? CONTACT_FALLBACK.form
  const settings = useSettings({ contact_details: DETAILS_FALLBACK })
  const details = settings.contact_details ?? DETAILS_FALLBACK

  const headerRef = useRef(null)
  const cardRef = useRef(null)
  const footerRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  // Clear a field's error (and any general error) as soon as the user edits it.
  const update = (key) => (e) => {
    const { value } = e.target
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((prev) =>
      prev[key] || prev.form ? { ...prev, [key]: undefined, form: undefined } : prev
    )
  }

  // Client-side validation — mirrors the backend rules so the user gets instant
  // feedback before a round-trip.
  const validate = (values) => {
    const next = {}
    if (!values.name.trim()) next.name = 'Please enter your name.'
    else if (values.name.trim().length < 2) next.name = 'Name is too short.'
    if (!values.email.trim()) next.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = 'Please enter a valid email address.'
    if (!values.message.trim()) next.message = 'Please enter a message.'
    else if (values.message.trim().length < 5) next.message = 'Message is too short.'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending || sent) return

    const clientErrors = validate(form)
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    setErrors({})
    setSending(true)
    const res = await postContact(form)
    setSending(false)

    if (res.ok) {
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      return
    }

    // Surface Laravel 422 field errors; otherwise a generic failure message.
    if (res.status === 422 && res.data?.errors) {
      const mapped = {}
      for (const [key, msgs] of Object.entries(res.data.errors)) {
        mapped[key] = Array.isArray(msgs) ? msgs[0] : String(msgs)
      }
      setErrors(mapped)
    } else {
      setErrors({ form: 'Something went wrong. Please try again.' })
    }
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the header's children (not the sticky container itself) so
      // `position: sticky` keeps working.
      const headerItems = headerRef.current?.children ?? []
      gsap.from(headerItems, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: cubicEase,
        stagger: 0.1,
        delay: 0.15,
      })

      gsap.from(cardRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.3,
        ease: cubicEase,
        delay: 0.35,
      })

      gsap.from(footerRef.current?.querySelectorAll('[data-col]') ?? [], {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: cubicEase,
        stagger: 0.08,
        scrollTrigger: { trigger: footerRef.current, start: 'top 85%' },
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
      {/* Form area — the header pins while the card scrolls up over it.
          The section's top padding matches the sticky offset so the header
          doesn't jump on first paint. */}
      <section className="relative px-4 pt-[128px] md:pt-[140px] pb-[16vh]">
        <div
          ref={headerRef}
          className="sticky top-[128px] md:top-[140px] z-0 flex flex-col items-center text-center"
        >
          <span className="inline-flex items-center rounded-full border border-[#1C2D4F]/35 px-3 py-1 font-['Akkurat_Mono',monospace] text-[14px] font-extrabold uppercase tracking-[0.12em] text-[#1C2D4F]">
            <span className="relative font-['Akkurat_Mono',monospace]">{header.badge}</span>
          </span>
          <h1
            className="m-0 mt-7 text-[54px] md:text-[92px] font-normal leading-[0.95] tracking-[-0.02em] text-[#1C2D4F]"
            style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
          >
            {header.title}
          </h1>
          <p className="m-0 mt-5 w-full max-w-[460px] text-[15px] md:text-[18px] leading-[120%] tracking-[0] text-[#1C2D4F]">
            {header.subtitle}
          </p>
        </div>

        <form
          ref={cardRef}
          onSubmit={handleSubmit}
          noValidate
          className="relative z-10 mx-auto mt-[72px] md:mt-[96px] w-full max-w-[666px] rounded-[8px] bg-[#D7E0E8] px-6 py-10 md:min-h-[486px] md:px-[72px] md:pt-[68px] md:pb-[56px]"
        >
          <div className="flex flex-col gap-[34px] md:gap-[40px]">
            <Field label={formLabels.nameLabel} value={form.name} onChange={update('name')} error={errors.name} />
            <Field label={formLabels.emailLabel} type="email" value={form.email} onChange={update('email')} error={errors.email} />
            <Field
              label={formLabels.messageLabel}
              value={form.message}
              onChange={update('message')}
              error={errors.message}
              trailing={
                <svg
                  aria-hidden="true"
                  width="13"
                  height="9"
                  viewBox="0 0 13 9"
                  className="mb-[3px] shrink-0"
                >
                  <path d="M6.5 0L13 9H0z" fill={INK} />
                </svg>
              }
            />
          </div>

          <p
            className="mx-auto mt-8 max-w-[280px] text-center text-[16px] font-normal leading-[1.2] tracking-[-0.01em] text-[#1C2D4F]/45"
            style={{ fontFamily: "'Season Sans-TRIAL', sans-serif" }}
          >
            By clicking send message, you acknowledge your data will be processed
            according to our{' '}
            <a href="#" className="text-[#1C2D4F]/75 underline underline-offset-2">
              Privacy Policy
            </a>
          </p>

          {errors.form && (
            <p className="mt-4 text-center text-[13px] text-red-600">{errors.form}</p>
          )}

          <div className="mt-7 flex justify-center">
            <button
              type="submit"
              disabled={sending || sent}
              aria-busy={sending ? 'true' : undefined}
              className={`inline-flex items-center gap-2 rounded-[28px] bg-navy px-8 py-5 font-['Akkurat_Mono',monospace] text-[12px] font-medium uppercase leading-[1] tracking-[0] text-[#E2EAF2] transition-opacity ${
                sending || sent ? 'cursor-not-allowed opacity-60' : 'hover:opacity-90'
              }`}
            >
              <span className="relative top-[1px]">
                {sent
                  ? formLabels.sentLabel
                  : sending
                    ? 'Sending…'
                    : formLabels.submitLabel}
              </span>
              {sending ? (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <IoArrowForward className="text-sm" aria-hidden="true" />
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Footer — dashed grid framed as a clean closed rectangle (1168px span,
          ≈136px margins in a 1440 frame). Vertical dividers meet the top/bottom
          lines flush at the corners (no overshoot); first/last hug the left/right
          edges. Text is left-aligned; columns vertically centered. Dashes are an
          exact 2px-on / 2px-off, 1px stroke. */}
      <footer ref={footerRef} className="px-4 pb-16 md:pb-24">
        <div className="relative mx-auto max-w-[1168px] py-12 md:py-16">
          {/* top + bottom frame lines — overshoot the outer verticals by 10px
              so the corners read as crossings, not closed joins */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[16px] top-0 h-px"
            style={{ backgroundImage: DASH_H }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[16px] bottom-0 h-px"
            style={{ backgroundImage: DASH_H }}
          />

          {/* vertical dividers — overshoot the top/bottom lines by 10px so each
              intersection crosses (desktop only); first/last hug the edges */}
          {DIVIDERS.map((left) => (
            <span
              key={left}
              aria-hidden="true"
              className="pointer-events-none absolute -top-[16px] -bottom-[16px] hidden w-px md:block"
              style={{
                ...(left === 100 ? { right: 0 } : { left: `${left}%` }),
                backgroundImage: DASH_V,
              }}
            />
          ))}

          <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-5 md:gap-y-0">
            {details.map((col) => (
              <div
                key={col.label}
                data-col
                className="flex flex-col justify-center px-4 md:px-[30px]"
              >
                <p className="m-0 font-['Akkurat_Mono',monospace] text-[12px] font-medium uppercase leading-none text-[#1C1F2A]">
                  {col.label}
                </p>
                <div className="mt-4 space-y-1.5">
                  {col.lines.map((line) => (
                    <p
                      key={line}
                      className="m-0 text-[16px] font-normal leading-none text-black"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </main>
    <ContactSection />
    </>
  )
}

export default ContactPage
