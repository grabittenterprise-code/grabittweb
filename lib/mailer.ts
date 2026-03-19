import nodemailer, { Transporter } from "nodemailer";

import { env, hasSmtpConfig } from "@/lib/env";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!hasSmtpConfig) {
    return null;
  }

  transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendResetPasswordEmail(to: string, resetUrl: string): Promise<boolean> {
  const activeTransporter = getTransporter();
  if (!activeTransporter || !env.SMTP_FROM) {
    return false;
  }

  await activeTransporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "Reset your GRABITT password",
    text: `We received a request to reset your password.\n\nOpen this link to set a new password:\n${resetUrl}\n\nThis link expires in 30 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset your GRABITT password</h2>
        <p>We received a request to reset your password.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">
            Reset Password
          </a>
        </p>
        <p>If the button doesn't work, use this link:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link expires in 30 minutes.</p>
      </div>
    `,
  });

  return true;
}

export async function sendContactAutoReplyEmail(to: string, name: string): Promise<boolean> {
  const activeTransporter = getTransporter();
  if (!activeTransporter || !env.SMTP_FROM) {
    return false;
  }

  await activeTransporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "We received your message - GRABITT Support",
    text: `Hi ${name},\n\nThanks for contacting GRABITT. We have received your message and our team will get back to you soon.\n\nWarm regards,\nGRABITT Support`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hi ${name},</h2>
        <p>Thanks for contacting <strong>GRABITT</strong>.</p>
        <p>We have received your message and our team will get back to you soon.</p>
        <p style="margin-top: 20px;">Warm regards,<br />GRABITT Support</p>
      </div>
    `,
  });

  return true;
}

export async function sendAdminReplyEmail(params: {
  to: string;
  customerName: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const activeTransporter = getTransporter();
  if (!activeTransporter || !env.SMTP_FROM) {
    return false;
  }

  const { to, customerName, subject, message } = params;
  const htmlMessage = message
    .split(/\r?\n/)
    .map((line) => `<p style="margin:0 0 12px;">${line || "&nbsp;"}</p>`)
    .join("");

  await activeTransporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    text: `Hi ${customerName},\n\n${message}\n\nGRABITT Support`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hi ${customerName},</h2>
        ${htmlMessage}
        <p style="margin-top: 20px;">Warm regards,<br />GRABITT Support</p>
      </div>
    `,
  });

  return true;
}
