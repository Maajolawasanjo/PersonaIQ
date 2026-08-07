# PersonaIQ Operational Production Runbook

## Overview
This runbook governs deployment, database migration management, monitoring threshold alerts, and incident response procedures for the PersonaIQ AI platform in production environments.

---

## 1. Deployment Procedures

### Production Deployment via Docker Compose
```bash
# 1. Clone & checkout production release tag
git checkout main && git pull origin main

# 2. Configure Production Secrets
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# Update JWT_SECRET_KEY, DATABASE_URL, and AI provider credentials in .env

# 3. Execute Database Migrations
docker-compose -f docker-compose.production.yml run --rm api alembic upgrade head

# 4. Boot Production Containers
docker-compose -f docker-compose.production.yml up -d --build
```

---

## 2. Database Migration Management

All schema changes must be versioned under Alembic:
```bash
# Generate new migration script
cd apps/api
alembic revision --autogenerate -m "describe_schema_change"

# Apply migrations
alembic upgrade head

# Rollback single migration step
alembic downgrade -1
```

---

## 3. System Monitoring & Alert Thresholds

| Metric | Warning Threshold | Critical Action |
| :--- | :--- | :--- |
| **API Response Time (p95)** | `> 300ms` | Check DB query execution plan & Redis connection pool |
| **HTTP 5xx Error Rate** | `> 0.5%` | Inspect Sentry exception logs & FastAPI error handler |
| **Database Pool Utilization** | `> 80% (16/20)` | Scale `DB_POOL_SIZE` or add read replicas |
| **Container Memory Usage** | `> 85% RAM` | Restart container & review garbage collection logs |

---

## 4. Incident Response & Rollback Protocol

1. **Service Outage Mitigation**:
   - Verify container health status via `/api/v1/health`.
   - Inspect container logs: `docker-compose -f docker-compose.production.yml logs --tail=100 -f api`.
2. **Instant Rollback**:
   - Revert Git commit: `git revert HEAD && git push origin main`.
   - Re-deploy previous container image build.
