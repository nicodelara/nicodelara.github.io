// Carga cv-data.js, icons.js y cv-core.js (scripts de navegador) dentro de Node, sin dependencias.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function loadCV() {
  const window = {};
  const ctx = vm.createContext({ window, globalThis: window, console });
  for (const f of ["cv-data.js", "assets/js/icons.js", "assets/js/cv-core.js"]) {
    vm.runInContext(readFileSync(join(ROOT, f), "utf8"), ctx, { filename: f });
  }
  if (!window.CV) throw new Error("cv-data.js no definió window.CV");
  // Copia "limpia" (objetos del contexto vm -> objetos normales)
  const cv = JSON.parse(JSON.stringify(window.CV));
  const icons = JSON.parse(JSON.stringify(window.CV_ICONS || {}));
  const Core = window.CVCore;
  return { cv, icons, Core, make: (lang, now = new Date()) => Core.create(cv, icons, { lang, now }) };
}

// Idioma de la versión estática (lo que ven buscadores, ATS y crawlers sin JavaScript)
export function defaultLang(cv) { return (cv.meta && cv.meta.defaultLang) === "es" ? "es" : "en"; }
