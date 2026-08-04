# PersonaIQ
# Database Architecture

**Document ID:** PIQ-ENG-005  
**Version:** 1.0  
**Status:** Production Architecture  
**Owner:** Backend Engineering  
**Database:** PostgreSQL 17  
**ORM:** Prisma ORM  
**Migration Tool:** Prisma Migrate  

---

# Purpose
This document defines the complete data architecture for PersonaIQ.
The database is designed around one core philosophy:
> Every Presence Journey is the primary business entity.

Everything else either supports, enriches, or is generated from a Journey.
The schema is normalized, extensible, and optimized for AI-powered workflows while remaining simple enough for rapid hackathon development.

---

# Database Design Principles

## Principle 1: UUID Primary Keys
Every entity uses UUID v7. Never use auto-increment integers.
**Benefits:** Globally unique, Better distributed systems, Easier future synchronization.

## Principle 2: Auditability
Every important entity contains:
- `createdAt`
- `updatedAt`
- `createdBy` (future)
- `deletedAt` (soft delete where applicable)

## Principle 3: Immutable AI Results
AI-generated outputs are snapshots.
If recommendations change, create a new version. Never overwrite history.

## Principle 4: Store References, Not Files
Database stores only metadata. Images, reports and generated assets remain in Object Storage.

---

# High-Level ERD

```text
User
 │
 ├───────────────┐
 │               │
 ▼               ▼
Journey      UserPreference
 │
 ├──────────────┬───────────────┬───────────────┐
 ▼              ▼               ▼               ▼
Event      SelfieUpload    OutfitUpload   PresencePlan
 │                              │
 ▼                              ▼
SkinAnalysis              OutfitComparison
        │                     │
        └──────────┬──────────┘
                   ▼
           Recommendation
                   │
                   ▼
          PreparationChecklist
                   │
                   ▼
               Export
```

---

# Core Entities

## 1. User
Represents an authenticated person.
**Fields:** id, clerkId, email, firstName, lastName, avatarUrl, occupation, country, timezone, onboardingCompleted, createdAt, updatedAt
**Relationships:** User ↓ Many Journeys ↓ Many Exports ↓ One Preference

## 2. UserPreference
Stores personalization.
**Fields:** preferredTheme, preferredLanguage, defaultEventType, notificationSettings, privacySettings, defaultDressCode

## 3. Journey
Primary business entity. Every AI workflow belongs to one Journey.
**Fields:** id, userId, title, status, eventType, industry, eventDate, eventTime, location, dressCode, importance, currentStep, presenceIndex, confidenceScore, completedAt, createdAt, updatedAt
**Status Enum:** DRAFT, ACTIVE, PROCESSING, COMPLETED, ARCHIVED
**Relationships:** Journey ↓ One Event ↓ Many Uploads ↓ One Presence Plan ↓ Many Recommendations ↓ One Skin Analysis ↓ Many Outfit Comparisons

## 4. Event
Separating event information allows future calendar integrations.
**Fields:** id, journeyId, name, category, industry, location, date, time, dressCode, importance, notes

## 5. SelfieUpload
Stores uploaded face image.
**Fields:** id, journeyId, storageUrl, thumbnailUrl, imageWidth, imageHeight, fileSize, mimeType, processingStatus, uploadedAt
**Status:** UPLOADED, VALIDATING, PROCESSING, READY, FAILED

## 6. OutfitUpload
Each uploaded clothing option.
**Fields:** id, journeyId, storageUrl, name, category, displayOrder, uploadedAt, deletedAt
**Relationships:** One Journey ↓ Many Outfit Uploads

## 7. SkinAnalysis
Normalized YouCam output.
**Fields:** id, journeyId, overallScore, hydration, oilBalance, redness, pores, texture, darkCircles, brightness, providerVersion, confidence, rawResponse, processedAt
*(rawResponse stored as JSONB)*

## 8. OutfitComparison
Represents AI-generated outfit evaluation.
**Fields:** id, journeyId, outfitId, vtoImageUrl, ranking, overallScore, eventMatch, professionalism, confidence, providerVersion, generatedAt
**Relationships:** One Journey ↓ Many Outfit Comparisons

