from datetime import datetime, timezone
from typing import Any, Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class ResponseMeta(BaseModel):
    request_id: str = Field(..., description="Unique request tracing ID")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO 8601 UTC timestamp",
    )


class ErrorDetail(BaseModel):
    code: str = Field(..., description="Standardized error code from catalog")
    message: str = Field(..., description="Human-readable error description")
    details: Optional[Any] = Field(default=None, description="Optional debug or validation context")


class StandardResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = Field(default="Operation completed successfully.")
    data: Optional[T] = Field(default=None)
    meta: ResponseMeta


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail
    meta: ResponseMeta


class PaginationMeta(BaseModel):
    page: int = Field(..., description="Current page number (1-indexed)")
    page_size: int = Field(..., description="Items per page")
    total_items: int = Field(..., description="Total items matching filter")
    total_pages: int = Field(..., description="Total number of available pages")


class PaginatedResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = Field(default="Operation completed successfully.")
    data: List[T] = Field(default_factory=list)
    pagination: PaginationMeta
    meta: ResponseMeta
