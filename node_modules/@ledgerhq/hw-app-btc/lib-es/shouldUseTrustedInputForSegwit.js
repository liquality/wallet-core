import semver from "semver";
export function shouldUseTrustedInputForSegwit(_a) {
    var version = _a.version, name = _a.name;
    if (name === "Decred")
        return false;
    if (name === "Exchange")
        return true;
    return semver.gte(version, "1.4.0");
}
//# sourceMappingURL=shouldUseTrustedInputForSegwit.js.map