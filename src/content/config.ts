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

export const collections = { component, demo, blog, system };
