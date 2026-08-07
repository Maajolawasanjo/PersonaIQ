import asyncio
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Optional, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """Service for dispatching transactional email notifications via Gmail SMTP."""

    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.EMAILS_FROM_EMAIL or settings.SMTP_USER
        self.from_name = settings.EMAILS_FROM_NAME

    def _send_sync(self, to_email: str, subject: str, html_content: str) -> bool:
        """Synchronous SMTP sending logic."""
        if not self.smtp_user or not self.smtp_password:
            logger.warning("SMTP credentials not fully configured in environment. Email logged to console.")
            logger.info(f"--- EMAIL TO {to_email} ---\nSubject: {subject}\n{html_content[:200]}...")
            return False

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{self.from_name} <{self.from_email}>"
        msg["To"] = to_email

        html_part = MIMEText(html_content, "html")
        msg.attach(html_part)

        try:
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password.replace(" ", ""))
                server.sendmail(self.from_email, [to_email], msg.as_string())
            logger.info(f"Email successfully dispatched to {to_email} via Gmail SMTP.")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            raise e

    async def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Asynchronously dispatches an email using asyncio threadpool executor."""
        if not settings.ENABLE_EMAIL_NOTIFICATIONS:
            logger.info(f"Email notification suppressed (ENABLE_EMAIL_NOTIFICATIONS=false). Target: {to_email}")
            return False

        return await asyncio.to_thread(self._send_sync, to_email, subject, html_content)

    async def send_welcome_email(self, to_email: str, user_name: str) -> bool:
        subject = "Welcome to PersonaIQ | Executive Presence Engine"
        landing_url = "http://localhost:3000"
        
        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PersonaIQ</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif;">

  <div style="display: none; font-size: 1px; color: #f4f6f8; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Your PersonaIQ executive workspace is live. Access your Presence Engine and tailored action plans.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f8; padding: 30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="620" style="width: 620px; max-width: 620px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
          
          <tr>
            <td style="padding: 35px 35px 25px 35px; border-bottom: 1px solid #edf2f7; background-color: #ffffff;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left">
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: 0.5px; text-transform: uppercase;">
                      PERSONA<span style="color: #dc2626;">IQ</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 600; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">
                      Executive Portal
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 35px; background-color: #ffffff;">
              <h1 style="margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                Welcome to Your Executive Presence Workspace
              </h1>
              
              <p style="margin: 0 0 20px 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.5; color: #334155;">
                Hello {user_name},
              </p>
              
              <p style="margin: 0 0 24px 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.5; color: #334155;">
                Your account is verified and ready. PersonaIQ delivers data-driven visual intelligence, outfit alignment, and executive reasoning designed to elevate your professional presence prior to key events.
              </p>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 14px 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
                      Platform Capabilities Overview
                    </h2>
                    <ul style="margin: 0; padding-left: 18px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #475569;">
                      <li style="margin-bottom: 8px;"><strong>YouCam Skin Intelligence:</strong> Dermal radiance, texture, and hydration metrics.</li>
                      <li style="margin-bottom: 8px;"><strong>Apparel Virtual Try-On:</strong> Real-time outfit alignment and dress-code fit scoring.</li>
                      <li><strong>Featherless AI Reasoning:</strong> Customized strategic guidance and execution checklists.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="{landing_url}" target="_blank" style="display: inline-block; padding: 14px 36px; background-color: #dc2626; color: #ffffff; text-decoration: none; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 700; border-radius: 6px; text-align: center;">
                      Access Landing Page
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.5; color: #64748b; text-align: center;">
                Direct URL: <a href="{landing_url}" style="color: #dc2626; text-decoration: underline;">{landing_url}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 35px; background-color: #f8fafc; border-top: 1px solid #edf2f7; text-align: center;">
              <p style="margin: 0 0 8px 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 600; color: #475569;">
                PersonaIQ Technologies Inc. &bull; Executive Presence Engine
              </p>
              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #94a3b8;">
                You are receiving this communication regarding your registered account at {to_email}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>"""
        return await self.send_email(to_email, subject, html)

    async def send_2fa_code_email(self, to_email: str, code: str) -> bool:
        """Dispatches a security 2FA / OTP verification code email."""
        subject = f"{code} is your PersonaIQ Security Verification Code"
        landing_url = "http://localhost:3000"

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif;">

  <div style="display: none; font-size: 1px; color: #f4f6f8; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Your security code is {code}. Use this to verify your authentication attempt.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f8; padding: 30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="620" style="width: 620px; max-width: 620px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
          
          <tr>
            <td style="padding: 35px 35px 25px 35px; border-bottom: 1px solid #edf2f7; background-color: #ffffff;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left">
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: 0.5px; text-transform: uppercase;">
                      PERSONA<span style="color: #dc2626;">IQ</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 600; color: #dc2626; letter-spacing: 0.5px; text-transform: uppercase;">
                      Security Code
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 35px; background-color: #ffffff; text-align: center;">
              <h1 style="margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif; font-size: 22px; font-weight: 700; color: #0f172a;">
                Two-Factor Security Code
              </h1>
              
              <p style="margin: 0 0 24px 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.5; color: #334155;">
                Enter the following 6-digit code to complete your login or security verification. This code expires in 10 minutes.
              </p>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 18px 40px; background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px;">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #dc2626;">
                        {code}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.5; color: #64748b;">
                If you did not request this verification code, please secure your account immediately or contact support.
              </p>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="{landing_url}" target="_blank" style="display: inline-block; padding: 12px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 700; border-radius: 6px;">
                      Return to Landing Page
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 25px 35px; background-color: #f8fafc; border-top: 1px solid #edf2f7; text-align: center;">
              <p style="margin: 0 0 6px 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 600; color: #475569;">
                PersonaIQ Automated Authentication Protection
              </p>
              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #94a3b8;">
                Sent to {to_email} &bull; Do not share this verification code with anyone.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>"""
        return await self.send_email(to_email, subject, html)

    async def send_password_reset_email(self, to_email: str, reset_token: str) -> bool:
        """Dispatches a password reset request email."""
        subject = "Reset Your PersonaIQ Password"
        reset_url = f"http://localhost:3000/auth/reset-password?token={reset_token}"

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif;">

  <div style="display: none; font-size: 1px; color: #f4f6f8; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Password reset request received for your PersonaIQ account.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f8; padding: 30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="620" style="width: 620px; max-width: 620px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
          
          <tr>
            <td style="padding: 35px 35px 25px 35px; border-bottom: 1px solid #edf2f7; background-color: #ffffff;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left">
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: 0.5px; text-transform: uppercase;">
                      PERSONA<span style="color: #dc2626;">IQ</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 600; color: #dc2626; letter-spacing: 0.5px; text-transform: uppercase;">
                      Account Support
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 35px; background-color: #ffffff;">
              <h1 style="margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                Password Reset Request
              </h1>
              
              <p style="margin: 0 0 20px 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.5; color: #334155;">
                We received a request to reset the password associated with <strong>{to_email}</strong>.
              </p>
              
              <p style="margin: 0 0 28px 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.5; color: #334155;">
                Click the button below to choose a new password. For security reasons, this link will expire in 30 minutes.
              </p>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a href="{reset_url}" target="_blank" style="display: inline-block; padding: 14px 36px; background-color: #dc2626; color: #ffffff; text-decoration: none; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 700; border-radius: 6px; text-align: center;">
                      Reset Password Now
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.5; color: #64748b;">
                If you did not request a password reset, you can safely ignore this message. Your account password will remain unchanged.
              </p>

              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.5; color: #94a3b8; word-break: break-all;">
                Direct URL: <a href="{reset_url}" style="color: #dc2626; text-decoration: underline;">{reset_url}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 25px 35px; background-color: #f8fafc; border-top: 1px solid #edf2f7; text-align: center;">
              <p style="margin: 0 0 6px 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 600; color: #475569;">
                PersonaIQ Account Security Team
              </p>
              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #94a3b8;">
                This link is unique to your account and should not be shared.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>"""
        return await self.send_email(to_email, subject, html)

    async def send_journey_completion_email(
        self, to_email: str, user_name: str, event_title: str, presence_score: int
    ) -> bool:
        """Dispatches an executive summary email upon completing a Presence Journey."""
        subject = f"Your Presence Plan is Ready — {event_title} ({presence_score}/100)"
        dashboard_url = "http://localhost:3000/dashboard"

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Journey Completion Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif;">

  <div style="display: none; font-size: 1px; color: #f4f6f8; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Your Presence Index score for {event_title} is {presence_score}/100. Review your complete action plan.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f8; padding: 30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="620" style="width: 620px; max-width: 620px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
          
          <tr>
            <td style="padding: 35px 35px 25px 35px; border-bottom: 1px solid #edf2f7; background-color: #ffffff;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left">
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: 0.5px; text-transform: uppercase;">
                      PERSONA<span style="color: #dc2626;">IQ</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 600; color: #16a34a; letter-spacing: 0.5px; text-transform: uppercase;">
                      Journey Complete
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 35px; background-color: #ffffff;">
              <h1 style="margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                Executive Presence Plan Generated
              </h1>
              
              <p style="margin: 0 0 20px 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.5; color: #334155;">
                Hello {user_name},
              </p>
              
              <p style="margin: 0 0 24px 0; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.5; color: #334155;">
                Your presence journey for <strong>{event_title}</strong> has been calculated. Your tailored strategy combines dermal metric analysis, outfit alignment, and Featherless LLM execution steps.
              </p>

              <!-- Presence Score Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 28px; text-align: center;">
                <tr>
                  <td style="padding: 24px;">
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">
                      Presence Index Score
                    </span>
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size: 48px; font-weight: 800; color: #dc2626;">
                      {presence_score}<span style="font-size: 24px; font-weight: 600; color: #94a3b8;">/100</span>
                    </span>
                  </td>
                </tr>
              </table>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="{dashboard_url}" target="_blank" style="display: inline-block; padding: 14px 36px; background-color: #dc2626; color: #ffffff; text-decoration: none; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 700; border-radius: 6px; text-align: center;">
                      View Full Dashboard Plan
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.5; color: #64748b; text-align: center;">
                Direct URL: <a href="{dashboard_url}" style="color: #dc2626; text-decoration: underline;">{dashboard_url}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 25px 35px; background-color: #f8fafc; border-top: 1px solid #edf2f7; text-align: center;">
              <p style="margin: 0 0 6px 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 600; color: #475569;">
                PersonaIQ Technologies Inc. &bull; Executive Presence Engine
              </p>
              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #94a3b8;">
                Sent to {to_email} regarding event: {event_title}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>"""
        return await self.send_email(to_email, subject, html)
