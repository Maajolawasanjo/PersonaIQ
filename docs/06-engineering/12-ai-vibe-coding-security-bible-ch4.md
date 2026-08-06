# THE AI VIBE CODING SECURITY BIBLE

# Chapter 4

# Database Security & Data Protection

### Building Databases That Stay Secure Under Attack

> **"Your application is only as secure as the data it protects."**

---

# Chapter Overview

The database is the heart of every application. It stores user identities, business records, financial transactions, AI memory, documents, analytics, logs, and often the most valuable information an organization possesses.

Modern attackers rarely target the frontend first. Instead, they aim to reach the database—directly or indirectly—through SQL injection, broken authorization, misconfigured permissions, leaked credentials, insecure backups, or cloud storage misconfigurations.

AI-generated applications are particularly vulnerable because coding assistants often prioritize working CRUD operations over secure database architecture. They frequently generate overly permissive queries, omit row-level security, expose sensitive fields, hardcode credentials, or fail to validate ownership before returning data.

This chapter establishes a production-grade database security architecture for SQL and NoSQL systems.

---

# Learning Objectives

By the end of this chapter, your application should implement:

* Secure database authentication
* Principle of Least Privilege (PoLP)
* Parameterized queries
* ORM safety
* Row-Level Security (RLS)
* Encryption at rest
* Encryption in transit
* Database credential management
* Secret rotation
* Audit logging
* Secure migrations
* Backup protection
* Disaster recovery
* Data retention policies
* Data masking
* Soft deletes
* Immutable audit trails
* Multi-tenant isolation
* Secure indexing
* AI vector database security

---

# Why AI Gets Database Security Wrong

Common AI-generated mistakes include:

* Using `SELECT *`
* Building SQL with string concatenation
* Hardcoding database credentials
* Running applications with superuser privileges
* Missing Row-Level Security
* Returning entire database records
* No audit logging
* Public cloud databases
* Unencrypted backups
* Missing tenant filtering
* No connection pooling
* Insecure migration scripts

These flaws often remain invisible until an attacker exploits them.

---

# Threat Model

### What attackers want

* Customer data
* Authentication credentials
* Payment records
* API keys
* AI memory
* Proprietary business information
* Personally Identifiable Information (PII)
* Intellectual property

### Common attack vectors

* SQL Injection
* NoSQL Injection
* Credential theft
* Backup theft
* Misconfigured cloud storage
* Privilege escalation
* Broken RLS
* Exposed admin consoles
* Leaked `.env` files
* ORM misuse

---

# Principle 1 — Least Privilege

Never connect your application using:

```text
postgres
root
admin
superuser
```

Instead:

```text
app_reader

app_writer

migration_user

analytics_user

backup_user
```

Each account should possess only the minimum permissions necessary.

---

# Principle 2 — Never Trust User Input

Bad:

```sql
SELECT * FROM users
WHERE email = '" + email + "'
```

Attack:

```text
' OR 1=1 --
```

Entire table returned.

Correct approach:

Always use:

* Parameterized queries
* Prepared statements
* Trusted ORM abstractions

Never concatenate SQL strings.

---

# Principle 3 — Row-Level Security (RLS)

One of the biggest AI mistakes.

Suppose:

```text
Orders

Order_ID

User_ID

Amount
```

Bad query:

```sql
SELECT * FROM Orders;
```

Every user sees every order.

Correct:

Enable Row-Level Security.

Example policy:

```sql
CREATE POLICY user_orders
ON orders
FOR SELECT
USING (user_id = auth.uid());
```

Repeat for:

* SELECT
* INSERT
* UPDATE
* DELETE

---

# Principle 4 — Multi-Tenant Isolation

Never rely on the frontend to send:

```text
tenant_id
```

Always derive the tenant from:

* Auth token
* Session
* Organization membership

Every query must enforce:

```sql
WHERE tenant_id = currentTenant
```

---

# Principle 5 — Encryption at Rest

Every production database should encrypt:

* User accounts
* Password hashes
* Payment records
* Medical records
* AI memory
* Documents
* Backups

Use:

* AES-256
* Cloud-managed encryption
* Hardware Security Modules (HSMs) where available

---

# Principle 6 — Encryption in Transit

Never allow:

```text
PostgreSQL

↓

Plain TCP
```

Always require:

```text
TLS 1.2+

SSL Certificates

Certificate Validation
```

Every database connection should be encrypted.

---

# Principle 7 — Secure Secret Management

Never:

```text
DATABASE_URL="postgres://admin:password123@..."
```

inside:

* Git
* package.json
* source files
* Docker images

Instead use:

* Environment variables
* AWS Secrets Manager
* Azure Key Vault
* Google Secret Manager
* HashiCorp Vault

Rotate credentials regularly.

---

# Principle 8 — Connection Pooling

Bad:

Every request:

```text
Open Database

↓

Run Query

↓

Close
```

Better:

Application

↓

Connection Pool

↓

Database

Benefits:

* Better performance
* Lower resource usage
* Fewer denial-of-service risks

---

# Principle 9 — Audit Logging

Log:

* Login
* Logout
* Permission changes
* Record creation
* Record deletion
* Administrative actions
* Failed authorization
* Failed queries

Never log:

* Passwords
* JWTs
* API Keys
* Card numbers
* Secrets

---

# Principle 10 — Soft Deletes

Instead of:

```sql
DELETE FROM users;
```

Use:

```text
deleted_at

deleted_by

delete_reason
```

Advantages:

* Recovery
* Compliance
* Forensics
* Auditability

---

# Principle 11 — Immutable Audit Trails

