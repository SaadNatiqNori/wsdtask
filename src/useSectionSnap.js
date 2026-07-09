import { useEffect } from 'react'
import { cubicEase } from './easings'

// Per-section snap engine (used by the home page). Layers wheel/key/touch
// controls on top of the shared Lenis instance: each gesture snaps to the
// next/previous snap point.
// Snap points are the tops of every top-level <section> under #root (a
// <section> is one snap unit — nested sections inside it are not collected),
// with one extra point per viewport-height for multi-viewport sections.
// A section scrolls normally (free scroll) when the section BEFORE it is
// marked data-no-snap — the attribute is a boundary marker on the preceding
// section, not on the free section itself. A free section only gets
// alignment points at its start and end, and gestures inside it are not
// intercepted. Pass the Lenis instance to enable; pass null/undefined to
// disable.
export function useSectionSnap(lenis) {
  useEffect(() => {
    if (!lenis) return

    let isAnimating = false
    let animatingTimer = null

    const collectSections = () => {
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
      return sections
    }

    // The free-scrolling section is the one FOLLOWING a data-no-snap marker.
    const isFreeSection = (sections, i) =>
      i > 0 && sections[i - 1].hasAttribute('data-no-snap')

    const getSnapPoints = () => {
      const points = []
      const vh = window.innerHeight
      collectSections().forEach((section, i, sections) => {
        const top = section.getBoundingClientRect().top + window.scrollY
        if (isFreeSection(sections, i)) {
          // Free-scrolling section: align only to its start and end — the
          // space in between scrolls normally (see isFreeScrolling).
          points.push(Math.round(top))
          const end = top + section.offsetHeight - vh
          if (end > top + 1) points.push(Math.round(end))
        } else {
          const stages = Math.max(1, Math.round(section.offsetHeight / vh))
          for (let i = 0; i < stages; i++) {
            points.push(Math.round(top + i * vh))
          }
        }
      })
      return points
    }

    // True when the viewport is inside a free-scrolling section and a gesture
    // in `direction` stays inside it — that gesture should scroll normally.
    const isFreeScrolling = (direction) => {
      const vh = window.innerHeight
      const y = window.scrollY
      return collectSections().some((section, i, sections) => {
        if (!isFreeSection(sections, i)) return false
        const start = section.getBoundingClientRect().top + window.scrollY
        const end = start + section.offsetHeight - vh
        if (end <= start + 1) return false
        return direction > 0
          ? y >= start - 2 && y < end - 2
          : y > start + 2 && y <= end + 2
      })
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
      const direction = e.deltaY > 0 ? 1 : -1
      if (!isAnimating && isFreeScrolling(direction)) return
      e.preventDefault()
      if (isAnimating) return
      if (Math.abs(e.deltaY) < 5) return
      goToDirection(direction)
    }

    const handleKey = (e) => {
      if (isAnimating) return
      const down =
        e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' '
      const up = e.key === 'ArrowUp' || e.key === 'PageUp'
      if (!down && !up) return
      const direction = down ? 1 : -1
      if (isFreeScrolling(direction)) return
      e.preventDefault()
      goToDirection(direction)
    }

    let touchStartY = 0
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }
    const handleTouchEnd = (e) => {
      if (isAnimating) return
      const delta = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(delta) <= 40) return
      const direction = delta > 0 ? 1 : -1
      if (isFreeScrolling(direction)) return
      goToDirection(direction)
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
    }
  }, [lenis])
}

export default useSectionSnap
