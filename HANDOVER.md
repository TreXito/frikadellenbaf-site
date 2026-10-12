# Portfolio handover, 2026-10-12

Next action: review both portfolio/true-portfolio branches on desktop and mobile, then fix concrete issues before merging.

## Where to continue

- Personal site: https://github.com/TreXito/perssite/tree/portfolio/true-portfolio
- BAF project site: https://github.com/TreXito/frikadellenbaf-site/tree/portfolio/true-portfolio
- The same README.md in each branch contains the plan, claim sources and progress log. Current state: 6 of 8 plan steps done.

Clone each repository on the Paseo server, switch to portfolio/true-portfolio, and read README.md before editing. Both branches are pushed and tracking their GitHub remotes. The public main branches still serve the old sites.

## What is done

1. Reworked trexito.com into a personal portfolio for Philipp Podobri / TreXito, with real background, selected projects and verified links.
2. Reworked its Frikadellen BAF detail page as a project note. Reworked auctionflipper.bz as a related project site with the system, real interface screenshots, source and setup.
3. Removed fabricated uptime and earnings figures and the simulated live terminal from visible copy. Generated new favicon and social preview artwork for both sites.
4. Kept each root CNAME file intact. Earlier successful GitHub Pages runs show the built-in pages build and deployment action publishes main for both repositories. No custom workflow was added.

## Decisions to preserve

- Tone: specific, curious and modest. The owner asked for an artistic, nerdy feel without bragging or generic portfolio claims. No em dashes in site copy.
- Identity and history: the owner supplied the LinkedIn profile and confirmed the SAATBAU LINZ apprenticeship, 42 Wels study and HTL Leonding background. Powerlifting is one brief personal note. See README.md for links and dates.
- BAF metrics: the existing flips.json contains candidate or target values without dates or sale confirmation. Do not call them realised profit. The owner offered backend data, but no verified, safe export was available in this session. A dated anonymized example is optional.
- The sites are static HTML/CSS with no build step. The BAF repo still contains old JavaScript and flips.json, but the new page does not load them. Do not delete them before reviewing whether anything else uses them.

## Remaining work

1. Review both pages visually at desktop and mobile sizes. Check typography, overflow, screenshot crops and generated og.png previews.
2. Check internal and external links, image alt text, keyboard focus, reduced motion, page titles and descriptions. Recheck the Linux loader command and current release files against the BAF repository.
3. Make fixes on the review branches and update the README progress log.
4. Merge to main only after review, then inspect the GitHub Pages action result and load trexito.com and auctionflipper.bz to confirm the deployed pages and domains.

## Files changed

- perssite: index.html, frikadellen-baf.html, styles.css, favicon.svg, og.svg, og.png, README.md.
- frikadellenbaf-site: index.html, style.css, favicon.svg, og.svg, assets/og.png, README.md.

No visual browser review or live deployment verification of the redesigned pages has happened yet.
