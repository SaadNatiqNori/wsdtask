import { Link } from 'react-router-dom'
import ArrowIcon from './ArrowIcon'
import logo from './assets/Logo.svg'

// Presentational navy footer panel, shared between the standalone
// ContactSection (used on interior pages, with a scroll-in reveal wired via
// the optional refs) and the home page's MissionVisionValues stack (rendered
// static as a rising cover layer, so the refs are omitted).
function ContactFooterPanel({ cta, titleRef, descRef, buttonRef, alcoveRef }) {
  return (
    <main className="relative h-full max-w-[1440px] mx-auto flex flex-col bg-navy px-4 pb-[31px] pt-[150px] text-mist md:px-8">
      <div className="flex flex-col items-center text-center gap-[37px]">
        <div className="overflow-hidden">
          <h2
            ref={titleRef}
            className="m-0 text-[47px] font-[420] leading-[100%] tracking-[-0.04em] text-mist"
            style={{
              fontFamily: "'Season Mix VF', serif",
              // Figma spec: leading-trim CAP_HEIGHT — without it the 47px
              // line box breaks the section's fixed vertical rhythm.
              textBox: 'trim-both cap alphabetic',
            }}
          >
            {cta.title}
          </h2>
        </div>

        <div className="overflow-hidden">
          <p
            ref={descRef}
            className="m-0 max-w-[356px] text-[16px] leading-[100%] text-mist"
          >
            {cta.description}
          </p>
        </div>

        <div className="overflow-hidden">
          <Link
            ref={buttonRef}
            to="/contact"
            className="group inline-flex h-[46px] items-center gap-[5px] rounded-[48px] border border-mist bg-mist px-[14px] font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-navy no-underline transition-colors duration-300 ease-out hover:bg-navy hover:text-mist"
          >
            <span className="relative top-[1px]">{cta.buttonLabel}</span>
            <ArrowIcon
              size={14}
              className="transition-transform duration-300 ease-out group-hover:translate-x-[3px]"
            />
          </Link>
        </div>
      </div>

      {/* mt-auto bottom-pins the logo; no fixed top gap, or on
          short/wide viewports the 161px gap would push the ALCOVE
          mask past the section's overflow-hidden edge and clip it. */}
      <div className="relative mt-auto">
        <div
          ref={alcoveRef}
          className="w-full aspect-[64/13]"
          style={{
            WebkitMaskImage: `url("${logo}")`,
            maskImage: `url("${logo}")`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            backgroundColor: 'var(--color-gold)',
          }}
          role="img"
          aria-label="Alcove"
        />
      </div>
    </main>
  )
}

export default ContactFooterPanel
