# PersonaIQ
# Authentication & Authorization Architecture

**Document ID:** PIQ-ENG-009  
**Version:** 1.0  
**Status:** Production Architecture  
**Owner:** Security Engineering  
**Authentication Provider:** Clerk  
**Authorization:** RBAC  

---

# Purpose
This document defines the authentication and authorization architecture for PersonaIQ.
Authentication verifies identity. Authorization determines permissions.
PersonaIQ uses a provider-first authentication architecture, allowing the application to focus entirely on product logic while delegating identity management to a dedicated identity platform.

---

# Guiding Principles
- Identity should never be implemented manually.
- Authentication is delegated.
- Authorization remains application-owned.
- Security is enforced at every layer.
- Every request must be authenticated before reaching business logic.

---

# Identity Provider
**Primary Provider:** Clerk
**Reasons:** Passwordless authentication, OAuth providers, Session management, JWT issuance, Email verification, MFA support, Device management, Organization support, Enterprise SSO support.
**Future Provider Adapters:** Auth.js, Firebase Auth, Auth0, AWS Cognito, Azure Entra ID.

---

# Supported Authentication Methods
Email + Password, Google, GitHub, Apple, Microsoft, Magic Link, One-Time Password (Future), Enterprise SSO (Future).

---

# Authentication Flow
Visitor ↓ Landing Page ↓ Sign In ↓ Clerk ↓ Identity Verification ↓ JWT Issued ↓ Backend Middleware ↓ Authenticated User ↓ Dashboard

---

# Registration Flow
User ↓ Sign Up ↓ Verify Email ↓ Account Created ↓ User Record Created ↓ Onboarding ↓ Dashboard

---

# Login Flow
User ↓ Clerk Sign In ↓ JWT Generated ↓ Session Created ↓ Backend Verification ↓ Load Profile ↓ Dashboard

---

# JWT Lifecycle
JWT Issued ↓ Stored Securely by Clerk ↓ Sent as Bearer Token ↓ Backend Verification ↓ Authorization ↓ Business Logic ↓ Response.
*PersonaIQ never generates JWT tokens manually.*

---

# User Lifecycle
Visitor ↓ Registered User ↓ Onboarding ↓ Active User ↓ Returning User ↓ Inactive ↓ Deleted

---

# User Roles
- **USER:** Standard customer.
- **ADMIN:** Platform administrator.
- **SUPER_ADMIN:** Platform owner.
- **Future:** ORGANIZATION_ADMIN, TEAM_MEMBER, COACH, ENTERPRISE_MANAGER.

---

# Permission Matrix

| Feature | User | Admin | Super Admin |
|----------|------|-------|-------------|
| Dashboard | ✓ | ✓ | ✓ |
| Create Journey | ✓ | ✓ | ✓ |
| Upload Images | ✓ | ✓ | ✓ |
| Generate Presence Plan | ✓ | ✓ | ✓ |
| Export Reports | ✓ | ✓ | ✓ |
| Manage Users | ✗ | ✓ | ✓ |
| System Analytics | ✗ | ✓ | ✓ |
| Configuration | ✗ | ✗ | ✓ |

---

# Authorization Flow
HTTP Request ↓ Authentication Middleware ↓ JWT Validation ↓ Load User ↓ Role Resolution ↓ Permission Check ↓ Controller ↓ Service

---

# Route Protection
- **Public Routes:** `/`, `/about`, `/pricing`, `/resources`, `/sign-in`, `/sign-up`
- **Authenticated Routes:** `/dashboard`, `/journeys`, `/history`, `/profile`, `/settings`
- **Admin Routes:** `/admin`, `/analytics`, `/system`, `/configuration`

---

# Backend Middleware
Authentication Middleware ↓ JWT Verification ↓ Attach User Context ↓ Permission Middleware ↓ Controller.
*Every protected endpoint requires both authentication and authorization checks.*

---

# User Context
Every authenticated request includes:
```json
{
  "userId": "...",
  "role": "USER",
  "email": "...",
  "sessionId": "...",
  "permissions": []
}
```
Business services consume only the user context.

---

# Session Management
Managed entirely by Clerk.
**Features:** Automatic refresh, Device sessions, Session expiration, Session revocation, Concurrent sessions, Trusted devices.
*PersonaIQ does not persist session state.*

---

# Onboarding Flow
New User ↓ Create Account ↓ Complete Profile ↓ Select Goals ↓ Choose Theme ↓ Finish Onboarding ↓ Create First Journey

---

# Account Management
Users can: Update Profile, Change Avatar, Manage Sessions, Reset Password, Delete Account, Download Personal Data (Future).

---

# Image Ownership
Every uploaded asset belongs exclusively to the authenticated user.
**Validation:** Current User ↓ Journey Owner? ↓ YES ↓ Access Granted ↓ NO ↓ 403 Forbidden.

---

# API Authentication
Every protected request requires: `Authorization: Bearer <JWT>`
- **Missing Token:** 401 Unauthorized
- **Expired Token:** 401 Unauthorized
- **Invalid Token:** 401 Unauthorized
- **Insufficient Permission:** 403 Forbidden

---

# Password Policy
Handled by Clerk. PersonaIQ never stores passwords.

---

# Multi-Factor Authentication
Supported by Clerk.
**Future Requirement:** Mandatory for Admins, Enterprise Accounts, Organization Owners.

---

# Account Recovery
Email Verification, Password Reset, Magic Link, Device Recovery. Managed by Clerk.

---

# Audit Events
Log: Login, Logout, Failed Login, Password Reset, Account Deletion, Permission Changes, Admin Actions, Sensitive Data Export.

---

# Future Organization Model
Organization ↓ Members ↓ Roles ↓ Shared Journeys ↓ Analytics ↓ Billing.
*Current MVP remains single-user.*

---

# API Security Integration
Every authenticated request receives: Authenticated User ↓ Rate Limit ↓ Permission Check ↓ Validation ↓ Business Logic ↓ Audit Log ↓ Response.

---

# Privacy Principles
Users own their data. Uploaded images remain private. No public profiles. No anonymous access to user content. Data deletion supported.

---

# Security Rules
Never trust frontend roles. Never trust client-side permissions. Always validate ownership. Never expose internal identifiers. Always verify JWT before business logic. Never embed secrets in the frontend.

---

# Future Expansion
Enterprise SSO, SCIM Provisioning, Organization Accounts, Role Delegation, Invitation System, Team Collaboration, Impersonation (Admin), Fine-Grained Permissions.

---

# Definition of Done
✓ Clerk authentication integrated  
✓ JWT verification architecture  
✓ Role-based authorization  
✓ Protected routes  
✓ Secure session lifecycle  
✓ Ownership validation  
✓ Audit-ready authentication  
✓ Enterprise-ready identity model  
✓ Future SSO support  
✓ Production-ready security foundation
