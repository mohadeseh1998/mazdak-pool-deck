// Supporter logos for slide 8, and the video's cover picture for slide 4 on
// paper (PDF), from assets/gate2/. The video file itself is for the
// PowerPoint only and is never part of the page. They live in their own
// folder so the root deck's image glob (src/content/assets.ts) never sees them
// and its build stays byte-for-byte the same. A file that is missing is simply
// absent here, and the slide shows that supporter's name as text instead.
const found = import.meta.glob("../../../assets/gate2/*.{png,jpg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byName = new Map<string, string>(
  Object.entries(found).map(([path, url]) => [path.split("/").pop()!.toLowerCase(), url]),
);

export const logoUrl = (file: string): string | undefined => byName.get(file.toLowerCase());
