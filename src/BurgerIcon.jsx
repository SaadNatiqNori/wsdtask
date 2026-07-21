import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { cubicEase } from './easings'

// Three-line burger that morphs into an X. The two outer lines first collapse
// to the vertical centre while the middle line fades ("lines collapse"), then
// the outer pair rotates ±45° into the cross. The timeline is built once and
// paused, then played/reversed off the `open` prop so open→close is a smooth,
// reversible motion rather than two competing tweens.
function BurgerIcon({ open }) {
  const topRef = useRef(null)
  const midRef = useRef(null)
  const botRef = useRef(null)
  const tlRef = useRef(null)

  useLayoutEffect(() => {
    const top = topRef.current
    const mid = midRef.current
    const bot = botRef.current
    // Centre all three, then offset the outer lines above/below the middle.
    gsap.set([top, mid, bot], { xPercent: -50, yPercent: -50, transformOrigin: '50% 50%' })
    gsap.set(top, { y: -5 })
    gsap.set(bot, { y: 5 })

    const tl = gsap.timeline({ paused: true })
    tl.to(mid, { opacity: 0, duration: 0.15, ease: 'none' }, 0)
      .to(top, { y: 0, duration: 0.2, ease: cubicEase }, 0)
      .to(bot, { y: 0, duration: 0.2, ease: cubicEase }, 0)
      .to(top, { rotation: 45, duration: 0.2, ease: cubicEase }, 0.2)
      .to(bot, { rotation: -45, duration: 0.2, ease: cubicEase }, 0.2)
    tlRef.current = tl
    return () => tl.kill()
  }, [])

  useLayoutEffect(() => {
    const tl = tlRef.current
    if (!tl) return
    if (open) tl.play()
    else tl.reverse()
  }, [open])

  const line = 'absolute left-1/2 top-1/2 h-[1.5px] w-[18px] bg-current'
  return (
    <span className="relative block h-6 w-6 text-mist" aria-hidden="true">
      <span ref={topRef} className={line} />
      <span ref={midRef} className={line} />
      <span ref={botRef} className={line} />
    </span>
  )
}

export default BurgerIcon
