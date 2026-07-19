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
//   innerRef   forwarded to the inner element (for GSAP scoping)
//   className, style, ...rest  spread onto the inner element
// Exposes CSS var `--scale` on the wrapper for children that need scale-aware vh.
export function ScaleLock({
  as = 'section',
  viewport,
  scale: scaleProp,
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

  const innerStyle = { ...style }
  if (viewport === 'min') innerStyle.minHeight = `calc(100vh / ${scale})`
  else if (viewport === 'full') innerStyle.height = `calc(100vh / ${scale})`

  return (
    <div style={{ position: 'relative', height: reserved != null ? `${reserved}px` : undefined }}>
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
