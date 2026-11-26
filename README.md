# Astrasana website

The corporate website of Astrasana Holding AG with an interactive 3D story as About Us. The story is a single-page scroll: a 3D intro from the globe to Europe, the production in Tagelswangen, the headquarters in Kloten and the partner pharmacies, then products, partners, news and contact. Static HTML, no build step.

Serve the folder with any static server (the About Us page needs the pages on one origin).

- `index.html`: the corporate website, light editorial version.
- `about-us/`: About Us, the interactive 3D story with a thin navigation layer (back to the website, loading, end of story). `about-us/?chapter=1` opens a chapter.
- `story.html`: the 3D story itself, loaded by About Us.
- `lite.html`, `download.html`: earlier lite version and the licences page.
- `corporate/`: forwards to the homepage; its `img/` folder holds the homepage photographs.

## Credits

- Content and partner logos: astrasana.ch and the respective partners.
- 3D rendering: [three.js](https://threejs.org) r128 (MIT).
- Country outlines: Natural Earth via world-atlas 2.0.2, © Michael Bostock (ISC). Kosovo is drawn as part of Serbia at the client's request.
- Elevation: AWS Terrain Tiles (Mapzen Terrarium, open data incl. SRTM).

- Buildings and terrain in Tagelswangen and Kloten: ©swisstopo (swissBUILDINGS3D 3.0, swissALTI3D), open government data.
- Regional map around Zurich (lakes, canton and municipal borders): swisstopo / FSO generalised boundaries via [swiss-maps](https://github.com/interactivethings/swiss-maps) 4.7.0. Rivers, motorways, railways and urban areas: Natural Earth 10m (public domain).
