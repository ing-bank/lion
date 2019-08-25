import { HttpClient } from './HttpClient.js';

export let http = new HttpClient(); // eslint-disable-line import/no-mutable-exports

/**
 * setHttp allows the Application Developer to override the globally used instance of {@link:http}.
 * All interactions with {@link:http} after the call to setHttp will use this new instance
 * (so make sure to call this method before dependant code using {@link:http} is ran and this
 * method is not called by any of your (indirect) dependencies.)
 * @param {HttpClient} newHttp the globally used instance of {@link:http}.
 */
export function setHttp(newHttp) {
  http = newHttp;
}
