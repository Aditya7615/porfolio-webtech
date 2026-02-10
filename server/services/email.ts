import nodemailer from 'nodemailer';

// This will be initialized once the credentials are provided
let transporter: nodemailer.Transporter | null = null;

export interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Initializes the Nodemailer transporter using Gmail settings.
 * It pulls credentials directly from environment variables.
 */
export function initializeEmailService(): void {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn("Nodemailer credentials (EMAIL_USER/EMAIL_PASS) not provided. Email sending is disabled.");
    return;
  }
  
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass, // Use your 16-character Google App Password here
      },
    });
    console.log("Nodemailer email service initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Nodemailer service:", error);
  }
}

/**
 * Sends an email using the initialized Nodemailer transporter.
 */
export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!transporter) {
    console.warn("Email service not initialized. Cannot send email.");
    return false;
  }
  
  try {
    await transporter.sendMail({
      from: `"Aditya Portfolio" <${params.from}>`,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('Nodemailer sendMail error:', error);
    return false;
  }
}