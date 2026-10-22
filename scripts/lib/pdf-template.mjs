// HTML del CV en PDF (A4). Un solo flujo de lectura: nombre → título → contacto → perfil →
// experiencia → educación → skills → idiomas. Lo decorativo (banda, puntos, línea de
// timeline, cursor) es CSS sin texto, así no ensucia lo que leen los ATS.
export function pdfHTML(cv, c, { baseHref, site }) {
  const { esc, t, ui, list } = c;
  const p = cv.profile || {};
  const abs = (u) => (/^(https?:|mailto:|tel:)/i.test(u) ? u : site + String(u).replace(/^\.?\//, ""));
  const contacts = list(cv.contact).map((x) => ({ href: abs(x.url), text: c.displayUrl(x.url), icon: x.icon }));
  if (cv.meta && cv.meta.url) contacts.push({ href: site, text: c.displayUrl(site), icon: "globe" });

  const job = (e) => {
    const cur = !e.end;
    const hl = list(e.highlights), tech = list(e.technologies);
    return `<li class="job${cur ? " is-current" : ""}">
      <h3 class="role">${esc(t(e.role))}</h3>
      <p class="company">${esc(t(e.company))}${e.location ? ` · ${esc(t(e.location))}` : ""}</p>
      <p class="meta">${c.timeRange(e.start, e.end)} · <span class="dur">${esc(c.duration(e.start, e.end))}</span>${e.modality ? ` · <span class="mode">${esc(t(e.modality))}</span>` : ""}${cur ? ` <span class="badge">${esc(ui("current"))}</span>` : ""}</p>
      ${e.description ? `<p class="desc">${esc(t(e.description))}</p>` : ""}
      ${hl.length ? `<ul class="bullets">${hl.map((h) => `<li>${esc(t(h))}</li>`).join("")}</ul>` : ""}
      ${tech.length ? `<p class="tech"><strong>${esc(ui("stack"))}:</strong> ${tech.map((x) => esc(t(x))).join(", ")}</p>` : ""}
    </li>`;
  };

  return `<!DOCTYPE html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8">
<base href="${esc(baseHref)}">
<title>${esc(`${t(p.name)} — ${t(p.title)} — ${c.lang === "es" ? "CV" : "Résumé"}`)}</title>
<meta name="author" content="${esc(t(p.name))}">
<link rel="stylesheet" href="assets/css/pdf.css">
</head>
<body>
<header class="band">
  <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
  ${p.image ? `<img class="photo" src="${esc(p.image)}" alt="${esc(ui("photoAlt"))}">` : ""}
  <div class="id">
    <h1 class="name">${esc(t(p.name))}</h1>
    <p class="title">${esc(t(p.title))}<span class="caret" aria-hidden="true"></span></p>
    <ul class="contact">${p.location ? `<li class="loc">${c.icon("pin")}<span>${esc(t(p.location))}</span></li>` : ""}${contacts.map((x) => `<li><a href="${esc(x.href)}">${c.icon(x.icon)}${esc(x.text)}</a></li>`).join("")}</ul>
  </div>
</header>
<main class="content">
  <section>
    <h2>${esc(ui("summary"))}</h2>
    <p class="summary">${esc(t(p.summary))}</p>
  </section>
  <section>
    <h2>${esc(ui("experience"))}</h2>
    <ol class="timeline">${list(cv.experience).map(job).join("")}</ol>
  </section>
  <section>
    <h2>${esc(ui("education"))}</h2>
    <ul class="edu">${list(cv.education).map((e) => `<li>
      <h3 class="role">${esc(t(e.degree))}</h3>
      <p class="company">${esc(t(e.institution))}</p>
      ${e.start ? `<p class="meta">${c.timeRange(e.start, e.end)}</p>` : ""}
    </li>`).join("")}</ul>
  </section>
  <section>
      <h2>${esc(ui("skills"))}</h2>
      <ul class="skills">${list(cv.skills).map((g) => `<li><h3 class="cat">${esc(t(g.category))}</h3><p class="chips">${list(g.items).map((s) => {
        const i = c.skillItem(s);
        return `<span class="chip">${c.icon(i.icon || "code")}${esc(t(i.name))}</span>`;
      }).join(" ")}</p></li>`).join("")}</ul>
  </section>
  <section>
      <h2>${esc(ui("languages"))}</h2>
      <ul class="langs">${list(cv.languages).map((l) => { const i = c.skillItem(l); return `<li>${esc(t(i.name))}${i.level ? ` <span class="lvl">— ${esc(t(i.level))}</span>` : ""}</li>`; }).join("")}</ul>
  </section>
</main>
<footer class="foot"><span class="prompt">~/${esc(p.handle || "cv")} $</span> ${esc(ui("updated"))} ${esc(c.fmtYM({ y: new Date().getFullYear(), m: new Date().getMonth() + 1 }))} · <a href="${esc(site)}">${esc(c.displayUrl(site))}</a></footer>
</body>
</html>`;
}
