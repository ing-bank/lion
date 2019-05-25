import { LionSingleton } from '@lion/core';

export class IconManager extends LionSingleton {
  constructor(params = {}) {
    super(params);

    this.__iconResolvers = new Map();
  }

  /**
   * Adds an icon resolver for the given namespace. An icon resolver is a
   * function which takes an collection and an icon name and returns an svg
   * icon as a string. This function can be sync or async.
   *
   * @param {string} namespace
   * @param {(collection: string, icon: string) => string | Promise<string>} iconResolver
   */
  addIconResolver(namespace, iconResolver) {
    if (this.__iconResolvers.has(namespace)) {
      throw new Error(`An icon resolver has already been registered for namespace: ${namespace}`);
    }
    this.__iconResolvers.set(namespace, iconResolver);
  }

  removeIconResolver(namespace) {
    this.__iconResolvers.delete(namespace);
  }

  /**
   * Resolves icon for the given parameters. Returns the icon as a svg string.
   *
   * @param {string} namespace
   * @param {string} collection
   * @param {string} icon
   * @returns {Promise<string>}
   */
  resolveIcon(namespace, collection, icon) {
    const resolver = this.__iconResolvers.get(namespace);
    if (resolver) {
      return resolver(collection, icon);
    }
    throw new Error(`Could not find any icon resolver for namespace ${namespace}.`);
  }

  /**
   * Resolves icon for the given icon id. Returns the icon as a svg string.
   *
   * @param {string} iconId
   * @returns {Promise<string>}
   */
  resolveIconForId(iconId) {
    const splitIconId = iconId.split(':');
    if (splitIconId.length !== 3) {
      throw new Error(`Incorrect iconId: ${iconId}. Format: <namespace>:<collection>:<icon>`);
    }

    return this.resolveIcon(...splitIconId);
  }
}
