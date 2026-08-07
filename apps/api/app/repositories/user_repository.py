from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update as sql_update
from sqlalchemy.orm import selectinload
from app.models.user import User, RefreshToken
from app.repositories.base import BaseRepository

class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    async def get_by_id(self, id: UUID) -> Optional[User]:
        result = await self.db.execute(
            select(User).options(selectinload(User.preference)).where(User.id == id)
        )
        return result.scalars().first()

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(
            select(User).options(selectinload(User.preference)).where(User.email == email.lower().strip())
        )
        return result.scalars().first()

    async def get_by_reset_token(self, token: str) -> Optional[User]:
        result = await self.db.execute(
            select(User).options(selectinload(User.preference)).where(User.reset_token == token)
        )
        return result.scalars().first()

    async def update_profile(self, user_id: UUID, profile_data: dict) -> Optional[User]:
        return await self.update(user_id, profile_data)

    async def create_refresh_token(self, user_id: UUID, token_hash: str, expires_at: datetime) -> RefreshToken:
        token = RefreshToken(user_id=user_id, token_hash=token_hash, expires_at=expires_at)
        self.db.add(token)
        await self.db.flush()
        return token

    async def get_refresh_token(self, token_hash: str) -> Optional[RefreshToken]:
        result = await self.db.execute(
            select(RefreshToken).where(RefreshToken.token_hash == token_hash, RefreshToken.revoked == False)
        )
        return result.scalars().first()

    async def revoke_refresh_token(self, token_hash: str) -> None:
        await self.db.execute(
            sql_update(RefreshToken)
            .where(RefreshToken.token_hash == token_hash)
            .values(revoked=True)
        )
        await self.db.flush()

    async def revoke_all_user_tokens(self, user_id: UUID) -> None:
        await self.db.execute(
            sql_update(RefreshToken)
            .where(RefreshToken.user_id == user_id)
            .values(revoked=True)
        )
        await self.db.flush()

    async def increment_failed_logins(self, user: User) -> None:
        user.failed_login_attempts += 1
        await self.db.flush()

    async def reset_failed_logins(self, user: User) -> None:
        user.failed_login_attempts = 0
        user.locked_until = None
        await self.db.flush()

    async def update_user_preference(self, user_id: UUID, pref_data: dict) -> UserPreference:
        from app.models.user import UserPreference
        result = await self.db.execute(
            select(UserPreference).where(UserPreference.user_id == user_id)
        )
        pref = result.scalars().first()
        if not pref:
            pref = UserPreference(user_id=user_id, **pref_data)
            self.db.add(pref)
        else:
            for k, v in pref_data.items():
                if v is not None:
                    setattr(pref, k, v)
        await self.db.flush()
        return pref

    async def hard_delete_user_data(self, user_id: UUID) -> None:
        """Completely purges all data associated with a user for privacy & GDPR compliance."""
        from sqlalchemy import delete as sql_delete
        from app.models.user import RefreshToken, UserPreference

        # Delete Refresh Tokens
        await self.db.execute(sql_delete(RefreshToken).where(RefreshToken.user_id == user_id))
        # Delete User Preferences
        await self.db.execute(sql_delete(UserPreference).where(UserPreference.user_id == user_id))
        # Delete User Record
        await self.db.execute(sql_delete(User).where(User.id == user_id))
        await self.db.flush()


