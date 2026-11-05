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

Both pages use the keys above (N notes, A audit, S sources, arrows and Space). The customer pitch also has T for the cup timer, and its section 3 opens the video in a lightbox. On the financials page, **W** switches between Base and Worst, or click the pill in section 2.

Copy lives in each page's `src/pages/<page>/content/`. Every price, cost and total on both pages comes from one file, `src/content/poolModel.ts`. `npm run check` recomputes the model on its own and fails unless every total equals the financials brief's Section 4, and every figure on screen equals the briefs.

How it is built: a classic script (needed to open from a USB stick) cannot be shared between pages, so `npm run build` runs three builds into one `dist/`: the root deck exactly as before, then `customer/` and `financials/`. The shared components read their words from `../content/`. On a page build, a small Vite plugin (`pageContent` in `vite.config.ts`) answers those imports with the page's own content files, so the same TopBar, Claim, notes and sources show that page's words. The root deck's files are never touched, so its build output stays byte-for-byte the same.

Live preview of one page:

```bash
npm run dev:customer
```

```bash
npm run dev:financials
```
