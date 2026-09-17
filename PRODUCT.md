# Product

The authority for all copy. Drafted at kickoff; phase 4 completes it by drafting each page's
copy against it.

## Platform

web

## Users

**Primary.** Java and Spring backend engineers, mid to senior, who have just been bitten by
a duplicate side effect - a payment charged twice, an order shipped twice, a Kafka consumer
that reprocessed on rebalance, a provisioning call that started two VMs. They arrive from
search, from Maven Central, or from a link in a discussion. They are fluent in Java and
Spring and may not know the words *lease*, *fencing* or *at-least-once*.

They want, in order: does this solve my case; what does adopting it cost me; what does it
not do; is it maintained.

**Secondary.** Tech leads and architects choosing between a small library and an in-house
`processed_events` table. They read the limitations before the quickstart. For them the
honesty *is* the pitch.

**Explicitly not a target.** Non-JVM developers. No-code audiences. Engineering managers
looking for a platform. Anyone who needs reactive or WebFlux support - the library does not
have it, and the site says so rather than deflecting.

**Language.** English only. The audience reads technical English regardless of location,
and a second language would double the maintenance on a one-maintainer project without
reaching anyone new.

## Product purpose

**The site's one job:** get idempotency4j into a Java engineer's build file.

**The one primary action:** **`Get started`** - those two words, unchanged, in the
navigation bar, in the hero, and as the closing block of every page. It leads to
`/docs/quickstart`.

The hero additionally carries the dependency coordinate as copyable text with a Copy
button, because for part of this audience copying the coordinate *is* the conversion and
making them navigate first would be friction for its own sake.

**Secondary actions,** visually subordinate and never competing: `GitHub`, `Maven Central`.

**What the site is not.** Not a lead funnel. Not a newsletter. Not a store - there is no
price and no paid tier. Not a platform pitch. Not a personal portfolio. Nobody should build
a form, a signup, a trial, a demo booking, a chat widget or an email capture on it.

## Positioning

**The one idea the site leads with**, in the library's own words, used verbatim:

> An idempotency engine for Java. Give a unit of work a key: it runs once, and every
> duplicate gets the stored result back.

**Supporting proof points, in this order.** The order is the argument and is not to be
rearranged for visual convenience:

1. **The failure is real and expensive.** Callers retry. A duplicate charges money twice.
2. **Adopting it is one dependency and one annotation.** Not a platform, not a migration.
3. **The execution model is knowable.** Acquire a lease, run under a heartbeat, store the
   result, replay it. Five stages, named.
4. **The boundaries are enforced by design.** The engine has no framework or transport types
   in it. Four layers, each owning one thing.
5. **You take only the adapters you want.** Core alone, Spring, HTTP, and one of three
   stores.
6. **It tells you what it cannot do.** No reactive, no tenant isolation, no Redis Cluster,
   and it cannot make someone else's endpoint safe to retry for you.

Point 6 is a positioning asset, not a disclaimer, and it is linked from the homepage.

## Operating context

Visitors evaluate this the way engineers evaluate a dependency: they look for the mental
model, the code they would write, the storage they already run, and the reasons not to use
it. They do not look for testimonials, customer logos, or a founder's story, and supplying
those would cost credibility rather than build it.

The product surface shown, in order: the failure it prevents (as a diagram), the execution
model (as a diagram), the architecture (as four named layers), the code (three real
samples), the module and store matrix.

Assets are governed by [docs/CONTENT.md](docs/CONTENT.md). The site's own content lives in
Markdown and MDX collections in this repo.

## Capabilities and constraints

**Emphasise:** the `@Idempotent` annotation; the `Idempotency-Key` HTTP filter; the raw
engine for non-Spring use; joined transactional completion, because it is the feature most
competitors of the hand-rolled kind get wrong; the three storage backends; the store SPI.

**Stack:** Astro, static output, Starlight for `/docs` restyled to the site's tokens,
Markdown and MDX collections, no CMS. GitHub Pages via GitHub Actions. No third-party
scripts of any kind.

**Contact route:** the issue tracker. GitHub Issues, Discussions and the security policy
live in the footer. There is no contact page and no form.

**The site must not:** collect anything, set a cookie, load a third-party script, or ask for
an email address.

**Never invent.** Do not invent facts, completion claims, testimonials, awards, credentials,
clients, metrics or performance claims that are not in the library's own source material.
Specifically, and non-negotiably:

- **No download counts, user counts or adoption claims.** There are none to cite.
- **No "used in production by", no "trusted by", no logo wall.** No user has consented to be
  named, and none has been asked.
