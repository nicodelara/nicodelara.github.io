/* =========================================================================
   cv-core.js — arma el HTML del CV a partir de cv-data.js.
   Lo usan el navegador (assets/js/render.js) y el build de Node
   (scripts/build.mjs, scripts/pdf.mjs), así la página prerenderizada y la
   que arma el JavaScript son idénticas. No hace falta tocarlo para editar el CV.
   ========================================================================= */
(function (root) {
  "use strict";

  // Textos de interfaz por defecto. cv-data.js -> ui los puede pisar.
  var DEFAULT_UI = {
    summary: { es: "Perfil", en: "Summary" },
    experience: { es: "Experiencia", en: "Experience" },
    education: { es: "Educación", en: "Education" },
    skills: { es: "Skills", en: "Skills" },
    languages: { es: "Idiomas", en: "Languages" },
    contact: { es: "Contacto", en: "Contact" },
    current: { es: "Actual", en: "Current" },
    present: { es: "Actualidad", en: "Present" },
    downloadPdf: { es: "Descargar CV en PDF", en: "Download CV as PDF" },
    pdfShort: { es: "PDF", en: "PDF" },
    toDark: { es: "Activar modo oscuro", en: "Switch to dark mode" },
    toLight: { es: "Activar modo claro", en: "Switch to light mode" },
    language: { es: "Idioma", en: "Language" },
    skipToContent: { es: "Saltar al contenido", en: "Skip to content" },
    photoAlt: { es: "Foto de Nicolás de Lara", en: "Photo of Nicolás de Lara" },
    pdfFileName: { es: "CV - Nicolás de Lara", en: "CV - Nicolás de Lara" },
    website: { es: "Web", en: "Website" },
    location: { es: "Ubicación", en: "Location" },
    modality: { es: "Modalidad", en: "Work mode" },
    stack: { es: "Tecnologías", en: "Tech" },
    otherFormats: { es: "Este CV también está disponible en", en: "This CV is also available as" },
    pdfEs: { es: "PDF (español)", en: "PDF (Spanish)" },
    pdfEn: { es: "PDF (inglés)", en: "PDF (English)" },
    mdEs: { es: "Markdown (español)", en: "Markdown (Spanish)" },
    mdEn: { es: "Markdown (inglés)", en: "Markdown (English)" },
    updated: { es: "Actualizado", en: "Updated" },
  };

  var MONTHS = {
    es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function list(a) { return Array.isArray(a) ? a : []; }
  function slug(s) {
    return String(s || "cv").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function parseYM(s) {
    var m = /^(\d{4})-(\d{1,2})$/.exec(String(s || ""));
    return m ? { y: +m[1], m: +m[2] } : null;
  }
  function isoYM(ym) { return ym ? ym.y + "-" + (ym.m < 10 ? "0" : "") + ym.m : ""; }

  function create(cv, icons, opts) {
    opts = opts || {};
    var lang = opts.lang === "es" ? "es" : "en";
    var nowDate = opts.now || new Date();
    var NOW = { y: nowDate.getFullYear(), m: nowDate.getMonth() + 1 };
    icons = icons || {};
    cv = cv || {};

    // Texto bilingüe: string simple u objeto { es, en }
    function t(v) {
      if (v == null) return "";
      if (typeof v === "object" && !Array.isArray(v)) return v[lang] != null ? v[lang] : (v.en != null ? v.en : (v.es != null ? v.es : ""));
      return String(v);
    }
    function ui(key) {
      var u = (cv.ui || {})[key] != null ? cv.ui[key] : DEFAULT_UI[key];
      return t(u) || key;
    }
    function icon(name, cls) {
      var i = icons[name];
      if (!i) return "";
      var style = i.brand && i.color ? ' style="--brand:' + esc(i.color) + '"' : "";
      return '<svg class="icon ' + (cls || "") + (i.brand ? " icon-brand" : "") + '"' + style +
        ' viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' + i.svg + "</svg>";
    }
    function fmtYM(ym) { return ym ? MONTHS[lang][ym.m - 1] + " " + ym.y : ""; }
    function periodText(start, end) {
      return fmtYM(parseYM(start)) + " – " + (end ? fmtYM(parseYM(end)) : ui("present"));
    }
    // Duración inclusiva (como LinkedIn): Mar 2022 – Mar 2022 = 1 mes
    function duration(start, end) {
      var s = parseYM(start), e = end ? parseYM(end) : NOW;
      if (!s || !e) return "";
      var total = Math.max(1, (e.y - s.y) * 12 + (e.m - s.m) + 1);
      var y = Math.floor(total / 12), m = total % 12, out = [];
      if (lang === "es") {
        if (y) out.push(y + (y === 1 ? " año" : " años"));
        if (m) out.push(m + (m === 1 ? " mes" : " meses"));
      } else {
        if (y) out.push(y + (y === 1 ? " yr" : " yrs"));
        if (m) out.push(m + (m === 1 ? " mo" : " mos"));
      }
      return out.join(" ");
    }
    function timeRange(start, end) {
      var s = parseYM(start), e = end ? parseYM(end) : null;
      var endTxt = e ? '<time datetime="' + isoYM(e) + '">' + esc(fmtYM(e)) + "</time>" : esc(ui("present"));
      return '<time datetime="' + isoYM(s) + '">' + esc(fmtYM(s)) + "</time> – " + endTxt;
    }
    function displayUrl(u) {
      return String(u || "").replace(/^mailto:/i, "").replace(/^tel:/i, "").replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
    }
    function siteUrl() { return String((cv.meta && cv.meta.url) || "").replace(/\/?$/, "/"); }
    function pdfFile(l) { return String(t((cv.profile || {}).name) || "CV").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + "-CV-" + (l || lang).toUpperCase() + ".pdf"; }
    function skillName(s) { return t(typeof s === "object" && s && s.name !== undefined ? s.name : s); }
    function skillItem(s) { return typeof s === "object" && s && s.name !== undefined ? s : { name: s }; }
    function isCurrent(e) { return !e.end; }

    /* ---------- bloques HTML de la página ---------- */
    function sideBlock(cls, title, inner) {
      return '<section class="side-block ' + cls + '" aria-labelledby="h-' + cls.split(" ")[0] + '">' +
        '<h2 class="side-title mono" id="h-' + cls.split(" ")[0] + '">' + esc(title) + "</h2>" + inner + "</section>";
    }
    function section(id, num, title, inner) {
      return '<section class="section" id="' + id + '" aria-labelledby="h-' + id + '">' +
        '<h2 class="section-title" id="h-' + id + '" data-num="' + num + '">' + esc(title) + "</h2>" + inner + "</section>";
    }

    function sidebarHTML() {
      var p = cv.profile || {};
      var title = t(p.title);
      var out = '<div class="sidebar">';
      out += '<header class="profile reveal">' +
        '<div class="avatar">' +
          (p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(ui("photoAlt")) + '" width="460" height="460" fetchpriority="high">' : "") +
          '<div class="avatar-fallback"' + (p.image ? " hidden" : "") + "><span>" + esc(p.initials) + "</span></div>" +
        "</div>" +
        '<h1 class="name">' + esc(t(p.name)) + "</h1>" +
        '<div class="terminal">' +
          '<div class="term-bar" aria-hidden="true"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>' +
            '<span class="term-name mono">' + esc(p.handle || "cv") + "@github: ~</span></div>" +
          '<div class="term-body mono">' +
            '<p class="term-line" aria-hidden="true"><span class="prompt">$</span> whoami</p>' +
            '<p class="term-out job-title"><span class="typed" style="--n:' + title.length + '">' + esc(title) + '</span><span class="caret" aria-hidden="true"></span></p>' +
          "</div>" +
        "</div>" +
        (p.location ? '<p class="location">' + icon("pin") + '<span class="vh">' + esc(ui("location")) + ': </span><span>' + esc(t(p.location)) + "</span></p>" : "") +
        '<p class="summary">' + esc(t(p.summary)) + "</p>" +
      "</header>";

      var contacts = list(cv.contact);
      if (contacts.length) {
        out += sideBlock("contact reveal", ui("contact"),
          '<ul class="contact-list">' + contacts.map(function (c) {
            var ext = /^https?:/i.test(c.url || "");
            return '<li><a href="' + esc(c.url) + '"' + (ext ? ' target="_blank" rel="noopener noreferrer me"' : "") +
              '>' + icon(c.icon) + '<span class="label vh">' + esc(t(c.label)) + ': </span><span class="value">' + esc(displayUrl(c.url)) + "</span></a></li>";
          }).join("") +
          (cv.meta && cv.meta.url ? '<li class="print-only"><a href="' + esc(siteUrl()) + '">' + icon("globe") + '<span class="label vh">' + esc(ui("website")) + ': </span><span class="value">' + esc(displayUrl(cv.meta.url)) + "</span></a></li>" : "") +
          "</ul>");
      }

      if (list(cv.skills).length) {
        out += sideBlock("skills reveal", ui("skills"),
          list(cv.skills).map(function (g) {
            return '<div class="skill-group"><h3 class="skill-cat">' + esc(t(g.category)) + "</h3>" +
              '<ul class="chips">' + list(g.items).map(function (s) {
                var item = skillItem(s);
                return '<li class="chip">' + icon(item.icon || "code") + "<span>" + esc(t(item.name)) + "</span></li>";
              }).join("") + "</ul></div>";
          }).join(""));
      }

      if (list(cv.languages).length) {
        out += sideBlock("langs reveal", ui("languages"),
          '<ul class="lang-list">' + list(cv.languages).map(function (l) {
            var item = skillItem(l);
            return "<li><span>" + esc(t(item.name)) + "</span>" + (item.level ? '<span class="level mono">' + esc(t(item.level)) + "</span>" : "") + "</li>";
          }).join("") + "</ul>");
      }
      return out + "</div>";
    }

    function mainHTML() {
      var out = '<div class="col-main">';
      var n = 0;
      if (list(cv.experience).length) {
        n++;
        out += section("experience", "0" + n, ui("experience"),
          '<ol class="timeline">' + list(cv.experience).map(function (e) {
            var cur = isCurrent(e);
            var hl = list(e.highlights), tech = list(e.technologies);
            return '<li class="tl-item reveal' + (cur ? " is-current" : "") + '">' +
              '<span class="tl-dot" aria-hidden="true"></span>' +
              '<article class="card job">' +
                '<header class="job-head">' +
                  '<h3 class="job-role">' + esc(t(e.role)) + "</h3>" +
                  (cur ? '<span class="badge"><span class="pulse" aria-hidden="true"></span>' + esc(ui("current")) + "</span>" : "") +
                "</header>" +
                (e.company ? '<p class="job-company">' + esc(t(e.company)) + (e.location ? ' <span class="job-loc">· ' + esc(t(e.location)) + "</span>" : "") + "</p>" : "") +
                '<p class="job-meta mono">' + timeRange(e.start, e.end) + ' <span class="sep" aria-hidden="true">·</span> <span class="dur">' + esc(duration(e.start, e.end)) + "</span>" +
                  (e.modality ? ' <span class="sep" aria-hidden="true">·</span> <span class="mode">' + esc(t(e.modality)) + "</span>" : "") + "</p>" +
                (e.description ? '<p class="desc">' + esc(t(e.description)) + "</p>" : "") +
                (hl.length ? '<ul class="highlights">' + hl.map(function (h) { return "<li>" + esc(t(h)) + "</li>"; }).join("") + "</ul>" : "") +
                (tech.length ? '<p class="job-tech"><span class="job-tech-label">' + esc(ui("stack")) + ":</span> " + tech.map(function (x) { return esc(t(x)); }).join(", ") + "</p>" : "") +
              "</article></li>";
          }).join("") + "</ol>");
      }
      if (list(cv.education).length) {
        n++;
        out += section("education", "0" + n, ui("education"),
          '<div class="stack">' + list(cv.education).map(function (e) {
            return '<article class="card edu reveal">' +
              '<span class="edu-icon" aria-hidden="true">' + icon("graduation") + "</span>" +
              "<div>" +
                '<h3 class="job-role">' + esc(t(e.degree)) + "</h3>" +
                (e.institution ? '<p class="job-company">' + esc(t(e.institution)) + "</p>" : "") +
                (e.start ? '<p class="job-meta mono">' + timeRange(e.start, e.end) + "</p>" : "") +
              "</div></article>";
          }).join("") + "</div>");
      }
      return out + "</div>";
    }

    function controlsHTML() {
      return '<div class="lang-switch" role="group" aria-label="' + esc(ui("language")) + '">' +
          ["es", "en"].map(function (l) {
            return '<button type="button" class="seg mono" data-lang="' + l + '" aria-pressed="' + (l === lang) + '" lang="' + l + '"' +
              ' aria-label="' + (l === "es" ? "Español" : "English") + '">' + l.toUpperCase() + "</button>";
          }).join("") +
        "</div>" +
        '<button type="button" class="icon-btn" id="theme-toggle" aria-label="' + esc(ui("toDark")) + '" title="' + esc(ui("toDark")) + '" aria-pressed="false">' + icon("moon") + "</button>" +
        '<a class="btn-primary" id="pdf-link" href="' + esc(pdfFile()) + '" download type="application/pdf" aria-label="' + esc(ui("downloadPdf")) + '">' +
          icon("download") + '<span class="long">' + esc(ui("downloadPdf")) + '</span><span class="short" aria-hidden="true">' + esc(ui("pdfShort")) + "</span>" +
        "</a>";
    }

    function footerHTML() {
      var links = [
        [pdfFile("en"), ui("pdfEn"), "application/pdf"],
        [pdfFile("es"), ui("pdfEs"), "application/pdf"],
        ["cv.md", ui("mdEn"), "text/markdown"],
        ["cv.es.md", ui("mdEs"), "text/markdown"],
        ["resume.json", "JSON Resume", "application/json"],
        ["llms.txt", "llms.txt", "text/plain"],
      ];
      return '<p><span class="mono prompt-sm" aria-hidden="true">$ ls ~/' + esc((cv.profile || {}).handle || "cv") + "</span> " + esc(ui("otherFormats")) + ": " +
        links.map(function (l) { return '<a href="' + esc(l[0]) + '" type="' + l[2] + '">' + esc(l[1]) + "</a>"; }).join(' <span aria-hidden="true">·</span> ') + "</p>";
    }

    return {
      lang: lang, t: t, ui: ui, esc: esc, icon: icon, list: list,
      parseYM: parseYM, isoYM: isoYM, fmtYM: fmtYM, periodText: periodText, duration: duration, timeRange: timeRange,
      displayUrl: displayUrl, siteUrl: siteUrl, pdfFile: pdfFile, skillName: skillName, skillItem: skillItem, isCurrent: isCurrent,
      sidebarHTML: sidebarHTML, mainHTML: mainHTML, controlsHTML: controlsHTML, footerHTML: footerHTML,
    };
  }

  root.CVCore = { create: create, slug: slug };
})(typeof window !== "undefined" ? window : globalThis);
