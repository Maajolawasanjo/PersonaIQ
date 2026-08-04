# PersonaIQ

# AI Workflow Engine

Document ID
PIQ-AI-004

Version
1.0

Status
Production Architecture

Owner
AI Engineering

Classification
Proprietary AI Orchestration Layer

---

# Overview

The AI Workflow Engine coordinates every artificial intelligence capability inside PersonaIQ.

Instead of sending one prompt to one model, PersonaIQ executes a structured reasoning pipeline composed of multiple specialized AI services.

Each service performs one responsibility.
Each output is validated.
Each stage enriches the next.
The final result is a complete Presence Plan™.

---

# Philosophy

Small Intelligence
↓
Specialized Tasks
↓
Structured Outputs
↓
Validated Results
↓
Collective Intelligence

PersonaIQ never relies on a single AI response.
It builds intelligence progressively.

---

# High-Level Workflow

```text
User
↓
Journey Creation
↓
Image Upload
↓
Image Validation
↓
Skin Analysis
↓
Virtual Try-On
↓
Normalization
↓
Persona Engine™
↓
Presence Index™
↓
Gemini Reasoning
↓
Recommendation Ranking
↓
Explainability
↓
Checklist Generation
↓
Presence Plan™
↓
Dashboard
```

---

# AI Workflow Principles

Every workflow must be:
- Deterministic
- Recoverable
- Observable
- Explainable
- Provider Independent
- Retryable
- Versioned

---

# Stage 1: Journey Collection

Purpose
Collect all context before any AI execution.

Inputs
- Journey
- Industry
- Event
- Dress Code
- Goals
- Location
- Importance

Output
JourneyDTO

---

# Stage 2: Image Processing

Purpose
Validate uploaded media.

Pipeline
```text
Upload
↓
Virus Scan
↓
Metadata Removal
↓
Resize
↓
Compression
↓
Quality Check
↓
Storage
↓
Signed URL
```

Output
ImageDTO

---

# Stage 3: Skin Intelligence

Provider
YouCam Skin AI

Input
Validated Selfie

Output
NormalizedSkinAnalysisDTO

Responsibilities
Analyze:
- Hydration
- Brightness
- Texture
- Oil
- Pores
- Dark Circles
- Acne
- Confidence

---

# Stage 4: Virtual Try-On

Provider
YouCam Apparel VTO

Input
Selfie
Outfit

Output
OutfitComparisonDTO

Produces:
- Visual Preview
- Professional Match
- Context Match
- Fit Confidence
- Style Ranking

---

# Stage 5: Normalization Layer

Purpose
Convert every provider response into PersonaIQ's internal format.

Example
```text
YouCam
↓
Provider Mapper
↓
Normalized DTO
↓
Persona Engine
```

No downstream service ever consumes raw provider JSON.

---

# Stage 6: Persona Engine™

Purpose
Merge all intelligence.

Inputs
- Journey
- Skin
- Outfit
- User Profile
- Professional Standards

Outputs
- Context Analysis
- Recommendation Strategy
- Priority Matrix
- Presence Context

---

# Stage 7: Presence Index™

Purpose
Calculate readiness.

Produces:
- Overall Score
- Dimension Scores
- Trend Data
- Confidence
- Priority Weight

---

# Stage 8: LLM Reasoning

Provider
Gemini

Prompt
Presence Planning Prompt

Responsibilities
Generate:
- Executive Summary
- Professional Advice
- Preparation Strategy
- Improvement Narrative

Return JSON only.

---

# Stage 9: Recommendation Engine

Purpose
Rank every recommendation.

Each recommendation receives:
- Impact
- Difficulty
- Time
- Confidence
- Priority
- Estimated Score Increase

Sorted before presentation.

---

# Stage 10: Checklist Generator

Purpose
Transform recommendations into actionable tasks.

Output
ChecklistDTO

Grouped by:
- Immediate
- Today
- Before Event
- Optional

---

# Stage 11: Explainability Engine

Purpose
Generate reasoning.

Every recommendation includes:
- Why
- Evidence
- Expected Benefit
- Confidence
- Estimated Effort

---

# Stage 12: Presence Plan™

