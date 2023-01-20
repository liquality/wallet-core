export var IdentifyOperation;
(function (IdentifyOperation) {
    // Base Operations to set values
    IdentifyOperation["SET"] = "$set";
    IdentifyOperation["SET_ONCE"] = "$setOnce";
    // Operations around modifying existing values
    IdentifyOperation["ADD"] = "$add";
    IdentifyOperation["APPEND"] = "$append";
    IdentifyOperation["PREPEND"] = "$prepend";
    IdentifyOperation["REMOVE"] = "$remove";
    // Operations around appending values *if* they aren't present
    IdentifyOperation["PREINSERT"] = "$preInsert";
    IdentifyOperation["POSTINSERT"] = "$postInsert";
    // Operations around removing properties/values
    IdentifyOperation["UNSET"] = "$unset";
    IdentifyOperation["CLEAR_ALL"] = "$clearAll";
})(IdentifyOperation || (IdentifyOperation = {}));
//# sourceMappingURL=identify.js.map