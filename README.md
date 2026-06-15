# Mundial 2026 — Informe por Grupos (web app)

App estática (PWA) para ver el informe de selecciones del Mundial 2026 desde el navegador,
filtrando por **grupo** y por **confederación**. Toda la información vive en `data.js`,
fácil de editar para ir completando equipos.

## Archivos
- `index.html` — estructura de la página.
- `styles.css` — estilos (tema oscuro, responsive).
- `app.js` — lógica de render y filtros (no hace falta tocarlo para agregar datos).
- `data.js` — **AQUÍ van los datos** de cada selección.
- `manifest.webmanifest`, `sw.js`, `icon.svg` — soporte PWA (instalable / offline).

## Cómo ver la app
- **Local:** abre `index.html` en el navegador (doble clic). Funciona sin servidor porque
  los datos están embebidos en `data.js` (no usa `fetch`).
- **GitHub Pages:** sube la carpeta a un repo y activa Pages (rama `main`, carpeta raíz).
  La URL queda como `https://<usuario>.github.io/<repo>/`.

## Cómo completar / agregar un equipo
1. Abre `data.js` y busca el equipo (los 48 ya están, ordenados por grupo).
2. Cambia `status: "pending"` por `status: "complete"`.
3. Rellena los campos. **Si no tienes un dato verificado, déjalo en `null`**:
   la app muestra automáticamente *"sin datos suficientes"* (la regla es no inventar números).

Ejemplo de equipo completo (ver Argentina/Argelia/Austria/Jordania en `data.js`):
```js
{
  name: "Brasil", flag: "🇧🇷", conf: "CONMEBOL", group: "C", status: "complete",
  prob: { w: 60, d: 22, l: 18 },        // % ESTIMADO (no oficial)
  gf: 2.1, ga: 0.6, sample: "20 oficiales (corner-stats)",
  record: { w: 13, d: 4, l: 3 },
  over25: { pct: 55, n: 18 }, btts: { pct: 45, n: 18 },
  corners: null, cards: null, possession: null, shots: null,  // null = sin datos
  form: ["G","E","G","G","P"],          // MÁS RECIENTE PRIMERO
  hot: "Texto del dato caliente.",
  highlight: "gf",                       // métrica a marcar con ⭐ (gf/ga/record/over25/btts...)
  notes: "Aclaraciones de muestra, etc."
}
```

### Notas de criterio
- `prob` (V/E/D) es **estimación** por forma y rival, **no** dato oficial — la app lo etiqueta así.
- `gf`/`ga` son **por partido**; `sample` describe sobre qué muestra se calcularon.
- `over25`/`btts` llevan su `n` (tamaño de muestra) para ser transparentes.
- Corners, tarjetas, posesión y remates de selecciones suelen no estar disponibles de forma
  verificable → quedan en `null` hasta conseguir una fuente fiable.

## Top picks y leyenda
- `meta.topPicks` (en `data.js`) define el ranking de "mejor forma" que se muestra arriba.
- `meta.legend`, `meta.sources` y `meta.consultDate` también se editan ahí.

## Actualizar datos en GitHub Pages
El service worker usa **network-first**: al volver a abrir con conexión, descarga la última
versión de `data.js`. Si cambiaste mucho y ves datos viejos, recarga forzado (Ctrl/Cmd+Shift+R).
