import lockerDb = require("./locker");
import lockerDbMethods = require("./locker/methods");
import teleporterDb = require("./teleporter");
import teleporterDbMethods = require("./teleporter/methods");
export namespace locker {
    export { lockerDb as db };
    export { lockerDbMethods as methods };
}
export namespace teleporter {
    export { teleporterDb as db };
    export { teleporterDbMethods as methods };
}
