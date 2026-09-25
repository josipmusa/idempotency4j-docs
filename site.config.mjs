// The one place the deployment path and the library version are defined.
// Nothing else in the site writes either of them out.
import { basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// The repository may be renamed. On GitHub Actions the name comes from the
// environment; locally it comes from the checkout directory. Neither is typed
// out, so a rename needs no edit here or anywhere else.
const repo = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : basename(dirname(fileURLToPath(import.meta.url)));

const owner = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[0]
  : 'josipmusa';

export const BASE = `/${repo}`;
export const SITE = `https://${owner}.github.io`;

// The library this site is about. Copied from the library at a named version,
// never from memory.
export const LIBRARY_VERSION = '0.5.0';
export const GROUP_ID = 'io.github.josipmusa';
export const ARTIFACT_ID = 'idempotency-spring-boot-starter';
export const COORDINATE = `${GROUP_ID}:${ARTIFACT_ID}:${LIBRARY_VERSION}`;
export const REPO_URL = `https://github.com/${owner}/idempotency4j`;
export const MAVEN_CENTRAL_URL = `https://central.sonatype.com/artifact/${GROUP_ID}/${ARTIFACT_ID}`;
export const COPYRIGHT = 'Copyright 2026 Josip Musa';
