import { humanise } from './humanise.mjs';

const SECTION_PRIORITY = {
  systems: 10,
  tools: 20,
  'node-tools': 30,
  rationales: 40,
};

/**
 * Builds the grouped and ordered navigation structure for fundamentals sidebar (Variant A)
 *
 * @param {Array<any>} allFundamentals
 * @returns {Map<string, Array<{ href: string, label: string, priority: number }>>}
 */
export function getFundamentalsNavigation(allFundamentals) {
  // Store folder/subsystem entries to retrieve their canonical title and ordering
  const folderEntries = new Map();
  allFundamentals.forEach(f => {
    folderEntries.set(f.id, f);
  });

  // Filter out stubs (folder landing pages that just say "-> go to Overview" or "# Systems")
  const contentPages = allFundamentals.filter(f => {
    if (f.data?.eleventyExcludeFromCollections) return false;
    const parent = f.data?.eleventyNavigation?.parent;
    // Section-level and subsystem-level folder index stubs
    if (!parent || parent === 'Systems' || parent === 'Tools' || parent === 'Node Tools') {
      return false;
    }
    return true;
  });

  const groups = new Map();

  contentPages.forEach(f => {
    const parts = f.id.split('/');
    const section = parts[0];
    let categoryKey;
    let categoryOrder = 100;

    if (section === 'rationales') {
      categoryKey = 'Rationales';
      categoryOrder = SECTION_PRIORITY.rationales * 100;
    } else if (parts.length >= 2) {
      const subsystemKey = `${section}/${parts[1]}`;
      const folderEntry = folderEntries.get(subsystemKey);
      const subTitle =
        folderEntry?.data?.eleventyNavigation?.title ||
        folderEntry?.data?.title ||
        humanise(parts[1]);
      const subOrder = folderEntry?.data?.eleventyNavigation?.order ?? 50;

      const secTitle = humanise(section);
      categoryKey = `${secTitle}: ${subTitle}`;
      categoryOrder = (SECTION_PRIORITY[section] || 90) * 100 + subOrder;
    } else {
      categoryKey = humanise(section);
      categoryOrder = (SECTION_PRIORITY[section] || 90) * 100;
    }

    if (!groups.has(categoryKey)) {
      groups.set(categoryKey, { order: categoryOrder, items: [] });
    }

    const name = parts[parts.length - 1];
    const label =
      f.data?.eleventyNavigation?.title || f.data?.title || humanise(name);
    const priority = f.data?.eleventyNavigation?.order ?? 50;

    groups.get(categoryKey).items.push({
      href: `/fundamentals/${f.id}/`,
      label,
      priority,
    });
  });

  // Sort categories by section and subsystem order, and items within by priority then label
  return new Map(
    Array.from(groups.entries())
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([cat, { items }]) => [
        cat,
        items.sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          return a.label.localeCompare(b.label);
        }),
      ])
  );
}
