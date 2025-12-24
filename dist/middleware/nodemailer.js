"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class MailService {
    resend;
    constructor() {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is not set in environment variables");
        }
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    }
    /**
     * Send an email
     * @param to - recipient email
     * @param subject - email subject
     * @param html - email HTML content
     * @param fromEmail - sender email (default: info@lumorabhutan.com)
     */
    async sendMail(to, subject, html, fromEmail = "info@lumorabhutan.com") {
        try {
            const data = await this.resend.emails.send({
                from: `Lumora <${fromEmail}>`,
                to,
                subject,
                html,
            });
            console.log("✅ Email sent successfully", data);
            return data;
        }
        catch (error) {
            console.error("❌ Failed to send email:", error);
            throw error;
        }
    }
}
exports.MailService = MailService;
//# sourceMappingURL=nodemailer.js.map