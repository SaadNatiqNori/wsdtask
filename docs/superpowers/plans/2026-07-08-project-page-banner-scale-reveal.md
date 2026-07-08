# Project Page — Banner Scale Reveal + Page-Wide Snap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give section-driven project pages the home page's one-gesture-per-stage snap scrolling, and add a scroll-driven "opening" where the hero title + banner image scale up to fill the viewport before handing off to the statement section.

**Architecture:** Extract the home page's JS snap engine into a shared `useSectionSnap(lenis)` hook and run it on the project page (Lenis in `home` mode). Pair the Erbil `hero` + `banner{reveal:'scale'}` into one `ProjectOpening` component: a 300vh `<section>` with a `sticky` 100vh stage. The snap engine emits 3 snap points (one per viewport-height) that line up exactly with a scrubbed GSAP timeline's keyframes (kf1/kf2/kf3), so each scroll gesture glides to the next keyframe. No ScrollTrigger `pin` (its spacer would break the snap-point math).

**Tech Stack:** React 19, react-router-dom 7, GSAP 3.14 (+ ScrollTrigger), Lenis 1.3, Tailwind 3.4, Vite 5.

## Global Constraints

- **No unit-test runner exists** in this repo (scripts: `dev`, `build`, `lint`, `preview`). Verification for every task is: `npm run lint` (clean for touched files), `npm run build` (succeeds), and in-browser checks via `npm run dev`. There is no `pytest`/`vitest` step — do not invent one.
- **Do not modify other sections.** `ProjectStatement`, `ProjectGallery`, `ProjectLocation`, `ProjectFeatures`, `ProjectOverview`, `ProjectServices`, `ContactSection` must not change. They only gain snap-target behavior from the page-wide snap model.
- **Respect reduced motion** via the existing `prefersReducedMotion()` from `src/project-sections/motion.js`.
- **Reuse existing helpers:** `cubicEase` from `src/easings.js`; the shared Lenis via `useLenis()` / `useScrollMode()` from `src/SmoothScroll.jsx`.
- **Match existing style conventions:** Tailwind classes + inline `fontFamily` for the `Season Mix-TRIAL` / `Season Sans-TRIAL` fonts, exactly as the current hero/banner do.
- **Preserve home page behavior exactly** when extracting the snap engine — same timings (`duration: 1.4`, `easing: cubicEase`, `lock: true`), same 1500ms guard, same wheel/key/touch handlers.
- Erbil Avenue lives at route `/projects/erbil-avenue`.

---

## File Structure

