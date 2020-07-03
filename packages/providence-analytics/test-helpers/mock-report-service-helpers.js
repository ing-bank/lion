const { ReportService } = require('../src/program/services/ReportService.js');

const originalWriteToJson = ReportService.writeToJson;

function mockWriteToJson(queryResults) {
  ReportService.writeToJson = queryResult => {
    queryResults.push(queryResult);
  };
}

function restoreWriteToJson(queryResults) {
  ReportService.writeToJson = originalWriteToJson;
  while (queryResults && queryResults.length) {
    queryResults.pop();
  }
}

module.exports = {
  mockWriteToJson,
  restoreWriteToJson,
};
