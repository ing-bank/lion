import { Ajax } from './Ajax.js';

export { Ajax } from './Ajax.js';
export { AjaxFetchError } from './AjaxFetchError.js';
export {
  acceptLanguageRequestInterceptor,
  createXsrfRequestInterceptor,
  createCacheInterceptors,
} from './interceptors/index.js';

// globally available instance
export const ajax = new Ajax();
