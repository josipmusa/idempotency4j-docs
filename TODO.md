# Still to do

Two things, neither of which blocks the site being live. Delete this file once they are
done.

## 1. The repository's own front page

`josipmusa/idempotency4j-docs` has no description, no website link and no topics, so on
GitHub it is a bare name. The library repository has all three and they should match.

```
gh auth switch --user josipmusa

gh repo edit josipmusa/idempotency4j-docs \
  --description "The website and documentation for idempotency4j, an idempotency engine for Java." \
  --homepage "https://josipmusa.github.io/idempotency4j-docs/" \
  --add-topic idempotency --add-topic java --add-topic spring-boot \
  --add-topic documentation --add-topic astro
```

Also worth setting, but only through the web UI - Settings → General → Social preview:
upload `public/og.png`. That is the card that shows when the repository itself is linked,
and it is the same plate the site already serves.

## 2. The library's README does not link here

`josipmusa/idempotency4j`'s README has no link to the site. It is the only place a reader
arrives from, so until it does, the site has no front door.

Two edits in `~/Private/idempotency4j/README.md`:

- Add a badge to the row under the headline, beside Maven Central and CI:

  ```
  [![Docs](https://img.shields.io/badge/docs-idempotency4j-e0562a)](https://josipmusa.github.io/idempotency4j-docs/)
  ```

- And a plain line right after the bold headline paragraph, because a badge is easy to
  scan past:

  ```
  **[Read the documentation →](https://josipmusa.github.io/idempotency4j-docs/)**
  ```

Then set that repository's homepage to the site rather than to Maven Central - the site
links onward to Maven Central, so nothing is lost and the more useful page is the one
GitHub shows in the sidebar:

```
gh repo edit josipmusa/idempotency4j --homepage "https://josipmusa.github.io/idempotency4j-docs/"
```
