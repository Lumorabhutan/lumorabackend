import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

export class MailService {
  private resend: Resend;

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set in environment variables");
    }
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  /**
   * Send an email
   * @param to - recipient email
   * @param subject - email subject
   * @param html - email HTML content
   * @param fromEmail - sender email (default: info@lumorabhutan.com)
   */
  async sendMail(
    to: string,
    subject: string,
    html: string,
    fromEmail : string 
  ) {
    try {
      const data = await this.resend.emails.send({
        from: `Lumora <${fromEmail}>`,
        to,
        subject,
        html,
      });

      console.log("✅ Email sent successfully", data);
      return data;
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      throw error;
    }
  }
}
