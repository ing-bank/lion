[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Dashboard

```js script
export default {
  title: 'Tools/Providence/Dashboard',
};
```

An interactive overview of all aggregated [QueryResults]('./QueryResult.md') can be found in the dashboard.
The dashboard is a small nodejs server (based on es-dev-server + middleware) and a frontend
application.

## Run

Start the dashboard via `npm run dashboard` to automatically open the browser and start the dashboard.

## Interface

- Select all reference projects
- Select all target projects

Press `show table` to see the result based on the updated configuration.

### Generate csv

When `get csv` is pressed, a `.csv` will be downloaded that can be loaded into Excel.

## Analyzer support

Currently, only the `match-imports` is supported, more analyzers will be added in the future.
