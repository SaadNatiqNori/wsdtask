import { useState, useEffect } from 'react'

// The layout stops zooming once it is 80% larger than the design canvas, then
// locks: on viewports wider than referenceWidth * MAX_SCALE the scale holds at
// MAX_SCALE and the content centers with side gutters instead of growing forever.
export const MAX_SCALE = 1.3

// Locks a design to a `referenceWidth` canvas: above 768px the returned scale is
// viewportWidth / referenceWidth (so the layout zooms uniformly instead of
// reflowing), capped at MAX_SCALE; below 768px it is 1. DPR-aware so browser zoom
// is not double-counted.
export function useScale(referenceWidth = 1440) {
  const [state, setState] = useState(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      const dpr = window.devicePixelRatio || 1
      return {
        scale: width >= 768 ? Math.min(width / referenceWidth, MAX_SCALE) : 1,
        initialDPR: dpr,
      }
    }
    return { scale: 1, initialDPR: 1 }
  })

  useEffect(() => {
    const setScale = (s) => setState((prev) => ({ ...prev, scale: s }))
    const handleResize = () => {
      const width = window.innerWidth
      const currentDPR = window.devicePixelRatio || 1
      const virtualWidth = width * (currentDPR / state.initialDPR)
      if (virtualWidth >= 768) setScale(Math.min(width / referenceWidth, MAX_SCALE))
      else setScale(1)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [referenceWidth, state.initialDPR])

  return state.scale
}
