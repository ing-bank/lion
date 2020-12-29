/**
 * @typedef {{modifiers: {}, positionFixed:boolean, placement:string }} Popper1Cfg
 * @typedef {import('@popperjs/core/lib/popper').Options} Popper2Cfg
 */

/**
 * @param {Popper1Cfg|Popper2Cfg} pCfg
 * @returns {boolean}
 */
function isPopper2Cfg(pCfg) {
  // @ts-ignore
  return Array.isArray(pCfg.modifiers) || pCfg.strategy || pCfg.onFirstUpdate || pCfg.afterWrite;
}

const methodMap = {
  onFirstUpdate: 'onCreate',
  afterWrite: 'onUpdate',
  update: 'scheduleUpdate', // but returns Promise
  forceUpdate: 'update',
};

/**
 * Converts from Popper1 config to Popper2 config
 * @param {Popper1Cfg} p1Cfg
 * @returns {Popper2Cfg}
 */
export function convertPopperConfig(p1Cfg) {
  if (isPopper2Cfg(p1Cfg)) {
    // @ts-ignore
    return p1Cfg;
  }
  const p2Cfg = /** @type {Popper2Cfg} */ ({});
  Object.keys(p1Cfg).forEach(option => {
    if (option === 'modifiers') {
      /** @type {object[]} */
      const modifiers = Object.keys(p1Cfg.modifiers).map(k => {
        const result = {};
        result.name = k;
        result.options = p1Cfg.modifiers[k];
        if ('enabled' in p1Cfg.modifiers[k]) {
          result.enabled = p1Cfg.modifiers[k].enabled;
          delete result.options.enabled;
        }
        if (typeof result.options.offset === 'string') {
          result.options.offset = result.options.offset
            .split(',')
            .map((/** @type {string} */ c) => Number(c.replace('px', '')) || 0);
        }
        return result;
      });
      p2Cfg[option] = modifiers;
    } else if (option === 'positionFixed') {
      p2Cfg.strategy = p1Cfg.positionFixed === true ? 'fixed' : 'absolute';
    } else if (option === 'scheduleUpdate') {
      // @ts-expect-error
      p2Cfg.update = async () => p1Cfg[option]();
    } else if (option in methodMap) {
      p2Cfg[methodMap[option]] = p1Cfg[option];
    } else {
      p2Cfg[option] = p1Cfg[option];
    }
  });
  return p2Cfg;
}
