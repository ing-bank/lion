export class AjaxFetchError extends Error {
  /**
   * @param {Request} request
   * @param {Response} response
   */
  constructor(request, response) {
    super(`Fetch request to ${request.url} failed.`);
    this.request = request;
    this.response = response;
  }
}
