# website-masjid

Static Next.js 16 (App Router) site for Masjid Lathifah / DKM Lathifah. Plain JavaScript (no TypeScript). All UI copy and data are in Bahasa Indonesia.

## Commands

- `npm run dev` — dev server at localhost:3000
- `npm run build` — production build; the main verification step (no tests, no typecheck exist)
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next`)

## Stack quirks

- Tailwind CSS v4, zero-config (`@import "tailwindcss"` in `src/app/globals.css`; there is no `tailwind.config`). Brand palette is inline arbitrary hex: `#0d3d2b` (dark green), `#c9a84c` (gold). Reuse these, don't invent tokens.
- React Compiler is on (`next.config.mjs` → `reactCompiler: true`).
- Path alias `@/*` → `src/*` (via `jsconfig.json`).

## Content lives in JSON, not code

All site content is `src/data/*.json` imported as modules (`@/data/...`); edit those files to change content.

- `berita.json`: `kategori` is UPPERCASE (`BERITA`, `KEGIATAN`, `PENGUMUMAN`, `SOSIAL`). Adding a category means updating `WARNA_KATEGORI` in both `src/app/berita/page.js` and `src/app/berita/[id]/page.js`, plus `KATEGORI_LIST` in `page.js`. The homepage (`src/app/page.js`) features `berita[0]` as the hero card, so keep the first entry the most prominent.
- The berita detail page splits `isi` into paragraphs on blank lines (`\n\n`); entries without `isi` fall back to `ringkasan`.
- `jadwal.json`: prayer times use `"HH.MM"` (dot separator) and are the fallback for the live Aladhan API. Live timings are fetched client-side via geolocation (`api.aladhan.com`) — never at build time; keep any new scheduling logic in `useEffect`/client code.

## Gotchas

- `src/app/berita/[id]/page.js` is an async server component that must `await params` before reading `params.id` (Next 16 requirement).
- The Donasi modal renders a QRIS placeholder expecting `public/qris.png`; that file is not committed yet.
- `src/app/layout.js` still has create-next-app defaults (`lang="en"`, title "Create Next App") — leftover, not intentional.