import nodemailer from 'nodemailer';
import { config } from '@/config/app';
import { logger } from '@/utils/logger';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.port === 465,
      auth: {
        user: config.email.smtp.user,
        pass: config.email.smtp.password,
      },
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error('Email service initialization failed:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `${config.email.fromName} <${config.email.from}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully:', { messageId: info.messageId, to: options.to });
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string, firstName: string): Promise<boolean> {
    const resetUrl = `${config.frontendUrl || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset Request</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4F46E5;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
            .warning {
              background-color: #FEF3C7;
              border: 1px solid #F59E0B;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MemberPort</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello ${firstName},</p>
            <p>We received a request to reset your password for your MemberPort account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Your Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #e5e7eb; padding: 10px; border-radius: 4px;">
              ${resetUrl}
            </p>
            
            <div class="warning">
              <strong>Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour for security reasons</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Your password will remain unchanged until you create a new one</li>
              </ul>
            </div>
            
            <p>If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
            
            <p>Best regards,<br>
            The MemberPort Team</p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
            <p>&copy; 2024 MemberPort. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Password Reset Request
      
      Hello ${firstName},
      
      We received a request to reset your password for your MemberPort account.
      
      Please click the following link to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request this password reset, please ignore this email.
      
      Best regards,
      The MemberPort Team
    `;

    return this.sendEmail({
      to: email,
      subject: 'Password Reset Request - MemberPort',
      html,
      text,
    });
  }

  async sendPasswordResetConfirmation(email: string, firstName: string): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset Successful</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #10B981;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .success {
              background-color: #D1FAE5;
              border: 1px solid #10B981;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MemberPort</h1>
          </div>
          <div class="content">
            <h2>Password Reset Successful</h2>
            <p>Hello ${firstName},</p>
            
            <div class="success">
              <strong>✓ Success!</strong> Your password has been successfully reset.
            </div>
            
            <p>Your MemberPort account password has been changed successfully. You can now log in with your new password.</p>
            
            <p>If you did not make this change, please contact our support team immediately.</p>
            
            <p>For security reasons, we recommend:</p>
            <ul>
              <li>Using a strong, unique password</li>
              <li>Not sharing your password with anyone</li>
              <li>Logging out of shared devices</li>
            </ul>
            
            <p>Best regards,<br>
            The MemberPort Team</p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
            <p>&copy; 2024 MemberPort. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Password Reset Successful
      
      Hello ${firstName},
      
      Your MemberPort account password has been changed successfully.
      You can now log in with your new password.
      
      If you did not make this change, please contact our support team immediately.
      
      Best regards,
      The MemberPort Team
    `;

    return this.sendEmail({
      to: email,
      subject: 'Password Reset Successful - MemberPort',
      html,
      text,
    });
  }
}

export const emailService = new EmailService();
