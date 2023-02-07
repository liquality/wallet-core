"use strict";
const tslib_1 = require("tslib");
const nodemailer = require('nodemailer');
class Email {
    constructor({ host, port, username, password, from, defaultReceivers = [], defaultSubject = '' }, enabled) {
        this.enabled = enabled;
        this.isVerified = false;
        this.numberOfError = 0;
        this.from = from;
        this.defaultReceivers = defaultReceivers;
        this.defaultSubject = defaultSubject;
        const mailConfig = {
            host,
            port,
            tls: true,
            auth: {
                user: username,
                pass: password,
            },
        };
        this.nodemailerTransporter = nodemailer.createTransport(mailConfig);
    }
    verify() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.nodemailerTransporter.verify();
        });
    }
    sendMail(message, subject = this.defaultSubject, receivers = this.defaultReceivers) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.enabled) {
                    return {
                        status: false,
                        message: 'email is disabled',
                    };
                }
                if (!this.isVerified) {
                    yield this.verify();
                    this.isVerified = true;
                }
                let mailOptions = {
                    to: receivers,
                    subject,
                    html: message,
                };
                yield this.nodemailerTransporter.sendMail(Object.assign({ from: this.from }, mailOptions));
                this.numberOfError = 0;
                return {
                    status: false,
                    message: 'email has been sent',
                };
            }
            catch (error) {
                this.numberOfError += 1;
                if (this.numberOfError > 50)
                    this.enabled = false;
                return {
                    status: false,
                    message: 'email has been sent',
                };
            }
        });
    }
    sendSingleEmail(message, receiver, subject = this.defaultSubject) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.sendMail(message, subject, [receiver]);
        });
    }
    sendError(message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(message, 'Blockchain Error');
        });
    }
    sendNotification(message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(message, 'Blockchain Notification');
        });
    }
}
module.exports = Email;
//# sourceMappingURL=email.js.map