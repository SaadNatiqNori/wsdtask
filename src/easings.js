// cubic-bezier(p1x, p1y, p2x, p2y) → GSAP-compatible easing function
export const cubicBezier = (p1x, p1y, p2x, p2y) => (t) => {
  if (t <= 0) return 0
  if (t >= 1) return 1
  let lo = 0
  let hi = 1
  let mid = t
  for (let i = 0; i < 18; i++) {
    mid = (lo + hi) / 2
    const x =
      ((1 - 3 * p2x + 3 * p1x) * mid + (3 * p2x - 6 * p1x)) * mid * mid +
      3 * p1x * mid
    if (x < t) lo = mid
    else hi = mid
  }
  return (
    ((1 - 3 * p2y + 3 * p1y) * mid + (3 * p2y - 6 * p1y)) * mid * mid +
    3 * p1y * mid
  )
}

export const cubicEase = cubicBezier(0.66, 0, 0.34, 1)
