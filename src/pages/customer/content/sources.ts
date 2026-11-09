import { sources as rootSources, sourcesChecked as rootChecked } from "../../../content/sources";

// Source register for /customer/ (customer brief, Section 5), key S. The
// shelf prices reuse the root deck's sources. Version 2 removed every mention
// of the store margin from this page, so its source is gone too.
export const sourcesChecked = rootChecked;

export const sources = {
  "psc-clarifier": rootSources["psc-clarifier"],
  "up-clarita": rootSources["up-clarita"],
  "trevi-aquaclair": rootSources["trevi-aquaclair"],
  "up-algout40": rootSources["up-algout40"],
  "up-algout60": rootSources["up-algout60"],
  "psc-algaefree": rootSources["psc-algaefree"],
};

export type SourceKey = keyof typeof sources;
