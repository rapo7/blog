import { defineCollection, z } from 'astro:content';

const blogsCollection = defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      datetime: z.date(),
      image: z.string().optional(),
    }),

});

export const collections = {
  'blogs': blogsCollection,
};