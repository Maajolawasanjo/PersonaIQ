# The AI Vibe Coding Security Bible

## Chapter 1 — Authentication Security

### Building Unbreakable Authentication for AI-Generated Applications

---

# Chapter Overview

Authentication is the first line of defense in every application. If authentication fails, every other security control becomes irrelevant.

One of the biggest weaknesses of AI-generated applications is that AI agents prioritize making login systems "work" rather than making them secure. Most coding agents generate functional authentication, but frequently omit production-grade protections such as secure session handling, token rotation, brute-force protection, multi-factor authentication, secure cookie configuration, and proper backend validation.

As a result, attackers can often compromise accounts through weak implementation rather than sophisticated exploits.

This chapter establishes a complete authentication security standard for AI-generated applications.

---

# Objectives

After completing this chapter, your application should provide:

* Secure user registration
* Secure login
* Secure logout
* Password reset
* Email verification
* Multi-factor authentication (MFA)
* Secure session management
* Token rotation
* Password hashing
* Account lockout
* Brute-force protection
* Device session management
* Authentication audit logging

---

# Why AI Gets Authentication Wrong

AI coding assistants typically optimize for:

✅ Fast implementation

instead of

✅ Secure implementation

Common AI mistakes include:

* Plain JWT secrets
* Long-lived tokens
* No refresh token rotation
* Missing session expiration
* Missing HttpOnly cookies
* Missing SameSite protection
* Missing Secure flag
* Client-side authentication
* Trusting frontend roles
* No brute-force protection
* Weak password policy
* Missing email verification
* Missing MFA
* Weak password hashing
* Missing account lockout
* No login audit logs

---

# Threat Model

### Attacker Goals

An attacker wants to:

* Steal accounts
* Hijack sessions
* Impersonate administrators
* Bypass authentication
* Reuse stolen tokens
* Enumerate users
* Brute-force passwords
* Abuse forgotten-password flows
* Hijack OAuth callbacks

---

# Common Authentication Vulnerabilities

## 1. Weak Password Storage

Danger:

AI sometimes stores passwords incorrectly.

Examples:

* Plain text
* MD5
* SHA1
* SHA256 without salt

Never acceptable.

Use:

* Argon2id
* bcrypt (cost ≥12)
* scrypt

---

## 2. Weak JWT Secret

Bad Example

```
JWT_SECRET="secret123"
```

or

```
super-secret-key
```

Attackers know these.

Generate:

* 64-byte random key
* Stored in environment variables
* Rotated periodically

---

## 3. Infinite Login Sessions

Bad

```
Token expires:
Never
```

Good

Access Token

15 minutes

Refresh Token

7–30 days

Rotate refresh token every use.

---

## 4. Missing Email Verification

Without verification:

Attackers create

* fake accounts
* spam accounts
* phishing accounts

Always require email verification before activating accounts.

---

## 5. Weak Password Rules

Never allow:

```
123456

password

qwerty

11111111
```

Require:

Minimum:

✔ 12 characters

At least:

✔ uppercase

✔ lowercase

✔ number

✔ special character

Reject compromised passwords.

---

## 6. Missing Account Lockout

Without lockout:

Attackers brute force millions of passwords.

Implement:

* 5 failed attempts
* 15-minute lock
* exponential delay
* CAPTCHA after repeated failures

---

## 7. User Enumeration

Bad:

```
User not found

Wrong password
```

Good:

```
Invalid email or password
```

Never reveal whether an account exists.

---

## 8. Client-side Authentication

Never trust:

```
if(user.role==="admin")
```

Frontend checks are cosmetic.

Backend must verify every request.

---

## 9. Missing Session Revocation

Users must be able to:

* Logout everywhere
* Revoke stolen devices
* View active sessions

---

## 10. Missing MFA

Passwords alone are insufficient.

Support:

* TOTP
* Passkeys/WebAuthn
* Hardware keys

Avoid SMS as the primary MFA method where possible.

---

# Authentication Security Architecture

```
User

↓

HTTPS

↓

API Gateway

↓

Authentication Service

↓

Password Verification

↓

MFA

↓

Session Manager

↓

JWT Generator

↓

Database

↓

Audit Logger
```

Every authentication request should pass through this pipeline.

