// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// 2. Define a schema for each collection you'd like to validate.
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    published: z.boolean(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  }),
});

const experimentCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    contentSlug: z.string(),
    description: z.string(),
    timetext: z.string(),
    href: z.string(),
  }),
});
// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  blog: blogCollection,
  experiment: experimentCollection,
};
