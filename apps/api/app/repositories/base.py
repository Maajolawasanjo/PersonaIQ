from typing import Generic, TypeVar, Type, Optional, List, Any, Dict
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.exc import SQLAlchemyError
from app.models.base import BaseModel

T = TypeVar("T", bound=BaseModel)

class BaseRepository(Generic[T]):
    """
    Async Base Repository handling standard CRUD operations, filtering,
    pagination, soft-delete support, and database transaction boundaries.
    """

    def __init__(self, model: Type[T], db: AsyncSession):
        self.model = model
        self.db = db

    async def get_by_id(self, id: UUID) -> Optional[T]:
        """Fetch entity by UUID primary key."""
        result = await self.db.execute(select(self.model).where(self.model.id == id))
        return result.scalars().first()

    async def list_all(
        self,
        skip: int = 0,
        limit: int = 50,
        filters: Optional[Dict[str, Any]] = None,
        order_by: Optional[Any] = None
    ) -> List[T]:
        """List entities with optional filters, pagination, and sorting."""
        query = select(self.model)
        
        if filters:
            for key, val in filters.items():
                if hasattr(self.model, key) and val is not None:
                    query = query.where(getattr(self.model, key) == val)
                    
        if order_by is not None:
            query = query.order_by(order_by)
            
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def count(self, filters: Optional[Dict[str, Any]] = None) -> int:
        """Count total matching records."""
        query = select(func.count()).select_from(self.model)
        if filters:
            for key, val in filters.items():
                if hasattr(self.model, key) and val is not None:
                    query = query.where(getattr(self.model, key) == val)
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def create(self, *args: Any, **kwargs: Any) -> T:
        """Add new entity instance or create from kwargs."""
        try:
            if len(args) == 1 and isinstance(args[0], self.model):
                entity = args[0]
            else:
                entity = self.model(**kwargs)
                
            self.db.add(entity)
            await self.db.flush()
            return entity
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e

    async def update(self, id: UUID, update_data: Dict[str, Any]) -> Optional[T]:
        """Update existing entity by ID."""
        entity = await self.get_by_id(id)
        if not entity:
            return None
            
        try:
            for key, value in update_data.items():
                if hasattr(entity, key) and value is not None:
                    setattr(entity, key, value)
            await self.db.flush()
            return entity
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e

    async def delete(self, id: UUID) -> bool:
        """Hard delete entity by ID."""
        entity = await self.get_by_id(id)
        if not entity:
            return False
            
        try:
            await self.db.delete(entity)
            await self.db.flush()
            return True
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e

    async def commit(self):
        """Commit transaction boundary."""
        await self.db.commit()

    async def rollback(self):
        """Rollback current transaction."""
        await self.db.rollback()
