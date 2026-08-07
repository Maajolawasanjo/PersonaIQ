import pytest
from unittest.mock import MagicMock, patch
from app.services.email_service import EmailService


@pytest.mark.asyncio
async def test_email_service_sends_all_templates():
    # Arrange
    email_service = EmailService()
    to_email = "test@example.com"
    user_name = "Alex Mercer"

    # Mock the SMTP connection
    with patch("smtplib.SMTP") as mock_smtp_class:
        mock_smtp = MagicMock()
        mock_smtp_class.return_value.__enter__.return_value = mock_smtp

        # 1. Welcome Email
        success = await email_service.send_welcome_email(to_email, user_name)
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 2. Email Verification
        success = await email_service.send_email_verification_email(to_email, "123456")
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 3. Verify New Email Address
        success = await email_service.send_verify_new_email(to_email, "654321", "new@example.com")
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 4. Password Reset Request
        success = await email_service.send_password_reset_email(to_email, "reset-token-abc")
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 5. Password Successfully Changed
        success = await email_service.send_password_changed_email(to_email, user_name)
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 6. Login Alert
        success = await email_service.send_login_alert_email(
            to_email, user_name, "MacBook Pro", "London, UK", "2026-08-07 12:00:00"
        )
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 7. Analysis Started
        success = await email_service.send_analysis_started_email(to_email, user_name, "Board Meeting Vibe Check")
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 8. Presence Analysis Ready
        success = await email_service.send_analysis_ready_email(
            to_email, user_name, "Board Meeting Vibe Check", 88, "http://localhost:3000/report/1"
        )
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 9. Journey Reminder
        success = await email_service.send_journey_reminder_email(
            to_email, user_name, "Board Meeting Vibe Check", "3 days", "http://localhost:3000/report/1"
        )
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 10. Subscription Activated
        success = await email_service.send_subscription_activated_email(
            to_email, user_name, "Executive Elite", "monthly", "$49.00"
        )
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 11. Payment Receipt
        success = await email_service.send_payment_receipt_email(
            to_email, user_name, "INV-2026-001", "$49.00", "Visa ending in 4242", "http://localhost:3000/receipt/1"
        )
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 12. Payment Failed
        success = await email_service.send_payment_failed_email(
            to_email, user_name, "$49.00", "http://localhost:3000/billing"
        )
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 13. Subscription Cancelled
        success = await email_service.send_subscription_cancelled_email(
            to_email, user_name, "2026-09-07", "http://localhost:3000/reactivate"
        )
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 14. Trial Ending Soon
        success = await email_service.send_trial_ending_email(
            to_email, user_name, 3, "http://localhost:3000/subscribe"
        )
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()

        # 15. Contact Support Confirmation
        success = await email_service.send_support_confirmation_email(
            to_email, user_name, "TKT-991", "Having issues logging in from my mobile app."
        )
        assert success is True
        mock_smtp.sendmail.assert_called()
        mock_smtp.sendmail.reset_mock()
