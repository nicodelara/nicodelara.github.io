# nicodelara.github.io

Mi CV online. HTML + CSS + un poco de JavaScript, con modo claro/oscuro, español/inglés, timeline de experiencia y PDFs listos para descargar.

**Lo único que edito es `cv-data.js`.** Todo lo demás (la página prerenderizada, los PDFs, las versiones en Markdown y los archivos para buscadores e IA) se genera solo a partir de ese archivo.

---

## Cómo actualizo el CV

1. Edito `cv-data.js` (ver ejemplos abajo).
2. `git add . && git commit -m "Actualizo CV" && git push`
3. Listo: la GitHub Action (`.github/workflows/pages.yml`) vuelve a generar todo y lo publica en https://nicodelara.github.io en uno o dos minutos.

Si quiero verlo antes de subir, o generar los archivos en mi compu (opcional):

```bash
npm install            # una sola vez (instala playwright-core y pdf-lib, solo para desarrollo)
npm run build          # = node scripts/build.mjs  → index.html, cv.md, cv.es.md, resume.json, llms.txt, robots.txt, sitemap.xml
npm run pdf            # = node scripts/pdf.mjs    → Nicolas-de-Lara-CV-ES.pdf y Nicolas-de-Lara-CV-EN.pdf
npm run all            # las dos cosas
python3 -m http.server 8000   # y abro http://localhost:8000
```

`npm run build` no necesita nada instalado (solo Node 18+). `npm run pdf` usa Google Chrome / Chromium que ya tenga instalado (si está en otro lugar: `CHROME_PATH=/ruta/al/chrome npm run pdf`). Opción: `node scripts/pdf.mjs --no-photo` genera los PDFs sin foto.

> ¿Y si me olvido de correr el build? No pasa nada: la Action lo corre en cada push. Y aunque no corra, el JavaScript de la página arma todo desde `cv-data.js`, así que en el navegador siempre se ve lo último.

### ⚙️ Paso único en GitHub (para que la Action publique)

En el repo: **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.
Mientras siga en "Deploy from a branch", GitHub publica los archivos tal cual están en `master` (también funciona, porque los archivos generados están commiteados, pero solo se actualizan si corro `npm run all` antes de hacer push).

La Action además corre sola el 1° de cada mes, para que las duraciones ("1 año 6 meses") y los PDFs estén al día. También se puede correr a mano desde la pestaña **Actions → Build y deploy del CV → Run workflow**.

---

## El formato de `cv-data.js`

### Textos en dos idiomas

- **string simple** → igual en los dos idiomas: `company: "Mercado Libre"`
- **objeto `{ es, en }`** → según el idioma: `description: { es: "Lideré...", en: "Led..." }`

### Fechas

Formato `"AAAA-MM"`. Trabajo actual: `end: null`. El período, la duración y el badge **Actual** se calculan solos (la duración cuenta el mes de inicio y el de fin, como LinkedIn).

### Agregar una experiencia nueva

Pegar un bloque nuevo **arriba de todo** en `experience: [` (se muestran en ese orden):

```js
  experience: [
    {
      role: "Staff Backend Engineer",
      company: "Empresa Nueva",
      start: "2027-01",
      end: null, // null = es mi trabajo actual
      description: {
        es: "Lidero el diseño de la plataforma de pagos.",
        en: "I lead the design of the payments platform.",
      },
      highlights: [
        { es: "Migración a arquitectura orientada a eventos", en: "Migration to an event-driven architecture" },
        "Go, Kafka, PostgreSQL", // un string simple vale para los dos idiomas
      ],
      // Opcionales:
      // location: "Buenos Aires, Argentina (remoto)",
      // technologies: ["Go", "AWS", "PostgreSQL"],   // se muestran como "Tecnologías: ..."
    },
    // ...las que ya estaban siguen acá abajo
```

¡Y cerrar el trabajo anterior! Si era el actual, cambiarle `end: null` por la fecha de salida (`end: "2026-12"`).

Ojo con: la **coma** después de cada `}`, los textos entre comillas dobles (comillas adentro: `\"`), y `highlights: []` si no hay bullets.

