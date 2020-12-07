import { expect } from '@open-wc/testing';
import { isEqualConfig } from '../../src/utils/is-equal-config.js';

function TestConfig() {
  return {
    placementMode: 'local',
    hidesOnOutsideClick: true,
    popperConfig: {
      modifiers: {
        offset: {
          enabled: false,
        },
      },
    },
  };
}

/** Used for detecting if it's safe to disregard OverlayConfig changes with equal value. */
describe('isEqualConfig()', () => {
  it('returns true for same reference', () => {
    const config = TestConfig();
    expect(isEqualConfig(config, config)).eql(true);
  });

  it('compares shallow props', () => {
    const config = TestConfig();
    expect(isEqualConfig(config, { ...config })).eql(true);
    const differentConfig = { ...config, hidesOnOutsideClick: !config.hidesOnOutsideClick };
    expect(isEqualConfig(config, differentConfig)).eql(false);
  });

  it('compares prop count', () => {
    const config = TestConfig();
    expect(isEqualConfig(config, { ...config, extra: 'value' })).eql(false);
    expect(isEqualConfig({ ...config, extra: 'value' }, config)).eql(false);
  });

  it('regards missing props different from ones with undefined value', () => {
    const config = TestConfig();
    expect(isEqualConfig(config, { ...config, extra: undefined })).eql(false);
  });

  it('compares nested props', () => {
    const config = TestConfig();
    const sameConfig = {
      ...config,
      popperConfig: {
        ...config.popperConfig,
        modifiers: {
          ...config.popperConfig.modifiers,
          offset: {
            ...config.popperConfig.modifiers.offset,
          },
        },
      },
    };
    expect(isEqualConfig(config, sameConfig)).eql(true);
    const differentConfig = {
      ...config,
      popperConfig: {
        ...config.popperConfig,
        modifiers: {
          ...config.popperConfig.modifiers,
          offset: {
            enabled: !config.popperConfig.modifiers.offset.enabled,
          },
        },
      },
    };
    expect(isEqualConfig(config, differentConfig)).eql(false);
  });
});
