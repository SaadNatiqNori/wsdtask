import { useState, useLayoutEffect, useRef, createElement } from 'react'
import { useScale } from './useScale'

// Wraps `children` in the home-page scale-wrapper. The inner <section> lays out in
// a referenceWidth-wide virtual canvas, then scales to fill the container width.
// The width/marginLeft formula renders at exactly 100% of the container for every
// scale (no horizontal overflow, so it is safe around position: sticky). The outer
// element reserves the SCALED content height (measured), so tall sections and
// one-viewport sections both flow correctly.
//
// Props:
//   as         inner element tag (default 'section'; pages pass 'main')
//   viewport   'min' → inner minHeight: 100vh/scale; 'full' → inner height: 100vh/scale
//   scale      externally supplied scale (defaults to an internal useScale())
//   referenceWidth  design-canvas width the inner section caps at (default 1440).
//                   Once the scale locks (see MAX_SCALE), the wrapper keeps
//                   widening but the canvas holds here and centers, so the section
//                   gets side gutters instead of reflowing wider.
//   bg         Tailwind background class(es) for the section. Applied to the
//              full-width outer element (not the capped inner canvas) so the
//              background always spans 100vw — once the scale locks and the inner
//              canvas centers, the background still reaches both viewport edges
//              instead of leaving gutters. Pass the section's bg here instead of
//              in `className`.
//   fill       Skip the referenceWidth cap so the canvas keeps filling the width
//              (content spreads at the locked zoom instead of centering). Use for
//              full-bleed sliders/carousels whose slides must reach the viewport
//              edges — capping would clip the track to the centered 1440 canvas.
//   innerRef   forwarded to the inner element (for GSAP scoping)
//   className, style, ...rest  spread onto the inner element
// Exposes CSS var `--scale` on the wrapper for children that need scale-aware vh.
export function ScaleLock({
  as = 'section',
  viewport,
  scale: scaleProp,
  referenceWidth = 1440,
  bg,
  fill = false,
  innerRef,
  className,
  style,
  children,
  ...rest
}) {
  const ownScale = useScale()
  const scale = scaleProp ?? ownScale
  const wrapperRef = useRef(null)
  const [reserved, setReserved] = useState(null)

  useLayoutEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const measure = () => setReserved(el.offsetHeight * scale)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [scale])

  // Cap the canvas at referenceWidth and center it. Below the scale lock the
  // wrapper is already exactly referenceWidth wide, so this is a no-op; above it
  // the wrapper widens past referenceWidth and this keeps the section pinned to
  // its design width with balanced gutters instead of stretching.
  const innerStyle = fill
    ? { ...style }
    : { maxWidth: `${referenceWidth}px`, marginInline: 'auto', ...style }
  if (viewport === 'min') innerStyle.minHeight = `calc(100vh / ${scale})`
  else if (viewport === 'full') innerStyle.height = `calc(100vh / ${scale})`

  return (
    <div
      className={bg}
      style={{ position: 'relative', height: reserved != null ? `${reserved}px` : undefined }}
    >
      <div
        ref={wrapperRef}
        className="scale-wrapper"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: `${100 / scale}%`,
          marginLeft: `${(100 - 100 / scale) / 2}%`,
          '--scale': scale,
        }}
      >
        {createElement(
          as,
          { ref: innerRef, className, style: innerStyle, ...rest },
          children
        )}
      </div>
    </div>
  )
}