### Skills

Agrupadas por categoría; `icon` es una clave de `assets/js/icons.js`:

```js
    {
      category: { es: "Datos", en: "Data" },
      items: [
        { name: "SQL/NoSQL", icon: "database" },
        { name: "Redis", icon: "database" },
      ],
    },
```

Logos nuevos: buscarlos en https://simpleicons.org (CC0), copiar el `path` del SVG y agregarlo en `assets/js/icons.js` como `nombre: { brand: true, color: "#HEX", svg: '<path d="..."/>' }`.

### Otros campos

- `profile.location` (opcional): ciudad/país; aparece en la web, el PDF, el Markdown y los datos estructurados.
- `meta.title` / `meta.description`: título y descripción para Google y para cuando se comparte el link.
- `meta.defaultLang`: idioma de la versión estática (`"en"` por defecto). Ver abajo.
- Foto: `assets/images/profile.png` (el PDF usa una copia achicada que se genera sola).

---

## Listo para ATS e IA (qué hay y por qué)

- **Contenido en el HTML**: `index.html` trae el CV ya escrito (en inglés), así lo leen buscadores, parsers de CV y crawlers de IA que no ejecutan JavaScript. El JS después lo vuelve a armar en el idioma del visitante.
  Elegí inglés como versión estática porque es el idioma que esperan la mayoría de los ATS y de los recruiters/herramientas internacionales; la versión en español está en `cv.es.md` y en el PDF en español.
- **Datos estructurados** (JSON-LD schema.org `ProfilePage` + `Person`): nombre, puesto, empresa actual, estudios, skills, idiomas, email, LinkedIn y GitHub.
- **Metadatos**: título, descripción, canonical, Open Graph y Twitter card.
- **Versiones de texto**: `cv.md` (inglés), `cv.es.md` (español), `resume.json` ([JSON Resume](https://jsonresume.org)) y `llms.txt` (índice para modelos de IA). `robots.txt` deja pasar a todos los crawlers y `sitemap.xml` lista todo.
- **PDFs**: una columna, texto real (seleccionable), fuentes embebidas, títulos estándar (Experience/Experiencia, Education, Skills, Languages), fechas consistentes, links clickeables y metadatos (título, autor, asunto, palabras clave, idioma). Lo decorativo (banda, línea de timeline, puntitos, cursor) es dibujo, no texto.

Para chequear un PDF como lo vería un ATS: `pdftotext Nicolas-de-Lara-CV-ES.pdf -` (o abrirlo, Ctrl+A, copiar y pegar en un editor de texto).

---

## Estructura

```
cv-data.js                  ← TUS DATOS (lo único que hace falta editar)
index.html                  ← página (el contenido entre <!-- build:... --> lo escribe el build)
Nicolas-de-Lara-CV-ES.pdf   ← PDF en español (generado)
Nicolas-de-Lara-CV-EN.pdf   ← PDF en inglés (generado)
cv.md, cv.es.md             ← CV en Markdown (generado)
resume.json                 ← JSON Resume (generado)
llms.txt, robots.txt, sitemap.xml   ← para buscadores y crawlers de IA (generado)
assets/js/cv-core.js        ← arma el HTML del CV (lo usan el navegador y el build)
assets/js/render.js         ← idioma, tema, animaciones
assets/js/icons.js          ← íconos SVG locales (Simple Icons CC0 + genéricos)
assets/css/styles.css       ← estilos de la web
assets/css/print.css        ← si alguien imprime la página con Ctrl+P
assets/css/pdf.css          ← diseño de los PDFs
assets/fonts/               ← Inter y JetBrains Mono (OFL); fonts/pdf/ = versiones estáticas para el PDF
scripts/build.mjs           ← prerender + Markdown + JSON-LD + llms.txt/robots/sitemap (sin dependencias)
scripts/pdf.mjs             ← PDFs con Chrome headless
.github/workflows/pages.yml ← build + PDFs + deploy en cada push
package.json                ← scripts npm y herramientas de desarrollo
favicon.svg, favicon.ico, apple-touch-icon.png
.nojekyll                   ← solo importa si Pages publica desde la rama
```
