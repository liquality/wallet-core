"use strict";
exports.__esModule = true;
exports.displayTransactionDebug = exports.formatTransactionDebug = void 0;
function formatTransactionDebug(transaction) {
    var str = "TX";
    str += " version " + transaction.version.toString("hex");
    if (transaction.locktime) {
        str += " locktime " + transaction.locktime.toString("hex");
    }
    if (transaction.witness) {
        str += " witness " + transaction.witness.toString("hex");
    }
    if (transaction.timestamp) {
        str += " timestamp " + transaction.timestamp.toString("hex");
    }
    if (transaction.nVersionGroupId) {
        str += " nVersionGroupId " + transaction.nVersionGroupId.toString("hex");
    }
    if (transaction.nExpiryHeight) {
        str += " nExpiryHeight " + transaction.nExpiryHeight.toString("hex");
    }
    if (transaction.extraData) {
        str += " extraData " + transaction.extraData.toString("hex");
    }
    transaction.inputs.forEach(function (_a, i) {
        var prevout = _a.prevout, script = _a.script, sequence = _a.sequence;
        str += "\ninput ".concat(i, ":");
        str += " prevout ".concat(prevout.toString("hex"));
        str += " script ".concat(script.toString("hex"));
        str += " sequence ".concat(sequence.toString("hex"));
    });
    (transaction.outputs || []).forEach(function (_a, i) {
        var amount = _a.amount, script = _a.script;
        str += "\noutput ".concat(i, ":");
        str += " amount ".concat(amount.toString("hex"));
        str += " script ".concat(script.toString("hex"));
    });
    return str;
}
exports.formatTransactionDebug = formatTransactionDebug;
function displayTransactionDebug(transaction) {
    console.log(formatTransactionDebug(transaction));
}
exports.displayTransactionDebug = displayTransactionDebug;
//# sourceMappingURL=debug.js.map