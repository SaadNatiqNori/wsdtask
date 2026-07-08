# Project page — banner scale-into-fullscreen reveal + page-wide snap

**Date:** 2026-07-08
**Status:** Approved design (pending spec review)
**Scope:** Section-driven project detail pages (`ProjectPage`, `src/project-sections/*`)

## Goal

Give section-driven project pages the home page's snap-scroll feel, and add a
scroll-driven "opening" animation to the Erbil Avenue page: the hero title and the
banner render together, and as the visitor scrolls the banner box scales up and
fills the viewport while the building image slides to center — one keyframe per
scroll gesture — before handing off to the (untouched) statement section.

## Keyframes (from the approved reference screenshots)

Mapped to Erbil Avenue's section list (`hero → banner → statement → gallery → location → features`):

- **KF1 — rest (no animation).** Hero title "Erbil Avenue" + lead paragraph
  centered; the dark rounded banner box begins low in the viewport with the
  building render (`AVENUE.jpg`) small, bottom-left. This is the current look and
  is considered "already done."
- **KF2 — mid.** Banner box scaled up (grows upward, bottom-anchored); hero title
  translated up toward the navbar. Both title and box on screen at once.
- **KF3 — end of scale.** Banner box fills the whole viewport (border-radius → 0);
  the building image has slid from bottom-left to vertical center and scaled to
  cover; the title has translated out.
- **KF4 — handoff.** The `statement` section ("Developed in collaboration with
  ALCOVE…") snaps in full screen. Everything from here on is unchanged.

## Approach (chosen: A — combined opening block)

The hero title/description and the banner box animate as **one pinned block** so
the title genuinely co-moves with the box (reproducing KF2). Rejected
alternative B (banner-only scale, hero as a separate section) because once the
page snaps past the hero, the KF2 "title + large box together" moment cannot
occur.

### Why a tall section + sticky stage, not ScrollTrigger `pin`

The home snap engine already supports multi-viewport sections: it emits **one
snap point per viewport-height** of a section
(`stages = Math.max(1, round(section.offsetHeight / vh))`, `HomePage.jsx`).
ScrollTrigger's `pin: true` injects a pin-spacer wrapper, so the pinned
`<section>`'s own `offsetHeight` stays ~1 viewport and the snap engine would miss
the scroll distance — snap points and keyframes would desync.

Instead the animation block is a **300vh `<section>`** containing a
**`position: sticky; top: 0; height: 100vh`** inner stage. The snap engine then
sees 3 stages and emits snap points at `top`, `top + 100vh`, `top + 200vh`. The
block's scrollable range is `300vh − 100vh = 200vh`, so a scrubbed `ScrollTrigger`
(`start: 'top top'`, `end: 'bottom bottom'`, `scrub: true`) maps timeline
progress `0 / 0.5 / 1` exactly onto those three snap points → **KF1 / KF2 / KF3**.
Each wheel/key/touch gesture snaps to the next point and the scrub glides the
timeline there. The next gesture snaps to the statement section (KF4).

## Components & changes

### 1. Shared snap hook — `useSectionSnap(lenis)`

Extract the snap engine currently inline in `HomePage.jsx` (the `getSnapPoints` /
`goToDirection` / wheel-key-touch listeners `useEffect`) into a reusable hook,
e.g. `src/useSectionSnap.js`.

- Behavior is identical to today's home implementation (same snap-point math,
  `lenis.scrollTo(..., { duration: 1.4, easing: cubicEase, lock: true })`, the
  `isAnimating` guard + 1500ms timer, and the wheel/key/touch handlers).
- `HomePage` is refactored to call the hook (no behavior change — verify home
  page still snaps exactly as before).
- `ProjectPage` calls the same hook for section-driven projects.

### 2. `ProjectPage` scroll model

- Section-driven projects switch `useScrollMode('native')` → `useScrollMode('home')`
  so the shared Lenis runs in home mode (programmatic engine, `smoothWheel: false`)
  and `useSectionSnap` can drive it.
- Remove the CSS proximity-snap effect (`document.documentElement.style.scrollSnapType = 'y proximity'`)
  for section-driven projects — JS snap replaces it, and CSS snap-type would fight
  programmatic `scrollTo`.
- Legacy (non-section) projects are unchanged (`useScrollMode(null)` → default
  smooth scroll).
- `scrollSnapAlign: 'start'` inline styles left on individual sections become
  no-ops without a `scroll-snap-type` ancestor; they may be left in place or
  removed as cleanup. Not load-bearing either way.

### 3. Opening reveal component — `ProjectOpening` (new)

A new component in `src/project-sections/` renders the combined block.

- **Input:** hero props (`title`, `description`, `project.icon`) + banner props
  (`image`, `alt`).