- **No benchmarks, latency figures, throughput numbers or "Nx faster".** None have been run.
- **No star count written as copy.** A live badge rendering the GitHub API is data. "Over
  1,000 developers" is invention.
- **No claim of exactly-once.** The library is explicit that exactly-once delivery is not
  what this is. The site is at least as explicit.
- **No implication that the library protects downstream side effects.** It makes *your* work
  safe to retry. It cannot make someone else's endpoint safe to retry for you. Any copy
  that blurs this is wrong, not merely loose.
- **No invented roadmap.** Do not write that something is "coming soon" unless it is in the
  library's issues with a milestone.
- **Version numbers and support matrices are copied from the library, never written from
  memory.** They change per release.

## Brand commitments

**The name** is always lowercase, always one word: `idempotency4j`. Never "Idempotency4J",
never "Idempotency4j", never capitalised at the start of a sentence - rewrite the sentence
instead.

**The mark** is two identical chevrons - a request and its retry - running into a single
stop bar. That reading is worth stating once, in the footer or an about line, and never
explained twice.

**Lines to use verbatim** where they fit, because the library's README already says them
better than a rewrite would:

- "An idempotency engine for Java. Give a unit of work a key: it runs once, and every
  duplicate gets the stored result back."
- "It runs once, and every duplicate gets the stored result back."
- "This library makes *your* work safe to retry; it cannot make *someone else's* endpoint
  safe to retry for you."
- "A record is identified by a scope and a key together, never by the key alone."
- "`auto` does not fall back to the in-memory store. … ask for it by name."
- "If you want a failed request to be retriable, throw. If you return an error status, you
  are telling the library that error is the final answer for that key."

**Logo assets:** `docs/logo.svg` and `docs/logo-dark.svg` in the library repo. Wordmark is
Inter SemiBold 22 at `-0.4` tracking, outlined. Do not re-set the wordmark in live text.

## Voice

**Precise, load-bearing, unembarrassed.**

The voice is already established in the library's README and the site inherits it rather
than inventing one. Its habits:

- States the mechanism, then the consequence. Never the benefit without the mechanism.
- Names the tradeoff in the same breath as the feature. "The lease is not released either
  way; the record stays in progress until its lease expires."
- Explains a default by explaining the failure it prevents, not by calling it sensible.
- Uses the library's own vocabulary without softening it: lease, scope, key, record,
  outcome, heartbeat, fingerprint, replay.
- Short declaratives for the important sentence. Longer sentences only when the mechanism
  genuinely has three clauses.

**What the voice is not:** it is not hyped ("blazingly fast", "batteries included",
"just works"), not hedged ("should generally handle most cases"), and not chummy ("let's
dive in", "you've got this", "the magic happens here"). It does not use "simply", "just",
"easily", "seamlessly", "powerful", "robust", "elegant" or "modern". It does not address the
reader as "we".

**Tone by surface:**

| Surface | Tone |
|---|---|
| Hero | Flat and declarative. One claim, no adjectives. |
| Signature scene captions | Neutral narration of what is happening. The diagram makes the point; the caption does not make it again. |
| Homepage body | Explanatory, one idea per section, shorter than the docs. |
| Docs | The README's register exactly. Reference prose that assumes competence. |
| Learn | Teaching. Allowed to be longer, to use analogy, and to spend a paragraph on why something is hard. Still never chummy. |
| Errors and 404 | Plain. State what happened and give the one action. |

## Evidence on hand

Source material: `~/Private/idempotency4j`. `README.md` (~700 lines of finished reference
prose) is the copy source for most of `/docs`. `CHANGELOG.md`, `CONTRIBUTING.md`,
`SECURITY.md`, `LICENSE`, `NOTICE`, the two diagram pairs, both logo files.

**Not supplied, and must not be fabricated:** testimonials, user or customer names, adoption
or download figures, benchmarks, team bios, a company, a roadmap with dates, screenshots of
anything running in production.

`docs/BRANDING.md` is referenced by both logo files and does not exist. Treat the logo files
themselves as the authority.

## Product principles

Each is one line and each is usable as a tiebreaker.

1. **The mechanism is the marketing.** When choosing between a claim and a diagram of how it
   works, ship the diagram.
2. **State the limit in the same breath as the feature.** The honesty is why a senior
   engineer trusts the rest of the page.
3. **Every mark carries information.** If it does not encode real library behaviour, it
   comes off the page.
4. **The homepage is a door, not a building.** Depth belongs in `/docs` and `/learn`. When a
   homepage section wants to grow, it becomes a docs page instead.
5. **Learn must survive without the library.** An article that only makes sense as an
   advertisement is a docs page wearing a costume.
