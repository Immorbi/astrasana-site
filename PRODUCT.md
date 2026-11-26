# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: investors and business partners evaluating Astrasana Holding AG. They come to understand what the group is, how it is structured, what it controls along the chain from cultivation to pharmacy, and whether it is a credible, well-run Swiss company to invest in or work with. Decisions on the corporate site are made for this audience first.

Secondary, served by the same pages: partner pharmacies, clinics and distributors looking for supply and a contact, and the general public looking for basic facts. Patients are not the target audience (see Capabilities and Constraints).

## Product Purpose

The corporate website of Astrasana Holding AG, a vertically integrated Swiss pharmaceutical and cannabis company covering all market segments within the industry. The site presents the group, its companies, its production in Tagelswangen, its distribution to partner pharmacies, its product categories, partners and news, and gives a clear way to get in touch. Success: an investor or partner leaves with an accurate picture of the group and a reason to make contact.

## Positioning

- Vertically integrated: cultivation in Switzerland (Astrasana Pharma AG, about 1,000 m² under a Swissmedic licence, GACP), pharmaceutical processing and packaging, an in-house quality control laboratory and GDP-standard storage in Tagelswangen, import and distribution to pharmacies and clinics (Bogen Pharma AG), and international distribution.
- Headquartered in Kloten, Switzerland, with subsidiaries in the Czech Republic, Japan, the United Kingdom and Belgium.
- The first Swiss company with an exclusive partnership with the publicly listed GSI Creos corporation, distributing CBD products for human and veterinary use.

## Operating Context

- Visitors arrive from the investor brochure (Astrasana Investorenbroschüre), partner contacts and searches; many will compare the site with that brochure.
- The site has two environments that read as one product: the light corporate website (the homepage) and an immersive 3D story used as About Us (`about-us/`, which loads `story.html`). The 3D story stays dark for now; adapting it to light is a separate, later stage.
- Contact happens by email or phone with the Kloten office; the contact form opens the visitor's email app.

## Capabilities and Constraints

- Static HTML/CSS/JS, no build step; served from one origin (About Us embeds the 3D story in a same-origin frame). Earlier versions (`lite.html`, `download.html`, the 3D story) are preserved.
- English only for now; other languages are undecided.
- Regulatory: prescription cannabinoids may not be advertised to patients in Switzerland. Copy states facts about the company, its licences and its supply to professionals; no therapeutic promises, no efficacy claims, no calls to patients to use a product. Patient information is limited to the factual route (doctor, prescription, pharmacy).
- Licences: Swissmedic and SÚKL licences are published on `download.html`.
- Undecided: final domain, language versions, and replacement of brochure photographs with licensed or own photography.

## Brand Commitments

- Brand styleguide: https://styleguide.astrasana.io/ (corporate identity of the group). It is the authority for logos, company colours and typefaces.
- Name and identity: Astrasana Holding AG, with the horizontal holding logo from the styleguide (`corporate/img/brand/logo-color.svg` on light grounds, `logo-white.svg` on dark grounds or imagery; `favicon.svg`). Logos are never recoloured, stretched, outlined or given effects; clear space at least the height of the signifier. No new logo.
- Holding colour: #431291 (RGB 67/18/145). Each group company keeps its own signifier colour; colours are never swapped between companies.
- Typefaces: the existing families, Montserrat (display) and DM Sans (text). No new families.
- Direction set by the client for the corporate site: editorial, tasteful, sophisticated, light mode, subtle use of purple; the investor brochure is the visual reference, not a source of figures. The brand purple is used sparingly (captions, links, small details), never as large saturated fields.
- The 3D story keeps its scenes, materials, animations and dark background.
- Never use the glass (3D-rendered) signifier image (`land/site/glass-mark@2x.webp`) on the website; the signifier appears only as the flat brand mark.

## Evidence on Hand

- Company facts and copy from the current site (astrasana.ch and the earlier versions in this repository): around 30 employees, nine additional subsidiaries, products distributed in over 18 countries; the group companies by country; the Tagelswangen production facility; the partner pharmacy model and the patient access route; six product categories; three news items (Green Karat, Sanity Group / avaay Medical, GRAEUB / ASTRAVET).
- Partner logos in `land/partners/`; company photographs in `land/site/`; 3D story previews in `corporate/img/3d-*.webp`.
- Botanical and human photographs in `corporate/img/` taken from the client's investor brochure for the prototype; usage rights are not yet confirmed.
- The brochure's revenue growth and gross margin figures are placeholders and must not be published.
- No testimonials, case studies, press quotes or financial data are on hand; none may be invented.

## Product Principles

1. Facts over claims: every figure and statement traces to confirmed company material; regulated topics stay factual.
2. Investor-grade clarity: structure, scale and control of the chain are understandable in one visit.
3. One product, two environments: the corporate site informs; the 3D story adds an interactive way in, and leaving it is always one step away.
4. Restraint as quality: a Swiss holding presents itself calmly and precisely rather than loudly.
