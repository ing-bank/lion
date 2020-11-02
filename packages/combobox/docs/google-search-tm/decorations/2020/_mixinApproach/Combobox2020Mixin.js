import { dedupeMixin } from '@lion/core';
import styles2020 from './2020.css.js';
import { GlobalDecorator } from '../../util/decorate.js';

const Combobox2020MixinImplementation = superclass =>
  class extends superclass {
    static get styles() {
      return [super.styles, styles2020];
    }
  };

export const Combobox2020Mixin = dedupeMixin(Combobox2020MixinImplementation);

GlobalDecorator.addMixins('google-search-tm', [Combobox2020Mixin]);
