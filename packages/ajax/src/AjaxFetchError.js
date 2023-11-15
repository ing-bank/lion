export class AjaxFetchError extends Error {
  /**
   * @param {Request} request
   * @param {Response} response
   * @param {string|Object} [body]
   */
  constructor(request, response, body) {
    super(
      `Fetch request to ${request.url} failed with status ${response.status} ${response.statusText}`,
    );
    this.name = 'AjaxFetchError';
    this.request = request;
    this.response = response;
    this.body = body;
  }
}
