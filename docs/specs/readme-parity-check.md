# README-parity check

**Goal:** fail the build when a version-sensitive fact on the site disagrees with the library
it claims to document.

Phase 4 owes this as a written spec; phase 7 builds it and wires it into CI, alongside
`scripts/check-links.mjs`. Nothing here is implemented yet.

## Why it exists

[DECISIONS.md D4](../DECISIONS.md) keeps the library's README and this site both maintained,
with the site as a superset. The cost accepted there is drift, and the mitigation is this
script:

> A script cross-checks the version-sensitive facts - every `<version>`, the Java and Boot
> version rows, the configuration key list - between the two and fails the build on a
> mismatch. These are the facts that matter and the only ones worth machine-checking.

The failure being defended against is not a typo. It is a library release. When `0.5.0` ships
with a new configuration key, a wider Boot range or a renamed default, every one of those
facts is wrong on this site the moment the release lands, and nothing about the site has
changed to make that visible. A reader copies a coordinate that resolves to an old artifact,
or configures a key that no longer exists, and the site was green the whole time.

## It is not a diff

This is the central design decision and the one that changed after phase 4 was written.

The obvious implementation is a two-way comparison of README sections against their
`sourceOf` pages. That is now unbuildable, because the site deliberately asserts a great deal
the README does not:

- `/docs/operating/troubleshooting` is derived from the library's source rather than its
  README, and none of its seventeen entries exist in the README at all.
- Twenty-nine pages carry per-page framing, cross-links and callouts that a linear README has
  no place for.
- Three pages have no README section to compare against.

A diff would report all of that as drift on every run, and a check that always fails is a
check that gets disabled. So the script is **one-way and fact-by-fact**: it asserts that
specific named facts on the site match the library, and is silent about everything else. The
site being a superset is the expected state, not a finding.

## What is checked

Four checks. Each names a fact, extracts it from both sides, and compares exactly.

### 1. Every artifact coordinate

The version appears in fourteen places across the copy, most of them inside code fences a
reader will copy verbatim, so it cannot be templated without making the samples wrong to
paste.

Instead, **the claimed version is written down once** and the script enforces the rest, the
same shape as the `base` rule in CLAUDE.md:

```ts
// src/consts.ts
/** The library release this site documents. Every version literal in the copy must match. */
export const LIBRARY_VERSION = '0.4.0';
```

The check then asserts:

- Every `<version>` element and every Gradle coordinate in `src/content/` and
  `docs/COPY-HOME.md` equals `LIBRARY_VERSION`, with one allowed exception (below).
- `LIBRARY_VERSION` is a version the library has actually released, taken from the tag the
  check is pinned to.
- Every `groupId`/`artifactId` pair names a module that exists in the library's reactor, so a
  renamed or removed module is caught rather than shipping a coordinate that resolves to
  nothing.

**The allowed exception is `0.3.0`**, appearing four times, which `/docs/requirements`,
`/docs/operating/upgrading` and `/docs/operating/limitations` name as the last Spring Boot 3
release. It is a historical fact rather than the documented version, so it is listed
explicitly in the script rather than matched by a pattern. Any third version literal is a failure, because it is far more likely to
be a stale copy than a deliberate second claim.

### 2. The support matrix

`/docs/requirements` carries ten rows that are all version-sensitive. The script checks the
four that a release actually moves:

| Fact | Where on the site | Where in the library |
|---|---|---|
| Java baseline and tested versions | `/docs/requirements` table | `maven.compiler.release` and the CI matrix |
| Spring Boot range | `/docs/requirements` table | The parent's `spring-boot.version` and the CI matrix |
| Tested database versions | `/docs/requirements` table | The JDBC provider's test containers |
| Redis version and topologies | `/docs/requirements` table | The Redis provider's test containers |

Reading the CI matrix rather than the README is deliberate. The README states these as prose
and can itself be stale; the build matrix is what is actually run, so it is the stronger
source. Where they disagree, the site follows the matrix and the README is the thing that
needs fixing.

### 3. The configuration key list and its defaults

`/docs/reference/configuration` carries a YAML block that is currently **character-identical**
to the README's, which makes this the strictest of the four checks and the cheapest to
implement.

Both sides are a single fenced YAML block under a known heading. The script parses each into a
flat map of dotted key to default value and compares:

- **A key in the library and not on the site** is a failure. A new setting is undocumented.
- **A key on the site and not in the library** is a failure. This is the one direction where
  the superset rule does not apply: a configuration key that does not exist is not extra
  documentation, it is wrong documentation, and a reader will put it in a YAML file and watch
  nothing happen.
- **A default that differs** is a failure, named with both values.

Comparing against the README's YAML block rather than against `@ConfigurationProperties` is a
deliberate limit. The properties class is the real authority, and parsing Java to recover
defaults is a large amount of machinery whose failures would be subtle. The README block is
maintained by the same person in the same commit as the code, is already exact, and keeping
the site honest against it catches the case that matters.

### 4. Verbatim library messages on the troubleshooting page

An extension beyond D4's three, proposed here because the page it protects did not exist when
D4 was written.

