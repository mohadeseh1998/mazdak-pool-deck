# Mazdak Atlantic AgriAqua, pool line pitch

An eight-slide web deck for the JHSC Summer Institute Funding Committee, Friday 6 November 2026.

Live: https://mohadeseh1998.github.io/mazdak-pool-deck/

## Presenting

| Key | What it does |
|---|---|
| Right, Left, Space, Page Up, Page Down | Next and previous slide |
| Home, End | First and last slide |
| T | Start the demo timer. Press T again to restart it |
| Shift+T | Stop and hide the timer |
| N | Presenter notes |
| A | Audit mode: highlights every unproven claim |
| S | Source register for every price |
| Escape | Close notes, sources or the image viewer |

Deep links: `#/1` to `#/8`. Click the jar test photo on slide 5 to open it full size.

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
