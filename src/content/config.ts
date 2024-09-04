import { z, defineCollection } from "astro:content";

const anySchema = z.object({
  any: z.string().optional(),  
});

const docs = defineCollection({
	schema: anySchema,
});

export const collections = { docs };
