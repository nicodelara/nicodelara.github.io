#!/usr/bin/env node
/* =========================================================================
   node scripts/build.mjs
   Genera, a partir de cv-data.js (sin dependencias, solo Node >= 18):
     - index.html  -> contenido prerenderizado + <head> con SEO, Open Graph y JSON-LD
     - cv.md / cv.es.md -> CV en Markdown (inglés / español)
     - resume.json -> formato JSON Resume (https://jsonresume.org)
     - llms.txt, robots.txt, sitemap.xml
   Los PDFs se generan aparte con `npm run pdf` (necesita Chrome/Chromium).
   ========================================================================= */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadCV, defaultLang, ROOT } from "./lib/load.mjs";

const { cv, make } = loadCV();
const NOW = new Date();
const TODAY = NOW.toISOString().slice(0, 10);
const LANG = defaultLang(cv);
const core = make(LANG, NOW);
const en = make("en", NOW), es = make("es", NOW);
const { esc } = core;

const SITE = core.siteUrl(); // https://nicodelara.github.io/
const abs = (p) => (/^https?:/i.test(p) ? p : SITE + String(p || "").replace(/^\.?\//, ""));
const profile = cv.profile || {};
const experience = core.list(cv.experience);
const education = core.list(cv.education);
const contacts = core.list(cv.contact);
const current = experience.filter((e) => !e.end);
const findContact = (re) => contacts.find((c) => re.test(c.url || ""));
const email = findContact(/^mailto:/i);
const sameAs = contacts.map((c) => c.url).filter((u) => /^https?:/i.test(u || ""));
const allSkills = (c) => c.list(cv.skills).flatMap((g) => c.list(g.items).map((s) => c.skillName(s)));

/* ---------- JSON-LD (schema.org) ---------- */
function jsonLd() {
  const person = {
    "@type": "Person",
    "@id": SITE + "#person",
    name: en.t(profile.name),
    jobTitle: en.t(profile.title),
    description: en.t(profile.summary),
    url: SITE,
    image: profile.image ? abs(profile.image) : undefined,
    email: email ? email.url : undefined,
    sameAs,
    worksFor: current.map((e) => ({ "@type": "Organization", name: en.t(e.company) })),
    alumniOf: education.map((e) => ({ "@type": "EducationalOrganization", name: en.t(e.institution) })),
    hasCredential: education.map((e) => ({
      "@type": "EducationalOccupationalCredential",
      name: en.t(e.degree),
      credentialCategory: "degree",
      recognizedBy: { "@type": "EducationalOrganization", name: en.t(e.institution) },
    })),
    knowsAbout: allSkills(en),
    knowsLanguage: en.list(cv.languages).map((l) => ({ "@type": "Language", name: en.t(en.skillItem(l).name) })),
  };
  const adr = profile.address || {};
  if (adr.city || adr.region || adr.countryCode) person.address = { "@type": "PostalAddress", addressLocality: adr.city, addressRegion: adr.region, addressCountry: adr.countryCode };
  else if (profile.location) person.address = { "@type": "PostalAddress", addressLocality: en.t(profile.location) };
  // Puesto actual (el historial completo está en resume.json y cv.md)
  person.hasOccupation = current.map((e) => ({
    "@type": "Occupation",
    name: en.t(e.role),
    description: `${en.t(e.role)} — ${en.t(e.company)} (${e.start} – ${e.end || "present"}${e.modality ? `, ${en.t(e.modality)}` : ""}). ${en.t(e.description)}`.trim(),
  }));
  const page = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": SITE,
    url: SITE,
    name: en.t(cv.meta && cv.meta.title),
    inLanguage: ["en", "es"],
    dateModified: TODAY,
    mainEntity: person,
  };
  return JSON.stringify(page, (k, v) => (v === undefined || (Array.isArray(v) && !v.length) ? undefined : v), 2).replace(/</g, "\\u003c");
}

/* ---------- <head> ---------- */
function headHTML() {
  const title = core.t(cv.meta && cv.meta.title) || `${core.t(profile.name)} - ${core.t(profile.title)}`;
  const desc = core.t(cv.meta && cv.meta.description) || core.t(profile.summary);
  const [first, ...rest] = core.t(profile.name).split(" ");
  const img = profile.image ? abs(profile.image) : "";
  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<meta name="author" content="${esc(core.t(profile.name))}">`,
    `<meta name="keywords" content="${esc([core.t(profile.title), ...allSkills(en)].join(", "))}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large">`,
    `<link rel="canonical" href="${esc(SITE)}">`,
    `<link rel="alternate" type="text/markdown" hreflang="en" href="cv.md" title="CV (English, Markdown)">`,
    `<link rel="alternate" type="text/markdown" hreflang="es" href="cv.es.md" title="CV (Español, Markdown)">`,
    `<link rel="alternate" type="application/pdf" hreflang="en" href="${esc(en.pdfFile("en"))}" title="CV (English, PDF)">`,
    `<link rel="alternate" type="application/pdf" hreflang="es" href="${esc(es.pdfFile("es"))}" title="CV (Español, PDF)">`,
    `<link rel="alternate" type="application/json" href="resume.json" title="JSON Resume">`,
    `<meta property="og:type" content="profile">`,
    `<meta property="og:site_name" content="${esc(core.t(profile.name))}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${esc(SITE)}">`,
    img && `<meta property="og:image" content="${esc(img)}">`,
    img && `<meta property="og:image:alt" content="${esc(core.ui("photoAlt"))}">`,
    `<meta property="og:locale" content="${LANG === "es" ? "es_AR" : "en_US"}">`,
    `<meta property="og:locale:alternate" content="${LANG === "es" ? "en_US" : "es_AR"}">`,
    `<meta property="profile:first_name" content="${esc(first)}">`,
    rest.length && `<meta property="profile:last_name" content="${esc(rest.join(" "))}">`,
    profile.handle && `<meta property="profile:username" content="${esc(profile.handle)}">`,
    `<meta name="twitter:card" content="summary">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    img && `<meta name="twitter:image" content="${esc(img)}">`,
    `<script type="application/ld+json">\n${jsonLd()}\n  </script>`,
  ].filter(Boolean);
  return "\n  " + lines.join("\n  ") + "\n  ";
}

