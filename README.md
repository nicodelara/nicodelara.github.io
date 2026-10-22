# nicodelara.github.io

Mi CV online, en HTML + CSS + un poquito de JavaScript. **No hay build**: lo que está en el repo es lo que publica GitHub Pages.

## ¿Qué toco para actualizar el CV?

Solo **`cv-data.js`**. Ahí están todos los datos: perfil, experiencia, educación, skills, idiomas y contacto. La página (`index.html`) se arma sola a partir de ese archivo.

### Agregar una experiencia nueva

Abrí `cv-data.js`, buscá `experience: [` y pegá un bloque nuevo **arriba de todo** (el orden del archivo es el orden en que se muestra):

```js
  experience: [
    {
      role: "Staff Backend Engineer",
      company: "Empresa Nueva",
      period: "January 2027 - Present",
      description: "Qué hice en una o dos líneas.",
      highlights: [
        "Un logro",
        "Otro logro",
      ],
    },
    // ...las experiencias que ya estaban siguen acá abajo
```

Ojo con:
- La **coma** después de la `}` de cada bloque.
- Los textos van entre comillas dobles. Si necesitás comillas adentro, escribilas así: `\"`.
- Si no tenés bullets, dejá `highlights: []`.

Lo mismo con el resto: `education` (degree / institution / period), `skills` y `languages` (listas de textos) y `contact` (label / url / icon: `"email"`, `"linkedin"` o `"github"`).

La foto está en `assets/images/profile.png`. Para cambiarla, reemplazá el archivo (o cambiá la ruta `image` en `cv-data.js`). Usá rutas relativas (sin `/` adelante).

## Verlo en tu compu antes de subir

- Lo más rápido: abrí `index.html` con doble clic en el navegador. Funciona directo desde el disco.
- O levantá un servidorcito en la carpeta del repo y entrá a http://localhost:8000:

  ```bash
  python3 -m http.server 8000
  ```

## Publicar

```bash
git add .
git commit -m "Actualizo CV"
git push
```

En uno o dos minutos se ve en https://nicodelara.github.io.

## Estructura

```
index.html            ← esqueleto de la página (título y descripción para buscadores)
cv-data.js            ← TUS DATOS (lo único que hace falta editar)
assets/css/styles.css ← estilos
assets/js/render.js   ← arma el HTML a partir de cv-data.js
assets/images/        ← foto
assets/fonts/         ← fuente Inter (incluida, no depende de Google Fonts)
favicon.ico
.nojekyll             ← le dice a GitHub Pages que sirva los archivos tal cual, sin Jekyll
```

> Nota: el título de la pestaña y la descripción para Google están en el `<head>` de `index.html`; si cambiás tu título profesional, actualizalo ahí también.
