# Special moments and backgrounds

What makes a site recognizably ours: one or two moments a visitor remembers, and a background that was chosen rather than left white. The agent chooses both from the interview; Boss confirms the shortlist in `PLAN.md` and then picks between rendered approaches. Boss is never asked "what effect do you want".

## The rules

1. **One or two moments on the homepage.** The hero slot always gets one. A second lives in the anatomy's other ★ slot. Sub-pages get the reveal language and at most one lighter moment.
2. **One motion language.** Every moment on the site shares the easing family, the tempo and the physics. Two moments that feel like different hands made them is the failure to look for.
3. **A moment does a job**: it reveals content in order, it demonstrates the product or the craft, or it responds to the visitor. Decoration that does none of these is cut.
4. **The background supports the moments.** Never two competing WebGL layers. A shader background and a 3D hero on the same screen is a phone killer; pick one.
5. **Mobile is a version, not a fallback.** Cursor moments are off on touch. 3D degrades to a slow auto-rotate or a static render. Sequences drop frames or become a short video. Everything respects `prefers-reduced-motion` with a real static frame, not a blank.
6. **Weight budget as a report, not a gate:** the agent reports added KB, frame rate on a throttled phone profile and time to first meaningful frame; Boss decides per site.

## Moments catalogue

### Hero moments

| Moment | What the visitor sees | Best for | Needs | Mobile | Cost |
| --- | --- | --- | --- | --- | --- |
| **3D object hero** | The product or object in 3D, tilting with the cursor, lit like a studio shot | Product; a trade that makes objects | A GLTF model, or `img2threejs` from one clean photo | Slow auto-rotate, or static render | Medium–high |
| **Scroll-scrubbed sequence** | An image or render sequence (or video) whose time is driven by scroll: a building assembling, a machine opening, a camera moving through a space | Studio, Product, anything with a space or process | Rendered frames (Blender) or real footage | Fewer frames, or a short autoplaying muted video | Medium–high (asset) |
| **Kinetic headline** | Words rise, mask-reveal or split by line; the claim assembles itself | Any type when imagery is weak; SaaS, Local business, Generic | Nothing | Full | Low |
| **Image curtain / mask reveal** | The hero photo is revealed by a wipe, a shape or a clip-path as the page loads or scrolls | Local business, Studio | One excellent photo | Full | Low |
| **Layered parallax hero** | 2–3 image layers move at different speeds; subtle depth | Local business, Generic | Cut-out or layered images | Reduced or off | Low–medium |

### Scroll moments

| Moment | What the visitor sees | Best for | Needs | Mobile | Cost |
| --- | --- | --- | --- | --- | --- |
| **Pinned steps** | A section pins; as you scroll, steps 1–3–5 change on one side while the visual updates on the other | SaaS how-it-works, Local business process, Product features | UI crops or photos per step | Unpinned stacked steps | Low–medium |
| **Exploded view / callouts** | The object separates into parts or gets labelled callouts as you scroll | Product | 3D or layered renders | Static exploded image | Medium–high |
| **Horizontal scroll gallery** | A row of projects or photos scrolls sideways as you scroll down | Studio, Local business work | 6–12 images | Native horizontal swipe | Low–medium |
| **Image reveal on scroll** | Images enter with a scale + clip reveal, staggered | Studio, any image-led page | Images | Full | Low |
| **Progress line** | A thin line or number that tracks scroll through a long story | Studio project pages | Nothing | Full | Low |

### Cursor moments (desktop only)

| Moment | What the visitor sees | Best for | Cost |
| --- | --- | --- | --- |
| **Custom cursor with labels** | A dot that grows and says "View" / "Play" / "Drag" over interactive things | Studio, Product | Low |
| **Magnetic buttons** | Buttons pull slightly toward the cursor | Playful brands, SaaS | Low |
| **Image trail / follow** | Hovering a project title shows its image following the cursor | Studio work index | Low–medium |
| **Spotlight over grid** | A soft light follows the cursor across a dot or line grid, or a dark card grid | SaaS, Product, tech-leaning Generic | Low |
| **Tilt cards** | Cards tilt in 3D toward the cursor | Product, SaaS features | Low |