Purpose
Assemble final output.

Contains:
- Presence Score
- Dimension Breakdown
- Executive Summary
- Recommendations
- Checklist
- Insights
- Trend
- Confidence
- Metadata
- Version Numbers

---

# Workflow States

```text
Pending
↓
Running
↓
Completed
↓
Validated
↓
Persisted
```

Failure states:
- Retrying
- Failed
- Cancelled
- Timeout

---

# Retry Policy

Retryable:
- Provider Timeout
- Network Error
- 429 Rate Limit
- Temporary Failure

Not Retryable:
- Validation Error
- Corrupt Upload
- Unsupported Format
- Authorization Failure

Maximum Retries: 3
Exponential Backoff: Enabled

---

# Workflow Persistence

Each stage records:
- Workflow ID
- Current Step
- Start Time
- End Time
- Provider
- Duration
- Status
- Error

This enables resume capability.

---

# Background Processing

Heavy AI operations execute asynchronously.

Queue
```text
Upload
↓
Job Queue
↓
Worker
↓
Provider
↓
Results
↓
Database
↓
Notify UI
```

Workers remain stateless.

---

# Event Architecture

Events:
- JourneyCreated
- ImageUploaded
- SkinCompleted
- VTOCompleted
- PresenceCalculated
- RecommendationsGenerated
- ChecklistCreated
- PlanCompleted

Future:
- NotificationSent
- AnalyticsTracked

---

# Workflow Metadata

Every workflow stores:
- Workflow Version
- Provider Version
- Prompt Version
- Algorithm Version
- Timestamp
- User ID
- Journey ID

This guarantees reproducibility.

---

# Provider Independence

```text
Workflow Engine
↓
Provider Interface
↓
Gemini
Claude
OpenAI
Future Models
```

Changing providers never changes business logic.

---

# Monitoring

Track:
- Execution Time
- Retry Count
- Failure Rate
- Provider Latency
- Average Workflow Duration
- Token Usage
- Workflow Success Rate

---

# Performance Targets

Journey Creation: < 300 ms
Upload Validation: < 2 s
Skin Analysis: < 5 s
VTO: < 6 s
Persona Engine: < 300 ms
Gemini Reasoning: < 4 s
Total Presence Plan: < 15 s

---

# Failure Recovery

If Skin AI fails ↓ Continue workflow ↓ Generate partial Presence Plan
If VTO fails ↓ Continue ↓ Flag missing style analysis
If Gemini fails ↓ Rule-based recommendations ↓ Generate reduced report

PersonaIQ never fails completely because one provider is unavailable.

---

# Future Workflow Extensions

- Real-Time Streaming
- Multi-Agent Collaboration
- Voice Coaching
- Calendar Integration
- Weather Adaptation
- Wardrobe Memory
- Live Camera Mode
- Continuous Presence Tracking
- Interview Simulation
- Personal AI Coach

---

# Architectural Rules

✓ Every workflow is deterministic
✓ Every stage validates outputs
✓ Every provider is isolated
✓ Every response is versioned
✓ Every recommendation is explainable
✓ Workflow state is persisted
✓ Retries are automatic
✓ Failures degrade gracefully
✓ No AI provider directly controls business logic

---

# Definition of Done

✓ Complete AI orchestration defined
✓ Multi-stage workflow documented
✓ Retry strategy specified
✓ Background processing designed
✓ Event architecture documented
✓ Workflow persistence defined
✓ Monitoring strategy documented
✓ Provider independence maintained
✓ Graceful degradation supported
✓ Production-ready AI workflow engine complete

---

# Architecture Enhancement: Event-Driven Workflow Engine

As PersonaIQ grows, this orchestration should evolve into an **event-driven workflow engine** rather than a synchronous pipeline. 

Each stage (Skin Analysis, VTO, Persona Engine, LLM Reasoning, Checklist Generation) becomes an independent worker communicating through events. This enables parallel execution where possible, improves resilience, and makes it easier to introduce new AI capabilities—such as hair analysis or voice coaching—without restructuring the existing pipeline. This architecture aligns well with the long-term vision of PersonaIQ as an extensible AI platform rather than a single-purpose application.