/* ---------- Markdown ---------- */
function markdown(c) {
  const L = c.lang;
  const out = [];
  out.push(`# ${c.t(profile.name)}`, "", `**${c.t(profile.title)}**`, "");
  if (profile.location) out.push(`${c.t(profile.location)}`, "");
  const contactLines = contacts.map((x) => `- ${c.t(x.label)}: ${/^mailto:/i.test(x.url) ? c.displayUrl(x.url) : x.url}`);
  contactLines.push(`- ${c.ui("website")}: ${SITE}`);
  if (profile.location) contactLines.unshift(`- ${c.ui("location")}: ${c.t(profile.location)}`);
  out.push(`## ${c.ui("contact")}`, "", ...contactLines, "");
  out.push(`## ${c.ui("summary")}`, "", c.t(profile.summary), "");
  out.push(`## ${c.ui("experience")}`, "");
  for (const e of experience) {
    out.push(`### ${c.t(e.role)} — ${c.t(e.company)}`, "");
    const iso = `${e.start} – ${e.end || (L === "es" ? "actualidad" : "present")}`;
    out.push(`${c.periodText(e.start, e.end)} · ${c.duration(e.start, e.end)}${e.end ? "" : ` · ${c.ui("current")}`}${e.modality ? ` · ${c.t(e.modality)}` : ""}${e.location ? ` · ${c.t(e.location)}` : ""} (${iso})`, "");
    if (e.description) out.push(c.t(e.description), "");
    for (const h of c.list(e.highlights)) out.push(`- ${c.t(h)}`);
    if (c.list(e.highlights).length) out.push("");
    if (c.list(e.technologies).length) out.push(`${c.ui("stack")}: ${e.technologies.map(c.t).join(", ")}`, "");
  }
  out.push(`## ${c.ui("education")}`, "");
  for (const e of education) {
    out.push(`### ${c.t(e.degree)} — ${c.t(e.institution)}`, "");
    if (e.start) out.push(`${c.periodText(e.start, e.end)} (${e.start} – ${e.end || "present"})`, "");
  }
  out.push(`## ${c.ui("skills")}`, "");
  for (const g of c.list(cv.skills)) out.push(`- **${c.t(g.category)}:** ${c.list(g.items).map((s) => c.skillName(s)).join(", ")}`);
  out.push("", `## ${c.ui("languages")}`, "");
  for (const l of c.list(cv.languages)) { const i = c.skillItem(l); out.push(`- ${c.t(i.name)}${i.level ? ` — ${c.t(i.level)}` : ""}`); }
  out.push("", "---", "", `${c.ui("updated")}: ${TODAY} · ${SITE} · PDF: ${SITE}${c.pdfFile(L)}`, "");
  return out.join("\n");
}

