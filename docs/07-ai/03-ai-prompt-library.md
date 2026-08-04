# PersonaIQ

# AI Prompt Library

Document ID
PIQ-AI-003

Version
1.0

Status
Production Architecture

Owner
AI Engineering

Classification
Proprietary Prompt System

---

# Purpose

The AI Prompt Library is the centralized repository of all prompts used by PersonaIQ.

Every interaction with an LLM must originate from this library.

No prompt should be hardcoded inside backend services, controllers, or frontend components.

Prompts are treated as version-controlled software assets.

---

# Philosophy

PersonaIQ does not ask AI random questions.

It executes structured reasoning workflows.

Every prompt has:
- One objective
- One expected output
- One JSON schema
- One version
- One owner

This guarantees predictable, reproducible AI behavior.

---

# Prompt Architecture

```text
Persona Engine™
↓
Prompt Engine
↓
Prompt Template
↓
Variable Injection
↓
Provider Adapter
↓
Gemini
↓
JSON Validation
↓
Persona Engine
```

The Prompt Engine is the only component allowed to communicate with LLMs.

---

# Prompt Categories

- System Prompts
- Journey Analysis
- Skin Reasoning
- Outfit Reasoning
- Presence Planning
- Recommendation Generation
- Checklist Generation
- Summary Generation
- Explanation Generation
- Export Generation
- Fallback Prompts
- Evaluation Prompts

---

# Folder Structure

```
packages/
  prompts/
    system/
    journey/
    skin/
    outfit/
    presence/
    recommendations/
    checklists/
    exports/
    evaluation/
    schemas/
    examples/
```

Every prompt is stored independently.

---

# Prompt Metadata

Every prompt contains:

```yaml
id:
version:
owner:
description:
provider:
temperature:
max_tokens:
output_schema:
```

Example

```yaml
id: journey-analysis
version: 1.0.0
provider: gemini
temperature: 0.3
output: JourneyAnalysisDTO
```

---

# Prompt Lifecycle

Draft
↓
Review
↓
Testing
↓
Production
↓
Archived

Every modification increments the prompt version.

---

# System Prompt

Purpose
Define PersonaIQ's identity.

Example Responsibilities
- Professional stylist
- Presentation strategist
- Career coach
- Confidence advisor

Never
- Diagnose medical conditions
- Make discriminatory recommendations
- Recommend harmful actions
- Criticize physical appearance

---

# Journey Analysis Prompt

Purpose
Understand user intent.

Input
JourneyDTO

Output
JourneyAnalysisDTO

Should infer
- Event
- Industry
- Importance
- Expected Appearance
- Professional Tone
- Preparation Priorities

---

# Skin Reasoning Prompt

Purpose
Interpret normalized Skin AI results.

Input
SkinAnalysisDTO

Output
SkinInsightsDTO

Responsibilities
- Highlight strengths
- Identify improvement opportunities
- Prioritize actionable advice
- Avoid medical diagnosis
- Use supportive language

---

# Outfit Reasoning Prompt

Purpose
Compare outfits.

Input
OutfitComparisonDTO

Output
OutfitRecommendationDTO

Must explain
- Why Outfit A ranks higher
- Context compatibility
- Color harmony
- Professional appropriateness
- Confidence

---

# Presence Planning Prompt

Purpose
Generate the complete Presence Plan™.

Input
- Journey
- Skin
- Outfit
- Presence Score

Output
PresencePlanDTO

Must include
- Executive Summary
- Preparation Strategy
- Top Priorities
- Expected Improvements

---

# Recommendation Prompt

Purpose
Generate ranked recommendations.

Each recommendation contains:
- Title
- Description
- Reason
- Expected Impact
- Estimated Time
- Difficulty
- Confidence
- Priority

Output
RecommendationDTO[]

---

# Checklist Prompt

Purpose
Convert recommendations into actionable tasks.

Example
- Steam blazer
- Hydrate
- Charge phone
- Prepare portfolio
- Polish shoes
- Print resume

