# Mazdak Atlantic AgriAqua, pool line pitch

A one-page web deck for the JHSC Summer Institute Funding Committee, Friday 6 November 2026. Nine full-screen sections scroll vertically and snap into place, in the manner of an Apple product page. On a phone each section reflows into one readable column.

Live: https://mohadeseh1998.github.io/mazdak-pool-deck/

## Presenting

| Key | What it does |
|---|---|
| Down, Right, Space, Page Down, mouse wheel | Next section |
| Up, Left, Shift+Space, Page Up | Previous section |
| Home, End | First and last section |
| N | Presenter notes |
| A | Audit mode: highlights every unproven claim |
| S | Source register for every price |
| Escape | Close notes, sources or the image viewer |

Deep links: `#/1` to `#/9`. Move the mouse to show the pager at the bottom. Click the iron photo in section 5 or the jar test photo in section 9 to open it full size.

On the day: open the link, press N, stir soil into both beakers, add the drops to beaker B, and begin. The live test is the last section.

## Editing

All copy is in `src/content/`: `slides.ts` (words), `claims.ts` (assumptions), `sources.ts`, `pricing.ts` and `budget.ts`. Today's ask and the prototype total are computed from the rows in `budget.ts`. To swap the iron photo, put the new file in `assets/` and change `IRON_PHOTO` in `src/content/assets.ts`.

```bash
npm install
npm run dev
```

Publish after any edit, then commit and push `docs/`:

```bash
npm run publish
```

`npm run check` runs before every build and every commit. It blocks the em dash character, the items the brief rules out, and any word in a private `banned-words.local.txt` (one per line, gitignored, never committed). It also fails unless the ask adds up to $1,000 ($300 + $150 + $150 + $400) and the prototype to $2,000, unless the prices are $25.00, $30.00 and $49.99 with the shelf rows unchanged, or if any line removed in version 2 comes back.

Images live in `assets/`. Each slot falls back cleanly if its file is removed. An optional `assets/pool-video.mp4` becomes the offline video fallback on the next build.

## Two more pages

The same design and the same shared components, as their own pages:

| Page | Live | What it is |
|---|---|---|
| `customer/` | https://mohadeseh1998.github.io/mazdak-pool-deck/customer/ | A five-minute pitch for a pool store, nine sections |
| `financials/` | https://mohadeseh1998.github.io/mazdak-pool-deck/financials/ | The pool line financials for the mentor meeting, three sections |

Both pages use the keys above (N notes, A audit, S sources, arrows and Space). The customer pitch's section 3 opens the video in a lightbox. Neither page has a demo timer or a Base / Worst switch (version 2).

Copy lives in each page's `src/pages/<page>/content/`. The customer page reads its prices from the root deck's `src/content/pricing.ts`. Every figure on the financials page comes from one file, `src/content/poolModel.ts`: the package (price, store share, cost to make), the $60,000 start-up cash and the three seasons; change a number there and the table, chart and copy follow. `npm run check` recomputes the model on its own and fails unless the season table matches the version 2 changes exactly, every line on both pages matches them, and nothing version 2 removed comes back.

How it is built: a classic script (needed to open from a USB stick) cannot be shared between pages, so `npm run build` runs three builds into one `dist/`: the root deck exactly as before, then `customer/` and `financials/`. The shared components read their words from `../content/`. On a page build, a small Vite plugin (`pageContent` in `vite.config.ts`) answers those imports with the page's own content files, so the same TopBar, Claim, notes and sources show that page's words. The root deck's files are never touched, so its build output stays byte-for-byte the same.

## Gate 2 final pitch

| Page | Live | What it is |
|---|---|---|
| `gate2/` | https://mohadeseh1998.github.io/mazdak-pool-deck/gate2/ | The JHSC Ventures Gate 2 final pitch, nine slides, about 4:30 |

Downloads: [PDF](https://mohadeseh1998.github.io/mazdak-pool-deck/gate2/Mazdak-Gate2-Final-Pitch.pdf) and [PowerPoint](https://mohadeseh1998.github.io/mazdak-pool-deck/gate2/Mazdak-Gate2-Final-Pitch.pptx).

Keys: arrows, Space, Page Up and Down, Home, End; N presenter notes (with each slide's target time); A audit mode. No demo timer, no source register.

All words, the presenter script and the video link live in `src/pages/gate2/content/slides.ts`. To change the video, edit `VIDEO_URL` there; the page, the PDF and the PowerPoint all follow. The supporters' logos for slide 8 are in `assets/gate2/` (`jhsc-logo.png`, `ican-logo.png`, `planet-hatch-logo.png`, `ignite-fredericton-logo.png`), with the photos `ican-awards.jpg` and `gate1-award.jpg`; a missing logo shows its name as text, and a missing photo turns its card into a text card. To embed the video in the PowerPoint, add `assets/gate2/ali-video.mp4`.

After `npm run publish`, remake the PDF and PowerPoint in `docs/gate2/` (needs Playwright with Chromium):

```bash
npm run export:gate2
```

`npm run check` also checks this page: nine slides in order, the five claims, one `VIDEO_URL`, none of the words the brief rules out, and about 430 spoken words in the script.

Live preview of one page:

```bash
npm run dev:customer
```

```bash
npm run dev:financials
```

```bash
npm run dev:gate2
```
