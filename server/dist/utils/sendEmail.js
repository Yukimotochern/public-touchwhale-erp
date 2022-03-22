"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    let nodemailer_option;
    if (process.env.NODE_ENV === 'test') {
        nodemailer_option = {
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: 'dce341f89ed7b7',
                pass: 'f46e4aa5f68a8e',
            },
        };
    }
    else {
        nodemailer_option = {
            host: process.env.SMTP_HOST,
            port: +process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        };
    }
    const mailer = nodemailer_1.default.createTransport(nodemailer_option);
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        text: options.message,
    };
    const mail = await mailer.sendMail(message);
    console.log('Message sent: %s', mail.response.bgBlue);
};
exports.sendEmail = sendEmail;
