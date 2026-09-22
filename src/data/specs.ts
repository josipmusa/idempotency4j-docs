// The support matrix, copied from the library's README at 0.4.0 - the "Requirements"
// section - and nothing else. Every row is a combination the library's CI runs; the
// build matrix covers Java 21 and 25 against Spring Boot 4.0 and 4.1.
//
// One source for both places it appears: the specs page and the reference page under
// /docs/requirements. Nothing here is written from memory, and the version itself is
// never written here at all - it comes from site.config.mjs.

export type SpecRow = {
  item: string;
  // The supported value, as the README states it. `code` sets it in mono, for module
  // names and configuration values.
  supported: string;
  note: string;
  // Rows that say no are the ones the tech-lead audience is reading for.
  no?: boolean;
  code?: boolean;
};

export type SpecGroup = { label: string; rows: SpecRow[] };

export const matrix: SpecGroup[] = [
  {
    label: 'Platform',
    rows: [
      { item: 'Java', supported: '21+', note: 'Compiled to 21, tested on 21 and 25' },
      {
        item: 'idempotency-core',
        supported: 'No framework',
        note: 'Plain Java, plus SLF4J',
        code: true,
      },
      {
        item: 'Spring Boot',
        supported: '4.0.x, 4.1.x',
        note: 'Built against 4.0.8, for the adapters and the starter',
      },
    ],
  },
  {
    label: 'Adapters',
    rows: [
      {
        item: 'Annotated methods',
        supported: 'Spring AOP',
        note: 'No web stack needed - works in a consumer or a batch job',
      },
      {
        item: 'Spring MVC (Servlet)',
        supported: 'Yes',
        note: 'The HTTP filter activates only for Servlet web applications',
      },
      {
        item: 'Spring WebFlux',
        supported: 'No',
        note: 'The HTTP filter does not register, and no error is raised',
        no: true,
      },
    ],
  },
  {
    label: 'Storage',
    rows: [
      { item: 'PostgreSQL', supported: 'Tested on 16', note: 'Via idempotency-jdbc' },
      { item: 'MySQL', supported: 'Tested on 8.0', note: 'Via idempotency-jdbc' },
      {
        item: 'H2',
        supported: 'Tested on 2.x',
        note: 'Via idempotency-jdbc, for development. The store contract runs on it',
      },
      {
        item: 'Redis',
        supported: '7+, tested on 7',
        note: 'Standalone and Sentinel. Redis Cluster is not supported',
      },
    ],
  },
];

export const ci =
  'Every row is a combination CI runs: the build matrix covers Java 21 and 25 against Spring Boot 4.0 and 4.1.';
