/* eslint-disable no-param-reassign, no-unused-vars */
import { UIAnchorControl } from '../UIControlInterfaces.js';
import { setAsStateModifierDemoClass, getAsStateModifierDemoClass } from '../helpers.js';

/**
 * Maintains a list of sheets that have been applied to the document
 * Filled in the head script, read by OJViewer
 * @type {{ name:string; sheet: CSSStyleSheet|HTMLStyleElement }[]}
 */
export const ingCssClassesSheetsAppliedToDocument = [];

/**
 * @param {string} cssComponentName
 * @param {{name:string;values:string[]}[]} allVariantsOfACssComp
 */
function mapAllVariantsToBemClasses(cssComponentName, allVariantsOfACssComp) {
  /** @type {import('../ModifierInterface.js').ModifierMap} */
  const mapToCode = [];

  for (const v of allVariantsOfACssComp) {
    mapToCode.push({
      name: v.name,
      // eslint-disable-next-line consistent-return
      getter: (el, m) => {
        for (const value of v.values) {
          if (el.classList.contains(`${cssComponentName}--${value}`)) {
            return value;
          }
        }
      },
      setter: (el, m, state) => {
        for (const value of v.values) {
          el.classList.remove(`${cssComponentName}--${value}`);
        }
        if (state !== '<default>') {
          el.classList.add(`${cssComponentName}--${state}`);
        }
      },
    });
  }
  return mapToCode;
}

// N.B.: '' means 'default'

const linkCtaVariants = [
  { name: 'mode', values: ['<default>', 'outline', 'filled'] },
  { name: 'size', values: ['<default>', 'font16', 'font24'] },
  { name: 'theme', values: ['orange', 'indigo', 'white'] },
];

// Presentational components

const headlineVariants = [
  { name: 'size', values: ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'] },
  { name: 'color', values: ['primary', 'secondary', 'tertiary'] },
];

const imageVariants = [
  {
    name: 'mode',
    values: ['<default>', 'top-squared', 'bottom-squared', 'left-squared', 'right-squared'],
  },
];

const paragraphVariants = [{ name: 'size', values: ['lg', 'md', 'sm', 'xs', '2xs'] }];

const tableVariants = [
  { name: 'theme', values: ['<default>', 'white', 'gray'] },
  { name: 'density', values: ['<default>', 'compact'] },
];

const listOrderedVariants = [
  {
    name: 'mode',
    values: ['<default>', 'decimal', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman'],
  },
];

// TODO: at some point, we might want to store this info in Figma
/** @type {{[key: string]: import('../ModifierInterface.js').ModifierInterface}} */
export const cssClassModifierInterfaceRegistry = {
  // link: {
  //   designDefinitions: {
  //     variants: [{ name: 'iconPosition', values: ['after', 'before', 'noIconBefore'] }],
  //     // @ts-ignore
  //     states: UIAnchorControl.states.filter,
  //   },
  //   mapToCode: [
  // {
  //   name: 'iconPosition',
  //   setter: (el, m, state) => {
  //     const iconEl = el.querySelector('.link__icon');
  //     if (state === 'noIconBefore') {
  //       el.classList.add('link--no-icon-before');
  //       iconEl?.classList.remove('link__icon--after');
  //     } else if (state === 'before') {
  //       el.classList.remove('link--no-icon-before');
  //       iconEl?.classList.remove('link__icon--after');
  //     } else {
  //       el.classList.remove('link--no-icon-before');
  //       iconEl?.classList.add('link__icon--after');
  //     }
  //   },
  //   getter: (el, m) => {
  //     const iconEl = el.querySelector('.link__icon');
  //     if (el.classList.contains('link--no-icon-before')) {
  //       return 'noIconBefore';
  //     }
  //     if (iconEl?.classList.contains('link__icon--after')) {
  //       return 'after';
  //     }
  //     return 'before';
  //   },
  // },
  //     ...UIAnchorControl.states.map(s => ({
  //       name: s,
  //       getter: getAsStateModifierDemoClass,
  //       setter: setAsStateModifierDemoClass,
  //     })),
  //   ],
  // },
  // 'link-cta': {
  //   designDefinitions: { variants: linkCtaVariants, states: UIAnchorControl.states },
  //   mapToCode: [
  //     ...mapAllVariantsToBemClasses('link-cta', linkCtaVariants),
  //     ...UIAnchorControl.states.map(s => ({
  //       name: s,
  //       getter: getAsStateModifierDemoClass,
  //       setter: setAsStateModifierDemoClass,
  //     })),
  //   ],
  // },
  headline: {
    designDefinitions: { variants: headlineVariants },
    mapToCode: mapAllVariantsToBemClasses('headline', headlineVariants),
  },
  image: {
    designDefinitions: { variants: imageVariants },
    mapToCode: mapAllVariantsToBemClasses('image', imageVariants),
  },
  list: {
    designDefinitions: { variants: listOrderedVariants },
    mapToCode: mapAllVariantsToBemClasses('list', listOrderedVariants),
  },
  // 'list-unordered': {
  //   designDefinitions: { variants: [] },
  //   mapToCode: [],
  // },
  paragraph: {
    designDefinitions: { variants: paragraphVariants },
    mapToCode: mapAllVariantsToBemClasses('paragraph', paragraphVariants),
  },
  table: {
    designDefinitions: { variants: tableVariants },
    mapToCode: mapAllVariantsToBemClasses('table', tableVariants),
  },
};

export const ingCssClasses = Object.keys(cssClassModifierInterfaceRegistry);
