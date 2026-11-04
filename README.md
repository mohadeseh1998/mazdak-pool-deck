# Mazdak Atlantic AgriAqua, pool line pitch

A one-page web deck for the JHSC Summer Institute Funding Committee, Friday 6 November 2026. Ten full-screen sections scroll vertically and snap into place, in the manner of an Apple product page.

Live: https://mohadeseh1998.github.io/mazdak-pool-deck/

## Presenting

| Key | What it does |
|---|---|
| Down, Right, Space, Page Down, mouse wheel | Next section |
| Up, Left, Shift+Space, Page Up | Previous section |
| Home, End | First and last section |
| T | Start the demo timer. Press T again to restart it |
| Shift+T | Stop and hide the timer |
| N | Presenter notes |
| A | Audit mode: highlights every unproven claim |
| S | Source register for every price |
| Escape | Close notes, sources or the image viewer |

Deep links: `#/1` to `#/10`. Move the mouse to show the pager at the bottom. Click the jar test photo in section 6 to open it full size.

On the day: open the link, press N, stir soil into both beakers, add the drops to beaker B, press T, and begin.

## Editing

All copy is in `src/content/`: `slides.ts` (words), `claims.ts` (assumptions), `sources.ts`, `pricing.ts` and `budget.ts`. To ask for the whole run instead of $500, set `ASK_MODE` to `"full"` in `budget.ts`.

```bash
npm install
npm run dev
```

Publish after any edit, then commit and push `docs/`:

```bash
npm run publish
```

`npm run check` runs before every build and every commit. It blocks the em dash character, the items the brief rules out, and any word in a private `banned-words.local.txt` (one per line, gitignored, never committed). It also fails unless the budget adds up to $800 and the ask is $500, or $800 in full mode.

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
