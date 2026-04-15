# VR Hotel — 360° web demo

Static React + Vite demo: explore hotel-style rooms with equirectangular panoramas, orbit controls, and clickable hotspots. Data lives in `src/data/rooms.js` (no backend).

Panorama images are **real interior 360° JPEGs** from [Poly Haven](https://polyhaven.com/) (CC0): `hotel_room`, `kiara_interior`, and `cinema_lobby` (tonemapped JPG). Replace files in `src/assets/images/` and update imports in `src/data/rooms.js` if you use your own photos.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Project layout

- `src/data/rooms.js` — room metadata, panorama asset imports, hotspot definitions
- `src/components/scenes/VRScene.jsx` — inverted sphere + controls + hotspots
- `src/components/vr/RoomViewer.jsx` — Canvas + texture loading
- `src/components/vr/Hotspot.jsx` — interactive markers
- `src/components/ui/*` — sidebar, header, overlays
- `src/assets/images/` — bundled 360° JPGs (from three.js examples)

## Controls

- **Drag** (or touch drag): rotate the view
- **Sidebar**: switch rooms (texture updates in place)
- **Teal markers**: click for details (Escape or backdrop to close)
