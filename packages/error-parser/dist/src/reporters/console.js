"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportToConsole = void 0;
function reportToConsole(error) {
    console.error(prepareErrorForConsole(error));
}
exports.reportToConsole = reportToConsole;
function prepareErrorForConsole(error) {
    return `New Error From Error Parser \n
          ID: ${error.data.errorId} \n
          Name: ${error.name} \n
          Source: ${error.source} \n
          Developer Message: ${JSON.stringify(error.devMsg)} \n
          Raw Error: ${JSON.stringify(error.rawError)} \n
          Data: ${JSON.stringify(error.data)} \n
          Stack: ${error.stack} \n`;
}
//# sourceMappingURL=console.js.map