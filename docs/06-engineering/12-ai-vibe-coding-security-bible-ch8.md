# THE AI Vibe Coding Security Bible

# Chapter 8

# Cloud Infrastructure & DevSecOps Security

## Securing AWS, Azure, GCP, Docker, Kubernetes, CI/CD, Infrastructure as Code, and Production Deployments

> **"Your application is only as secure as the infrastructure it runs on. A perfectly secure application deployed to an insecure cloud environment is still an insecure application."**

---

# Chapter Overview

Most security breaches today do **not** begin with sophisticated exploits.

They begin with:

* Public S3 buckets
* Exposed Kubernetes dashboards
* Hardcoded cloud credentials
* Misconfigured IAM roles
* Leaked GitHub Actions secrets
* Public databases
* Insecure Docker containers
* Vulnerable CI/CD pipelines
* Compromised software dependencies

AI coding assistants can generate impressive applications, but they rarely build **production-grade cloud infrastructure** by default.

This chapter establishes a comprehensive Cloud Security and DevSecOps architecture aligned with:

* Zero Trust
* Least Privilege
* Infrastructure as Code (IaC)
* Continuous Security
* Secure Supply Chain
* Production Hardening

---

# Learning Objectives

By the end of this chapter, your cloud environment should implement:

* Secure cloud architecture
* Zero Trust networking
* IAM least privilege
* Infrastructure as Code security
* Secure Docker images
* Kubernetes hardening
* GitHub Actions security
* Secret management
* Secure deployments
* Supply chain protection
* Continuous vulnerability scanning
* Runtime monitoring
* Disaster recovery
* Business continuity

---

# Cloud Threat Landscape

Modern attackers target:

* AWS Accounts
* Azure Subscriptions
* Google Cloud Projects
* Kubernetes Clusters
* Docker Registries
* Terraform State Files
* CI/CD Pipelines
* GitHub Secrets
* API Keys
* Cloud Metadata Services
* Object Storage
* IAM Roles

Infrastructure is now one of the largest attack surfaces.

---

# Secure Cloud Architecture

A production environment should resemble:

```text
Internet
        │
        ▼
CDN (CloudFront / Cloudflare)
        │
        ▼
Web Application Firewall (WAF)
        │
        ▼
Load Balancer
        │
        ▼
Private Application Subnets
        │
        ▼
Private Database Subnets
        │
        ▼
Encrypted Storage
```

Sensitive resources should never be directly exposed to the public Internet unless absolutely required.

---

# Principle #1

# Zero Trust Infrastructure

Never assume:

* Internal traffic is trusted.
* Private networks are safe.
* Microservices are trustworthy by default.

Every request should require:

* Authentication
* Authorization
* Encryption
* Logging

Zero Trust applies inside your infrastructure as well.

---

# Principle #2

# IAM Least Privilege

Never use:

```text
AdministratorAccess
```

for production services.

Instead create narrowly scoped roles.

Example:

AI Worker

Allowed:

* Invoke Bedrock
* Read AI configuration

Denied:

* Delete databases
* Manage IAM
* Access billing

Every service should have a dedicated identity with only the permissions it requires.

---

# Principle #3

# Secret Management

Never store:

* AWS Keys
* Azure Secrets
* Google Credentials
* OpenAI Keys
* Stripe Secrets
* JWT Secrets

Inside:

* Git
* Docker Images
* Terraform Files
* JavaScript
* Python
* CI Logs

Use:

* AWS Secrets Manager
* Azure Key Vault
* Google Secret Manager
* HashiCorp Vault

Rotate secrets automatically.

---

# Principle #4

# Infrastructure as Code (IaC)

All infrastructure should be version controlled.

Supported tools:

* Terraform
* OpenTofu
* AWS CloudFormation
* Pulumi
* Azure Bicep

Review IaC changes through pull requests.

Scan templates for security issues before deployment.

---

# Principle #5

# Docker Security

Never build containers as:

```dockerfile
USER root
```

Best practices:

