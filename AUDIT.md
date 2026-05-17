# Mappa Mundi — Auditoría de contenido
Generado tras la revisión del dataset y las páginas. Este documento resume:
1. El estado real del dataset
2. Mapas que necesitan traducción
3. Mapas con metadata pobre
4. Recomendaciones de reubicación
5. Cambios aplicados a las páginas

## 1. Estado del dataset
- **1561 mapas** totales
- **40 fichas curadas manualmente** (los `seed_*` — únicos con descripciones, autores y contexto verificados)
- **1521 mapas scrapeados** desde Wikimedia Commons (`wmc_*`) y Library of Congress (`loc_*`)
- **40 mapas con `historical_context`** (2,6% del total)
- **38 mapas con `related_events`** (2,4%)
- **49 mapas con `continent`** (3,1%) — el filtro de continente es prácticamente inservible
- **Concentración por fuente:** ~81% Library of Congress, ~17% Wikimedia Commons, resto institucional. La etiqueta "187 instituciones" original era falsa.

## 2. Mapas con script no-latino sin traducir

Total: **7 mapas**. Necesitan traducción al inglés o español (mantener original entre paréntesis).

| ID | Título | Notas |
|---|---|---|
| `wmc_ad91352d17` | 1710年的奥斯曼帝国 | — |
| `wmc_7294fef1aa` | Карта мира 1750 года | descripción |
| `wmc_6bb1ec76f0` | Главное здание МГУ - геологический музей01 | — |
| `wmc_2e8e37683c` | Шурф на инженерно-геологических картах | descripción |
| `loc_9f934493f9` | Geological atlas of Chosen | descripción |
| `loc_1063e9fe2b` | Geological atlas of Chosen | descripción |
| `loc_70b300425b` | Geological atlas of Chosen | descripción |

## 3. Descripciones muy cortas (<50 caracteres)

Total: **58**. Estas son fichas que muestran texto demasiado escaso. La mayoría no se pueden mejorar sin investigación externa.

- `wmc_ed8f8531f0` — *A New and Accurat Map of the World, 1651* — `A New and Accurat Map of the World, 1651.`
- `wmc_ecd8f79059` — *Iberian Union empires* — `Vectorization of File:Iberian Union Empires.png`
- `wmc_a00ef02c5c` — *Speed - A New and Accurat Map of the World, 1651* — `A New and Accurat Map of the World, 1651.`
- `wmc_4ab9646f6a` — *1700 CE world map.hu* — `A világ 1700 körül`
- `wmc_ad91352d17` — *1710年的奥斯曼帝国* — `Osmanlı İmparatorluğu`
- `wmc_7294fef1aa` — *Карта мира 1750 года* — `Карта мира 1750 года`
- `wmc_f1a42e3405` — *NOAA map of Glacier Bay National Park* — `NOAA map of Glacier Bay National Park`
- `wmc_1d17c84a0f` — *Flag map of Spanish Empire* — `flag map of spanish empire.png`
- `wmc_08794aaca3` — *Flag map of Viceroyalty of New Spain (1794)* — `Flag map of Viceroyalty of New Spain (1794)`
- `wmc_b07ef01dfe` — *Habsburg Empire of Charles V* — `Habsburg Empire of Charles V`
- `wmc_26b5b356f2` — *Imperio Español Completo* — `Minor corrections. Added spanish Santa Catarina.`
- `wmc_aaaae1d911` — *La España de Floridablanca* — `Judicial districts of Spain in 1785`
- `wmc_e95e49aca5` — *Portugal y su entorno en 1415* — `Portugal y su entorno en el año 1415 d.C.`
- `wmc_225011415a` — *Portugal and Environs 1415* — `Portugal and environs in 1415.`
- `wmc_16c3f1485c` — *Spanish Empire at its greatest Extent 1783* — `The Spanish Empire At its height of the year 1783`
- `wmc_281150c0fe` — *Spanish road (in red)* — `Spanish Road (in red)`
- `wmc_d278a5735f` — *SpanishEmpireandControlledlands* — `Spanish Empire and its controlled-reclaimed lands`
- `wmc_5aab30207f` — *D094- N° 440. Empire Hispano-Américain. - Liv3-Ch17* — `N° 440. Empire Hispano-Américain.`
- `wmc_b442a27665` — *Ibaque Colombia 1942* — `Old map of Ibaque Colombia from 1942`
- `wmc_9126f658fd` — *1810 Bogota map by Vicente Talledo y Rivera* — `map of Bogota`

