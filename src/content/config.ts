import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }: { image: () => z.ZodType<any> }) =>
    z.object({
      title: z.string(),
      hero: image(),
      heroAlt: z.string(),
      description: z.string(),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      tags: z.array(z.string()),
    }),
});

export const collections = {
  blog: blogCollection,
};
