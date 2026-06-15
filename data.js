/* ============================================================================
   MUNDIAL 2026 — Base de datos de equipos
   ----------------------------------------------------------------------------
   CÓMO AGREGAR / COMPLETAR UN EQUIPO:
   - Busca el equipo en la lista de abajo (ya están los 48, ordenados por grupo).
   - Cambia "status" de "pending" a "complete".
   - Rellena los campos. Si NO tienes un dato verificado, DÉJALO EN null:
     la app mostrará automáticamente "sin datos suficientes" (no inventes números).

   ESQUEMA DE CADA EQUIPO:
   {
     name, flag, conf, group,        // identidad
     status: "complete" | "pending",
     prob: { w, d, l },              // % ESTIMADO victoria/empate/derrota (suman ~100)
     gf, ga,                         // goles a favor / en contra POR PARTIDO
     sample: "20 oficiales",         // texto: sobre qué muestra se calcularon gf/ga
     record: { w, d, l },            // récord en esa muestra
     over25: { pct, n },             // % Over 2.5 y tamaño de muestra n
     btts:   { pct, n },             // % ambos marcan (BTTS) y muestra n
     corners, cards, possession, shots,   // null = sin datos suficientes
     form: ["G","G","E","P","G"],    // últimos 5, MÁS RECIENTE PRIMERO (G/E/P)
     hot: "texto del dato caliente",
     highlight: "ga",               // clave de la métrica más fuerte (se marca con ⭐)
     notes: "aclaraciones / muestra parcial / etc."
   }

   Fuentes y fecha de consulta están en META (al final del archivo).
   ============================================================================ */

