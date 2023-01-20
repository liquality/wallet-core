"use strict";
const winston = require('winston');
const fs = require('fs');
const colorizer = winston.format.colorize();
winston.addColors({
    silly: 'magenta',
    debug: 'grey',
    verbose: 'cyan',
    info: 'green',
    warn: 'yellow',
    error: 'red',
});
const FORMATS = {
    json: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    console: winston.format.combine(winston.format.timestamp(), winston.format.splat(), winston.format.printf((msg) => colorizer.colorize(msg.level, `[${msg.timestamp}]-[${msg.level.toUpperCase()}]-[${msg.spec || 'App'}]: `) + msg.message)),
};
class WinstonLogger {
    constructor({ environment = 'development', logLevel = 'info', applicationName = 'App' }) {
        this.environment = environment;
        this.applicationName = applicationName;
        const currentDate = new Date().toISOString().toString().split('T')[0];
        const logFilePath = `./logs/app-${environment}-${currentDate}`;
        this.logFilePath = logFilePath;
        fs.mkdirSync(logFilePath, { recursive: true });
        this.loggerOptions = {
            file: {
                level: logLevel,
                handleExceptions: false,
                filename: `${logFilePath}/all.log`,
                format: FORMATS.console,
                maxsize: 5242880,
                maxFiles: 5,
                tailable: true,
            },
            console: {
                handleExceptions: false,
                level: logLevel,
                format: FORMATS.console,
            },
        };
        this.logger = this.createLogger();
    }
    createLogger(loggerName = 'app') {
        const logger = winston.createLogger({
            transports: [],
            exitOnError: false,
        });
        switch (this.environment) {
            case 'local': {
                logger.add(new winston.transports.Console(this.loggerOptions.console));
                break;
            }
            case 'test': {
                logger.add(new winston.transports.File(this.loggerOptions.file));
                break;
            }
            case 'development':
            case 'production': {
                logger.add(new winston.transports.File(Object.assign(Object.assign({}, this.loggerOptions.file), { level: 'warn', filename: `${this.logFilePath}/${loggerName}.error.log` })));
                logger.add(new winston.transports.File(Object.assign(Object.assign({}, this.loggerOptions.file), { level: 'verbose', filename: `${this.logFilePath}/${loggerName}.verbose.log` })));
                logger.add(new winston.transports.Console(this.loggerOptions.console));
                break;
            }
            default:
                break;
        }
        return logger;
    }
    getLogger(spec = '') {
        return this.logger.child({ spec });
    }
}
module.exports = WinstonLogger;
//# sourceMappingURL=winston-logger.js.map