### Transitions and reveals (the "language", present on every site)

- Staggered text reveal on enter; consistent easing (one custom cubic-bezier or a spring, chosen once).
- Page transitions via Astro's View Transitions: a shared element (project image → project hero) or a simple fade with a short curtain.
- Hover states that move (underline draws, arrow shifts, image scales 1.03).

## Backgrounds catalogue

| Background | Feel | Pairs with | Avoid with | Mobile | Cost |
| --- | --- | --- | --- | --- | --- |
| **Solid + grain** | Premium, calm, editorial | Everything; the default for Studio and Local business | — | Full | Low |
| **Paper / texture** | Warm, craft, honest | Local business (trades), food, print | Tech products | Full | Low |
| **Dot or line grid + spotlight** | Technical, precise, "engineering" | SaaS, Product, Tensore-type companies | Warm crafts | Grid only, no spotlight | Low |
| **Slow gradient mesh** | Modern, soft, optimistic | SaaS, consumer products, playful brands | Serious professional services | Static gradient | Low–medium |
| **Shader noise / aurora** | Atmospheric, high-end tech | Product launches, SaaS heroes | 3D hero on the same screen | Static frame | High |
| **Particle field (cursor-reactive)** | Alive, technical | SaaS, data products | Anything else animated nearby | Off, static | Medium–high |
| **Large typographic watermark** | Confident, brand-first | Studio, Generic with a strong name | Long names | Smaller | Low |
| **Photographic / video with overlay** | Real, immersive | Local business, Studio | Weak photography | Poster image | Medium (weight) |

A background is chosen once for the site, with a lighter variant for inner pages. Dark vs light is decided by the palette direction, not by the background.

## How the agent infers the shortlist

The interview never asks for effects. It asks around them (round 6 in `INTERVIEW.md`) and then applies these heuristics, in order, to produce 2–3 moment candidates and 2 background candidates in `PLAN.md`:

| If the interview reveals... | Lead moment | Background lean |
| --- | --- | --- |
| a photographable object with a clean silhouette | 3D object hero (`img2threejs` if no model) + exploded view or tilt cards | Dark solid + grain, or spotlight grid |
| a space, a building, a process that unfolds | Scroll-scrubbed sequence (render or footage) + image reveals | Near-black or paper-white + grain |
| software with a real UI to show | Scroll walkthrough of the UI + pinned steps | Dot grid + spotlight, or slow gradient mesh |
| strong photography of work, no object | Image curtain hero + horizontal gallery or image trail | Solid + grain, warm or cool per palette |
| weak or no imagery | Kinetic headline + pinned process steps | Paper texture or typographic watermark |
| adjectives like playful, bold, young | Magnetic buttons, gradient mesh, bigger motion amplitude | Gradient mesh |
| adjectives like precise, serious, premium | Fewer, slower moments; grain; restraint | Solid + grain |
| a brand colour that must dominate | Background carries it as a tint, moments stay neutral | Tinted solid |
| the client said "like Apple" / "like Awwwards sites" | Scrubbed sequence or 3D hero; tell Boss the asset cost | Dark solid |
| a mid-range Android audience (local trades, older customers) | Low-cost moments only; no shaders, no particles | Solid, paper |

Then the three approaches in Stage 2 each get a different combination from the shortlist, so Boss sees the moments as rendered alternatives, not as a list.

## Stack

GSAP + ScrollTrigger for scroll choreography · Lenis for smooth scroll (off on touch) · three.js for 3D · a small in-house scrub engine for image sequences and video (written once, reused) · Astro View Transitions for page transitions · `img2threejs` skill to make a hero object from a photo. Reference gallery for ideas: github.com/MengTo/threeui (never installed as a dependency). Not used: scroll-world (AI-generated worlds, paid credits), PlayCanvas (a game engine; only if a brief ever asks for a real interactive 3D application).