window.MUNDIAL_DATA = {

  meta: {
    title: "Mundial 2026 — Informe por Grupos",
    subtitle: "Promedios sobre partidos oficiales recientes · estimaciones por forma y rivales",
    consultDate: "2026-06-12",
    disclaimer: "Para entretenimiento entre amigos. NO es asesoramiento de apuestas. " +
                "Las probabilidades V/E/D son ESTIMACIÓN propia por forma y nivel de rival, no datos oficiales.",
    legend: [
      { color: "green",  label: "Favorable / a favor / victoria probable" },
      { color: "yellow", label: "Neutro / parejo / empate" },
      { color: "red",    label: "En contra / derrota probable / dato flojo" }
    ],
    sources: [
      { label: "corner-stats.com (récord y goles, últimos 20 oficiales)", url: "https://corner-stats.com/" },
      { label: "Wikipedia — selecciones y sorteo Mundial 2026", url: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_draw" },
      { label: "FIFA / Al Jazeera / Opta Analyst (perfiles y forma)", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026" }
    ],
    // Datos que, por ahora, no se pudieron verificar para selecciones (fuentes bloqueadas):
    missingNote: "Corners, tarjetas, posesión y remates de selecciones: sin datos suficientes " +
                 "(portales que los agregan bloquearon el acceso automatizado). No se inventaron."
  },

  // Orden de grupos para las pestañas
  groups: ["A","B","C","D","E","F","G","H","I","J","K","L"],

  // ---- TOP PICKS (solo equipos con datos completos) -------------------------
  topPicks: [
    { name: "Marruecos",  note: "Invicto en 29 (0 derrotas en estos 20: 13-7-0) y solo 0,35 goles recibidos/pp. Campeón AFCON 2026." },
    { name: "España",     note: "Invicta también (13-7-0), 3,5 goles totales/pp y 88% Over 2.5 (n=8). Campeona de Europa." },
    { name: "Inglaterra", note: "16-1-3 con solo 0,40 goles recibidos/pp: la mejor defensa de todo el torneo." },
    { name: "Alemania",   note: "14-3-3 con 3,75 goles totales/partido: el ataque más demoledor (7-1 a Curazao)." },
    { name: "Francia",    note: "14-2-4 con 3,35 goles totales/pp: subcampeona del mundo y candidata." },
    { name: "Noruega",    note: "Haaland metió 37 goles del equipo en 8 partidos de clasificación (¡4,6/pp!)." },
    { name: "Japón",      note: "Ganó sus últimos 5 (1-0 a Inglaterra y a Escocia) y recibe solo 0,55 goles/pp." },
    { name: "Argentina",  note: "0,45 goles recibidos/partido en 20: una de las mejores defensas del lote." }
  ],

  // ---- EQUIPOS --------------------------------------------------------------
  teams: [
    // ===================== GRUPO J (COMPLETO) =============================
    {
      name: "Argentina", flag: "🇦🇷", conf: "CONMEBOL", group: "J", status: "complete",
      prob: { w: 70, d: 18, l: 12 },
      gf: 2.20, ga: 0.45, sample: "20 oficiales (corner-stats)",
      record: { w: 14, d: 3, l: 3 },
      over25: { pct: 43, n: 14 }, btts: { pct: 29, n: 14 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","G","G","P"],
      hot: "Solo 9 goles recibidos en 20 oficiales (0,45/partido) y 14 victorias. Goleó 4-1 a Brasil y 6-0 a Puerto Rico.",
      highlight: "ga",
      notes: "Campeón vigente. Récord y goles sobre los últimos 20 partidos oficiales."
    },
    {
      name: "Argelia", flag: "🇩🇿", conf: "CAF", group: "J", status: "complete",
      prob: { w: 48, d: 27, l: 25 },
      gf: 2.15, ga: 0.40, sample: "20 oficiales (corner-stats)",
      record: { w: 14, d: 5, l: 1 },
      over25: { pct: 60, n: 10 }, btts: { pct: 40, n: 10 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["E","G","P","G","G"],
      hot: "Una sola derrota en sus últimos 20 oficiales (0-2 vs Nigeria en cuartos de la AFCON). Amoura: 10 goles en clasificación.",
      highlight: "record",
      notes: "Forma incluye AFCON 2025/26 y amistosos de marzo."
    },
    {
      name: "Austria", flag: "🇦🇹", conf: "UEFA", group: "J", status: "complete",
      prob: { w: 45, d: 25, l: 30 },
      gf: 2.75, ga: 0.50, sample: "8 oficiales (clasificación UEFA)",
      record: { w: 6, d: 1, l: 1 },
      over25: { pct: 33, n: 9 }, btts: { pct: 22, n: 9 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","G","E","G"],
      hot: "Abrió la clasificatoria con 5 victorias al hilo (incl. 10-0 a San Marino) y ganó 4 de sus últimos 5 con la valla casi imbatida.",
      highlight: "form",
      notes: "Muestra parcial (n=8): no se obtuvo la serie de 20. El 10-0 a San Marino infla el promedio de goles."
    },
    {
      name: "Jordania", flag: "🇯🇴", conf: "AFC", group: "J", status: "complete",
      prob: { w: 25, d: 30, l: 45 },
      gf: 1.40, ga: 1.30, sample: "20 oficiales (corner-stats)",
      record: { w: 7, d: 6, l: 7 },
      over25: { pct: 58, n: 12 }, btts: { pct: 42, n: 12 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["P","G","G","G","G"],
      hot: "Primer Mundial de su historia. Récord de 32 goles en una clasificatoria y finalista de la Copa Árabe 2025.",
      highlight: "over25",
      notes: "Debutante. La derrota reciente fue la final de la Copa Árabe vs Marruecos en la prórroga."
    },

    // ===================== RESTO (PENDIENTES) =============================
    // Grupo A
    {
      name: "México", flag: "🇲🇽", conf: "CONCACAF", group: "A", status: "complete",
      prob: { w: 55, d: 27, l: 18 },
      gf: 1.40, ga: 0.60, sample: "20 oficiales (corner-stats)",
      record: { w: 11, d: 7, l: 2 },
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: null,
      hot: "Invicto en sus últimos 8 partidos. Campeón de la Copa Oro 2025 (2-1 a EE.UU.) y goleó 5-1 a Serbia en la previa. Abrió el Mundial ganando 2-0 a Sudáfrica.",
      highlight: "ga",
      notes: "Anfitrión. Récord y goles sobre 20 oficiales. Promedio total 2,0 goles/partido tiende a UNDER. Over 2.5 / BTTS: sin muestra de marcadores suficiente para % fiable. Secuencia exacta de últimos 5: no detallada (invicto en 8)."
    },
    {
      name: "Sudáfrica", flag: "🇿🇦", conf: "CAF", group: "A", status: "complete",
      prob: { w: 35, d: 30, l: 35 },
      gf: 1.35, ga: 0.90, sample: "20 oficiales (corner-stats)",
      record: { w: 8, d: 8, l: 4 },
      over25: { pct: 67, n: 9 }, btts: { pct: 44, n: 9 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["P","G","P","G","P"],
      hot: "Sus partidos tienden a tener goles: 67% Over 2.5 (n=9). Ganó el Grupo C de clasificación por delante de Nigeria.",
      highlight: "over25",
      notes: "Cayó 0-2 con México en el debut. Forma incluye AFCON 2025/26 (eliminada por Camerún en octavos)."
    },
    {
      name: "Corea del Sur", flag: "🇰🇷", conf: "AFC", group: "A", status: "complete",
      prob: { w: 40, d: 28, l: 32 },
      gf: 1.77, ga: 1.00, sample: "13 oficiales recientes (cálculo propio)",
      record: { w: 9, d: 1, l: 3 },
      over25: { pct: 46, n: 13 }, btts: { pct: 15, n: 13 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","G","P","P"],
      hot: "Irregular atrás: metió 5 a Trinidad pero encajó 0-5 con Brasil y 0-4 con Costa de Marfil. Ganó su debut mundialista 2-1 a Chequia.",
      highlight: "record",
      notes: "Muestra de 13 (mayoría amistosos + 2 clasificatorios + debut Mundial). corner-stats no accesible para Corea."
    },
    {
      name: "Chequia", flag: "🇨🇿", conf: "UEFA", group: "A", status: "complete",
      prob: { w: 38, d: 30, l: 32 },
      gf: 1.85, ga: 1.10, sample: "20 oficiales (corner-stats)",
      record: { w: 11, d: 6, l: 3 },
      over25: { pct: 67, n: 9 }, btts: { pct: 56, n: 9 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["P","E","E","G","P"],
      hot: "Volvió al Mundial tras 20 años vía dos tandas de penales (2-2 con Irlanda y Dinamarca). Schick: 25 goles en 52 partidos.",
      highlight: "over25",
      notes: "Perdió su debut 1-2 con Corea. Los 2-2 de repechaje se cuentan como E (ganó por penales)."
    },
    // Grupo B
    {
      name: "Canadá", flag: "🇨🇦", conf: "CONCACAF", group: "B", status: "complete",
      prob: { w: 48, d: 30, l: 22 },
      gf: 1.55, ga: 0.55, sample: "20 oficiales (corner-stats)",
      record: { w: 10, d: 8, l: 2 },
      over25: { pct: 38, n: 8 }, btts: { pct: 63, n: 8 },
      corners: null, cards: null, possession: null, shots: null,
      form: null,
      hot: "Solo 11 goles encajados en 20 partidos (0,55/pp) y una sola derrota en sus últimos 16.",
      highlight: "ga",
      notes: "Anfitrión. Resultados recientes: Irlanda 1-1, Uzbekistán 2-0; muchos empates. Secuencia exacta de últimos 5: sin datos suficientes."
    },
    {
      name: "Suiza", flag: "🇨🇭", conf: "UEFA", group: "B", status: "complete",
      prob: { w: 52, d: 26, l: 22 },
      gf: 2.00, ga: 1.30, sample: "20 oficiales (corner-stats)",
      record: { w: 8, d: 7, l: 5 },
      over25: { pct: 50, n: 10 }, btts: { pct: 40, n: 10 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["E","G","E","P","E"],
      hot: "Invicta en la clasificación: ganó el grupo con 4V-2E y 14-2 en goles. Pero sus partidos promedian 3,3 goles totales (cedió un 3-4 con Alemania).",
      highlight: "gf",
      notes: "Favorita del Grupo B. Los últimos 5 son amistosos 2026 (más flojos que su clasificación perfecta)."
    },
    {
      name: "Catar", flag: "🇶🇦", conf: "AFC", group: "B", status: "complete",
      prob: { w: 22, d: 28, l: 50 },
      gf: 0.75, ga: 1.63, sample: "8 oficiales recientes (cálculo propio)",
      record: { w: 1, d: 3, l: 4 },
      over25: { pct: 38, n: 8 }, btts: { pct: 38, n: 8 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["P","E","P","G","E"],
      hot: "Bicampeón de Asia (2019 y 2023) pero llega frío: 1 victoria en sus últimos 8 oficiales y 0,75 goles por partido.",
      highlight: null,
      notes: "corner-stats no accesible; muestra de 8 oficiales (excluye el amistoso no oficial vs Zimbabue). Primera clasificación mundialista por mérito propio."
    },
    {
      name: "Bosnia y Herzegovina", flag: "🇧🇦", conf: "UEFA", group: "B", status: "complete",
      prob: { w: 30, d: 33, l: 37 },
      gf: 1.45, ga: 1.50, sample: "20 oficiales (corner-stats)",
      record: { w: 6, d: 8, l: 6 },
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: ["E","E","E","E","E"],
      hot: "Racha de empates: no ganó ninguno de sus últimos 5 (5 empates). Clasificó por penales ante Gales e Italia. Džeko: 73 goles, máximo histórico.",
      highlight: null,
      notes: "corner-stats: 6-8-6 en 20 (equilibrado, GA 1,5). Over/BTTS: la muestra reciente son 5 empates de pocos goles, no representativa → sin datos suficientes."
    },
    // Grupo C
    {
      name: "Brasil", flag: "🇧🇷", conf: "CONMEBOL", group: "C", status: "complete",
      prob: { w: 60, d: 22, l: 18 },
      gf: 1.90, ga: 1.00, sample: "20 oficiales (corner-stats)",
      record: { w: 11, d: 4, l: 5 },
      over25: { pct: 67, n: 9 }, btts: { pct: 67, n: 9 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","G","P","E"],
      hot: "Goleó 6-2 a Panamá y 5-0 a Corea (Endrick decisivo), pero cayó 1-0 con Bolivia en la altura. 67% Over 2.5 y 67% BTTS (n=9).",
      highlight: "over25",
      notes: "Bajo Ancelotti. Forma: Egipto 2-1 (G), Panamá 6-2 (G), Croacia 3-1 (G), Francia 1-2 (P), Túnez 1-1 (E)."
    },
    {
      name: "Marruecos", flag: "🇲🇦", conf: "CAF", group: "C", status: "complete",
      prob: { w: 52, d: 28, l: 20 },
      gf: 1.85, ga: 0.35, sample: "20 oficiales (corner-stats)",
      record: { w: 13, d: 7, l: 0 },
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: null,
      hot: "Invicto en sus últimos 29 partidos (0 derrotas en estos 20) y solo 0,35 goles recibidos por partido. Campeón de la AFCON 2026 y de la Copa Árabe 2025.",
      highlight: "record",
      notes: "Muralla defensiva (7 vallas a 0 en la clasificación). Over/BTTS: sin muestra de marcadores suficiente para % fiable (concede tan poco que el BTTS sería muy bajo). Título AFCON otorgado tras el forfeit de Senegal en la final."
    },
    {
      name: "Haití", flag: "🇭🇹", conf: "CONCACAF", group: "C", status: "complete",
      prob: { w: 20, d: 27, l: 53 },
      gf: 2.40, ga: 1.20, sample: "15 oficiales recientes (cálculo propio)",
      record: { w: 8, d: 3, l: 4 },
      over25: { pct: 67, n: 15 }, btts: { pct: 33, n: 15 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","P","G","E"],
      hot: "Vuelve al Mundial tras 51 años (primera vez desde 1974). Ganó el Grupo C de la 3ª ronda CONCACAF y cortó una racha de 15 invicto a Costa Rica.",
      highlight: "over25",
      notes: "corner-stats no accesible; muestra de 15 que incluye rivales débiles de Nations League B (8-0 a Sint Maarten, 5-0 a Aruba) que inflan el promedio goleador."
    },
    {
      name: "Escocia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", conf: "UEFA", group: "C", status: "complete",
      prob: { w: 33, d: 27, l: 40 },
      gf: 1.70, ga: 1.20, sample: "20 oficiales (corner-stats)",
      record: { w: 10, d: 2, l: 8 },
      over25: { pct: 60, n: 10 }, btts: { pct: 50, n: 10 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","P","P","G"],
      hot: "Partidos de ida y vuelta: 4-2 a Dinamarca, 3-2 perdido con Grecia. 60% Over 2.5 (n=10). Volvió al Mundial tras 28 años.",
      highlight: "over25",
      notes: "Forma (orden aprox. de amistosos 2026): Bolivia 4-0 (G), Curazao 4-1 (G), Costa de Marfil 0-1 (P), Japón 0-1 (P), Dinamarca 4-2 (G)."
    },
    // Grupo D
    {
      name: "Estados Unidos", flag: "🇺🇸", conf: "CONCACAF", group: "D", status: "complete",
      prob: { w: 45, d: 27, l: 28 },
      gf: 1.65, ga: 1.60, sample: "20 oficiales (corner-stats)",
      record: { w: 9, d: 2, l: 9 },
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","P","P","G","G"],
      hot: "Sus partidos vuelan: promedio 3,25 goles totales en 20 (encaja 1,6/pp). Cerró 2025 goleando 5-1 a Uruguay, pero en 2026 cayó 2-5 con Bélgica y 0-2 con Portugal.",
      highlight: null,
      notes: "Anfitrión. Defensa frágil (record 9-2-9, exactamente 50%). Over/BTTS: pocas planillas para % fiable, pero el promedio 3,25 goles/partido apunta a OVER. Forma: 5º partido (cierre de 2025) de orden aprox."
    },
    {
      name: "Paraguay", flag: "🇵🇾", conf: "CONMEBOL", group: "D", status: "complete",
      prob: { w: 38, d: 32, l: 30 },
      gf: 1.25, ga: 0.90, sample: "20 oficiales (corner-stats)",
      record: { w: 9, d: 6, l: 5 },
      over25: { pct: 50, n: 6 }, btts: { pct: 50, n: 6 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","P","P","E"],
      hot: "Sólida y defensiva (solo 1,25 goles a favor/pp en 20): en la clasificación le ganó a Brasil y a Argentina. Ser fuerte de local fue clave.",
      highlight: "ga",
      notes: "Bajo Gustavo Alfaro. La muestra Over/BTTS (n=6) son amistosos recientes; el promedio de 20 (2,15 goles totales) tiende a UNDER."
    },
    {
      name: "Australia", flag: "🇦🇺", conf: "AFC", group: "D", status: "complete",
      prob: { w: 35, d: 30, l: 35 },
      gf: 1.45, ga: 0.85, sample: "20 oficiales (corner-stats)",
      record: { w: 10, d: 5, l: 5 },
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","P","P","P"],
      hot: "Clasificó con un 2-1 agónico a Arabia Saudita. Cerró 2025 con 3 derrotas seguidas (USMNT, Venezuela, Colombia) pero reaccionó ganando sus 2 amistosos de marzo (incl. 5-1 a Curazao).",
      highlight: "ga",
      notes: "Bajo Tony Popovic. Over/BTTS: sin muestra de marcadores suficiente para % fiable."
    },
    {
      name: "Turquía", flag: "🇹🇷", conf: "UEFA", group: "D", status: "complete",
      prob: { w: 48, d: 26, l: 26 },
      gf: 2.10, ga: 1.10, sample: "20 oficiales (corner-stats)",
      record: { w: 14, d: 3, l: 3 },
      over25: { pct: 60, n: 5 }, btts: { pct: 60, n: 5 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","E","G","G"],
      hot: "Goleadora: 6-1 a Bulgaria, 4-1 a Georgia y 2-2 con España; promedio 3,2 goles totales en 20. Volvió al Mundial tras 24 años (1-0 a Rumania y a Kosovo en el repechaje).",
      highlight: "gf",
      notes: "Bajo Montella. 14-3-3 en 20. Muestra Over/BTTS pequeña (n=5); forma abarca clasificación + repechaje, orden aprox."
    },
    // Grupo E
    {
      name: "Alemania", flag: "🇩🇪", conf: "UEFA", group: "E", status: "complete",
      prob: { w: 62, d: 22, l: 16 },
      gf: 2.70, ga: 1.05, sample: "20 oficiales (corner-stats)",
      record: { w: 14, d: 3, l: 3 },
      over25: { pct: 75, n: 12 }, btts: { pct: 58, n: 12 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","G","G","G"],
      hot: "Máquina ofensiva: 3,75 goles totales por partido en 20. Goleó 7-1 a Curazao en el debut, 6-0 a Eslovaquia y 4-3 a Suiza. 75% Over 2.5 (n=12).",
      highlight: "gf",
      notes: "Bajo Nagelsmann. Cerró la clasificación con 5 victorias seguidas. Favorita del Grupo E."
    },
    {
      name: "Curazao", flag: "🇨🇼", conf: "CONCACAF", group: "E", status: "complete",
      prob: { w: 12, d: 20, l: 68 },
      gf: 2.30, ga: 1.35, sample: "20 oficiales (corner-stats)",
      record: { w: 10, d: 5, l: 5 },
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: ["P","P","P","P","P"],
      hot: "La nación más pequeña en llegar a un Mundial (~150 mil hab.). Invicta en sus 10 partidos de clasificación, pero llega goleada: 0 victorias en sus últimos 5 y un 1-7 con Alemania en el debut.",
      highlight: null,
      notes: "Dirigida por Dick Advocaat. corner-stats mezcla la clasificación (goleadas a rivales menores, 7-0 a Bermudas) con palizas recientes en contra; Over/BTTS muy volátil → sin datos representativos."
    },
    {
      name: "Costa de Marfil", flag: "🇨🇮", conf: "CAF", group: "E", status: "complete",
      prob: { w: 45, d: 28, l: 27 },
      gf: 1.85, ga: 0.45, sample: "20 oficiales (corner-stats)",
      record: { w: 14, d: 3, l: 3 },
      over25: { pct: 56, n: 9 }, btts: { pct: 44, n: 9 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","G","G","P"],
      hot: "Defensa de hierro: solo 0,45 goles recibidos/pp y 14 victorias en 20. Ganó 4-0 a Corea y 2-1 a Francia; abrió el Mundial 1-0 a Ecuador.",
      highlight: "ga",
      notes: "Campeona de África 2023. La P de la forma es la eliminación en cuartos de la AFCON 2025 (3-2 vs Egipto)."
    },
    {
      name: "Ecuador", flag: "🇪🇨", conf: "CONMEBOL", group: "E", status: "complete",
      prob: { w: 42, d: 35, l: 23 },
      gf: 1.00, ga: 0.35, sample: "20 oficiales (corner-stats)",
      record: { w: 8, d: 11, l: 1 },
      over25: { pct: 14, n: 7 }, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: ["P","G","E","E","E"],
      hot: "Muro defensivo: solo 0,35 goles recibidos/pp y 5 goles en 18 partidos de clasificación. Estuvo 19 partidos invicto hasta caer 1-0 con Costa de Marfil en el debut.",
      highlight: "ga",
      notes: "Bajo Beccacece. 11 empates en 20 (muchos 0-0). BTTS bajísimo (0 de 7 en la muestra: casi nunca le marcan cuando ella marca) → sin dato para no confundir."
    },
    // Grupo F
    {
      name: "Países Bajos", flag: "🇳🇱", conf: "UEFA", group: "F", status: "complete",
      prob: { w: 55, d: 27, l: 18 },
      gf: 2.30, ga: 0.95, sample: "20 oficiales (corner-stats)",
      record: { w: 9, d: 9, l: 2 },
      over25: { pct: 70, n: 10 }, btts: { pct: 50, n: 10 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","E","G","E","G"],
      hot: "Ataque potente: 2,3 goles/pp y 70% Over 2.5 (n=10). Goleó 8-0 a Malta y 4-0 a Finlandia; solo 2 derrotas en 20.",
      highlight: "gf",
      notes: "Bajo Koeman. Muchos empates (9 en 20). Forma = racha de clasificación (ganó su grupo); amistosos de marzo 2026 no detallados."
    },
    {
      name: "Japón", flag: "🇯🇵", conf: "AFC", group: "F", status: "complete",
      prob: { w: 48, d: 28, l: 24 },
      gf: 2.25, ga: 0.55, sample: "20 oficiales (corner-stats)",
      record: { w: 13, d: 5, l: 2 },
      over25: { pct: 38, n: 13 }, btts: { pct: 23, n: 13 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","G","G","G"],
      hot: "Ganó sus últimos 5 (incl. 1-0 a Inglaterra y 1-0 a Escocia en 2026). Le ganó 3-2 a Brasil en 2025 y recibe solo 0,55 goles/pp.",
      highlight: "ga",
      notes: "Bajo Moriyasu. 13-5-2 en 20. Tiende a ganar por la mínima (varios 1-0)."
    },
    {
      name: "Túnez", flag: "🇹🇳", conf: "CAF", group: "F", status: "complete",
      prob: { w: 30, d: 30, l: 40 },
      gf: 1.50, ga: 1.20, sample: "20 oficiales (corner-stats)",
      record: { w: 8, d: 6, l: 6 },
      over25: { pct: 67, n: 9 }, btts: { pct: 67, n: 9 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["P","E","E","P","G"],
      hot: "Sus partidos tienen goles: 67% Over 2.5 y 67% BTTS (n=9). 7ª Copa del Mundo pero nunca pasó de fase de grupos; llega golpeada (1-5 con Suecia en el debut).",
      highlight: "over25",
      notes: "Eliminada en octavos de la AFCON 2025 (por penales con Mali). Forma cubre AFCON + debut Mundial."
    },
    {
      name: "Suecia", flag: "🇸🇪", conf: "UEFA", group: "F", status: "complete",
      prob: { w: 40, d: 26, l: 34 },
      gf: 2.15, ga: 1.45, sample: "20 oficiales (corner-stats)",
      record: { w: 10, d: 4, l: 6 },
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","G","P","P"],
      hot: "Resurrección vía repechaje: terminó ÚLTIMA en su grupo de clasificación, pero Gyökeres la metió al Mundial (hat-trick a Ucrania y gol al 88' a Polonia). Debutó goleando 5-1 a Túnez.",
      highlight: "gf",
      notes: "Bajo Graham Potter. Promedio 3,6 goles totales/pp en 20 (defensa floja, GA 1,45) → tiende a OVER, pero sin muestra de marcadores suficiente para % fiable."
    },
    // Grupo G
    {
      name: "Bélgica", flag: "🇧🇪", conf: "UEFA", group: "G", status: "complete",
      prob: { w: 58, d: 24, l: 18 },
      gf: 2.60, ga: 1.10, sample: "20 oficiales (corner-stats)",
      record: { w: 10, d: 5, l: 5 },
      over25: { pct: 71, n: 7 }, btts: { pct: 43, n: 7 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","E","E","G"],
      hot: "Ataque demoledor: 3,7 goles totales/pp en 20. Goleó 7-0 y 6-0 a Liechtenstein/Kazajistán y 5-2 a EE.UU. 71% Over 2.5 (n=7), aunque pierde 5 de 20 (defensa irregular).",
      highlight: "gf",
      notes: "Favorita del Grupo G. Forma abarca clasificación + amistoso de marzo; amistosos de junio 2026 no detallados."
    },
    {
      name: "Egipto", flag: "🇪🇬", conf: "CAF", group: "G", status: "complete",
      prob: { w: 45, d: 30, l: 25 },
      gf: 1.25, ga: 0.80, sample: "20 oficiales (corner-stats)",
      record: { w: 9, d: 7, l: 4 },
      over25: { pct: 57, n: 7 }, btts: { pct: 57, n: 7 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["P","G","G","E","P"],
      hot: "Ganó su grupo de clasificación invicto (Salah al frente) y llegó a semis de la AFCON 2025. Defensa sólida: 0,8 goles recibidos/pp.",
      highlight: "ga",
      notes: "Desde la AFCON: 2V-2D-1E; incl. 1-2 con Brasil en junio. Eliminada en semis por Senegal (0-1)."
    },
    {
      name: "Irán", flag: "🇮🇷", conf: "AFC", group: "G", status: "complete",
      prob: { w: 42, d: 30, l: 28 },
      gf: 1.80, ga: 0.75, sample: "20 oficiales (corner-stats)",
      record: { w: 12, d: 5, l: 3 },
      over25: { pct: 50, n: 6 }, btts: { pct: 33, n: 6 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","P","G","E","E"],
      hot: "3ª selección del mundo en sellar el pasaje; invicta casi toda la fase asiática (11-4-1 en 16). Taremi: 10 goles. Defensa firme: 0,75 goles recibidos/pp.",
      highlight: "ga",
      notes: "Bajo Amir Ghalenoei. Dato curioso: empató 0-0 con Cabo Verde en un amistoso reciente."
    },
    {
      name: "Nueva Zelanda", flag: "🇳🇿", conf: "OFC", group: "G", status: "complete",
      prob: { w: 15, d: 22, l: 63 },
      gf: 2.60, ga: 1.10, sample: "15 oficiales recientes (cálculo propio)",
      record: { w: 7, d: 1, l: 7 },
      over25: { pct: 60, n: 15 }, btts: { pct: 40, n: 15 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","P","P","P","E"],
      hot: "Goleó a las islas del Pacífico (8-0 Samoa, 8-1 Vanuatu, 7-0 Fiyi) camino a su 3er Mundial, pero perdió ante casi todo rival de peso (Australia x2, Ucrania, Polonia, Ecuador).",
      highlight: null,
      notes: "corner-stats no tiene su selección; muestra de 15 muy bipolar: los promedios goleadores están inflados por rivales de Oceanía. Solo 1 victoria en sus últimos 5."
    },
    // Grupo H
    {
      name: "España", flag: "🇪🇸", conf: "UEFA", group: "H", status: "complete",
      prob: { w: 65, d: 22, l: 13 },
      gf: 2.60, ga: 0.90, sample: "20 oficiales (corner-stats)",
      record: { w: 13, d: 7, l: 0 },
      over25: { pct: 88, n: 8 }, btts: { pct: 50, n: 8 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","E","G","G","G"],
      hot: "Invicta en estos 20 (13-7-0) y máquina ofensiva: 3,5 goles totales/pp y 88% Over 2.5 (n=8). Campeona de Europa 2024; goleó 6-0 a Turquía.",
      highlight: "record",
      notes: "Gran favorita del Grupo H y candidata al título. Bajo Luis de la Fuente."
    },
    {
      name: "Cabo Verde", flag: "🇨🇻", conf: "CAF", group: "H", status: "complete",
      prob: { w: 22, d: 30, l: 48 },
      gf: 0.90, ga: 0.95, sample: "20 oficiales (corner-stats)",
      record: { w: 6, d: 8, l: 6 },
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: null,
      hot: "Primer Mundial de su historia y 2ª nación más pequeña en lograrlo. Terminó por delante de Camerún en la clasificación, con 7 vallas a 0 en 10 partidos.",
      highlight: null,
      notes: "Los 'Tiburones Azules' dependen de una defensa muy ordenada (bajo poco gol, 0,9 GF/pp). Ganó 2 de sus últimos 5 (clave: 3-0 a Esuatini y 1-0 a Camerún). Over/BTTS: sin marcadores suficientes."
    },
    {
      name: "Arabia Saudita", flag: "🇸🇦", conf: "AFC", group: "H", status: "complete",
      prob: { w: 25, d: 30, l: 45 },
      gf: 1.00, ga: 1.15, sample: "20 oficiales (corner-stats)",
      record: { w: 7, d: 5, l: 8 },
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: null,
      hot: "Llega en horas bajas: balance negativo en sus últimos 20 (7-5-8) y solo 1 gol marcado por partido. Clasificó sufriendo, vía 4ª ronda asiática.",
      highlight: null,
      notes: "Bajo Hervé Renard (2ª etapa). Secuencia de últimos 5 y Over/BTTS: sin datos suficientes para % fiable."
    },
    {
      name: "Uruguay", flag: "🇺🇾", conf: "CONMEBOL", group: "H", status: "complete",
      prob: { w: 42, d: 35, l: 23 },
      gf: 0.85, ga: 0.85, sample: "20 oficiales (corner-stats)",
      record: { w: 5, d: 11, l: 4 },
      over25: { pct: 20, n: 5 }, btts: { pct: 40, n: 5 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["E","P","G","E","G"],
      hot: "Bajo Bielsa, trabada y defensiva: 11 empates en 20 y solo 1,7 goles totales/pp. Le ganó de visita a Argentina en la clasificación, pero fue goleada 5-1 por EE.UU.",
      highlight: "ga",
      notes: "Plantel de jerarquía (Núñez, Araújo, Valverde) pero muy bajo gol últimamente (0,85 GF/pp). Muestra Over/BTTS pequeña (n=5); el promedio de 20 confirma tendencia UNDER."
    },
    // Grupo I
    {
      name: "Francia", flag: "🇫🇷", conf: "UEFA", group: "I", status: "complete",
      prob: { w: 64, d: 20, l: 16 },
      gf: 2.25, ga: 1.10, sample: "20 oficiales (corner-stats)",
      record: { w: 14, d: 2, l: 4 },
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","E","G","G","G"],
      hot: "Subcampeona del mundo y candidata al título. 14-2-4 en 20 con 2,25 goles a favor/pp y promedio de 3,35 goles totales. Mbappé al frente.",
      highlight: "gf",
      notes: "Bajo Deschamps. Gran favorita del Grupo I. Forma incl. 0-0 con Costa de Marfil. Over/BTTS: sin muestra de marcadores suficiente (el promedio 3,35 apunta a OVER)."
    },
    {
      name: "Senegal", flag: "🇸🇳", conf: "CAF", group: "I", status: "complete",
      prob: { w: 45, d: 28, l: 27 },
      gf: 1.73, ga: 0.82, sample: "11 oficiales recientes (cálculo propio)",
      record: { w: 7, d: 2, l: 2 },
      over25: { pct: 55, n: 11 }, btts: { pct: 36, n: 11 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["E","P","G","G","G"],
      hot: "Subcampeón de la AFCON 2026 (perdió la final con Marruecos, otorgada por el forfeit). Defensa fuerte: 0,82 goles recibidos/pp. De las africanas más temibles.",
      highlight: "ga",
      notes: "Bajo Pape Thiaw. corner-stats solo tiene la selección femenina; muestra de 11 (AFCON + amistosos)."
    },
    {
      name: "Noruega", flag: "🇳🇴", conf: "UEFA", group: "I", status: "complete",
      prob: { w: 48, d: 26, l: 26 },
      gf: 4.60, ga: 0.60, sample: "8 de clasificación (cálculo propio)",
      record: { w: 8, d: 0, l: 0 },
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: ["E","E","P","G","G"],
      hot: "Volvió al Mundial tras 28 años con Haaland imparable: 16 goles personales y 37 del equipo en solo 8 partidos de clasificación (¡4,6 por partido!). Goleó 4-1 a Italia para sellarlo.",
      highlight: "gf",
      notes: "corner-stats solo tiene la femenina. Promedios = clasificación perfecta (8-0-0); los amistosos 2026 fueron más flojos (perdió con Países Bajos, empató con Suiza y Marruecos). Over/BTTS: sin muestra suficiente."
    },
    {
      name: "Irak", flag: "🇮🇶", conf: "AFC", group: "I", status: "complete",
      prob: { w: 18, d: 26, l: 56 },
      gf: null, ga: null, sample: null,
      record: null,
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","E","G"],
      hot: "Vuelve al Mundial tras 40 años (desde 1986). Selló el boleto con un 2-1 a Bolivia en el repechaje intercontinental, llegando a México una semana antes por el conflicto en Medio Oriente.",
      highlight: null,
      notes: "El equipo con menos datos accesibles: sin página de selección en corner-stats y muestra muy pequeña. Resultados recientes: 2-1 a Bolivia (repechaje), 1-0 a Indonesia, 0-0 con Arabia Saudita. Goles/récord sobre 20: sin datos suficientes."
    },
    // Grupo K
    {
      name: "Portugal", flag: "🇵🇹", conf: "UEFA", group: "K", status: "complete",
      prob: { w: 58, d: 24, l: 18 },
      gf: 2.30, ga: 1.00, sample: "20 oficiales (corner-stats)",
      record: { w: 13, d: 5, l: 2 },
      over25: { pct: 56, n: 9 }, btts: { pct: 56, n: 9 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","G","E","G"],
      hot: "Ronaldo rumbo a su 6º Mundial. 13-5-2 en 20 con 3,3 goles totales/pp. Goleó 9-1 a Armenia en la clasificación; 56% Over y 56% BTTS (n=9).",
      highlight: "gf",
      notes: "Bajo Roberto Martínez. Favorita del Grupo K junto a Colombia."
    },
    {
      name: "Uzbekistán", flag: "🇺🇿", conf: "AFC", group: "K", status: "complete",
      prob: { w: 25, d: 30, l: 45 },
      gf: 1.69, ga: 0.69, sample: "16 de clasificación (cálculo propio)",
      record: { w: 10, d: 5, l: 1 },
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: ["P","G","G","G","E"],
      hot: "Primer Mundial de su historia y 1ª selección de Asia Central en lograrlo. Clasificó directo (2º tras Irán) con 27 goles y 11 recibidos en 16 partidos. Cannavaro al mando.",
      highlight: null,
      notes: "corner-stats sin página de selección; promedios = clasificación (cálculo propio). Over/BTTS: sin muestra de marcadores suficiente."
    },
    {
      name: "Colombia", flag: "🇨🇴", conf: "CONMEBOL", group: "K", status: "complete",
      prob: { w: 48, d: 27, l: 25 },
      gf: 1.90, ga: 1.10, sample: "20 oficiales (corner-stats)",
      record: { w: 9, d: 5, l: 6 },
      over25: { pct: 86, n: 7 }, btts: { pct: 43, n: 7 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["P","G","E","G","E"],
      hot: "Talento de sobra (James, Luis Díaz): 86% Over 2.5 (n=7). Goleó 4-0 a México y 3-0 a Australia, y le ganó a Argentina en la clasificación. Pero llega irregular en amistosos.",
      highlight: "over25",
      notes: "Bajo Néstor Lorenzo. Co-favorita del Grupo K. Forma de amistosos mixta (ganó 2 de sus últimos 5)."
    },
    {
      name: "Congo RD", flag: "🇨🇩", conf: "CAF", group: "K", status: "complete",
      prob: { w: 22, d: 28, l: 50 },
      gf: 1.00, ga: 0.83, sample: "6 oficiales recientes (cálculo propio)",
      record: { w: 3, d: 2, l: 1 },
      over25: null, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","G","E","G","P"],
      hot: "Vuelve al Mundial tras 52 años (desde Zaire 1974). Eliminó a Nigeria por penales y a Jamaica (1-0) en el repechaje intercontinental, con gol decisivo de Tuanzebe.",
      highlight: null,
      notes: "corner-stats sin página de selección; muestra de 6 (AFCON + repechajes). Over/BTTS: sin datos suficientes."
    },
    // Grupo L
    {
      name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", conf: "UEFA", group: "L", status: "complete",
      prob: { w: 62, d: 22, l: 16 },
      gf: 2.35, ga: 0.40, sample: "20 oficiales (corner-stats)",
      record: { w: 16, d: 1, l: 3 },
      over25: { pct: 50, n: 6 }, btts: null,
      corners: null, cards: null, possession: null, shots: null,
      form: ["P","G","G","G","G"],
      hot: "Defensa histórica: solo 0,40 goles recibidos/pp en 20 (16-1-3) — la mejor del torneo. Clasificó con paso perfecto bajo Tuchel; su única derrota reciente fue 0-1 con Japón en amistoso.",
      highlight: "ga",
      notes: "Gran favorita del Grupo L y candidata al título. BTTS muy bajo (muchas vallas a 0) → marcado como sin datos para no confundir."
    },
    {
      name: "Croacia", flag: "🇭🇷", conf: "UEFA", group: "L", status: "complete",
      prob: { w: 48, d: 27, l: 25 },
      gf: 2.05, ga: 1.05, sample: "20 oficiales (corner-stats)",
      record: { w: 12, d: 3, l: 5 },
      over25: { pct: 86, n: 7 }, btts: { pct: 86, n: 7 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["G","P","P","G","G"],
      hot: "Modrić (40) va a su 5º y último Mundial. Partidos de goles: 86% Over 2.5 y 86% BTTS (n=7). Ganó su grupo de clasificación (7V-1E).",
      highlight: "over25",
      notes: "Bajo Zlatko Dalić. Subcampeona del mundo 2018. Cayó en amistosos con Brasil (1-3) y Bélgica (0-2)."
    },
    {
      name: "Ghana", flag: "🇬🇭", conf: "CAF", group: "L", status: "complete",
      prob: { w: 35, d: 28, l: 37 },
      gf: 1.50, ga: 0.63, sample: "8 oficiales recientes (cálculo propio)",
      record: { w: 4, d: 1, l: 3 },
      over25: { pct: 25, n: 8 }, btts: { pct: 13, n: 8 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["P","P","P","G","G"],
      hot: "Ganó su grupo de clasificación (8V-1E-1D). Pero llega frío: perdió sus 3 amistosos previos sin marcar (Japón, Corea, Sudáfrica). Queiroz es el nuevo DT.",
      highlight: null,
      notes: "corner-stats solo tiene la femenina; muestra de 8. Goleó 5-0 a Rep. Centroafricana y 4-0 a Trinidad en la clasificación."
    },
    {
      name: "Panamá", flag: "🇵🇦", conf: "CONCACAF", group: "L", status: "complete",
      prob: { w: 28, d: 32, l: 40 },
      gf: 1.43, ga: 0.71, sample: "7 oficiales recientes (cálculo propio)",
      record: { w: 3, d: 4, l: 0 },
      over25: { pct: 29, n: 7 }, btts: { pct: 57, n: 7 },
      corners: null, cards: null, possession: null, shots: null,
      form: ["P","E","G","G","E"],
      hot: "Clasificó SIN perder (ganó su grupo de la ronda final, 3V-3E). Christiansen armó un equipo sólido; estuvo 13 partidos invicto hasta caer con México en enero.",
      highlight: null,
      notes: "corner-stats sin página de selección; muestra de 7 (clasificación + amistosos), muy empatadora. La derrota de la forma es el amistoso con México."
    }
  ]
};

// Helper para crear equipos pendientes (estructura vacía lista para completar)
function p(name, flag, conf, group) {
  return {
    name, flag, conf, group, status: "pending",
    prob: null, gf: null, ga: null, sample: null, record: null,
    over25: null, btts: null, corners: null, cards: null,
    possession: null, shots: null, form: null, hot: null,
    highlight: null, notes: null
  };
}
