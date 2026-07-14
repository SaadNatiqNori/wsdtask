import arrowRight from './assets/arrow-right.svg'

// The asset is a fixed-color SVG, so it's applied as a mask over
// `currentColor` — the arrow picks up the surrounding text color
// (mist on navy buttons, navy on light buttons) automatically.
function ArrowIcon({ size = 14, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: 'currentColor',
        WebkitMaskImage: `url(${arrowRight})`,
        maskImage: `url(${arrowRight})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}

export default ArrowIcon