Each task includes:
- Estimated Duration
- Priority
- Completion State

---

# Executive Summary Prompt

Purpose
Summarize the Presence Plan.

Target Length
150–250 words

Audience
- Busy professionals
- Recruiters
- Students
- Interview candidates
- Conference speakers

---

# Explainability Prompt

Purpose
Explain every recommendation.

Template
- What?
- Why?
- Expected Benefit
- Confidence
- Supporting Evidence
- Next Step

No recommendation is ever returned without explanation.

---

# Export Prompt

Purpose
Generate export-ready reports.

Formats
- PDF
- Email
- Markdown
- Presentation
- Printable Checklist

---

# Evaluation Prompt

Purpose
Internal quality assurance.

Checks
- JSON validity
- Logical consistency
- Recommendation duplication
- Tone consistency
- Missing explanations
- Confidence mismatch

Not shown to users.

---

# Prompt Variables

Supported variables
- {{user}}
- {{journey}}
- {{skin}}
- {{outfit}}
- {{presence_score}}
- {{recommendations}}
- {{industry}}
- {{event}}
- {{confidence}}
- {{language}}

Variables are injected by the Prompt Engine.

---

# Output Contracts

Every prompt returns JSON.
Never Markdown.
Never HTML.
Never free-form paragraphs.

Example

```json
{
  "summary": "...",
  "recommendations": [],
  "confidence": 94
}
```

Validation occurs before returning results.

---

# Prompt Safety

Prompt Injection Protection
- Escaped user input
- Structured variable insertion
- Schema validation
- Output validation
- Forbidden instruction detection
- No direct prompt concatenation.

---

# Prompt Versioning

Every saved Presence Plan stores:
- Prompt Version
- Provider Version
- Algorithm Version
- Model Version

Historical outputs remain reproducible.

---

# Multi-Language Support

Future
- English
- French
- Spanish
- Arabic
- Portuguese

Localization occurs after reasoning.
Reasoning always uses the canonical prompt.

---

# Prompt Testing

Every production prompt requires:
- Unit Tests
- Golden Test Cases
- Schema Validation
- Regression Tests
- Latency Benchmarks
- Output Consistency Checks

---

# Performance Targets

- Average Prompt Latency: < 3 seconds
- Prompt Validation: < 50 ms
- JSON Parsing: < 20 ms
- Retry Rate: < 2%

---

# Future Prompt Types

- Interview Coach
- Networking Coach
- Public Speaking Coach
- Wardrobe Planner
- Travel Preparation
- Calendar Planning
- Hair Advisor
- Accessory Advisor
- Voice Coach
- Behavior Coach

---

# Architectural Rules

✓ Prompts never hardcoded
✓ Version every prompt
✓ JSON-only outputs
✓ Schema validation mandatory
✓ Provider-independent templates
✓ One prompt = one responsibility
✓ Explainability required
✓ Prompt testing mandatory
✓ Historical reproducibility guaranteed

---

# Definition of Done

✓ Central prompt repository defined
✓ Prompt lifecycle established
✓ Prompt versioning documented
✓ JSON contract strategy defined
✓ Validation architecture documented
✓ Prompt security integrated
✓ Multi-language strategy planned
✓ Testing methodology documented
✓ Provider independence maintained
✓ Production-ready AI prompt architecture complete

---

# Architecture Enhancement: Templates vs. Strategies

To ensure the architecture remains highly flexible and maintainable, this implementation explicitly separates **prompt templates** from **prompt strategies**:

*   **Templates**: Define *what* the LLM sees (the exact instructions, variables, and output schemas). They are static assets.
*   **Strategies**: Define *when* and *why* each prompt is executed. This includes how retries work, fallback behaviors, prompt chaining, and conditional branching logic.

This separation keeps the prompt content stable and versionable, while allowing the Persona Engine to evolve its orchestration logic independently. The specifics of these orchestration strategies will be detailed in the AI Workflow Engine documentation.
