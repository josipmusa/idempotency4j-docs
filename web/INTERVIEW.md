# The interview (Stage 1)

Seven rounds, one at a time, with AskUserQuestion where choices are closed and plain questions where they are open. Before round 1 the agent reads everything Boss points at (client folder, old site, brand files, notes) and, for each round, confirms what it already knows instead of asking. Vague answers ("modern", "clean", "professional") get exactly one push-back: "show me a site that is modern in the way you mean, and say what in it."

The agent writes `SITE.md` as it goes and reads each section back in two or three lines before moving to the next round. After round 7 it writes `PLAN.md` and asks for confirmation of the shortlist.

---

## Round 1 — Who and for whom

- Who is the client (or is this our own site)? What do they do or sell, in their words?
- Who is their customer? Where are they, what device are they most likely on, what language(s)?
- What is the **one action** a visitor should take? (Call, request a quote, book, start a trial, buy, send an inquiry.) If Boss names three, rank them; the site gets one primary.
- What does a good six months look like for the client after launch?

*Agent infers:* site type candidate, primary action, device and language constraints, whether the audience tolerates heavy motion.

## Round 2 — Type and anatomy

- Agent proposes the site type from `ANATOMIES.md` and the default anatomy and sub-page set for it, in one short list. Boss confirms, or names what is different about this client.
- Anything explicitly out of scope? Anything that must exist (booking widget, shop, blog, second language, login link)?

*Agent records:* the anatomy, borrowed sections if any (max two), the sub-page list, features to note.

## Round 3 — Personality and position

- Three adjectives the brand should be. Two it must never be.
- How should a visitor feel five seconds in?
- Cheap, mid or premium in their market? Who is the closest competitor, and what should we clearly not look like?
- Anything the client has said about looks: a colour they love or hate, "no dark sites", "I want it to move", a logo that cannot change.

*Agent infers:* boldness level (how far the three approaches spread), palette leaning (light/dark, warm/cool), which of the three adjectives the moments should serve.

## Round 4 — References

- Sites Boss likes for **this** use case (two or three). For each, the agent fetches it and asks "what specifically" if Boss did not say. Principles are recorded ("one huge image, everything else small type"), never features to copy ("they have a slider").
- Sites the client sent, with or without comment.
- Competitor site(s), to define what to avoid.
- Sites Boss dislikes, and why.

*Agent records:* 4–8 references, each with one paragraph of principle, what to take, what to reject, and which adjective it serves.

## Round 5 — Content and assets

- What exists: logo (vector?), photos (how many, how good, who shot them), copy or notes, videos, 3D models or drawings, brand colours or guidelines, reviews or testimonials, certifications, a product list or price list.
- What is missing, who provides it, by when. The agent proposes how to fill gaps: a phone shoot with a shot list, a render, a typographic section, `img2threejs` from a photo; stock photography of people is never an option.
- Languages, and who writes or checks copy in each.

*Agent records:* the inventory as have / missing (from whom, by when), the never-invent list seeded with what the client has not confirmed (prices, years, counts, names, certifications).

## Round 6 — Around the moments

These questions are how the agent finds the special moments and the background. They never ask for an effect.

- What is the one thing about this client worth showing off? A thing they make, a space, a process, a result, a number, a person?
- Is there a physical object with a clean silhouette we could photograph well? A space or building? A process that unfolds in steps? A UI to walk through?
- Is there any motion in what they do (a machine, a craft, a before-and-after, a screen)?
- When a customer walks into their shop / opens their app / meets them, what is the first impression? Rough, precise, warm, fast, quiet?
- Which of the references made Boss stop scrolling, and at which moment?

*Agent infers, using the heuristics table in `MOMENTS.md`:* 2–3 moment candidates (which slot, what asset, mobile version, fallback, rough cost) and 2 background candidates. It also decides which asset production, if any, must start now (a photo for `img2threejs`, a render sequence, a shoot).

## Round 7 — Constraints

- Deadline, hosting and domain status, legal footer requirements, analytics, cookie needs.
- Budget for assets (a shoot, renders) in time or money, if any.
- Who signs off on the client side, and how many people give feedback.

---

## Output of the interview

**`SITE.md`** — filled from rounds 1–5 and 7 (see the template).

**`PLAN.md`** — the agent's conclusions:

1. **Three look directions**, each named in two words with one sentence: how it expresses the three adjectives, palette leaning, type character, imagery treatment. Genuinely different systems, not three shades of one idea. One of them is the safe read of the brief; one pushes bolder; one comes from an unexpected angle in the references.
2. **Moments shortlist**: 2–3 candidates from `MOMENTS.md`, each with slot, job, asset needed, mobile behaviour, fallback, cost.
3. **Background shortlist**: 2 candidates with why.
4. **Assignment**: which approach (A/B/C) carries which moment + background combo, so the three approaches differ in feel and in motion, not only in colour.
5. **Real vs mocked for Stage 2**: what content and images are real, what will be marked `[mock]`.
6. **Asset production to start now**, with owner and date.

The agent then asks Boss one question: "Confirm this plan, or tell me what to swap." One round of changes, then Stage 2 begins.
