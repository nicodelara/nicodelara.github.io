#!/usr/bin/env node
/* =========================================================================
   npm run pdf   (o: node scripts/pdf.mjs [--lang es|en] [--no-photo])
   Genera cv-<nombre>-es.pdf y cv-<nombre>-en.pdf desde cv-data.js con Chrome
   headless (playwright-core, dependencia solo de desarrollo) y les pone
   metadatos (título, autor, asunto, palabras clave, idioma) con pdf-lib.
   Chrome: usa CHROME_PATH si está definido; si no, busca Chrome/Chromium instalado.
   ========================================================================= */
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { loadCV, ROOT } from "./lib/load.mjs";
import { pdfHTML } from "./lib/pdf-template.mjs";

const args = process.argv.slice(2);
const only = args.includes("--lang") ? [args[args.indexOf("--lang") + 1]] : ["es", "en"];
const noPhoto = args.includes("--no-photo");

let chromium, PDFDocument;
try {
  ({ chromium } = await import("playwright-core"));
  ({ PDFDocument } = await import("pdf-lib"));
} catch {
  console.error("Faltan dependencias de desarrollo. Corré primero:  npm install");
  process.exit(1);
}

function findChrome() {
  const c = [
    process.env.CHROME_PATH,
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);
  return c.find((p) => existsSync(p));
}

const { cv, make } = loadCV();
if (noPhoto && cv.profile) delete cv.profile.image;
const exe = findChrome();
const browser = await chromium.launch(exe ? { executablePath: exe } : { channel: "chrome" });
const tmp = mkdtempSync(join(tmpdir(), "cv-pdf-"));
const baseHref = pathToFileURL(ROOT + "/").href;

// Foto achicada (JPEG ~300px) para que el PDF pese poco; se hace con el mismo Chrome
async function thumb(src) {
  const file = join(ROOT, src);
  if (!existsSync(file)) return src;
  const page = await browser.newPage();
  await page.goto(pathToFileURL(file).href);
  const data = await page.evaluate(async () => {
    const img = document.querySelector("img");
    await img.decode();
    const s = Math.min(img.naturalWidth, img.naturalHeight), size = Math.min(320, s);
    const cnv = Object.assign(document.createElement("canvas"), { width: size, height: size });
    cnv.getContext("2d").drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, size, size);
    return cnv.toDataURL("image/jpeg", 0.86);
  });
  await page.close();
  return data;
}
if (cv.profile && cv.profile.image) cv.profile.image = await thumb(cv.profile.image);

try {
  for (const lang of only) {
    const c = make(lang);
    const site = c.siteUrl();
    const name = c.t(cv.profile.name), title = c.t(cv.profile.title);
    const htmlFile = join(tmp, `cv-${lang}.html`);
    writeFileSync(htmlFile, pdfHTML(cv, c, { baseHref, site }));

    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("requestfailed", (r) => errors.push("No se pudo cargar " + r.url()));
    await page.goto(pathToFileURL(htmlFile).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const raw = await page.pdf({ format: "A4", preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
    await page.close();
    if (errors.length) console.warn("⚠", errors.join("\n  "));

    // Metadatos
    const doc = await PDFDocument.load(raw, { updateMetadata: false });
    const skills = c.list(cv.skills).flatMap((g) => c.list(g.items).map((s) => c.skillName(s)));
    doc.setTitle(`${name} — ${title} — ${lang === "es" ? "CV" : "Résumé"}`, { showInWindowTitleBar: true });
    doc.setAuthor(name);
    doc.setSubject(lang === "es" ? `CV de ${name}, ${title}` : `Résumé of ${name}, ${title}`);
    doc.setKeywords([[name, title, ...skills, lang === "es" ? "CV" : "Résumé", c.displayUrl(site)].join(", ")]);
    doc.setLanguage(lang);
    doc.setCreator(`${c.displayUrl(site)} (scripts/pdf.mjs)`);
    doc.setProducer("Chromium + pdf-lib");
    doc.setCreationDate(new Date());
    doc.setModificationDate(new Date());
    const out = c.pdfFile(lang);
    writeFileSync(join(ROOT, out), await doc.save({ useObjectStreams: false }));
    console.log(`✔ ${out} (${doc.getPageCount()} ${doc.getPageCount() === 1 ? "página" : "páginas"})`);
  }
} finally {
  await browser.close();
  rmSync(tmp, { recursive: true, force: true });
}
