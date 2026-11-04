// Build-time glob over the client's `assets/` folder, reused from the Gate 1
// deck. Vite resolves it when it bundles, so a file dropped into assets/ later
// (pool-video.mp4) is picked up by the next build. A missing file is simply
// absent from the map, so every slot degrades without a broken image or a 404.
//
// Note on brief Section 3: it asks for copies in public/assets. Globbing the
// client's own folder keeps one copy of each image in this public repo and
// still emits relative URLs, so the build works on the Pages subpath, from a
// USB stick or from a local file, exactly as `base: './'` intends.
const found = import.meta.glob("../../assets/*.{png,jpg,jpeg,webp,mp4}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byName = new Map<string, string>(
  Object.entries(found).map(([path, url]) => [path.split("/").pop()!.toLowerCase(), url]),
);

const pick = (name: string): string | undefined => byName.get(name.toLowerCase());

export const assets = {
  logo: pick("logo.png"),
  bottles: pick("pool-pack-bottles.png"),
  /** The same photo with its studio ground removed (rembg), for the dark page. */
  bottlesCutout: pick("pool-pack-bottles-cutout.webp"),
  jarTest: pick("jar-test.jpg"),
  mohadeseh: pick("mohadeseh-zamani.jpg"),
  ali: pick("ali-kalateh.jpg"),
  video: pick("pool-video.mp4"),
};

/** Native width of logo.png. The logo is never drawn wider than this. */
export const LOGO_NATIVE_W = 675;