---

# Master Antigravity Prompt

---

## Authentication Security Hardening Prompt

```
Audit my entire authentication system as a senior security engineer.

Do NOT focus only on functionality.

Your objective is to make authentication production-ready.

Review:

• Registration
• Login
• Logout
• Email verification
• Password reset
• Session management
• JWT handling
• Refresh tokens
• OAuth
• MFA
• Cookies
• API authentication
• Backend middleware

Identify every authentication vulnerability.

For each vulnerability:

1. Explain the issue.

2. Explain the attack scenario.

3. Explain the business impact.

4. Rewrite the code using industry best practices.

Implement all of the following:

• Argon2id or bcrypt password hashing
• Secure JWT generation
• 64-byte random JWT secret
• Refresh token rotation
• Access token expiration (15 min)
• Refresh token expiration (7–30 days)
• HttpOnly cookies
• Secure cookies
• SameSite=Strict
• CSRF protection
• Email verification
• Password reset tokens
• Token invalidation
• Device session management
• Account lockout
• Brute-force protection
• Login rate limiting
• Generic authentication errors
• Audit logging
• MFA support
• WebAuthn readiness
• Session revocation
• Secure logout
• Token blacklisting
• Secure environment variable usage

Never trust frontend authentication.

Every protected endpoint must validate authentication server-side.

Remove all insecure authentication code.

Replace deprecated libraries.

Never expose secrets.

Follow:

OWASP ASVS

OWASP Authentication Cheat Sheet

NIST 800-63B

Return:

• Updated code
• Security explanations
• Migration steps
• Testing checklist
```

---

# Validation Checklist

Your application should answer YES to every question.

## Passwords

✔ Passwords hashed

✔ Argon2id/bcrypt

✔ Minimum 12 characters

✔ Password blacklist

✔ Complexity rules

---

## Login

✔ Generic errors

✔ Rate limiting

✔ Lockout

✔ CAPTCHA

---

## Sessions

✔ HttpOnly

✔ Secure

✔ SameSite

✔ Expiration

✔ Rotation

---

## Tokens

✔ Short-lived

✔ Refresh tokens

✔ Revocation

✔ Rotation

---

## MFA

✔ Supported

✔ Recovery codes

✔ Device trust

---

## Backend

✔ Server validation

✔ Middleware

✔ Protected APIs

✔ Role verification

---

## Logging

✔ Login success

✔ Login failure

✔ Password reset

✔ MFA

✔ Logout

✔ Session revoke

---

# Red-Team Testing

Attempt:

□ Brute-force login

□ Replay JWT

□ Reuse revoked token

□ Guess session ID

□ Modify JWT

□ Disable JS

□ Call protected APIs directly

□ Skip MFA

□ Enumerate users

□ Replay refresh token

Every attack should fail.

---

# Production Acceptance Criteria

Authentication is considered production-ready only if:

* No plaintext passwords are stored.
* All passwords are hashed with Argon2id or bcrypt.
* Access tokens are short-lived.
* Refresh tokens rotate after every use.
* Cookies are HttpOnly, Secure, and SameSite=Strict.
* Email verification is enforced before account activation.
* Password reset tokens are single-use and expire promptly.
* Backend authorization is enforced on every protected endpoint.
* Login attempts are rate-limited and account lockout is implemented.
* MFA is supported for sensitive accounts.
* Authentication events are logged without exposing sensitive data.
* Secrets are stored only in environment variables or a secure secrets manager.
* The authentication system aligns with OWASP ASVS and NIST SP 800-63B guidance.

---

**End of Chapter 1**

---

# Chapter 2

# Authorization & Access Control

> **"Authentication determines who you are. Authorization determines what you are allowed to do."**

---

# Chapter Overview

Authorization is the single most exploited weakness in modern web applications.

Even if your authentication is flawless, your application can still be completely compromised if users can access resources, functions, or data they do not own.

According to OWASP, **Broken Access Control** has ranked as the **#1 Web Application Security Risk** because developers—and increasingly AI coding assistants—frequently implement authorization incorrectly.

AI coding tools excel at generating working features, but they often:

* Trust the frontend.
* Skip ownership validation.
* Assume user roles without verification.
* Expose hidden API routes.
* Forget middleware.
* Mix authentication with authorization.
* Fail to isolate tenant data.
* Expose administrative functionality.

This chapter provides a production-grade authorization architecture.

---

# Learning Objectives

After implementing this chapter, your application will support:

* Role-Based Access Control (RBAC)
* Attribute-Based Access Control (ABAC)
* Relationship-Based Access Control (ReBAC)
* Resource Ownership Validation
* Multi-Tenant Isolation
* API Authorization
* Backend Route Protection
* Permission-Based UI Rendering
* Admin Separation
* Least Privilege
* Policy-Based Authorization
* Secure Middleware
* Audit Logging

---

# Authentication vs Authorization

Many AI-generated apps confuse these concepts.

Authentication asks:

> Who are you?

Authorization asks:

> What are you allowed to do?

Example:

A user logs in successfully.

Authentication succeeds.

That same user requests:

```
GET /api/admin/users
```

Authentication:

✅ Passed

Authorization:

❌ Failed

Without authorization:

Every logged-in user becomes an administrator.

---

# Why AI Gets Authorization Wrong

AI assistants frequently generate code like:

```javascript
if(user){
   return dashboard;
}
```

Looks fine.

It is not.

The AI only checked whether the user exists.

It never verified:

* ownership
* permissions
* tenant
* role
* policy
* organization

---

# The OWASP #1 Problem

Broken Access Control includes:

* IDOR
* BOLA
* BFLA
* Missing Ownership Checks
* Missing RBAC
* Missing Middleware
* Hidden Routes
* Admin Bypass
* Tenant Leakage

More than half of modern application breaches involve authorization failures rather than authentication failures.

---

# Principle of Least Privilege

Every user should have the minimum permissions necessary.

Never:

```
User

↓

Everything
```

Always:

```
Guest

↓

Read Only

↓

Member

↓

Editor

↓

Moderator

↓

Administrator

↓

Super Admin
```

Each level should inherit only the permissions it requires.

---

# Role-Based Access Control (RBAC)

RBAC assigns permissions based on predefined roles.

Example roles:

```
Guest

Customer

Vendor

Support

Moderator

Manager

Finance

Admin

Super Admin
```

Each role receives only the permissions required for its responsibilities.

---

# AI Mistake #1

AI often writes:

```javascript
if(user.role=="admin")
```

Problems:

* easy to duplicate
* impossible to scale
* scattered everywhere
* inconsistent

Instead:

Create centralized authorization middleware.

Example:

```
RequirePermission("users.delete")
```

instead of

```
role=="admin"
```

---

# Attribute-Based Access Control (ABAC)

Roles alone are insufficient.

Consider:

Doctor

Patient

Hospital

Department

Time

Location

Emergency status

A doctor may access a patient only if:

* same hospital
* assigned physician
* patient consent exists

ABAC evaluates multiple attributes before granting access.

---

# Relationship-Based Access Control (ReBAC)

ReBAC grants access based on relationships.

Example:

GitHub

Repository

↓

Organization

↓

Team

↓

Member

Permission depends on relationships rather than roles.

---

# Resource Ownership

Every database record should have an owner.

Example:

```
Invoice

Owner_ID

Tenant_ID

Created_By
```

Before returning the invoice:

Verify:

```
CurrentUser == Owner_ID
```

Otherwise:

403 Forbidden

Never rely on the frontend to hide data.

---

# Broken Object Level Authorization (BOLA)

Most APIs expose numeric IDs.

Example:

```
GET

/api/orders/501
```

Attacker changes:

```
502

503

504
```

If ownership isn't checked:

Entire database exposed.

Every API request must validate:

```
resource.owner == currentUser
```

---

# Broken Function Level Authorization (BFLA)

Hidden buttons are not security.

Bad:

```
Frontend:

Hide Delete Button
```

Backend:

```
DELETE /users/55
```

Still works.

Attackers simply call the API directly.

Authorization must always happen server-side.

---

# Multi-Tenant Isolation

SaaS applications often host multiple organizations.

Example:

```
Company A

Company B

Company C
```

Users from Company A must never see Company B's data.

Every query must include:

```
tenant_id
```

Example:

```
SELECT *

FROM invoices

WHERE tenant_id=currentTenant
```

Never trust the client to send the tenant ID without validating it.

---

# Admin Privilege Escalation

Never allow:

```
PATCH

/users/55

{

role:"admin"

}
```

Unless:

* requester already has permission
* requester belongs to same organization
* action logged
* approval policy satisfied

---

# Secure Authorization Middleware

Every protected route should follow this sequence:

```
Receive Request

↓

Authenticate User

↓

Validate Session

↓

Verify JWT

↓

Load Permissions

↓

Validate Tenant

↓

Validate Ownership

↓

Check Policy

↓

Log Decision

↓

Return Response
```

Missing any of these steps can create an authorization bypass.

---

# API Authorization Checklist

Every API endpoint should verify:

* Is the user authenticated?
* Is the token valid?
* Is the session active?
* Does the user have the required permission?
* Does the resource belong to the user or tenant?
* Is the requested action allowed?
* Is the account active?
* Is MFA required for this action?
* Is the request rate acceptable?

---

# Common Authorization Mistakes in AI Code

❌ Trusting frontend roles

❌ Hidden admin pages

❌ Missing middleware

❌ Public APIs

❌ No ownership checks

❌ Missing tenant filters

❌ Hardcoded roles

❌ Role checks in UI only

❌ Querying entire tables

❌ Returning unauthorized records before filtering

---

# Master Antigravity Prompt

```
Act as a Senior Application Security Architect specializing in Authorization and Access Control.

Perform a comprehensive security audit of my entire application.

Your objective is to eliminate every instance of Broken Access Control (OWASP A01:2021).

Audit all backend services, API endpoints, middleware, database queries, GraphQL resolvers, WebSocket handlers, server actions, serverless functions, and admin routes.

For every endpoint:

1. Verify authentication.
2. Verify authorization.
3. Verify ownership.
4. Verify tenant isolation.
5. Verify permission checks.
6. Verify least privilege.
7. Verify policy enforcement.

Implement the following:

• Centralized authorization middleware
• Role-Based Access Control (RBAC)
• Attribute-Based Access Control (ABAC) where appropriate
• Relationship-Based Access Control (ReBAC) where appropriate
• Object ownership validation
• Tenant isolation
• Permission matrix
• Route guards
• Secure API authorization
• Admin privilege separation
• Resource-level authorization
• JWT claim validation
• Organization membership validation
• Security audit logging
• Default-deny policy for all protected resources

Remove all frontend-only authorization logic.

Every protected operation must be enforced server-side.

Reject unauthorized requests with proper HTTP status codes (401 or 403 as appropriate).

Generate a complete permission matrix documenting every role and every action.

Highlight every authorization vulnerability you discover.

Refactor insecure code using OWASP ASVS and the OWASP Authorization Cheat Sheet as implementation standards.

Finally, generate automated authorization test cases to verify that privilege escalation, IDOR, BOLA, BFLA, tenant escape, and admin bypass attacks all fail.
```

---

# Red Team Testing Checklist

Attempt to:

* Access another user's profile by changing an ID.
* Read another tenant's records.
* Call hidden admin endpoints directly.
* Modify your own role to `admin`.
* Delete resources you do not own.
* Access APIs after removing frontend authorization checks.
* Replay a valid token against another organization's resources.
* Access privileged actions without the required role.
* Enumerate resource IDs.
* Bypass route guards through direct API requests.

Every attempt should result in denial, logging, and no data exposure.

---

# Production Acceptance Criteria

Authorization is considered production-ready only if:

* Every protected endpoint enforces server-side authorization.
* Every resource access validates ownership or explicit permission.
* Multi-tenant applications strictly isolate tenant data.
* RBAC/ABAC/ReBAC policies are centralized and consistently applied.
* Hidden UI elements are backed by backend enforcement.
* Permission checks are reusable middleware or policy functions—not scattered inline.
* Unauthorized requests return appropriate HTTP status codes without leaking sensitive information.
* All authorization decisions are auditable.
* Default behavior is **deny unless explicitly allowed**.
* The implementation aligns with **OWASP ASVS**, the **OWASP Authorization Cheat Sheet**, and the **OWASP API Security Top 10**.

---

**End of Chapter 2**