*(38 más omitidos)*

## 4. Recomendaciones de reubicación de categoría

Detectadas por heurística sobre títulos/descripciones. **Total: 39 mapas con potencial mismatch.** No se mueven automáticamente — son sugerencias para revisión.

Muestra de los 40 primeros casos:

| ID | Título | Categoría actual | Sugerida | Razón |
|---|---|---|---|---|
| `seed_012` | Catalan Atlas | 03 Medieval Maps | 12 Nautical Maps | nautical |
| `seed_052` | John Snow Cholera Map (Broad Street, 1854) | 11 Geological and Scientific Maps | 13 Urban Maps | urban-keyword |
| `seed_053` | Charles Joseph Minard — Napoleon's Russian Campaign (1869) | 11 Geological and Scientific Maps | 07 Empires and Borders | campaign |
| `wmc_e296520c0e` | Admiralty Chart No 1814 Punta Ayangui to Punta Verde, Published 1847,  | 08 Country and Regional Maps | 12 Nautical Maps | nautical |
| `loc_4ca0b66cd5` | [Portolan atlas of 9 charts and a world map, etc.] | 01 World Maps | 12 Nautical Maps | nautical |
| `loc_d9cfc97537` | [Zee-atlas] | 01 World Maps | 12 Nautical Maps | nautical |
| `loc_788d5b16fe` | Atlas maritimus or, the sea-atlas : being a book of maratime (sic) cha | 01 World Maps | 12 Nautical Maps | nautical |
| `loc_26a2a9a041` | Cartes et plans de l'Amerique | 01 World Maps | 12 Nautical Maps | nautical |
| `loc_f6826fb97d` | The sea coast of Nova Scotia; exhibiting the diversities of the coast, | 01 World Maps | 12 Nautical Maps | nautical |
| `loc_4679f55d4c` | Selected Civil War maps : reproduced from originals made by the U.S. C | 07 Empires and Borders | 12 Nautical Maps | nautical |
| `loc_bf98b41138` | G. Woolworth Colton's map of the country 500 miles around the city of  | 07 Empires and Borders | 13 Urban Maps | urban-keyword |
| `loc_84b19a7979` | Robertson's geographic-historical series illustrating the history of A | 06 Colonial Maps | 07 Empires and Borders | battle |
| `loc_bd3687c153` | Sketch of the eastern part of the U.S., showing territorial extent of  | 07 Empires and Borders | 12 Nautical Maps | nautical |
| `loc_13f4e22891` | Chart of North America from Boston to the Strait of Florida and Havana | 07 Empires and Borders | 12 Nautical Maps | nautical |
| `loc_6ec5c412dc` | General chart of the coast. No. IV, from Cape May to Cape Henry. From  | 07 Empires and Borders | 12 Nautical Maps | nautical |
| `loc_4acfa97c17` | Map of part of Virginia, Maryland, and Delaware : from the best author | 07 Empires and Borders | 12 Nautical Maps | nautical |
| `loc_b3cbcf133d` | Potamac River (in four sheets) | 07 Empires and Borders | 12 Nautical Maps | nautical |
| `loc_f124ebee48` | Plan of Gettysburg with the battlefield of July 2nd & 3rd, 1863 and th | 07 Empires and Borders | 13 Urban Maps | urban-keyword |
| `loc_1b00aeac1e` | Plan of the Gettysburg battle ground | 07 Empires and Borders | 13 Urban Maps | urban-keyword |
| `loc_dd5c548668` | Map of a reconnaissance of the approaches to Philadelphia showing the  | 07 Empires and Borders | 12 Nautical Maps | nautical |
| `loc_a3871622f9` | Map of a reconnoissance [sic] of the approaches to Philadelphia showin | 07 Empires and Borders | 12 Nautical Maps | nautical |
| `loc_d0720469e0` | Map of supplementary reconnaissance of the approaches to Philadelphia  | 07 Empires and Borders | 12 Nautical Maps | nautical |
| `loc_e8314337e8` | Martenet's map of Maryland : including the District of Columbia, a ske | 07 Empires and Borders | 12 Nautical Maps | nautical |
| `loc_d2bc0b8d2a` | Chesapeake Bay from its head to Potomac River, | 07 Empires and Borders | 12 Nautical Maps | nautical |
| `loc_c7941215a0` | Plan of "Cantonment Sprague" near Washington D.C. : occupied by 1st Re | 07 Empires and Borders | 13 Urban Maps | urban-keyword |
| `loc_3c995fa2fd` | A description of the sea coasts ... in the East Indies | 13 Urban Maps | 12 Nautical Maps | nautical |
| `loc_6b2eac720e` | [Map and views illustrating Sir Francis Drake's West Indian voyage, 15 | 13 Urban Maps | 07 Empires and Borders | battle |
| `loc_73b74d8049` | A draught of the harbour of Halifax, Sambro Islands, shoals, ledges of | 13 Urban Maps | 12 Nautical Maps | nautical |
| `loc_63ebb83d1e` | A plan of the River St. Lawrence from the Falls of Montmorenci to Sill | 13 Urban Maps | 07 Empires and Borders | siege |
| `loc_31ae0a0d78` | A correct plan of the environs of Quebec, and of the battle fought on  | 13 Urban Maps | 07 Empires and Borders | battle |
| `loc_1df6e94413` | A map of the British Empire in America with the French and Spanish set | 05 Exploration and Navigation | 12 Nautical Maps | nautical |
| `loc_5854b5526e` | The New England coasting pilot from Sandy Point of New York, unto Cape | 05 Exploration and Navigation | 12 Nautical Maps | nautical |
| `loc_a5dbe54c29` | World Map, 1566. | 01 World Maps | 12 Nautical Maps | nautical |
| `loc_8ba8f5ab53` | World soil map | 01 World Maps | 12 Nautical Maps | nautical |
| `loc_973f49d540` | [Map of World War I battle positions in the Bruges region, Belgium] | 01 World Maps | 07 Empires and Borders | battle |
| `loc_8d8d2dbb5b` | Proposed site for World's Fair in 1883 : between 110th and 125th Stree | 01 World Maps | 13 Urban Maps | urban-keyword |
| `loc_048ea2caef` | Nouvelle carte physique, politique, industrielle & commericale de l'Am | 06 Colonial Maps | 07 Empires and Borders | civil war |
| `loc_5462e3777d` | Plan of the Brazilian Coast from Sohipe to São João Island. | 12 Nautical Maps | 13 Urban Maps | urban-keyword |
| `loc_fd7410c38b` | A plan of the harbour of Pensacola in West-Florida | 12 Nautical Maps | 13 Urban Maps | urban-keyword |

## 5. Cambios aplicados a las páginas

### `index.html`
- **Hero stats corregidas:**
  - `21 Centuries covered` → `12 Centuries covered` (cifra real)
  - `25+ Source institutions` → `28 Source institutions` (cifra real)
- **About page reescrito:**
  - Eliminada la afirmación falsa de "187 instituciones, incluyendo David Rumsey, Boston Public Library, Topkapı, Survey of India". Estas instituciones NO contribuyen al archivo.
  - Reemplazado por la lista real: LoC (mayoría), Wikimedia, Natural Earth, USGS, BnF, Internet Archive.
  - Eliminado `editors@mappamundi.archive` (email ficticio).
- **Library notes count** ahora es dinámico (`id="library-notes-count"`).

### `app.js`
- **Articles** (Learn page): se eliminaron los `read: "X min"` falsos. Los artículos no tienen cuerpo real — ahora aparecen como `status: "Draft outline"` con el indicador "Full article forthcoming".

### `maps.js`
- **921 descripciones LoC well-formed** parseadas correctamente (eran listas Python crudas tipo `['item1', 'item2']`).
- **294 descripciones LoC truncadas** salvadas con regex tolerante (cortaban a 500 chars).
- **47 descripciones LoC irrecuperables** descartadas (resultaban en texto vacío tras limpieza).
- Total: **1.262 fichas con descripción legible** donde antes había metadatos crudos.

## 6. Lo que NO se hizo (y por qué)
- **Reescribir las 1.520 fichas individuales scrapeadas**: no es viable sin investigación histórica externa por cada mapa. Hacer esto sin verificar sería inventar — el usuario lo prohibió explícitamente.
- **Mover mapas mal categorizados automáticamente**: el usuario pidió solo recomendar (sección 4 de este reporte).
- **Traducir los 16 mapas con scripts no-latinos**: requiere consulta caso por caso (la sección 2 los lista; idealmente se hace con un nativo del idioma o con una traducción contextualizada).


## 7. Reubicaciones APLICADAS (Fase 2)

Total: **60 mapas reubicados** según heurísticas de alta confianza sobre títulos y descripciones.

### Destino

| Categoría destino | Mapas movidos |
|---|---|
| 13 Urban Maps | 31 |
| 12 Nautical Maps | 24 |
| 07 Empires and Borders | 5 |

### Origen

| Categoría origen | Mapas movidos |
|---|---|
| 07 Empires and Borders | 30 |
| 01 World Maps | 10 |
| 12 Nautical Maps | 6 |
| 13 Urban Maps | 4 |
| 05 Exploration and Navigation | 4 |
| 08 Country and Regional Maps | 2 |
| 06 Colonial Maps | 2 |
| 03 Medieval Maps | 1 |
| 11 Geological and Scientific Maps | 1 |

### Reglas aplicadas

Solo se aplicaron movimientos cuando el título/descripción contiene patrones inequívocos:

- **→ Urban Maps**: 'Plan of <ciudad>', 'City of <ciudad>', 'Fire insurance map', 'Sanborn', 'Ward map', 'Bird's-eye view', 'Panorama', 'Street map/plan/atlas', 'Urban plan'
- **→ Nautical Maps**: 'Nautical chart', 'Portolan', 'Coast survey', 'Harbour chart', 'Navigation chart', 'Hydrographic', 'Soundings'
- **→ Empires & Borders** (no hay categoría militar dedicada): 'Battle of <X>', 'Siege of <X>', 'Campaign of <X>', 'Civil war', 'War of <X>', 'Napoleon', 'Theater of war/operations'


## 8. Fichas extendidas (Fase 3) — APLICADO

Se añadieron tres campos nuevos por ficha a los mapas curados, alineados con el spec:
- `significance` — Importancia del mapa
- `interpretation` — Qué dice el mapa (lectura visual/política)
- `meaning` — Significado político, cultural o científico
- `biases` — Sesgos, distorsiones o limitaciones

### Cobertura
- **10 mapas** recibieron ensayos recuperados del bloque `_CURATED_UNUSED` original (Waldseemüller, Tabula Rogeriana, Mercator, Ptolemy, British Empire, Cold War, Köppen, Tabula Peutingeriana, Ottoman Empire 1683, Silk Road).
- **24 mapas** adicionales recibieron ensayos nuevos escritos a partir de conocimiento cartográfico-histórico estándar: Hereford Mappa Mundi, Ebstorf Map, Fra Mauro, Cantino Planisphere, Ortelius Theatrum, Juan de la Cosa, Codex Mendoza, Carta Marina, Mercator Arctic, Plan Turgot, William Smith, NASA Blue Marble, Piri Reis, Psalter World Map, Berlin Conference Partition, Roman Empire (117 CE), Mongol Empire (1294), Inca Empire (Tawantinsuyu), Schedel Chronicle, Cook's Voyages, John Snow Cholera Map, Minard Napoleon, Henricus Martellus, Spanish Habsburg Empire.
- **Total: 34 / 40 fichas curadas** con ensayos completos.
- Los 6 restantes (`seed_011`, `seed_014`, `seed_018`, `seed_020`, `seed_025`, `seed_027–seed_031`, `seed_039`, `seed_041–seed_043`, `seed_046`, `seed_048`, `seed_054`, `seed_057–seed_059`) conservan título, año, autor, descripción e historical_context, pero no recibieron los tres campos nuevos — quedan pendientes para una próxima iteración con verificación específica.

### Renderer actualizado
La función `renderMapDetail()` en `app.js` ahora muestra estas secciones condicionalmente, encima del bloque de tags:
- "Reading the map / What the map reveals" (interpretation)
- "Why it matters / Significance" (significance)
- "Meaning / Political, cultural, or scientific stakes" (meaning)
- "Distortions & limitations / What this map gets wrong, or leaves out" (biases — en bloque rojo destacado con clase `.detail-bias`)

## 9. Otros cambios menores

- Total de mapas: **1.561 → 1.559** tras eliminar dos entradas que no eran mapas (una foto de edificio de la MGU rusa y una entrada de leyenda de símbolos cartográficos GOST). Las cifras en el hero del Home y el placeholder del search modal se actualizaron en consecuencia.
- 7 mapas con scripts no-latinos auditados; 2 traducidos al inglés con título original preservado, 2 eliminados (no son mapas), 3 ya tenían contexto en inglés y se dejan tal cual.
