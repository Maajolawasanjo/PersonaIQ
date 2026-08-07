from uuid import UUID
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.errors import AppException, ErrorCode
from app.core.security import decode_token
from app.models.user import User
from app.repositories.user_repository import UserRepository

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    token = credentials.credentials
    payload = decode_token(token)

    if payload.get("type") != "access":
        raise AppException(
            code=ErrorCode.AUTH_002,
            message="Invalid access token.",
            status_code=401,
        )

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise AppException(
            code=ErrorCode.AUTH_002,
            message="Token payload invalid.",
            status_code=401,
        )

    try:
        user_id = UUID(user_id_str)
    except ValueError:
        raise AppException(
            code=ErrorCode.AUTH_002,
            message="Invalid user ID in token.",
            status_code=401,
        )

    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)

    if not user:
        raise AppException(
            code=ErrorCode.USER_001,
            message="User account not found or deactivated.",
            status_code=401,
        )

    if not user.is_active:
        raise AppException(
            code=ErrorCode.AUTH_004,
            message="User account has been deactivated.",
            status_code=403,
        )

    return user
