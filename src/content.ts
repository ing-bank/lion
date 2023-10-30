import { getCollection } from 'astro:content';
import { isComponentInfoEntry, isComponentPageEntry } from './content/config';

export const allPages = await getCollection('docs');
export const componentInfoEntries = allPages.filter(isComponentInfoEntry);
export const componentPageEntries = allPages.filter(isComponentPageEntry);
export const getInfoParentSlug = entry => entry.slug.split('/info')[0];

export const getComponentEntry = config => {
  return componentPageEntries.find(componentEntry => {
    return Object.keys(config).every(key => {
      return componentEntry.data[key] === config[key];
    });
  });
};
