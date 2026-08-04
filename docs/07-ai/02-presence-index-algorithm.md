# PersonaIQ

# Presence Index™ Algorithm

Document ID
PIQ-AI-002

Version
1.0

Status
Core AI Algorithm

Owner
AI Engineering

Classification
Proprietary Scoring Algorithm

---

# Overview

The Presence Index™ is PersonaIQ's proprietary readiness score.

It measures how prepared a user is to create the strongest possible first impression for a specific event.

The Presence Index is **context-aware**.

A score of 90 for a software engineering interview does not necessarily mean the same thing as a score of 90 for a wedding or an investor pitch.

The score is always calculated relative to the user's journey.

Range
0 — 100

Higher score
↓
Better preparation
↓
Higher confidence
↓
Stronger first impression

---

# Philosophy

The Presence Index does not measure beauty.

It measures preparation.

The algorithm intentionally avoids judging immutable physical characteristics.

Instead it evaluates:
- Preparation
- Context
- Professional alignment
- Presentation
- Decision quality

The objective is to help users improve—not compare them with others.

---

# Core Equation

```text
Presence Index
=
Context Score
+
Appearance Score
+
Style Score
+
Preparation Score
+
Professional Alignment Score
↓
Normalized
↓
Confidence Adjusted
↓
Final Presence Index
```

---

# Stage 1: Raw Dimension Scores

Five dimensions contribute to the final score.

---

## 1. Appearance Score

Weight
30%

Purpose
Measure facial presentation using Skin AI.

Inputs
- Hydration
- Brightness
- Texture
- Oil Balance
- Redness
- Dark Circles
- Pores
- Acne

Normalization
0–100

---

## 2. Style Score

Weight
25%

Purpose
Evaluate outfit quality.

Inputs
- Virtual Try-On
- Fit
- Color Harmony
- Professionalism
- Visual Balance
- Outfit Confidence

---

## 3. Context Score

Weight
20%

Purpose
Evaluate suitability for the event.

Inputs
- Event Type
- Industry
- Dress Code
- Location
- Weather (future)
- Time of Day
- Importance

Example
Formal Interview
↓
Suit
↓
Higher Context Score

Same Suit
↓
Beach Wedding
↓
Lower Context Score

---

## 4. Preparation Score

Weight
15%

Purpose
Measure completion readiness.

Factors
- Journey Completion
- Checklist Progress
- Image Quality
- Recommendation Completion
- Missing Information

---

## 5. Professional Alignment Score

Weight
10%

Purpose
Evaluate alignment with industry expectations.

Examples
- Technology (Business Casual)
- Finance (Executive)
- Healthcare (Clinical)
- Creative (Expressive)
- Legal (Formal)

---

# Base Formula

```text
Presence
=
Appearance × 0.30
+
Style × 0.25
+
Context × 0.20
+
Preparation × 0.15
+
Professional × 0.10
```

Produces
Raw Presence Score

---

# Stage 2: Confidence Adjustment

Every AI result has confidence.

The final score is multiplied by an overall confidence coefficient.

Example
```text
Raw Score: 91
Confidence: 96%
↓
Adjusted Score: 87.4
```

This prevents low-quality images from producing misleadingly high scores.

---

# Confidence Inputs

- Image Quality
- Provider Confidence
- Journey Completeness
- Cross-Model Agreement
- Processing Success

Each contributes independently.

---

# Stage 3: Penalty Engine

The algorithm applies penalties where critical information is missing.

Examples
- Missing Selfie: -20
- Missing Outfit: -15
- Incomplete Journey: -10
- Low Resolution Image: -8
- Low Confidence Analysis: Dynamic

Penalties are capped to avoid excessive score reduction.

---

# Stage 4: Bonus Engine

Positive behavior is rewarded.

Examples
- Completed Checklist: +2
- High Image Quality: +3
- Excellent Context Match: +4
- Professional Outfit Match: +3

Maximum bonus: 10 points

---

# Stage 5: Normalization

After adjustments

Clamp
0
↓
100

