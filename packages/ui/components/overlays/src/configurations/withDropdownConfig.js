import { withPopoverConfig } from './withPopoverConfig.js';

export const withDropdownConfig = () =>
  withPopoverConfig({ horizontalFallback: false, placement: 'bottom-start' });
