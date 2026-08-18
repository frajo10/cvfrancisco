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

## Publicado

- Repositorio: https://github.com/frajo10/cvfrancisco
- Sitio: https://frajo10.github.io/cvfrancisco/

### Actualizar el sitio

Cualquier cambio se publica solo con hacer push a `main`:

```bash
git add -A
git commit -m "descripcion del cambio"
git push
```

GitHub Pages reconstruye el sitio en uno o dos minutos.

**Importante al editar textos o estilos:** sube el numero de version en las tres
referencias del `index.html` (`style.css?v=3`, `i18n.js?v=3`, `main.js?v=3` pasan a `v=4`).
Sin eso, quien ya haya visitado la web seguira viendo la version antigua en cache.

## Editar textos

Todos los textos están en `assets/js/i18n.js`, agrupados por idioma (`pt`, `es`, `en`) y con la
misma clave en los tres. Para cambiar una frase, edítala en los tres bloques y guarda.

## Créditos de imágenes

- `site-proclade.jpg` y `site-cmf.jpg` son capturas reales de los sitios en producción.
- `proj-tarot.jpg`, `proj-branding.jpg`, `proj-jardin.jpg` y `hero-bg.jpg` son mockups y
  visuales generados con Magnific.
- La fotografía de perfil y el CV son originales.
