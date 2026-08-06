# THE AI VIBE CODING SECURITY BIBLE

# Chapter 3

# API Security & Endpoint Hardening

### Building APIs That Survive Real-World Attacks

---

# "Your frontend is not your security boundary."

Every request that reaches your backend should be treated as if it came from an attacker.

Never trust:

* Mobile Apps
* React
* Next.js
* Flutter
* Electron
* Vue
* Angular
* Swift
* Kotlin

Every request can be modified.

Every parameter can be changed.

Every header can be forged.

Every cookie can be stolen.

Every JWT can be replayed.

Every endpoint will eventually be discovered.

Assume your API documentation has already been leaked.

---

# Chapter Objectives

After completing this chapter your API should be resistant to:

* API Enumeration
* BOLA (Broken Object Level Authorization)
* BFLA (Broken Function Level Authorization)
* SQL Injection
* NoSQL Injection
* Command Injection
* Mass Assignment
* Parameter Pollution
* HTTP Request Smuggling
* API Abuse
* Credential Stuffing
* API Key Theft
* JWT Replay
* SSRF
* Excessive Data Exposure
* Broken Rate Limiting
* Broken Pagination
* API Scraping
* Bot Traffic
* AI Agent Abuse

---

# Why APIs Are the #1 Attack Surface

Developers think:

```
Frontend

↓

Backend

↓

Database
```

Attackers think:

```
Browser

↓

Developer Tools

↓

API

↓

Everything
```

Attackers almost never attack your React interface.

They attack your API directly.

---

# AI's Biggest API Mistake

AI-generated applications often expose endpoints like:

```
GET /users

GET /orders

GET /payments

GET /admin

POST /create-user

DELETE /invoice/22
```

without checking:

* ownership
* permissions
* validation
* rate limits
* audit logging

---

# API Security Principles

Every endpoint must satisfy **all** of the following:

✓ Authentication

↓

✓ Authorization

↓

✓ Input Validation

↓

✓ Business Validation

↓

✓ Rate Limiting

↓

✓ Logging

↓

✓ Output Filtering

↓

✓ Error Handling

↓

✓ Monitoring

---

# API Security Pipeline

Every request should follow:

```
Incoming Request

↓

HTTPS Verification

↓

Web Application Firewall

↓

API Gateway

↓

Authentication

↓

Authorization

↓

Rate Limiter

↓

Input Validator

↓

Business Rules

↓

Database

↓

Output Sanitizer

↓

Logger

↓

Response
```

No request should bypass this pipeline.

---

# 1. Broken Object Level Authorization (BOLA)

OWASP API #1

Example:

```
GET

/api/invoice/400
```

Attacker changes:

```
401

402

403
```

Without ownership validation:

Database leaked.

Always verify:

```
invoice.owner == currentUser
```

before returning data.

---

# 2. Broken Function Level Authorization (BFLA)

Frontend:

```
Hide Admin Button
```

Backend:

```
DELETE /users/55
```

still works.

Attackers never click buttons.

They call APIs.

---

# 3. Excessive Data Exposure

Bad:

```
GET /users
```

returns

```
passwordHash

email

phone

DOB

SSN

JWT Secret

MFA Secret
```

Never expose internal fields.

Return only what the client actually needs.

---

# 4. Mass Assignment

AI often writes:

```javascript
User.create(req.body)
```

Looks harmless.

Danger:

Attacker sends:

```json
{
"name":"John",
"isAdmin":true,
"verified":true,
"credits":999999
}
```

Database happily accepts it.

Instead:

Whitelist fields explicitly.

```
name

email

phone
```

Ignore everything else.

---

# 5. Parameter Pollution

Example:

```
GET

/products?id=5&id=999
```

Different frameworks behave differently.

Normalize parameters.

Reject duplicates.

---

# 6. Missing Rate Limiting

Attack:

```
10 million login attempts

↓

API crashes

↓

Cloud bill explodes
```

Rate limit:

Per

* IP
* User
* API Key
* Device
* Organization

---

Recommended:

Login

```
5/minute
```

General API

```
100/15 minutes
```

AI APIs

Based on token usage.

---

# 7. API Key Exposure

Never:

```javascript
OPENAI_KEY="sk-xxxxxxxx"
```

Never:

```
Firebase Admin Key

AWS Secret

Stripe Secret

GitHub Token
```

inside frontend code.

Store:

Environment Variables

Secret Manager

Vault

AWS Secrets Manager

Azure Key Vault

Google Secret Manager

---

# 8. Input Validation

Never trust:

```
req.body

req.query

req.params

headers

cookies
```

Validate everything.

Example:

Email

Phone

UUID

Date

Currency

Country

File

URL

Enum

Numbers

Booleans

---

# 9. Output Validation

Not only input.

Also validate:

Responses.

Never return:

Internal IDs

Database paths

Secrets

Private fields

Debug values

Stack traces

---

# 10. Pagination Security

Bad:

