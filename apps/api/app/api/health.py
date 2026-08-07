from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, status
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.database import get_db
from app.dto.common import StandardResponse, ResponseMeta

router = APIRouter(tags=["Health & Telemetry"])


class SystemStatusData(BaseModel):
    app_name: str = Field(default=settings.APP_NAME)
    environment: str = Field(default=settings.ENVIRONMENT)
    database_connected: bool
    version: str = Field(default="1.0.0")
    feature_flags: dict = Field(
        default_factory=lambda: {
            "youcam_vto": settings.ENABLE_YOUCAM_VTO,
            "skin_analysis": settings.ENABLE_SKIN_ANALYSIS,
            "pdf_export": settings.ENABLE_PDF_EXPORT,
            "email_notifications": settings.ENABLE_EMAIL_NOTIFICATIONS,
        }
    )


@router.get(
    "/health",
    response_model=StandardResponse[SystemStatusData],
    status_code=status.HTTP_200_OK,
    summary="System Health & Readiness Endpoint",
)
async def health_check(request: Request, db: AsyncSession = Depends(get_db)):
    request_id = getattr(request.state, "request_id", "req_health")
    db_connected = False

    try:
        result = await db.execute(text("SELECT 1"))
        if result.scalar() == 1:
            db_connected = True
    except Exception:
        db_connected = False

    meta = ResponseMeta(request_id=request_id, timestamp=datetime.now(timezone.utc).isoformat())

    data = SystemStatusData(database_connected=db_connected)

    return StandardResponse(
        success=True,
        message="System health check completed.",
        data=data,
        meta=meta,
    )
