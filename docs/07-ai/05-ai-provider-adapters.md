# PersonaIQ

# AI Provider Adapters

Document ID
PIQ-AI-005

Version
1.0

Status
Production Architecture

Owner
AI Engineering

Classification
AI Integration Layer

---

# Overview

The AI Provider Adapter Layer isolates PersonaIQ from every external AI provider.

No service, controller, workflow, or frontend component is allowed to communicate directly with Gemini, YouCam, or any future AI provider.

Instead, all communication passes through standardized provider adapters.

This architecture guarantees:
- Provider independence
- Easier upgrades
- Better testing
- Graceful fallback
- Vendor flexibility

---

# Design Philosophy

PersonaIQ owns the business logic.

Providers supply intelligence.

Providers are interchangeable.

The application must never depend on provider-specific implementations.

---

# High-Level Architecture

```text
Persona Engine™
↓
AI Service
↓
Provider Interface
↓
Provider Adapter
↓
External AI Provider
↓
Normalized DTO
↓
Persona Engine™
```

Only the adapter knows how to communicate with an external provider.

---

# Provider Registry

Current Providers
• YouCam API
• Google Gemini

Future Providers
• Claude
• OpenAI GPT
• Azure OpenAI
• Meta Llama
• Amazon Bedrock
• Stability AI
• ElevenLabs
• Runway
• Replicate

Adding a provider must not require changing the Persona Engine.

---

# Provider Categories

## Computer Vision

Examples
YouCam

Future
Azure Vision
AWS Rekognition
Google Vision

---

## Large Language Models

Gemini
Claude
OpenAI
Llama

---

## Image Generation

Future
Imagen
Flux
Stable Diffusion
Ideogram

---

## Speech

Future
ElevenLabs
Whisper
Azure Speech

---

# Directory Structure

```
packages/
  ai-core/
    providers/
      base/
      gemini/
      youcam/
      factory/
      registry/
      interfaces/
      schemas/
      tests/
```

---

# Provider Interface

Every provider must implement a common contract.

Example

```typescript
interface AIProvider {
  initialize()
  healthCheck()
  execute()
  validate()
  normalize()
  shutdown()
}
```

PersonaIQ communicates only with this interface.

---

# YouCam Adapter

Responsibilities
- Authenticate
- Upload Images
- Start Analysis
- Poll Results
- Normalize Responses
- Handle Errors
- Return DTOs

No business logic belongs here.

---

# YouCam MCP Integration

Primary Integration Method
Model Context Protocol (MCP)

Benefits
- No manual REST boilerplate
- Automatic authentication
- Automatic polling
- Simplified request formatting
- Native support inside AI coding tools

Supports
- Skin Analysis
- Apparel Virtual Try-On
- Face Detection
- Background Removal
- Image Enhancement
- Other YouCam APIs

Development Strategy
During development, PersonaIQ uses the official MCP integration where appropriate to reduce implementation complexity and accelerate delivery.

Production deployments remain compatible with the standard REST API through the same adapter interface.

This allows development convenience without vendor lock-in.

---

# Gemini Adapter

Responsibilities
- Prompt Execution
- JSON Mode
- Schema Validation
- Retry Logic
- Safety Filtering
- Token Accounting
- Output Normalization

---

# Provider Factory

```text
Persona Engine
↓
Provider Factory
↓
Gemini
Claude
OpenAI
```

Selection can be based on:
- Configuration
- Environment
- Feature Flag
- Fallback Rules

---

# Provider Registry

Stores:
- Provider Name
- Version
- Capabilities
- Health
- Supported Models
- Rate Limits
- Priority

Example

```yaml
provider:
  gemini
model:
  gemini-2.5-pro
supports_json:
  true
supports_streaming:
  true
priority:
  high
```

---

# Capability Matrix

Each provider advertises capabilities.

Example

```yaml
Skin Analysis: ✓
Virtual Try-On: ✓
Structured JSON: ✓
Streaming: ✓
Image Input: ✓
Tool Calling: ✓
```