```
GET

/users?page=1

limit=100000
```

Database dies.

Enforce:

Minimum

Maximum

Default

Example:

```
Default:

25

Maximum:

100
```

---

# 11. API Versioning

Never:

```
/api/users
```

Use:

```
/api/v1/

/api/v2/
```

Never break old clients unexpectedly.

---

# 12. Request Size Limits

Attack:

Upload

20GB JSON

↓

Memory exhausted

↓

Server crashes

Set limits.

Example:

JSON

```
1 MB
```

Images

```
5 MB
```

PDF

```
10 MB
```

---

# 13. Webhook Security

Every webhook must verify:

Signature

Timestamp

Replay Attack

Origin

Never trust:

Incoming POST.

---

# 14. CORS Security

Bad:

```
Access-Control-Allow-Origin: *
```

Good:

```
https://yourapp.com

https://admin.yourapp.com
```

Only trusted domains.

---

# 15. HTTP Methods

Don't expose methods unnecessarily.

If endpoint only reads:

Allow:

```
GET
```

Reject:

POST

PUT

DELETE

PATCH

---

# 16. Idempotency

Payments

Orders

Invoices

Need:

Idempotency Keys

Otherwise:

```
Double Payment

↓

Triple Payment

↓

Financial Loss
```

---

# 17. API Gateway

Every production API should sit behind:

Cloudflare

AWS API Gateway

Azure API Management

NGINX

Kong

Traefik

Gateway responsibilities:

* Authentication
* Rate Limiting
* IP Blocking
* Request Filtering
* Logging
* WAF Integration

---

# 18. Secure Error Responses

Bad:

```json
{
"error":"SQL syntax error near users table"
}
```

Good:

```json
{
"error":"Request could not be processed."
}
```

Detailed logs stay on the server.

---

# API Security Checklist

Every endpoint should answer **YES**:

✓ Authentication required?

✓ Authorization enforced?

✓ Ownership validated?

✓ Input validated?

✓ Output filtered?

✓ Rate limited?

✓ Logged?

✓ Errors sanitized?

✓ Pagination enforced?

✓ Request size limited?

✓ HTTPS only?

✓ Versioned?

✓ Tested?

---

# Master Antigravity Prompt

```text
Act as a Principal API Security Engineer.

Perform a complete security assessment of every API endpoint in my application.

Inspect:

• REST APIs
• GraphQL APIs
• WebSocket endpoints
• Server Actions
• Serverless Functions
• Background Workers
• Cron Jobs
• Webhooks

Your objective is to eliminate every API vulnerability identified in the OWASP API Security Top 10.

For every endpoint:

1. Identify authentication weaknesses.
2. Identify authorization weaknesses.
3. Validate ownership enforcement.
4. Review input validation.
5. Review output filtering.
6. Check rate limiting.
7. Check pagination.
8. Check request size limits.
9. Check error handling.
10. Check logging.
11. Check API versioning.
12. Check idempotency where applicable.
13. Validate webhook signatures.
14. Validate CORS.
15. Review API key handling.
16. Review secret management.

Implement:

• Central API middleware
• Schema validation
• Strict DTO validation
• Parameter sanitization
• Mass assignment protection
• Rate limiting
• Request throttling
• Pagination limits
• Secure CORS
• Request size limits
• Output filtering
• Generic error responses
• API audit logging
• Idempotency keys
• Replay protection
• Secure webhook verification

Generate:

1. Updated production-ready code.
2. Security explanation for every change.
3. API security report.
4. OWASP API Top 10 compliance report.
5. Automated integration tests covering authentication, authorization, malformed requests, excessive requests, replay attacks, and unauthorized resource access.

Do not leave any endpoint accessible without explicit security review.
```

---

# Red Team Testing

Attempt to:

* Call APIs without logging in.
* Replay expired JWTs.
* Modify resource IDs.
* Upload oversized payloads.
* Inject SQL/NoSQL payloads.
* Submit duplicate payment requests.
* Bypass CORS.
* Replay webhook events.
* Remove required headers.
* Send malformed JSON.
* Enumerate endpoint IDs.
* Flood endpoints with high request rates.
* Attempt mass assignment by adding hidden fields.
* Access deprecated API versions.

Every test should fail safely, generate an audit log, and expose no sensitive information.

---

# Production Acceptance Criteria

An API is considered production-ready only if:

* Every endpoint requires explicit authentication or is intentionally public.
* Authorization is enforced server-side for every protected resource.
* Input and output are validated against defined schemas.
* Sensitive fields are never returned to clients.
* Rate limiting, request size limits, and pagination are enforced.
* Webhooks verify signatures and protect against replay.
* API keys and secrets are never exposed in client code.
* Error responses do not leak internal implementation details.
* APIs are versioned and documented.
* Security events are logged and monitored.
* The implementation aligns with the **OWASP API Security Top 10**, **OWASP ASVS**, and **NIST Secure Software Development Framework (SSDF)**.

---

**End of Chapter 3**