## 9. PresencePlan
Final generated result.
**Fields:** id, journeyId, presenceIndex, overallConfidence, recommendedOutfitId, summary, reasoning, version, generatedAt
*(Presence Plans are immutable. Future recalculations create new versions.)*

## 10. Recommendation
Individual recommendation.
**Fields:** id, presencePlanId, priority, title, description, reason, impact, effort, confidence, estimatedMinutes, category, status
**Category Enum:** Appearance, Style, Preparation, Skin, Accessories, Behavior, Timing, Documents
**Status:** TODO, DONE, SKIPPED

## 11. PreparationChecklist
**Fields:** id, recommendationId, label, completed, completedAt, displayOrder

## 12. Export
Tracks generated reports.
**Fields:** id, journeyId, format, storageUrl, generatedAt, downloadCount
**Formats:** PDF, PNG, JPEG

## 13. AnalyticsEvent
Optional. Tracks product usage.
**Fields:** id, userId, journeyId, event, metadata, timestamp
*(Stored as JSONB)*

## 14. AIRequestLog
Useful for debugging. Never expose to users.
**Fields:** id, journeyId, provider, model, latency, status, tokenUsage, errorMessage, createdAt

---

# Prisma Enums
- **UserRole:** USER, ADMIN, SUPER_ADMIN
- **JourneyStatus:** DRAFT, ACTIVE, PROCESSING, COMPLETED, ARCHIVED
- **RecommendationStatus:** TODO, DONE, SKIPPED
- **UploadStatus:** UPLOADED, VALIDATING, PROCESSING, READY, FAILED
- **ExportFormat:** PDF, PNG, JPEG
- **Theme:** LIGHT, DARK, SYSTEM

---

# Database Indexes
- **Users:** email, clerkId
- **Journeys:** userId, status, createdAt DESC, eventDate
- **SkinAnalysis:** journeyId
- **PresencePlan:** journeyId
- **Recommendation:** presencePlanId, priority
- **AnalyticsEvent:** timestamp, event
- **AIRequestLog:** provider, status, createdAt

---

# JSONB Usage
Use JSONB only where schema flexibility is required.
**Allowed:** rawResponse, metadata, notificationSettings, privacySettings
**Never use JSONB for relational data.**

---

# Cascading Rules
Delete User ↓ Soft-delete Journeys ↓ Keep analytics
Delete Journey ↓ Delete uploads ↓ Delete recommendations ↓ Delete exports ↓ Delete AI logs
*(Object storage cleanup runs asynchronously)*

---

# Storage Strategy
- **Database:** Stores metadata.
- **Object Storage:** Stores Selfies, Outfits, Generated reports, VTO images, Exports.
*Never store binaries in PostgreSQL.*

---

# Versioning Strategy
- **PresencePlan:** version (1, 2, 3)
- **Recommendation:** version
- **SkinAnalysis:** providerVersion
- **AIRequestLog:** modelVersion
*Supports future AI model upgrades.*

---

# Audit Strategy
Critical tables maintain: `createdAt`, `updatedAt`, `deletedAt`, `version`.
Future enterprise edition: `createdBy`, `updatedBy`, `deletedBy`.

---

# Performance Targets
- Journey Lookup: <20ms
- Recommendation Lookup: <10ms
- Dashboard Query: <100ms
- History Query: <150ms
*(Indexes should cover all dashboard queries)*

---

# Future Expansion
The schema supports future additions without breaking existing data:
Wardrobe Inventory, Calendar Sync, AI Memory, Voice Coaching, Hair Analysis, Accessory Recommendations, Organization Accounts, Team Workspaces, Enterprise Analytics, Multi-Tenant SaaS.
*No breaking schema redesign should be required.*

---

# Definition of Done
✓ Fully normalized schema  
✓ UUID-first architecture  
✓ Immutable AI outputs  
✓ Object storage separation  
✓ Audit-ready entities  
✓ JSONB used appropriately  
✓ Optimized indexing  
✓ Prisma-compatible  
✓ Enterprise scalable  
✓ Ready for migration generation
