# Node Tools >> Providence Analytics >> Dashboard ||30

An interactive overview of all aggregated [QueryResults](../../../fundamentals/node-tools/providence-analytics/QueryResult.md) can be found in the dashboard.
The dashboard is a small nodejs server (based on es-dev-server + middleware) and a frontend
application.

## Run

Start the dashboard via `providence dashboard` to automatically open the browser and start the dashboard.

## Interface

- Select all reference projects
- Select all target projects

### Generate csv

When `get csv` is pressed, a `.csv` will be downloaded that can be loaded into Excel.

## Analyzer support

Currently, `match-imports` and `match-subclasses` are supported, more analyzers will be added in the future.
