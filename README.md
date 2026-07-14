# ALJC México — Mission Website

Bilingual (Spanish/English) one-page website for **ALJC México** (Asambleas del
Señor Jesucristo de México), an apostolic Pentecostal missions organization.
The vision — **"Vamos por los 32x"** — is to plant a solid apostolic work in all
32 Mexican states and reach the country's 132 million souls.

Dark, ember/fire-themed design with a flame accent palette.

## Sections (single page, anchor navigation)

- **Inicio / Hero** — "Vamos por los 32x", scripture (Hechos 2:38), CTAs
- **Nosotros** — who we are
- **Visión** — lema, visión, misión
- **Mapa de la misión** — interactive SVG map of Mexico; 32 states grouped into
  4 regions (Norte, Occidente, Centro, Sur-Sureste); click a state to see its
  pastor(s); supports multiple pastors per state
- **132 millones** — the harvest field
- **Video** — embed slot (YouTube/Vimeo)
- **Liderazgo** — Obispo Presidente + Mesa Directiva
- **Donar** — giving CTA, allocation breakdown, "los números"
- **Noticias** — testimonios / praise reports
- **Boletín** — newsletter signup (Formspree)
- **Únete / Contacto** — email, phone, giving
- **Footer**

## Features

- ES/EN language toggle (top-right) driven by the `I18N` dictionary in `script.js`
- Interactive Mexico map (hand-built SVG silhouette + state pins, 4-region color coding)
- Pastors shown per state with photos; pastor states glow on the map
- Scroll-reveal animations and animated counters
- Fully responsive / mobile-friendly

## File structure

```
website-project/
  index.html      # markup / page structure
  styles.css      # all styles (design tokens in :root)
  script.js       # i18n, interactive map data + logic, leadership, news
  assets/         # logo + all photos (extracted from the original build)
  README.md
  TODO.md
  CLAUDE.md
```

## Open it locally

Easiest (recommended), from inside the folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

You can also just double-click `index.html`, but a local server matches how it
will behave when hosted and avoids any `file://` quirks.

## Setup notes

- **Fonts** load from Google Fonts, so you need an internet connection for the
  exact typography (the site still works offline with fallback fonts).
- **Add a pastor:** edit the `PASTORS` object in `script.js`. Key = state code
  (see the `PINS` list), value = array of `{ name, city, photo }`. Drop the photo
  file in `assets/` and point `photo` at it (e.g. `"assets/yuc-jose.jpg"`).
- **Newsletter form** posts to Formspree — replace `your-form-id` in `index.html`.
- **Donate button** needs a real link (PayPal / Donorbox / Stripe).
- **Video** — paste an embed URL into the iframe `src` in the Video section.
