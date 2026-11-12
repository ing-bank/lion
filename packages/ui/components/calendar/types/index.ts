import { LionCalendar } from '../src/LionCalendar.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-calendar': LionCalendar;
  }
}

export * from './day.js';
export { LionCalendar };
