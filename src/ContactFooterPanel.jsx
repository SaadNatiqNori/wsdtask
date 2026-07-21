import { Link } from 'react-router-dom'
import ArrowIcon from './ArrowIcon'
import logo from './assets/Logo.svg'

// Presentational navy footer panel, shared between the standalone
// ContactSection (used on interior pages, with a scroll-in reveal wired via
// the optional refs) and the home page's MissionVisionValues stack (rendered
// static as a rising cover layer, so the refs are omitted).
//
// fitMobile: on interior pages the footer is a normal-flow section, so below
// the md breakpoint it collapses to a fit-content block (natural padding, a
// fixed gap above ALCOVE) instead of the full 100vh desktop canvas. The home
// cover leaves it off — there the panel must fill the rising full-screen layer,
// so it keeps h-full + the mt-auto bottom-pin at every width.
function ContactFooterPanel({
  cta,
  titleRef,
  descRef,
  buttonRef,
  alcoveRef,
  fitMobile = false,
}) {
  // Mobile spec (≈402×553 fit-content frame): 23px text inset, 116px top pad,
  // 97.4px gap from the button down to the ALCOVE mask, 118px from the mask to
  // the container bottom. The mask breaks 7px past the 23px inset each side so
  // it lands ~370px wide (near full-bleed) instead of matching the text column.
  const mainClass = fitMobile
    ? 'relative h-auto md:h-full max-w-[1440px] mx-auto flex flex-col bg-navy px-[23px] pb-[118px] pt-[116px] text-mist md:px-8 md:pb-[31px] md:pt-[150px]'
    : 'relative h-full max-w-[1440px] mx-auto flex flex-col bg-navy px-4 pb-[31px] pt-[150px] text-mist md:px-8'
  const alcoveWrapClass = fitMobile
    ? 'relative mt-[97.4px] mx-[-7px] md:mt-auto md:mx-0'
    : 'relative mt-auto'
  return (
    <main className={mainClass}>
      <div className="flex flex-col items-center text-center gap-[25px] md:gap-[37px]">
        <div className="overflow-hidden">
          <h2
            ref={titleRef}
            className="m-0 text-[34px] md:text-[47px] font-[420] leading-[100%] tracking-[-0.04em] text-mist"
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
            className="m-0 max-w-[356px] text-[13px] md:text-[16px] leading-[100%] text-mist"
          >
            {cta.description}
          </p>
        </div>

        <div className="overflow-hidden">
          <Link
            ref={buttonRef}
            to="/contact"
            className="group inline-flex h-[46px] items-center gap-[5px] rounded-[48px] border border-mist bg-mist px-[14px] font-['Akkurat_Mono',monospace] text-[10px] font-medium uppercase leading-none text-navy no-underline transition-colors duration-300 ease-out hover:bg-navy hover:text-mist mt-2 md:mt-0"
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
      <div className={alcoveWrapClass}>
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
