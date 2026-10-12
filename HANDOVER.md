# Portfolio handover, 2026-10-12

Status: complete. The reference-led revision is published from `main` in both repositories and verified on both custom domains.

## Current task

The owner said the first published sites looked generic, asked for Dribbble inspiration, and asked to use the cat profile photo from [TreXito on GitHub](https://github.com/TreXito). Both sites must stay dark. The BAF site should still feel connected to Minecraft SkyBlock.

- Personal checkout: `/home/orc/websites/perssite`.
- BAF checkout: `/home/orc/websites/frikadellenbaf-site`.
- Shared task file: `/home/orc/.agents/tasks/portfolio-dribbble-cat-redesign.md`.
- See the matching `README.md` in both repositories for fact sources, prior work and direct Dribbble references.

## Changes ready to publish

1. trexito.com now leads with Philipp Podobri's name, the GitHub cat photo, a real BAF panel screenshot, and simpler project and background sections. The BAF project note uses the same design.
2. auctionflipper.bz now uses its real control panel as the main visual, direct feature rows, further real screenshots, and a clearly visible October 2026 advisory against use because of recent bans.
3. Both social previews were regenerated from code-native SVG sources, with the cat photo on the personal preview and the real panel on the BAF preview.
4. The root `CNAME` files and built-in GitHub Pages configuration are unchanged.

## Verification

- Chromium reviewed all three pages at 1440, 768, 390 and 320 px: zero horizontal overflow and zero failed images.
- axe found zero confirmed WCAG A/AA violations at desktop and mobile widths. The BAF hero pattern prevents automatic contrast analysis; representative small text on that background exceeds 6.8:1 contrast.
- Keyboard first Tab reveals a visible skip link on all pages. Reduced motion disables smooth scrolling.
- Local links, image paths, page titles, descriptions, heading counts and image alt text passed the static audit. The current BAF README warning and release link were checked.

## Publication evidence

1. `perssite` was fast-forwarded to commit `8aa3efa`; [GitHub Pages run 38306319990](https://github.com/TreXito/perssite/actions/runs/38306319990) succeeded.
2. `frikadellenbaf-site` was fast-forwarded to commit `a6cc63e`; [GitHub Pages run 38306320888](https://github.com/TreXito/frikadellenbaf-site/actions/runs/38306320888) succeeded.
3. trexito.com and auctionflipper.bz returned HTTP 200 for the new HTML, CSS, GitHub cat images, panel screenshots and social preview PNGs on 2026-10-12. Both `CNAME` values were preserved.

## Constraints

- Keep the pages dark only. Avoid invented live results, profit claims, customer counts or uptime.
- The BAF repository README currently advises against using the software due to recent bans. Keep that advice visible near the top of the project site and in the personal project note.
- The BAF repo still contains old JavaScript and `flips.json`; the new page does not load them. Do not delete them without reviewing whether another consumer uses them.
