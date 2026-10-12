# TreXito portfolio rework

This is the handoff for a coordinated redesign of [trexito.com](https://trexito.com/) and [auctionflipper.bz](https://auctionflipper.bz/). Work is on the `portfolio/true-portfolio` branch in [perssite](https://github.com/TreXito/perssite/tree/portfolio/true-portfolio) and [frikadellenbaf-site](https://github.com/TreXito/frikadellenbaf-site/tree/portfolio/true-portfolio).

## Intent

Make the sites feel like a real personal portfolio and a related project study: artistic, nerdy, specific and modest. Keep the useful information and direct source links. Avoid generic agency copy, simulated live figures and unverified earnings claims.

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

The personal site uses a warm paper palette, serif editorial type and annotated project sketches. The BAF site uses the same typography with a darker green palette and project artifacts. Both are static HTML/CSS sites with no build step. The new BAF page does not load the old JavaScript files; they remain in the repository until cleanup is reviewed.

Changed in `perssite`: `index.html`, `frikadellen-baf.html`, new `styles.css`, `favicon.svg`, `og.svg`, and regenerated `og.png`.

Changed in `frikadellenbaf-site`: `index.html`, `style.css`, new `favicon.svg`, `og.svg`, and regenerated `assets/og.png`. Existing project screenshots and install/source links remain available.

## Publishing

Each site has a root `CNAME` file for its custom domain. Both repositories have previously published from `main` through GitHub Pages' built-in `pages build and deployment` action. Do not switch Pages to a custom workflow or change `CNAME` during this redesign. Review branches do not deploy; merging to `main` triggers the existing publishing path.

## Plan

1. [x] Inspect both repositories and their current sites.
2. [x] Research public project sources and confirm personal details with the owner.
3. [x] Confirm the existing GitHub Pages actions and custom-domain files.
4. [x] Draft the personal portfolio and BAF project detail page.
5. [x] Draft the BAF project site with honest copy, screenshots and setup path.
6. [x] Push both review branches to GitHub.
7. [ ] Review desktop and mobile layouts, links, image crops, metadata, accessibility and current release instructions. Fix issues found.
8. [ ] Merge to `main` after review and verify both live domains and Pages action results.

## Progress log

- 2026-10-12T19:35:35Z engine=codex model=gpt-6-astra: Cloned both repositories and wrote the initial handoff plan before editing.
- 2026-10-12T19:40:06Z engine=codex model=gpt-6-astra: Confirmed personal details, public projects and successful built-in Pages action runs for both sites.
- 2026-10-12T19:45:13Z engine=codex model=gpt-6-astra: Drafted both redesigns and generated matching social preview images. Visual review and publication remain.
- 2026-10-12T19:54:03Z engine=codex model=gpt-6-astra: Authenticated GitHub CLI and pushed both `portfolio/true-portfolio` branches. Updated the handoff with branch links. Visual review and merging remain.
