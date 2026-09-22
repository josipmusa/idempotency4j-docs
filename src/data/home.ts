// The homepage's words. This file mirrors `content/home.md`, which is the source and
// the thing to edit first; every string below is copied from it verbatim.
//
// The version and the Maven coordinate are never written out here. They come from
// site.config.mjs.

// No section kickers. A tracked uppercase label above a heading is a shape that adds
// nothing the heading does not already carry, and the words that mattered are now in
// the headings themselves.
export type Step = { n: string; title: string; body: string };
export type Row = { cells: string[] };

export const hero = {
  headline: 'It runs once.',
  sub: 'Give a unit of work a key. The first caller acquires a lease, runs under a heartbeat and stores the result. Every duplicate gets that stored result back.',
  kicker: 'An idempotency engine for Java. Apache 2.0.',
  cta: { label: 'Get started', href: '/docs/quickstart' },
};

export const mechanism = {
  id: 'mechanism',
  heading: 'How it works',
  steps: [
    {
      n: '01',
      title: 'Acquire',
      body: 'A record is identified by a scope and a key together, never by the key alone. The key identifies the attempt; the scope names the unit of work it belongs to.',
    },
    {
      n: '02',
      title: 'Run under a heartbeat',
      body: 'Every acquisition carries a lease. The heartbeat fires at lease / 2, so an action that legitimately runs longer than its lease keeps it rather than having it stolen mid-flight.',
    },
    {
      n: '03',
      title: 'Store',
      body: 'The result is encoded and recorded. A record is absent, IN_PROGRESS or COMPLETE; there is no failed state. Releasing deletes the row, so a failed attempt leaves no trace.',
    },
    {
      n: '04',
      title: 'Replay',
      body: 'A concurrent duplicate waits inside tryAcquire for the holder to finish and only gives up once wait elapses, which is why a duplicate arriving mid-flight usually gets the real result rather than an error.',
    },
  ] satisfies Step[],
  footnote:
    'An action that dies without releasing leaves an expired lease, which the next tryAcquire steals atomically.',
};

export const change = {
  id: 'change',
  heading: 'The whole change',
  tabs: [
    {
      key: 'method',
      // A span in backticks is set as code in the note.
      label: 'On a method',
      short: 'Method',
      note: 'Name the key with a SpEL expression over the parameters. `waitTimeout = "PT0S"` turns away a redelivery that arrives while the first is still running, instead of parking the consumer thread.',
      code: `@Idempotent(key = "#event.id()", waitTimeout = "PT0S")
@KafkaListener(topics = "orders")
void on(OrderPlaced event) {
    // Runs once per event id, however
    // often the broker redelivers.
}`,
      added: [0],
    },
    {
      key: 'http',
      label: 'On an HTTP endpoint',
      short: 'HTTP',
      note: "The key is the client's header, so the annotation needs nothing. The payment provider should still get an idempotency key of its own.",
      code: `@PostMapping("/payments")
@Idempotent
public ResponseEntity<Payment> pay(
        @RequestBody PaymentRequest req) {
    // A duplicate gets the stored response.
    return ResponseEntity.ok(
            payments.charge(req));
}`,
      added: [1],
    },
    {
      key: 'plain',
      label: 'Without Spring',
      short: 'Plain Java',
      note: 'IdempotencyEngine.execute is the entire API. What comes back is a sealed Outcome you switch on.',
      code: `var outcome = engine.execute(
        ctx, () -> handler.handle(event));

switch (outcome) {
    // ran now, or ran before under this key
    case Outcome.Executed<Void> e -> { }
    case Outcome.Replayed<Void> r -> { }
    // someone else holds the key right now
    case Outcome.InFlight<Void> f ->
            consumer.nack(f.retryAfter());
}`,
      added: [],
    },
  ],
};

export const prevents = {
  id: 'prevents',
  heading: 'What it prevents',
  lede: 'You need this if callers retry and a duplicate would cause a real problem.',
  items: [
    {
      title: 'Money charged twice',
      body: 'A payment retried by an impatient client or a gateway timeout.',
    },
    {
      title: 'Two orders shipped',
      body: 'Resource provisioning or order creation called again after a network blip.',
    },
    {
      title: 'A consumer reprocessing',
      body: 'An at-least-once broker redelivering after a rebalance.',
    },
  ],
};

