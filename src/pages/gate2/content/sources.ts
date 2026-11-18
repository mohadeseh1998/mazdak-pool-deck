// /gate2/ has no source register (key S is switched off on this page). The
// shared overlay still imports this module, so it exists, empty.
export const sourcesChecked = "";
export const sources = {} as Record<string, { text: string; url?: string }>;
export type SourceKey = keyof typeof sources;
