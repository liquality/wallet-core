"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCSVContent = void 0;
const getCSVContent = (data, headers) => {
    if (!data == null || !data.length) {
        return null;
    }
    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    let result = `${headers.map((h) => h.label).join(columnDelimiter)}${lineDelimiter}`;
    data.forEach((item) => {
        let ctr = 0;
        headers.forEach((header) => {
            if (ctr > 0)
                result += columnDelimiter;
            result += item[header.key];
            ctr++;
        });
        result += lineDelimiter;
    });
    return result;
};
exports.getCSVContent = getCSVContent;
//# sourceMappingURL=export.js.map