export const /** @type {{ [index: string]: string | boolean | number; }} */ queryParams =
    document.location.search
      .slice(1)
      .split('&')
      .filter(s => s)
      .map(p => p.split('='))
      .reduce(
        (/** @type {{ [key: string]: string | boolean }} */ p, [k, v]) => (
          (p[k] = (() => {
            try {
              return JSON.parse(v);
            } catch {
              return v || true;
            }
          })()),
          p
        ),
        {},
      );
