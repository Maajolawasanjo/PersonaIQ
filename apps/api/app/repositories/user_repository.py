from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.user import RefreshToken, User, UserPreference


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: UUID) -> Optional[User]:
        query = (
            select(User)
            .options(selectinload(User.preference))
            .where(User.id == user_id, User.deleted_at.is_(None))
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        query = (
            select(User)
            .options(selectinload(User.preference))
            .where(User.email == email.lower(), User.deleted_at.is_(None))
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def create(
        self,
        email: str,
        hashed_password: str,
        first_name: str,
        last_name: str,
    ) -> User:
        user = User(
            email=email.lower(),
            hashed_password=hashed_password,
            first_name=first_name,
            last_name=last_name,
        )
        self.db.add(user)
        await self.db.flush()

        preference = UserPreference(user_id=user.id)
        self.db.add(preference)
        await self.db.flush()

        user.preference = preference
        return user

    async def increment_failed_logins(self, user: User, max_attempts: int = 5) -> None:
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= max_attempts:
            user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)
        await self.db.flush()

    async def reset_failed_logins(self, user: User) -> None:
        user.failed_login_attempts = 0
        user.locked_until = None
        await self.db.flush()

    async def create_refresh_token(
        self, user_id: UUID, token_hash: str, expires_at: datetime
    ) -> RefreshToken:
        token_entry = RefreshToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
        )
        self.db.add(token_entry)
        await self.db.flush()
        return token_entry

    async def get_refresh_token(self, token_hash: str) -> Optional[RefreshToken]:
        query = (
            select(RefreshToken)
            .options(selectinload(RefreshToken.user).selectinload(User.preference))
            .where(
                RefreshToken.token_hash == token_hash,
                RefreshToken.revoked.is_(False),
            )
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def revoke_refresh_token(self, token_hash: str) -> None:
        stmt = (
            update(RefreshToken)
            .where(RefreshToken.token_hash == token_hash)
            .values(revoked=True)
        )
        await self.db.execute(stmt)

    async def revoke_all_user_tokens(self, user_id: UUID) -> None:
        stmt = (
            update(RefreshToken)
            .where(RefreshToken.user_id == user_id)
            .values(revoked=True)
        )
        await self.db.execute(stmt)
