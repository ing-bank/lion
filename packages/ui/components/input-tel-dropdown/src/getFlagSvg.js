// getFlagSvg.js
import { flags } from '@lion/ui/input-tel.js';

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

const placeholder = flags.PLACEHOLDERFlag ? flags.PLACEHOLDERFlag : ``;

/**
 * Retrieve the SVG markup for the given region code's flag.
 * If the flag doesn't exist, a fallback is provided.
 *
 * @param {string} regionCode - The region code for the flag to retrieve.
 * @returns {TemplateResult | string} The SVG element or a placeholder/fallback string.
 */
export function getFlagSvg(regionCode) {
  // Construct the flag component name
  const flagName = `${regionCode}Flag`;

  // Access the specific flag using bracket notation
  const flagSvg = flags[flagName];

  if (flagSvg) {
    return flagSvg; // Assuming flagSvg is a TemplateResult from the flags import
  }
  console.error(`Flag not found for region code: ${regionCode}`);
  // Return a fallback, such as a generic placeholder SVG or an emoji
  // Here we return a placeholder span as an example
  return placeholder;
}
