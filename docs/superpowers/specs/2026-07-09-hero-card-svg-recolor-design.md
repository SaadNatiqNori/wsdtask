# Hero card SVG recolouring — card-only colour overrides

**Date:** 2026-07-09
**Repos:** `alcove-api` only (no frontend changes)
**Builds on:** 2026-07-09-hero-recent-project-card-design.md

## Problem

The hero "Recent Projects" card sits on a light frosted-glass background. A
project's banner SVG may use colours that don't read well there. The admin
needs to recolour the artwork **for the card only** — project details, the
all-projects page, and the portfolio slider must keep the original colours.

## Design (approved: derived-copy approach)

### Data model

- New nullable JSON column `card_colors` on `projects`: a list of
  `{from, to}` pairs, `from` being a colour token detected in the banner SVG
  (hex, `rgb()`, or named), `to` the admin's replacement.

### Colour detection & application — `App\Support\SvgRecolor`

- `detect(string $svg): string[]` — distinct paint colours in document order.
  Scans `stroke`, `fill`, `stop-color`, `color` in attribute (`fill="…"`) and
  style (`fill:…`) positions. Ignores `none`, `transparent`, `currentColor`,
  `inherit`, and `url(#…)` paint refs. Dedupes case-insensitively.
- `apply(string $svg, array $map): string` — replaces each `from` with `to`
  only in those paint positions (regex bound to the property context, never a
  blind string replace), case-insensitive, word-bounded so `#abc` can't eat
  into `#abcdef`.
- `toHex(string $color): string` — common named colours → hex so the Filament
  colour picker shows a swatch; unknown tokens pass through.
- Derived-file lifecycle:
  - `cardPath(Project): string` → `projects/card/{id}.svg` (id-based, stable
    across slug renames).
  - `regenerate(Project): void` → if the project has a banner image and at
    least one effective override (`from ≠ to`), write the recoloured copy;
    otherwise delete any stale derived file. Called from `Project::saved`
    **only when** `card_colors` (or `sections`, while overrides exist)
    actually changed — so unrelated saves and test seeding never touch disk.

### Project model

- `card_colors` in `$fillable` + array cast.
- `bannerImagePath(): ?string` helper (first banner block's image), shared by
  the recolour service and `ContentController` (replacing the inline lookup
  added in the previous feature).

### Filament form

A "Hero card colours" section on the Details tab, visible only while the
"Show in hero Recent Projects card" toggle is on (toggle becomes `live()`):

- **"Detect colours from banner SVG"** action button. Reads the banner from
  the *current form state* — works on a freshly-uploaded temporary file
  before save, or the stored file for existing projects. Fills the repeater
  with one row per detected colour, preserving any `to` values the admin has
  already customised. Warns via notification if there's no banner SVG yet.
- Repeater of rows: read-only `from` + `ColorPicker` `to` (live, debounced).
  Rows are not manually addable — detection owns the list.
- **Live preview**: the recoloured SVG rendered as a base64 `<img>` (no
  script execution) on a swatch approximating the hero card background
  (`#D1D8E0`), re-rendering as colours change — the admin sees the card
  artwork before saving.

### Public API

- The home-content overlay picks `projects/card/{id}.svg` when it exists,
  else the original banner. Nothing else in the API changes, so the project
  detail page, projects list, and portfolio slider keep serving the original
  file — unaffected by construction.

### Testing

- Unit-style: `detect` finds attribute/style/named colours and skips
  `none`/`currentColor`/`url()`; `apply` replaces in paint positions only,
  case-insensitively, without partial-hex bleed.
- Feature (Storage::fake): saving `card_colors` writes the derived file with
  replaced colours; clearing them deletes it; the home overlay serves the
  derived URL when present and the original otherwise.

## Rejected alternatives

- **Recolour at request time** — no files to manage but a transform on every
  home-page load; declined by user in favour of derived copy.
- **Dedicated card-image upload** — least code but manual export per project,
  no in-CMS colour editing.
- **Frontend CSS recolouring** — requires inlining arbitrary SVGuploads into
  the DOM and only works when artwork uses CSS-variable-friendly paints.
