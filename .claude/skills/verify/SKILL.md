---
name: verify
description: Build/launch/drive recipe for verifying changes to the Alcove React site at its browser surface
---

# Verifying alcove-react changes

## Launch

- Dev server: `npm run dev` (Vite). Check for an already-running instance first:
  `lsof -nP -iTCP -sTCP:LISTEN | grep node` — this repo's Vite is often already up
  (5173/5174/5175/5199 have all been seen; probe `curl -s localhost:<port>/ | grep title`
  → `<title>alcove-react` and confirm the process cwd with `lsof -p <pid> | awk '$4=="cwd"'`).
  Vite HMR picks up edits, so an existing server already serves your changes.
- Backend CMS API is Laravel at `../alcove-api`, usually on `127.0.0.1:8000` (php).
  Pages fall back to static data in `src/projects.js` when the API is down, so the
  site is drivable either way.
- Filament admin at `localhost:8000/admin` is drivable with the same chrome-devtools
  MCP (the persistent chrome profile is usually already logged in; else
  admin@alcove.com / password). Toggles are `switch` roles in the a11y snapshot —
  `fill` with "true"/"false", then click "Save changes". The success toast
  disappears fast; assert persistence via `php artisan tinker --execute=...` or the
  public API instead of waiting for it.

## Drive

- Browser: chrome-devtools MCP (`new_page`, `evaluate_script`, `take_screenshot`).
  If it errors with "browser is already running", check
  `~/.cache/chrome-devtools-mcp/chrome-profile/SingletonLock` — if the PID in the
  symlink target is dead, delete the `Singleton{Lock,Cookie,Socket}` symlinks and retry.
- Routes: `/` (home, section-snap scroll), `/projects` (list), `/projects/:slug`
  (project details, normal Lenis smooth scroll), `/about`, `/contact`, `/subsidiaries`.
  Known section-based slug: `erbil-avenue`.

## Scroll-behavior checks (the recurring gotcha area)

- Synthetic wheel events DO drive Lenis (it doesn't check `isTrusted`):
  `window.dispatchEvent(new WheelEvent('wheel', {deltaY: 120, cancelable: true, bubbles: true}))`
  then sample `window.scrollY` every ~100ms to observe easing.
- Smooth mode (project/content pages): a few ticks ease to an arbitrary Y.
  Snap mode (home): one tick lands exactly on a multiple of `innerHeight`.
- `window.scrollTo(0, y)` works for jumping; Lenis adopts the position.
- The project-page opening scale reveal is a ScrollTrigger scrub over a 300vh
  section; verify mid-scroll geometry via `[data-banner-box]` width/height/borderRadius.
- Cinematic opening only renders ≥768px and without reduced motion — resize to
  ~390px and confirm the static hero+banner fallback when touching ProjectOpening.
