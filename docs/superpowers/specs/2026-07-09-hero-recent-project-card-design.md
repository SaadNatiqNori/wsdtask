# Hero "Recent Projects" card — CMS-driven

**Date:** 2026-07-09
**Repos:** `alcove-api` (Laravel + Filament CMS), `alcove-react` (frontend)

## Problem

The bottom-right card in the home hero ("RECENT PROJECTS / 2nd Avenue") is static.
The React component (`HeroSustainable.jsx`) already renders `hero.featured`
(eyebrow, title, image, slug) from `GET /api/content/home`, but that payload
comes from the `site_contents` JSON blob, so the card never reflects the
projects table. The admin has no way to pick which project appears there.

## Design

### Data model (alcove-api)

- New boolean column `recent` on `projects` (default `false`), added after
  `featured` — mirroring how `featured` drives the home portfolio slider.
- `Project` model: add `recent` to `$fillable` and boolean `$casts`.
- **Single-recent rule:** exactly one project can be "recent" at a time. On
  `saved`, if the project has `recent = true`, all other projects are quietly
  set to `recent = false` (query-builder `update()`, so no event recursion).
  Enforced at the model level so it holds for Filament, tinker, and any other
  write path.

### Filament admin

- **Form** (`ProjectForm`): a `Toggle::make('recent')` labelled
  "Show in hero Recent Projects card", next to the existing
  "Show on home portfolio" toggle. Helper text explains only one project can
  be recent and that enabling it un-flags the previous one.
- **Table** (`ProjectsTable`): boolean `IconColumn::make('recent')` labelled
  "Recent", consistent with the existing `published` icon column, so the admin
  can see at a glance which project is the recent one.

### Public API (alcove-api)

- `ContentController::page('home')`: after loading the stored content, overlay
  `hero.featured` with the recent project (`published = true`, `recent = true`,
  latest `updated_at` wins if data ever drifts to multiple):
  - `title` ← project title
  - `slug` ← project slug
  - `image` ← the project's first **banner** section image (the stroke-width-1
    line-art SVG, which matches the card's aesthetic). If the project has no
    banner section, `image` stays unset and the frontend keeps its built-in
    fallback art.
  - `eyebrow` is kept from the stored site content ("RECENT PROJECTS"), still
    editable via the Pages editor.
  - Overlay happens **before** `transformMedia()`, so the banner path is
    rewritten to an absolute URL like every other media field.
- If no project is flagged, the stored `hero.featured` is returned unchanged —
  existing behaviour, zero frontend risk.
- `ProjectResource` also exposes `recent` for consistency with `featured`.

### Frontend (alcove-react)

- No data-fetch changes: the card already consumes `hero.featured`.
- The card becomes a `react-router` `<Link>` to `/projects/{hero.featured.slug}`
  (the arrow icon already implies navigation). Renders as a plain div-like block
  when no slug is present. GSAP animation refs unchanged (`Link` forwards refs).

### Testing

- New `RecentProjectTest` (feature, follows `ProjectSaveTest` patterns):
  1. Flagging project B un-flags project A (single-recent rule).
  2. `GET /api/content/home` returns the flagged project's title/slug in
     `hero.featured`, with the stored eyebrow preserved.
  3. With no project flagged, the stored featured block is returned untouched.
- Existing suite (`php artisan test`) must stay green.

## Rejected alternatives

- **Separate `/api/projects/recent` endpoint + extra frontend fetch** — more
  moving parts, second network round-trip, and the hero already has a clean
  content seam via `hero.featured`.
- **Filament `ToggleColumn` in the table** — the request was a status column;
  the boolean icon column matches the existing table style.
- **Falling back to `cover_image` for the card art** — photos clash with the
  card's line-art aesthetic; the built-in SVG fallback is safer.
