import { z, defineCollection } from "astro:content";

const componentSchema = z.object({
  component: z.string(),
  title: z.string().optional(),
  description: z.string().optional()
});

const anySchema = z.object({
  any: z.string().optional(),  
});

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  published: z.boolean(),
});

export const docsCollectionSchema = z.union([  
  blogSchema,
	componentSchema,
  anySchema,    
]);

const docs = defineCollection({
	schema: docsCollectionSchema,  
});

export const isComponentInfoEntry = (entry) => entry.slug.startsWith('components') && entry.slug.endsWith('/info');
export const isComponentPageEntry = (entry) => entry.slug.startsWith('components') && !entry.slug.endsWith('/info');
export const isBlogEntry = (entry) => entry.slug.startsWith('blog');
export const isFundamentalsEntry = (entry) => entry.slug.startsWith('fundamentals');
export const isGuideEntry = (entry) => entry.slug.startsWith('guides');

export const collections = { docs };