Audit records should never be editable.

Audit tables should contain:

```text
Who

What

When

Where

Why

Previous Value

New Value

IP Address

User Agent
```

---

# Principle 12 — Secure Database Migrations

Migration scripts should:

* Be version controlled
* Be reviewed
* Be reversible
* Never expose secrets
* Never drop production tables accidentally

Always test migrations in staging first.

---

# Principle 13 — Database Backups

Backups are often overlooked.

Requirements:

* Encrypted
* Automated
* Versioned
* Integrity checked
* Access controlled
* Geo-redundant where appropriate

Regularly test restoration procedures.

---

# Principle 14 — Data Classification

Classify data:

Public

↓

Internal

↓

Confidential

↓

Restricted

↓

Highly Sensitive

Different classifications require different controls.

---

# Principle 15 — Sensitive Field Protection

Examples:

Never expose:

```text
password_hash

mfa_secret

refresh_token

api_key

ssn

credit_card

bank_account
```

Even to administrators unless explicitly required.

---

# Principle 16 — AI Memory Security

AI applications often use:

* pgvector
* Pinecone
* Weaviate
* Qdrant
* Milvus
* Chroma

Protect vector databases with:

* Authentication
* Tenant isolation
* Encryption
* Namespace separation
* Access controls
* Query limits

Prevent memory poisoning and unauthorized retrieval.

---

# Principle 17 — Backup Security

Treat backups like production databases.

Encrypt:

* SQL dumps
* Snapshots
* Object storage
* Archive files

Restrict restore permissions.

---

# Principle 18 — Data Retention

Do not keep data forever.

Define retention policies for:

* Logs
* Sessions
* AI conversations
* Temporary files
* Deleted accounts
* Analytics

Delete or archive data according to policy and regulatory requirements.

---

# Database Security Checklist

Every database should answer **YES**:

* Least privilege enforced?
* Parameterized queries only?
* Row-Level Security enabled?
* Multi-tenant isolation enforced?
* Encryption at rest enabled?
* TLS enabled?
* Secrets externalized?
* Audit logs enabled?
* Soft deletes implemented where appropriate?
* Backups encrypted?
* Restore procedures tested?
* Sensitive fields protected?
* Vector database secured?

---

# Master Antigravity Prompt

```text
Act as a Principal Database Security Architect.

Perform a complete security audit of my database architecture.

Review:

• PostgreSQL
• MySQL
• SQL Server
• MongoDB
• Firebase
• Supabase
• CockroachDB
• Redis
• Vector databases
• Object storage

Identify every database vulnerability.

Inspect:

1. Database authentication
2. User permissions
3. Least privilege
4. Row-Level Security
5. Multi-tenant isolation
6. SQL injection risks
7. ORM misuse
8. Parameterized queries
9. Secret management
10. Encryption at rest
11. Encryption in transit
12. Backup security
13. Audit logging
14. Migration safety
15. Data retention
16. Sensitive field exposure
17. Connection pooling
18. Performance bottlenecks
19. Index strategy
20. Disaster recovery readiness

Implement:

• Principle of Least Privilege
• Secure database roles
• Parameterized queries
• Prepared statements
• Row-Level Security
• Tenant isolation
• Audit logging
• Soft deletes where appropriate
• Immutable audit tables
• Secure migrations
• Backup encryption
• TLS enforcement
• Secret rotation
• Connection pooling
• Data masking
• Sensitive field filtering
• Secure indexing
• Vector database isolation

Return:

1. Updated schema
2. Updated queries
3. Security report
4. Migration guide
5. Backup strategy
6. Disaster recovery recommendations
7. Automated database security tests

Follow:

• OWASP ASVS
• OWASP Database Security Cheat Sheet
• OWASP API Security Top 10
• NIST SSDF
• CIS Benchmarks
```

---

# Red Team Testing

Attempt to:

* Execute SQL injection payloads.
* Modify another tenant's records.
* Query records without ownership.
* Restore old backups.
* Access the database using leaked credentials.
* Retrieve soft-deleted records without authorization.
* Enumerate database IDs.
* Dump audit tables.
* Access vector database namespaces across tenants.
* Connect without TLS.

Every attempt should fail or be detected and logged.

---

# Production Acceptance Criteria

A database is considered production-ready only if:

* Application accounts do not use administrative privileges.
* All queries are parameterized or generated through trusted ORM mechanisms.
* Row-Level Security or equivalent ownership controls are enforced.
* Multi-tenant data is isolated.
* Sensitive data is encrypted at rest and protected in transit.
* Secrets are stored outside the codebase and rotated regularly.
* Backups are encrypted, tested, and access-controlled.
* Audit logs are immutable and exclude sensitive values.
* Data retention and deletion policies are documented and enforced.
* AI/vector storage follows the same access-control model as relational data.
* Disaster recovery procedures have been tested.
* The implementation aligns with **OWASP ASVS**, the **OWASP Database Security Cheat Sheet**, **CIS Benchmarks**, and the **NIST Secure Software Development Framework (SSDF)**.

---

## Chapter Summary

A secure database is more than a storage engine—it is a policy enforcement layer. Authentication, authorization, encryption, auditing, retention, and recovery must all be designed into the data layer from the beginning. AI-generated applications should never treat the database as a passive repository; it is an active component of the application's security architecture.

---

**End of Chapter 4**

The next chapter, **Chapter 5 — Frontend Security & Browser Hardening**, will focus on XSS prevention, CSP, CSRF, clickjacking, secure storage, DOM security, browser APIs, client-side cryptography, and protecting AI-powered frontends from prompt injection and malicious content.
