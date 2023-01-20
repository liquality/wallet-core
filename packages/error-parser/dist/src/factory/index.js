"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorParser = void 0;
const parserCache = {};
function createParser(errorParserType) {
    const parser = new errorParserType();
    parserCache[errorParserType.name] = parser;
    return parser;
}
function getErrorParser(errorParserType) {
    const cachedParser = parserCache[errorParserType.name];
    if (cachedParser) {
        return cachedParser;
    }
    return createParser(errorParserType);
}
exports.getErrorParser = getErrorParser;
//# sourceMappingURL=index.js.map