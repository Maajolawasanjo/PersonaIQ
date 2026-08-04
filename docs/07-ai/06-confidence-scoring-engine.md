# PersonaIQ

# Confidence Scoring Engine

Document ID
PIQ-AI-006

Version
1.0

Status
Production Architecture

Owner
AI Engineering

Classification
Proprietary Confidence Intelligence System

---

# Overview

The Confidence Scoring Engine measures the reliability of every AI-generated output inside PersonaIQ.

Rather than assuming every recommendation is equally trustworthy, PersonaIQ evaluates the quality of the underlying evidence before assigning a confidence level.

Every insight, recommendation, Presence Index™, and Presence Plan™ includes a confidence score.

Confidence is not a prediction of user success.

Confidence represents PersonaIQ's certainty that the recommendation is appropriate based on the available information.

---

# Philosophy

Good AI does not only answer questions.

Good AI communicates uncertainty.

PersonaIQ intentionally exposes confidence because transparency builds trust.

High confidence means
"We have strong evidence."

Low confidence means
"We need better information."

---

# Engine Position

```text
Journey
↓
Skin AI
↓
Virtual Try-On
↓
Persona Engine™
↓
Confidence Engine
↓
Explainability Engine
↓
Presence Plan™
```

Confidence is calculated after reasoning but before presentation.

---

# Responsibilities

The Confidence Engine is responsible for:
- Measuring input quality
- Measuring provider confidence
- Measuring reasoning quality
- Measuring workflow completeness
- Detecting uncertainty
- Assigning confidence labels
- Supporting explainability
- Influencing recommendation priority

---

# Confidence Scale

95–100: Very High Confidence
PersonaIQ is highly certain.

85–94: High Confidence
Recommendations are reliable.

70–84: Moderate Confidence
Minor uncertainty exists.

50–69: Low Confidence
Additional information would improve reliability.

0–49: Very Low Confidence
PersonaIQ recommends collecting more data before acting.

---

# Confidence Dimensions

The final confidence score combines several independent dimensions.

---

## 1. Image Quality

Weight: 30%

Measured using:
- Resolution
- Sharpness
- Lighting
- Face Visibility
- Occlusion
- Image Compression
- Blur

Example:
High-resolution selfie ↓ 98%
Low-light blurry image ↓ 55%

---

## 2. AI Provider Confidence

Weight: 25%

Collected directly from:
- YouCam
- Gemini
- Future providers

Normalized ↓ 0–100

---

## 3. Context Completeness

Weight: 15%

Measured from:
- Journey Details
- Industry
- Event
- Dress Code
- Goals

Missing information reduces confidence.

---

## 4. Cross-System Agreement

Weight: 15%

Measures agreement between:
- Skin Analysis
- Virtual Try-On
- Persona Engine
- Gemini
- Future Consensus Engine

Higher agreement ↓ Higher confidence

---

## 5. Workflow Integrity

Weight: 10%

Checks:
- Completed workflow
- No provider failures
- No retries
- No partial analysis
- No fallback logic

---

## 6. Historical Stability

Weight: 5%
(Future Feature)

Measures:
- Consistency
- Repeat analysis
- Historical trends

Currently inactive in MVP.

---

# Base Formula

```text
Confidence
=
Image Quality × 0.30
+
Provider Confidence × 0.25
+
Context Completeness × 0.15
+
Cross-System Agreement × 0.15
+
Workflow Integrity × 0.10
+
Historical Stability × 0.05
```

Produces: Overall Confidence Score

---

# Recommendation Confidence

Every recommendation receives its own confidence score.

Example:
Improve Lighting: 98%
Hydrate Before Interview: 95%
Wear Navy Blazer: 91%
Try Different Tie: 72%

Confidence is recommendation-specific.

---

# Presence Plan Confidence

The overall Presence Plan confidence is calculated from:
Average Recommendation Confidence
↓
Adjusted by
Workflow Confidence
↓
Presence Plan Confidence

---

# Confidence Labels

95–100: Verified
90–94: Highly Reliable
80–89: Reliable
70–79: Reasonably Reliable
60–69: Limited Confidence
Below 60: Insufficient Confidence

These labels appear in the UI.

---

# Confidence Penalties

Penalty Rules:
- Low Image Quality: −15
- Missing Outfit: −12
- Missing Selfie: −20
- Provider Retry: −5
- Fallback Logic Used: −8
- Unknown Context: −10

Penalties never reduce confidence below zero.

---

# Confidence Bonuses

- Excellent Image: +5
- Complete Journey: +4
- High Provider Agreement: +6
- Professional Context Match: +3

Bonuses are capped.

---

# Confidence Heat Map

Every Presence Plan includes:

```text
Appearance             ██████████  98%
Style                  █████████░  91%
Context                ██████████  95%
Preparation            ████████░░  82%
Professional Alignment █████████░  90%
```

This allows users to see where confidence is strongest.

---

# Confidence API

Example:

```json
{
  "overallConfidence": 93,
  "label": "Highly Reliable",
  "dimensions": {
    "imageQuality": 96,
    "providerConfidence": 94,
    "contextCompleteness": 90,
    "agreement": 91,
    "workflowIntegrity": 100
  }
}
```

---

# Confidence Influence

Confidence affects:
Recommendation Ranking
↓
Priority
↓
Visual Emphasis
↓
Warnings

Low-confidence recommendations are still shown but visually identified.

---

# UI Integration

- High Confidence: Green Badge
- Medium Confidence: Amber Badge
- Low Confidence: Gray Badge
- Very Low Confidence: Warning Banner

Users immediately understand reliability.

---

# Explainability Integration

Every recommendation explains:
- Why confidence is high
- or Why confidence is low

Example:
"Confidence is lower because the uploaded image has poor lighting."

---

# Monitoring

Track:
- Average Confidence
- Low Confidence Rate
- Provider Confidence Trends
- Workflow Failures
- Image Quality Distribution
- Agreement Scores

Useful for improving the platform over time.

---

# Future Consensus Engine

Future versions may compare:
Gemini
Claude
OpenAI
↓
Agreement Score
↓
Confidence Adjustment

Multi-model agreement increases confidence.

---

# Architectural Rules

✓ Confidence is independent of recommendation quality
✓ Every recommendation receives confidence
✓ Confidence is explainable
✓ Confidence influences prioritization
✓ Confidence is versioned
✓ Confidence never hides uncertainty
✓ Confidence remains provider-independent
✓ Confidence is reproducible

---

# Definition of Done

✓ Confidence algorithm defined
✓ Weighted scoring model documented
✓ Recommendation confidence supported
✓ Presence Plan confidence supported
✓ UI visualization specified
✓ Explainability integrated
✓ Monitoring strategy documented
✓ Future consensus model supported
✓ Transparent confidence methodology established
✓ Production-ready confidence engine complete
