# PersonaIQ

# Explainability Engine™

Document ID
PIQ-AI-007

Version
1.0

Status
Production Architecture

Owner
AI Engineering

Classification
Proprietary Explainable AI (XAI) System

---

# Overview

The Explainability Engine™ transforms AI outputs into transparent, evidence-based recommendations.

Rather than simply presenting advice, PersonaIQ explains:
• What was observed
• Why it matters
• How it affects the user's Presence Index™
• What action should be taken
• How much improvement is expected
• How confident PersonaIQ is

The Explainability Engine ensures that every recommendation is understandable, defensible, and actionable.

---

# Vision

Users should never have to ask
"Why did the AI say this?"

Every recommendation should answer that question automatically.

PersonaIQ explains its reasoning as naturally as a trusted professional consultant.

---

# Core Philosophy

Evidence
↓
Reasoning
↓
Recommendation
↓
Expected Impact
↓
Confidence
↓
Action

Transparency is a feature.

---

# Responsibilities

The Explainability Engine:
• Explains every recommendation
• References supporting evidence
• Identifies assumptions
• Communicates uncertainty
• Estimates expected improvement
• Generates user-friendly language
• Produces audit-ready reasoning

---

# Position in AI Pipeline

```text
Journey
↓
Skin Analysis
↓
Virtual Try-On
↓
Persona Engine™
↓
Presence Index™
↓
Confidence Engine™
↓
Explainability Engine™
↓
Presence Plan™
```

Explainability is always the final reasoning stage before presentation.

---

# Explainability Framework

Every recommendation contains six required sections.

---

## 1. Observation

What PersonaIQ detected.

Example
"Your outfit color contrasts well with your skin tone, but the jacket appears too casual for a formal interview."

Observation must always come directly from validated AI outputs.

---

## 2. Evidence

Evidence supporting the observation.

Example
Skin Analysis
↓
Professional Match
↓
Journey Context
↓
Color Harmony
↓
Presence Score

No unsupported statements.

---

## 3. Reasoning

Explain why the recommendation exists.

Example
"Software engineering interviews typically favor business casual attire because it communicates professionalism while remaining approachable."

Reasoning connects evidence with the recommendation.

---

## 4. Recommendation

The specific action.

Example
Replace hoodie
↓
Wear navy blazer
↓
Estimated improvement
+6 Presence Points

Recommendations must always be actionable.

---

## 5. Expected Outcome

Explain what improves.

Examples
Higher professional appearance
Improved first impression
Better context alignment
Higher Presence Index™
More confidence

---

## 6. Confidence

Explain confidence.

Example
Confidence: 94%
Reason:
Image quality excellent
Journey complete
Provider agreement high
No workflow failures

---

# Recommendation Template

Every recommendation follows one structure.

```yaml
Observation:
Evidence:
Reasoning:
Recommendation:
Expected Impact:
Estimated Gain:
Confidence:
Next Action:
```

This template is universal.

---

# Explainability Levels

## Basic
Simple explanation.
Used for:
Quick cards
Notifications

---

## Standard
Default mode.
Includes:
Observation
Reasoning
Recommendation
Confidence

---

## Detailed
Used inside:
Presence Report
Includes:
Supporting metrics
Evidence
Scores
Expected gains
Tradeoffs

---

## Technical
Future mode.
Shows:
Raw metrics
Provider outputs
Prompt version
Algorithm version
Confidence breakdown

Useful for enterprise customers.

---

# Explainability Categories

## Skin
Explains:
Hydration
Texture
Brightness
Oil balance
Dark circles

Example:
"Hydration scored below optimal levels. Increasing hydration may improve skin appearance before your event."

---

## Outfit
Explains:
Color
Fit
Context
Professionalism
Style

Example:
"The navy blazer aligns better with the interview dress code than the hoodie."

---

## Context
Explains:
Event
Industry
Location
Formality
Professional expectations

---

## Presence
Explains:
Overall score
Dimension scores
Strengths
Weaknesses
Improvement opportunities

---

# Recommendation Evidence Chain

```text
User Upload
↓
YouCam
↓
Normalized DTO
↓
Persona Engine™
↓
Presence Index™
↓
Explainability Engine™
↓
User
```

Every recommendation is traceable.

---

# Traceability

Every recommendation stores:
- Recommendation ID
- Evidence IDs
- Prompt Version
- Algorithm Version
- Provider Version
- Confidence Version
- Workflow Version

Historical explanations remain reproducible.

---

# Contradiction Detection

The engine detects conflicting recommendations.

Example:
Recommendation A: Wear brighter colors
Recommendation B: Wear darker colors
↓
Conflict Detection
↓
Resolve
↓
Present only one recommendation

---

# Duplicate Detection

Multiple AI components may produce identical advice.

Example:
Gemini ↓ Wear blazer
Persona Engine ↓ Wear blazer
↓
Merge
↓
Single recommendation
↓
Higher confidence

---

# Trade-off Analysis

Some recommendations compete.

Example
Formal Suit
↓
Professional Score +8
Comfort −2

PersonaIQ explains both benefits and trade-offs.

---

# Impact Estimation

Each recommendation predicts:
- Presence Increase
- Confidence Increase
- Professional Alignment
- Preparation Time
- Difficulty

Example

```text
Steam Shirt
Difficulty: Low
Time: 10 minutes
Presence Gain: +2
Confidence: 98%
```

---

# User Personalization

Explanation language adapts to user experience.

Student ↓ Simple
Professional ↓ Business language
Executive ↓ Strategic language

Future support includes tone preferences.

---

# Accessibility

Every explanation supports:
- Screen readers
- Plain language
- Color-independent indicators
- Readable typography
- Keyboard navigation
- High contrast mode

---

# Export Support

Explainability is preserved in:
- PDF
- Markdown
- Email
- Presentation
- Printable report
- API responses

---

# Performance

Target generation time: <500 ms
Maximum explanation length: 250 words
Summary version: 75 words
Quick version: 25 words

---

# Explainability API

Example

```json
{
  "recommendation": "Wear a navy blazer",
  "observation": "Current outfit is too casual.",
  "reasoning": "The selected journey is a formal interview.",
  "impact": "+6 Presence Points",
  "confidence": 95,
  "nextAction": "Replace hoodie before the interview."
}
```

---

# Future Features

- Interactive explanations
- Voice explanations
- Multi-language explanations
- AI chat follow-up
- "What if?" simulations
- Recommendation comparisons
- Timeline simulations
- Before/After analysis
- Enterprise audit reports
- LLM consensus explanations

---

# Architectural Rules

✓ Every recommendation must be explained
✓ Evidence required
✓ Confidence required
✓ No unsupported claims
✓ No medical diagnoses
✓ No black-box reasoning
✓ Recommendations remain traceable
✓ Version every explanation
✓ Support future AI providers
✓ Support enterprise auditing

---

# Definition of Done

✓ Explainability framework defined
✓ Recommendation template standardized
✓ Evidence chain documented
✓ Traceability supported
✓ Conflict detection specified
✓ Duplicate detection supported
✓ Trade-off analysis included
✓ Personalization strategy documented
✓ Export support defined
✓ Production-ready Explainable AI architecture complete
