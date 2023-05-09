const { ReportService } = require('../src/program/core/ReportService.js');

/**
 * @typedef {import('../src/program/types/core').QueryResult} QueryResult
 */

const originalWriteToJson = ReportService.writeToJson;

/**
 * @param {QueryResult[]} queryResults
 */
function mockWriteToJson(queryResults) {
  ReportService.writeToJson = queryResult => {
    queryResults.push(queryResult);
  };
}

/**
 * @param {QueryResult[]} [queryResults]
 */
function restoreWriteToJson(queryResults) {
  ReportService.writeToJson = originalWriteToJson;
  while (queryResults?.length) {
    queryResults.pop();
  }
}

module.exports = {
  mockWriteToJson,
  restoreWriteToJson,
};
