"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportToDiscord = void 0;
const tslib_1 = require("tslib");
const client_1 = require("@chainify/client");
const reportToDiscord = (error) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const messages = prepareErrorForDiscord(error);
    const htttpClient = new client_1.HttpClient({});
    messages.forEach((message) => {
        htttpClient
            .nodePost(`${process.env.VUE_APP_DISCORD_WEBHOOK}`, {
            content: message,
            username: 'Error Parser',
        })
            .catch(ignoreError);
    });
});
exports.reportToDiscord = reportToDiscord;
function ignoreError(e) {
    return e;
}
function prepareErrorForDiscord(error) {
    const header = `**New Error From Error Parser** \n
  ID: ${error.data.errorId} \n
  Name: ${error.name} \n
  Source: ${error.source} \n
  Developer Message: ${JSON.stringify(error.devMsg)} \n`;
    const footer = `Data: ${JSON.stringify(error.data)} \n
  Stack: ${error.stack} \n`;
    const DISCORD_CHARACTER_LIMIT = 1900;
    const maxLengthForRawError = DISCORD_CHARACTER_LIMIT - (header.length + footer.length);
    const rawErrorString = JSON.stringify(error.rawError);
    let start = 0;
    let end = maxLengthForRawError;
    const splittedRawError = [];
    if (rawErrorString.length > maxLengthForRawError) {
        while (start !== end) {
            splittedRawError.push(rawErrorString.substring(start, end));
            start = end;
            if (end + maxLengthForRawError > rawErrorString.length)
                end = rawErrorString.length;
            else
                end += maxLengthForRawError;
        }
    }
    if (splittedRawError.length === 0) {
        return [
            `${header}
        Raw Error: ${JSON.stringify(error.rawError)} \n
        ${footer}`,
        ];
    }
    else {
        const messages = [];
        splittedRawError.forEach((errorPart, index) => {
            messages.push(`
        ${header}
        Raw Error (${index + 1} of ${splittedRawError.length}): ${JSON.stringify(errorPart)} \n
        ${footer}`);
        });
        return messages;
    }
}
//# sourceMappingURL=discord.js.map