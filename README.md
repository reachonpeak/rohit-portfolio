# Rohit Portfolio â€” Video Editor Portfolio

Open **Jasveer Editor.cmd** on the Desktop, then http://localhost:3010. The existing Desktop project folder remains named **jasveer-editor**; the website now follows the supplied **Jasvir Singh** branding.

## Imported content

15 unique films are stored directly in **public/work/**, with full-length audio/video, local posters, and lightweight muted previews. All supplied duplicates and the three ZIPs were checked. Kasana Finance and Nabhi Oil were found in the archives and later matched to the supplied loose files. Both vertical and landscape formats are preserved in playback. Original files in Downloads remain unchanged.

Films: Auto Mates; Signature Migration; Meubles Navcan; Reach On Peak 01 and 03; WeCan Movers; Sharp Edge Homes 09, 08 and 05; The Wellness City; CBSE schools campaign; Kaurz Kitchen; The Azzmat Garden; Kasana Finance; Nabhi Oil.

The JS logo, contact artwork, and LinkedIn banner are imported in **public/brand/**. The supplied portrait appears in the hero and about section. The supplied brief is retained in **content/project-brief-reference.txt**; it is the earlier test download, not customer information.

## Contact

Name and details were transcribed from the supplied banner: Jasvir Singh, jasvir.visual06@gmail.com, +91 95177 17717. The site offers email, phone, and a downloadable contact card. The active project form posts to `/api/contact` and sends enquiries to `jasvir.visual06@gmail.com` through Gmail SMTP. Follow `EMAIL-SETUP.md` to add the server-only app password.

## Active layout and 3D motion

The active page is `components/reference-studio.tsx`, styled by `app/reference.css` and `app/section-motion.css`. `components/section-motion.tsx` adds 3D scroll entrances to every section, pointer tilt and light reflections on cards, floating hero layers, CSS lens sculptures, animated process steps, and scroll progress. The fixed Pause motion control stops decorative motion; reduced-motion preferences disable it automatically. Touch devices keep scroll entrances and floating artwork without pointer tilt. Loops pause offscreen, in background tabs, and while a dialog is open. No additional animation dependencies were added.

## Earlier design components and 21st.dev

The official **@21st-dev/cli** is installed as a development dependency. The official **21st-cli-use** skill is saved in **.agents/skills/21st-cli-use/SKILL.md**. The CLI was authenticated and used to search and retrieve **Tilt by ibelick**: https://21st.dev/@ibelick/components/tilt (component 1448).

**components/ui/tilt.tsx** adapts that component to the already-installed motion/react package, with reduced-motion and touch handling. It powers perspective motion on film cards, the portrait, and hero composition. **components/premium-motion.tsx** adds a rotating CSS 3D sculpture, floating film frames, staggered title animation, running text ribbon, scroll reveals, and reading progress. Ambient lighting, chrome borders, and reflective card highlights complete the design. The pause control stops looping motion; reduced-motion preferences disable decorative animation. MCP tools were not connected to this running session; the actual retrieval used the official CLI.

## Editing and commands

The hero also includes five additional panels in **components/hero-media-ribbon.tsx**: Signature Migration, The Wellness City, the portrait, Kaurz Kitchen, and the identity banner. The seamless strip pauses on hover/focus; its video previews only play while visible, and the shared motion control pauses everything. Video panels open the full films. The one-time **add-premium-motion.cjs** and **add-hero-ribbon.cjs** migrations have already run; do not rerun them.

- **lib/portfolio-data.ts**: films, descriptions, formats, contact details; film and brand counts are automatic.
- **components/reference-studio.tsx**: active sections, gallery filters, dialogs, and enquiry form.
- **app/reference.css**, **app/section-motion.css**: active responsive design and animation.
- **scripts/prepare-media.cjs**: regenerate optimized copies from Downloads. Existing full clips and previews are skipped.
- **scripts/import-branding.cjs**: import supplied artwork and regenerate the logo/contact card.
- `npm run dev`: local preview, port 3010.
- `npm run typecheck`: TypeScript check.
- `npm run build`: production Next.js server build in **.next/**; run `npm start` to serve it. A server is required for email delivery.

The one-time **finish-upgrade.cjs** migration has already run. Do not rerun it. Do not run the original **setup-template.cjs** on the customized project: it would restore the old application and overwrite styling/configuration.

The original Hirael source snapshot and MIT license are preserved in **portfolio-source.json**, **components/templates/portfolio/**, and **LICENSE**. The current site uses the custom Studio component. Build and type checks passed; desktop/mobile layout, filters, video dialogs, and the original brief-download flow were checked in Chrome.