`/docs/operating/troubleshooting` carries seventeen entries, ten of which quote a message
verbatim from the library's source, and quoting them verbatim is the page's entire value: an
engineer pastes an exact string into a search box mid-incident. A reworded message in the library silently breaks that, and the
page keeps looking authoritative while matching nothing.

Every blockquote on that page must appear as a literal in the library's source tree, modulo
the placeholders the site substitutes (`<method>` for the interpolated method name). A quote
that no longer matches is a failure naming the entry and the current message. The seven
entries that carry no quote describe runtime behaviour rather than a message and are not
checked.

This check is the one most likely to produce noise, because it is string matching against
source rather than against a curated block. If it proves unreliable across two releases, it is
the first of the four to drop.

### Also: the two configuration tabs must agree

Not a parity check, but it belongs in the same script because it has the same failure shape.

`/docs/reference/configuration` shows the same settings as YAML and as properties. The
properties tab is derived mechanically from the YAML one, and nothing currently stops them
drifting. The script derives the properties form from the YAML block and compares it to what
is written.

This is site-internal and needs no library repo, so it runs even when the parity checks are
skipped.

## What is deliberately not checked

| Not checked | Why |
|---|---|
| Prose | D4 accepts prose drift explicitly. The site restructures the README by design, and any similarity metric over rewritten prose is a coin toss dressed as a check |
| Page structure against README section order | The IA is docs/SITEMAP.md's decision, not the README's |
| Code sample bodies | They are rewritten for the site's context. Their coordinates are checked; their contents are reviewed by a person |
| The three `/learn` articles | Original writing about the problem, not derived from the library, and they name no version |
| `docs/COPY-HOME.md` beyond version literals | It is a copy deck, not a page. Phase 7 builds the components from it and the built page is what gets checked thereafter |
| That the site documents everything the library has | This would be a coverage check, not a parity check. It is a real gap and a different script; it is not in scope here |

## Locating the library

The two are separate repositories and **this repo does not depend on the library at build
time** (CLAUDE.md). The check must not change that, which rules out a submodule, a workspace
dependency and anything that makes `npm run build` reach across.

Two sources, in order:

1. **`IDEMPOTENCY4J_REPO`**, a path to a local checkout. Used when set. This is the
   development path and the one the owner has at `~/Private/idempotency4j`, and it is how the
   check is run against an unreleased working tree before a site update lands.
2. **A tarball of the library at a pinned tag**, fetched from the public repository and
   cached. The tag is `v${LIBRARY_VERSION}` from `src/consts.ts`, so the check compares the
   site against exactly the release it claims to document.

The pinned tag is what makes this deterministic. Checking against the library's `main` would
turn every library commit into a red build on a repo that has not changed, which is the
fastest way to get a check ignored. The site goes red only when the site's own claim and the
release it names disagree.

**The fetch is a CI and development concern and never touches the shipped site.** DECISIONS.md
D15's zero-third-party-requests property is about what a visitor's browser loads, and nothing
here runs in a browser.

**The check is skippable and says so.** With no local path and no network, it prints one line
naming which checks were skipped and exits zero, except in CI, where a skip is a failure. A
check that cannot run offline is a check that blocks work on a train; a check that silently
passes in CI is not a check.

## How it fails

The audience is one maintainer, months later, who is not holding any of this in their head.
Every failure names the fact, both values, both locations, and the one action:

```
check-parity: 2 facts disagree with idempotency4j v0.4.0

  configuration key missing from the site
    idempotency.web.max-body-bytes
    library  README.md:568
    site     src/content/docs/reference/configuration.mdx
    -> add it to both tabs of the YAML block

  version literal does not match LIBRARY_VERSION (0.4.0)
    0.3.1
    site     src/content/docs/storage/jdbc.mdx:24
    -> update it, or add it to KNOWN_HISTORICAL_VERSIONS if it is deliberate

Set IDEMPOTENCY4J_REPO to check against a local working tree.
```

No summary count without the detail, no truncation at three, and no suggestion to rerun with a
flag to see the rest. The whole list is what makes a release bump one pass instead of five.

## Wiring

- `npm run check:parity`, added to `package.json` beside `check:links` and `check:overflow`.
- Phase 7 adds all three to the GitHub Actions workflow, after `npm run build` and before
  deploy. A failure blocks the deploy.
- **The parity check does not run on `npm run build`.** It needs a library checkout or the
  network, and a build that fails on an aeroplane is worse than a check that runs in CI.
  `check:links` and `check:overflow` need neither and can stay on the build.

## Success criteria

- Every fact in the four checks is extracted from both sides by the script, with no fact
  asserted by a hardcoded expectation in the script itself.
- Introducing a disagreement makes it fail, verified by injecting one of each of the four
  kinds rather than by trusting a green run. This is how `scripts/check-links.mjs` was
  validated and it is the only evidence worth having.
- It passes today against `0.4.0`, with no exclusions added to make it pass.
- Running it with no library checkout and no network prints what it skipped and exits zero
  locally, non-zero in CI.

## Out of scope

- Checking that the site documents everything the library has. Coverage, not parity.
- Editing the library repo. This repo does not write to `~/Private/idempotency4j`.
- Automatically bumping versions on a release. The script reports; a person decides.
- Anything about `/learn`.
