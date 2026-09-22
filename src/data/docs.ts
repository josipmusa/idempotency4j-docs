// The order of the reference, in six groups. Listed rather than generated from the file
// system, because the order is the content's - what you read first, then the model, then
// the adapters - and a directory listing does not know that.
//
// Every id here is a file in content/docs. The build fails if one is missing, which is
// the point: a page added to content without a place in the reading order is a page
// nobody reaches.

export type DocGroup = { label: string; ids: string[] };

export const groups: DocGroup[] = [
  {
    label: 'Start',
    ids: ['quickstart', 'what-it-does', 'requirements'],
  },
  {
    label: 'The model',
    ids: [
      'concepts/scope-and-key',
      'concepts/record-lifecycle',
      'concepts/leases-and-waiting',
      'concepts/outcomes',
      'concepts/fingerprints',
      'concepts/payloads-and-codecs',
    ],
  },
  {
    label: 'Adapters',
    ids: [
      'annotated-methods',
      'http-endpoints',
      'joining-your-transaction',
      'lifecycle-callbacks',
      'the-engine',
    ],
  },
  {
    label: 'Storage',
    ids: [
      'storage/choosing',
      'storage/jdbc',
      'storage/redis',
      'storage/in-memory',
      'storage/writing-a-store',
    ],
  },
  {
    label: 'Reference',
    ids: [
      'reference/annotation',
      'reference/configuration',
      'reference/http',
      'reference/javadoc',
    ],
  },
  {
    label: 'Operating',
    ids: [
      'operating/limitations',
      'operating/purging-and-retention',
      'operating/security',
      'operating/troubleshooting',
      'operating/upgrading',
    ],
  },
];

// The reading order, flat: what prev and next walk.
export const order: string[] = groups.flatMap((group) => group.ids);
