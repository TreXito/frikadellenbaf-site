# TreXito portfolio

[trexito.com](https://trexito.com/) and [auctionflipper.bz](https://auctionflipper.bz/) share one hand-built green-phosphor design system: no framework, static HTML/CSS/JS.

**Current state (Oct 2026):** both sites run the green-phosphor design, rebuilt without the invented figures the old version had. The BAF hero terminal replays real log lines; its footer counters total what the replay has actually shown, and a log walker steps through the real flips.json. `flips.json` itself comes from the LIVE baf-backend on TrueNAS (the `events` table in `baf.sqlite`): 400 realized sales, buy+sell paired, bought price / sale price / realized profit / buySpeedMs / finder. Refresh it with `tools/export-flips.py` (needs `ssh truenas` key access). Backend totals at last export: 37,805 profitable sales · 232.3B realized · biggest single flip +2.16B. The README ban-wave advisory stays as a slim banner.

The notes below document the earlier coordinated redesign (kept for the fact/source table).

See [HANDOVER.md](HANDOVER.md) for earlier review decisions and publication evidence.

## Intent

Make trexito.com a personal portfolio and auctionflipper.bz a recognisable Minecraft SkyBlock automation project site. Both sites use dark palettes only. Keep the useful information and direct source links. Avoid generic agency copy, simulated live figures and unverified earnings claims.

- `TreXito/perssite`: Philipp Podobri's personal portfolio, with selected projects, background and contact links.
- `TreXito/frikadellenbaf-site`: a deeper look at Frikadellen BAF, with system notes, actual interface screenshots, source and setup.

## Facts and sources

| Claim | Source |
| --- | --- |
| Philipp Podobri uses the TreXito handle | Owner confirmation; [LinkedIn](https://www.linkedin.com/in/philipp-podobri-b92806421/) and [GitHub](https://github.com/TreXito) |
| IT system technician apprenticeship at SAATBAU LINZ eGen, March 2022 to February 2026 | Owner-supplied LinkedIn details |
| Studying at 42 Wels from October 2026; previously IT Medientechnik at HTL Leonding | Owner-supplied LinkedIn details |
| Frikadellen BAF is an open source Rust SkyBlock automation project with AH, Bazaar, panel and Discord features | [Project README](https://github.com/TreXito/frikadellen-baf-121) |
| Sky Watch is a self-hostable flight tracker | [Repository](https://github.com/TreXito/Skywatch) |
| AzaleaPathfinder is a custom pathfinding fork | [Repository](https://github.com/TreXito/AzaleaPathfinder) |
| Powerlifting is a personal interest | Owner confirmation; [competition record](https://www.openpowerlifting.org/dist/openipf/m/oevk/2609/by-goodlift) |

The old personal page contained fixed uptime, flip and profit figures without a verifiable source. The old BAF page mixed a simulated live terminal with promises about results. The redesign removes those figures. A dated, anonymized project data example can be added later if its source and definition are clear.

## Design and implementation

The personal site uses a restrained charcoal and warm orange palette, direct typography, the owner's GitHub cat photo, and a real BAF panel screenshot. The BAF site uses deep green, lime accents, light pixel details, and real project interface screenshots. Neither site has a bright mode. Both are static HTML/CSS sites with no build step. The BAF page does not load the old JavaScript files; they remain in the repository until cleanup is reviewed.

Current `perssite` assets include `index.html`, `frikadellen-baf.html`, `styles.css`, `cat-avatar.png`, `baf-panel.png`, `og.svg`, and `og.png`. The cat PNG is also the browser icon.

Current `frikadellenbaf-site` assets include `index.html`, `style.css`, `favicon.svg`, `og.svg`, `assets/og.png`, `assets/cat-avatar.png`, and the original project screenshots. Source and release links remain available.

## Reference-led revision, 2026-10-12

The owner found the first published version too generic and requested Dribbble inspiration and the cat photo from the [TreXito GitHub profile](https://github.com/TreXito). The revision was reviewed on `redesign/reference-led-cat` and published from `main` in both repositories. It keeps both sites dark and retains the current BAF ban advisory.

- [Nicolas Meuzard's dark developer portfolio](https://dribbble.com/shots/9809111-Developer-Dark-Grid-Portfolio) informed the direct introduction and spare project presentation.
- [Andrey Chernov's Minecraft SkyBlock concept](https://dribbble.com/shots/26621823-Minecraft-SkyBlock-Landing-Page-Server-UI-Concept) informed the use of game context and a strong project visual, without its bright palette or invented server statistics.
- [Diana Scarevnea's gaming dashboard](https://dribbble.com/shots/26479455-Gaming-Dashboard-Dark-Mode-UI) informed the deep green surface and restrained lime accents around the real panel.

The local cat avatar is copied from GitHub's public profile image. The personal site also stores a copy of the real BAF panel screenshot so it does not rely on the other domain for its main project image. Both social preview PNGs and SVG sources match the new design.

Local review: Chromium at 1440, 768, 390 and 320 px on all three pages found zero overflow or failed images. axe found zero confirmed WCAG A/AA violations, keyboard skip links and reduced motion passed, and local asset/link/metadata audit found no problems. The BAF hero has a patterned background, so its text colors were checked manually; the smallest sampled text exceeded 6.8:1 contrast. The public BAF README still advises against use as of October 2026.

## Publishing

Each site has a root `CNAME` file for its custom domain. Both repositories have previously published from `main` through GitHub Pages' built-in `pages build and deployment` action. Do not switch Pages to a custom workflow or change `CNAME` during this redesign. Review branches do not deploy; merging to `main` triggers the existing publishing path.

## Plan

1. [x] Inspect both repositories and their current sites.
2. [x] Research public project sources and confirm personal details with the owner.
3. [x] Confirm the existing GitHub Pages actions and custom-domain files.
4. [x] Draft the personal portfolio and BAF project detail page.
5. [x] Draft the BAF project site with honest copy, screenshots and setup path.
6. [x] Push both review branches to GitHub.
7. [x] Review desktop and mobile layouts, links, image crops, metadata, accessibility and current release instructions. Fix issues found.
8. [x] Merge to `main` after review and verify both live domains and Pages action results.

## Progress log

- 2026-10-12T19:35:35Z engine=codex model=gpt-6-astra: Cloned both repositories and wrote the initial handoff plan before editing.
- 2026-10-12T19:40:06Z engine=codex model=gpt-6-astra: Confirmed personal details, public projects and successful built-in Pages action runs for both sites.
- 2026-10-12T19:45:13Z engine=codex model=gpt-6-astra: Drafted both redesigns and generated matching social preview images. Visual review and publication remain.
- 2026-10-12T19:54:03Z engine=codex model=gpt-6-astra: Authenticated GitHub CLI and pushed both `portfolio/true-portfolio` branches. Updated the handoff with branch links. Visual review and merging remain.
- 2026-10-12T19:55:39Z engine=codex model=gpt-6-astra: Added a dedicated handover to both branches for continuation from the Paseo server. Remaining work is visual review and deployment verification.
- 2026-10-12T20:12:17Z engine=codex model=gpt-6.1-sol: Reviewed all three pages at 1440, 768, 390 and 320 px; fixed BAF mobile navigation, contrast, and a timeline label. Browser checks found zero overflow, failed images or request failures; axe found zero WCAG A/AA violations. Keyboard checks confirmed visible skip-link focus and reduced-motion behavior on all three pages. Local link and metadata audit passed. The current BAF README warns against use due to recent bans, so both BAF pages now reflect that guidance. The BAF sitemap date now matches the review. GitHub release API confirms the Linux loader asset in build-20261008-db7a4f1. Publishing still needs GitHub write access on this server.
- 2026-10-12T20:21:10Z engine=codex model=gpt-6.1-sol: Reworked auctionflipper.bz into a dark SkyBlock inventory interface at the owner's request and changed trexito.com to dark only. Regenerated both social previews and verified 12 page/viewport combinations with zero overflow or failed images. Static audit found no local asset or metadata problems; axe reported zero confirmed WCAG A/AA violations and keyboard checks passed. GitHub write access remains unresolved on this server.
- 2026-10-12T20:22:35Z engine=codex model=gpt-6.1-sol: Committed the final dark designs as d60f8e3 in perssite and 6fa1509 in frikadellenbaf-site. Both review branches pushed successfully over Git HTTPS; merge and live deployment verification remain.
- 2026-10-12T20:24:36Z engine=codex model=gpt-6.1-sol: Fast-forwarded both reviewed branches to main. GitHub Pages runs 38303882290 (perssite) and 38303882452 (frikadellenbaf-site) completed successfully. Both custom domains returned HTTP 200 for their updated HTML, dark CSS and social images; live page text matches the redesign and current ban advisory.
- 2026-10-12T20:47:17Z engine=codex model=gpt-6.1-sol: Published the reference-led revision from review branches to main as 8aa3efa (perssite) and a6cc63e (frikadellenbaf-site). Pages runs 38306319990 and 38306320888 completed successfully. Both live domains returned HTTP 200 for updated HTML, CSS, the GitHub cat avatar, real BAF panel image and social previews.
