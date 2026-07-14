import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext(null)
const ScrollModeContext = createContext(() => {})

// Cubic ease-out, shared across modes (matches the home page's original feel).
const easing = (t) => 1 - Math.pow(1 - t, 3)

const MODE_OPTIONS = {
  // Standard content pages: real continuous smooth scrolling.
  smooth: { duration: 1.2, easing, smoothWheel: true, syncTouch: false },
}

// One global Lenis instance for the whole app. Its mode is derived from the
// route, but a page can override it via useScrollMode ('native' = no Lenis at
// all, for pages that need the browser's own scroll). ScrollTrigger is wired
// to Lenis once here, so every ScrollTrigger animation in the app stays in
// sync under smooth scroll.
export function SmoothScrollProvider({ children }) {
  const { pathname } = useLocation()
  const [override, setOverride] = useState(null)
  const mode = override ?? 'smooth'

  const [lenis, setLenis] = useState(null)
  const lenisRef = useRef(null)

  useEffect(() => {
    // 'native' = no Lenis at all; the browser's own scroll (and CSS
    // scroll-snap) take over, and ScrollTrigger drives off native scroll.
    if (mode === 'native') {
      lenisRef.current = null
      setLenis(null)
      return
    }

    const instance = new Lenis(MODE_OPTIONS[mode])
    lenisRef.current = instance
    setLenis(instance)

    // Keep ScrollTrigger in lockstep with Lenis — this is what stops smooth
    // scroll from desyncing every ScrollTrigger animation in the app.
    instance.on('scroll', ScrollTrigger.update)
    const raf = (time) => instance.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      instance.destroy()
      lenisRef.current = null
      setLenis(null)
    }
  }, [mode])

  // Reset to the top on every navigation, routed through whatever scroll engine
  // is active so Lenis never desyncs from the real scroll position.
  useEffect(() => {
    const instance = lenisRef.current
    if (instance) instance.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])

  return (
    <ScrollModeContext.Provider value={setOverride}>
      <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
    </ScrollModeContext.Provider>
  )
}

// The shared Lenis instance, or null when the current page runs native scroll.
export function useLenis() {
  return useContext(LenisContext)
}

// Force a scroll mode for a page's lifetime. Pass a falsy value for no override.
export function useScrollMode(mode) {
  const setOverride = useContext(ScrollModeContext)
  useEffect(() => {
    if (!mode) return
    setOverride(mode)
    return () => setOverride(null)
  }, [mode, setOverride])
}