export const outcomes = {
  id: 'outcomes',
  heading: 'Four outcomes over HTTP',
  lede: 'Decided entirely by the state the record already holds in the store.',
  rows: [
    {
      state: 'New key',
      what: 'The handler runs and its response is stored',
      code: '200',
      response: "The handler's own response",
      tone: 'run',
    },
    {
      state: 'Completed, body matches',
      what: 'The stored response is replayed',
      code: '200',
      response: 'Idempotent-Replayed: true',
      tone: 'replay',
    },
    {
      state: 'Completed, body differs',
      what: 'Key reused with a different request body',
      code: '422',
      response: 'Unprocessable Entity',
      tone: 'refuse',
    },
    {
      state: 'Still held past waitTimeout',
      what: 'Another request has the key',
      code: '409',
      response: 'Conflict, with Retry-After',
      tone: 'refuse',
    },
  ],
  footnote:
    'The filter stores whatever your handler returns, including 4xx and 5xx, as long as the handler returns normally. A handler that throws is different: the engine releases the lease, which deletes the record, and the next request runs the handler again. If you want a failed request to be retriable, throw.',
};

export const compare = {
  id: 'compare',
  heading: 'The alternatives',
  items: [
    {
      title: 'Your own processed_events table',
      body: 'A row and a unique constraint deduplicate. They do not give you a lease, a heartbeat that holds it while a slow action runs, a concurrent duplicate that waits for the real result instead of failing, or an atomic steal of a dead owner’s lease. Those are the parts that are hard to get right, and they are what the storage SPI’s contract is.',
    },
    {
      title: '@Cacheable',
      body: 'A cache is keyed on arguments and is allowed to miss. An idempotency record is keyed on a client-chosen key and must not. A cache has no notion of an in-flight first execution, so two concurrent duplicates both run.',
    },
    {
      title: 'A workflow platform',
      body: 'Temporal and its neighbours will do this, and much more, in exchange for a new runtime, a new programming model and a new operational surface. This is a dependency and a table.',
    },
  ],
};

// Kept here and rendered on the specs sub-page rather than the homepage: the support
// matrix is what you read once you have decided, not while you are deciding.
export const specs = {
  id: 'specs',
  heading: 'Supported',
  lede: 'Every row is a combination CI runs: the build matrix covers Java 21 and 25 against Spring Boot 4.0 and 4.1.',
  head: ['', 'Supported', 'Notes'],
  rows: [
    ['Java', '21+', 'Compiled to 21, tested on 21 and 25'],
    ['idempotency-core', 'No framework', 'Plain Java, plus SLF4J'],
    ['Spring Boot', '4.0.x, 4.1.x', 'Built against 4.0.8, for the adapters and the starter'],
    ['Annotated methods', 'Spring AOP', 'No web stack needed, works in a consumer or a batch job'],
    ['Spring MVC (Servlet)', 'Yes', 'The HTTP filter activates only for Servlet web applications'],
    ['Spring WebFlux', 'No', 'Nothing registers, and no error is raised'],
    ['PostgreSQL', 'Tested on 16', 'Via idempotency-jdbc'],
    ['MySQL', 'Tested on 8.0', 'Via idempotency-jdbc'],
    ['H2', 'Tested on 2.x', 'Via idempotency-jdbc, for development'],
    ['Redis', '7+, tested on 7', 'Standalone and Sentinel. Redis Cluster is not supported'],
  ] satisfies string[][],
  footnote:
    'Boot 3 applications should stay on 0.3.0, which remains on Maven Central. Spring Boot 3.5 reached open source end of life on 30 June 2026.',
};

export const limits = {
  id: 'limits',
  heading: 'What this is not',
  lede: 'This is not an exactly-once guarantee for arbitrary downstream side effects. Lease fencing protects the idempotency record, not the third-party charge your action made just before the process died. This library makes your work safe to retry; it cannot make someone else’s endpoint safe to retry for you.',
  items: [
    {
      title: 'No reactive support',
      body: "The HTTP adapter is built on OncePerRequestFilter, and the engine's execute is blocking.",
    },
    {
      title: 'No tenant isolation',
      body: 'Within a scope, two callers using the same key share idempotency state. Prefix keys at the application level where that matters.',
    },
    {
      title: 'Redis Cluster is not supported',
      body: 'Standalone and Sentinel master-replica connections work.',
    },
    {
      title: 'Not a distributed lock',
      body: 'It is not something you can borrow for general use.',
    },
  ],
  // The versions live on their own sheet now, so the section that says what the library
  // refuses to do is where the reader is sent to see what it runs on.
  footnote: {
    text: 'The versions it runs on, and the ones it does not, are on the',
    link: { label: 'specification sheet', href: '/specs' },
  },
};

export const closing = {
  id: 'closing',
  heading: 'Add the dependency',
  cta: { label: 'Get started', href: '/docs/quickstart' },
};
