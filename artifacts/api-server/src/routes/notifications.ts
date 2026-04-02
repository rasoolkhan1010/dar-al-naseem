import { Router, type Request, type Response } from "express";
import { logger } from "../lib/logger";

interface NotificationData {
  email: string;
  data: Record<string, any>;
}

const router = Router();

/**
 * Send email notification for quiz submission
 * Supports multiple email services
 */
router.post("/send-notification", async (req: Request, res: Response) => {
  try {
    const { email, data }: NotificationData = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email address is required" });
    }

    logger.info({ email }, "Email notification requested");

    const recipientEmail = "rasoolkhan990880@gmail.com";
    const senderEmail = process.env.SENDER_EMAIL || "noreply@daralnaseem.com";

    const emailContent = generateEmailContent(data);

    // OPTION 1: Using Resend (Recommended for serverless)
    if (process.env.RESEND_API_KEY) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: senderEmail,
            to: recipientEmail,
            cc: data.email,
            subject: `New Quiz Submission - ${data.userType || "Unknown"}`,
            html: emailContent,
          }),
        });

        if (!response.ok) {
          throw new Error(`Resend API error: ${response.statusText}`);
        }

        logger.info("Email sent via Resend");
        return res.json({ success: true, message: "Email sent successfully" });
      } catch (error) {
        logger.error(error, "Resend email failed");
      }
    }

    // OPTION 2: Using SendGrid
    if (process.env.SENDGRID_API_KEY) {
      try {
        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{ email: recipientEmail }],
                cc: [{ email: data.email }],
              },
            ],
            from: { email: senderEmail },
            subject: `New Quiz Submission - ${data.userType || "Unknown"}`,
            content: [
              {
                type: "text/html",
                value: emailContent,
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`SendGrid API error: ${response.statusText}`);
        }

        logger.info("Email sent via SendGrid");
        return res.json({ success: true, message: "Email sent successfully" });
      } catch (error) {
        logger.error(error, "SendGrid email failed");
      }
    }

    // OPTION 3: Using NodeMailer (for on-premise SMTP)
    if (process.env.SMTP_HOST) {
      try {
        const nodemailer = require("nodemailer");

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: senderEmail,
          to: recipientEmail,
          cc: data.email,
          subject: `New Quiz Submission - ${data.userType || "Unknown"}`,
          html: emailContent,
        });

        logger.info("Email sent via SMTP");
        return res.json({ success: true, message: "Email sent successfully" });
      } catch (error) {
        logger.error(error, "SMTP email failed");
      }
    }

    // If no email service is configured
    logger.warn("No email service configured");
    res.status(503).json({
      error: "Email service not configured",
      message: "Please set up RESEND_API_KEY, SENDGRID_API_KEY, or SMTP credentials",
    });
  } catch (error) {
    logger.error(error, "Error sending notification");
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Generate HTML email content from form data
 */
function generateEmailContent(data: Record<string, any>): string {
  const { userType, name, email, phone, looking, propertyType, budget, requirements, companyName, message } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
        .header { background: linear-gradient(135deg, #8a6d1e, #c9a84c); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; }
        .field { background: white; padding: 12px; margin: 8px 0; border-left: 4px solid #c9a84c; }
        .label { font-weight: bold; color: #8a6d1e; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Quiz Submission</h1>
          <p>DAN Dar Al Naseem - Lead Qualification</p>
        </div>

        <div class="field">
          <span class="label">Submission Time:</span>
          <div>${new Date().toLocaleString()}</div>
        </div>

        <div class="field">
          <span class="label">User Type:</span>
          <div>${userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : 'N/A'}</div>
        </div>

        ${name ? `<div class="field"><span class="label">Name:</span><div>${name}</div></div>` : ''}
        ${email ? `<div class="field"><span class="label">Email:</span><div>${email}</div></div>` : ''}
        ${phone ? `<div class="field"><span class="label">Phone:</span><div>${phone}</div></div>` : ''}

        ${looking ? `<div class="field"><span class="label">Looking For:</span><div>${looking.charAt(0).toUpperCase() + looking.slice(1)}</div></div>` : ''}
        ${propertyType ? `<div class="field"><span class="label">Property Type:</span><div>${propertyType}</div></div>` : ''}
        ${budget ? `<div class="field"><span class="label">Budget:</span><div>${budget}</div></div>` : ''}
        ${requirements ? `<div class="field"><span class="label">Requirements:</span><div>${requirements}</div></div>` : ''}
        ${companyName ? `<div class="field"><span class="label">Company Name:</span><div>${companyName}</div></div>` : ''}
        ${message ? `<div class="field"><span class="label">Message/Details:</span><div>${message.replace(/\n/g, '<br>')}</div></div>` : ''}

        <div class="footer">
          <p>This is an automated email from DAN Dar Al Naseem Lead Management System</p>
          <p>&copy; 2024 DAN Dar Al Naseem. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default router;
