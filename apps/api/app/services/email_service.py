import asyncio
import logging
import os
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
        # When using Gmail SMTP, From address MUST match authenticated smtp_user to pass SPF and prevent bounces/rejections
        if "gmail" in (self.smtp_host or "").lower() and self.smtp_user:
            self.from_email = self.smtp_user
        else:
            self.from_email = settings.EMAILS_FROM_EMAIL or self.smtp_user
        self.from_name = settings.EMAILS_FROM_NAME

    def _load_template(self, template_name: str, context: Dict[str, Any], fallback_html: str) -> str:
        """Loads and formats a template file. Falls back to default HTML if file is missing."""
        current_dir = os.path.dirname(os.path.abspath(__file__))
        template_path = os.path.join(current_dir, "..", "templates", "emails", template_name)

        content = fallback_html
        try:
            if os.path.exists(template_path):
                with open(template_path, "r", encoding="utf-8") as f:
                    content = f.read()
            else:
                logger.warning(f"Email template file not found at {template_path}. Using fallback.")
        except Exception as e:
            logger.warning(f"Failed to load email template {template_name}: {e}. Using fallback.")

        # Replace placeholders in the form of {key}
        for key, value in context.items():
            content = content.replace(f"{{{key}}}", str(value))
        return content

    def _send_sync(self, to_email: str, subject: str, html_content: str) -> bool:
        """Synchronous SMTP sending logic."""
        if not self.smtp_user or not self.smtp_password:
            logger.warning("SMTP credentials not fully configured in environment. Email logged to console.")
            logger.info(f"--- EMAIL TO {to_email} ---\nSubject: {subject}\n{html_content[:200]}...")
            return False

        sender = self.smtp_user if "gmail" in (self.smtp_host or "").lower() else self.from_email

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{self.from_name} <{sender}>"
        msg["To"] = to_email

        html_part = MIMEText(html_content, "html")
        msg.attach(html_part)

        try:
            with smtplib.SMTP(self.smtp_host, self.smtp_port, timeout=10.0) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password.replace(" ", ""))
                server.sendmail(sender, [to_email], msg.as_string())
            logger.info(f"Email successfully dispatched to {to_email} via SMTP.")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return False

    async def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Asynchronously dispatches an email.

        Strict Environment Gate:
        Real SMTP / Provider API calls are ONLY executed when:
        1. ENVIRONMENT == 'production' (case-insensitive)
        2. ENABLE_EMAIL_NOTIFICATIONS == True
        3. CI environment variable is NOT 'true'

        In non-production environments (testing, development, dev, CI), real emails are
        completely suppressed and logged as mock operations.
        """
        is_testing = settings.ENVIRONMENT.lower() in ("testing", "test")
        is_ci = os.getenv("CI", "false").lower() == "true"
        notifications_enabled = settings.ENABLE_EMAIL_NOTIFICATIONS

        if is_testing or is_ci or not notifications_enabled:
            logger.info(
                f"[MOCK EMAIL DISPATCH] Environment: {settings.ENVIRONMENT} | CI: {is_ci} | Target: {to_email} | Subject: '{subject}'"
            )
            return True

        return await asyncio.to_thread(self._send_sync, to_email, subject, html_content)

    def dispatch(
        self,
        background_tasks: Optional[Any],
        coro_func: Any,
        *args: Any,
        **kwargs: Any
    ) -> None:
        """Dispatches an email task using FastAPI BackgroundTasks if provided, or asyncio task as fallback.

        Guarantees that email execution runs AFTER the HTTP response returns to the client.
        In non-production environments, the task safely logs the mock email without network calls.
        """
        if background_tasks is not None and hasattr(background_tasks, "add_task"):
            background_tasks.add_task(coro_func, *args, **kwargs)
        else:
            async def _run():
                try:
                    await coro_func(*args, **kwargs)
                except Exception as e:
                    logger.error(f"[EmailService.dispatch] Background task failed: {e}", exc_info=True)

            try:
                loop = asyncio.get_running_loop()
                loop.create_task(_run())
            except RuntimeError:
                logger.warning("[EmailService.dispatch] No running event loop. Email task skipped.")

    # 1. Welcome Email
    async def send_welcome_email(self, to_email: str, user_name: str) -> bool:
        subject = "Welcome to PersonaIQ | Executive Presence Engine"
        landing_url = "http://localhost:3000"
        
        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to PersonaIQ</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0;">
    <h2>Welcome to PersonaIQ, {user_name}!</h2>
    <p>Your account is verified and ready. PersonaIQ delivers data-driven visual intelligence to elevate your professional presence.</p>
    <a href="{landing_url}" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 4px;">Get Started</a>
  </div>
</body>
</html>"""
        context = {"user_name": user_name, "landing_url": landing_url}
        html = self._load_template("welcome.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 2. Email Verification / OTP Code
    async def send_email_verification_email(self, to_email: str, code: str) -> bool:
        subject = f"{code} is your PersonaIQ Verification Code"
        landing_url = "http://localhost:3000"

        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
    <h2>Verify Your Email</h2>
    <p>Please use the verification code below to activate your account:</p>
    <div style="font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 4px; margin: 20px 0;">{code}</div>
    <p>This code is valid for 10 minutes.</p>
  </div>
</body>
</html>"""
        context = {"code": code, "landing_url": landing_url}
        html = self._load_template("email-verification.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # Alias to keep compatibility with existing code
    async def send_2fa_code_email(self, to_email: str, code: str) -> bool:
        return await self.send_two_factor_code_email(to_email, code)

    # 2b. Two-Factor Authentication Code (dedicated template)
    async def send_two_factor_code_email(self, to_email: str, code: str) -> bool:
        subject = f"PersonaIQ Sign-In Code: {code}"
        support_url = "https://personaiq.com/support"
        fallback_html = f"<p>Your PersonaIQ 2FA code is <strong>{code}</strong>. It expires in 10 minutes. Do not share it.</p>"
        context = {"code": code, "support_url": support_url}
        html = self._load_template("two-factor-code.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 3. Verify New Email Address
    async def send_verify_new_email(self, to_email: str, code: str, new_email: str) -> bool:
        subject = "Confirm Your New Email Address - PersonaIQ"
        
        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Confirm Your New Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
    <h2>Confirm Your New Email</h2>
    <p>We received a request to change your PersonaIQ email address to <strong>{new_email}</strong>.</p>
    <p>Please use this confirmation code to finalize the change:</p>
    <div style="font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 4px; margin: 20px 0;">{code}</div>
  </div>
</body>
</html>"""
        context = {"code": code, "new_email": new_email}
        html = self._load_template("verify-new-email.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 4. Password Reset Request
    async def send_password_reset_email(self, to_email: str, reset_token: str) -> bool:
        subject = "Reset Your PersonaIQ Password"
        reset_url = f"http://localhost:3000/auth/reset-password?token={reset_token}"

        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0;">
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password. Click the button below to set a new password:</p>
    <a href="{reset_url}" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 4px; margin: 20px 0;">Reset Password</a>
    <p>If you did not request this, you can safely ignore this email.</p>
  </div>
</body>
</html>"""
        context = {"reset_url": reset_url}
        html = self._load_template("password-reset.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 5. Password Successfully Changed
    async def send_password_changed_email(self, to_email: str, user_name: str) -> bool:
        subject = "Your PersonaIQ Password Has Been Updated"
        support_email = "support@personaiq.com"

        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Password Changed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0;">
    <h2>Password Updated Successfully</h2>
    <p>Hello {user_name},</p>
    <p>The password for your PersonaIQ account was successfully changed. If you did not initiate this request, please contact support immediately at {support_email}.</p>
  </div>
</body>
</html>"""
        context = {"user_name": user_name, "support_email": support_email}
        html = self._load_template("password-changed.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 6. Login Alert
    async def send_login_alert_email(self, to_email: str, user_name: str, device: str, location: str, time: str) -> bool:
        subject = "Security Alert: New Login to PersonaIQ"
        support_email = "support@personaiq.com"

        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Login Detected</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0;">
    <h2>New Login Alert</h2>
    <p>Hello {user_name},</p>
    <p>We detected a new login to your account with the following details:</p>
    <ul>
      <li><strong>Device:</strong> {device}</li>
      <li><strong>Location:</strong> {location}</li>
      <li><strong>Time:</strong> {time}</li>
    </ul>
    <p>If this was not you, please contact support immediately at {support_email}.</p>
  </div>
</body>
</html>"""
        context = {
            "user_name": user_name,
            "device": device,
            "location": location,
            "time": time,
            "support_email": support_email
        }
        html = self._load_template("login-alert.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 7. Analysis Started
    async def send_analysis_started_email(self, to_email: str, user_name: str, event_title: str) -> bool:
        subject = f"Analysis Started: {event_title} — PersonaIQ"

        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Analysis Started</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
    <h2>Analysis In Progress</h2>
    <p>Hello {user_name},</p>
    <p>We have successfully received your visual uploads and event details for <strong>{event_title}</strong>. Our multimodal AI is analyzing your inputs now.</p>
    <p>We will email you as soon as your report is generated!</p>
  </div>
</body>
</html>"""
        context = {"user_name": user_name, "event_title": event_title}
        html = self._load_template("analysis-started.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 8. Presence Analysis Ready
    async def send_analysis_ready_email(
        self, to_email: str, user_name: str, event_title: str, presence_score: int, dashboard_url: str
    ) -> bool:
        subject = f"Your Presence Plan is Ready — {event_title} ({presence_score}/100)"

        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Analysis Ready</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
    <h2>Your Presence Plan is Ready!</h2>
    <p>Hello {user_name},</p>
    <p>The Presence Index score for <strong>{event_title}</strong> is:</p>
    <div style="font-size: 48px; font-weight: bold; color: #dc2626; margin: 20px 0;">{presence_score}/100</div>
    <a href="{dashboard_url}" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 4px;">View Report</a>
  </div>
</body>
</html>"""
        context = {
            "user_name": user_name,
            "event_title": event_title,
            "presence_score": presence_score,
            "dashboard_url": dashboard_url
        }
        html = self._load_template("analysis-ready.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # Alias to keep compatibility with existing code
    async def send_journey_completion_email(
        self, to_email: str, user_name: str, event_title: str, presence_score: int
    ) -> bool:
        dashboard_url = "http://localhost:3000/dashboard"
        return await self.send_analysis_ready_email(to_email, user_name, event_title, presence_score, dashboard_url)

    # 9. Journey Reminder
    async def send_journey_reminder_email(
        self, to_email: str, user_name: str, event_title: str, days_remaining: str, dashboard_url: str
    ) -> bool:
        subject = f"Reminder: Your Event {event_title} is in {days_remaining}"

        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Event Reminder</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
    <h2>Prepare for {event_title}</h2>
    <p>Hello {user_name},</p>
    <p>Your event is coming up in <strong>{days_remaining}</strong>. Review your presence strategy details now.</p>
    <a href="{dashboard_url}" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 4px;">View Strategy Checklist</a>
  </div>
</body>
</html>"""
        context = {
            "user_name": user_name,
            "event_title": event_title,
            "days_remaining": days_remaining,
            "dashboard_url": dashboard_url
        }
        html = self._load_template("journey-reminder.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 10. Subscription Activated
    async def send_subscription_activated_email(
        self, to_email: str, user_name: str, plan_name: str, billing_cycle: str, amount: str
    ) -> bool:
        subject = "Subscription Activated: Welcome to PersonaIQ Premium"

        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Subscription Activated</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0;">
    <h2>Subscription Activated</h2>
    <p>Hello {user_name},</p>
    <p>Thank you for choosing PersonaIQ. Your subscription is now active.</p>
    <ul>
      <li><strong>Plan:</strong> {plan_name}</li>
      <li><strong>Cycle:</strong> {billing_cycle}</li>
      <li><strong>Amount:</strong> {amount}</li>
    </ul>
  </div>
</body>
</html>"""
        context = {
            "user_name": user_name,
            "plan_name": plan_name,
            "billing_cycle": billing_cycle,
            "amount": amount
        }
        html = self._load_template("subscription-activated.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 11. Payment Receipt
    async def send_payment_receipt_email(
        self, to_email: str, user_name: str, invoice_id: str, amount: str, payment_method: str, receipt_url: str
    ) -> bool:
        subject = f"PersonaIQ Payment Receipt for Invoice {invoice_id}"

        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment Receipt</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0;">
    <h2>Payment Receipt</h2>
    <p>Hello {user_name},</p>
    <p>Thank you for your payment. Details:</p>
    <ul>
      <li><strong>Invoice ID:</strong> {invoice_id}</li>
      <li><strong>Amount:</strong> {amount}</li>
      <li><strong>Method:</strong> {payment_method}</li>
    </ul>
    <a href="{receipt_url}" style="display: inline-block; padding: 10px 20px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 4px;">Download Receipt PDF</a>
  </div>
</body>
</html>"""
        context = {
            "user_name": user_name,
            "invoice_id": invoice_id,
            "amount": amount,
            "payment_method": payment_method,
            "receipt_url": receipt_url
        }
        html = self._load_template("payment-receipt.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 12. Payment Failed
    async def send_payment_failed_email(self, to_email: str, user_name: str, amount: str, update_billing_url: str) -> bool:
        subject = "Action Required: Payment Failed for PersonaIQ"

        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment Failed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
    <h2>Payment Failed</h2>
    <p>Hello {user_name},</p>
    <p>We were unable to process your subscription payment of {amount}. Please update your billing details below to keep service active.</p>
    <a href="{update_billing_url}" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 4px; margin: 20px 0;">Update Billing Details</a>
  </div>
</body>
</html>"""
        context = {
            "user_name": user_name,
            "amount": amount,
            "update_billing_url": update_billing_url
        }
        html = self._load_template("payment-failed.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 13. Subscription Cancelled
    async def send_subscription_cancelled_email(self, to_email: str, user_name: str, end_date: str, reactivate_url: str) -> bool:
        subject = "Subscription Cancelled Confirmation — PersonaIQ"

        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Subscription Cancelled</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0;">
    <h2>Subscription Cancelled</h2>
    <p>Hello {user_name},</p>
    <p>Your subscription has been cancelled. You will continue to have access to premium features until <strong>{end_date}</strong>.</p>
    <a href="{reactivate_url}" style="display: inline-block; padding: 10px 20px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 4px;">Reactivate Subscription</a>
  </div>
</body>
</html>"""
        context = {
            "user_name": user_name,
            "end_date": end_date,
            "reactivate_url": reactivate_url
        }
        html = self._load_template("subscription-cancelled.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 14. Trial Ending Soon
    async def send_trial_ending_email(self, to_email: str, user_name: str, days_remaining: int, subscribe_url: str) -> bool:
        subject = f"Your PersonaIQ Premium Trial Ends in {days_remaining} Days"

        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Trial Ending Soon</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
    <h2>Trial Ending Soon</h2>
    <p>Hello {user_name},</p>
    <p>Your premium trial of PersonaIQ ends in <strong>{days_remaining} days</strong>. Upgrade today to preserve access:</p>
    <a href="{subscribe_url}" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 4px; margin: 20px 0;">Select a Plan</a>
  </div>
</body>
</html>"""
        context = {
            "user_name": user_name,
            "days_remaining": days_remaining,
            "subscribe_url": subscribe_url
        }
        html = self._load_template("trial-ending.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 15. Contact Support Confirmation
    async def send_support_confirmation_email(self, to_email: str, user_name: str, ticket_id: str, message_summary: str) -> bool:
        subject = f"Support Request Received [Ticket #{ticket_id}]"

        fallback_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Support Request Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: sans-serif;">
  <div style="padding: 40px; background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; border: 1px solid #e2e8f0;">
    <h2>We Received Your Support Request</h2>
    <p>Hello {user_name},</p>
    <p>This is to confirm we received your support request. Details:</p>
    <ul>
      <li><strong>Ticket ID:</strong> #{ticket_id}</li>
      <li><strong>Summary:</strong> "{message_summary}"</li>
    </ul>
    <p>Our team will get back to you within 24 hours.</p>
  </div>
</body>
</html>"""
        context = {
            "user_name": user_name,
            "ticket_id": ticket_id,
            "message_summary": message_summary
        }
        html = self._load_template("support-confirmation.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 16. Account Deleted
    async def send_account_deleted_email(self, to_email: str, user_name: str, support_url: str) -> bool:
        subject = "Your PersonaIQ Account Has Been Deleted"
        fallback_html = f"<p>Hello {user_name}, your account has been permanently deleted. Contact support if this was a mistake.</p>"
        context = {"user_name": user_name, "support_url": support_url}
        html = self._load_template("account-deleted.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 17. Subscription Upgraded
    async def send_subscription_upgraded_email(
        self, to_email: str, user_name: str, old_plan: str, new_plan: str,
        billing_cycle: str, amount: str, next_renewal_date: str, dashboard_url: str
    ) -> bool:
        subject = f"You've Upgraded to {new_plan} — PersonaIQ"
        fallback_html = f"<p>Hello {user_name}, your plan has been upgraded from {old_plan} to {new_plan}.</p>"
        context = {
            "user_name": user_name,
            "old_plan": old_plan,
            "new_plan": new_plan,
            "billing_cycle": billing_cycle,
            "amount": amount,
            "next_renewal_date": next_renewal_date,
            "dashboard_url": dashboard_url,
        }
        html = self._load_template("subscription-upgraded.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 18. Subscription Downgraded
    async def send_subscription_downgraded_email(
        self, to_email: str, user_name: str, old_plan: str, new_plan: str,
        effective_date: str, amount: str, billing_cycle: str, upgrade_url: str
    ) -> bool:
        subject = f"Your PersonaIQ Plan Has Been Changed to {new_plan}"
        fallback_html = f"<p>Hello {user_name}, your plan has been downgraded from {old_plan} to {new_plan}, effective {effective_date}.</p>"
        context = {
            "user_name": user_name,
            "old_plan": old_plan,
            "new_plan": new_plan,
            "effective_date": effective_date,
            "amount": amount,
            "billing_cycle": billing_cycle,
            "upgrade_url": upgrade_url,
        }
        html = self._load_template("subscription-downgraded.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 19. Trial Started
    async def send_trial_started_email(
        self, to_email: str, user_name: str, plan_name: str, trial_days: int,
        trial_end_date: str, dashboard_url: str
    ) -> bool:
        subject = f"Your {trial_days}-Day Free Trial of PersonaIQ Has Started"
        fallback_html = f"<p>Hello {user_name}, your {trial_days}-day trial of {plan_name} is now active. It ends on {trial_end_date}.</p>"
        context = {
            "user_name": user_name,
            "plan_name": plan_name,
            "trial_days": trial_days,
            "trial_end_date": trial_end_date,
            "dashboard_url": dashboard_url,
        }
        html = self._load_template("trial-started.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 20. Invoice Upcoming
    async def send_invoice_upcoming_email(
        self, to_email: str, user_name: str, plan_name: str, amount: str,
        charge_date: str, payment_method: str, billing_url: str
    ) -> bool:
        subject = f"Upcoming Invoice: {amount} on {charge_date} — PersonaIQ"
        fallback_html = f"<p>Hello {user_name}, your next invoice of {amount} for {plan_name} will be charged on {charge_date}.</p>"
        context = {
            "user_name": user_name,
            "plan_name": plan_name,
            "amount": amount,
            "charge_date": charge_date,
            "payment_method": payment_method,
            "billing_url": billing_url,
        }
        html = self._load_template("invoice-upcoming.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 21. Payment Method Updated
    async def send_payment_method_updated_email(
        self, to_email: str, user_name: str, card_brand: str,
        card_last4: str, updated_at: str, support_url: str
    ) -> bool:
        subject = "Payment Method Updated — PersonaIQ"
        fallback_html = f"<p>Hello {user_name}, your payment method has been updated to {card_brand} ending in {card_last4}.</p>"
        context = {
            "user_name": user_name,
            "card_brand": card_brand,
            "card_last4": card_last4,
            "updated_at": updated_at,
            "support_url": support_url,
        }
        html = self._load_template("payment-method-updated.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 22. Data Export Ready
    async def send_data_export_ready_email(
        self, to_email: str, user_name: str, requested_at: str,
        expires_at: str, download_url: str
    ) -> bool:
        subject = "Your PersonaIQ Data Export Is Ready"
        fallback_html = f"<p>Hello {user_name}, your data export is ready. Download it before {expires_at}.</p>"
        context = {
            "user_name": user_name,
            "requested_at": requested_at,
            "expires_at": expires_at,
            "download_url": download_url,
        }
        html = self._load_template("data-export-ready.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 23. Reactivation (Win-back)
    async def send_reactivation_email(self, to_email: str, user_name: str, reactivate_url: str) -> bool:
        subject = "We Miss You — Come Back to PersonaIQ"
        fallback_html = f"<p>Hello {user_name}, we'd love to have you back. Reactivate your account here: {reactivate_url}</p>"
        context = {"user_name": user_name, "reactivate_url": reactivate_url}
        html = self._load_template("reactivation.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 24. Inactivity Nudge
    async def send_inactivity_nudge_email(
        self, to_email: str, user_name: str, days_inactive: int,
        last_analysis_name: str, pending_journeys: int,
        dashboard_url: str, unsubscribe_url: str
    ) -> bool:
        subject = f"It's Been {days_inactive} Days — Your PersonaIQ Journey Awaits"
        fallback_html = f"<p>Hello {user_name}, you haven't visited PersonaIQ in {days_inactive} days. Come back and continue!</p>"
        context = {
            "user_name": user_name,
            "days_inactive": days_inactive,
            "last_analysis_name": last_analysis_name,
            "pending_journeys": pending_journeys,
            "dashboard_url": dashboard_url,
            "unsubscribe_url": unsubscribe_url,
        }
        html = self._load_template("inactivity-nudge.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 25. Referral Invite
    async def send_referral_invite_email(
        self, to_email: str, referrer_name: str, referral_code: str,
        referral_reward: str, referral_url: str
    ) -> bool:
        subject = f"{referrer_name} Invited You to PersonaIQ"
        fallback_html = f"<p>{referrer_name} has invited you to PersonaIQ. Use code {referral_code} for {referral_reward} off.</p>"
        context = {
            "referrer_name": referrer_name,
            "referral_code": referral_code,
            "referral_reward": referral_reward,
            "referral_url": referral_url,
        }
        html = self._load_template("referral-invite.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)

    # 26. Feedback Request
    async def send_feedback_request_email(
        self, to_email: str, user_name: str, analysis_name: str,
        rating_url_1: str, rating_url_2: str, rating_url_3: str,
        rating_url_4: str, rating_url_5: str,
        feedback_url: str, unsubscribe_url: str
    ) -> bool:
        subject = f"How Was Your PersonaIQ Analysis? — {analysis_name}"
        fallback_html = f"<p>Hello {user_name}, we'd love your feedback on your {analysis_name} analysis.</p>"
        context = {
            "user_name": user_name,
            "analysis_name": analysis_name,
            "rating_url_1": rating_url_1,
            "rating_url_2": rating_url_2,
            "rating_url_3": rating_url_3,
            "rating_url_4": rating_url_4,
            "rating_url_5": rating_url_5,
            "feedback_url": feedback_url,
            "unsubscribe_url": unsubscribe_url,
        }
        html = self._load_template("feedback-request.html", context, fallback_html)
        return await self.send_email(to_email, subject, html)
