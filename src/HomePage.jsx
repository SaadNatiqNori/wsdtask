import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import HeroSustainable from './HeroSustainable'
import CardsSection from './CardsSection'
import PortfolioSlider from './PortfolioSlider'
import MissionVisionValues from './MissionVisionValues'
import ContactSection from './ContactSection'
import { cubicEase } from './easings'

gsap.registerPlugin(ScrollTrigger)

function HomePage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: false,
      syncTouch: false,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const update = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    let isAnimating = false
    let animatingTimer = null

    const getSnapPoints = () => {
      const root = document.getElementById('root')
      if (!root) return []
      const sections = []
      const collect = (node) => {
        for (const child of node.children) {
          if (child.tagName === 'SECTION') sections.push(child)
          else if (child.tagName !== 'HEADER') collect(child)
        }
      }
      collect(root)
      const points = []
      const vh = window.innerHeight
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top + window.scrollY
        const stages = Math.max(1, Math.round(section.offsetHeight / vh))
        for (let i = 0; i < stages; i++) {
          points.push(Math.round(top + i * vh))
        }
      })
      return points
    }

    const goToDirection = (direction) => {
      if (isAnimating) return

      const snapPoints = getSnapPoints()
      if (snapPoints.length === 0) return

      const currentScroll = Math.round(window.scrollY)

      let currentIdx = 0
      let minDist = Infinity
      snapPoints.forEach((p, i) => {
        const dist = Math.abs(p - currentScroll)
        if (dist < minDist) {
          minDist = dist
          currentIdx = i
        }
      })

      const targetIdx = Math.max(
        0,
        Math.min(snapPoints.length - 1, currentIdx + direction)
      )
      if (targetIdx === currentIdx) return

      isAnimating = true
      lenis.scrollTo(snapPoints[targetIdx], {
        duration: 1.4,
        easing: cubicEase,
        lock: true,
      })
      if (animatingTimer) clearTimeout(animatingTimer)
      animatingTimer = setTimeout(() => {
        isAnimating = false
      }, 1500)
    }

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      e.preventDefault()
      if (isAnimating) return
      if (Math.abs(e.deltaY) < 5) return
      goToDirection(e.deltaY > 0 ? 1 : -1)
    }

    const handleKey = (e) => {
      if (isAnimating) return
      if (
        e.key === 'ArrowDown' ||
        e.key === 'PageDown' ||
        e.key === ' '
      ) {
        e.preventDefault()
        goToDirection(1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goToDirection(-1)
      }
    }

    let touchStartY = 0
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }
    const handleTouchEnd = (e) => {
      if (isAnimating) return
      const delta = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(delta) > 40) goToDirection(delta > 0 ? 1 : -1)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKey)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      if (animatingTimer) clearTimeout(animatingTimer)
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <HeroSustainable />
      <CardsSection />
      <PortfolioSlider />
      <MissionVisionValues />
      <ContactSection />
    </>
  )
}

export default HomePage
