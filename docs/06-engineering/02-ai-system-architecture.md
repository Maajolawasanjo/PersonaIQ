# PersonaIQ
# AI System Architecture

**Document ID:** PIQ-ENG-002  
**Version:** 1.0  
**Status:** Production Architecture  
**Owner:** AI Engineering  

---

# Purpose
This document defines every artificial intelligence workflow inside PersonaIQ.
Artificial intelligence is the core product.
The objective is not simply to call AI APIs.
The objective is to combine multiple AI systems into one intelligent decision-making pipeline capable of producing personalized, explainable Presence Plans.

---

# AI Philosophy
PersonaIQ never relies on one model.
Instead, PersonaIQ orchestrates specialized intelligence.
Each model performs one responsibility exceptionally well.
The platform combines those outputs into one final recommendation.

---

# AI Principles

## Principle 1
Use the best model for each task. Never force one model to solve every problem.

## Principle 2
AI must be explainable. Every recommendation must include reasoning.

## Principle 3
Confidence over certainty. AI provides recommendations. Never guarantees.

## Principle 4
Models never communicate directly with users. All responses pass through PersonaIQ's orchestration layer.

## Principle 5
External AI providers remain replaceable. Changing Gemini to Claude or OpenAI should require only adapter changes.

---

# AI Architecture

```text
                User
                  │
                  ▼
        Journey Context Engine
                  │
                  ▼
         AI Orchestration Layer
                  │
     ┌────────────┼────────────┐
     ▼            ▼            ▼
 YouCam      YouCam VTO     Gemini
 Skin AI                   Reasoning
     │            │            │
     └────────────┼────────────┘
                  ▼
        Presence Intelligence Engine
                  │
                  ▼
       Recommendation Engine
                  │
                  ▼
       Explainability Engine
                  │
                  ▼
          Presence Plan™
```

---

# AI Pipeline
Stage 1: Journey Context ↓ Stage 2: Skin Intelligence ↓ Stage 3: Outfit Intelligence ↓ Stage 4: Context Intelligence ↓ Stage 5: Presence Intelligence ↓ Stage 6: Recommendation Generation ↓ Stage 7: Explainability ↓ Stage 8: Presence Plan

---

# AI Modules
PersonaIQ contains seven independent AI modules.
1. Journey Context Engine
2. Skin Intelligence Engine
3. Outfit Intelligence Engine
4. Presence Intelligence Engine
5. Recommendation Engine
6. Explainability Engine
7. Export Intelligence Engine

---

# Journey Context Engine
**Purpose:** Understand why the user is preparing.
**Inputs:** Event, Industry, Dress Code, Location, Time, Importance
**Outputs:** Structured Event Profile
```json
{
  "event":"Software Engineering Interview",
  "industry":"Technology",
  "dressCode":"Business Casual",
  "importance":"High"
}
```
**Responsibilities:** Normalize user input, Determine expected appearance standards, Generate context embeddings, Provide downstream AI context.

---

# Skin Intelligence Engine
**Provider:** YouCam Skin AI
**Responsibilities:** Analyze: Skin texture, Hydration, Oil balance, Dark circles, Redness, Acne, Pores, Brightness, Healthy appearance.
**Outputs:** Structured JSON only. Never expose raw provider response.
```json
{
  "overallScore":91,
  "hydration":"Excellent",
  "fatigue":"Low",
  "recommendations":[]
}
```

---

# Outfit Intelligence Engine
**Provider:** YouCam Apparel VTO
**Responsibilities:** Generate realistic outfit previews, Compare outfits, Rank suitability, Estimate event alignment.
**Outputs:** Virtual Try-On Images, Outfit Rankings, Confidence Scores, Style Metadata.

---

# Presence Intelligence Engine
*This is PersonaIQ's proprietary reasoning layer.*
**Inputs:** Journey Context + Skin Analysis + Outfit Rankings ↓
**Produces:** Presence Score, Confidence Score, Preparation Score, Professional Impression Score.
**Responsibilities:** Merge every AI result, Weight each factor, Calculate holistic readiness. No external provider performs this.

---

# Presence Index™
The Presence Index is PersonaIQ's primary metric.
**Range:** 0 ↓ 100
**Categories:** Appearance, Style, Event Alignment, Professional Readiness, Preparation (Each category contributes independently).
*Example:* Appearance 22, Style 18, Preparation 20, Context 18, Professional Match 19, Total 97.

---

# Recommendation Engine
**Provider:** Gemini
**Purpose:** Transform structured AI data into human-centered recommendations.
**Inputs:** Journey Profile, Skin Analysis, Outfit Analysis, Presence Score, Prompt Template.
**Outputs:** Prioritized Recommendations, Checklist, Summary, Confidence, Estimated Impact.
**Prompt Structure:** System Prompt ↓ PersonaIQ Instructions ↓ Journey Context ↓ Skin Analysis ↓ Outfit Analysis ↓ Presence Metrics ↓ Generate Recommendations.

---

# Explainability Engine
**Purpose:** Increase trust. Every recommendation must answer: What? Why? Expected Benefit? Confidence? Estimated Effort?
*Example:* 
- **Recommendation:** Steam blazer
- **Reason:** Wrinkles reduce perceived professionalism.
- **Impact:** High
- **Effort:** Five minutes
- **Confidence:** 95%

---

# Confidence Engine
Every AI output receives confidence metadata.
*Example:* Confidence 96%, Reason: High-quality image, Good lighting, High model certainty.
Never fabricate confidence. Only derive from: Image quality, Provider confidence, Context completeness, Historical validation.

---

# Prompt Orchestration
Prompt generation follows strict order:
System Rules ↓ PersonaIQ Personality ↓ Journey Context ↓ Skin Results ↓ Outfit Results ↓ Desired Output Format ↓ Safety Constraints ↓ JSON Schema
*No prompt contains unnecessary conversational text.*

---

# AI Adapters
Each external provider uses adapters.
Interface: `SkinProvider` ↓ `YouCamAdapter`
Interface: `LLMProvider` ↓ `GeminiAdapter`
Future: `ClaudeAdapter`, `OpenAIAdapter`
*This prevents vendor lock-in.*

---

# Error Handling
Every provider failure is isolated.
- *Example (YouCam unavailable):* Retry ↓ Fallback ↓ Friendly error ↓ Continue when possible.
- *Example (Gemini unavailable):* Retry ↓ Cached prompt ↓ Graceful degradation.

---

# Future AI Modules
Hair Analysis, Accessory Recommendation, Voice Coaching, Facial Expression Coaching, Body Language Analysis, Live Camera Mode, Interview Simulation, Presence Memory, Calendar Intelligence, Wardrobe Intelligence, Enterprise Coaching.

---

# AI Success Metrics
Recommendation acceptance rate, Journey completion rate, Average Presence Index improvement, Processing time, AI response latency, User satisfaction, Retry rate, Model failure rate.

---

# Definition of Done
✓ Multi-stage AI pipeline  
✓ AI orchestration layer  
✓ Provider abstraction  
✓ Presence Intelligence Engine  
✓ Presence Index™  
✓ Recommendation Engine  
✓ Explainability Engine  
✓ Confidence Engine  
✓ Future model extensibility  
✓ Production-ready AI architecture
