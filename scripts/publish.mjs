#!/usr/bin/env node
// Rebuilds the public website copy of the deck in docs/, which GitHub Pages
// serves at https://mohadeseh1998.github.io/mazdak-pool-deck/. Run `npm run publish`
// after any edit, then commit and push docs/.
// The Gate 2 PDF and PowerPoint in docs/gate2/ are made by
// `npm run export:gate2`, not by the build, so they are kept across a publish.
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const KEEP = /\.(pdf|pptx)$/i;
const kept = mkdtempSync(join(tmpdir(), "deck-keep-"));
const keepDir = "docs/gate2";
const keepFiles = existsSync(keepDir) ? readdirSync(keepDir).filter((f) => KEEP.test(f)) : [];
for (const f of keepFiles) cpSync(join(keepDir, f), join(kept, f));

rmSync("docs", { recursive: true, force: true });
cpSync("dist", "docs", { recursive: true });
for (const f of keepFiles) cpSync(join(kept, f), join(keepDir, f));
rmSync(kept, { recursive: true, force: true });
// Tell GitHub Pages to serve the files as they are (no Jekyll processing).
writeFileSync("docs/.nojekyll", "");
console.log("docs/ updated from dist/. Commit and push it to update the public link.");
