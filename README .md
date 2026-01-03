# Restaurante "El Pollo Feliz" — Demo estático

Este es un pequeño proyecto estático (HTML/CSS/JS) que puedes ejecutar en Visual Studio / Visual Studio Code y publicar en GitHub Pages sin generar error 404.

Cómo usarlo localmente
1. Crea una carpeta (por ejemplo `pollo-restaurant`) y pega los archivos `index.html`, `styles.css` y `app.js` dentro.
2. Abre la carpeta en Visual Studio Code.
   - Opción recomendada: instala la extensión *Live Server* y clic derecho en `index.html` → "Open with Live Server". Esto abrirá la página en http://127.0.0.1:5500 (o similar).
   - Si usas Visual Studio (IDE) normal, puedes abrir `index.html` en el navegador (doble clic) o usar cualquier servidor local.
3. Interactúa con el menú, añade al carrito y prueba enviar un pedido (simulado).

Cómo publicar en GitHub Pages (sin 404)
- GitHub Pages sirve sitios estáticos. Para evitar 404:
  1. Crea un repositorio en GitHub y sube los archivos asegurándote de que `index.html` esté en la raíz del branch que publiques (ej. `main`) OR coloca los archivos dentro de una carpeta `docs/` y en la configuración de Pages selecciona la carpeta `docs`.
  2. En el repo: Settings → Pages → Source: selecciona `main` branch (o `main` / `docs` folder si usaste docs). Guarda.
  3. Espera unos segundos y visita `https://<tu-usuario>.github.io/<nombre-del-repo>/` (o `https://<tu-usuario>.github.io/` si tu repo se llama `<tu-usuario>.github.io`).
- Si obtienes 404: revisa que `index.html` esté en la carpeta que seleccionaste como fuente (root o docs), y que no haya configurado una ruta de SPA que requiera `404.html`.

Notas y extensiones
- Este proyecto es completamente estático; para pedidos reales necesitarás un backend o servicio (API) para procesar y almacenar pedidos.
- Puedes personalizar el menú editando la constante `MENU` en `app.js`.
- Para que no haya errores 404 en GitHub Pages, la URL debe apuntar al directorio que contiene `index.html`.

Si quieres, puedo:
- Preparar un repositorio listo para subir (`git init` + .gitignore + instrucción de commit).
- Incluir iconos/imágenes locales o un favicon.
- Añadir una versión en React/Vue si prefieres Single Page App (entonces explicaré cómo configurar Pages para rutas).