# Emmanuel Amos — Portfolio

Multi-page static site. Cosmic dark theme (default) with a warm-daylight light theme, toggled via the nav button. Fade transition between pages. Starfield background on every page.

## Pages
- `index.html` — cosmic hero (name, tagline, status card) on load; scroll to featured projects
- `about.html` — bigger introduction, education, research interests, beyond work
- `current-work.html` — template/placeholder for an active-work log
- `experience.html` — work + research timeline with bullets, plus a résumé download CTA
- `projects.html` — research + coursework + personal projects, cards with thumbnail images linking to detail pages
- `projects/_template.html` — copy this for every new project. Includes hero image block, optional 3D viewer block (delete if no CAD/hardware component), and inline instructions
- `projects/*.html` — filled project detail pages (ekf, geothermal, pipe-press, jarvis, nigeria-solar)
- `publications.html` — placeholder, ready for entries later
- `coursework.html` — undergrad/grad, sectioned by Mechanical / Robotics / Software-AI / Other
- `leadership.html` — NSBE, TA role, plus placeholders for USG and tutoring
- `resume.html` — embedded résumé PDF + download (no longer in nav — reachable via the homepage and Experience page buttons)

No dedicated Contact page. No Resume nav tab — résumé is a button on the homepage hero and a CTA block on the Experience page.

## Troubleshooting: page looks unstyled (default serif font, blue links, white background)
Means `assets/style.css` 404'd. Confirm `assets/` (with `style.css`, `main.js`, `viewer.js`) sits next to `index.html` on GitHub — re-upload the full extracted zip, not individual `.html` files. GitHub Pages is case-sensitive too.

## Deploy (GitHub Pages)
1. Create a repo named `your-username.github.io`, public.
2. Push everything, keeping the folder structure (`assets/`, `projects/`, `models/`, root `.html` files).
3. Settings → Pages → Deploy from branch → `main` / root.
4. Live at `https://your-username.github.io` in ~1 minute.

## Fill in before publishing
- Search all files for `your-username`, `your-email@example.com`, `your-handle` and replace.
- Add `assets/headshot.jpg` — small circular photo in the homepage hero (52×52 box; square crop works best).
- Add `assets/resume.pdf`.
- Add project images to `assets/projects/`: `ekf.jpg`, `geothermal.jpg`, `pipe-press.jpg`, `jarvis.jpg`, `nigeria-solar.jpg` — used both as card thumbnails and as the hero image on each project's detail page. Any that are missing show a dashed placeholder box instead of breaking.
- Fill in the placeholders (italic gray text) on Experience, Leadership, and Coursework pages.

## Theme + transitions + starfield
`assets/main.js` handles all three:
- **Theme toggle** (🌙/☀️ in nav): persists via `localStorage`; a small inline script in every page's `<head>` applies the saved theme before first paint.
- **Page transition**: internal `.html` links fade the page out (~220ms) before navigating; every page fades in on load.
- **Starfield**: a fixed full-page canvas (`#stars`) plus a soft `.nebula` gradient div, present on every page. Colors read from CSS variables (`--star-color`, `--star-alpha`), so it automatically adapts between the dark (bright stars) and light (faint warm flecks) themes without extra JS.

If you add a new page: copy the theme-init `<script>` snippet from any existing page's `<head>`, add `<canvas id="stars"></canvas><div class="nebula"></div>` right after `<body>`, and include `<script src="assets/main.js"></script>` (or `../assets/main.js` from `/projects/`) before `</body>`.

## Adding a new project
1. Copy `projects/_template.html` to `projects/your-slug.html`.
2. Fill in the tag, title, role line, hero image filename, paragraphs, pills, and links.
3. Keep or delete the 3D viewer block depending on whether the project has a CAD/hardware component.
4. Add a thumbnail card linking to it from `projects.html` (and `index.html` if it's featured), following the pattern of the existing cards.

## 3D viewer
Currently only on `projects/pipe-press.html` — the one completed project with real parametric CAD. Loads STL files via the "+ Load .STL file" button, or pre-load exports into `/models`. Large STL files should go through Git LFS; since GitHub Pages doesn't resolve LFS pointers natively, serve large files via jsDelivr (`https://cdn.jsdelivr.net/gh/user/repo@main/models/file.stl`) instead of committing them raw.