* Use minimal base images.
* Pin image versions.
* Remove unnecessary packages.
* Run as a non-root user.
* Mark filesystems read-only where possible.
* Drop unnecessary Linux capabilities.
* Scan images for vulnerabilities before deployment.

---

# Principle #6

# Kubernetes Security

Protect:

* API Server
* etcd
* Nodes
* Pods
* Secrets
* Service Accounts

Implement:

* RBAC
* Network Policies
* Pod Security Standards
* Admission Controllers
* Resource Limits
* Image Signature Verification

Never expose the Kubernetes dashboard publicly.

---

# Principle #7

# CI/CD Security

Every pipeline should include:

Source

↓

Dependency Scan

↓

Secret Scan

↓

Static Analysis (SAST)

↓

Unit Tests

↓

Container Scan

↓

Infrastructure Scan

↓

Build

↓

Artifact Signing

↓

Deploy

↓

Runtime Monitoring

Security is part of the pipeline—not an afterthought.

---

# Principle #8

# GitHub Actions Security

Protect:

* Repository secrets
* Workflow permissions
* Third-party actions
* Pull request triggers

Recommendations:

* Pin actions by commit SHA where practical.
* Minimize `GITHUB_TOKEN` permissions.
* Use OpenID Connect (OIDC) for cloud authentication instead of long-lived credentials.
* Restrict workflows from forks when appropriate.

---

# Principle #9

# Software Supply Chain Security

Every dependency is a potential attack vector.

Maintain:

* Software Bill of Materials (SBOM)
* Dependency inventory
* Vulnerability reports
* License reviews

Verify the integrity and provenance of build artifacts where possible.

---

# Principle #10

# Artifact Signing

Build artifacts should be signed before deployment.

Examples:

* Containers
* Binaries
* Packages
* Release archives

Deployment systems should verify signatures before execution.

---

# Principle #11

# Runtime Security

Monitor production for:

* Unexpected processes
* Privilege escalation
* Suspicious network traffic
* Crypto-mining activity
* Unauthorized shell access
* Container escapes

Runtime monitoring complements preventive controls.

---

# Principle #12

# Cloud Storage Security

Protect:

* S3 Buckets
* Azure Blob Storage
* Google Cloud Storage

Requirements:

* Encryption
* Versioning
* Access policies
* Logging
* Lifecycle management

Public access should be explicitly reviewed and justified.

---

# Principle #13

# Network Segmentation

Separate:

* Public workloads
* APIs
* Internal services
* Databases
* AI infrastructure
* Administrative systems

Use security groups, network ACLs, firewalls, and service meshes where appropriate.

---

# Principle #14

# Infrastructure Logging

Log:

* IAM changes
* Security group changes
* Secret access
* Deployment events
* Login events
* Configuration changes
* Container creation
* Cluster changes

Protect logs from unauthorized modification.

---

# Principle #15

# Infrastructure Monitoring

Monitor:

* CPU
* Memory
* Disk
* Network
* Failed authentication
* IAM anomalies
* Secret access
* Unexpected deployments
* AI infrastructure health

Alert on suspicious behavior.

---

# Principle #16

# Backup & Disaster Recovery

Implement:

* Automated backups
* Encryption
* Cross-region replication (where appropriate)
* Restore testing
* Recovery documentation

A backup that has never been restored is not yet proven.

---

# Principle #17

# Business Continuity

Prepare for:

* Cloud outages
* Region failures
* Database failures
* Certificate expiration
* Secret compromise
* Supply chain attacks

Document recovery procedures and responsibilities.

---

# Principle #18

# Production Hardening

Disable:

* Debug endpoints
* Sample applications
* Default accounts
* Unused services
* Unnecessary ports

Patch operating systems and dependencies promptly.

---

# Principle #19

# Infrastructure Compliance

Evaluate infrastructure against:

* CIS Benchmarks
* NIST SSDF
* ISO 27001
* SOC 2 (where applicable)
* PCI DSS (for payment systems)
* HIPAA (where applicable)

Compliance does not replace security, but it provides a useful baseline.

---

# Principle #20

# Continuous Security

Security is not a one-time audit.

Continuously perform:

* Dependency updates
* Secret rotation
* Penetration testing
* Vulnerability scanning
* Container scanning
* Infrastructure scanning
* Configuration drift detection
* Incident response exercises

---

# Cloud Security Checklist

Every production environment should answer **YES**:

* IAM follows least privilege?
* Secrets stored in a secrets manager?
* Infrastructure defined as code?
* Containers hardened?
* Kubernetes RBAC enabled?
* CI/CD includes security gates?
* Dependencies scanned?
* Artifacts signed?
* Storage encrypted?
* Runtime monitored?
* Backups tested?
* Disaster recovery documented?
* Continuous scanning enabled?

---

# Master Antigravity Prompt

```text
Act as a Principal Cloud Security and DevSecOps Architect.

Perform a complete security assessment of my production infrastructure.

Review:

• AWS
• Azure
• Google Cloud
• Docker
• Kubernetes
• Terraform
• OpenTofu
• GitHub Actions
• GitLab CI
• Azure DevOps
• Cloud Storage
• IAM
• Networking
• Secrets
• AI Infrastructure

Audit for:

1. IAM Misconfiguration
2. Public Resources
3. Secret Exposure
4. Container Vulnerabilities
5. Kubernetes Weaknesses
6. Supply Chain Risks
7. CI/CD Security Gaps
8. Infrastructure Drift
9. Runtime Risks
10. Backup Weaknesses
11. Disaster Recovery Readiness
12. AI Infrastructure Risks

Implement:

• Least Privilege IAM
• Zero Trust Networking
• Secure Secret Management
• Infrastructure as Code Security
• Container Hardening
• Kubernetes Hardening
• Secure CI/CD Pipelines
• Dependency Scanning
• Secret Scanning
• SAST
• DAST
• Artifact Signing
• SBOM Generation
• Runtime Monitoring
• Infrastructure Logging
• Disaster Recovery
• Continuous Compliance

Generate:

1. Cloud Architecture Review
2. Infrastructure Threat Model
3. DevSecOps Pipeline
4. Production Hardening Checklist
5. Compliance Gap Analysis
6. Infrastructure Penetration Test Checklist

Follow:

• CIS Benchmarks
• NIST SSDF
• NIST Cybersecurity Framework (CSF)
• OWASP ASVS
• SLSA
• Supply-chain Levels for Software Artifacts
```

---

# Red Team Testing

Attempt to:

* Access cloud resources with over-privileged IAM roles.
* Retrieve secrets from CI/CD logs.
* Pull vulnerable container images.
* Exploit exposed Kubernetes dashboards.
* Abuse cloud metadata services.
* Enumerate object storage buckets.
* Modify Infrastructure as Code without review.
* Introduce malicious dependencies into the build pipeline.
* Bypass deployment approval gates.
* Trigger unauthorized production deployments.

Every attempt should be blocked, logged, or require explicit authorization.

---

# Production Acceptance Criteria

A cloud environment is considered production-ready only if:

* IAM follows least privilege and avoids broad administrative permissions.
* Secrets are managed through dedicated secret-management systems.
* Infrastructure is defined, reviewed, and deployed through Infrastructure as Code.
* Containers run with minimal privileges and are vulnerability-scanned.
* Kubernetes clusters enforce RBAC, network policies, and workload isolation.
* CI/CD pipelines include automated security checks before deployment.
* Software dependencies are inventoried, scanned, and monitored.
* Build artifacts are signed and verified.
* Storage is encrypted and access-controlled.
* Runtime activity is monitored for anomalous behavior.
* Backup and disaster recovery procedures are tested.
* Infrastructure aligns with **CIS Benchmarks**, **NIST CSF**, **NIST SSDF**, **SLSA**, and relevant cloud-provider security best practices.

---

# Chapter Summary

Infrastructure is part of the application. Security controls cannot stop at the API or database—they must extend through identity, networking, compute, storage, deployment pipelines, and operational processes. Modern DevSecOps embeds security into every stage of the software lifecycle, from infrastructure definition to runtime monitoring. Cloud environments should be designed for resilience, least privilege, continuous verification, and rapid recovery.

---

**End of Chapter 8**
