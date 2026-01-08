import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const lionComponents = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../docs/components' }),
});

const lionFundamentals = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../docs/fundamentals' }),
});

const lionGuides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../docs/guides' }),
});

const lionBlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../docs/blog' }),
});

const lionIndex = defineCollection({
  loader: glob({ pattern: 'index.md', base: '../docs' }),
});

export const collections = { lionComponents, lionFundamentals, lionGuides, lionBlog, lionIndex };
