// The words live in content/, one file per page, which is the repository's rule. The
// loaders reach out of src/ to read them, so nothing has to be duplicated or copied in.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ base: './content/docs', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Where in the library the page's facts come from. Carried over from the content so a
    // claim can be traced back to the README or the source at a named version.
    sourceOf: z.string().optional(),
  }),
});

const learn = defineCollection({
  loader: glob({ base: './content/learn', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // The question the article answers, in the words someone would search with, and
    // where it sits in the four. The front sheet has neither, which is what marks it.
    question: z.string().optional(),
    order: z.number().optional(),
  }),
});

// The two pages that are only themselves: the specification sheet and the 404. They are
// in content/ like every other page's words, and they have no collection of their own to
// be ordered within.
const sheets = defineCollection({
  loader: glob({ base: './content', pattern: '{specs,404}.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { docs, learn, sheets };