The Persona Engine chooses providers based on capability, not brand.

---

# Normalization Layer

Every provider returns different formats.

PersonaIQ converts them into internal DTOs.

Example

```text
Provider Response
↓
Provider Adapter
↓
Normalizer
↓
Internal DTO
↓
Persona Engine
```

No downstream service consumes provider-specific JSON.

---

# Error Translation

Provider errors are mapped into standard application errors.

Examples
Timeout ↓ PROVIDER_TIMEOUT
Rate Limit ↓ PROVIDER_RATE_LIMIT
Invalid Image ↓ IMAGE_VALIDATION_ERROR
Authentication ↓ PROVIDER_AUTH_ERROR
Internal Failure ↓ PROVIDER_FAILURE

The rest of the application never sees provider-specific error codes.

---

# Retry Strategy

Retryable:
- Network Timeout
- 429 Too Many Requests
- Temporary Provider Failure
- Gateway Timeout

Not Retryable:
- Authentication Error
- Malformed Request
- Unsupported File

Retry Policy:
- 3 attempts
- Exponential Backoff
- Circuit Breaker enabled

---

# Circuit Breaker

If a provider repeatedly fails:

```text
Failure
↓
Failure
↓
Failure
↓
Circuit Opens
↓
Requests Redirected
↓
Health Check
↓
Recovery
↓
Circuit Closes
```

This prevents cascading failures.

---

# Health Monitoring

Every provider exposes:
- Latency
- Availability
- Success Rate
- Failure Rate
- Average Tokens
- Average Cost
- Last Health Check

Used by monitoring dashboards.

---

# Provider Selection

Selection Priority:
1. Required Capability
2. Availability
3. Latency
4. Cost
5. Configuration

This makes provider replacement automatic.

---

# Token & Cost Tracking

Every request records:
- Provider
- Model
- Tokens In
- Tokens Out
- Estimated Cost
- Execution Time
- Request ID

Useful for analytics and budgeting.

---

# Security

Provider adapters:
- Never expose API keys
- Never log secrets
- Validate inputs
- Validate outputs
- Use TLS
- Rotate credentials
- Support secret managers

---

# Testing Strategy

Mock Provider
↓
Integration Tests
↓
Contract Tests
↓
Real Provider Tests
↓
Performance Tests

Adapters are tested independently from business logic.

---

# Future Multi-Provider Mode

PersonaIQ may execute multiple providers simultaneously.

Example

```text
Journey
↓
Gemini
↓
Claude
↓
Consensus Engine
↓
Final Recommendation
```

This enables higher reliability and confidence.

---

# Architectural Rules

✓ Business logic never calls providers directly
✓ Every provider implements the same interface
✓ Responses are normalized
✓ Errors are standardized
✓ Providers remain replaceable
✓ MCP supported for development
✓ REST supported for production
✓ Cost tracking enabled
✓ Health monitoring mandatory
✓ Circuit breaker required

---

# Future Expansion

Support
- Azure OpenAI
- Anthropic Claude
- OpenAI GPT
- Llama
- Vision APIs
- Speech APIs
- Video APIs
- Real-Time APIs
- Enterprise AI Gateways
- Private LLM Deployments

No architectural changes required.

---

# Definition of Done

✓ Provider abstraction complete
✓ Standard interface defined
✓ Adapter pattern implemented
✓ Normalization strategy documented
✓ Error translation defined
✓ Retry strategy specified
✓ MCP integration documented
✓ Health monitoring designed
✓ Cost tracking supported
✓ Enterprise-ready provider architecture complete

---

# Architecture Enhancement: Consensus Engine

In a future release, PersonaIQ could introduce a **Consensus Engine**. Rather than relying on a single LLM for high-value recommendations, the platform could query multiple providers (for example, Gemini and Claude), compare their structured outputs, and synthesize a final recommendation. This approach would increase robustness, reduce provider-specific bias, and produce a more reliable Presence Plan™ while preserving the same adapter architecture defined here. Because of this strong provider abstraction, this evolution can be added without modifying the existing business logic.
