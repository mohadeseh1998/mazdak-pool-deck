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
