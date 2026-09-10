# Emmanuel Amos — Portfolio

Multi-page static site: dark, restrained, academic-portfolio register.

## Pages
- `index.html` — condensed homepage (hero, stats, featured projects, news)
- `projects.html` — full project write-ups; includes the 3D SolidWorks/STL viewer under Project JARVIS
- `research.html` — capstone report, formatted like a publication entry
- `resume.html` — embedded résumé PDF + download
- `about-DRAFT.html` — drafted About page, **not yet linked in nav**. Edit it, then add a nav link in each page's `<div class="nav-links">` when ready: `<a href="about.html">About</a>` (rename the file to `about.html` first).

## Deploy (GitHub Pages)
1. Create a repo named `your-username.github.io`, public.
2. Push all files (keep the folder structure: `assets/`, `models/`, and the `.html` files at repo root).
3. Settings → Pages → Deploy from branch → `main` / root.
4. Live at `https://your-username.github.io` in ~1 minute.

## Fill in before publishing
Search each `.html` file for: `your-username` (GitHub), `your-email@example.com`, `your-handle` (LinkedIn). Add your résumé at `assets/resume.pdf`.

## 3D viewer
Only appears on `projects.html`, under Project JARVIS — the one project with actual SolidWorks/mechanical hardware. Loads STL files (binary or ASCII) via the "+ Load .STL file" button, or drop pre-exported `.stl` files in `/models`. Export from SolidWorks: File → Save As → STL. Large STL files should go through Git LFS — see prior guidance on jsDelivr for serving them since GitHub Pages doesn't resolve LFS pointers natively.

## Adding more projects with a viewer
Copy the `.viewer-shell` block from the JARVIS project in `projects.html`, give it a unique `id`, and add a matching `initViewer('your-id', {demo:'gear'|'bracket'})` call at the bottom of the page.
