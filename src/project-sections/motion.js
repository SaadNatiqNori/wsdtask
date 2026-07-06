// Returns true when the user (or environment) requests reduced motion.
// Section entrance animations early-return on this so content renders
// immediately — an accessibility win, and it keeps static rendering correct.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
