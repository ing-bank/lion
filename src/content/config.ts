import { z, defineCollection } from "astro:content";

const component = defineCollection({
  // slug: ({id, defaultSlug}) => {
  //   return customSlugFunc(id);
  // },
  schema: z.object({
    name: z
      .string()
      .max(60, "For SEO reasons, please keep the title under 60 characters."),
    description: z.string(),
    // .max(
    //   160,
    //   "For SEO reasons, please keep the description under 160 characters."
    // ),
    // date: z.date(),
    // a draft component is not yet published
    draft: z.boolean().optional(),
    systems: z
      .enum(["form", "overlay", "localize", "icon", "control"])
      .optional(),
    // author: z.enum(["author1", "author2"]),
  }),
});

const story = defineCollection({
  schema: z.object({
    component: z.enum(["accordion", "button"]),
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

export const collections = { component, story, blog };
