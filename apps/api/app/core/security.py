import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from app.core.config import settings
from app.core.errors import AppException, ErrorCode

ph = PasswordHasher()


def hash_password(password: str) -> str:
    """Hash password using Argon2id."""
    return ph.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password against Argon2id hash."""
    try:
        return ph.verify(hashed_password, password)
    except VerifyMismatchError:
        return False
    except Exception:
        return False


def hash_token(token: str) -> str:
    """Hash refresh token for database lookup (SHA-256)."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token with subject (user_id)."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode: Dict[str, Any] = {
        "sub": str(subject),
        "type": "access",
        "exp": int(expire.timestamp()),
        "iat": int(datetime.now(timezone.utc).timestamp()),
    }

    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(subject: str) -> str:
    """Create JWT refresh token with unique jti identifier."""
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    to_encode: Dict[str, Any] = {
        "sub": str(subject),
        "type": "refresh",
        "exp": int(expire.timestamp()),
        "iat": int(datetime.now(timezone.utc).timestamp()),
        "jti": secrets.token_hex(16),
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Dict[str, Any]:
    """Decode and verify JWT token."""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise AppException(
            code=ErrorCode.AUTH_002,
            message="Token has expired.",
            status_code=401,
        )
    except jwt.InvalidTokenError:
        raise AppException(
            code=ErrorCode.AUTH_002,
            message="Invalid authentication token.",
            status_code=401,
        )
