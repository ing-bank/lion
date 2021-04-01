# Localization Requirements

## Locale

In general we must have a locale prop that we can change on an application level. This needs to play nicely with third party tools.

- Global singleton that can be imported to get or set the locale (`en-GB` <--> `nl-NL`)
- Automatically loads language namespace when locale is changed
- Read from HTML lang attribute
- Use a different lang attribute if third party tools are changing the HTML lang attribute to not conflict with e.g. Google Translate

## Namespaces

Grouping translations is important if we dynamically import translation files.
For example, if you import a component which has maybe 2 translated values and you're in `en-GB`,
you don't want to load the entire bundle of translations for the whole app for `en-GB`, only those in the component.

Therefore, we introduce the concept of namespaces, so we can group them and consequently, treeshake them for production.

Namespaces should allow for ease of use, making it easy to load, edit, add to, delete, etc.

- Group by namespaces, for example group validation messages `validate:error.IsString`, so that we can scope the amount of translation files bundled e.g. per UI component
- Allow imperatively adding data to namespaces + locale
- Override already defined namespaces by loading it with the same name, useful when needing to override translations for a component, without extending the component. Maybe require to pass `override: true` or something to make it more conscious override decision instead of accidental.
- Edit namespace locales to import a different translation file `localize.editNamespace('my-component', 'en-GB', import('./assets/custom-translations/en.js'));`
- Edit namespace locales to import a different translation file but do so in a manner that reuses the original namespace, and just add to it. So maybe: `localize.addToNamespace('my-component', 'en-GB', import('./assets/custom-translations/en.js'));` which will act as a spread: `{ ...original, ...added }`

## Translations

Translations are probably best grouped by locale. We may also consider that for deduplication purposes, we can create a language file `en.js` and extend it in the locale file `en-GB`, because even if there are dialect differences, it will be minor overrides with mostly similarities.

- Dynamically load local translations files
- Dynamically load third-party translations files over HTTP
- Support HTML strings inside translations: `Welcome, <strong>Joe</strong>`
- Support base language with extension dialogs, preferably through `.js` as the primary input files because it makes the extension process easy.
- (Optional) Start with `en.js` but transform it to XLIFF format to send to translation agencies to add translations. Then we receive it back and transform it back to `.js`

## Component integration

We work mostly with Lit components, and quite often you will scope your translations to components using namespaces.
Therefore, a mixin around LitElement makes a lot of sense to control when the component needs to re-render (locale-change), etc. etc.

- Allow static method on component level that loads localization namespace for the component
- Change the localize namespace for a single component instance level `localize.changeNamespace(myElement, namespaceObj)`
- Control whether render is deferred by loading translations/namespace, to prevent content flash / change
- Allow locale changed hook
- Re-render after locale change (and if needed, wait for namespace load if it's a new locale)
