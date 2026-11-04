import { sources as rootSources, sourcesChecked as rootChecked } from "../../../content/sources";

// Source register for /customer/ (customer brief, Section 5), key S. The
// shelf prices reuse the root deck's sources; the store margin is new.
export const sourcesChecked = rootChecked;

export const sources = {
  "psc-clarifier": rootSources["psc-clarifier"],
  "up-clarita": rootSources["up-clarita"],
  "trevi-aquaclair": rootSources["trevi-aquaclair"],
  "up-algout40": rootSources["up-algout40"],
  "up-algout60": rootSources["up-algout60"],
  "psc-algaefree": rootSources["psc-algaefree"],
  "store-margin": {
    text: "Aqua Magazine, \"Keeping pool chemical sales away from big box stores\": a pool retailer aims for a 40 percent margin on its products.",
    url: "https://www.aquamagazine.com/retail/article/15118190/keeping-pool-chemical-sales-away-from-big-box-stores",
  },
};

export type SourceKey = keyof typeof sources;