/* ---------- JSON Resume ---------- */
function jsonResume() {
  const c = en;
  const net = (u) => (/linkedin/i.test(u) ? "LinkedIn" : /github/i.test(u) ? "GitHub" : c.displayUrl(u));
  const user = (u) => c.displayUrl(u).split("/").filter(Boolean).pop();
  return JSON.stringify({
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: c.t(profile.name),
      label: c.t(profile.title),
      image: profile.image ? abs(profile.image) : undefined,
      email: email ? c.displayUrl(email.url) : undefined,
      url: SITE,
      summary: c.t(profile.summary),
      location: profile.address ? { city: profile.address.city, region: profile.address.region, countryCode: profile.address.countryCode }
        : profile.location ? { city: c.t(profile.location) } : undefined,
      profiles: sameAs.map((u) => ({ network: net(u), username: user(u), url: u })),
    },
    work: experience.map((e) => ({
      name: c.t(e.company), position: c.t(e.role),
      location: e.location ? c.t(e.location) : (e.modality && /remote/i.test(c.t(e.modality)) ? "Remote" : undefined),
      startDate: e.start, endDate: e.end || undefined,
      summary: [e.modality ? `${c.ui("modality")}: ${c.t(e.modality)}.` : "", c.t(e.description)].filter(Boolean).join(" ") || undefined,
      highlights: c.list(e.highlights).map(c.t),
    })),
    education: education.map((e) => ({ institution: c.t(e.institution), studyType: c.t(e.degree), startDate: e.start, endDate: e.end || undefined })),
    skills: c.list(cv.skills).map((g) => ({ name: c.t(g.category), keywords: c.list(g.items).map((s) => c.skillName(s)) })),
    languages: c.list(cv.languages).map((l) => ({ language: c.t(c.skillItem(l).name), fluency: c.t(c.skillItem(l).level) })),
    meta: { canonical: SITE + "resume.json", lastModified: TODAY },
  }, (k, v) => (v === undefined ? undefined : v), 2) + "\n";
}

/* ---------- llms.txt / robots / sitemap ---------- */
function llms() {
  const c = en;
  return [
    `# ${c.t(profile.name)}`, "",
    `> ${c.t(profile.title)}. ${c.t(profile.summary)}`, "",
    ...(profile.location ? [`Location: ${c.t(profile.location)}`, ""] : []),
    `Personal website and CV/résumé of ${c.t(profile.name)}. The same content is available in these machine-readable formats (generated from a single source on ${TODAY}):`, "",
    "## CV", "",
    `- [CV in English (Markdown)](${SITE}cv.md): full résumé as plain Markdown`,
    `- [CV en español (Markdown)](${SITE}cv.es.md): CV completo en español`,
    `- [Résumé PDF (English)](${SITE}${c.pdfFile("en")})`,
    `- [CV PDF (español)](${SITE}${c.pdfFile("es")})`,
    `- [JSON Resume](${SITE}resume.json): structured data (jsonresume.org schema)`, "",
    "## Experience", "",
    ...experience.map((e) => `- ${c.t(e.role)} — ${c.t(e.company)} (${e.start} – ${e.end || "present"}${e.modality ? `, ${c.t(e.modality)}` : ""})`),
    "",
    "## Contact", "",
    ...contacts.map((x) => `- ${c.t(x.label)}: ${/^mailto:/i.test(x.url) ? c.displayUrl(x.url) : x.url}`),
    "",
  ].join("\n");
}
const robots = () => `# Todos los crawlers (buscadores y de IA) son bienvenidos\nUser-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`;
function sitemap() {
  const urls = ["", "cv.md", "cv.es.md", en.pdfFile("en"), es.pdfFile("es"), "resume.json", "llms.txt"];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod></url>`).join("\n") + "\n</urlset>\n";
}

/* ---------- index.html ---------- */
function replaceBlock(htmlText, name, content) {
  const re = new RegExp(`(<!-- build:${name}\\b[^>]*-->)[\\s\\S]*?(<!-- /build:${name} -->)`);
  if (!re.test(htmlText)) throw new Error(`Falta el marcador <!-- build:${name} --> en index.html`);
  return htmlText.replace(re, (_, a, b) => a + content + b);
}
let page = readFileSync(join(ROOT, "index.html"), "utf8");
page = page.replace(/<html lang="[^"]*"/, `<html lang="${LANG}"`);
page = page.replace(/(<a class="skip-link"[^>]*>)[^<]*(<\/a>)/, `$1${esc(core.ui("skipToContent"))}$2`);
page = replaceBlock(page, "head", headHTML());
page = replaceBlock(page, "controls", core.controlsHTML());
page = replaceBlock(page, "content", "\n" + core.sidebarHTML() + core.mainHTML() + "\n    ");
page = replaceBlock(page, "footer", core.footerHTML());

const files = {
  "index.html": page,
  "cv.md": markdown(en),
  "cv.es.md": markdown(es),
  "resume.json": jsonResume(),
  "llms.txt": llms(),
  "robots.txt": robots(),
  "sitemap.xml": sitemap(),
};
for (const [f, content] of Object.entries(files)) writeFileSync(join(ROOT, f), content);
console.log(`✔ build (${LANG}, ${TODAY}): ${Object.keys(files).join(", ")}`);
