# Questions for the client

Phase 3. Items from the never-invent list that were not in the client's material, or where
the material contradicted itself. All three were answered on 2026-09-19 and applied; this
file is kept as the record of what was asked and decided.

| Question | Why we needed it | Answer |
| --- | --- | --- |
| **Q1. Is the storage SPI three methods or five?** `IdempotencyStore` declares five abstract methods - `tryAcquire`, `complete`, `release`, `extendLock`, `purgeExpired` - plus one default, `supportsTransactionalCompletion`. `README.md`, `BRIEF.md`, `writing-a-store.mdx` and `choosing.mdx` all called it "a three-method SPI". | It is a count, so it is on the never-invent list, and the homepage has a section built on it. The secondary audience is a tech lead who reads the limits first and is exactly the person who opens the interface and counts. | **Five, naming the three that carry the protocol.** Applied to `CONTENT.md` section 4, `BRIEF.md`, `writing-a-store.mdx`, `choosing.mdx`, and the library's own `README.md`. The other two are described as mechanical: `extendLock` is the heartbeat, `purgeExpired` the garbage collection. |
| **Q2. What attribution line should the footer carry?** `NOTICE` reads "Copyright 2026 Josip Musa". | `BRIEF.md` lists attribution as a footer requirement but never says whose, and a name on a site is not something to guess at. | **Match `NOTICE` exactly:** "Copyright 2026 Josip Musa". |
| **Q3. Is 0.4.0 the version to tell a visitor to use?** `main` is on "start 0.5.0 development" and `CHANGELOG.md` has an `[Unreleased]` section. | The hero's copyable coordinate is the one thing the site exists to get copied, and the first thing that goes stale. | **One build-time constant.** Every coordinate on the site and in the docs renders from a single exported constant, bumped once per release, holding `0.4.0` today. No network call at build time. Phase 5 wires it alongside the base-path constant. |
