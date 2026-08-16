# Portafolio — Francisco Sarria

Sitio estático (HTML + CSS + JavaScript, sin dependencias ni build) con las secciones inicio,
sobre mí, experiencia, proyectos, habilidades y contacto. Trilingüe **PT / ES / EN** con
selector en la cabecera.

```
index.html
assets/
  css/style.css
  js/i18n.js        ← todos los textos de las tres versiones
  js/main.js        ← idioma, animaciones, contadores, menú móvil
  img/              ← foto, visuales de proyectos, favicon
  docs/             ← CV en PDF y versión ATS en .docx
```

## Ver el sitio en local

```bash
py -m http.server 8123
```

Y abrir http://localhost:8123

## Publicar en GitHub Pages

**1. Crea un repositorio vacío en GitHub** (sin README, sin .gitignore).

- Si lo llamas `TU-USUARIO.github.io`, el sitio quedará en `https://TU-USUARIO.github.io`
- Si le pones cualquier otro nombre (por ejemplo `portafolio`), quedará en
  `https://TU-USUARIO.github.io/portafolio/`

Las rutas del sitio son relativas, así que funciona igual en los dos casos.

**2. Conecta y sube** (desde la carpeta del proyecto):

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

**3. Activa Pages**: en el repositorio, `Settings` → `Pages` → en *Source* elige
**Deploy from a branch**, rama `main`, carpeta `/ (root)` → `Save`.

En uno o dos minutos el sitio está online. Cada `git push` posterior lo actualiza.

## Editar textos

Todos los textos están en `assets/js/i18n.js`, agrupados por idioma (`pt`, `es`, `en`) y con la
misma clave en los tres. Para cambiar una frase, edítala en los tres bloques y guarda.

## Pendiente

- Falta el enlace público del canal de YouTube **El Jardín de las Diosas**. Cuando lo tengas,
  añádelo en `index.html` dentro de la tarjeta del proyecto, copiando el bloque `card-links`
  que ya existe en las otras tarjetas.

## Créditos de imágenes

Los visuales de las tarjetas de proyecto se generaron con Magnific. La fotografía de perfil y
el CV son originales.
