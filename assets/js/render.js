/* Arma la página a partir de window.CV (definido en cv-data.js).
   No hace falta tocar este archivo para agregar contenido. */
(function () {
  var cv = window.CV;
  var root = document.getElementById("cv");
  if (!cv || !root) return;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function list(a) { return Array.isArray(a) ? a : []; }

  var ICONS = {
    email:
      '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
    linkedin:
      '<svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>',
    github:
      '<svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
  };

  function section(title, inner) {
    return '<section class="section"><h3 class="section-title">' + esc(title) + "</h3>" + inner + "</section>";
  }

  var p = cv.profile || {};
  var html = "";

  // Encabezado
  html +=
    '<div class="hero">' +
      '<div class="avatar">' +
        (p.image
          ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" fetchpriority="high">'
          : "") +
        '<div class="avatar-fallback"' + (p.image ? " hidden" : "") + "><span>" + esc(p.initials) + "</span></div>" +
      "</div>" +
      '<div class="hero-text">' +
        "<h1>" + esc(p.name) + "</h1>" +
        "<h2>" + esc(p.title) + "</h2>" +
        "<p>" + esc(p.summary) + "</p>" +
      "</div>" +
    "</div>";

  // Experiencia
  if (list(cv.experience).length) {
    html += section("Experience",
      '<div class="stack">' +
      list(cv.experience).map(function (e) {
        var hl = list(e.highlights);
        return '<div class="card">' +
          "<h4>" + esc(e.company ? e.role + " - " + e.company : e.role) + "</h4>" +
          (e.period ? '<p class="meta">' + esc(e.period) + "</p>" : "") +
          (e.description ? '<p class="desc">' + esc(e.description) + "</p>" : "") +
          (hl.length ? '<ul class="highlights">' + hl.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul>" : "") +
        "</div>";
      }).join("") +
      "</div>");
  }

  // Educación
  if (list(cv.education).length) {
    html += section("Education",
      '<div class="stack">' +
      list(cv.education).map(function (e) {
        return '<div class="card">' +
          "<h4>" + esc(e.degree) + "</h4>" +
          (e.institution ? '<p class="' + (e.period ? "meta-sm" : "meta-last") + '">' + esc(e.institution) + "</p>" : "") +
          (e.period ? '<p class="meta-last">' + esc(e.period) + "</p>" : "") +
        "</div>";
      }).join("") +
      "</div>");
  }

  function chips(items, extraClass) {
    return '<div class="grid ' + (extraClass || "") + '">' +
      list(items).map(function (s) { return '<div class="card chip"><span>' + esc(s) + "</span></div>"; }).join("") +
      "</div>";
  }
  if (list(cv.skills).length) html += section("Skills", chips(cv.skills, "grid-3"));
  if (list(cv.languages).length) html += section("Languages", chips(cv.languages));

  // Contacto
  if (list(cv.contact).length) {
    html += section("Contact",
      '<div class="contact">' +
      list(cv.contact).map(function (c) {
        var external = /^https?:/i.test(c.url || "");
        return '<a href="' + esc(c.url) + '"' + (external ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" +
          '<span class="label">' + (ICONS[c.icon] || "") + esc(c.label) + "</span></a>";
      }).join("") +
      "</div>");
  }

  root.innerHTML = html;

  // Si la foto no carga, mostrar las iniciales (igual que el sitio Next)
  var img = root.querySelector(".avatar img");
  if (img) {
    img.addEventListener("error", function () {
      img.remove();
      root.querySelector(".avatar-fallback").hidden = false;
    });
  }
})();
