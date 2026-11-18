# Handover, 2026-11-18

Status: liquid glass redesign on branch `redesign/liquid-glass`, opened as a PR. Not merged. Merging to `main` deploys through GitHub Pages.

## What changed

1. Visual system moved from green phosphor to liquid glass, matching trexito.com and the BAF web panel: Geist fonts, aurora background, glass cards, segmented install tabs, grouped FAQ.
2. Motion: Lenis inertial scroll driven by the GSAP ticker; the pinned hero and flip stepper are unchanged in behavior.
3. Ban advisory references removed from the install section and footer.
4. Screenshots regenerated as WebP. The old PNGs showed real account names and are deleted. Panel and Discord shots use demo data and are labeled as such on the page.
5. `assets/og.png` re-rendered from `tools/og.html`.

## Constraints

- Keep `CNAME` and the built-in Pages setup unchanged.
- Keep the filename `assets/og.png` (linked from the panel repo).
- Follow the privacy rules in [README.md](README.md) for any new text or image.
- Avoid invented live results, customer counts or uptime. Numbers come from `flips.json` or the replayed log.
- `tools/smoke.js` must pass after any change to `main.js` or `terminal.js`.
