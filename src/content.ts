import { getCollection } from 'astro:content';
import {
	isComponentInfoEntry,
  isComponentPageEntry
} from './content/config';

export const allPages = await getCollection('docs');
export const componentInfoEntries = allPages.filter(isComponentInfoEntry)    
export const componentPageEntries = allPages.filter(isComponentPageEntry);
export const getInfoParentSlug = entry => entry.slug.split('/info')[0];


export const getComponentEntry = (config) => {
  return componentPageEntries.filter(componentEntry => {
    let match = true;
    Object.keys(config).forEach(key => {
      if (componentEntry.data[key] !== config[key]) {
        match = false;
      }
    });

    if (match) {
      return true;
    }    
  })[0];
}
export const getComponentGlob = (globArray, config) => {
  return globArray.filter(componentGlob => {
    let match = true;
    Object.keys(config).forEach(key => {
      if (componentGlob.frontmatter[key] !== config[key]) {
        match = false;
      }
    });

    if (match) {
      return true;
    }    
  })[0];
}
