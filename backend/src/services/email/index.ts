import nodemailer, {Transporter} from "nodemailer";
import * as process from "node:process";
import {PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE} from "@services/email/templates";

export default class EmailService {
    private static _transporter: Transporter;

    static {
        this._transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            }
        })
    }

    public static async sendForgetEmail(email: string, token: string) {
        try {
            const mailOptions = {
                from: `"APIFLOW" <manhhung2720@gmail.com>`,
                to: email,
                subject: `APIFlow - Reset your password`,
                html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", `http://localhost:3000/reset-password?token=${token}`),
            }

            await this._transporter.sendMail(mailOptions);
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    public static async sendVerificationEmail(email: string, token: string) {
        try {
            const mailOptions = {
                from: `"APIFLOW" <manhhung2720@gmail.com>`,
                to: email,
                subject: `APIFlow - Verify your email`,
                html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", token),
            }

            await this._transporter.sendMail(mailOptions);
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}