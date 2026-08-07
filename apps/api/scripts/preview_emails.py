#!/usr/bin/env python3
"""
PersonaIQ Email Template Preview Script
========================================
Renders all 26 email templates to static HTML files in ./email_previews/
so you can open them directly in a browser for visual inspection.

Usage:
    python scripts/preview_emails.py

Output:
    apps/api/email_previews/<template-name>.html  — one file per template
"""

import os
import sys

# Ensure the app package is importable from the project root
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "..", "app", "templates", "emails")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "email_previews")

BASE_URL = "http://localhost:3000"
SUPPORT_URL = f"{BASE_URL}/support"
BILLING_URL = f"{BASE_URL}/billing"
DASHBOARD_URL = f"{BASE_URL}/dashboard"
UNSUBSCRIBE_URL = f"{BASE_URL}/unsubscribe"

# -------------------------------------------------------------------
# Template context map — each entry is (template_filename, context_dict)
# -------------------------------------------------------------------
TEMPLATES = [
    ("welcome.html", {
        "user_name": "Test User",
        "landing_url": BASE_URL,
    }),
    ("email-verification.html", {
        "code": "483920",
        "landing_url": BASE_URL,
    }),
    ("verify-new-email.html", {
        "code": "719283",
        "new_email": "newemail@example.com",
    }),
    ("password-reset.html", {
        "reset_url": f"{BASE_URL}/reset-password?token=test-token-abc123",
    }),
    ("password-changed.html", {
        "user_name": "Test User",
        "support_email": "support@personaiq.com",
    }),
    ("login-alert.html", {
        "user_name": "Test User",
        "device": "Chrome on macOS",
        "location": "Lagos, NG",
        "time": "2026-08-07 14:32 UTC",
        "support_email": "support@personaiq.com",
    }),
    ("analysis-started.html", {
        "user_name": "Test User",
        "event_title": "Executive Board Pitch",
    }),
    ("analysis-ready.html", {
        "user_name": "Test User",
        "event_title": "Executive Board Pitch",
        "presence_score": 92,
        "dashboard_url": DASHBOARD_URL,
    }),
    ("journey-reminder.html", {
        "user_name": "Test User",
        "event_title": "Executive Board Pitch",
        "days_remaining": "3 days",
        "dashboard_url": DASHBOARD_URL,
    }),
    ("subscription-activated.html", {
        "user_name": "Test User",
        "plan_name": "Executive Growth",
        "billing_cycle": "monthly",
        "amount": "$49.00",
    }),
    ("payment-receipt.html", {
        "user_name": "Test User",
        "invoice_id": "INV-8871",
        "amount": "$49.00",
        "payment_method": "Visa ending in 4242",
        "receipt_url": f"{BASE_URL}/receipts/INV-8871",
    }),
    ("payment-failed.html", {
        "user_name": "Test User",
        "amount": "$49.00",
        "update_billing_url": BILLING_URL,
    }),
    ("subscription-cancelled.html", {
        "user_name": "Test User",
        "effective_date": "2026-09-07",
        "reactivate_url": BILLING_URL,
    }),
    ("trial-ending.html", {
        "user_name": "Test User",
        "days_remaining": 3,
        "subscribe_url": BILLING_URL,
    }),
    ("support-confirmation.html", {
        "user_name": "Test User",
        "ticket_id": "TKT-552",
        "message_summary": "Billing issue regarding my subscription.",
    }),
    ("account-deleted.html", {
        "user_name": "Test User",
        "support_url": SUPPORT_URL,
    }),
    ("subscription-upgraded.html", {
        "user_name": "Test User",
        "old_plan": "Starter",
        "new_plan": "Executive Growth",
        "billing_cycle": "monthly",
        "amount": "$49.00",
        "next_renewal_date": "2026-09-07",
        "dashboard_url": DASHBOARD_URL,
    }),
    ("subscription-downgraded.html", {
        "user_name": "Test User",
        "old_plan": "Executive Growth",
        "new_plan": "Starter",
        "effective_date": "2026-09-07",
        "amount": "$19.00",
        "billing_cycle": "monthly",
        "upgrade_url": BILLING_URL,
    }),
    ("trial-started.html", {
        "user_name": "Test User",
        "plan_name": "Executive Growth",
        "trial_days": 14,
        "trial_end_date": "2026-08-21",
        "dashboard_url": DASHBOARD_URL,
    }),
    ("invoice-upcoming.html", {
        "user_name": "Test User",
        "plan_name": "Executive Growth",
        "amount": "$49.00",
        "charge_date": "2026-09-07",
        "payment_method": "Visa ending in 4242",
        "billing_url": BILLING_URL,
    }),
    ("payment-method-updated.html", {
        "user_name": "Test User",
        "card_brand": "Mastercard",
        "card_last4": "9988",
        "updated_at": "2026-08-07 14:00 UTC",
        "support_url": SUPPORT_URL,
    }),
    ("data-export-ready.html", {
        "user_name": "Test User",
        "requested_at": "2026-08-07 10:00 UTC",
        "expires_at": "2026-08-14 10:00 UTC",
        "download_url": f"{BASE_URL}/exports/download/abc123",
    }),
    ("reactivation.html", {
        "user_name": "Test User",
        "reactivate_url": BILLING_URL,
    }),
    ("inactivity-nudge.html", {
        "user_name": "Test User",
        "days_inactive": 30,
        "last_analysis_name": "Executive Board Pitch",
        "pending_journeys": 2,
        "dashboard_url": DASHBOARD_URL,
        "unsubscribe_url": UNSUBSCRIBE_URL,
    }),
    ("referral-invite.html", {
        "referrer_name": "Alex Johnson",
        "referral_code": "ALEX2026",
        "referral_reward": "1 month free",
        "referral_url": f"{BASE_URL}/signup?ref=ALEX2026",
    }),
    ("feedback-request.html", {
        "user_name": "Test User",
        "analysis_name": "Executive Board Pitch",
        "rating_url_1": f"{BASE_URL}/feedback?r=1",
        "rating_url_2": f"{BASE_URL}/feedback?r=2",
        "rating_url_3": f"{BASE_URL}/feedback?r=3",
        "rating_url_4": f"{BASE_URL}/feedback?r=4",
        "rating_url_5": f"{BASE_URL}/feedback?r=5",
        "feedback_url": f"{BASE_URL}/feedback",
        "unsubscribe_url": UNSUBSCRIBE_URL,
    }),
    ("two-factor-code.html", {
        "code": "847291",
        "support_url": SUPPORT_URL,
    }),
]


def render_template(template_name: str, context: dict) -> str:
    path = os.path.join(TEMPLATES_DIR, template_name)
    if not os.path.exists(path):
        print(f"  [MISSING] {template_name}")
        return ""
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    for key, value in context.items():
        content = content.replace(f"{{{key}}}", str(value))
    return content


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"\n🎨  PersonaIQ Email Preview Generator")
    print(f"{'─' * 50}")
    print(f"  Templates dir : {TEMPLATES_DIR}")
    print(f"  Output dir    : {OUTPUT_DIR}")
    print(f"{'─' * 50}\n")

    ok = 0
    missing = 0

    for template_name, context in TEMPLATES:
        html = render_template(template_name, context)
        if not html:
            missing += 1
            continue

        out_path = os.path.join(OUTPUT_DIR, template_name)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  ✅  {template_name}")
        ok += 1

    print(f"\n{'─' * 50}")
    print(f"  Done: {ok} rendered, {missing} missing")
    print(f"  Open previews in: {os.path.abspath(OUTPUT_DIR)}/")
    print(f"{'─' * 50}\n")


if __name__ == "__main__":
    main()
