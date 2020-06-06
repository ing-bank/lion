# Google Translate integration

```js script
export default {
  title: 'Localize/Google Translate Integration',
};
```

When Google Translate is enabled, it takes control of the html[lang] attribute.
Below, we find a simplified example that illustrates this.

## The problem

A developer initializes a page like this (and instructs localize to fetch data for `en-US` locale)

```html
<html lang="en-US"></html>
```

If Google Translate is enabled and set to French, it will change html[lang]:
to `<html lang="fr">`

Now `localize` will fetch data for locale `fr`. There are two problems here:

- There might be no available data for locale `fr`
- Let's imagine data were loaded for `fr`. If Google Translate is turned off again,
  the page content will consist of a combination of different locales.

## How to solve this

To trigger support for Google Translate, we need to configure two attributes

```html
<html lang="en-US" data-localize-lang="en-US"></html>
```

- html[data-localize-lang] will be read by `localize` and used for fetching data
- html[lang] will be configured for accessibility purposes (it will makes sure the
  page is accessible if localize would be lazy loaded).

When Google Translate is set to French, we get: `<html lang="fr" data-localize-lang="en-US">`

The page is accessible and `localize` will fetch the right resources