No score may exceed 100.
No score may fall below 0.

---

# Presence Levels

95–100: Exceptional
Ready for the event. Minimal improvements remain.

85–94: Excellent
Strong presentation. Minor refinements suggested.

70–84: Good
Well prepared. Several improvements available.

55–69: Needs Improvement
Important recommendations remain.

40–54: Significant Improvements Needed
Presentation may not match event expectations.

0–39: Preparation Incomplete
Journey should continue before relying on recommendations.

---

# Dimension Breakdown

Users never see only one score.
Dashboard displays:
- Appearance
- Style
- Context
- Preparation
- Professional Alignment
- Overall Presence

This increases transparency.

---

# Trend Tracking

Every journey stores:
Previous Presence Index
↓
Current Presence Index
↓
Improvement

Example
Initial: 72
Final: 91
Improvement: +19

Users visualize progress instead of only final performance.

---

# Confidence Display

Confidence is separate from score.

Example 1
Presence Index: 92
Confidence: 97%

Example 2
Presence Index: 92
Confidence: 61%

The interface explains why confidence differs.

---

# Recommendation Impact Estimation

Each recommendation predicts expected gain.

Example
- Steam Jacket: +2
- Improve Lighting: +3
- Change Shirt: +5
- Hydrate: +1

Users understand the value of each action.

---

# Calibration Rules

The algorithm is deterministic.

Same inputs
↓
Same score

No randomness.
Future machine learning may refine weights without changing the external scoring scale.

---

# Fairness Principles

The algorithm must never score based on:
- Race
- Ethnicity
- Gender
- Age
- Facial attractiveness
- Body shape
- Medical conditions

Scoring focuses exclusively on preparation and contextual presentation.

---

# Future Inputs

- Hair Analysis
- Accessory Analysis
- Voice Confidence
- Facial Expression
- Posture
- Body Language
- Wardrobe History
- Calendar Context
- Weather Context

Each future input receives its own calibrated weight.

---

# Explainability

Every score is decomposable.

Users can inspect:
- Why they received the score.
- Which dimensions contributed most.
- Which actions will improve it.

The Presence Index is never a black box.

---

# Versioning

Every Presence Plan stores:
- Algorithm Version
- Weight Configuration
- Provider Versions

This guarantees reproducibility.

---

# Success Metrics

- Average Improvement
- Recommendation Acceptance Rate
- Journey Completion Rate
- Confidence Accuracy
- User Satisfaction
- Repeat Usage

---

# Implementation Architecture: Versioned Configuration

To ensure the Presence Index™ acts as a **versioned scoring engine** rather than a hardcoded formula, all weights, penalties, and bonuses are decoupled from the code and managed via configuration:

```yaml
algorithm_version: 1.0.0

weights:
  appearance: 0.30
  style: 0.25
  context: 0.20
  preparation: 0.15
  professional_alignment: 0.10

penalties:
  missing_selfie: -20
  missing_outfit: -15
  incomplete_journey: -10

bonuses:
  high_image_quality: 3
  checklist_completed: 2
```

The Persona Engine loads the active configuration at runtime. This enables experimentation, A/B testing, and future algorithm improvements while preserving historical reproducibility. Every saved Presence Plan records the algorithm version used, ensuring that a score generated today can always be reproduced later. This is a standard pattern for production recommendation and ranking systems.

---

# Architectural Rules

✓ Context-aware scoring
✓ Confidence-adjusted output
✓ Transparent calculations
✓ Deterministic behavior
✓ Explainable results
✓ Provider-independent
✓ Fairness-first
✓ Extensible weighting model
✓ Immutable scoring history

---

# Definition of Done

✓ Multi-stage scoring algorithm defined
✓ Weighted dimension model established
✓ Confidence adjustment integrated
✓ Penalty and bonus systems specified
✓ Transparent scoring philosophy
✓ Fairness principles documented
✓ Trend tracking supported
✓ Versioning strategy defined
✓ Future extensibility ensured
✓ Proprietary Presence Index™ fully specified
