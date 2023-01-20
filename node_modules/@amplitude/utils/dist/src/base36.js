Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBase36Id = exports.DEVICE_ID_LENGTH = void 0;
exports.DEVICE_ID_LENGTH = 25;
var BASE_36_CHARACTER_SET = 'abcdefghijklmnopqrstuvwxyz0123456789';
var BASE_36_RADIX = 36;
/** Generates a random sequence of base 36 characters to the specified length */
exports.generateBase36Id = function (idLength) {
    if (idLength === void 0) { idLength = exports.DEVICE_ID_LENGTH; }
    var stringBuilder = '';
    for (var idx = 0; idx < idLength; idx++) {
        var nextChar = BASE_36_CHARACTER_SET.charAt(Math.floor(Math.random() * BASE_36_RADIX));
        stringBuilder += nextChar;
    }
    return stringBuilder;
};
//# sourceMappingURL=base36.js.map