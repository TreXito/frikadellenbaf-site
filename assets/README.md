# Site images

| File | Used for | Source |
|---|---|---|
| `web-panel1.webp` | Screenshots: web panel, controls | Panel UI on a mock backend, demo accounts |
| `web-panel2.webp` | Screenshots: web panel, profit | Panel UI on a mock backend, demo numbers |
| `discord-integration.webp` | Screenshots: Discord commands | HTML re-render with placeholder names |
| `legendary-flips.webp` | Screenshots: big-flips feed | Real channel capture |
| `video-poster.webp` | Demo video poster (click to load) | The video's own YouTube thumbnail |
| `og.png` | Social preview (1200x630) | Rendered from `tools/og.html` |
| `cat-avatar.png` | Avatar | GitHub profile image |

To swap one, keep the filename, use WebP around 16:10, under ~150 KB, and update the `width`/`height` attributes in `index.html`. Never show real bot account names. If a file is missing, the page shows a "Preview coming soon" placeholder.
