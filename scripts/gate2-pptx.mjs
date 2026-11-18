#!/usr/bin/env node
// Builds the Gate 2 PowerPoint, docs/gate2/Mazdak-Gate2-Final-Pitch.pptx, from
// the same copy as the web deck (src/pages/gate2/content/slides.ts). 16:9,
// editable text (no pictures of text), the same images and colours, and the
// presenter script in each slide's notes. Run: node scripts/gate2-pptx.mjs
//
// Layout is set on the web deck's 1600 by 900 canvas and converted here:
// 120 canvas px = 1 inch, and 1 canvas px of type = 0.6 pt. Body text is never
// under 24 px (14.4 pt, which is 28.8 px at 1920 by 1080).
//
// If assets/gate2/ali-video.mp4 exists, slide 4 embeds it; otherwise slide 4
// shows a poster with a play mark, and both link to VIDEO_URL.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import pptxgen from "pptxgenjs";

const require = createRequire(import.meta.url);
const esbuild = require("esbuild");

async function loadModule(path) {
  const out = await esbuild.build({ entryPoints: [path], bundle: true, write: false, format: "esm", platform: "node", logLevel: "silent" });
  return import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString("base64")}`);
}

const c = await loadModule("src/pages/gate2/content/slides.ts");
const OUT = "docs/gate2/Mazdak-Gate2-Final-Pitch.pptx";

/* Tokens (src/styles/tokens.css) ----------------------------------------- */
const T = {
  deep: "0F1D26",
  paper: "F8FAFB",
  pool: "1E6FB0",
  poolOnDeep: "5FA8E0",
  algaeOnDeep: "6FBF8E",
  silt: "A88B5E",
  caution: "E8C33A",
  slate: "9AA8B0",
  card: "152631",
  cardLine: "22323D",
  rule: "2C3A44",
};
const FONT = "Inter";

/* Canvas units ------------------------------------------------------------ */
const X = (px) => px / 120; // inches
const P = (px) => Math.round(px * 0.6 * 10) / 10; // points

/* Images ------------------------------------------------------------------ */
const dataUri = (file, type) => `data:${type};base64,${readFileSync(file).toString("base64")}`;
const png = (file) => dataUri(file, "image/png");
const jpg = (file) => dataUri(file, "image/jpeg");

// PowerPoint cannot read WebP, so the floating bottles (a WebP cut-out) are
// turned into a PNG by the browser, unchanged otherwise.
async function webpToPng(file) {
  let playwright;
  try {
    playwright = require("playwright");
  } catch {
    return null;
  }
  const browser = await playwright.chromium.launch();
  try {
    const page = await browser.newPage();
    return await page.evaluate(async (src) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      return canvas.toDataURL("image/png");
    }, dataUri(file, "image/webp"));
  } finally {
    await browser.close();
  }
}

const IMG = {
  logo: png("assets/logo.png"),
  bottles: (await webpToPng("assets/pool-pack-bottles-cutout.webp")) ?? png("assets/pool-pack-bottles.png"),
  floating: true,
  jar: jpg("assets/jar-test.jpg"),
};
if (!IMG.bottles.startsWith("data:image/png;base64,iVBOR")) IMG.floating = false;
const BOTTLES_RATIO = 1174 / 1400; // the cut-out's width over its height

/* Rich text: { b } is bold; { text, claim } is an [assumption] ------------ */
function runs(rich, base = {}) {
  if (typeof rich === "string") return [{ text: rich, options: { ...base } }];
  const out = [];
  for (const node of rich) {
    if (typeof node === "string") out.push({ text: node, options: { ...base } });
    else if ("b" in node) out.push({ text: node.b, options: { ...base, bold: true, ...(base.boldColor ? { color: base.boldColor } : {}) } });
    else {
      const inner = runs(node.text, base).map((r) => ({
        ...r,
        options: { ...r.options, underline: { style: "dash", color: T.caution } },
      }));
      out.push(...inner);
      out.push({ text: " [assumption]", options: { ...base, bold: true, color: T.caution, fontSize: P(16), underline: undefined } });
    }
  }
  return out.map((r) => {
    const { boldColor: _b, ...o } = r.options;
    return { text: r.text, options: o };
  });
}

/* The deck ---------------------------------------------------------------- */
const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE"; // 13.333 by 7.5 inches, 16:9
pptx.author = "Mazdak Atlantic AgriAqua Inc.";
pptx.company = "Mazdak Atlantic AgriAqua Inc.";
pptx.title = "Mazdak Atlantic AgriAqua, JHSC Ventures Gate 2 final pitch";
pptx.theme = { headFontFace: FONT, bodyFontFace: FONT };

const TOTAL = c.slides.length;

function text(slide, value, x, y, w, h, o = {}) {
  slide.addText(Array.isArray(value) && typeof value[0] === "object" && "options" in value[0] ? value : runs(value, { color: o.color ?? T.paper, bold: o.bold ?? false }), {
    x: X(x),
    y: X(y),
    w: X(w),
    h: X(h),
    fontFace: FONT,
    fontSize: P(o.size ?? 26),
    color: o.color ?? T.paper,
    bold: o.bold ?? false,
    align: o.align ?? "left",
    valign: o.valign ?? "top",
    margin: 0,
    lineSpacingMultiple: o.line ?? 1.2,
    charSpacing: o.spacing,
    fit: "none",
    ...(o.extra ?? {}),
  });
}

function base(s) {
  const slide = pptx.addSlide();
  slide.background = { color: T.deep };
  // The top bar: the logo on its paper tile, the slide title, and "n of 9".
  slide.addShape(pptx.ShapeType.rect, { x: X(96), y: X(14), w: X(146), h: X(26), fill: { color: T.paper }, line: { color: T.paper } });
  slide.addImage({ data: IMG.logo, x: X(103), y: X(19.5), w: X(132), h: X((132 * 76) / 675) });
  if (s.n !== 1) text(slide, s.title, 262, 16, 700, 24, { size: 16, bold: true, valign: "middle" });
  text(slide, `${s.n} of ${TOTAL}`, 1304, 16, 200, 24, { size: 16, color: T.slate, align: "right", valign: "middle" });
  slide.addShape(pptx.ShapeType.line, { x: 0, y: X(55), w: X(1600), h: 0, line: { color: "1D2B35", width: 0.75 } });
  if (s.eyebrow) text(slide, s.eyebrow, 0, 96, 1600, 34, { size: 24, bold: true, align: s.n === 9 ? "left" : "center", extra: s.n === 9 ? { x: X(96), w: X(1408) } : {} });
  slide.addNotes([`Slide ${s.n} of ${TOTAL}, ${s.title}. Target time ${s.time}.`, "", ...s.notes.flatMap((n) => [n, ""])].join("\n").trim());
  return slide;
}

const headline = (slide, value, y = 150, size = 76, o = {}) =>
  text(slide, value, 96, y, 1408, size * 1.25, { size, bold: true, align: "center", line: 1.0, spacing: -1, ...o });

function card(slide, x, y, w, h, tone) {
  slide.addShape(pptx.ShapeType.roundRect, { x: X(x), y: X(y), w: X(w), h: X(h), rectRadius: X(28), fill: { color: T.card }, line: { color: T.cardLine, width: 0.75 } });
  if (tone) slide.addShape(pptx.ShapeType.rect, { x: X(x + 48), y: X(y), w: X(w - 96), h: X(3), fill: { color: tone }, line: { color: tone, width: 0 } });
}

function bottles(slide, x, y, w, h, link) {
  // Fit the image inside the box, keeping its shape.
  let bw = w;
  let bh = w / BOTTLES_RATIO;
  if (bh > h) {
    bh = h;
    bw = h * BOTTLES_RATIO;
  }
  slide.addImage({ data: IMG.bottles, x: X(x + (w - bw) / 2), y: X(y + (h - bh) / 2), w: X(bw), h: X(bh), ...(link ? { hyperlink: { url: link, tooltip: "Watch the video" } } : {}) });
}

/* 1. Title */
{
  const s = c.titleSlide;
  const slide = base(s);
  slide.addShape(pptx.ShapeType.rect, { x: X(96), y: X(221), w: X(250), h: X(46), fill: { color: T.paper }, line: { color: T.paper } });
  slide.addImage({ data: IMG.logo, x: X(104), y: X(226), w: X(230), h: X((230 * 76) / 675) });
  text(slide, s.headline.join("\n"), 96, 296, 960, 190, { size: 80, bold: true, line: 0.98, spacing: -1.5 });
  text(slide, s.sub, 96, 508, 830, 84, { size: 30 });
  text(slide, s.founders.join("  ·  "), 96, 618, 990, 36, { size: 24, color: T.slate });
  text(slide, s.footer.join("  ·  "), 96, 828, 1100, 26, { size: 17, color: T.slate });
  bottles(slide, 1066, 150, 470, 560);
}

/* 2. Problem */
{
  const s = c.problemSlide;
  const slide = base(s);
  headline(slide, s.headline);
  s.cards.forEach((k, i) => {
    const x = 160 + i * 656;
    card(slide, x, 330, 624, 236, T.silt);
    text(slide, k.heading, x + 48, 374, 528, 46, { size: 36, bold: true });
    text(slide, k.body, x + 48, 432, 528, 100, { size: 26, color: T.slate, line: 1.3 });
  });
  text(slide, s.bottom, 160, 630, 1280, 40, { size: 26, align: "center" });
}

/* 3. Our answer */
{
  const s = c.answerSlide;
  const slide = base(s);
  headline(slide, s.headline);
  const [cl, aa] = s.products;
  [
    [cl, 100, T.poolOnDeep],
    [aa, 1011, T.algaeOnDeep],
  ].forEach(([p, x, tone]) => {
    card(slide, x, 312, 489, 300, tone);
    text(slide, p.heading, x + 48, 352, 400, 46, { size: 36, bold: true, color: tone });
    text(slide, p.body, x + 48, 410, 400, 150, { size: 26, color: T.slate, line: 1.3 });
  });
  bottles(slide, 629, 262, 340, 400);
  text(slide, runs(s.price, { color: T.paper, fontSize: P(34), boldColor: T.poolOnDeep }), 96, 690, 1408, 50, { align: "center", valign: "middle" });
  text(slide, runs(s.bonus, { color: T.slate, fontSize: P(24) }), 96, 748, 1408, 40, { align: "center", valign: "middle" });
}

/* 4. Ali's video */
{
  const s = c.videoSlide;
  const slide = base(s);
  headline(slide, s.headline, 150, 60);
  const vx = 320;
  const vy = 243;
  const mp4 = "assets/gate2/ali-video.mp4";
  if (existsSync(mp4)) {
    slide.addMedia({ type: "video", path: mp4, x: X(vx), y: X(vy), w: X(960), h: X(540) });
  } else {
    slide.addShape(pptx.ShapeType.roundRect, { x: X(vx), y: X(vy), w: X(960), h: X(540), rectRadius: X(28), fill: { color: "22394A" }, line: { color: "22394A" }, hyperlink: { url: c.VIDEO_URL, tooltip: "Watch the video" } });
    bottles(slide, vx + 60, vy + 20, 840, 500, c.VIDEO_URL);
    slide.addShape(pptx.ShapeType.ellipse, { x: X(800 - 52), y: X(vy + 270 - 52), w: X(104), h: X(104), fill: { color: T.paper, transparency: 8 }, line: { color: T.paper }, hyperlink: { url: c.VIDEO_URL, tooltip: "Watch the video" } });
    slide.addShape(pptx.ShapeType.triangle, { x: X(800 - 14), y: X(vy + 270 - 18), w: X(36), h: X(36), rotate: 90, fill: { color: T.deep }, line: { color: T.deep }, hyperlink: { url: c.VIDEO_URL, tooltip: "Watch the video" } });
    text(slide, [{ text: s.watch, options: { color: T.paper, bold: true, fontSize: P(24), hyperlink: { url: c.VIDEO_URL, tooltip: "Watch the video" } } }], vx + 200, vy + 400, 560, 44, {
      align: "center",
      valign: "middle",
      extra: { fill: { color: T.deep, transparency: 15 } },
    });
  }
  text(slide, c.video.caption, 96, 800, 1408, 36, { size: 24, color: T.slate, align: "center" });
}

/* 5. Progress since Gate 1 */
{
  const s = c.progressSlide;
  const slide = base(s);
  headline(slide, s.headline);
  const heights = [34, 34, 68, 34, 68];
  let y = 300;
  s.done.forEach((line, i) => {
    slide.addShape(pptx.ShapeType.ellipse, { x: X(96), y: X(y - 1), w: X(36), h: X(36), fill: { color: T.pool }, line: { color: T.pool } });
    text(slide, "✓", 96, y - 1, 36, 36, { size: 22, bold: true, align: "center", valign: "middle" });
    text(slide, line, 150, y, 852, heights[i], { size: 24, line: 1.25 });
    y += heights[i] + 24;
  });
  slide.addShape(pptx.ShapeType.roundRect, { x: X(1074), y: X(326), w: X(430), h: X(276), rectRadius: X(28), fill: { color: "1D2620" }, line: { color: T.caution, width: 1.25 } });
  text(slide, s.lead.heading, 1114, 366, 350, 44, { size: 34, bold: true, color: T.caution });
  text(slide, runs(s.lead.body, { color: T.paper, fontSize: P(24) }), 1114, 420, 350, 160, { line: 1.3 });
  text(slide, s.footer, 96, 832, 1408, 26, { size: 17, color: T.slate, align: "center" });
}

/* 6. Roadmap */
{
  const s = c.roadmapSlide;
  const slide = base(s);
  headline(slide, s.headline);
  const top = 318;
  const colW = 259.2;
  slide.addShape(pptx.ShapeType.line, { x: X(124), y: X(top + 28), w: X(1384 - 124), h: 0, line: { color: T.poolOnDeep, width: 1.5 } });
  // One tag for the whole timeline, at the end of the rail.
  text(slide, [{ text: "[assumption]", options: { color: T.caution, bold: true, fontSize: P(16) } }], 1394, top + 16, 110, 24, { align: "right", valign: "middle" });
  s.steps.forEach((st, i) => {
    const x = 96 + i * (colW + 28);
    const launch = i === 3;
    slide.addShape(pptx.ShapeType.ellipse, { x: X(x), y: X(top), w: X(56), h: X(56), fill: { color: launch ? T.pool : T.deep }, line: { color: launch ? T.pool : T.poolOnDeep, width: 1.5 } });
    text(slide, String(i + 1), x, top, 56, 56, { size: 26, bold: true, color: launch ? T.paper : T.poolOnDeep, align: "center", valign: "middle" });
    text(slide, st.when, x, top + 84, colW, 40, { size: 30, bold: true, color: T.poolOnDeep });
    text(slide, st.what, x, top + 132, colW, 190, { size: 24, line: 1.25 });
  });
  text(slide, s.then, 96, 672, 1408, 40, { size: 26, color: T.slate, align: "center" });
}

/* 7. The ask */
{
  const s = c.askSlide;
  const slide = base(s);
  slide.addText(
    [
      { text: s.headline.figure, options: { color: T.poolOnDeep } },
      { text: s.headline.rest, options: { color: T.paper } },
    ],
    { x: X(96), y: X(252), w: X(1408), h: X(110), fontFace: FONT, fontSize: P(72), bold: true, align: "center", valign: "middle", margin: 0, charSpacing: -1.5 },
  );
  text(slide, runs(s.sub, { color: T.slate, fontSize: P(28) }), 96, 376, 1408, 44, { align: "center", valign: "middle" });
  slide.addShape(pptx.ShapeType.line, { x: X(764), y: X(472), w: X(72), h: 0, line: { color: T.rule, width: 1.5 } });
  text(slide, s.big, 96, 520, 1408, 84, { size: 64, bold: true, align: "center", valign: "middle", spacing: -1 });
  const widths = [208, 195, 343];
  let x = (1600 - (widths.reduce((a, b) => a + b, 0) + 2 * 18)) / 2;
  s.chips.forEach((chip, i) => {
    slide.addShape(pptx.ShapeType.roundRect, { x: X(x), y: X(636), w: X(widths[i]), h: X(68), rectRadius: X(34), fill: { color: T.card }, line: { color: "34607F", width: 0.75 } });
    text(slide, chip, x, 636, widths[i], 68, { size: 28, bold: true, align: "center", valign: "middle" });
    x += widths[i] + 18;
  });
}

/* 8. Recognition and supporters */
{
  const s = c.recognitionSlide;
  const slide = base(s);
  headline(slide, s.headline);
  const rows = [278, 392, 448];
  s.awards.forEach((a, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 96 + col * 720;
    const y = rows[row];
    slide.addShape(pptx.ShapeType.rect, { x: X(x), y: X(y + 12), w: X(10), h: X(10), fill: { color: T.poolOnDeep }, line: { color: T.poolOnDeep } });
    text(slide, a, x + 32, y, 656, row === 0 ? 100 : 36, { size: 24, line: 1.2 });
  });
  text(slide, s.supportedBy, 96, 642, 400, 24, { size: 17, bold: true, color: T.slate });
  slide.addShape(pptx.ShapeType.roundRect, { x: X(96), y: X(680), w: X(1408), h: X(176), rectRadius: X(28), fill: { color: T.paper }, line: { color: T.paper } });
  // Each logo as it is, in its own colours, never wider or taller than its slot.
  const centres = [228, 526, 806, 1085, 1377];
  s.logos.forEach((l, i) => {
    const file = `assets/gate2/${l.file}`;
    const h = l.lead ? 136 : 100;
    if (!existsSync(file)) {
      text(slide, l.name, centres[i] - 120, 768 - 20, 240, 40, { size: 22, bold: true, color: T.deep, align: "center", valign: "middle" });
      return;
    }
    const { width, height } = pngSize(file);
    const w = (h * width) / height;
    slide.addImage({ data: png(file), x: X(centres[i] - w / 2), y: X(768 - h / 2), w: X(w), h: X(h), altText: l.name });
  });
}

/* 9. Live test, thank you */
{
  const s = c.liveSlide;
  const slide = base(s);
  text(slide, s.headline, 96, 146, 1100, 84, { size: 68, bold: true, spacing: -1, line: 1.0 });
  text(slide, s.statement.replace("soil. ", "soil.\n"), 96, 246, 1100, 110, { size: 46, bold: true, color: T.poolOnDeep, line: 1.05, spacing: -0.5 });
  s.beakers.forEach((b, i) => {
    const y = 380 + i * 46;
    slide.addShape(pptx.ShapeType.rect, { x: X(96), y: X(y + 13), w: X(10), h: X(10), fill: { color: b.tone === "silt" ? T.silt : T.poolOnDeep }, line: { color: b.tone === "silt" ? T.silt : T.poolOnDeep } });
    slide.addText(
      [
        { text: `${b.name} `, options: { bold: true, color: T.paper } },
        { text: b.text, options: { color: T.slate } },
      ],
      { x: X(122), y: X(y), w: X(960), h: X(36), fontFace: FONT, fontSize: P(24), margin: 0, valign: "top" },
    );
  });
  slide.addShape(pptx.ShapeType.line, { x: X(96), y: X(486), w: X(988), h: 0, line: { color: T.rule, width: 0.75 } });
  s.steps.forEach((st, i) => {
    slide.addText(
      [
        { text: `${i + 1}.  `, options: { bold: true, color: T.poolOnDeep } },
        { text: st, options: { color: T.paper } },
      ],
      { x: X(96), y: X(510 + i * 44), w: X(960), h: X(36), fontFace: FONT, fontSize: P(24), margin: 0, valign: "top" },
    );
  });
  slide.addImage({ data: IMG.jar, x: X(1164), y: X(96), w: X(340), h: X(560), sizing: { type: "cover", w: X(340), h: X(560) }, altText: s.photo.alt });
  text(slide, s.photo.caption, 1164, 668, 340, 26, { size: 17, color: T.slate });
  slide.addText(
    [
      { text: `${s.thanks}  `, options: { color: T.paper } },
      { text: s.contact, options: { color: T.poolOnDeep, hyperlink: { url: "https://agriaqua.ca", tooltip: "agriaqua.ca" } } },
    ],
    { x: X(96), y: X(812), w: X(1408), h: X(52), fontFace: FONT, fontSize: P(38), bold: true, align: "center", valign: "middle", margin: 0 },
  );
}

/** Width and height of a PNG, from its header. */
function pngSize(file) {
  const b = readFileSync(file);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

mkdirSync("docs/gate2", { recursive: true });
await pptx.writeFile({ fileName: OUT });
console.log(`Wrote ${OUT}`);
