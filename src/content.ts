import { getCollection } from 'astro:content';
import {
  isBlogEntry,
	isComponentInfoEntry,
  isComponentPageEntry,
  isFundamentalsEntry,
  isGuideEntry
} from './content/config';

export const allPages = await getCollection('docs');
export const componentInfoEntries = allPages.filter(isComponentInfoEntry);
export const componentPageEntries = allPages.filter(isComponentPageEntry);
export const blogEntries = allPages.filter(isBlogEntry);
export const guideEntries = allPages.filter(isGuideEntry);
export const fundamentalsEntries = allPages.filter(isFundamentalsEntry);
export const getInfoParentSlug = entry => entry.slug.split('/info')[0];


export const getComponentEntries = (componentName) => {
  return componentPageEntries.filter(componentEntry => componentEntry.data.component === componentName);
}
