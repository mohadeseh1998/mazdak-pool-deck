#!/usr/bin/env node
// Live preview of one page: `npm run dev:customer` or `npm run dev:financials`.
import { spawn } from "node:child_process";

const page = process.argv[2];
spawn("npx", ["vite"], { stdio: "inherit", shell: true, env: { ...process.env, DECK_PAGE: page } });
