from enum import Enum
from typing import Any, Dict, Optional


class ErrorCode(str, Enum):
    # Authentication & Security
    AUTH_001 = "AUTH_001"  # Invalid email or password
    AUTH_002 = "AUTH_002"  # Token expired or invalid
    AUTH_003 = "AUTH_003"  # Account locked due to failed attempts
    AUTH_004 = "AUTH_004"  # Insufficient permissions

    # User Profile
    USER_001 = "USER_001"  # User not found
    USER_002 = "USER_002"  # Email already registered

    # Journey & Event
    JOURNEY_001 = "JOURNEY_001"  # Journey not found
    JOURNEY_002 = "JOURNEY_002"  # Invalid state transition
    JOURNEY_003 = "JOURNEY_003"  # Journey step validation failed

    # Uploads & Media
    UPLOAD_001 = "UPLOAD_001"  # Unsupported file format
    UPLOAD_002 = "UPLOAD_002"  # File size exceeds limit
    UPLOAD_003 = "UPLOAD_003"  # Face detection failed in image

    # AI Gateway
    AI_001 = "AI_001"  # Skin analysis provider unavailable
    AI_002 = "AI_002"  # Virtual Try-On generation failed
    AI_003 = "AI_003"  # LLM recommendation engine timeout
    AI_004 = "AI_004"  # Rate limit exceeded for AI provider

    # System
    SYS_001 = "SYS_001"  # Internal server error
    SYS_002 = "SYS_002"  # Service unavailable
    SYS_003 = "SYS_003"  # Validation error


class AppException(Exception):
    def __init__(
        self,
        code: ErrorCode,
        message: str,
        status_code: int = 400,
        details: Optional[Dict[str, Any]] = None,
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)
