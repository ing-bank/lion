/**
 * @typedef {import('lit-html').TemplateResult} TemplateResult
 * @typedef {import('lit-html').nothing} nothing
 */

export class IconManager {
  constructor() {
    this.__iconResolvers = new Map();
  }

  /**
   * Adds an icon resolver for the given namespace. An icon resolver is a
   * function which takes an icon set and an icon name and returns an svg
   * icon as a TemplateResult. This function can be sync or async.
   *
   * @param {string} namespace
   * @param {(iconset: string, icon: string) => TemplateResult | Promise<TemplateResult> | nothing | Promise<nothing> } iconResolver
   */
  addIconResolver(namespace, iconResolver) {
    if (this.__iconResolvers.has(namespace)) {
      throw new Error(`An icon resolver has already been registered for namespace: ${namespace}`);
    }
    this.__iconResolvers.set(namespace, iconResolver);
  }

  /**
   * Removes an icon resolver for a namespace.
   * @param {string} namespace
   */
  removeIconResolver(namespace) {
    this.__iconResolvers.delete(namespace);
  }

  /**
   * Resolves icon for the given parameters. Returns the icon as a svg string.
   *
   * @param {string} namespace
   * @param {string} iconset
   * @param {string} icon
   * @returns {Promise<TemplateResult>}
   */
  resolveIcon(namespace, iconset, icon) {
    const resolver = this.__iconResolvers.get(namespace);
    if (resolver) {
      return resolver(iconset, icon);
    }
    throw new Error(`Could not find any icon resolver for namespace ${namespace}.`);
  }

  /**
   * Resolves icon for the given icon id. Returns the icon as a svg string.
   *
   * @param {string} iconId
   * @returns {Promise<TemplateResult>}
   */
  resolveIconForId(iconId) {
    const splitIconId = iconId.split(':');
    if (splitIconId.length !== 3) {
      throw new Error(`Incorrect iconId: ${iconId}. Format: <namespace>:<iconset>:<icon>`);
    }

    return this.resolveIcon(splitIconId[0], splitIconId[1], splitIconId[2]);
  }
}
