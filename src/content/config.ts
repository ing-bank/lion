import { z, defineCollection } from "astro:content";

const component = defineCollection({
  schema: z.object({
    name: z.string().max(60),
    description: z.string(),
    draft: z.boolean().optional(),
    systems: z
      // control is a replacement of core here. It's like a superset of formcontrol, for all interactive ui components
      .enum(["formControl", "overlay", "localize", "icon", "control"])
      .optional(),
    // On component page, based on static analysis via ce analyzer, also gather:
    // - dependencies:
    //   - superclasses/mixins
    //   - systems
    //   - composition
    //   - platformDependencies: relation to platform entities (components or apis)

    dependencies: z.array(z.string()).optional(),
    resources: z.array(z.string()).optional(),
  }),
});

// - Case studies:

// - resources (in):
//  - Open UI
//  - WICG
//  - WHATWG
//  - W3C/WAI-ARIA
//  - MDN
//  - Gecko / Chromium / Webkit
//  - Baseline
//  - Interop

//

const baseSchema = z.object({});
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

const demo = defineCollection({
  schema: z.object({
    component: z.enum(["accordion", "button", "calendar", "button-from-ing-web"]),
    title: z.string(),
    description: z.string(),
  }),
});

const blog = defineCollection({
  schema: z.object({
    title: z
      .string()
      .max(60, "For SEO reasons, please keep the title under 60 characters."),
    description: z
      .string()
      .max(
        160,
        "For SEO reasons, please keep the description under 160 characters."
      ),
    date: z.date(),
    tags: z.array(
      z.enum([
        "accessibility",
        "ux",
        "platform",
        "design",
        "development",
        "lit",
      ])
    ),
    published: z.boolean(),
    author: z
      .enum(["Erik Kroes", "Konstantinos Norgias", "Danny Moerkerke"])
      .optional(),
  }),
});

const system = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    components: z.array(z.string()),
  }),
});

export const isComponentInfoEntry = (entry) => entry.data.type === 'component-info';
export const isComponentPageEntry = (entry) => 
  entry.data.type === 'component-development' || entry.data.type === 'component-changelog' || entry.data.type === 'component-design';

export const collections = { docs, component, demo, blog, system };
