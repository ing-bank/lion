# Troubleshooting for `api-extractor`

## `translations/bg` symbol has a `ts.SyntaxKind.SourceFile`

```js
export * from './dist-types/exports/progress-indicator.d.ts';
```

This import generated the error:

```
ERROR: Internal Error: The ""packages/ui/dist-types/components/progress-indicator/translations/bg"" symbol has a ts.SyntaxKind.SourceFile declaration which is not (yet?) supported by API Extractor
```

Troublshooting steps. Follow the `*.d.ts` file being imported (not `*.ts` one), comment out some portion of the file and then see if api generation
throws the erorr.

Example solution. For this particular export `export * from './dist-types/exports/progress-indicator.d.ts';` the solution was to add `...super.localizeNamespaces,` inside `packages/ui/components/progress-indicator/src/LionProgressIndicator.js` file.

## ERROR: Internal Error: Unable to follow symbol for "LitElement"

Reason. One of imported files in the line has a reference to `LitElement` but it does not imported in the file
