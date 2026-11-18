# auctionflipper.bz

Project site for [Frikadellen BAF](https://github.com/TreXito/frikadellen-baf-121), a Rust Auction House and Bazaar flipper for Hypixel SkyBlock. Static HTML/CSS/JS, no build step, published by GitHub Pages from `main` (custom domain in `CNAME`).

## Current state (Nov 2026): liquid glass

- `index.html`: floating glass nav with a sliding lens, pinned hero that hands off to a live terminal, value cards, a pinned flip stepper fed by `flips.json`, video, screenshots, install tabs and FAQ.
- `style.css`: glass material (gradient fill, `backdrop-filter` blur and saturation, specular rim, pointer light), dark tint for monospace panels, ambient aurora, iOS style segmented control and grouped lists.
- `main.js`: GSAP + ScrollTrigger for the pinned hero and flip stepper, batch reveals; Lenis inertial scroll on the GSAP ticker; nav lens follows the section in view.
- `terminal.js`: replays real log lines in the hero terminal; footer counters total what the replay has shown.
- Libraries from jsDelivr, version pinned with SRI: `gsap@3.12.5` (+ ScrollTrigger), `lenis@1.3.27`. Fonts: Geist and Geist Mono (Google Fonts).
- Reduced motion and reduced transparency fall back to a static, fully visible page.

Glass rule: never put `opacity`, `filter`, `mask` or `will-change: opacity` on an ancestor of a `.glass` element. It becomes a backdrop root and the blur goes flat. Animate transforms instead.

## Privacy rules for this site

- Handle only. No legal name, no city, region, employer or school names.
- No links whose URL or page shows the legal name.
- Screenshots never show real bot accounts. Panel and Discord captures use demo accounts (Steve, Alex, Notch and placeholder names); the page says so under the screenshot grid.
- Older commits still contain earlier details; only the current tree is clean.

## Data

`flips.json` comes from the live baf-backend (`events` table): realized sales, buy and sell paired, with bought price, sale price, profit, buy speed and finder. Refresh with `tools/export-flips.py` (needs ssh access to the backend host).

The ban advisory was removed in Nov 2026 (PR #7); the project README no longer carries it.

## Assets

See [assets/README.md](assets/README.md). `assets/og.png` keeps its filename because the panel repo's `webpage/index.html` links to it.

Rebuild the social preview:

```bash
python3 -m http.server 8777 --bind 127.0.0.1 &
# render http://127.0.0.1:8777/tools/og.html at 1200x630, DPR 1, with headless Chromium
# (needs --use-angle=swiftshader --enable-unsafe-swiftshader for backdrop blur), save as assets/og.png
```

## Verify locally

```bash
node tools/smoke.js                              # loads terminal.js + main.js against a DOM shim
python3 -m http.server 8777 --bind 127.0.0.1    # then open http://127.0.0.1:8777/
```

Check 1440, 390 and 320 px wide: no horizontal overflow, no console errors, pinned sections release cleanly.
