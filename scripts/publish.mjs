#!/usr/bin/env node
// Rebuilds the public website copy of the deck in docs/, which GitHub Pages
// serves at https://mohadeseh1998.github.io/mazdak-pool-deck/. Run `npm run publish`
// after any edit, then commit and push docs/.
import { cpSync, rmSync, writeFileSync } from "node:fs";

rmSync("docs", { recursive: true, force: true });
cpSync("dist", "docs", { recursive: true });
// Tell GitHub Pages to serve the files as they are (no Jekyll processing).
writeFileSync("docs/.nojekyll", "");
console.log("docs/ updated from dist/. Commit and push it to update the public link.");
