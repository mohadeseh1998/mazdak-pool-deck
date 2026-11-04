#!/usr/bin/env node
// Builds every page into dist/: first the root deck (exactly as before), then
// each page in its own folder. A classic script (needed for file:// and USB
// sticks) cannot be shared between pages, so each page is a separate build.
//   dist/index.html             Funding Committee deck (root)
//   dist/customer/index.html    customer pitch for a pool store
//   dist/financials/index.html  pool line financials
import { execSync } from "node:child_process";

const PAGES = ["customer", "financials"];
const run = (label, env = {}) => {
  console.log(`\nBuilding ${label}`);
  execSync("npx vite build", { stdio: "inherit", env: { ...process.env, ...env } });
};

run("the root deck");
for (const page of PAGES) run(`/${page}/`, { DECK_PAGE: page });
