/* Comportamiento de la página: idioma, tema, animaciones, botón PDF.
   El HTML lo arma cv-core.js a partir de cv-data.js (el mismo código que usa
   scripts/build.mjs para prerenderizar index.html). No hace falta tocarlo. */
(function () {
  "use strict";
  var cv = window.CV, ICONS = window.CV_ICONS || {}, Core = window.CVCore;
  var root = document.getElementById("cv");
  var controls = document.getElementById("controls");
  var footer = document.getElementById("site-footer");
  var html = document.documentElement;
  if (!cv || !root || !Core) return; // sin datos: queda el HTML prerenderizado

  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = html.lang === "es" ? "es" : "en";
  var core;

  /* ---------- tema ---------- */
  function currentTheme() { return html.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  function setTheme(th, persist) {
    html.setAttribute("data-theme", th);
    if (persist) { try { localStorage.setItem("theme", th); } catch (e) {} }
    updateThemeButton();
  }
  function updateThemeButton() {
    var b = document.getElementById("theme-toggle");
    if (!b || !core) return;
    var dark = currentTheme() === "dark";
    var label = dark ? core.ui("toLight") : core.ui("toDark");
    b.setAttribute("aria-label", label);
    b.setAttribute("title", label);
    b.setAttribute("aria-pressed", dark ? "true" : "false");
    b.innerHTML = dark ? core.icon("sun") : core.icon("moon");
  }
  if (window.matchMedia) {
    var mq = matchMedia("(prefers-color-scheme: dark)");
    var onChange = function (e) {
      var saved; try { saved = localStorage.getItem("theme"); } catch (x) {}
      if (saved !== "light" && saved !== "dark") setTheme(e.matches ? "dark" : "light", false);
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange); else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- controles ---------- */
  controls.addEventListener("click", function (ev) {
    var b = ev.target.closest("button");
    if (!b) return;
    if (b.dataset.lang && b.dataset.lang !== lang) {
      lang = b.dataset.lang;
      try { localStorage.setItem("lang", lang); } catch (e) {}
      renderAll(true);
      var nb = controls.querySelector('[data-lang="' + lang + '"]');
      if (nb) nb.focus();
    } else if (b.id === "theme-toggle") {
      setTheme(currentTheme() === "dark" ? "light" : "dark", true);
    }
  });

  // Ctrl+P / imprimir la página: nombre de archivo sugerido
  var savedTitle;
  window.addEventListener("beforeprint", function () { savedTitle = document.title; document.title = core.ui("pdfFileName"); });
  window.addEventListener("afterprint", function () { if (savedTitle) document.title = savedTitle; });

  /* ---------- animaciones ---------- */
  function setupReveal(instant) {
    var items = root.querySelectorAll(".reveal");
    if (instant || reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }
  function setupTyping(instant) {
    var el = root.querySelector(".typed");
    if (!el || instant || reduceMotion || el.getClientRects().length > 1) return;
    el.classList.add("is-typing");
  }
  function setupImage() {
    var img = root.querySelector(".avatar img");
    if (!img) return;
    var fail = function () { img.remove(); var f = root.querySelector(".avatar-fallback"); if (f) f.hidden = false; };
    if (img.complete && img.naturalWidth === 0) fail(); else img.addEventListener("error", fail);
  }

  /* Sidebar sticky que nunca queda cortada */
  var TOP = 84, GAP = 24;
  function fitSidebar() {
    var sb = root.querySelector(".sidebar");
    if (!sb) return;
    sb.style.setProperty("--side-top", Math.min(TOP, window.innerHeight - sb.offsetHeight - GAP) + "px");
  }
  window.addEventListener("resize", fitSidebar);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSidebar);

  function renderAll(isRerender) {
    core = Core.create(cv, ICONS, { lang: lang });
    html.lang = lang;
    document.title = core.t(cv.meta && cv.meta.title) || document.title;
    var md = document.querySelector('meta[name="description"]');
    if (md && cv.meta && cv.meta.description) md.setAttribute("content", core.t(cv.meta.description));
    var skip = document.getElementById("skip-link");
    if (skip) skip.textContent = core.ui("skipToContent");
    controls.innerHTML = core.controlsHTML();
    updateThemeButton();
    // Se vuelve a armar desde cv-data.js: si index.html no se regeneró, igual se ve lo último
    root.innerHTML = core.sidebarHTML() + core.mainHTML();
    if (footer) footer.innerHTML = core.footerHTML();
    setupImage();
    setupReveal(isRerender);
    setupTyping(isRerender);
    fitSidebar();
  }

  renderAll(false);
})();