- **Structure:**
  - Outer `<section>` at `height: 300vh` (desktop; see responsive note), no
    `scrollSnapAlign` needed (JS snap owns it).
  - Inner sticky stage `sticky top-0 h-screen`, `overflow-hidden`, holding:
    - the title/description block (reusing the hero's markup/classes so KF1
      matches the current hero pixel-for-pixel), and
    - the banner box (reusing the banner's rounded/`bg-navy` box + image markup).
- **Scrub timeline** (GSAP, `scrollTrigger: { trigger: outer, start: 'top top', end: 'bottom bottom', scrub: true }`):
  - `0 → 0.5`: box scales up from rest size; title `y` translates up.
  - `0.5 → 1`: box → full viewport (width/height to `100vw/100vh`, inset/offset to
    0, `borderRadius` → 0); image translates from `bottom-0` to vertical center and
    scales to cover; title finishes translating up + fades.
  - Exact scale/translate values tuned against the screenshots during
    implementation; box expansion animates layout box (width/height + position)
    rather than `transform: scale` so the image and corners don't distort.
- **Easing:** the codebase `cubicEase` (`cubicBezier(0.66, 0, 0.34, 1)`) via the
  scrub; no per-tween ease needed under a linear scrub, but sub-tween shaping may
  use `cubicEase`.

### 4. Renderer pairing — `ProjectSections`

`src/project-sections/index.jsx` detects the pattern **`hero` immediately followed
by `banner` with `reveal: 'scale'`** and renders a single `ProjectOpening` in
their place, consuming both entries. Any other arrangement renders unchanged
(each section maps 1:1 to its component as today).

- If a `banner` has `reveal: 'scale'` but is **not** preceded by a `hero`, it
  falls back to the normal `ProjectBanner` (the pairing simply doesn't trigger) —
  no crash, graceful degrade.

### 5. `ProjectBanner` opt-in flag

`ProjectBanner` accepts a `reveal` prop. `reveal: 'scale'` is the opt-in marker
the renderer keys off; a standalone `ProjectBanner` (unpaired) with the flag keeps
today's fade-in behavior (the flag only changes rendering when paired with a
hero). No visual change to existing banners.

### 6. Data — `projects.js`

Erbil Avenue's `banner` section gains `reveal: 'scale'`. No other data changes;
the `hero` entry stays as-is and is consumed by the pairing.

## Reduced motion

When `prefersReducedMotion()` is true:

- `ProjectOpening` renders the **static KF1 layout** — the hero block and the
  banner box at rest — with **no** 300vh height, no sticky stage, and no scrub
  trigger. Effectively the current hero + banner stacked, single viewport flow.
- `useSectionSnap` keeps working (it is navigation, not decorative motion); this
  matches the home page, which does not disable snap under reduced motion.

## Responsive

- Scale/translate targets are viewport-relative (`100vw/100vh`, `vh`-based
  offsets), so the fill-the-screen end state holds across sizes.
- The 300vh block height is viewport-relative by construction.
- Verify the narrower mobile banner box scales cleanly to full-bleed and the
  image centers without overflow; adjust the image `object-fit`/scale target per
  breakpoint if needed.

## Explicitly out of scope ("do not touch other sections")

- `ProjectStatement`, `ProjectGallery`, `ProjectLocation`, `ProjectFeatures`,
  `ProjectOverview`, `ProjectServices`, `ContactSection` — no structural or
  animation changes. They only gain snap-target behavior via the page-wide snap
  model, which is the requested effect, not a modification to the sections
  themselves.

## Testing / verification

- **Home page regression:** after extracting `useSectionSnap`, confirm the home
  page snaps identically (wheel, arrow/PageUp-Down/Space, touch) with no double
  handlers.
- **Project page snap:** Erbil Avenue snaps one gesture per stage across all
  sections; no CSS-snap fighting; back-navigation resets to top.
- **Reveal keyframes:** KF1 rest matches current hero+banner; one gesture →
  KF2 (box scaled, title up); next → KF3 (fills screen, image centered); next →
  KF4 (statement). Reverse scroll runs cleanly in reverse.
- **Reduced motion:** static KF1, no hijack of the scale, snap still navigates.
- **Fallback:** a `banner{reveal:'scale'}` without a preceding hero renders as a
  normal banner.
- **Verify in-app** (browser) that the scrub stays in sync with snap and the
  image reaches full-bleed at KF3.

## Open implementation details (resolved during planning, not blockers)

- Exact scale/translate/border-radius keyframe values (tuned to screenshots).
- Whether to animate the box via width/height vs. a FLIP-style transform (leaning
  width/height + position to avoid image distortion).
- Whether to remove now-inert `scrollSnapAlign` inline styles as cleanup.
