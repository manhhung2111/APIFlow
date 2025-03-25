import nodemailer, {Transporter} from "nodemailer";
import * as process from "node:process";

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
                subject: `Here’s Your Password Reset Link`,
                html: `<p>Click the button below to reset your password:</p>
               <p><a href="http://localhost:3000/reset-password?token=${token}" style="display:inline-block;padding:10px 20px;color:white;background-color:#007bff;text-decoration:none;border-radius:5px;">Reset Password</a></p>
               <p>If you didn’t request this, you can ignore this email. This link will expire in 1 hour.</p>`,
            }

            await this._transporter.sendMail(mailOptions);
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}