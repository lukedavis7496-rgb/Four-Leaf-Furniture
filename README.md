# Four Leaf Furniture

The website for Four Leaf Furniture: live edge tables and furniture, made by
hand. It shows the work, lists pieces for sale, takes inquiries, teaches, and
hosts the free woodworking planner.

Built with [Astro](https://astro.build) (static output), GSAP ScrollTrigger
for the home page hero, and plain CSS. No CMS: pieces and articles are
Markdown files in this repo.

```
npm install
npm run sync-planner   # build the planner into public/planner/app/ (once, then when it changes)
npm run dev            # http://localhost:4321
npm run build          # static site in dist/
npm run preview        # serve dist/
npm run check          # type-check pages and content
```

## Pages

| Page | File | Shows |
|---|---|---|
| Home | `src/pages/index.astro` | scroll hero, featured work, available now, planner teaser, latest from Learn, inquiry call to action |
| Work | `src/pages/work/` | every piece, filterable by type; one page per piece |
| Shop | `src/pages/shop.astro` | pieces with `status: for-sale`, and how buying works |
| Learn | `src/pages/learn/` | articles and videos, filterable by topic |
| Planner | `src/pages/planner.astro` | the planner, embedded |
| About | `src/pages/about.astro` | your story and journey |
| Inquire | `src/pages/inquire.astro` | how commissions work, and the form |

Site-wide details (name, city, email, social links, form endpoint) are in
**`src/site.config.ts`**. Start there.

## Add a piece

Each piece is a folder in `src/content/pieces/` with an `index.md` and its
photos:

```
src/content/pieces/walnut-dining-table/
  index.md
  01.jpg
  02.jpg
```

```markdown
---
title: Walnut Dining Table
summary: One line for cards and search results.
type: live-edge          # live-edge | round | classic | shelving | other
status: built            # built | for-sale | sold
price: 2400              # optional; shown while for sale
species: Black walnut
dimensions: 84″ L × 40″ W × 30″ H
base: Black steel U legs
finish: Hardwax oil
year: 2026
featured: true           # show on the home page
photos:                  # the first is the cover and the share image
  - src: ./01.jpg
    alt: The table from the end, in the dining room.
  - src: ./02.jpg
    alt: Close-up of the live edge and a butterfly key.
---

The story of the piece: where the slab came from, what was hard, what you'd
do differently.
```

The folder name is the page address (`/work/walnut-dining-table/`). Photos
straight off a phone are fine: the build resizes and converts them.
`npm run check` tells you if a field is missing or misspelled.

- **Mark it sold**: change `status: for-sale` to `status: sold`. It leaves
  the shop and stays in Work with a "Sold" label.
- **Placeholders**: entries with `placeholder: true` carry a visible
  "Placeholder" note. Delete the `*-placeholder` folders once you have real
  pieces.

## Write an article

Add `src/content/learn/<address>.md`:

```markdown
---
title: Choosing steel legs for a slab
summary: One or two sentences for the card.
date: 2026-10-20
kind: article
tags: [live-edge, design]   # getting-started, live-edge, finishing, tools, design
cover: ../../assets/learn/steel-legs.jpg
coverAlt: Three styles of steel leg leaning on a wall.
---

Write in Markdown. Headings, lists, tables, links and images all work.
```

To add a topic, add it to the `tags` list in `src/content.config.ts` and its
label in `src/lib/labels.ts`.

## Add a video

Same as an article, with `kind: video` and the YouTube ID (the part after
`v=` in the link):

```markdown
kind: video
youtubeId: dQw4w9WgXcQ
```

The page shows a thumbnail, and only loads YouTube's player when someone
presses play (from youtube-nocookie.com), so pages stay fast. The Markdown
body appears under the video as notes.

## The home page hero

The hero is `src/components/HeroScroll.astro`, used in `src/pages/index.astro`
(the three lines of text are set there). The stage pins while you scroll; the
table pulls back, moves aside and the lines arrive one at a time. With
"reduce motion" on, or without JavaScript, it shows the finished layout.

### Swap the photo

The photo is in `public/hero/` at three widths, on a pure black background
so it blends into the page:

```
table-hero-black-960.jpg   table-hero-black-960.webp
table-hero-black-1600.jpg  table-hero-black-1600.webp
table-hero-black-2400.jpg  table-hero-black-2400.webp
```

Replace them with files of the same names (16:9, the piece centred with room
around it). The background must be exactly black (`#000`), or a faint
rectangle shows; cut the piece out with any background remover and place it
on black. `table-hero-cutout-*.webp` are the same cut-out on transparency, if
you want to try other backgrounds.

### Upgrade to an image sequence (Apple style)

Film a slow orbit of the piece (phone on a gimbal, 5–8 seconds, steady
light, plain background), then export frames:

```
mkdir -p public/hero/orbit
ffmpeg -i orbit.mp4 -vf "fps=15,scale=1600:-2" -c:v libwebp -quality 70 public/hero/orbit/frame_%04d.webp
ls public/hero/orbit | wc -l     # aim for 60–120 frames
```

Then add the sequence to the hero in `src/pages/index.astro`:

```astro
<HeroScroll
  lines={[/* … unchanged … */]}
  sequence={{ dir: '/hero/orbit', prefix: 'frame_', count: 90, width: 1600, height: 900 }}
/>
```

Scrolling then turns the piece. Every 8th frame loads first, the rest fill
in, and the nearest loaded frame shows meanwhile. Keep the total under about
6 MB.

## The planner

The planner lives in its own repo,
[Wood-Working-Renderer](https://github.com/lukedavis7496-rgb/Wood-Working-Renderer).
`npm run sync-planner` clones it, builds it and copies the result to
`public/planner/app/` (not committed). The planner page embeds it in a frame,
with a link to open it full screen.

```
npm run sync-planner                                        # main branch from GitHub
PLANNER_REF=some-branch npm run sync-planner                # another branch or tag
PLANNER_DIR=../Wood-Working-Renderer npm run sync-planner   # a local checkout
```

The deploy runs the same script, so a planner change goes live with the next
deploy of this site (push to `main`, or run the workflow by hand from the
Actions tab).

The planner saves designs in the browser's local storage. That works because
it's served from the same address as the site; moving it to another domain
would start everyone with an empty list.

## Inquiry form

The form posts to [Formspree](https://formspree.io) (free for 50
submissions a month):

1. Create a form at formspree.io and copy its endpoint
   (`https://formspree.io/f/abcdwxyz`).
2. Put it in `formEndpoint` in `src/site.config.ts`.

Until then, sending the form opens the visitor's email app with the message
filled in, addressed to `email` in the same file.

The form sends `type`, `name`, `email`, `piece`, `size`, `budget`,
`timeline` and `message`, with a hidden `_gotcha` field to catch spam bots.
Buttons on piece pages link to `/inquire/?piece=<folder>&type=buy` (or
`custom`), which fills in the piece.

**Switching providers**: any service that accepts a normal form POST works
(Basin, Getform, Web3Forms…). Change `formEndpoint`; if the service needs an
access key, add it as a hidden input in `src/pages/inquire.astro`. The page
sends with `Accept: application/json` and shows its own success and error
messages, so pick a service that answers JSON (most do).

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds the planner and the site on every push
to `main` and publishes it to GitHub Pages. One-time setup:

1. On a free GitHub account, Pages needs the repo to be **public**
   (Settings → General → Danger Zone → Change visibility). Private repos
   need GitHub Pro.
2. Open <https://github.com/lukedavis7496-rgb/Four-Leaf-Furniture/settings/pages>
   (or **Settings → Pages**; on a phone, the GitHub app has no Settings, so
   use the browser) and under **Build and deployment** set
   **Source: GitHub Actions**.
3. If the planner repo (Wood-Working-Renderer) is private, the build can't
   clone it on its own. Either make it public, or create a fine-grained
   token with read access to its contents and add it as the
   `PLANNER_TOKEN` secret (Settings → Secrets and variables → Actions).
4. Push to `main` (or run the workflow from the Actions tab).

The site is then at `https://lukedavis7496-rgb.github.io/Four-Leaf-Furniture/`.

### Custom domain

1. Buy the domain and add the DNS records GitHub lists under
   **Settings → Pages → Custom domain** (an `ALIAS`/`A` record for the bare
   domain, a `CNAME` for `www`).
2. Enter the domain there and tick **Enforce HTTPS**.
3. Run the workflow again. It asks GitHub for the site's address, so it
   switches to the domain (served at the root) without any changes here.

All internal links go through `href()` in `src/lib/url.ts`, so they follow
the base path either way.

## Layout

```
src/site.config.ts       name, city, email, social links, form endpoint
src/content/pieces/      one folder per piece (Markdown + photos)
src/content/learn/       articles and videos
src/content.config.ts    the fields each entry must have
src/pages/               one file per page
src/components/          header, footer, cards, hero, video embed…
src/layouts/Base.astro   page shell: head, share tags, header, footer
src/styles/global.css    colours, type, spacing, buttons (light and dark)
public/hero/             hero photo
scripts/sync-planner.mjs builds the planner into public/planner/app/
```

Colours, type sizes and spacing are CSS variables at the top of
`global.css`. The one accent colour is clover green (`--accent`).
