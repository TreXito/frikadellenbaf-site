# Portfolio handover, 2026-10-12

Status: complete. Both dark redesigns are on `main` and live on their custom domains.

## Where to continue

- Personal site checkout: `/home/orc/websites/perssite`, [GitHub repository](https://github.com/TreXito/perssite).
- BAF project site checkout: `/home/orc/websites/frikadellenbaf-site`, [GitHub repository](https://github.com/TreXito/frikadellenbaf-site).
- The same `README.md` in each repository contains the plan, claim sources and progress log. Current state: 8 of 8 plan steps done.
- Shared Orc task: `/home/orc/.agents/tasks/finish-portfolio-review-and-github-pages-publica.md`.

Both local checkouts are on `main`. The reviewed branches were fast-forwarded into the public `main` branches.

## What is done

1. Reworked trexito.com into a personal portfolio for Philipp Podobri / TreXito, with real background, selected projects and verified links.
2. Reworked its Frikadellen BAF detail page as a project note. Reworked auctionflipper.bz into a dark SkyBlock inventory interface with the system, real panel screenshots, source and setup.
3. Removed fabricated uptime and earnings figures and the simulated live terminal from visible copy. Generated new favicon and social preview artwork for both sites.
4. Preserved both root `CNAME` files and the existing built-in GitHub Pages publication path.
5. Reviewed all three pages in Chromium at 1440, 768, 390 and 320 px. Fixed the BAF header overflow at 320 px, improved accent color contrast, corrected a timeline accessibility label and removed em dashes from page titles. Both sites now use dark palettes only, and new social preview images match them.
6. Updated both BAF pages to reflect the current project README's October 2026 advice against use because of recent bans. Verified that the Linux loader command resolves to an asset in the latest release, `build-20261008-db7a4f1`.

## Verification

- Browser check: 12 page/viewport combinations, zero horizontal overflow, zero failed images and zero request failures.
- axe checks: zero confirmed WCAG A/AA violations on all three pages at desktop and mobile widths. Diagram and hero text over patterned backgrounds required manual contrast review.
- Keyboard checks: first Tab reveals the skip link with a visible outline, and reduced-motion mode disables smooth scrolling on all three pages.
- Local link, image, metadata and heading audit: zero problems. Other checked public links returned HTTP 200; LinkedIn returned its automated-client status 999, so that profile cannot be verified by this client.

## Decisions to preserve

- Tone: specific, curious and modest. The owner asked for an artistic, nerdy personal site and a Minecraft cheats aesthetic for the BAF site. The chosen direction is dark SkyBlock inventory UI, with no bright mode on either site. No em dashes in site copy.
- Identity and history: the owner supplied the LinkedIn profile and confirmed the SAATBAU LINZ apprenticeship, 42 Wels study and HTL Leonding background. Powerlifting is one brief personal note. See `README.md` for links and dates.
- BAF metrics: the existing `flips.json` contains candidate or target values without dates or sale confirmation. Do not call them realised profit. A dated anonymized example is optional only when its source and definition are clear.
- The sites are static HTML/CSS with no build step. The BAF repo still contains old JavaScript and `flips.json`, but the new page does not load them. Do not delete them before reviewing whether anything else uses them.

## Publication evidence

1. [perssite Pages run](https://github.com/TreXito/perssite/actions/runs/38303882290) for commit `011c420` completed successfully.
2. [frikadellenbaf-site Pages run](https://github.com/TreXito/frikadellenbaf-site/actions/runs/38303882452) for commit `78405a8` completed successfully.
3. Both custom domains returned HTTP 200 for updated HTML, dark CSS and social preview PNGs on 2026-10-12. The live pages contained the redesigned headings and October 2026 ban advisory.

## Files changed in review

- perssite: `index.html`, `frikadellen-baf.html`, `styles.css`, `og.svg`, `og.png`, `README.md`, `HANDOVER.md`.
- frikadellenbaf-site: `index.html`, `style.css`, `favicon.svg`, `og.svg`, `assets/og.png`, `sitemap.xml`, `README.md`, `HANDOVER.md`.