- **Create** `src/useSectionSnap.js` — the shared snap hook (extracted verbatim from HomePage's inline effect). One responsibility: hijack wheel/key/touch and animate one stage per gesture via Lenis.
- **Modify** `src/HomePage.jsx` — replace the inline snap `useEffect` with a call to the hook (no behavior change).
- **Modify** `src/ProjectPage.jsx` — section-driven projects switch to `home` scroll mode + `useSectionSnap`; remove the CSS proximity-snap effect.
- **Create** `src/project-sections/ProjectOpening.jsx` — the combined hero+banner scroll-driven reveal.
- **Modify** `src/project-sections/index.jsx` — pair `hero` + `banner{reveal:'scale'}` → `ProjectOpening`; everything else renders 1:1 as today.
- **Modify** `src/projects.js` — add `reveal: 'scale'` to Erbil Avenue's `banner` section.

`ProjectBanner.jsx` is intentionally **not** modified: an unpaired banner that still carries `reveal:'scale'` renders through the normal `ProjectBanner`, which ignores the extra prop (React does not spread unknown component props onto the DOM).

---

## Task 1: Extract `useSectionSnap` hook and refactor HomePage

**Files:**
- Create: `src/useSectionSnap.js`
- Modify: `src/HomePage.jsx`

**Interfaces:**
- Produces: `useSectionSnap(lenis)` — a React hook. `lenis` is the shared Lenis instance (or `null`). No-op until `lenis` is truthy. Returns nothing. Registers global wheel/keydown/touchstart/touchend listeners and cleans them up on unmount / `lenis` change.

- [ ] **Step 1: Create the hook file with the engine extracted verbatim from HomePage**

Create `src/useSectionSnap.js`:

```jsx
import { useEffect } from 'react'
import { cubicEase } from './easings'

// Home-page-style section snap. Hijacks wheel / keys / touch and animates a
// single "stage" per gesture via Lenis (used purely as a programmatic scroll
// engine — home mode has smoothWheel off). A stage is one viewport-height, so a
// tall section (e.g. a 300vh scroll-driven block) contributes one snap point per
// viewport-height and snaps keyframe-by-keyframe. No-op until `lenis` is ready.
export function useSectionSnap(lenis) {
  useEffect(() => {
    if (!lenis) return

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
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
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
    }
  }, [lenis])
}
```

- [ ] **Step 2: Replace HomePage's inline effect with the hook**

In `src/HomePage.jsx`, delete the entire snap `useEffect` block (the one containing `getSnapPoints` / `goToDirection` / the wheel-key-touch listeners) and its now-unused imports. Replace the top of the file and the component body so it reads:

```jsx
import { useLenis } from './SmoothScroll'
import { useSectionSnap } from './useSectionSnap'
import HeroSustainable from './HeroSustainable'
import CardsSection from './CardsSection'
import PortfolioSlider from './PortfolioSlider'
import MissionVisionValues from './MissionVisionValues'
import ContactSection from './ContactSection'

function HomePage() {
  // The home page shares the app-wide Lenis instance (configured in home mode:
  // smoothWheel off), and layers section-snap on top of it.
  const lenis = useLenis()
  useSectionSnap(lenis)

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
```

Note: the `useEffect` and `cubicEase` imports are removed from HomePage (they now live in the hook).

- [ ] **Step 3: Lint the touched files**

Run: `npm run lint`
Expected: no new errors for `src/useSectionSnap.js` or `src/HomePage.jsx`. (Fix any unused-import warnings the removal introduced.)

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify the home page still snaps identically**

Run: `npm run dev`, open the site root (`/`). Confirm:
- Mouse wheel advances exactly one stage per gesture (Hero → Cards → Portfolio → Mission → Contact, plus any per-viewport stages inside tall sections).
- Arrow Down/Up, PageDown/PageUp, and Space snap the same way.
- No double-jump (which would indicate two handler sets registered).

Expected: behavior is indistinguishable from before the refactor.

- [ ] **Step 6: Commit**

```bash
git add src/useSectionSnap.js src/HomePage.jsx
git commit -m "refactor: extract home snap engine into useSectionSnap hook"
```

---

## Task 2: Project page adopts page-wide JS snap

**Files:**
- Modify: `src/ProjectPage.jsx`

**Interfaces:**
- Consumes: `useSectionSnap(lenis)` (Task 1); `useLenis()`, `useScrollMode()` from `src/SmoothScroll.jsx`.

- [ ] **Step 1: Switch section-driven projects to home mode + section snap; drop CSS proximity snap**

In `src/ProjectPage.jsx`:

1. Update the imports at the top so the SmoothScroll import includes `useLenis`, and add the hook import:

```jsx
import { useLenis, useScrollMode } from './SmoothScroll'
import { useSectionSnap } from './useSectionSnap'
```

2. Replace the scroll-mode line and the CSS proximity-snap effect. Delete this existing block entirely:

```jsx
  // Section layouts use CSS proximity scroll-snap, which fights Lenis smooth
  // wheel — so these pages opt out of the app-wide smooth scroll and run native
  // scroll. Legacy (non-section) projects keep the default smooth scrolling.
  useScrollMode(project?.sections ? 'native' : null)

  // Full-page sections (min-h-screen) carry `scroll-snap-align: start`; enabling
  // proximity snap on the scroll root makes them snap into view like the home
  // page while the shorter content sections keep normal free scroll. Scoped to
  // this page (and only the section-driven layout) and reset on unmount.
  useEffect(() => {
    if (!project?.sections) return
    const el = document.documentElement
    el.style.scrollSnapType = 'y proximity'
    return () => {
      el.style.scrollSnapType = ''
    }
  }, [project])
```

and replace it with:

```jsx
  // Section-driven pages use the home page's snap engine: Lenis in `home` mode
  // (a programmatic scroll engine, smoothWheel off) plus the JS wheel/key/touch
  // snap. This replaces the old CSS proximity snap, which fought programmatic
  // scrollTo. Legacy (non-section) projects keep default smooth scrolling.
  useScrollMode(project?.sections ? 'home' : null)
  const lenis = useLenis()
  useSectionSnap(project?.sections ? lenis : null)
```

3. Remove `useEffect` from the React import if it is now unused (the file keeps `useLayoutEffect` and `useRef`). The top import line becomes:

```jsx
import { useLayoutEffect, useRef } from 'react'
```

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no new errors in `src/ProjectPage.jsx` (in particular, no `useEffect`/unused-var warnings).

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Verify project page snaps like home**

Run: `npm run dev`, open `/projects/erbil-avenue`. Confirm:
- Wheel/keys/touch advance one stage per gesture through all sections (hero/banner, statement, gallery, location, features, contact).
- No CSS-snap "tug" fighting the animated scroll.
- Navigating away and back (e.g. to `/projects` and back) resets to the top.
- A legacy project (any slug without `sections`, e.g. `/projects/second-avenue`) still scrolls with normal smooth scrolling — no snap hijack.

Expected: project page feels like the home page's snap; legacy pages unchanged.

- [ ] **Step 5: Commit**

```bash
git add src/ProjectPage.jsx
git commit -m "feat: page-wide section snap on section-driven project pages"
```

---

## Task 3: Pair hero + banner into `ProjectOpening` (structure + reduced-motion, no scrub yet)

**Files:**
- Create: `src/project-sections/ProjectOpening.jsx`
- Modify: `src/project-sections/index.jsx`
- Modify: `src/projects.js`

**Interfaces:**
- Produces: `ProjectOpening({ hero, banner, project })` — default export. `hero` is the hero section object (`{ type, title, description, ornament? }`), `banner` is the banner section object (`{ type, image, alt, reveal }`), `project` is the project (for `project.icon`). Renders a 300vh section with a sticky 100vh stage. Exposes internal refs (`rootRef`, `stageRef`, `titleRef`, `boxRef`, `imageRef`) that Task 4's timeline drives.
- Consumes (renderer): a `hero` section immediately followed by a `banner` with `reveal === 'scale'`.

- [ ] **Step 1: Create `ProjectOpening` with the combined layout and reduced-motion branch (no animation effect yet)**

Create `src/project-sections/ProjectOpening.jsx`:

```jsx
import { useRef } from 'react'
import { prefersReducedMotion } from './motion'
import ornamentSrc from '../assets/projectpagebreak.svg'

// hero + banner{reveal:'scale'} rendered as one scroll-driven "opening".
// Layout: a 300vh section with a sticky 100vh stage. The home snap engine emits
// 3 snap points (kf1/kf2/kf3); Task 4 adds the scrubbed timeline that lifts the
// title and scales the banner box to fill the viewport as the image centers.
//
// Under reduced motion we render a static, single-screen stack (title + banner
// at rest) with no tall section, no sticky, and no scroll hijack.
function ProjectOpening({ hero, banner, project }) {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const titleRef = useRef(null)
  const boxRef = useRef(null)
  const imageRef = useRef(null)
  const icon = project?.icon
  const showOrnament = hero?.ornament !== false || Boolean(icon)
  const reduce = prefersReducedMotion()

  const TitleBlock = (
    <div ref={titleRef} className="w-full max-w-[900px] px-6 text-center">
      {showOrnament && (
        <img
          src={icon || ornamentSrc}
          alt=""
          aria-hidden="true"
          className={
            icon
              ? 'mx-auto h-[46px] md:h-[56px] w-auto select-none object-contain'
              : 'mx-auto h-[46px] w-[88px] select-none'
          }
          draggable="false"
        />
      )}
      <h1
        className="m-0 mt-9 text-[54px] md:text-[84px] font-normal leading-[0.98] tracking-[-0.02em] text-[#1C1F2A]"
        style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
      >
        {hero.title}
      </h1>
      {hero.description && (
        <p className="mx-auto m-0 mt-7 max-w-[640px] text-[15px] md:text-[16px] leading-[1.55] tracking-[0] text-[#5B6473]">
          {hero.description}
        </p>
      )}
    </div>
  )

  // Reduced motion: static hero + banner, normal flow.
  if (reduce) {
    return (
      <section className="bg-[#E6EBF0] px-6 md:px-10 pt-[150px] md:pt-[188px]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center">
          {TitleBlock}
          <div
            className="relative mt-[52px] md:mt-[68px] w-full overflow-hidden rounded-[8px] bg-navy"
            style={{ aspectRatio: '16 / 5' }}
          >
            {banner.image && (
              <img
                src={banner.image}
                alt={banner.alt || ''}
                className="absolute bottom-0 h-[250px] w-full object-contain"
              />
            )}
          </div>
        </div>
      </section>
    )
  }

  // Animated: 300vh section + sticky 100vh stage. Title sits in the upper area;
  // the banner box is bottom-anchored and horizontally centered (Task 4 animates
  // both). Initial box geometry is set inline so Task 4 can tween width/height.
  return (
    <section ref={rootRef} className="relative h-[300vh] bg-[#E6EBF0]">
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute left-1/2 top-[28vh] -translate-x-1/2">
          {TitleBlock}
        </div>

        <div
          ref={boxRef}
          className="absolute left-1/2 bottom-0 -translate-x-1/2 overflow-hidden rounded-[8px] bg-navy"
          style={{ width: 'min(1200px, calc(100% - 48px))', height: '36vh' }}
        >
          {banner.image && (
            <img
              ref={imageRef}
              src={banner.image}
              alt={banner.alt || ''}
              className="absolute bottom-0 left-0 h-[250px] w-full object-contain"
              style={{ transformOrigin: 'center bottom' }}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default ProjectOpening
```

- [ ] **Step 2: Add the pairing logic to the renderer**

In `src/project-sections/index.jsx`, add the import and replace the `ProjectSections` function. First add near the other imports:

```jsx
import ProjectOpening from './ProjectOpening'
```

Then replace the whole `ProjectSections` export with:

```jsx
// Renders an ordered list of section objects (as returned by the CMS/backend).
// Special case: a `hero` immediately followed by a `banner` with
// `reveal: 'scale'` is paired into one scroll-driven ProjectOpening block.
export function ProjectSections({ sections = [], project }) {
  const elements = []
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const next = sections[i + 1]

    if (
      section.type === 'hero' &&
      next?.type === 'banner' &&
      next.reveal === 'scale'
    ) {
      elements.push(
        <ProjectOpening
          key={section.id ?? `opening-${i}`}
          hero={section}
          banner={next}
          project={project}
        />
      )
      i++ // consume the paired banner
      continue
    }

    const Component = SECTION_COMPONENTS[section.type]
    if (!Component) {
      if (import.meta.env.DEV) {
        console.warn(`[ProjectSections] Unknown section type: "${section.type}"`)
      }
      continue
    }
    elements.push(
      <Component
        key={section.id ?? `${section.type}-${i}`}
        index={i}
        project={project}
        {...section}
      />
    )
  }

  return <>{elements}</>
}
```

Leave the `SECTION_COMPONENTS` map and the default export as they are.

- [ ] **Step 3: Add the opt-in flag to Erbil Avenue's banner**

In `src/projects.js`, in the `erbil-avenue` project's `sections`, update the `banner` entry to add `reveal: 'scale'`:

```jsx
      {
        type: 'banner',
        reveal: 'scale',
        image: avenueRender,
        alt: 'Erbil Avenue — entrance render',
      },
```

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no new errors in the three files.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Verify structure + fallback in-browser**

Run: `npm run dev`, open `/projects/erbil-avenue`. Confirm:
- The opening renders the ornament, "Erbil Avenue" title, description, and the dark banner box together (kf1-like rest look). The title is NOT duplicated (no separate hero section above).
- The section is tall: scrolling advances through 3 snap stages that currently all show the same frozen stage (animation is added in Task 4), then reaches the statement section.
- Toggle OS "Reduce motion" on and reload: the opening renders as a static single-screen hero + banner (no 300vh, no sticky), and the statement follows normally.
- Sanity fallback: temporarily confirm (by reading the code path) that a `banner{reveal:'scale'}` NOT preceded by a hero would fall through to the normal `ProjectBanner`. (No code change; this is the `continue`/map path.)

Expected: combined kf1 layout shows correctly; reduced-motion static path works.

- [ ] **Step 7: Commit**

```bash
git add src/project-sections/ProjectOpening.jsx src/project-sections/index.jsx src/projects.js
git commit -m "feat: pair hero + scale-reveal banner into ProjectOpening block"
```

---

## Task 4: Add the scrubbed scale timeline (kf1 → kf2 → kf3)

**Files:**
- Modify: `src/project-sections/ProjectOpening.jsx`

**Interfaces:**
- Consumes: the refs created in Task 3 (`rootRef`, `titleRef`, `boxRef`, `imageRef`); `prefersReducedMotion()`; GSAP + ScrollTrigger.

- [ ] **Step 1: Add the GSAP/ScrollTrigger imports and register the plugin**

In `src/project-sections/ProjectOpening.jsx`, update the top imports to add:

```jsx
import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './motion'
import ornamentSrc from '../assets/projectpagebreak.svg'

gsap.registerPlugin(ScrollTrigger)
```

(`useLayoutEffect` is added to the existing `react` import; `useRef` stays.)

- [ ] **Step 2: Add the scrubbed timeline effect**

Inside the `ProjectOpening` component, immediately after the `const reduce = prefersReducedMotion()` line, add the effect. It early-returns under reduced motion (that branch renders the static layout and never mounts these refs):

```jsx
  // Scrubbed master timeline mapped onto the 200vh scroll range of the 300vh
  // section: progress 0 = kf1, 0.5 = kf2, 1 = kf3, aligned with the snap
  // engine's 3 snap points. The box grows via width/height (not transform scale)
  // so its aspect can change from the rest bar to a full-viewport fill without
  // distorting the image. Numeric constants are tuned in-browser against the
  // reference screenshots.
  useLayoutEffect(() => {
    if (reduce || !rootRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })

      // Phase 1 (kf1 → kf2): box grows upward, title lifts, image eases up.
      tl.to(boxRef.current, { height: '78vh', duration: 0.5 }, 0)
        .to(titleRef.current, { yPercent: -55, duration: 0.5 }, 0)
        .to(imageRef.current, { scale: 1.2, duration: 0.5 }, 0)

      // Phase 2 (kf2 → kf3): box fills the viewport, image centers + covers,
      // title lifts out and fades.
      tl.to(
        boxRef.current,
        { width: '100vw', height: '100vh', borderRadius: 0, duration: 0.5 },
        0.5
      )
        .to(
          imageRef.current,
          { scale: 2.2, yPercent: -34, duration: 0.5 },
          0.5
        )
        .to(
          titleRef.current,
          { yPercent: -150, autoAlpha: 0, duration: 0.5 },
          0.5
        )
    }, rootRef)
    return () => ctx.revert()
  }, [reduce])
```

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Verify + tune the keyframes in-browser**

Run: `npm run dev`, open `/projects/erbil-avenue`. Step through with the wheel (one gesture per stage) and confirm against the four reference screenshots:
- **kf1:** title centered-ish, banner box low with the render small at the bottom (rest).
- **One gesture → kf2:** box has scaled up (grown upward), title pushed up; both on screen.
- **Next gesture → kf3:** box fills the whole viewport (corners squared off), the building image has moved to vertical center and scaled to cover; title gone.
- **Next gesture → kf4:** the statement section ("Developed in collaboration with ALCOVE…") snaps in full screen.
- Scroll back up: the animation runs cleanly in reverse.
- Resize the window / check a mobile width: the box still reaches full-bleed at kf3 and the image centers without overflowing.

Tune the constants (`78vh`, `yPercent`/`scale` values, `top-[28vh]`, initial `36vh` height from Task 3) until the three animated frames match the screenshots. These numbers are expected to need adjustment — that is the purpose of this step.

- [ ] **Step 6: Verify reduced motion still bypasses the animation**

Toggle OS "Reduce motion" on, reload `/projects/erbil-avenue`. Confirm the opening is the static single-screen hero + banner with no scaling and no scroll hijack of the box, and snapping still navigates section to section.

Expected: no scale animation under reduced motion; page still usable.

- [ ] **Step 7: Commit**

```bash
git add src/project-sections/ProjectOpening.jsx
git commit -m "feat: scrubbed scale-into-fullscreen reveal on ProjectOpening"
```

---

## Self-Review

**1. Spec coverage** (against `docs/superpowers/specs/2026-07-08-project-page-banner-scale-reveal-design.md`):
- Shared snap hook `useSectionSnap` + HomePage refactor → Task 1. ✓
- Project page → `home` mode + snap, remove CSS proximity snap → Task 2. ✓
- 300vh + sticky stage (not ScrollTrigger pin), 3 snap points ↔ kf1/kf2/kf3 → Tasks 3 & 4. ✓
- Combined opening (title folded in, co-animates) → Tasks 3 & 4. ✓
- Opt-in `reveal:'scale'` on banner + renderer pairing + fallback → Task 3. ✓
- Data change on Erbil banner → Task 3. ✓
- Reduced motion static kf1, snap still active → Tasks 3 (static branch) & 4 (effect early-return). ✓
- Responsive fill/verify → Task 4 Step 5. ✓
- "Do not touch other sections" → no task modifies statement/gallery/location/features/overview/services/contact. ✓
- Testing/verification (home regression, project snap, keyframes, reduced motion, fallback, in-browser) → Task steps. ✓

**2. Placeholder scan:** No "TBD"/"handle edge cases"/"similar to Task N". Full code is shown in every code step. The tunable animation constants in Task 4 are concrete starting values with an explicit in-browser tuning step (the nature of animation work), not placeholders.

**3. Type/name consistency:** `useSectionSnap(lenis)` signature identical in Tasks 1/2. `ProjectOpening({ hero, banner, project })` and its refs (`rootRef`, `stageRef`, `titleRef`, `boxRef`, `imageRef`) are created in Task 3 and used by the same names in Task 4. Renderer keys off `section.type === 'hero'` + `next.type === 'banner'` + `next.reveal === 'scale'`, matching the `reveal: 'scale'` data added in Task 3 Step 3. Consistent.
