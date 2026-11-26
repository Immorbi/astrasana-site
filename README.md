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
- Icons: [Lucide](https://lucide.dev) (ISC licence), © Lucide Icons and Contributors.

## Motion environment (second version, `v2.html`)

The header toggle switches between V1 (`index.html`) and V2 (`v2.html`). V2 starts as a copy of V1 and is where motion prototypes are built, inspired by the reference site polpharmabiologics.com (Webflow, GSAP, Lenis, Barba, Swiper, Unicorn Studio).

Loaded on `v2.html` only, from `land/vendor/motion/`, fixed versions, no build step:

| Tool | Version | Use |
|---|---|---|
| GSAP | 3.15.0 | animation engine (GreenSock standard licence, free for commercial use) |
| ScrollTrigger | 3.15.0 | scroll-linked animation, pinning, scrubbing video `currentTime` |
| SplitText | 3.15.0 | headlines by lines, words or letters (re-split on resize, keep text accessible) |
| CustomEase | 3.15.0 | custom motion curves |
| Flip | 3.15.0 | smooth change between two layouts (a card opening into a preview) |
| Lenis | 1.3.27 | smooth scrolling (MIT); off by default, on with `<html data-lenis>` or `v2.html?lenis=1` |

`corporate/motion.js` registers the plugins, ties Lenis to the GSAP ticker and ScrollTrigger, keeps Lenis off under `prefers-reduced-motion`, and exposes `window.Motion` (`gsap`, `ScrollTrigger`, `SplitText`, `CustomEase`, `Flip`, `lenis`, `reduce`, `scrollTo`). In-page links use Lenis when it is on.

Not installed, added when a design needs them:
- **Unicorn Studio**: external WebGL scene editor (highlights, distortion, cursor reaction). To embed a scene we need its published project ID (or an exported JSON scene), then its script (`unicornStudio.umd.js`, fixed version) and a `<div data-us-project="…">`.
- **Barba.js**: page transitions between separate pages; the site is a single page and the 3D story keeps plain links.
- **Swiper**: carousels, only for a concrete slider in a design.
- **Webflow**: the reference site's builder; this project stays static HTML/CSS/JS.
