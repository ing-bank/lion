import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const component = defineCollection({
  schema: z.object({
    name: z.string().max(60),
    description: z.string(),
    draft: z.boolean().optional(),
    systems: z
      // control is a replacement of core here. It's like a superset of formcontrol, for all interactive ui components
      .enum(['formControl', 'overlay', 'localize', 'icon', 'control'])
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

const lionComponents = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './docs/components' }),
});

const lionFundamentals = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './docs/fundamentals' }),
});

const lionGuides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './docs/guides' }),
});

const lionBlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './docs/blog' }),
});

const lionIndex = defineCollection({
  loader: glob({ pattern: 'index.md', base: './docs' }),
});

const blog = defineCollection({
  schema: z.object({
    title: z.string().max(60, 'For SEO reasons, please keep the title under 60 characters.'),
    description: z
      .string()
      .max(160, 'For SEO reasons, please keep the description under 160 characters.'),
    date: z.date(),
    tags: z.array(z.enum(['accessibility', 'ux', 'platform', 'design', 'development', 'lit'])),
    published: z.boolean(),
    author: z.enum(['Erik Kroes', 'Konstantinos Norgias', 'Danny Moerkerke']).optional(),
  }),
});

const system = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    components: z.array(z.string()),
  }),
});

export const collections = { docs, component, blog, system, lionComponents, lionFundamentals, lionGuides, lionBlog, lionIndex };
