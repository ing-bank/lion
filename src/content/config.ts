import { z, defineCollection } from "astro:content";

const componentInfoSchema = z.object({
  component: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.literal('component-info'),
  defaultSlug: z.string(),
});

const componentChangelogSchema = z.object({
  component: z.string(),  
  category: z.literal('changelog'),
  type: z.literal('component-changelog'),
});

const componentDesignSchema = z.object({
  component: z.string(),
  category: z.literal('design'),
  type: z.literal('component-design'),
});

const componentDevelopmentSchema = z.object({
  component: z.string(),
  category: z.literal('development'),
  platform: z.enum(['web', 'ios', 'android']),
  type: z.literal('component-development'),
});

export const docsCollectionSchema = z.union([
	componentInfoSchema,
  componentChangelogSchema,
  componentDesignSchema,
	componentDevelopmentSchema,
]);

const docs = defineCollection({
	schema: docsCollectionSchema,  
});

export const isComponentInfoEntry = (entry) => entry.data.type === 'component-info';
export const isComponentPageEntry = (entry) => 
  entry.data.type === 'component-development' || entry.data.type === 'component-changelog' || entry.data.type === 'component-design';

export const collections = { docs };
